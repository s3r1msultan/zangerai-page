import { DocumentData, DocumentSnapshot, Timestamp } from "firebase/firestore";
import { v5 } from "uuid";

export interface ChatModel {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ChatModel {
  constructor(id: string, title: string, createdAt: Date, updatedAt: Date) {
    this.id = id || v5(title, v5.URL);
    this.title = title;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromFirestore(doc: DocumentSnapshot): ChatModel {
    const data = doc.data() || {};
    return new ChatModel(
      doc.id,
      data.title || "Новый чат",
      (data.created_at?.toDate() || new Date()) as Date,
      (data.updated_at?.toDate() || new Date()) as Date
    );
  }

  toFirestore(): DocumentData {
    return {
      title: this.title,
      created_at: Timestamp.fromDate(this.createdAt),
      updated_at: Timestamp.fromDate(this.updatedAt),
    };
  }
  toPlainObject(): any {
    return {
      id: this.id,
      title: this.title,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  static fromPlainObject(obj: any): ChatModel {
    return new ChatModel(obj.id, obj.title, new Date(obj.createdAt), new Date(obj.updatedAt));
  }
}
