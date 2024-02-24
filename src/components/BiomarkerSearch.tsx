import React, { useState } from "react";

// Typescript stuff //

type SearchBarProps = {
  onSearch: (searchTerm: string) => void;
};

// Component //

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(input);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter Biomarker ID"
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
