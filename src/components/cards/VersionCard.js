import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { getDateMMDDYYYY } from "../../utils/common";
import { Link } from "@mui/material";
import CardLoader from "../load/CardLoader";
import versionDataJSON from "../../data/json/biomarker/versionData.json";

const useStyles = makeStyles((theme) => ({
	cardAction: {
		display: "inline-flex",
	},
	card: {
		// display: 'flex'
		// maxWidth: 345
		// width: '100%'
	},
	cardTitle: {
		textAlign: "center",
	},
	cardDetails: {
		flex: 1,
	},
}));

export default function VersionCard(props) {
	const classes = useStyles();
	const [versionData, setVersionData] = useState({});

	useEffect(() => {
		var verData = {};
		props.data && props.data.forEach((verObj) => {
			verData[verObj.component] = {
				// componentName: verObj.component_name,
				// url: verObj.url,
				version: verObj.version,
				releaseDate: verObj.release_date,
			};
		});
		setVersionData(verData);
	}, [props.data]);

	return (
		<Grid item xs={12} sm={6} md={12}>
			<Card className="card">
				<CardLoader pageLoading={props.pageLoading} />
				<div className={classes.cardDetails}>
					<CardContent>
						<h4 className={classes.cardTitle}>Version</h4>
						<Typography>
							<span>
								<strong>Portal:</strong>
							</span>{" "}
							<Link
								href={versionDataJSON.software.releaseNotes}
								target="_blank"
								rel="noopener noreferrer">
								{versionDataJSON.software && versionDataJSON.software.version}
							</Link>{" "}
							{versionDataJSON.software &&
								" (" + getDateMMDDYYYY(versionDataJSON.software.releaseDate) + ")"}
							<br />
							<span>
								<strong>Webservice:</strong>
							</span>{" "}
							<Link
								href="https://wiki.biomarkerkb.org/API_Release_Notes"
								target="_blank"
								rel="noopener noreferrer">
								{versionData.api && versionData.api.version}
							</Link>{" "}
							{versionData.api &&
								// versionData.api.version +
								" (" + getDateMMDDYYYY(versionData.api.releaseDate) + ")"}
							<br />
							<span>
								<strong>Data:</strong>
							</span>{" "}
							<Link
								href="https://wiki.biomarkerkb.org/Data_Release_Notes"
								target="_blank"
								rel="noopener noreferrer">
								{versionData.data && versionData.data.version}
							</Link>{" "}
							{versionData.data &&
								// versionData.data.version +
								" (" + getDateMMDDYYYY(versionData.data.releaseDate) + ")"}
						</Typography>
					</CardContent>
				</div>
			</Card>
		</Grid>
	);
}

VersionCard.propTypes = {
	data: PropTypes.object,
};
