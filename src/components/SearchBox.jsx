import React from "react";
import { Search } from "lucide-react";
const SearchBox = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search..."
}) => {
  return (
   <>
      {/* Search input */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border px-3 py-2 rounded-lg w-100"
      />

      {/* Search button */}
      {/* <button
        onClick={onSearch}
        className="px-3 py-2 border rounded-lg inline-flex items-center bg-purple-500 text-white hover:bg-purple-600 transition"
      >
        <Search className="w-4 h-4" />
        Search
      </button> */}
    </>
  );
};

export default SearchBox;
