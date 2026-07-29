// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { debounce } from "./Utils";
import { useSearchParams } from "react-router-dom";

const SearchInputField = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const isInternalUpdate = useRef(false);

  const debouncedUpdate = useRef(
    debounce((value) => {
      isInternalUpdate.current = true;

      // Always read from the current URLSearchParams
      const updatedParams = new URLSearchParams(window.location.search);

      if (value.trim() === "") {
        updatedParams.delete("search");
      } else {
        updatedParams.set("search", value);
      }
      updatedParams.set("page", "1");

      setSearchParams(updatedParams, { replace: true });
    }, 500)
  ).current;

  // Sync state when URL changes (ignore internal updates)
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    const newSearch = searchParams.get("search") || "";
    if (newSearch !== searchTerm) {
      setSearchTerm(newSearch);
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedUpdate(value);
  };

  return (
    <input
      type="text"
      placeholder="Search"
      value={searchTerm}
      onChange={handleChange}
      className="form-control search text_color bg_input_color"
    />
  );
};

export default SearchInputField;
