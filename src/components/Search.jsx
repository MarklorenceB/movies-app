import React from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search for movies..."
        value={searchTerm} // ✅ make sure this is a string
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
    </div>
  );
};

export default Search;
