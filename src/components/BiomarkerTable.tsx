import React, { useState, useEffect } from "react";
import { BiomarkerModel } from "../types/BiomarkerTypes";
import config from "../conf.json";

// Typescript stuff //

type BiomarkerTableProps = {
  biomarker_id: string;
};

// Component //

const BiomarkerTable = ({ biomarker_id }: BiomarkerTableProps) => {
  const [biomarker, setBiomarker] = useState<BiomarkerModel | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (biomarker_id) {
        try {
          const response = await fetch(`${config.api_root}${biomarker_id}`);
          const data: BiomarkerModel = await response.json();
          setBiomarker(data);
        } catch (error) {
          console.error("Error fetching biomarker data: ", error);
        }
      }
    };
    fetchData();
  }, [biomarker_id]);

  if (!biomarker) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Results for Biomarker ID: {biomarker_id}</h1>
      <br />
      <h3>Biomarker ID</h3>
      <br />
      <div>{biomarker.biomarker_id}</div>
    </div>
  );
};

export default BiomarkerTable;
