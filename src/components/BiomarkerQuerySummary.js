import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import stringConstants from "../data/json/stringConstants";
import { Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Radio from '@mui/material/Radio';
import LineTooltip from "./tooltip/LineTooltip";
import "../css/detail.css";

function getDateTime() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();

  if (month.toString().length === 1) {
    month = "0" + month;
  }
  if (day.toString().length === 1) {
    day = "0" + day;
  }
  if (hour.toString().length === 1) {
    hour = "0" + hour;
  }
  if (minute.toString().length === 1) {
    minute = "0" + minute;
  }
  if (second.toString().length === 1) {
    second = "0" + second;
  }
  var dateTime = year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;
  return dateTime;
}

const BiomarkerQuerySummary = (props) => {
  const title = "Biomarker Search Summary";

  const [selectedQueryType, setSelectedQueryType] = React.useState("Advanced-Search");

  const handleQueryTypeChange = (event) => {
    setSelectedQueryType(event.target.value);
  };

  const { data, onModifySearch, timestamp, aIQueryAssistant } = props;
  const biomarkerStrings = stringConstants.biomarker.common;

  const {
    specimen_name,
    specimen_loinc_code,
    biomarker_entity_type,
    biomarker_entity_name,
    biomarker_id,
    canonical_id,
    condition_name,
    condition_id,
    publication_id,
    best_biomarker_role,
    term,
    term_category,
  } = data;

  const executionTime = timestamp ? timestamp : getDateTime(timestamp);

  return (
    <>
      <Card className="text-center summary-panel">
        <Card.Header as="h3" className="panelHeadBgr panelHeadText">
          {title}
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <strong>Performed on: {executionTime}</strong>
          </Card.Text>
          <Row>
              {aIQueryAssistant && (
                <Row className="summary-table-col" sm={12}>
                  <div align="center">
                    <Radio
                      style={{marginTop:"-5px"}}
                      checked={selectedQueryType === "AI-Query-Assistant"}
                      onChange={handleQueryTypeChange}
                      value="AI-Query-Assistant"
                      name="query-type-radio-buttons"
                    />
                    <strong><i>User Query</i></strong>
                  </div>
                  <div align="center">{aIQueryAssistant.original_query}</div>
                  <p/>
                  <div align="center">
                    <Radio
                      style={{marginTop:"-5px"}}
                      checked={selectedQueryType === "Advanced-Search"}
                      onChange={handleQueryTypeChange}
                      value="Advanced-Search"
                      name="query-type-radio-buttons"
                    />
                    <strong><i>Internal Query</i></strong>
                  </div>
                </Row>
              )}
            <Col>
              {specimen_name && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {biomarkerStrings.specimen_name.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {specimen_name}
                  </Col>
                </Row>
              )}
              {specimen_loinc_code && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {biomarkerStrings.specimen_loinc_code.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {specimen_loinc_code}
                  </Col>
                </Row>
              )}
              {biomarker_entity_type && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {biomarkerStrings.biomarker_entity_type.name}:
                  </Col>
                  <Col xs={6} sm={6} md={6} lg={6} className="evidencetype" align="left">
                    {biomarker_entity_type}
                  </Col>
                </Row>
              )}
              {biomarker_entity_name && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {biomarkerStrings.biomarker_entity_name.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {biomarker_entity_name}
                  </Col>
                </Row>
              )}
              {biomarker_id && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {biomarkerStrings.biomarker_id.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {biomarker_id}
                  </Col>
                </Row>
              )}
              {canonical_id && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {biomarkerStrings.canonical_id.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {canonical_id}
                  </Col>
                </Row>
              )}
              {condition_name && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {biomarkerStrings.condition_name.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                      {condition_name}{" "}
                  </Col>
                </Row>
              )}
              {condition_id && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {biomarkerStrings.condition_id.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {condition_id}
                  </Col>
                </Row>
              )}
              {publication_id && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {biomarkerStrings.publication_id.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                      {publication_id}{" "}
                  </Col>
                </Row>
              )}
              {best_biomarker_role && (
                <Row className="summary-table-col">
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {biomarkerStrings.best_biomarker_role.name}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {best_biomarker_role}
                  </Col>
                </Row>
              )}

              {term && (
                <Row className="summary-table-col" sm={12}>
                  <Col align="right">Search Term:</Col>
                  <Col align="left">{term}</Col>
                </Row>
              )}

              {term_category && (
                <Row className="summary-table-col" sm={12}>
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    Category:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {term_category}
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
          <div className="pb-3 pt-3">
            <Button
              type="button"
              className="biom-btn-outline me-4"
              onClick={() => {
                window.location.reload();
              }}
            >
              Update Results
            </Button>
            <Button type="button" className="biom-btn-teal" onClick={() => onModifySearch(selectedQueryType)}>
              Modify Search
            </Button>
          </div>
          <Card.Text>
            ** To perform the same search again using the current version of the database, click{" "}
            <strong>“Update Results”</strong>.
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};

export default BiomarkerQuerySummary;
