import { DocumentData, DocumentSnapshot, Timestamp } from "firebase/firestore";

export interface UserModel {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  lastChatId: string;
  uid?: string;
}

export class UserModel {
  constructor(
    firstName: string,
    lastName: string,
    phoneNumber: string,
    createdAt: Date,
    updatedAt: Date,
    lastChatId: string,
    uid?: string
  ) {
    this.uid = uid;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.lastChatId = lastChatId;
  }

  static fromFirestore(doc: DocumentSnapshot): UserModel {
    const data = doc.data() || {};
    return new UserModel(
      data["first_name"] || "Unknown",
      data["last_name"] || "User",
      data["phone_number"] || "No Phone",
      (data["created_at"]?.toDate() || new Date()) as Date,
      (data["updated_at"]?.toDate() || new Date()) as Date,
      data["last_chat_id"] || "",
      doc.id
    );
  }

  toFirestore(): DocumentData {
    return {
      first_name: this.firstName,
      last_name: this.lastName,
      phone_number: this.phoneNumber,
      created_at: Timestamp.fromDate(this.createdAt),
      updated_at: Timestamp.fromDate(this.updatedAt),
      last_chat_id: this.lastChatId,
    };
  }

  toPlainObject(): { [key: string]: any } {
    return {
      uid: this.uid,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastChatId: this.lastChatId,
    };
  }

  fromPlainObject(obj: { [key: string]: any }): UserModel {
    return new UserModel(
      obj["uid"],
      obj["firstName"],
      obj["lastName"],
      obj["phoneNumber"],
      obj["createdAt"],
      obj["updatedAt"],
      obj["lastChatId"]
    );
  }
}
