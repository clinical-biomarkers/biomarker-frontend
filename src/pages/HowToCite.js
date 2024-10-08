import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { useLocation } from "react-router-dom";
import { getTitle, getMeta } from "../utils/head";
import CssBaseline from "@mui/material/CssBaseline";
import VerticalHeadingLogo from "../components/headings/VerticalHeadingLogo";
import PanelHowToCite from "../components/PanelHowToCite";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import howToCiteData from "../data/json/howToCiteData";
import { Row, Col } from "react-bootstrap";
import Sidebar from "../components/navigation/Sidebar";
import { logActivity } from "../data/logging";
// https://zbib.org/   to generate .RIS file

const HowToCite = (props) => {
  const location = useLocation();

  const vertHeadHowToCite = {
    h5VerticalText: "Citations",
    h2textTop: "Our",
    h2textBottomStrongBefore: "Publications & Citations",
  };

  const items = [
    { label: "How To Cite", id: "How-To-Cite" },
    { label: "Our Papers", id: "Our-Papers" },
    { label: "Related Papers", id: "Related-Papers" },
    { label: "Website Citation", id: "Website-Citation" },
  ];
  useEffect(() => {

    let anchorElement = location.hash;
    if (anchorElement === undefined || anchorElement === null || anchorElement === "") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    logActivity();
  }, []);

  return (
    <>
      <Helmet>
        {getTitle("howToCite")}
        {getMeta("howToCite")}
      </Helmet>
      <CssBaseline />
      <Row className="gg-baseline">
        <Col sm={12} md={12} lg={12} xl={3} className="sidebar-col">
          <Sidebar items={items} />
        </Col>
        <Col sm={12} md={12} lg={12} xl={9} className="sidebar-page">
          <div className="sidebar-page-mb">
            <VerticalHeadingLogo post={vertHeadHowToCite} />
            <PanelHowToCite id="How-To-Cite" data={howToCiteData.howToCite} />
            <PanelHowToCite id="Our-Papers" data={howToCiteData.ourPapers} />
            <PanelHowToCite id="Related-Papers" data={howToCiteData.relatedPapers} />
            <PanelHowToCite id="Website-Citation" data={howToCiteData.websiteCitation} />
          </div>
        </Col>
      </Row>
    </>
  );
};
export default HowToCite;
