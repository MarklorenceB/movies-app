import React, { useState, useEffect } from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
  const [inputValue, setInputValue] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [inputValue, setSearchTerm]);

  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search for movies..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="search-input"
      />
    </div>
  );
};

export default Search;
