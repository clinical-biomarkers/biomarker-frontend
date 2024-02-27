import React, { useState, useEffect } from "react";
import { BiomarkerModel } from "../types/BiomarkerTypes";
import config from "../conf.json";
import BiomarkerComponentTable from "./BiomarkerComponentTable";
import Collapsible from "./Collapsible";
import SingleField from "./SingleField";
import './BiomarkerTable.css';
import loading from '../artifacts/loading.gif'

// Typescript stuff //

type BiomarkerTableProps = {
  biomarker_id: string;
};

// Component //

const BiomarkerTable = ({ biomarker_id }: BiomarkerTableProps) => {
  const [biomarker, setBiomarker] = useState<BiomarkerModel | null>(null);
  const [results, setResults] = useState<number>(0);
  const status: string = "Reviewed" 

  useEffect(() => {
    const fetchData = async () => {
      if (biomarker_id) {
        try {
          setResults(0);
          const response = await fetch(`${config.api_root}${biomarker_id}`);
          if (response.ok) {
            const data: BiomarkerModel = await response.json();
            setBiomarker(data);
            setResults(1);
          }
        } catch (error) {
          console.error("Error fetching biomarker data: ", error);
        }
      }
    };
    fetchData();
  }, [biomarker_id]);

  if (!biomarker) {
    return (
      <div className="loading-container">
        <img src={loading} alt="Loading..."/>
      </div>
    )
  }

  return (
    <div className="results-container">
        <h1 id="top-header">{biomarker.biomarker_id} Results</h1>
        <div id="header-label">Results: {results}</div>
      <Collapsible title='Test'>
        <SingleField title="Biomarker ID" value={biomarker.biomarker_id}/>
        <SingleField title="Status" value={status}/>
        <BiomarkerComponentTable biomarker={biomarker} status={status}/>
      </Collapsible>
    </div>
  );
};

export default BiomarkerTable;
