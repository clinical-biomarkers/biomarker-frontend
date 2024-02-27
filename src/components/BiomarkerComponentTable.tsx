import React from "react";
import { BiomarkerModel } from "../types/BiomarkerTypes";
import SingleField from "./SingleField";
import { toTitleCase } from "../utils/utils";

// Typescript stuff //

type BiomarkerComponentTableProps = {
  biomarker: BiomarkerModel;
  status: string;
}

// Component //

const BiomarkerComponentTable = ({biomarker, status}: BiomarkerComponentTableProps) => {
  return (
    <div>
      <h2 className="section-header">Biomarker Component(s)</h2>
      {biomarker.biomarker_component.map((component, index) => 
        <div key={index} className="component-container">           
          <SingleField title="Biomarker" value={component.biomarker}/>
          <div className="field underline">
            <div className="field-title">Assessed Biomarker Entity:</div>
          </div>
          <div className="sub-component-container">
            <SingleField title="Recommended Name" value={component.assessed_biomarker_entity.recommended_name}/>
            <SingleField title="Synonyms" value={
                  component.assessed_biomarker_entity.synonyms && component.assessed_biomarker_entity.synonyms.length > 0
                    ? component.assessed_biomarker_entity.synonyms?.map(s => s.synonym).join(', ')
                    : 'None'
                }/>
          </div>
          <SingleField title="Assessed Biomarker Entity ID" value={component.assessed_biomarker_entity_id}/>
          <SingleField title="Assessed Entity Type" value={component.assessed_entity_type}/>
          <div className="field">
            <div className="field-title underline">Specimen(s):</div>
          </div>
          <div className="sub-component-container">
            {
              component.specimen && component.specimen.length > 0
              ? component.specimen.map((specimen) => (
                <>
                  {Object.entries(specimen).map(([key, value]) => (
                    value && (
                      <div className="field">
                        <div className="field-title">{toTitleCase(key.replace(/_/g, ' '))}: </div>
                        <div className="field-value">{value}</div>
                      </div>
                    )
                  ))}
                </>
              ))
              : <div className="field-value">None</div>
            }
          </div>
        </div>
      )}
    </div>
  )
}

export default BiomarkerComponentTable;
