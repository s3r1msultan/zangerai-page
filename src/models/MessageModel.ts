import { DocumentData, DocumentSnapshot, Timestamp } from "firebase/firestore";
import { v5 } from "uuid";

export interface MessageModel {
  id: string;
  content: string;
  sentAt: Date;
  isMine: boolean;
  isExpanded?: boolean;
}

export class MessageModel {
  constructor(id: string | undefined, content: string, sentAt: Date, isMine: boolean, isExpanded?: boolean) {
    this.id = id ?? v5(content, v5.URL);
    this.content = content;
    this.sentAt = sentAt;
    this.isMine = isMine;
    this.isExpanded = isExpanded || false;
  }

  static fromFirestore(doc: DocumentSnapshot): MessageModel {
    const data = doc.data() || {};
    return new MessageModel(
      doc.id,
      data.content || "",
      (data.sent_at?.toDate() || new Date()) as Date,
      data.is_mine || false
    );
  }

  toFirestore(): DocumentData {
    return {
      content: this.content,
      sent_at: Timestamp.fromDate(this.sentAt),
      is_mine: this.isMine,
    };
  }

  static fromJSON(json: { [key: string]: any }): MessageModel {
    return new MessageModel(undefined, json["message"]["content"], new Date(), false, true);
  }

  toJSON(): { [key: string]: any } {
    return {
      role: this.isMine ? "user" : "assistant",
      content: this.content,
    };
  }

  toPlainObject(): { [key: string]: any } {
    return {
      id: this.id,
      content: this.content,
      sentAt: this.sentAt.toISOString(),
      isMine: this.isMine,
      isExpanded: this.isExpanded,
    };
  }

  static fromPlainObject(obj: { [key: string]: any }): MessageModel {
    return new MessageModel(obj.id, obj.content, new Date(obj.sentAt), obj.isMine, obj.isExpanded);
  }
}
