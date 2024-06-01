import axios from "axios";
import { MessageModel } from "../models/MessageModel";
import { APIConstants } from "../configs/dotenv-config";

export class ChatGPTService {
  static systemPrompt = new MessageModel(undefined, APIConstants.SYSTEM_PROMPT(), new Date(), true);

  static async sendMessage(conversationHistory: MessageModel[]): Promise<MessageModel[]> {
    try {
      const response = await axios.post(
        `${APIConstants.BASE_URL()}/chat/completions`,
        {
          model: APIConstants.MODEL_ID(),
          messages: [
            this.systemPrompt.toJSON(),
            ...conversationHistory.map((m) => MessageModel.fromPlainObject(m).toJSON()),
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${APIConstants.ChatGPTApiKey()}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.choices.map((choice: any) => MessageModel.fromJSON(choice));
    } catch (error) {
      throw error;
    }
  }
}

export const chatGPTService = new ChatGPTService();
