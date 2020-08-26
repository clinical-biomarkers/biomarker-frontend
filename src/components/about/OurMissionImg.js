import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import missionBgImg from "../../images/about/about-mission.png";

const useStyles = makeStyles((theme) => ({
	mainFeaturedCard: {
		position: "relative",
		backgroundColor: theme.palette.grey[800],
		color: theme.palette.common.white,
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center",
	},
	overlay: {
		position: "absolute",
		top: 0,
		bottom: 0,
		right: 0,
		left: 0,
		backgroundColor: "rgba(0,0,0,.3)",
	},
	mainFeaturedCardContent: {
		position: "relative",
		textAlign: "center",
		padding: theme.spacing(6),
		[theme.breakpoints.up("md")]: {
			padding: theme.spacing(12),
		},
	},
}));

export default function OurMissionImg(props) {
	const classes = useStyles();
	const { post } = props;

	return (
		<Paper
			className={classes.mainFeaturedCard}
			style={{ backgroundImage: `url(${missionBgImg})` }}>
			{
				<img
					style={{ display: "none" }}
					src={missionBgImg}
					alt="our mission background img"
				/>
			}
			<div className={classes.overlay} />
			<Grid container>
				<Grid item sm={12} md={12}>
					<div className={classes.mainFeaturedCardContent}>
						<Typography
							style={{ fontWeight: "200" }}
							component="h1"
							variant="h4"
							color="inherit"
							gutterBottom>
							Our <span style={{ fontWeight: "900" }}>Mission</span>
						</Typography>
						<br />
						<Typography component="h1" variant="h5" color="inherit" paragraph>
							{post.description}
						</Typography>
						<Typography component="h1" variant="h5" color="inherit" paragraph>
							{post.description2}
						</Typography>
						<Typography component="h1" variant="h5" color="inherit" paragraph>
							{post.description3}
						</Typography>
					</div>
				</Grid>
			</Grid>
		</Paper>
	);
}

OurMissionImg.propTypes = {
	post: PropTypes.object,
};
