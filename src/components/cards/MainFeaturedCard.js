import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import PersonPinCircleOutlinedIcon from "@material-ui/icons/PersonPinCircleOutlined";
// import FormatQuoteOutlinedIcon from "@material-ui/icons/FormatQuoteOutlined";
import quoteIcon from "../../images/icons/quote-open-outline-white.svg";
import routeConstants from "../../data/json/routeConstants.json";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  mainFeaturedCard: {
    position: "relative",
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginBottom: theme.spacing(4),
    // backgroundImage: 'url(https://source.unsplash.com/random)',
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
    backgroundColor: "rgba(0,0,0,.4)",
  },
  mainFeaturedCardContent: {
    position: "relative",
    textAlign: "center",
    padding: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(3, 4),
      textAlign: "left",
    },
  },
  mainFeaturedCardButtons: {
    position: "relative",
    textAlign: "center",
    padding: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(3, 4),
      textAlign: "right",
    },
  },
  // linkText: {
  // 	color: "#ffffff !important",
  // 	fontWeight: "600",
  // 	"&:hover": {
  // 		color: "#57affa",
  // 	},
  // },
}));
export default function MainFeaturedCard(props) {
  const classes = useStyles();
  const { post } = props;

  return (
    <Paper className={classes.mainFeaturedCard} style={{ backgroundImage: `url(${post.image})` }}>
      {<img style={{ display: "none" }} src={post.image} alt={post.imageText} />}
      <div className={classes.overlay} />
      {/* <Grid container className="gg-align-center"> */}
      <Grid container>
        {/* <Grid item sm={ 12 } lg={ 8 }> */}
        <Grid item sm={12} md={8} lg={6} className="text-left">
          <div className={classes.mainFeaturedCardContent} style={{ letterSpacing: "1px" }}>
            <Typography component="h5" variant="h6" color="inherit" gutterBottom>
              {post.title}
            </Typography>
            <Typography component="h6" color="inherit" paragraph>
              {post.description}
            </Typography>
          </div>
        </Grid>
        {/* <Grid item sm={12} md={2} lg={2} className="text-right"></Grid> */}
        <Grid item sm={12} md={4} lg={6} className="btn-outline-white-col">
          <div className={classes.mainFeaturedCardButtons}>
            <div className="btn-outline-white">
              <Link to={routeConstants.howToCite} className="gg-btn-outline-blue">
                <span
                  style={{
                    paddingRight: "15px",
                    paddingLeft: "5px",
                  }}
                >
                  {/* <FormatQuoteOutlinedIcon
										style={{
											fontSize: "26px",
										}}
									/> */}
                  <img
                    component="img"
                    style={{
                      paddingBottom: "4px",
                      paddingTop: "4px",
                    }}
                    src={quoteIcon}
                    alt="quote icon"
                  />
                </span>
                How To Cite
              </Link>
            </div>
            <div className="btn-outline-white">
              <Link to={routeConstants.tryMe} className="gg-btn-outline-white">
                <span style={{ paddingRight: "10px" }}>
                  <HourglassEmptyIcon style={{ fontSize: "24px" }} />
                </span>
                Quick Start
              </Link>
            </div>
            <div className="btn-outline-white">
              <Link to={routeConstants.about} className="gg-btn-outline-white">
                <span style={{ paddingRight: "10px" }}>
                  <PersonPinCircleOutlinedIcon style={{ fontSize: "24px" }} />
                </span>
                Our Mission
              </Link>
            </div>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
}

MainFeaturedCard.propTypes = {
  post: PropTypes.object,
};

// Proposal 1
// import React from "react";
// import PropTypes from "prop-types";
// import { makeStyles } from "@material-ui/core/styles";
// import Paper from "@material-ui/core/Paper";
// import Typography from "@material-ui/core/Typography";
// import Grid from "@material-ui/core/Grid";
// import { Link, NavLink } from "react-router-dom";
// import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
// import PersonPinCircleOutlinedIcon from "@material-ui/icons/PersonPinCircleOutlined";
// import quoteIcon from "../../images/icons/quote-open-outline-white.svg";
// import routeConstants from "../../data/json/routeConstants.json";

// const useStyles = makeStyles((theme) => ({
// 	mainFeaturedCard: {
// 		position: "relative",
// 		backgroundColor: theme.palette.grey[800],
// 		color: theme.palette.common.white,
// 		marginBottom: theme.spacing(4),
// 		// backgroundImage: 'url(https://source.unsplash.com/random)',
// 		backgroundSize: "cover",
// 		backgroundRepeat: "no-repeat",
// 		backgroundPosition: "center",
// 	},
// 	overlay: {
// 		position: "absolute",
// 		top: 0,
// 		bottom: 0,
// 		right: 0,
// 		left: 0,
// 		backgroundColor: "rgba(0,0,0,.3)",
// 	},
// 	mainFeaturedCardContent: {
// 		position: "relative",
// 		// height: "400px !important",
// 		textAlign: "center",
// 		padding: theme.spacing(3),
// 		[theme.breakpoints.up("md")]: {
// 			padding: theme.spacing(8),
// 		},
// 	},
// 	linkText: {
// 		color: "#ffffff !important",
// 		fontWeight: "600",
// 		"&:hover": {
// 			color: "#57affa",
// 		},
// 	},
// }));
// export default function MainFeaturedCard(props) {
// 	const classes = useStyles();
// 	const { post } = props;

// 	return (
// 		<Paper
// 			className={classes.mainFeaturedCard}
// 			style={{ backgroundImage: `url(${post.image})` }}>
// 			{
// 				<img
// 					style={{ display: "none" }}
// 					src={post.image}
// 					alt={post.imageText}
// 				/>
// 			}
// 			<div className={classes.overlay} />
// 			<Grid container className="gg-align-center">
// 				<Grid item sm={12} lg={8}>
// 					<div className={classes.mainFeaturedCardContent}>
// 						<Typography
// 							component="h5"
// 							variant="h6"
// 							color="inherit"
// 							gutterBottom
// 							// style={ { letterSpacing: "1px" } }
// 						>
// 							{post.title}
// 						</Typography>
// 						<Typography
// 							component="h6"
// 							color="inherit"
// 							paragraph
// 							// style={ { letterSpacing: "1px" } }
// 						>
// 							{post.description}
// 						</Typography>
// 						{/* <Typography paragraph style={{ marginBottom: "40px" }}>
// 							<Link as={NavLink} to={post.toAbout} className={classes.linkText}>
// 								{post.linkText}
// 							</Link>
// 						</Typography> */}
// 						<Typography paragraph style={{ marginTop: "60px" }}>
// 							<Link
// 								as={NavLink}
// 								to={routeConstants.howToCite}
// 								className="gg-btn-outline-white">
// 								<span>
// 									<img
// 										component="img"
// 										style={{ paddingRight: "15px", marginTop: "-5px" }}
// 										src={quoteIcon}
// 										alt="quote icon"
// 									/>
// 								</span>
// 								How To Cite
// 							</Link>
// 							<Link
// 								as={NavLink}
// 								to={routeConstants.tryMe}
// 								className="gg-btn-outline-white">
// 								<span>
// 									<HourglassEmptyIcon
// 										style={{ paddingRight: "10px", marginTop: "-5px" }}
// 									/>
// 								</span>
// 								Quick Start
// 							</Link>
// 							<Link
// 								as={NavLink}
// 								to={routeConstants.about}
// 								className="gg-btn-outline-white">
// 								<span>
// 									<PersonPinCircleOutlinedIcon
// 										style={{ paddingRight: "10px", marginTop: "-5px" }}
// 									/>
// 								</span>
// 								Our Mission
// 							</Link>
// 						</Typography>
// 						<Grid item></Grid>
// 					</div>
// 				</Grid>
// 			</Grid>
// 		</Paper>
// 	);
// }

// MainFeaturedCard.propTypes = {
// 	post: PropTypes.object,
// };

// Proposal 2
// import React from "react";
// import PropTypes from "prop-types";
// import { makeStyles } from "@material-ui/core/styles";
// import Paper from "@material-ui/core/Paper";
// import Typography from "@material-ui/core/Typography";
// import Grid from "@material-ui/core/Grid";
// import { Link } from "react-router-dom";
// import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
// import PersonPinCircleOutlinedIcon from "@material-ui/icons/PersonPinCircleOutlined";
// import quoteIcon from "../../images/icons/quote-open-outline-white.svg";
// import routeConstants from "../../data/json/routeConstants.json";

// const useStyles = makeStyles((theme) => ({
// 	mainFeaturedCard: {
// 		position: "relative",
// 		backgroundColor: theme.palette.grey[800],
// 		color: theme.palette.common.white,
// 		marginBottom: theme.spacing(4),
// 		// backgroundImage: 'url(https://source.unsplash.com/random)',
// 		backgroundSize: "cover",
// 		backgroundRepeat: "no-repeat",
// 		backgroundPosition: "center",
// 	},
// 	overlay: {
// 		position: "absolute",
// 		top: 0,
// 		bottom: 0,
// 		right: 0,
// 		left: 0,
// 		backgroundColor: "rgba(0,0,0,.3)",
// 	},
// 	mainFeaturedCardContent: {
// 		position: "relative",
// 		// height: "400px !important",
// 		textAlign: "center",
// 		padding: theme.spacing(3),
// 		[theme.breakpoints.up("md")]: {
// 			padding: theme.spacing(3),
// 		},
// 	},
// 	linkText: {
// 		color: "#ffffff !important",
// 		fontWeight: "600",
// 		"&:hover": {
// 			color: "#57affa",
// 		},
// 	},
// }));
// export default function MainFeaturedCard(props) {
// 	const classes = useStyles();
// 	const { post } = props;

// 	return (
// 		<Paper
// 			className={classes.mainFeaturedCard}
// 			style={{ backgroundImage: `url(${post.image})` }}>
// 			{
// 				<img
// 					style={{ display: "none" }}
// 					src={post.image}
// 					alt={post.imageText}
// 				/>
// 			}
// 			<div className={classes.overlay} />
// 			<Grid container className="gg-align-center">
// 				<Grid item sm={12} lg={9}>
// 					<div className={classes.mainFeaturedCardContent}>
// 						<Typography
// 							component="h5"
// 							variant="h6"
// 							color="inherit"
// 							gutterBottom
// 							// style={ { letterSpacing: "1px" } }
// 						>
// 							{post.title}
// 						</Typography>
// 						<Typography
// 							component="h6"
// 							color="inherit"
// 							paragraph
// 							// style={ { letterSpacing: "1px" } }
// 						>
// 							{post.description}
// 						</Typography>
// 						{/* <Typography paragraph style={{ marginBottom: "40px" }}>
// 							<Link as={NavLink} to={post.toAbout} className={classes.linkText}>
// 								{post.linkText}
// 							</Link>
// 						</Typography> */}
// 						<Typography paragraph style={{ marginTop: "30px" }}>
// 							<Link
// 								to={routeConstants.howToCite}
// 								className="gg-btn-outline-white">
// 								<span>
// 									<img
// 										component="img"
// 										style={{ paddingRight: "15px", marginTop: "-5px" }}
// 										src={quoteIcon}
// 										alt="quote icon"
// 									/>
// 								</span>
// 								How To Cite
// 							</Link>
// 							<Link to={routeConstants.tryMe} className="gg-btn-outline-white">
// 								<span>
// 									<HourglassEmptyIcon
// 										style={{ paddingRight: "10px", marginTop: "-5px" }}
// 									/>
// 								</span>
// 								Quick Start
// 							</Link>
// 							<Link to={routeConstants.about} className="gg-btn-outline-white">
// 								<span>
// 									<PersonPinCircleOutlinedIcon
// 										style={{ paddingRight: "10px", marginTop: "-5px" }}
// 									/>
// 								</span>
// 								Our Mission
// 							</Link>
// 						</Typography>
// 						<Grid item></Grid>
// 					</div>
// 				</Grid>
// 			</Grid>
// 		</Paper>
// 	);
// }

// MainFeaturedCard.propTypes = {
// 	post: PropTypes.object,
// };

// 07 / 27 / 2020;
