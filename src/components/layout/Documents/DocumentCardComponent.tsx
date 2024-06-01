// src/components/Documents/DocumentCardComponent.tsx
import React from "react";
import "./DocumentCardComponent.scss";
import { DocumentModel } from "../../../models/DocumentModel";

interface DocumentCardComponentProps {
  document: DocumentModel;
}

const DocumentCardComponent: React.FC<DocumentCardComponentProps> = ({ document }) => {
  return (
    <div className="document-card">
      <a href={document.url} target="_blank" rel="noopener noreferrer">
        <div className="document-card__image"></div>
      </a>
      <div className="document-card__name">{document.name}</div>
    </div>
  );
};

export default DocumentCardComponent;
