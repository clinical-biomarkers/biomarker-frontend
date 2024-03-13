import React from "react";
import { BiomarkerModel, Specimen } from "../types/BiomarkerTypes";
import SingleField from "./SingleField";
import EvidenceSourceTable from "./EvidenceSource";
import Collapsible from "./Collapsible";

// Typescript stuff //

type BiomarkerComponentTableProps = {
  biomarker: BiomarkerModel;
  status: string;
};

// Component //

const BiomarkerComponentTable = ({
  biomarker,
  status,
}: BiomarkerComponentTableProps) => {
  return (
    <div>
      <h2 className="section-header">Biomarker Component(s):</h2>
     {biomarker.biomarker_component.map((component, index) => (
        <Collapsible title={`Component: ${index + 1}`} isNested={true}>
          <SingleField title="Biomarker" value={component.biomarker} />
          <div className="field underline">
            <div className="field-title">Assessed Biomarker Entity:</div>
          </div>
          <div className="sub-component-container">
            <SingleField
              title="Recommended Name"
              value={component.assessed_biomarker_entity.recommended_name}
            />
            <SingleField
              title="Synonyms"
              value={
                component.assessed_biomarker_entity.synonyms &&
                  component.assessed_biomarker_entity.synonyms.length > 0
                  ? component.assessed_biomarker_entity.synonyms
                    ?.map((s) => s.synonym)
                    .join(", ")
                  : "None"
              }
            />
          </div>
          <SingleField
            title="Assessed Biomarker Entity ID"
            value={component.assessed_biomarker_entity_id}
          />
          <SingleField
            title="Assessed Entity Type"
            value={component.assessed_entity_type}
          />
          <div className="field">
            <div className="field-title underline">Specimen(s):</div>
          </div>
          <div className="sub-component-container">
            {component.specimen && component.specimen.length > 0 ? (
              component.specimen.map((specimen) => (
                <>
                  {Object.entries(specimen).map(
                    ([key, value]) =>
                      value && (
                        <SingleField
                          title={key.replace(/_/g, " ")}
                          value={
                            component.specimen
                              ?.map((s) => s[key as keyof Specimen])
                              .filter((v) => v != null)
                              .join(", ") || "None"
                          }
                        />
                      ),
                  )}
                </>
              ))
            ) : (
              <div className="field-value">None</div>
            )}
          </div>
          <div className="field-title underline">
            Component Evidence Source(s)
          </div>
          <EvidenceSourceTable evidences={component.evidence_source} level="Component Evidence Source(s)"/>
        </Collapsible>
      ))}
    </div>
  );
};

export default BiomarkerComponentTable;
