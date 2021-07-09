/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useReducer } from "react";
import { getGlycanDetail, getGlycanImageUrl } from "../data/glycan";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Sidebar from "../components/navigation/Sidebar";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { Grid } from "@material-ui/core";
import { Col, Row, Image } from "react-bootstrap";
import { FiBookOpen } from "react-icons/fi";
import { groupEvidences, groupOrganismEvidences } from "../data/data-format";
import EvidenceList from "../components/EvidenceList";
import ClientPaginatedTable from "../components/ClientPaginatedTable";
import "../css/detail.css";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import DownloadButton from "../components/DownloadButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import relatedGlycansIcon from "../images/icons/related-glycans-icon.svg";
import sandBox from "../images/icons/sand-box.svg";
import DetailTooltips from "../data/json/detailTooltips.json";
import HelpTooltip from "../components/tooltip/HelpTooltip";
import LineTooltip from "../components/tooltip/LineTooltip";
import FeedbackWidget from "../components/FeedbackWidget";
import ReactCopyClipboard from "../components/ReactCopyClipboard";
import routeConstants from "../data/json/routeConstants";
import { logActivity } from "../data/logging";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import { axiosError } from "../data/axiosError";
import Button from "react-bootstrap/Button";
import stringConstants from "../data/json/stringConstants";
import { Link } from "react-router-dom";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Tab, Tabs, Container } from "react-bootstrap";
import CollapsableReference from "../components/CollapsableReference";
import DirectSearch from "../components/search/DirectSearch.js";
import { getGlycanSearch } from "../data/glycan";

const glycanStrings = stringConstants.glycan.common;
const glycanDirectSearch = stringConstants.glycan.direct_search;
const proteinStrings = stringConstants.protein.common;
const motifStrings = stringConstants.motif.common;

const items = [
  { label: stringConstants.sidebar.general.displayname, id: "General" },
  { label: stringConstants.sidebar.organism.displayname, id: "Organism" },

  {
    label: stringConstants.sidebar.names_synonyms.displayname,
    id: "Names",
  },
  { label: stringConstants.sidebar.motifs.displayname, id: "Motifs" },
  {
    label: stringConstants.sidebar.associated_glycan.displayname,
    id: "Associated-Protein",
  },
  {
    label: stringConstants.sidebar.glycan_binding_protein.displayname,
    id: "Glycan-Binding-Protein",
  },
  {
    label: stringConstants.sidebar.bio_Enzymes.displayname,
    id: "Biosynthetic-Enzymes",
  },
  {
    label: stringConstants.sidebar.subsumption.displayname,
    id: "Subsumption",
  },
  {
    label: stringConstants.sidebar.expression.displayname,
    id: "Expression",
  },
  {
    label: stringConstants.sidebar.digital_seq.displayname,
    id: "Digital-Sequence",
  },
  {
    label: stringConstants.sidebar.cross_ref.displayname,
    id: "Cross-References",
  },
  { label: stringConstants.sidebar.history.displayname, id: "History" },

  { label: stringConstants.sidebar.publication.displayname, id: "Publications" },
];

const CompositionDisplay = (props) => {
  return (
    <>
      {props.composition.map((item) => (
        <React.Fragment key={item.name}>
          {item.url ? (
            <>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.name}
              </a>
              <sub>{item.count} </sub>
              {"  "}
            </>
          ) : (
            <>
              {item.name}
              <sub>{item.count}</sub>
              {"  "}
            </>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

// function capitalizeFirstLetter(string) {
//   return string.charAt(0).toUpperCase() + string.slice(1);
// }
function addCommas(nStr) {
  nStr += "";
  var x = nStr.split(".");
  var x1 = x[0];
  var x2 = x.length > 1 ? "." + x[1] : "";
  var rgx = /(\d+)(\d{3})/;

  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
}

const getItemsCrossRef = (data) => {
  let itemscrossRef = [];

  //check data.
  if (data.crossref) {
    for (let crossrefitem of data.crossref) {
      let found = "";
      for (let databaseitem of itemscrossRef) {
        if (databaseitem.database === crossrefitem.database) {
          found = true;
          databaseitem.links.push({
            url: crossrefitem.url,
            id: crossrefitem.id,
          });
        }
      }
      if (!found) {
        itemscrossRef.push({
          database: crossrefitem.database,
          links: [
            {
              url: crossrefitem.url,
              id: crossrefitem.id,
            },
          ],
        });
      }
    }
  }
  return itemscrossRef;
};

const GlycanDetail = (props) => {
  let { id } = useParams();

  const [detailData, setDetailData] = useState({});
  const [nonExistent, setNonExistent] = useState(null);
  const [itemsCrossRef, setItemsCrossRef] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  const [expressionTabSelected, setExpressionTabSelected] = useState("");
  const [expressionWithtissue, setExpressionWithtissue] = useState([]);
  const [expressionWithcell, setExpressionWithcell] = useState([]);
  const [sideBarData, setSidebarData] = useState(items);
  const [subsumptionAncestor, setSubsumptionAncestor] = useState([]);
  const [subsumptionDescendant, setSubsumptionDescendant] = useState([]);
  const [subsumptionTabSelected, setSubsumptionTabSelected] = useState(["ancestor"]);
  // let history;

  useEffect(() => {
    setPageLoading(true);
    logActivity("user", id);
    const getGlycanDetailData = getGlycanDetail(id);

    getGlycanDetailData.then(({ data }) => {
      if (data.code) {
        let message = "Glycan Detail api call";
        logActivity("user", id, "No results. " + message);
        setPageLoading(false);
      } else {
        let detailDataTemp = data;
        if (data.subsumption) {
          const mapOfSubsumptionCategories = data.subsumption.reduce((collection, item) => {
            const category = item.relationship || logActivity("No results. ");
            return {
              ...collection,
              [category]: [...(collection[category] || []), item],
            };
          }, {});

          const withAncestor = mapOfSubsumptionCategories.ancestor || [];
          const withDescendant = mapOfSubsumptionCategories.descendant || [];

          const selectTab = ["ancestor", "descendant"].find(
            (category) =>
              mapOfSubsumptionCategories[category] &&
              mapOfSubsumptionCategories[category].length > 0
          );
          setSubsumptionAncestor(withAncestor);
          setSubsumptionDescendant(withDescendant);
          setSubsumptionTabSelected(selectTab);
        }
        if (detailDataTemp.expression) {
          const WithTissue = detailDataTemp.expression.filter((item) => item.tissue !== undefined);
          const WithCellline = detailDataTemp.expression.filter(
            (item) => item.cell_line !== undefined
          );
          setExpressionWithtissue(WithTissue);
          setExpressionWithcell(WithCellline);
          setExpressionTabSelected(WithTissue.length > 0 ? "with_tissue" : "with_cellline");
        }

        if (detailDataTemp.mass) {
          detailDataTemp.mass = addCommas(detailDataTemp.mass);
        }
        if (detailDataTemp.mass_pme) {
          detailDataTemp.mass_pme = addCommas(detailDataTemp.mass_pme);
        }
        if (detailDataTemp.glycoct) {
          detailDataTemp.glycoct = detailDataTemp.glycoct.replace(/ /g, "\n");
        }

        if (detailDataTemp.composition) {
          detailDataTemp.composition = detailDataTemp.composition
            .map((res, ind, arr) => {
              if (glycanStrings.composition[res.residue.toLowerCase()]) {
                res.name = glycanStrings.composition[res.residue.toLowerCase()].shortName;
                res.orderID = glycanStrings.composition[res.residue.toLowerCase()].orderID;
                return res;
              } else {
                let message = "New residue in Composition: " + res.residue;
                logActivity("error", id, message);
                res.name = res.residue;
                res.orderID =
                  parseInt(glycanStrings.composition["other"].orderID) -
                  (parseInt(arr.length) - parseInt(ind));
                return res;
              }
            })
            .sort(function (res1, res2) {
              return parseInt(res1.orderID) - parseInt(res2.orderID);
            });
        }

        if (detailDataTemp.publication) {
          detailDataTemp.publication = detailDataTemp.publication.sort(
            (a, b) => parseInt(b.date) - parseInt(a.date)
          );
        }
        setItemsCrossRef(getItemsCrossRef(detailDataTemp));
        setDetailData(detailDataTemp);
        setPageLoading(false);
        //new side bar
        let newSidebarData = sideBarData;
        if (!detailDataTemp.glytoucan || detailDataTemp.glytoucan.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "General", true);
        }
        if (!detailDataTemp.species || detailDataTemp.species.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Organism", true);
        }
        if (!detailDataTemp.names || detailDataTemp.names.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Names", true);
        }
        if (!detailDataTemp.motifs || detailDataTemp.motifs.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Motifs", true);
        }

        if (!detailDataTemp.glycoprotein || detailDataTemp.glycoprotein.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Associated-Protein", true);
        }
        if (!detailDataTemp.interactions || detailDataTemp.interactions.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Glycan-Binding-Protein", true);
        }
        if (!detailDataTemp.enzyme || detailDataTemp.enzyme.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Biosynthetic-Enzymes", true);
        }
        if (!detailDataTemp.subsumption || detailDataTemp.subsumption.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Subsumption", true);
        }
        if (!detailDataTemp.expression || detailDataTemp.expression.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Expression", true);
        }

        if (!detailDataTemp.iupac && !detailDataTemp.wurcs && !detailDataTemp.glycoct) {
          newSidebarData = setSidebarItemState(newSidebarData, "Digital-Sequence", true);
        }
        if (!detailDataTemp.crossref || detailDataTemp.crossref.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Cross-References", true);
        }
        if (!detailDataTemp.history || detailDataTemp.history.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "History", true);
        }
        if (!detailDataTemp.publication || detailDataTemp.publication.length === 0) {
          newSidebarData = setSidebarItemState(newSidebarData, "Publications", true);
        }
        setSidebarData(newSidebarData);
      }

      setTimeout(() => {
        const anchorElement = props.history.location.hash;
        if (anchorElement && document.getElementById(anchorElement.substr(1))) {
          document.getElementById(anchorElement.substr(1)).scrollIntoView({ behavior: "auto" });
        }
      }, 500);
    });
    getGlycanDetailData.catch(({ response }) => {
      if (
        response.data &&
        response.data.error_list &&
        response.data.error_list.length &&
        response.data.error_list[0].error_code &&
        response.data.error_list[0].error_code === "non-existent-record"
      ) {
        // history = response.data.history;
        setNonExistent({
          error_code: response.data.error_list[0].error_code,
          //reason: response.data.reason
          //history: response.data.history
        });
        setPageLoading(false);
      } else {
        let message = "Glycan Detail api call";
        axiosError(response, id, message, setPageLoading, setAlertDialogInput);
      }
    });
    // eslint-disable-next-line
  }, []);

  const {
    mass,
    glytoucan,
    inchi_key,
    species,
    composition,
    motifs,
    iupac,
    glycam,
    byonic,
    smiles_isomeric,
    inchi,
    classification,
    interactions,
    glycoct,
    publication,
    wurcs,
    enzyme,
    subsumption,
    expression,
    mass_pme,
    names,
    tool_support,
    history,
  } = detailData;

  let glycoprotein = [];
  if (detailData.glycoprotein) {
    glycoprotein = detailData.glycoprotein.map((glycoprotein, index) => ({
      ...glycoprotein,
      id: `${glycoprotein.uniprot_canonical_ac}-${index}`,
    }));
  }

  const setSidebarItemState = (items, itemId, disabledState) => {
    return items.map((item) => {
      return {
        ...item,
        disabled: item.id === itemId ? disabledState : item.disabled,
      };
    });
  };
  const organismEvidence = groupOrganismEvidences(species);

  const glycoProtienColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "25%" };
      },
      formatter: (cell, row) => {
        return (
          <EvidenceList
            key={row.position + row.uniprot_canonical_ac}
            evidences={groupEvidences(cell)}
          />
        );
      },
    },
    {
      dataField: "protein_name",
      text: proteinStrings.Protein_ShortName.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
    },
    {
      dataField: "uniprot_canonical_ac",
      text: proteinStrings.uniprot_canonical_ac.name,
      defaultSortField: "uniprot_canonical_ac",
      sort: true,

      headerStyle: (column, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View protein details">
          <Link to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>
            {row.uniprot_canonical_ac}
          </Link>
        </LineTooltip>
      ),
    },

    {
      dataField: "start_pos",
      text: proteinStrings.position.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      formatter: (value, row) =>
        value ? (
          <LineTooltip text="View siteview details">
            <Link to={`${routeConstants.siteview}${id}/${row.start_pos}`}>
              {row.residue}
              {row.start_pos}
              {row.start_pos !== row.end_pos && (
                <>
                  to {row.residue}
                  {row.end_pos}
                </>
              )}
            </Link>
          </LineTooltip>
        ) : (
          "Not Reported"
        ),
    },
  ];
  const glycanBindingProteinColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "25%" };
      },
      formatter: (cell, row) => {
        return <EvidenceList key={row.interactor_id} evidences={groupEvidences(cell)} />;
      },
    },
    {
      dataField: "interactor_name",
      text: proteinStrings.protein_name.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
    },
    {
      dataField: "interactor_id",
      text: proteinStrings.uniprot_canonical_ac.name,
      defaultSortField: "interactor_id",
      sort: true,

      headerStyle: (column, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View protein details">
          <Link to={routeConstants.proteinDetail + row.interactor_id}>{row.interactor_id}</Link>
        </LineTooltip>
      ),
    },
  ];
  const bioEnzymeColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "25%" };
      },
      formatter: (cell, row) => {
        return <EvidenceList key={row.uniprot_canonical_ac} evidences={groupEvidences(cell)} />;
      },
    },
    {
      dataField: "uniprot_canonical_ac",
      text: proteinStrings.uniprot_canonical_ac.name,
      sort: true,

      headerStyle: () => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View details">
          <Link to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>
            {row.uniprot_canonical_ac}
          </Link>
        </LineTooltip>
      ),
    },
    {
      dataField: "gene",
      text: proteinStrings.gene_name.name,
      defaultSortField: "gene",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "25%" };
      },

      formatter: (value, row) => (
        <LineTooltip text="View details on UniProt">
          <a href={row.gene_link} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        </LineTooltip>
      ),
    },

    {
      dataField: "protein_name",
      text: proteinStrings.Protein_ShortName.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
    },

    {
      dataField: "tax_name",
      text: glycanStrings.organism.shortName,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "20%" };
      },
      formatter: (value, row) => (
        <>
          {row.tax_name} {"("}
          <span className="text-capitalize">{row.tax_common_name}</span>
          {")"}
        </>
      ),
    },
  ];
  const subsumptionColumns = [
    {
      dataField: "id",
      text: glycanStrings.glycan_id.shortName,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View details">
          <Link to={routeConstants.glycanDetail + row.id}>{row.id}</Link>
        </LineTooltip>
      ),
    },
    {
      dataField: "image",
      text: glycanStrings.glycan_image.name,
      sort: false,
      selected: true,
      formatter: (value, row) => (
        <div className="img-wrapper">
          <img className="img-cartoon" src={getGlycanImageUrl(row.id)} alt="Glycan img" />
        </div>
      ),
      headerStyle: (colum, colIndex) => {
        return {
          textAlign: "left",
          backgroundColor: "#4B85B6",
          color: "white",
          whiteSpace: "nowrap",
        };
      },
    },
    {
      dataField: "type",
      text: "Type",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
    },
    // {
    //   dataField: "relationship",
    //   text: "Relationship",
    //   sort: true,
    //   headerStyle: (colum, colIndex) => {
    //     return { backgroundColor: "#4B85B6", color: "white" };
    //   },
    // },
  ];
  const expressionCellColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "25%" };
      },
      formatter: (cell, row) => {
        return (
          <EvidenceList
            key={row.position + row.uniprot_canonical_ac}
            evidences={groupEvidences(cell)}
          />
        );
      },
    },

    {
      dataField: "uniprot_canonical_ac",
      text: proteinStrings.uniprot_canonical_ac.name,
      defaultSortField: "uniprot_canonical_ac",
      sort: true,

      headerStyle: (column, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View protein details">
          <Link to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>
            {row.uniprot_canonical_ac}
          </Link>
        </LineTooltip>
      ),
    },
    {
      dataField: "start_pos",
      text: "Site",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      // formatter: (value, row) => <>{row.start}</>
    },
    {
      dataField: "residue",
      text: "Amino Acid",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      // formatter: (value, row) => <>{row.residue}</>
    },

    {
      dataField: "cell_line.name",
      text: "Cell Line Name",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
    },
    {
      dataField: "cell_line.cellosaurus_id",
      text: "Cellosaurus ID",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View Cell Line details ">
          <a href={row.cell_line.url} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        </LineTooltip>
      ),
    },
  ];
  const expressionTissueColumns = [
    {
      dataField: "evidence",
      text: proteinStrings.evidence.name,
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "25%" };
      },
      formatter: (cell, row) => {
        return (
          <EvidenceList
            key={row.position + row.uniprot_canonical_ac}
            evidences={groupEvidences(cell)}
          />
        );
      },
    },

    {
      dataField: "uniprot_canonical_ac",
      text: proteinStrings.uniprot_canonical_ac.name,
      defaultSortField: "uniprot_canonical_ac",
      sort: true,

      headerStyle: (column, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View protein details">
          <Link to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>
            {row.uniprot_canonical_ac}
          </Link>
        </LineTooltip>
      ),
    },
    {
      dataField: "start_pos",
      text: "Site",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      // formatter: (value, row) => <>{row.start_pos}</>
    },
    {
      dataField: "residue",
      text: "Amino Acid",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      // formatter: (value, row) => <>{row.residue}</>
    },
    {
      dataField: "tissue.name",
      text: "Tissue Name",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
    },
    {
      dataField: "tissue.uberon_id",
      text: "Uberon ID",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white", width: "15%" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View Tissue details">
          <a href={row.tissue.url} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        </LineTooltip>
      ),
    },
  ];
  const motifColumns = [
    {
      dataField: "image",
      text: glycanStrings.glycan_image.name,
      sort: false,
      selected: true,
      formatter: (value, row) => (
        <div className="img-wrapper">
          <img className="img-cartoon" src={getGlycanImageUrl(row.id)} alt="Glycan img" />
        </div>
      ),
      headerStyle: (colum, colIndex) => {
        return {
          textAlign: "left",
          backgroundColor: "#4B85B6",
          color: "white",
          whiteSpace: "nowrap",
        };
      },
    },
    {
      dataField: "id",
      text: motifStrings.motif_id.name,
      sort: true,

      headerStyle: () => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View details">
          <Link to={routeConstants.motifDetail + row.id}>{row.id}</Link>
        </LineTooltip>
      ),
    },
    {
      dataField: "name",
      text: motifStrings.motif_name.name,
      defaultSortField: "name",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { backgroundColor: "#4B85B6", color: "white" };
      },
      formatter: (value, row) => (
        <LineTooltip text="View details">
          <Link to={routeConstants.motifDetail + row.id}>{row.name}</Link>
        </LineTooltip>
      ),
    },
  ];
  // ==================================== //
  /**
   * Adding toggle collapse arrow icon to card header individualy.
   * @param {object} glytoucan_ac- glytoucan accession ID.
   **/
  const [collapsed, setCollapsed] = useReducer((state, newState) => ({ ...state, ...newState }), {
    general: true,
    organism: true,
    motif: true,
    glycoprotein: true,
    glycanBindingProtein: true,
    bioEnzyme: true,
    subsumption: true,
    expression: true,
    digitalSeq: true,
    crossref: true,
    publication: true,
    history: true,
    names: true,
  });
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  function toggleCollapse(name, value) {
    setCollapsed({ [name]: !value });
  }
  const expandIcon = <ExpandMoreIcon fontSize="large" />;
  const closeIcon = <ExpandLessIcon fontSize="large" />;

  // const ToggleIcon = ({open}) => open ? <ExpandLessIcon fontSize="large" /> : <ExpandMoreIcon fontSize="large" />
  // ===================================== //

  /**
   * Redirect and opens glytoucan_ac in a subsumption browser
   * @param {object} glytoucan_ac- glytoucan accession ID.
   **/
  function handleOpenSubsumptionBrowse(glytoucan_ac) {
    var url =
      //"https://raw.githack.com/glygen-glycan-data/GNOme/GlyGen_DEV/restrictions/GNOme_GlyGen.browser.html?focus=" +
      "http://gnome.glyomics.org/restrictions/GlyGen.StructureBrowser.html?focus=" + glytoucan_ac;
    window.open(url);
  }

  /**
   * Redirect and opens glytoucan_ac in a sand box
   * @param {object} glytoucan_ac- glytoucan accession ID.
   **/
  function handleOpenSandbox(glytoucan_ac) {
    var url = "https://glygen.ccrc.uga.edu/sandbox/explore.html?" + glytoucan_ac;
    window.open(url);
  }

  /**
   * Function to handle glycan direct search.
   **/
  const glycanSearch = (formObject) => {
    setPageLoading(true);
    logActivity("user", id, "Performing Direct Search");
    let message = "Direct Search query=" + JSON.stringify(formObject);
    getGlycanSearch(formObject)
      .then((response) => {
        if (response.data["list_id"] !== "") {
          logActivity("user", (id || "") + ">" + response.data["list_id"], message).finally(() => {
            props.history.push(routeConstants.glycanList + response.data["list_id"]);
          });
          setPageLoading(false);
        } else {
          let error = {
            response: {
              status: stringConstants.errors.defaultDialogAlert.id,
            },
          };
          axiosError(error, "", "No results. " + message, setPageLoading, setAlertDialogInput);
        }
      })
      .catch(function (error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  };

  if (nonExistent) {
    return (
      <Container className="tab-content-border2">
        <Alert className="erroralert" severity="error">
          {nonExistent.history && nonExistent.history.length ? (
            <>
              <AlertTitle> {id} is no longer valid Id</AlertTitle>
              <ul>
                {nonExistent.history.map((item) => (
                  <span className="recordInfo">
                    <li>{capitalizeFirstLetter(nonExistent.reason[0].description)}</li>
                  </span>
                ))}
              </ul>
            </>
          ) : (
            <>
              <AlertTitle>
                This Glycan <b>{id} </b> Record is not valid
              </AlertTitle>
            </>
          )}
        </Alert>
      </Container>
    );
  }

  return (
    <>
      {}
      <Row className="gg-baseline">
        <Col sm={12} md={12} lg={12} xl={3} className="sidebar-col">
          {/* <Sidebar items={items} /> */}
          <Sidebar items={sideBarData} />
        </Col>

        <Col sm={12} md={12} lg={12} xl={9} className="sidebar-page">
          <div className="sidebar-page-mb">
            <div className="content-box-md">
              <Row>
                <Grid item xs={12} sm={12} className="text-center">
                  <div className="horizontal-heading">
                    <h5>Look At</h5>
                    <h2>
                      {" "}
                      <span>
                        Details for Glycan
                        <strong>
                          {glytoucan && glytoucan.glytoucan_ac && <> {glytoucan.glytoucan_ac}</>}
                        </strong>
                      </span>
                    </h2>
                  </div>
                </Grid>
              </Row>
            </div>
            {props.history && props.history.length > 1 && (
              <div className="text-right gg-download-btn-width pb-3">
                <Button
                  type="button"
                  className="gg-btn-blue"
                  onClick={() => {
                    props.history.goBack();
                  }}
                >
                  Back
                </Button>
              </div>
            )}
            <div className="gg-download-btn-width">
              <DownloadButton
                types={[
                  {
                    display: stringConstants.download.glycan_image.displayname,
                    type: "png",
                    data: "glycan_image",
                  },
                  {
                    display: stringConstants.download.glycan_jsondata.displayname,
                    type: "json",
                    data: "glycan_detail",
                  },
                ]}
                dataType="glycan_detail"
                dataId={id}
              />
            </div>

            <React.Fragment>
              <Helmet>
                {getTitle("glycanDetail", {
                  glytoucan_ac: glytoucan && glytoucan.glytoucan_ac ? glytoucan.glytoucan_ac : "",
                })}
                {getMeta("glycanDetail")}
              </Helmet>
              <FeedbackWidget />
              <PageLoader pageLoading={pageLoading} />
              <DialogAlert
                alertInput={alertDialogInput}
                setOpen={(input) => {
                  setAlertDialogInput({ show: input });
                }}
              />
              {/* general */}
              <Accordion
                id="General"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.general.title}
                        text={DetailTooltips.glycan.general.text}
                        urlText={DetailTooltips.glycan.general.urlText}
                        url={DetailTooltips.glycan.general.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.general.displayname}
                    </h4>
                    <div className="float-right">
                      <span>
                        <Button
                          type="button"
                          className="gg-btn-blue"
                          disabled={tool_support && tool_support.sandbox === "yes" ? false : true}
                          onClick={() => {
                            handleOpenSandbox(glytoucan && glytoucan.glytoucan_ac);
                          }}
                        >
                          <span>
                            <Image className="pr-2" src={sandBox} alt="Sand Box" />
                          </span>
                          Sand Box
                        </Button>
                      </span>
                      <span>
                        <Button
                          type="button"
                          className="gg-btn-blue"
                          style={{
                            marginLeft: "10px",
                          }}
                          disabled={tool_support && tool_support.gnome === "yes" ? false : true}
                          onClick={() => {
                            handleOpenSubsumptionBrowse(glytoucan && glytoucan.glytoucan_ac);
                          }}
                        >
                          <span>
                            <Image
                              className="pr-2"
                              src={relatedGlycansIcon}
                              alt="Related glycans"
                            />
                          </span>
                          Related Glycans
                        </Button>
                      </span>
                      {/* <span className="pr-3">
												<a
													// eslint-disable-next-line
													href="javascript:void(0)"
													onClick={() => {
														handleOpenSubsumptionBrowse(
															glytoucan && glytoucan.glytoucan_ac
														);
													}}>
													<LineTooltip text="Related glycans">
														<Image
															src={relatedGlycansIcon}
															alt="Related glycans"
														/>
													</LineTooltip>
												</a>
											</span> */}
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() => toggleCollapse("general", collapsed.general)}
                        className="gg-green arrow-btn"
                      >
                        <span>{collapsed.general ? closeIcon : expandIcon}</span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <div>
                        {glytoucan && glytoucan.glytoucan_ac && (
                          <>
                            <span>
                              <img
                                className="img-cartoon"
                                src={getGlycanImageUrl(glytoucan.glytoucan_ac)}
                                alt="Glycan img"
                              />
                            </span>
                            <div>
                              <strong>{proteinStrings.glytoucan_ac.shortName}: </strong>
                              <a
                                href={glytoucan.glytoucan_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {glytoucan.glytoucan_ac}
                              </a>
                            </div>

                            <div>
                              {mass ? (
                                <>
                                  <strong> {glycanStrings.mass.shortName}: </strong>
                                  {mass} Da{" "}
                                  <DirectSearch
                                    text={glycanDirectSearch.mass.text}
                                    searchType={"glycan"}
                                    fieldType={glycanStrings.mass.id}
                                    fieldValue={mass}
                                    executeSearch={glycanSearch}
                                  />
                                </>
                              ) : (
                                <> </>
                              )}
                            </div>
                            <div>
                              {mass_pme ? (
                                <>
                                  <strong> {glycanStrings.mass_pme.shortName}: </strong>
                                  {mass_pme} Da{" "}
                                  <DirectSearch
                                    text={glycanDirectSearch.mass_pme.text}
                                    searchType={"glycan"}
                                    fieldType={glycanStrings.mass_pme.id}
                                    fieldValue={mass_pme}
                                    executeSearch={glycanSearch}
                                  />
                                </>
                              ) : (
                                <> </>
                              )}
                            </div>
                          </>
                        )}
                        {composition && (
                          <div>
                            <strong>Composition</strong>:{" "}
                            <CompositionDisplay composition={composition} />{" "}
                            <DirectSearch
                              text={glycanDirectSearch.composition.text}
                              searchType={"glycan"}
                              fieldType={glycanStrings.composition.id}
                              fieldValue={composition}
                              executeSearch={glycanSearch}
                            />
                          </div>
                        )}

                        {classification && classification.length && (
                          <div>
                            <Row>
                              <Col md="auto" className="pr-0">
                                <strong>
                                  {glycanStrings.glycan_type.name} /{" "}
                                  {glycanStrings.glycan_subtype.name}:{" "}
                                </strong>
                              </Col>
                              <Col className="pl-0">
                                {classification.map((Formatclassification) => (
                                  <React.Fragment
                                    key={`${Formatclassification.type.name}-${Formatclassification.subtype.name}`}
                                  >
                                    <span>
                                      {Formatclassification.type.url && (
                                        <a
                                          href={Formatclassification.type.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          &nbsp;{Formatclassification.type.name}
                                        </a>
                                      )}
                                      {!Formatclassification.type.url && (
                                        <>&nbsp;{Formatclassification.type.name}</>
                                      )}
                                      {Formatclassification.subtype &&
                                        Formatclassification.subtype.name !== "Other" && (
                                          <>
                                            &nbsp; <b>/</b> &nbsp;
                                            {Formatclassification.subtype.url && (
                                              <a
                                                href={Formatclassification.subtype.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                {Formatclassification.subtype.name}
                                              </a>
                                            )}
                                            {!Formatclassification.subtype.url && (
                                              <>{Formatclassification.subtype.name}</>
                                            )}
                                          </>
                                        )}
                                    </span>
                                    <span>
                                      <DirectSearch
                                        text={glycanDirectSearch.glycan_type.text}
                                        searchType={"glycan"}
                                        fieldType={glycanStrings.glycan_type.id}
                                        fieldValue={{
                                          type: Formatclassification.type.name,
                                          subtype:
                                            Formatclassification.subtype &&
                                            Formatclassification.subtype.name !== "Other"
                                              ? Formatclassification.subtype.name
                                              : "",
                                        }}
                                        executeSearch={glycanSearch}
                                      />
                                    </span>
                                    {<br />}
                                  </React.Fragment>
                                ))}{" "}
                              </Col>
                            </Row>
                          </div>
                        )}
                        {inchi_key && inchi_key.key && (
                          <>
                            <div>
                              <strong>{glycanStrings.inchi_key.name}: </strong>
                              <a href={inchi_key.url} target="_blank" rel="noopener noreferrer">
                                {inchi_key.key}
                              </a>
                            </div>
                          </>
                        )}
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/*  species */}
              <Accordion
                id="Organism"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.organism.title}
                        text={DetailTooltips.glycan.organism.text}
                        urlText={DetailTooltips.glycan.organism.urlText}
                        url={DetailTooltips.glycan.organism.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.organism.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() => toggleCollapse("organism", collapsed.organism)}
                        className="gg-green arrow-btn"
                      >
                        <span>{collapsed.organism ? closeIcon : expandIcon}</span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      <Row>
                        {organismEvidence &&
                          // For every organism object
                          Object.keys(organismEvidence).map((orgEvi) => (
                            // For every database for current organism object
                            <Col
                              xs={12}
                              sm={12}
                              md={4}
                              lg={4}
                              xl={4}
                              style={{ marginBottom: "10px" }}
                              key={orgEvi}
                            >
                              <>
                                <strong>{orgEvi}</strong> {"("}
                                <span className="text-capitalize">
                                  {organismEvidence[orgEvi].common_name}
                                </span>
                                {")"} {"["}
                                <LineTooltip text="View details on NCBI">
                                  <a
                                    href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${organismEvidence[orgEvi].taxid}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {organismEvidence[orgEvi].taxid}
                                  </a>
                                </LineTooltip>
                                {"]"}{" "}
                                <DirectSearch
                                  text={glycanDirectSearch.organism.text}
                                  searchType={"glycan"}
                                  fieldType={glycanStrings.organism.id}
                                  fieldValue={{
                                    organism_list: [
                                      {
                                        name: orgEvi,
                                        id: organismEvidence[orgEvi].taxid,
                                      },
                                    ],
                                    annotation_category: "",
                                    operation: "or",
                                  }}
                                  executeSearch={glycanSearch}
                                />
                                <EvidenceList evidences={organismEvidence[orgEvi].evidence} />
                              </>
                            </Col>
                          ))}
                        {!species && <p className="no-data-msg">No data available.</p>}
                      </Row>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/*  Names */}
              <Accordion
                id="Names"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.protein.names_synonyms.title}
                        text={DetailTooltips.protein.names_synonyms.text}
                        urlText={DetailTooltips.protein.names_synonyms.urlText}
                        url={DetailTooltips.protein.names_synonyms.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.names_synonyms.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() => toggleCollapse("names_synonyms", collapsed.names_synonyms)}
                        className="gg-green arrow-btn"
                      >
                        <span>{collapsed.names_synonyms ? closeIcon : expandIcon}</span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {names && names.length ? (
                        <ul className="list-style-none">
                          {names.map((nameObject) => (
                            <li key={nameObject.domain}>
                              <b>{nameObject.domain}</b>: {nameObject.name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No data available.</p>
                      )}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Motif */}
              <Accordion
                id="Motifs"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.motif.title}
                        text={DetailTooltips.glycan.motif.text}
                        urlText={DetailTooltips.glycan.motif.urlText}
                        url={DetailTooltips.glycan.motif.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.motifs.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() => toggleCollapse("motif", collapsed.motif)}
                        className="gg-green arrow-btn"
                      >
                        <span>{collapsed.motif ? closeIcon : expandIcon}</span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {motifs && motifs.length !== 0 && (
                        <ClientPaginatedTable
                          idField={"name"}
                          data={motifs}
                          columns={motifColumns}
                          defaultSortField={"name"}
                          onClickTarget={"#motif"}
                        />
                      )}
                      {!motifs && <p>No data available.</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Associated-Protein */}
              <Accordion
                id="Associated-Protein"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.glycoproteins.title}
                        text={DetailTooltips.glycan.glycoproteins.text}
                        urlText={DetailTooltips.glycan.glycoproteins.urlText}
                        url={DetailTooltips.glycan.glycoproteins.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.associated_glycan.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() => toggleCollapse("glycoprotein", collapsed.glycoprotein)}
                        className="gg-green arrow-btn"
                      >
                        <span>{collapsed.glycoprotein ? closeIcon : expandIcon}</span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {glycoprotein && glycoprotein.length !== 0 && (
                        <ClientPaginatedTable
                          data={glycoprotein}
                          columns={glycoProtienColumns}
                          defaultSortField={"uniprot_canonical_ac"}
                          onClickTarget={"#glycoprotein"}
                        />
                      )}
                      {!glycoprotein.length && <p>No data available.</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Glycan Binding Protein */}
              <Accordion
                id="Glycan-Binding-Protein"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.glycan_binding_protein.title}
                        text={DetailTooltips.glycan.glycan_binding_protein.text}
                        urlText={DetailTooltips.glycan.glycan_binding_protein.urlText}
                        url={DetailTooltips.glycan.glycan_binding_protein.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.glycan_binding_protein.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() =>
                          toggleCollapse("glycanBindingProtein", collapsed.glycanBindingProtein)
                        }
                        className="gg-green arrow-btn"
                      >
                        <span>{collapsed.glycanBindingProtein ? closeIcon : expandIcon}</span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {interactions && interactions.length !== 0 && (
                        <ClientPaginatedTable
                          idField={"interactor_id"}
                          data={interactions}
                          columns={glycanBindingProteinColumns}
                          defaultSortField={"interactor_id"}
                          onClickTarget={"#glycanBindingProtein"}
                        />
                      )}
                      {!interactions && <p>No data available.</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Biosynthetic Enzymes */}
              <Accordion
                id="Biosynthetic-Enzymes"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.biosyntheticEnzyme.title}
                        text={DetailTooltips.glycan.biosyntheticEnzyme.text}
                        urlText={DetailTooltips.glycan.biosyntheticEnzyme.urlText}
                        url={DetailTooltips.glycan.biosyntheticEnzyme.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.bio_Enzymes.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() => toggleCollapse("bioEnzyme", collapsed.bioEnzyme)}
                        className="gg-green arrow-btn"
                      >
                        <span>{collapsed.bioEnzyme ? closeIcon : expandIcon}</span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {enzyme && enzyme.length !== 0 && (
                        <ClientPaginatedTable
                          idField={"uniprot_canonical_ac"}
                          data={enzyme}
                          columns={bioEnzymeColumns}
                          defaultSortField={"gene"}
                          onClickTarget={"#biosyntheticenzymes"}
                        />
                      )}
                      {!enzyme && <p>No data available.</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Subsumption*/}
              <Accordion
                id="Subsumption"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.subsumption.title}
                        text={DetailTooltips.glycan.subsumption.text}
                        urlText={DetailTooltips.glycan.subsumption.urlText}
                        url={DetailTooltips.glycan.subsumption.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.subsumption.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() => toggleCollapse("subsumption", collapsed.subsumption)}
                        className="gg-green arrow-btn"
                      >
                        <span>{collapsed.subsumption ? closeIcon : expandIcon}</span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {subsumption && subsumption.length !== 0 && (
                        <Tabs
                          activeKey={subsumptionTabSelected}
                          transition={false}
                          mountOnEnter={true}
                          unmountOnExit={true}
                          onSelect={(key) => {
                            setSubsumptionTabSelected(key);
                          }}
                        >
                          <Tab eventKey="ancestor" title="Ancestor">
                            <Container className="tab-content-padding">
                              {subsumptionAncestor && subsumptionAncestor.length > 0 && (
                                <ClientPaginatedTable
                                  idField={"id"}
                                  data={subsumptionAncestor}
                                  columns={subsumptionColumns}
                                  defaultSortField={"id"}
                                  onClickTarget={"#subsumption"}
                                />
                              )}
                              {!subsumptionAncestor.length && <p>No data available.</p>}
                            </Container>
                          </Tab>
                          <Tab eventKey="descendant" title="Descendant">
                            <Container className="tab-content-padding">
                              {subsumptionDescendant && subsumptionDescendant.length > 0 && (
                                <ClientPaginatedTable
                                  idField={"id"}
                                  data={subsumptionDescendant}
                                  columns={subsumptionColumns}
                                  defaultSortField={"id"}
                                  onClickTarget={"#subsumption"}
                                />
                              )}
                              {!subsumptionDescendant.length && <p>No data available.</p>}
                            </Container>
                          </Tab>
                        </Tabs>
                      )}
                      {!subsumption && <p>No data available.</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Expression */}
              <Accordion
                id="Expression"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.expression.title}
                        text={DetailTooltips.glycan.expression.text}
                        urlText={DetailTooltips.glycan.expression.urlText}
                        url={DetailTooltips.glycan.expression.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.expression.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() => toggleCollapse("expression", collapsed.expression)}
                        className="gg-green arrow-btn"
                      >
                        <span>{collapsed.expression ? closeIcon : expandIcon}</span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {expression && expression.length !== 0 && (
                        <Tabs
                          defaultActiveKey={
                            expressionWithtissue && expressionWithtissue.length > 0
                              ? "with_tissue"
                              : "with_cellline"
                          }
                          transition={false}
                          mountOnEnter={true}
                          unmountOnExit={true}
                        >
                          <Tab
                            eventKey="with_tissue"
                            title="Tissue Expression"
                            //disabled={(!mutataionWithdisease || (mutataionWithdisease.length === 0))}
                          >
                            <Container className="tab-content-padding">
                              {expressionWithtissue && expressionWithtissue.length > 0 && (
                                <ClientPaginatedTable
                                  idField={"start_pos"}
                                  data={expressionWithtissue}
                                  columns={expressionTissueColumns}
                                  onClickTarget={"#expression"}
                                  defaultSortField="start_pos"
                                />
                              )}
                              {!expressionWithtissue.length && <p>No data available.</p>}
                              {!expressionWithtissue.length && <p>No data available.</p>}
                            </Container>
                          </Tab>
                          <Tab eventKey="with_cellline" title="Cell Line Expression ">
                            <Container className="tab-content-padding">
                              {expressionWithcell && expressionWithcell.length > 0 && (
                                <ClientPaginatedTable
                                  data={expressionWithcell}
                                  columns={expressionCellColumns}
                                  onClickTarget={"#expression"}
                                  defaultSortField="position"
                                />
                              )}
                              {!expressionWithcell.length && <p>No data available.</p>}
                            </Container>
                          </Tab>
                        </Tabs>
                      )}

                      {!expression && <p>No data available.</p>}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Digital Sequence */}
              <Accordion
                id="Digital-Sequence"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.digitalSequence.title}
                        text={DetailTooltips.glycan.digitalSequence.text}
                        urlText={DetailTooltips.glycan.digitalSequence.urlText}
                        url={DetailTooltips.glycan.digitalSequence.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.digital_seq.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() => toggleCollapse("digitalSeq", collapsed.digitalSeq)}
                        className="gg-green arrow-btn"
                      >
                        <span>{collapsed.digitalSeq ? closeIcon : expandIcon}</span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body className="text-responsive">
                      <div>
                        {iupac ? (
                          <>
                            <Row>
                              <Col xs={6} sm={6}>
                                {" "}
                                <strong>{glycanStrings.iupac.name}</strong>
                              </Col>{" "}
                              <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                                <ReactCopyClipboard value={iupac} />
                              </Col>
                            </Row>
                            <span className="text-overflow">{iupac} </span>
                          </>
                        ) : (
                          <span> </span>
                        )}

                        {wurcs ? (
                          <>
                            <Row>
                              <Col xs={6} sm={6}>
                                {" "}
                                <strong>{glycanStrings.WURCS.name}</strong>
                              </Col>{" "}
                              <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                                <ReactCopyClipboard value={wurcs} />
                              </Col>
                            </Row>
                            <span className="text-overflow">{wurcs} </span>
                          </>
                        ) : (
                          <span> </span>
                        )}

                        {glycoct ? (
                          <>
                            <Row>
                              <Col xs={6} sm={6}>
                                {" "}
                                <strong>{glycanStrings.GlycoCT.name}</strong>
                              </Col>{" "}
                              <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                                <ReactCopyClipboard value={glycoct} />
                              </Col>
                            </Row>
                            <span id="text_element" className="text-overflow">
                              {glycoct}
                            </span>
                          </>
                        ) : (
                          <span> </span>
                        )}

                        {inchi ? (
                          <>
                            <Row>
                              <Col xs={6} sm={6}>
                                <strong>{glycanStrings.inchi_key.shortName}</strong>
                              </Col>
                              <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                                <ReactCopyClipboard value={inchi} />
                              </Col>
                            </Row>
                            <span className="text-overflow">{inchi}</span>
                          </>
                        ) : (
                          <span> </span>
                        )}

                        {glycam ? (
                          <>
                            <Row>
                              <Col xs={6} sm={6}>
                                <strong>{glycanStrings.GLYCAM_IUPAC.shortName}</strong>
                              </Col>
                              <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                                <ReactCopyClipboard value={glycam} />
                              </Col>
                            </Row>
                            <span className="text-overflow">{glycam}</span>
                          </>
                        ) : (
                          <span> </span>
                        )}
                        {byonic ? (
                          <>
                            <Row>
                              <Col xs={6} sm={6}>
                                <strong>{glycanStrings.byonic.shortName}</strong>
                              </Col>
                              <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                                <ReactCopyClipboard value={byonic} />
                              </Col>
                            </Row>
                            <span className="text-overflow">{byonic}</span>
                          </>
                        ) : (
                          <span> </span>
                        )}
                        {smiles_isomeric ? (
                          <>
                            <Row>
                              <Col xs={6} sm={6}>
                                <strong>{glycanStrings.Isomeric_SMILES.shortName}</strong>
                              </Col>
                              <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                                <ReactCopyClipboard value={smiles_isomeric} />
                              </Col>
                            </Row>
                            <span className="text-overflow">{smiles_isomeric}</span>
                          </>
                        ) : (
                          <span> </span>
                        )}
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* Cross References */}
              <Accordion
                id="Cross-References"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.crossReferences.title}
                        text={DetailTooltips.glycan.crossReferences.text}
                        urlText={DetailTooltips.glycan.crossReferences.urlText}
                        url={DetailTooltips.glycan.crossReferences.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.cross_ref.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        eventKey="0"
                        onClick={() => toggleCollapse("crossref", collapsed.crossref)}
                        className="gg-green arrow-btn"
                      >
                        <span>{collapsed.crossref ? closeIcon : expandIcon}</span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {itemsCrossRef && itemsCrossRef.length ? (
                        <div>
                          <ul className="list-style-none">
                            {/* <Row> */}

                            {itemsCrossRef.map((crossRef, index) => (
                              <li key={`${crossRef.database}-${index}`}>
                                <CollapsableReference
                                  database={crossRef.database}
                                  links={crossRef.links}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <span>No data available.</span>
                      )}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* history */}
              <Accordion
                id="History"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.glycan.history.title}
                        text={DetailTooltips.glycan.history.text}
                        urlText={DetailTooltips.glycan.history.urlText}
                        url={DetailTooltips.glycan.history.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.history.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        // as={Card.Header}
                        eventKey="0"
                        onClick={() => toggleCollapse("history", collapsed.history)}
                        className="gg-green arrow-btn"
                      >
                        <span>{collapsed.history ? closeIcon : expandIcon}</span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0" out={(collapsed.history = "false")}>
                    <Card.Body>
                      {history && history.length && (
                        <>
                          {history.map((historyItem) => (
                            <ul className="pl-3" key={historyItem.description}>
                              <li>{capitalizeFirstLetter(historyItem.description)} </li>
                            </ul>
                          ))}
                        </>
                      )}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {/* publication */}
              <Accordion
                id="Publications"
                defaultActiveKey="0"
                className="panel-width"
                style={{ padding: "20px 0" }}
              >
                <Card>
                  <Card.Header className="panelHeadBgr">
                    <span className="gg-green d-inline">
                      <HelpTooltip
                        title={DetailTooltips.motif.publications.title}
                        text={DetailTooltips.motif.publications.text}
                        urlText={DetailTooltips.motif.publications.urlText}
                        url={DetailTooltips.motif.publications.url}
                        helpIcon="gg-helpicon-detail"
                      />
                    </span>
                    <h4 className="gg-green d-inline">
                      {stringConstants.sidebar.publication.displayname}
                    </h4>
                    <div className="float-right">
                      <Accordion.Toggle
                        // as={Card.Header}
                        eventKey="0"
                        onClick={() => toggleCollapse("publication", collapsed.publication)}
                        className="gg-green arrow-btn"
                      >
                        <span>{collapsed.publication ? closeIcon : expandIcon}</span>
                      </Accordion.Toggle>
                    </div>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0" out={(collapsed.publication = "false")}>
                    <Card.Body className="card-padding-zero">
                      <Table hover fluid="true">
                        {publication && (
                          <tbody className="table-body">
                            {publication.map((pub, pubIndex) => (
                              <tr className="table-row">
                                <td key={pubIndex}>
                                  <div>
                                    <div>
                                      <h5 style={{ marginBottom: "3px" }}>
                                        <strong>{pub.title}</strong>{" "}
                                      </h5>
                                    </div>
                                    <div>{pub.authors}</div>
                                    <div>
                                      {pub.journal} <span>&nbsp;</span>({pub.date})
                                    </div>
                                    <div>
                                      {pub.reference.map((ref) => (
                                        <>
                                          <FiBookOpen />
                                          <span style={{ paddingLeft: "15px" }}>
                                            {/* {glycanStrings.pmid.shortName}: */}
                                            {ref.type}:
                                          </span>{" "}
                                          <Link
                                            to={`${routeConstants.publicationDetail}${ref.id}/${ref.type}`}
                                          >
                                            <>{ref.id}</>
                                          </Link>{" "}
                                          {/* <a
                                            href={ref.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <>{ref.id}</>
                                          </a>{" "} */}
                                          <DirectSearch
                                            text={glycanDirectSearch.pmid.text}
                                            searchType={"glycan"}
                                            fieldType={glycanStrings.pmid.id}
                                            fieldValue={ref.id}
                                            executeSearch={glycanSearch}
                                          />
                                        </>
                                      ))}
                                    </div>
                                    <EvidenceList
                                      inline={true}
                                      evidences={groupEvidences(pub.evidence)}
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        )}
                      </Table>
                      {!publication && (
                        <p className="no-data-msg-publication">No data available.</p>
                      )}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </React.Fragment>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default GlycanDetail;
