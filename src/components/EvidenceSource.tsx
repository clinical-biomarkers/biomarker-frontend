import React from "react";
import { EvidenceSource } from "../types/BiomarkerTypes";
import SingleField from "./SingleField";

// Typescript stuff //

type EvidenceSourceTableProps = {
  evidences: EvidenceSource[];
}

// Component //

const EvidenceSourceTable = ({evidences}: EvidenceSourceTableProps) => {
  return (
    <div>
        {evidences.map((evidence, index) => (
          <div className="component-container">
          </div>
        ))}
    </div>
  );
}

export default EvidenceSourceTable;

/*{
            component.evidence_source && component.evidence_source.length > 0
            ? component.evidence_source.map((evidence_source) => (
              <>
                {Object.entries(evidence_source).map(([key, value]) => (
                  value && (
                    <SingleField
                      title={key.replace(/_/g, ' ')}
                      value = {
                        component.evidence_source?.map(s => s[key as keyof EvidenceSource])
                          .filter(v => v != null)
                          .join(', ') || 'None'
                      }
                    />
                  )
                ))}
              </>
            ))
            : <div className="field-value">None</div>
          }

 */ 
