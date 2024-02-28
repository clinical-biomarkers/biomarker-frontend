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
      <Collapsible title="Citation Data" isNested={true} open={false}>
        {citations.map((citation, index) => (
          <div className="component-container">
            <SingleField title="Citation Title" small={true} value={citation.citation_title}/>
            <SingleField title="Journal" small={true} value={citation.journal}/>
            <SingleField title="Authors" small={true} value={citation.authors}/>
            <SingleField title="Date" small={true} value={citation.date}/>
            <SingleField title="Evidence ID" small={true} value={citation.evidence_source.evidence_id}/>
            <SingleField title="Database" small={true} value={citation.evidence_source.database}/>
            <SingleField title="URL" small={true} value={citation.evidence_source.url}/>
            <Collapsible title="References" isNested={true} open={false}>
              {
                citation.reference && citation.reference.length > 0 ? (
                  citation.reference.map((ref, idx) => (
                    <div className="component-container" key={idx}>
                      <SingleField title="Reference ID" small={true} value={ref.reference_id}/>
                    </div>
                  ))
                ) : (
                  <div className="field-value-small">
                    No references.
                  </div>
                )
              } 
            </Collapsible>
          </div>
        ))}
      </Collapsible>
    </div>
  );
};

export default CitationTable;
