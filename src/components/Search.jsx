import React from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search for movies..."
        value={searchTerm}
        onChange={setSearchTerm}
        className="search-input"
      />
    </div>
  );
};

export default Search;
