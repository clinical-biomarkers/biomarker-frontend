import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useParams, useNavigate } from "react-router-dom";
import "./App.css";
import SearchBar from "./components/BiomarkerSearch";
import BiomarkerTable from "./components/BiomarkerTable";
import TopBar from "./components/TopBar";

function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/biomarker-partnership/biomarkers/search/:biomarkerId" element={<App/>} />
        <Route path="/biomarker-partnership/biomarkers/" element={<App/>}/>
      </Routes>
    </Router>
  );
}

function App() {
  let navigate = useNavigate();
  let {biomarkerId: biomarkerIdFromURL} = useParams();
  const [biomarkerId, setBiomarkerId] = useState(biomarkerIdFromURL || "");

  useEffect(() => {
    if (biomarkerIdFromURL && biomarkerIdFromURL !== biomarkerId) {
      setBiomarkerId(biomarkerIdFromURL);
    }
  }, [biomarkerIdFromURL]);

  const handleSearch = (id: string) => {
    const trimmed_id = id.trim();
    if (!trimmed_id) {
      return;
    }
    setBiomarkerId(trimmed_id);
    navigate(`/biomarker-partnership/biomarkers/search/${trimmed_id}`);
  };

  return (
    <div className="App">
      <TopBar />
      <SearchBar onSearch={handleSearch} initialValue={biomarkerId} />
      {biomarkerId && <BiomarkerTable biomarker_id={biomarkerId} />}
    </div>
  );
}

export default AppWrapper;
