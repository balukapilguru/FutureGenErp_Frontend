export function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

// Utils.js
export function debounceSelect(func, delay) {
  let timeoutId;

  const debounced = function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };

  // Add this to handle cleanups
  debounced.cancel = () => {
    clearTimeout(timeoutId);
  };

  return debounced;
}





export function debounceInput(callback, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}


import React, { useState } from "react";

export const NumberInput = ({ maxLength, value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState(value || "");

  const handleChange = (e) => {
    const val = e.target.value;

    // Allow only numbers and enforce maxLength
    if (/^\d*$/.test(val) && val.length <= maxLength) {
      setInputValue(val);
      if (onChange) onChange(val); // Pass the value back to parent component
    }
  };

  return (
    <input
      type="text"
      className="form-control"
      value={inputValue}
      onChange={handleChange}
      placeholder={placeholder || ""}
    />
  );
};


export const formatDateTime = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};