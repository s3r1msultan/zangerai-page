import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { firestore } from "../configs/firebase-config";
import { LawCompanyModel } from "../models/LawCompanyModel";

export class LawCompaniesService {
  private firestore = firestore;
  private lawCompaniesRef = collection(this.firestore, "law_firms");
  async getLawCompanies(): Promise<LawCompanyModel[]> {
    const lawCompaniesSnapshot = query(this.lawCompaniesRef, orderBy("added_at", "asc"));
    const querySnapshot = await getDocs(lawCompaniesSnapshot);
    return querySnapshot.docs.map((doc) => LawCompanyModel.fromFirestore(doc));
  }
}
