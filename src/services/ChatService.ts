import { firestore } from "../configs/firebase-config";
import { ChatModel } from "../models/ChatModel";
import { MessageModel } from "../models/MessageModel";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

class ChatService {
  private firestore = firestore;
  private usersRef = collection(this.firestore, "users");
  private userRef(phoneNumber: string) {
    return doc(this.usersRef, phoneNumber);
  }
  private userChatsRef(phoneNumber: string) {
    return collection(this.userRef(phoneNumber), "chats");
  }
  private userChatRef(chatId: string, phoneNumber: string) {
    return doc(this.userChatsRef(phoneNumber), chatId);
  }
  private userChatMessagesRef(chatId: string, phoneNumber: string) {
    return collection(this.userChatRef(chatId, phoneNumber), "messages");
  }
  async addMessage(chatId: string, phoneNumber: string, message: MessageModel) {
    await addDoc(this.userChatMessagesRef(chatId, phoneNumber), message.toFirestore());
    await this.saveLastChatId(chatId, phoneNumber);
    await updateDoc(this.userChatRef(chatId, phoneNumber), { last_message_at: serverTimestamp() });
  }
  async createNewChat(phoneNumber: string): Promise<string> {
    const newChatRef = await addDoc(this.userChatsRef(phoneNumber), this.newChatData());
    return newChatRef.id;
  }
  async fetchMessages(chatId: string, phoneNumber: string): Promise<MessageModel[]> {
    if (!chatId || !phoneNumber) {
      throw new Error("chatId and phoneNumber must be non-empty strings.");
    }

    const chatRef = await getDoc(this.userChatRef(chatId, phoneNumber));
    if (!chatRef.exists()) {
      chatId = await this.createNewChat(phoneNumber);
    }

    const messagesQuery = query(this.userChatMessagesRef(chatId, phoneNumber), orderBy("sent_at", "asc"));
    const querySnapshot = await getDocs(messagesQuery);
    return querySnapshot.docs.map((doc) => MessageModel.fromFirestore(doc));
  }
  async saveLastChatId(chatId: string, phoneNumber: string) {
    await updateDoc(this.userRef(phoneNumber), { last_chat_id: chatId });
  }
  async getLastChatId(phoneNumber: string): Promise<string> {
    try {
      const snapshot = await getDoc(this.userRef(phoneNumber));
      const data = snapshot.data() as { last_chat_id: string };
      let chatId = data.last_chat_id;
      if (!chatId) {
        chatId = await this.createNewChat(phoneNumber);
      } else {
        const chatRef = await getDoc(this.userChatRef(chatId, phoneNumber));
        if (!chatRef.exists()) {
          chatId = await this.createNewChat(phoneNumber);
        }
      }
      await this.saveLastChatId(chatId, phoneNumber);
      return chatId;
    } catch (e) {
      return await this.createNewChat(phoneNumber);
    }
  }
  private newChatData() {
    return {
      title: "Новый чат",
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
  }
  async updateChatTimestamp(chatId: string, phoneNumber: string) {
    await updateDoc(this.userChatRef(chatId, phoneNumber), {
      updated_at: serverTimestamp(),
    });
  }
  async deleteChat(chatId: string, phoneNumber: string) {
    try {
      const chatRef = this.userChatRef(chatId, phoneNumber);
      await deleteDoc(chatRef);
    } catch (e) {
      throw new Error("Failed to delete chat");
    }
  }

  async deleteMessages(chatId: string, phoneNumber: string) {
    const messagesQuery = query(this.userChatMessagesRef(chatId, phoneNumber));
    const querySnapshot = await getDocs(messagesQuery);
    querySnapshot.docs.forEach(async (doc) => {
      await deleteDoc(doc.ref);
      await this.updateChatTimestamp(chatId, phoneNumber);
    });
  }
}

export const chatService = new ChatService();
