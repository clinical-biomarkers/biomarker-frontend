import React from "react";
import config from "../conf.json";
import './TopBar.css';

const TopBar = () => {
  return (
    <div className="top-bar">
      <div className="top-bar-content">
        <div className="project">Biomarker-Partnership Portal</div>
        <nav className="navigation">
          <a href={config["top-bar"].home} className="nav-link">Home</a>
          <a href={config["top-bar"].project} className="nav-link">Project Page</a>
          <a href={config["top-bar"].data} className="nav-link">Data</a>
          <a href={config["top-bar"].api} className="nav-link">API</a>
        </nav>
      </div>
    </div>
  );
};

export default TopBar;
