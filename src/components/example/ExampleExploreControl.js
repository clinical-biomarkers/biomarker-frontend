import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";
import LineTooltip from "../tooltip/LineTooltip";
import Button from "react-bootstrap/Button";

/**
 * Component to show example and explore link under input component like glycan id.
 **/
const ExampleExploreControl = (props) => {
	
	/**
	 * Function to sort examples.
	 * @param {object} ex1 example 1.
	 * @param {object} ex2 example 2.
	 **/
	function sortExamples(ex1, ex2) {
		return parseInt(ex1.orderID) - parseInt(ex2.orderID);
	}

	return (
		<>
			{props.inputValue.sort(sortExamples).map((obj) => (
				<Row
					key={obj.orderID}
					// className={ "small-text" }
				>
					{obj.example && (
						<Col>
							<div>
								{obj.example.name}{" "}
								<LineTooltip text="Click to insert example.">
									<Button
										className={"lnk-btn"}
										variant="link"
										onClick={() => {
											props.setInputValue(obj.example.id);
										}}>
										{obj.example.id}
									</Button>
								</LineTooltip>
							</div>
						</Col>
					)}
					{obj.explore && (
						<Col>
							<div className="text-right">
								Explore{" "}
								<a
									href={obj.explore.url}
									target="_blank"
									rel="noopener noreferrer">
									{obj.explore.id}
								</a>
							</div>
						</Col>
					)}
				</Row>
			))}
		</>
	);
};

export default ExampleExploreControl;

ExampleExploreControl.propTypes = {
	inputValue: PropTypes.array,
	setInputValue: PropTypes.func,
};
