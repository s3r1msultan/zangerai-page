import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { chatService } from "../../services/ChatService";
import { MessageModel } from "../../models/MessageModel";
import { initialMessage } from "./initialMessage";
import { ChatGPTService } from "../../services/ChatGPTService";
import { RootState } from "../store";

interface ChatState {
  messages: MessageModel[];
  isLoading: boolean;
  lastChatId: string;
  isTyping: boolean;
  animatingMessages: string;
  loaded: boolean;
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  lastChatId: "",
  isTyping: false,
  animatingMessages: "",
  loaded: false,
};

// Thunk to initialize the chat
export const initializeChat = createAsyncThunk(
  "chat/initializeChat",
  async (phoneNumber: string, { dispatch, getState }) => {
    const state = getState() as RootState;
    if (state.chat.loaded) {
      return;
    }

    try {
      const lastChatId: string = await chatService.getLastChatId(phoneNumber);
      dispatch(setLastChatId(lastChatId));

      const messages: MessageModel[] = await chatService.fetchMessages(lastChatId, phoneNumber);
      dispatch(setMessages([initialMessage.toPlainObject(), ...messages.map((message) => message.toPlainObject())]));
      dispatch(setChatLoaded(true));
    } catch (error) {
      console.error("Failed to initialize chat:", error);
    }
  }
);

// Thunk to send a message
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    { chatId, phoneNumber, message }: { chatId: string; phoneNumber: string; message: MessageModel },
    { dispatch, getState }
  ) => {
    try {
      dispatch(addMessage(message.toPlainObject()));
      await chatService.addMessage(chatId, phoneNumber, message);

      const state = getState() as RootState;
      const responseMessages = await ChatGPTService.sendMessage(state.chat.messages);
      responseMessages.forEach(async (message) => {
        dispatch(startMessageAnimation(message.id));
        dispatch(addMessage(message.toPlainObject()));
        await chatService.addMessage(chatId, phoneNumber, message);
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }
);

// Thunk to create a new chat
export const createNewChat = createAsyncThunk("chat/createNewChat", async (phoneNumber: string, { dispatch }) => {
  try {
    const newChatId = await chatService.createNewChat(phoneNumber);
    dispatch(setLastChatId(newChatId));

    await chatService.addMessage(newChatId, phoneNumber, initialMessage);

    dispatch(setMessages([initialMessage.toPlainObject()]));

    await chatService.saveLastChatId(newChatId, phoneNumber);
  } catch (error) {
    console.error("Failed to create new chat:", error);
  }
});

export const deleteMessages = createAsyncThunk("chat/deleteMessages", async (_, { dispatch, getState }) => {
  try {
    dispatch(setChatLoaded(false));
    dispatch(setMessages([]));

    const state = getState() as RootState;
    const chatId = state.chat.lastChatId;
    const { phoneNumber } = state.auth.userDB!;

    await chatService.deleteMessages(chatId, phoneNumber);
    await dispatch(initializeChat(phoneNumber));
  } catch (error) {
    console.error("Failed to delete messages:", error);
  }
});

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages(state, action) {
      state.messages = action.payload;
    },
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    setLastChatId(state, action) {
      state.lastChatId = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setTyping(state, action) {
      state.isTyping = action.payload;
    },
    startMessageAnimation(state, action: PayloadAction<string>) {
      state.animatingMessages = action.payload;
    },
    stopMessageAnimation(state, action) {
      state.animatingMessages = "";
    },
    setChatLoaded(state, action: PayloadAction<boolean>) {
      state.loaded = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeChat.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeChat.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(initializeChat.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(sendMessage.pending, (state) => {
        state.isTyping = true;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.isTyping = false;
      })
      .addCase(sendMessage.rejected, (state) => {
        state.isTyping = false;
      })
      .addCase(createNewChat.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewChat.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createNewChat.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setMessages,
  addMessage,
  setLastChatId,
  setLoading,
  setTyping,
  startMessageAnimation,
  stopMessageAnimation,
  setChatLoaded,
} = chatSlice.actions;

export default chatSlice.reducer;
