import React, {useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import stringConstants from "../data/json/stringConstants";
import glycanSearchData from "../data/json/glycanSearch";
import Button from "react-bootstrap/Button";
const glycanStrings = stringConstants.glycan.common;
const advancedSearch = glycanSearchData.advanced_search;
const superSearchStrings = stringConstants.super_search.common;

function getDateTime() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  if (month.toString().length == 1) {
    month = "0" + month;
  }
  if (day.toString().length == 1) {
    day = "0" + day;
  }
  if (hour.toString().length == 1) {
    hour = "0" + hour;
  }
  if (minute.toString().length == 1) {
    minute = "0" + minute;
  }
  if (second.toString().length == 1) {
    second = "0" + second;
  }
  var dateTime = year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;
  return dateTime;
}
const GlycanQuerySummary = (props) => {
  const title = "Glycan Search Summary";

  const { data, onModifySearch, timestamp, searchId } = props;

  const executionTime = timestamp ? getDateTime(timestamp) : "";
  const {
    glycan_identifier,
    mass,
    mass_type,
    number_monosaccharides,
    organism,
    glycan_type,
    glycan_name,
    glycan_subtype,
    protein_identifier,
    glycan_motif,
    enzyme,
    pmid,
    term,
    term_category,
    composition,
    binding_protein_id,
  } = data;

  const [glycanIdentifierShowMore, setGlycanIdentifierShowMore] = useState(true);

  const formatOrganisms = (organism) => {
    if (organism.organism_list) {
      const organismNames = organism.organism_list.map((item) => item.name);
      const OrganiOperation = organism.operation.toUpperCase();
      return organismNames.join(` ${OrganiOperation} `);
    }
  };

  function formatGlycans(glycansAc) {
    return glycansAc.split(",").join(", ");
  }

  return (
    <>
      <Card className="text-center summary-panel">
        <Card.Header as="h3" className="panelHeadBgr panelHeadText">
          {title}
        </Card.Header>
        <Card.Body>
          <Card.Title>
            <p>
              <strong>Performed on: {executionTime}</strong>
            </p>
          </Card.Title>
          <Card.Text>
            {props.question && data.uniprot_canonical_ac && (
              <>
                {props.question.text.split("{0}")[0]}
                <strong>{data.uniprot_canonical_ac}</strong>
                {props.question.text.split("{0}")[1]}
              </>
            )}

            {props.question && organism && props.question.organism && (
              <>
                {props.question.text.split("{0}")[0]}
                <strong>{organism.name}</strong>
                {props.question.text.split("{0}")[1]}
              </>
            )}

            {searchId && searchId === "sups" && <>{superSearchStrings.query}</>}

            {composition &&
              composition.map((compItem, index) => (
                <Row className="summary-table-col" key={index}>
                  <Col align="right" xs={6} sm={6} md={6} lg={6}>
                    {compItem.residue}:
                  </Col>
                  <Col align="left" xs={6} sm={6} md={6} lg={6}>
                    {compItem.min} - {compItem.max}
                  </Col>
                </Row>
              ))}

            {/* glycan id */}
            {glycan_identifier && (
              <>
              <Row className="summary-table-col" sm={12}>
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {glycanStrings.glycan_identifier.name}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {formatGlycans(glycanIdentifierShowMore && glycan_identifier.glycan_id_short === "" ? glycan_identifier.glycan_id : 
                  (glycanIdentifierShowMore ? glycan_identifier.glycan_id_short : glycan_identifier.glycan_id))}
                </Col>
              </Row>
              <Row>
                <Col align="right" xs={12} sm={12} md={12} lg={12}>
                  {glycan_identifier.glycan_id_short && glycan_identifier.glycan_id_short !== "" && (
                      <Button
                        style={{
                          marginLeft: "20px",
                          marginTop: "5px"
                        }}
                        className={"lnk-btn"}
                        variant="link"
                        onClick={() => {
                          setGlycanIdentifierShowMore(
                            !glycanIdentifierShowMore
                          );
                        }}
                      >
                        {glycanIdentifierShowMore
                          ? "Show More..."
                          : "Show Less..."}
                      </Button>
                    )}
                </Col>
              </Row>
              </>
            )}

            {/* glycan id subsumption */}
            {glycan_identifier && (
              <Row className="summary-table-col" sm={12}>
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {glycanStrings.glycan_id_subsumption.name}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {
                    advancedSearch.glycan_identifier.subsumption.filter(
                      (subsumption) => subsumption.id === glycan_identifier.subsumption
                    )[0].name
                  }
                </Col>
              </Row>
            )}

            {/* glycan typeahead */}
            {term && (
              <Row className="summary-table-col" sm={12}>
                <Col align="right">Search Term:</Col>
                <Col align="left">{term}</Col>
              </Row>
            )}
            {/* glycan typeahead */}
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

            {/* glycan mass */}
            {mass && mass.min && (
              <Row className="summary-table-col">
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {glycanStrings.mass.name}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {mass.min}&#8209;{mass.max}&nbsp;Da&nbsp;({mass_type})
                </Col>
              </Row>
            )}
            {/* glycan sugar */}
            {number_monosaccharides && number_monosaccharides.min && (
              <Row className="summary-table-col">
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {glycanStrings.number_monosaccharides.shortName}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {number_monosaccharides.min}&#8209;
                  {number_monosaccharides.max}
                </Col>
              </Row>
            )}

            {/* Oraganism */}
            {!props.question && organism && (
              <Row className="summary-table-col">
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {glycanStrings.organism.shortName}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {formatOrganisms(organism)}
                </Col>
              </Row>
            )}

            {/* Organism Annotation */}
            {!props.question && organism && (
              <Row className="summary-table-col" sm={12}>
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {glycanStrings.organism_annotation.shortName}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {
                    advancedSearch.organism.annotation_category.filter(
                      (annotation) => annotation.id === organism.annotation_category
                    )[0].name
                  }
                </Col>
              </Row>
            )}

            {glycan_type && (
              <Row className="summary-table-col">
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {glycanStrings.glycan_type.shortName}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {glycan_type}
                </Col>
              </Row>
            )}
            {glycan_subtype && (
              <Row className="summary-table-col">
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {glycanStrings.glycan_subtype.shortName}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {glycan_subtype}
                </Col>
              </Row>
            )}

            {glycan_name && (
              <Row className="summary-table-col">
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {glycanStrings.glycan_name.shortName}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {glycan_name}
                </Col>
              </Row>
            )}
            {protein_identifier && (
              <Row className="summary-table-col">
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {glycanStrings.protein_identifier.shortName}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {protein_identifier}
                </Col>
              </Row>
            )}
            {binding_protein_id && (
              <Row className="summary-table-col">
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {glycanStrings.binding_protein_id.shortName}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {binding_protein_id}
                </Col>
              </Row>
            )}
            {enzyme && enzyme.id && (
              <Row className="summary-table-col">
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {glycanStrings.enzyme.shortName}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {enzyme.id}
                </Col>
              </Row>
            )}
            {glycan_motif && (
              <Row className="summary-table-col">
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {glycanStrings.glycan_motif.shortName}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {glycan_motif}
                </Col>
              </Row>
            )}
            {pmid && (
              <Row className="summary-table-col">
                <Col align="right" xs={6} sm={6} md={6} lg={6}>
                  {glycanStrings.pmid.shortName}:
                </Col>
                <Col align="left" xs={6} sm={6} md={6} lg={6}>
                  {pmid}
                </Col>
              </Row>
            )}
          </Card.Text>
          <div className="pb-3">
            <Button
              type="button"
              className="gg-btn-outline mr-4"
              onClick={() => {
                window.location.reload();
              }}
            >
              Update Results
            </Button>
            <Button type="button" className="gg-btn-blue" onClick={onModifySearch}>
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

export default GlycanQuerySummary;
