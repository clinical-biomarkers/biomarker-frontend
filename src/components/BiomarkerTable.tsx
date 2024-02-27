import React, { useState, useEffect } from "react";
import { BiomarkerModel } from "../types/BiomarkerTypes";
import config from "../conf.json";
import BiomarkerComponentTable from "./BiomarkerComponentTable";
import Collapsible from "./Collapsible";
import SingleField from "./SingleField";
import { toTitleCase } from "../utils/utils";
import "./BiomarkerTable.css";
import loading from "../artifacts/loading.gif";
import EvidenceSourceTable from "./EvidenceSource";

// Typescript stuff //

type BiomarkerTableProps = {
  biomarker_id: string;
};

// Component //

const BiomarkerTable = ({ biomarker_id }: BiomarkerTableProps) => {
  const [biomarker, setBiomarker] = useState<BiomarkerModel | null>(null);
  const [results, setResults] = useState<number>(0);
  const status: string = "Reviewed";

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
        <img src={loading} alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="results-container">
      <h1 id="top-header">{biomarker.biomarker_id} Results</h1>
      <div id="header-label">Results: {results}</div>
      <Collapsible title="Test">
        <SingleField title="Biomarker ID" value={biomarker.biomarker_id} />
        <SingleField title="Status" value={status} />
        <BiomarkerComponentTable biomarker={biomarker} status={status} />
        <div className="field underline">
          <div className="field-title">Condition</div>
        </div>
        <div className="sub-component-container">
          {biomarker.condition ? (
            <div>
              <SingleField
                title="Condition ID"
                value={biomarker.condition.recommended_name.condition_id}
              />
              <SingleField
                title="Resource"
                value={biomarker.condition.recommended_name.resource}
              />
              <SingleField
                title="Recommended Name"
                value={toTitleCase(biomarker.condition.recommended_name.name)}
              />
              <SingleField
                title="Exact Synonyms"
                value={
                  biomarker.condition.synonyms &&
                    biomarker.condition.synonyms.length > 0
                    ? biomarker.condition.synonyms
                      ?.map((s) => s.name)
                      .join(", ")
                    : "None"
                }
              />
              <SingleField
                title="Description"
                value={biomarker.condition.recommended_name.description}
              />
              <SingleField
                title="URL"
                value={biomarker.condition.recommended_name.url}
              />
            </div>
          ) : (
            <div className="field-value">
              No condition data.
            </div>
          )}
        </div>
        <div className="field underline">
          <div className="field-title">Exposure Agent</div>
        </div>
        <div className="sub-component-container">
          {biomarker.exposure_agent ? (
            <div>
              <SingleField
                title="Exposure Agent ID"
                value={biomarker.exposure_agent.recommended_name.exposure_agent_id}
              />
              <SingleField
                title="Resource"
                value={biomarker.exposure_agent.recommended_name.name}
              />
              <SingleField
                title="Recommended Name"
                value={toTitleCase(biomarker.exposure_agent.recommended_name.name)}
              />
              <SingleField
                title="Description"
                value={biomarker.exposure_agent.recommended_name.description}
              />
              <SingleField
                title="URL"
                value={biomarker.exposure_agent.recommended_name.url}
              />
            </div>
          ) : (
            <div className="field-value">
              No Exposure Agent data.
            </div>
          )}
        </div>
        <div className="field-title underline">
          Top Level Evidence Source(s)
        </div>
          {biomarker.evidence_source ? (
            <EvidenceSourceTable evidences={biomarker.evidence_source}/>
          ) : (
            <div className="field-value">
              No top level evidence. 
            </div>
          )}
        <div className="field-title underline">
          Citation Information
        </div>
      </Collapsible>
    </div>
  );
};

export default BiomarkerTable;
