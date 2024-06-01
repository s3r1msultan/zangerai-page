// src/components/Documents/SearchComponent.tsx
import React from "react";
import "./SearchComponent.scss";
import searchIcon from "../../../assets/icons/search_icon.svg";

interface SearchComponentProps {
  searchValue: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ searchValue, onSearchChange }) => {
  return (
    <div className="search-component">
      <div className="search-input-container">
        <img src={searchIcon} alt="Search" className="search-icon" />
        <input type="text" value={searchValue} onChange={onSearchChange} placeholder="Введите название НПА" />
      </div>
    </div>
  );
};

export default SearchComponent;
