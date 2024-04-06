import React, { useState, useEffect } from "react";
import "./LanguageDropdown.css";
import { getCrudApi } from "../webServices/webServices";

const LanguageDropdown = ({ onSelectLanguage }) => {
  const [languageCodes, setLanguageCodes] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    getAllLangs();
  }, []);
  const getAllLangs = async () => {
    await getCrudApi("api/v1/lang", {}).then((data) => {
      setLanguageCodes(data.filter((e) => e.isActive === 1));
    });
  };

  const handleChange = (event) => {
    const selectedLanguage = event.target.value;
    setSelectedLanguage(selectedLanguage);
    onSelectLanguage(selectedLanguage);
  };

  return (
    <div className="language-dropdown">
      <select
        className="lang-dd-select"
        value={selectedLanguage}
        onChange={handleChange}
      >
        {languageCodes.map((language) => (
          <option key={language.langName} value={language.langCode}>
            {language.langCode}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageDropdown;
