import React from "react";
import { toTitleCase } from "../utils/utils";

// Typescript stuff // 

type SingleFieldProps = {
  title: string;
  value: string | string[];
  small?: boolean;
}

// Component //

const SingleField = ({title, value, small = false}: SingleFieldProps) => {
  let content;

  if (Array.isArray(value)) {
    content = title.toLowerCase().includes('url') ? (
      value.map((val, index) => (
        <React.Fragment key={index}>
          <a href={val} target="_blank" rel="noopener noreferrer">{val}</a>
          {index < value.length - 1 ? ', ' : ''}
        </React.Fragment>
      ))
    ) : (
      value.join(', ')
    );
  } else {
    content = title.toLowerCase().includes(('url')) ? (
      <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
    ) : (
      value
    );
  }
  return (
    <div className={`${small ? "field-small" : "field"}`}>
      <div className={`${small ? "field-title-small" : "field-title"}`}>{toTitleCase(title)}:</div>
      <div className={`${small ? "field-value-small" : "field-value"}`}>{content}</div>
    </div>
  )
}

export default SingleField;
