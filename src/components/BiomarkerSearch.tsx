import React, { useState } from "react";
import './BiomarkerSearch.css';

// Typescript stuff //

type SearchBarProps = {
  onSearch: (searchTerm: string) => void;
  initialValue?: string;
};

// Component //

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(input);
  };

  return (
    <div className="search-container">
      <label htmlFor="search-input" className="search-label">Search Biomarkers</label>
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          id="search-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Biomarker ID"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      <div className="search-example">Example: AA0001</div>
    </div>
  );
};

export default SearchBar;
