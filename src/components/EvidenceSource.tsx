import React from "react";
import { EvidenceSource } from "../types/BiomarkerTypes";
import SingleField from "./SingleField";
import Collapsible from "./Collapsible";

// Component //

const EvidenceSourceTable = ({ evidences, level }: {evidences: EvidenceSource[], level: string}) => {
  return (
    <Collapsible title={level} isNested={true}>
      {evidences.map((evidence, index) => (
        <div className="component-container">
          <SingleField
            title="Evidence ID"
            value={evidence.evidence_id}
            small={true}
          />
          <SingleField
            title="Database"
            value={evidence.database}
            small={true}
          />
          <SingleField
            title="URL"
            value={evidence.url ? evidence.url : "None"}
            small={true}
          />
          <SingleField
            title="Evidence"
            small={true}
            value={
              evidence.evidence_list && evidence.evidence_list.length > 0
                ? evidence.evidence_list?.map((s) => s.evidence).join("; ")
                : "None"
            }
          />
          <SingleField
            title="Tags"
            small={true}
            value={
              evidence.tags && evidence.tags.length > 0
                ? evidence.tags?.map((s) => s.tag).join(", ")
                : "None"
            }
          />
        </div>
      ))}
    </Collapsible>
  );
};

export default EvidenceSourceTable;
