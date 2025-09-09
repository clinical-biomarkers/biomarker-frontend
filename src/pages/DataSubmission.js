import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import VerticalHeading from "../components/headings/VerticalHeading";
import { Row, Col } from "react-bootstrap";
import { logActivity } from "../data/logging";
import "../css/Responsive.css";
import DataForm from "../components/contactUs/DataForm";

const mapContainer = {
	position: "relative",
	overflow: "hidden",
	width: "100%",
	margin: "0 auto",
};

const univNameFooter = {
	color: "#fff",
	position: "relative",
	background: "#777",
	height: "50px",
	borderBottomLeftRadius: "8px",
	borderBottomRightRadius: "8px",
	marginBottom: "40px",
};

const DataSubmission = (props) => {
	const vertHeadContactUs = {
		h5VerticalText: "SUBMISSIONS",
		// h5VerticalText: 'WHO WE ARE',
		h2textTop: "Submit",
		// h2textBottom: "In",
		h2textBottomStrongAfter: "Data",
		pText:
			"We welcome your biomarker submissions through this form. Your contributions play an important role in enhancing the accuracy, coverage, and impact of our resources. Please include any related questions, comments, or suggestions—our team will review your submission and respond within a reasonable timeframe.",
	};
	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
		logActivity();
	}, []);

	return (
		<React.Fragment>
			<Helmet>
				{getTitle("dataSubmission")}
				{getMeta("dataSubmission")}
			</Helmet>

			<CssBaseline />
			<Container maxWidth="lg" className="gg-container5">
				<Row>
					{/* Contact Left*/}
					<Col sm={12} md={12} lg={6}>
						<VerticalHeading post={vertHeadContactUs} />
					</Col>
					{/* Contact Right */}
					<Col sm={12} md={12} lg={6} className="content-box-md">
						<div className="contact-right">
							<DataForm />
						</div>
					</Col>
				</Row>
			</Container>
		</React.Fragment>
	);
};
export default DataSubmission;
