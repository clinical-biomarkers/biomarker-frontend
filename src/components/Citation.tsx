import React from "react";
import { Citation } from "../types/BiomarkerTypes";
import SingleField from "./SingleField";
import Collapsible from "./Collapsible";

// Typescript stuff //

type CitationTableProps = {
  citations: Citation[];
};

// Component //

const CitationTable = ({ citations }: CitationTableProps) => {
  return (
    <div>
      {citations.map((citation, index) => (
        <div></div>
      ))}
    </div>
  );
};

export default CitationTable;
