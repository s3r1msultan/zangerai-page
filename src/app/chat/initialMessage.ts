import { MessageModel } from "../../models/MessageModel";

export const initialMessage = new MessageModel(undefined, "Здравствуйте! Чем могу помочь?", new Date(), false);
