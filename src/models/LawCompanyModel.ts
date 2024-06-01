import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export interface LawCompanyModel {
  id: string;
  name: string;
  description: string;
  address: string;
  link2gis: string;
  phoneNumber: string;
}

export class LawCompanyModel {
  constructor(id: string, name: string, description: string, address: string, link2gis: string, phoneNumber: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.address = address;
    this.link2gis = link2gis;
    this.phoneNumber = phoneNumber;
  }

  static fromFirestore(doc: QueryDocumentSnapshot<DocumentData, DocumentData>): LawCompanyModel {
    const data = doc.data();
    return new LawCompanyModel(
      doc.id,
      data.name,
      data.description,
      data.address,
      data["link_2gis"],
      data["phone_number"]
    );
  }

  toPlainObject(): { [key: string]: any } {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      address: this.address,
      link2gis: this.link2gis,
      phoneNumber: this.phoneNumber,
    };
  }

  static fromPlainObject(obj: { [key: string]: any }): LawCompanyModel {
    return new LawCompanyModel(
      obj["id"],
      obj["name"],
      obj["description"],
      obj["address"],
      obj["link_2gis"],
      obj["phoneNumber"]
    );
  }
}
