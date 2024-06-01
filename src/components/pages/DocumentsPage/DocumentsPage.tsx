import React, { useEffect, useState } from "react";
import "./DocumentsPage.scss";
import SearchComponent from "../../layout/Documents/SearchComponent";
import DocumentSectionComponent from "../../layout/Documents/DocumentSectionComponent";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { RootState } from "../../../app/store";
import { fetchDocuments } from "../../../app/document/documentSlice";
import PageLoader from "../../layout/PageLoader/PageLoader";

const DocumentsPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useAppDispatch();
  const { documentSections, isLoading } = useAppSelector((state: RootState) => state.documents);
  const [filteredSections, setFilteredSections] = useState(documentSections);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value === "") {
      setFilteredSections(documentSections);
    } else {
      const filtered = documentSections
        .map((section) => ({
          title: section.title,
          documents: section.documents.filter((doc: { name: string }) =>
            doc.name.toLowerCase().includes(value.toLowerCase())
          ),
        }))
        .filter((section) => section.documents.length > 0);
      setFilteredSections(filtered);
    }
  };

  const country = "РК";

  useEffect(() => {
    dispatch(fetchDocuments(country)).then(() => {});
  }, [dispatch, country]);

  useEffect(() => {
    setFilteredSections(documentSections);
  }, [documentSections]);

  return (
    <div className="documents-page">
      <SearchComponent searchValue={searchValue} onSearchChange={handleSearchChange} />
      {isLoading ? (
        <PageLoader />
      ) : (
        filteredSections.map((section) => (
          <DocumentSectionComponent key={section.title} title={section.title} documents={section.documents} />
        ))
      )}
    </div>
  );
};

export default DocumentsPage;
