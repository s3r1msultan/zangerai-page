import React from "react";
import "./DocumentSectionComponent.scss";
import DocumentCardComponent from "./DocumentCardComponent";
import { DocumentModel } from "../../../models/DocumentModel";

interface DocumentSectionComponentProps {
  title: string;
  documents: DocumentModel[];
}

const DocumentSectionComponent: React.FC<DocumentSectionComponentProps> = ({ title, documents }) => {
  return (
    <div className="document-section">
      <h2>{title}</h2>
      <div className="document-cards">
        {documents.map((doc) => (
          <DocumentCardComponent key={doc.id} document={doc} />
        ))}
      </div>
    </div>
  );
};

export default DocumentSectionComponent;
