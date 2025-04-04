import React from "react";
import PropTypes from "prop-types";
import { Alert, AlertTitle } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import CardLoader from "../load/CardLoader";
import { Card, Col, Row } from "react-bootstrap";

export default function EventAlerts(props) {
  const [open, setOpen] = React.useState(true);
  const [style, setStyle] = React.useState("gg-tooltip event-alerts-mb");

  return (
    <div>
      {props.data.map((obj) => (
        <Collapse in={open} className={style}>
          <Card className="event-alerts-border">
            <CardLoader pageLoading={props.pageLoading} />
            <Alert
              classes={{
                message: "alert-banner-message",
                icon: "alert-banner-icon gg-align-middle",
              }}
              severity="info"
              sx={{ bgcolor: '#f0faf5' }}
              action={
                <IconButton
                  aria-label="close"
                  // color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                    setStyle(!style);
                  }}
                >
                  <CloseIcon fontSize="inherit" className="biom-teal-color" />
                </IconButton>
              }
            >
              <Row>
                {/* {props.data.map((obj) => ( */}
                <Col xs={12} sm={"auto"} className={"mt-1 mb-1"}>
                  <>
                    <AlertTitle>
                      <h5 className={"biom-teal-color"}>{obj.title}</h5>
                    </AlertTitle>
                    <div>
                      {obj.description}
                    </div>
                    {obj.url && obj.url_name &&
                    <div>
                      <a href={obj.url} target="_blank" rel="noopener noreferrer">
                        <span className="gg-link">{obj.url_name}</span>
                      </a>
                    </div>}
                    {obj.venue &&
                    <div>
                      Location: {obj.venue}
                    </div>}
                  </>
                </Col>
                {/* ))} */}
              </Row>
            </Alert>
          </Card>
        </Collapse>
      ))}
    </div>
  );
}
EventAlerts.propTypes = {
  data: PropTypes.object,
};
