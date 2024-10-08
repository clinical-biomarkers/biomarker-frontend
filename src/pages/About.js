import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import CssBaseline from "@mui/material/CssBaseline";
import StoryAboutUs from "../components/about/StoryAboutUs";
import OurTeam from "../components/about/OurTeam";
import UnivLogos from "../components/about/UnivLogos";
import { logActivity } from "../data/logging";
// import "../css/About-map.css";

const About = (props) => {
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
				{getTitle("about")}
				{getMeta("about")}
			</Helmet>

			<CssBaseline />
			<div style={{ backgroundColor: "#fff" }}>
				<StoryAboutUs />
				<OurTeam />
				<UnivLogos />
			</div>
		</React.Fragment>
	);
};
export default About;
