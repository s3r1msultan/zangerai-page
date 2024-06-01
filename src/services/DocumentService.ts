import { getStorage, ref, listAll, getDownloadURL, list } from "firebase/storage";
import { DocumentModel } from "../models/DocumentModel";

const storage = getStorage();

export interface DocumentSection {
  title: string;
  documents: DocumentModel[];
}

export class DocumentService {
  static fetchDocuments = async (country: string): Promise<DocumentSection[]> => {
    const documentSections: DocumentSection[] = [];
    const countryRef = ref(storage, country);

    const folderList = await listAll(countryRef);

    for (const folderRef of folderList.prefixes) {
      const folderName = folderRef.name;

      const documentsSnapshot = await listAll(folderRef);
      const documents: DocumentModel[] = [];

      for (const fileRef of documentsSnapshot.items) {
        const url = await getDownloadURL(fileRef);
        documents.push(new DocumentModel(fileRef.name, fileRef.name.replace(".pdf", ""), url, fileRef.fullPath));
      }

      documentSections.push({
        title: folderName,
        documents,
      });
    }

    return documentSections;
  };
}
