import React from "react";
import { toTitleCase } from "../utils/utils";

// Typescript stuff // 

type SingleFieldProps = {
  title: string;
  value: string;
}

// Component //

const SingleField = ({title, value}: SingleFieldProps) => {
  return (
    <div className="field">
      <div className="field-title">{toTitleCase(title)}</div>
      <div className="field-value">{value}</div>
    </div>
  )
}

export default SingleField;
