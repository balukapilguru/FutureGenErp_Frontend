import React, { createContext, useContext, useState } from "react";

const initialValues = {
  theme: "light",
  setDarkMode: () => {},
};

export const ThemeContext = createContext(initialValues);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const setDarkMode = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const value = {
    theme,
    setDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
