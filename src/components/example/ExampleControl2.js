import React from "react";
import PropTypes from "prop-types";
import LineTooltip from "../tooltip/LineTooltip";
import Button from "react-bootstrap/Button";

/**
 * Component to show examples under input component like simple search control.
 **/
const ExampleControl2 = props => {
  return (
    <div
    // className={ "small-text" }
    >
      {props.exampleMap &&
        props.exampleMap[props.type] &&
        props.exampleMap[props.type].examples &&
        props.exampleMap[props.type].examples.map((key, index, arr) => (
          <span key={key}>
            <LineTooltip text="Click to insert example.">
              <Button
                className={"lnk-btn"}
                variant="link"
                onClick={() => {
                  props.setInputValue(key);
                }}
              >
                 {props.exampleMap[props.type].name}
              </Button>
            </LineTooltip>
            {arr.length === index + 1 ? "" : ", "}
          </span>
        ))}
    </div>
  );
};

export default ExampleControl2;

ExampleControl2.propTypes = {
  exampleMap: PropTypes.object,
  type: PropTypes.string,
  setInputValue: PropTypes.func
};