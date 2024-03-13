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
import CitationTable from "./CitationTable";

// Typescript stuff //

type BiomarkerTableProps = {
  biomarker_id: string;
};

type ExtendedBiomarkerModel = BiomarkerModel & { status: string };

// Component //

const BiomarkerTable = ({ biomarker_id }: BiomarkerTableProps) => {
  const [biomarkers, setBiomarkers] = useState<ExtendedBiomarkerModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const reviewedResponse = await fetch(
          `${config.api_root}${biomarker_id}`,
        );
        let reviewedBiomarkers: ExtendedBiomarkerModel[] = [];
        if (reviewedResponse.ok) {
          const reviewedData = await reviewedResponse.json();
          reviewedBiomarkers = [{ ...reviewedData, status: "Reviewed" }];
        }
        const unreviewedResponse = await fetch(
          `${config.api_unreviewed_root}${biomarker_id}`,
        );
        let unreviewedBiomarkers: ExtendedBiomarkerModel[] = [];
        if (unreviewedResponse.ok) {
          const unreviewedData = await unreviewedResponse.json();
          unreviewedBiomarkers = unreviewedData.map((biomarker: BiomarkerModel) => ({
            ...biomarker,
            status: "Unreviewed",
          }));
        }
        setBiomarkers([...reviewedBiomarkers, ...unreviewedBiomarkers]);
        setBiomarkers([...reviewedBiomarkers])
      } catch (error) {
        console.error("Error fetching biomarker data: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [biomarker_id]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <img src={loading} alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="results-container">
      <h1 id="top-header">{biomarker_id} Results</h1>
      <div id="header-label">Results: {biomarkers.length}</div>
      {biomarkers.length > 0 ? (
        biomarkers.map((biomarker, idx) => (
          <Collapsible title={`Result: ${idx + 1}`}>
            <SingleField title="Biomarker ID" value={biomarker.biomarker_id} />
            <SingleField title="Status" value={biomarker.status} />
            <BiomarkerComponentTable
              biomarker={biomarker}
              status={biomarker.status}
            />
            <SingleField title="Best Biomarker Role(s)" value={biomarker.best_biomarker_role.map((s) => s.role).join(", ")}/>
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
                    value={toTitleCase(
                      biomarker.condition.recommended_name.name,
                    )}
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
                <div className="field-value">No condition data.</div>
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
                    value={
                      biomarker.exposure_agent.recommended_name
                        .exposure_agent_id
                    }
                  />
                  <SingleField
                    title="Resource"
                    value={biomarker.exposure_agent.recommended_name.name}
                  />
                  <SingleField
                    title="Recommended Name"
                    value={toTitleCase(
                      biomarker.exposure_agent.recommended_name.name,
                    )}
                  />
                  <SingleField
                    title="Description"
                    value={
                      biomarker.exposure_agent.recommended_name.description
                    }
                  />
                  <SingleField
                    title="URL"
                    value={biomarker.exposure_agent.recommended_name.url}
                  />
                </div>
              ) : (
                <div className="field-value">No Exposure Agent data.</div>
              )}
            </div>
            <div className="field-title underline">
              Top Level Evidence Source(s)
            </div>
            {biomarker.evidence_source ? (
              <EvidenceSourceTable evidences={biomarker.evidence_source} />
            ) : (
              <div className="field-value">No top level evidence.</div>
            )}
            <div className="field-title underline">Citation Information</div>
            {biomarker.citation ? (
              <CitationTable citations={biomarker.citation} />
            ) : (
              <div className="field-value">No citation information.</div>
            )}
          </Collapsible>
        ))
      ) : (
        <div> No biomarker data found.</div>
      )}
    </div>
  );
};

export default BiomarkerTable;
