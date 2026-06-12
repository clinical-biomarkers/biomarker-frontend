import React from "react";
import PropTypes from "prop-types";
// import { makeStyles } from "@mui/styles";
import { styled } from '@mui/material/styles';
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import PersonPinCircleOutlinedIcon from "@mui/icons-material/PersonPinCircleOutlined";
import quoteIcon from "../../images/icons/quote-open-outline-white.svg";
import cfdeIcon from "../../images/icons/CFDE-logo.png";
import routeConstants from "../../data/json/routeConstants.json";
import { Link } from "react-router-dom";
import { Image } from "react-bootstrap";
import {
  NIH_COMMONFUND_DATAECOSYSTEM,
  GLYGEN_BUILD
} from "../../envVariables";

const PREFIX = 'MainFeaturedCard';

const classes = {
  mainFeaturedCard: `${PREFIX}-mainFeaturedCard`,
  overlay: `${PREFIX}-overlay`,
  mainFeaturedCardContent: `${PREFIX}-mainFeaturedCardContent`,
  mainFeaturedCardButtons: `${PREFIX}-mainFeaturedCardButtons`
};

const StyledPaper = styled(Paper)((
  {
    theme
  }
) => ({
  [`&.${classes.mainFeaturedCard}`]: {
    position: "relative",
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginBottom: theme.spacing(4),
    // backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },

  [`& .${classes.overlay}`]: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,.4)",
  },

  [`& .${classes.mainFeaturedCardContent}`]: {
    position: "relative",
    textAlign: "center",
    padding: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(3, 4),
      textAlign: "left",
    },
  },

  // linkText: {
  // 	color: "#ffffff !important",
  // 	fontWeight: "600",
  // 	"&:hover": {
  // 		color: "#57affa",
  // 	},
  // },
  [`& .${classes.mainFeaturedCardButtons}`]: {
    position: "relative",
    textAlign: "center",
    padding: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(3, 4),
      textAlign: "right",
    },
  }
}));

export default function MainFeaturedCard(props) {
  // const classes = useStyles();
  const { post } = props;
  const demoForm = "https://docs.google.com/forms/d/e/1FAIpQLSdUwz7SiTD9f0uEieTjHIqBllY5OTfEa0G1SiitQmrbMVEhUw/viewform";

  return (
    <StyledPaper className={classes.mainFeaturedCard} style={{ backgroundImage: `url(${post.image})` }}>
      {<img style={{ display: "none" }} src={post.image} alt={post.imageText} />}
      <div className={classes.overlay} />
      {/* <Grid container className="gg-align-center"> */}
      <Grid container>
        {/* <Grid item sm={ 12 } lg={ 8 }> */}
        <Grid item size= {{ sm: 12, md: 5, lg: 6 }} className="text-left me-3">
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
        <Grid item size= {{ sm: 12, md: 3, lg: 3 }} className="btn-outline-white-col">
          <div className={classes.mainFeaturedCardButtons}>
          </div>
        </Grid>
        <Grid item size= {{ sm: 12, md: 3, lg: 2 }} className="btn-outline-white-col">
          <div className={classes.mainFeaturedCardButtons}>
            <div className="btn-outline-white">
              <Link to={routeConstants.howToCite} className="biom-btn-outline-teal">
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
              <Link to={routeConstants.about} className="biom-btn-outline-white">
                <span style={{ paddingRight: "10px" }}>
                  <PersonPinCircleOutlinedIcon style={{ fontSize: "24px" }} />
                </span>
                Our Mission
              </Link>
            </div>
            {GLYGEN_BUILD === "biomarker" && <div className="btn-outline-white">
              <a href={NIH_COMMONFUND_DATAECOSYSTEM} target="_blank" rel="noopener noreferrer" className="biom-btn-outline-white text-center"
                style={{ paddingTop: "3px", paddingBottom: "3px" }}>
                <span
                  style={{
                    paddingRight: "15px",
                    paddingLeft: "5px"
                  }}
                  class="pagination-centered"
                >
                  <Image
                    className="img-home-big"
                    src={cfdeIcon}
                    alt={"cfde icon"}
                  />
                </span>                
                CFDE
              </a>
            </div>}
          </div>
        </Grid>
      </Grid>
    </StyledPaper>
  );
}

MainFeaturedCard.propTypes = {
  post: PropTypes.object,
};