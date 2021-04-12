import React, { useEffect, useReducer, useState } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import PageLoader from "../components/load/PageLoader";
import TextAlert from "../components/alert/TextAlert";
import DialogAlert from "../components/alert/DialogAlert";
import ProteinAdvancedSearch from "../components/search/ProteinAdvancedSearch";
import SimpleSearchControl from "../components/search/SimpleSearchControl";
import { Tab, Tabs, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "../css/Search.css";
import proteinSearchData from "../data/json/proteinSearch";
import stringConstants from "../data/json/stringConstants";
import routeConstants from "../data/json/routeConstants";
import { logActivity } from "../data/logging";
import { axiosError } from "../data/axiosError";
import {
  getProteinSearch,
  getProteinSimpleSearch,
  getProteinList,
  getProteinInit
} from "../data/protein";
import FeedbackWidget from "../components/FeedbackWidget";
import ProteinTutorial from "../components/tutorial/ProteinTutorial";

/**
 * Protein search component for showing protein search tabs.
 */
const ProteinSearch = props => {
  let { id } = useParams("");
  const [initData, setInitData] = useState({});
  const [proSimpleSearchCategory, setProSimpleSearchCategory] = useState("any");
  const [proSimpleSearchTerm, setProSimpleSearchTerm] = useState("");
  const [proAdvSearchData, setProAdvSearchData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      proteinId: "",
      proRefSeqId: "",
      proMass: [260, 3906488],
      proMassInput: [
        Number(260).toLocaleString("en-US"),
        Number(3906488).toLocaleString("en-US")
      ],
      proMassRange: [260, 3906488],
      proOrganism: { id: "0", name: "All" },
      proteinName: "",
      proGeneName: "",
      proGOName: "",
      proGOId: "",
      proAminoAcid: [],
      proAminoAcidOperation: "or",
      proSequence: "",
      proPathwayId: "",
      proPubId: "",
      proGlyEvidence: "",
      proDiseaseName: "",
      proDiseaseId: "",
      proAttachedGlycanId: "",
      proBindingGlycanId: "",
      proGlycosylationType: "",
      proAdvSearchValError: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ]
    }
  );
  const [proActTabKey, setProActTabKey] = useState("Simple-Search");
  const [pageLoading, setPageLoading] = useState(true);
  const [alertTextInput, setAlertTextInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  let simpleSearch = proteinSearchData.simple_search;
  let advancedSearch = proteinSearchData.advanced_search;
  let proteinData = stringConstants.protein;
  let commonProteinData = proteinData.common;

  /**
   * useEffect for retriving data from api and showing page loading effects.
   */
  useEffect(() => {
    setPageLoading(true);
    logActivity();
    document.addEventListener("click", () => {
      setAlertTextInput({ show: false });
    });
    getProteinInit()
      .then(response => {
        let initData = response.data;
        setProAdvSearchData({
          proMass: [
            Math.floor(initData.protein_mass.min),
            Math.ceil(initData.protein_mass.max)
          ],
          proMassInput: [
            Math.floor(initData.protein_mass.min).toLocaleString("en-US"),
            Math.ceil(initData.protein_mass.max).toLocaleString("en-US")
          ],
          proMassRange: [
            Math.floor(initData.protein_mass.min),
            Math.ceil(initData.protein_mass.max)
          ]
        });

        setInitData(initData);
        const anchorElement = props.history.location.hash;
        if (anchorElement) {
          setProActTabKey(anchorElement.substr(1));
        } else {
          setProActTabKey("Simple-Search");
        }
        if (id === undefined) setPageLoading(false);

        id &&
          getProteinList(id, 1)
            .then(({ data }) => {
              logActivity("user", id, "Search modification initiated");
              if (
                data.cache_info.query.query_type ===
                proteinData.simple_search.query_type.name
              ) {
                setProSimpleSearchCategory(
                  data.cache_info.query.term_category
                    ? data.cache_info.query.term_category
                    : "any"
                );
                setProSimpleSearchTerm(
                  data.cache_info.query.term ? data.cache_info.query.term : ""
                );
                setProActTabKey("Simple-Search");
                setPageLoading(false);
              } else {
                setProAdvSearchData({
                  proteinId:
                    data.cache_info.query.uniprot_canonical_ac === undefined
                      ? ""
                      : data.cache_info.query.uniprot_canonical_ac + ",",
                  proRefSeqId:
                    data.cache_info.query.refseq_ac === undefined
                      ? ""
                      : data.cache_info.query.refseq_ac,
                  proMass:
                    data.cache_info.query.mass === undefined
                      ? [
                          Math.floor(initData.protein_mass.min),
                          Math.ceil(initData.protein_mass.max)
                        ]
                      : [
                          Math.floor(data.cache_info.query.mass.min),
                          Math.ceil(data.cache_info.query.mass.max)
                        ],
                  proMassInput:
                    data.cache_info.query.mass === undefined
                      ? [
                          Math.floor(initData.protein_mass.min).toLocaleString(
                            "en-US"
                          ),
                          Math.ceil(initData.protein_mass.max).toLocaleString(
                            "en-US"
                          )
                        ]
                      : [
                          Math.floor(
                            data.cache_info.query.mass.min
                          ).toLocaleString("en-US"),
                          Math.ceil(
                            data.cache_info.query.mass.max
                          ).toLocaleString("en-US")
                        ],
                  proOrganism:
                    data.cache_info.query.organism === undefined
                      ? {
                          id: advancedSearch.organism.placeholderId,
                          name: advancedSearch.organism.placeholderName
                        }
                      : {
                          id: data.cache_info.query.organism.id,
                          name: data.cache_info.query.organism.name
                        },
                  proteinName:
                    data.cache_info.query.protein_name === undefined
                      ? ""
                      : data.cache_info.query.protein_name,
                  proGeneName:
                    data.cache_info.query.gene_name === undefined
                      ? ""
                      : data.cache_info.query.gene_name,
                  proGOName:
                    data.cache_info.query.go_term === undefined
                      ? ""
                      : data.cache_info.query.go_term,
                  proGOId:
                    data.cache_info.query.go_id === undefined
                      ? ""
                      : data.cache_info.query.go_id,
                  proAminoAcid:
                    data.cache_info.query.glycosylated_aa === undefined
                      ? []
                      : data.cache_info.query.glycosylated_aa.aa_list.map(
                          aminoAcid => {
                            return initData.aa_list.find(aa => {
                              return aa.key === aminoAcid;
                            });
                          }
                        ),
                  proAminoAcidOperation:
                    data.cache_info.query.glycosylated_aa === undefined
                      ? "or"
                      : data.cache_info.query.glycosylated_aa.operation,
                  proSequence:
                    data.cache_info.query.sequence === undefined
                      ? ""
                      : data.cache_info.query.sequence.aa_sequence,
                  proPathwayId:
                    data.cache_info.query.pathway_id === undefined
                      ? ""
                      : data.cache_info.query.pathway_id,
                  proPubId:
                    data.cache_info.query.pmid === undefined
                      ? ""
                      : data.cache_info.query.pmid,
                  proGlyEvidence:
                    data.cache_info.query.glycosylation_evidence === undefined
                      ? advancedSearch.glycosylation_evidence.placeholderId
                      : data.cache_info.query.glycosylation_evidence,
                  proGlycosylationType:
                    data.cache_info.query.glycosylation_type === undefined
                      ? advancedSearch.glycosylation_type.placeholderId
                      : data.cache_info.query.glycosylation_type,
                  proDiseaseName:
                    data.cache_info.query.disease_name === undefined
                      ? ""
                      : data.cache_info.query.disease_name,
                  proDiseaseId:
                    data.cache_info.query.disease_id === undefined
                      ? ""
                      : data.cache_info.query.disease_id,
                  proAttachedGlycanId:
                    data.cache_info.query.attached_glycan_id === undefined
                      ? ""
                      : data.cache_info.query.attached_glycan_id,
                  proBindingGlycanId:
                    data.cache_info.query.binding_glycan_id === undefined
                      ? ""
                      : data.cache_info.query.binding_glycan_id
                });

                setProActTabKey("Advanced-Search");
                setPageLoading(false);
              }
            })
            .catch(function(error) {
              let message = "list api call";
              axiosError(
                error,
                "",
                message,
                setPageLoading,
                setAlertDialogInput
              );
            });
      })
      .catch(function(error) {
        let message = "search_init api call";
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  }, [id, proteinData]);

  /**
   * Function to handle protein simple search.
   **/
  const proteinSimpleSearch = () => {
    var formjsonSimple = {
      [commonProteinData.operation.id]: "AND",
      [proteinData.simple_search.query_type.id]:
        proteinData.simple_search.query_type.name,
      [commonProteinData.term.id]: proSimpleSearchTerm,
      [commonProteinData.term_category.id]: proSimpleSearchCategory
    };
    logActivity("user", id, "Performing Simple Search");
    let message = "Simple Search query=" + JSON.stringify(formjsonSimple);
    getProteinSimpleSearch(formjsonSimple)
      .then(response => {
        if (response.data["list_id"] !== "") {
          logActivity(
            "user",
            (id || "") + ">" + response.data["list_id"],
            message
          ).finally(() => {
            props.history.push(
              routeConstants.proteinList + response.data["list_id"]
            );
          });
          setPageLoading(false);
        } else {
          logActivity("user", "", "No results. " + message);
          setPageLoading(false);
          setAlertTextInput({
            show: true,
            id: stringConstants.errors.simpleSerarchError.id
          });
          window.scrollTo(0, 0);
        }
      })
      .catch(function(error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  };

  /**
   * Forms searchjson from the form values submitted
   * @param {string} input_query_type query search
   * @param {string} input_protein_id user protein input
   * @param {string} input_refseq_id user input
   * @param {number} input_mass_min user mass min input
   * @param {number} input_mass_max user mass max input
   * @param {string} input_organism organism input
   * @param {string} input_protein_name user input
   * @param {string} input_gene_name user input
   * @param {string} input_go_term user input
   * @param {string} input_go_id user input
   * @param {string} input_glycan user input
   * @param {string} input_glycosylated_aa user input
   * @param {string} input_glycosylated_aa_operation user input
   * @param {string} input_sequence user input
   * @param {string} input_pathway_id user input
   * @param {string} input_pmid user input
   * @param {string} input_relation user input
   * @param {string} input_disease_name user input
   * @param {string} input_disease_id user input
   * @param {string} input_attached_glycan_id user input
   * @param {string} input_binding_glycan_id user input
   * @return {string} returns json
   */
  function searchJson(
    input_query_type,
    input_protein_id,
    input_refseq_id,
    input_mass_min,
    input_mass_max,
    input_organism,
    input_protein_name,
    input_gene_name,
    input_go_term,
    input_go_id,
    input_glycosylated_aa,
    input_glycosylated_aa_operation,
    input_sequence,
    input_pathway_id,
    input_pmid,
    input_glycosylation_evidence,
    input_glycosylation_type,
    input_disease_name,
    input_disease_id,
    input_attached_glycan_id,
    input_binding_glycan_id
  ) {
    var uniprot_id = input_protein_id;
    if (uniprot_id) {
      uniprot_id = input_protein_id.trim();
      uniprot_id = uniprot_id.replace(/\u200B/g, "");
      uniprot_id = uniprot_id.replace(/\u2011/g, "-");
      uniprot_id = uniprot_id.replace(/\s+/g, ",");
      uniprot_id = uniprot_id.replace(/,+/g, ",");
      var index = uniprot_id.lastIndexOf(",");
      if (index > -1 && index + 1 === uniprot_id.length) {
        uniprot_id = uniprot_id.substr(0, index);
      }
    }

    var sequences;
    if (input_sequence) {
      sequences = {
        type: "exact",
        aa_sequence: input_sequence
      };
    }

    var selected_organism = undefined;
    if (
      input_organism &&
      input_organism.id !== advancedSearch.organism.placeholderId
    ) {
      selected_organism = {
        id: input_organism.id,
        name: input_organism.name
      };
    }
    var glyco_aa = undefined;
    if (input_glycosylated_aa && input_glycosylated_aa.length > 0) {
      glyco_aa = {
        aa_list: input_glycosylated_aa,
        operation: input_glycosylated_aa_operation
      };
    }

    var input_mass = undefined;
    if (
      initData.protein_mass.min !== input_mass_min ||
      initData.protein_mass.max !== input_mass_max
    ) {
      input_mass = {
        min: parseInt(input_mass_min),
        max: parseInt(input_mass_max)
      };
    }

    var formjson = {
      [commonProteinData.operation.id]: "AND",
      [proteinData.advanced_search.query_type.id]: input_query_type,
      [commonProteinData.uniprot_canonical_ac.id]: uniprot_id
        ? uniprot_id
        : undefined,
      [commonProteinData.refseq_ac.id]: input_refseq_id
        ? input_refseq_id
        : undefined,
      [commonProteinData.mass.id]: input_mass,
      [commonProteinData.organism.id]: selected_organism,
      [commonProteinData.protein_name.id]: input_protein_name
        ? input_protein_name
        : undefined,
      [commonProteinData.gene_name.id]: input_gene_name
        ? input_gene_name
        : undefined,
      [commonProteinData.go_term.id]: input_go_term ? input_go_term : undefined,
      [commonProteinData.go_id.id]: input_go_id ? input_go_id : undefined,
      [commonProteinData.glycosylated_aa.id]: glyco_aa ? glyco_aa : undefined,
      [commonProteinData.sequence.id]: sequences ? sequences : undefined,
      [commonProteinData.pathway_id.id]: input_pathway_id
        ? input_pathway_id
        : undefined,
      [commonProteinData.pmid.id]: input_pmid ? input_pmid : undefined,
      [commonProteinData.glycosylation_evidence
        .id]: input_glycosylation_evidence
        ? input_glycosylation_evidence
        : undefined,
      [commonProteinData.glycosylation_type.id]: input_glycosylation_type
        ? input_glycosylation_type
        : undefined,

      [commonProteinData.disease_name.id]: input_disease_name
        ? input_disease_name
        : undefined,
      [commonProteinData.disease_id.id]: input_disease_id
        ? input_disease_id
        : undefined,
      [commonProteinData.attached_glycan_id.id]: input_attached_glycan_id
        ? input_attached_glycan_id
        : undefined,
      [commonProteinData.binding_glycan_id.id]: input_binding_glycan_id
        ? input_binding_glycan_id
        : undefined
    };
    return formjson;
  }

  /**
   * Function to handle protein advanced search.
   **/
  const proteinAdvSearch = () => {
    let formObject = searchJson(
      proteinData.advanced_search.query_type.name,
      proAdvSearchData.proteinId,
      proAdvSearchData.proRefSeqId,
      proAdvSearchData.proMass[0],
      proAdvSearchData.proMass[1],
      proAdvSearchData.proOrganism,
      proAdvSearchData.proteinName,
      proAdvSearchData.proGeneName,
      proAdvSearchData.proGOName,
      proAdvSearchData.proGOId,
      proAdvSearchData.proAminoAcid.map(aminoAcid => {
        return aminoAcid.key;
      }),
      proAdvSearchData.proAminoAcidOperation,
      proAdvSearchData.proSequence,
      proAdvSearchData.proPathwayId,
      proAdvSearchData.proPubId,
      proAdvSearchData.proGlyEvidence,
      proAdvSearchData.proGlycosylationType,
      proAdvSearchData.proDiseaseName,
      proAdvSearchData.proDiseaseId,
      proAdvSearchData.proAttachedGlycanId,
      proAdvSearchData.proBindingGlycanId
    );
    logActivity("user", id, "Performing Advanced Search");
    let message = "Advanced Search query=" + JSON.stringify(formObject);
    getProteinSearch(formObject)
      .then(response => {
        if (response.data["list_id"] !== "") {
          logActivity(
            "user",
            (id || "") + ">" + response.data["list_id"],
            message
          ).finally(() => {
            props.history.push(
              routeConstants.proteinList + response.data["list_id"]
            );
          });
          setPageLoading(false);
        } else {
          logActivity("user", "", "No results. " + message);
          setPageLoading(false);
          setAlertTextInput({
            show: true,
            id: stringConstants.errors.advSerarchError.id
          });
          window.scrollTo(0, 0);
        }
      })
      .catch(function(error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  };

  /**
   * Function to handle click event for protein advanced search.
   **/
  const searchProteinAdvClick = () => {
    setPageLoading(true);
    proteinAdvSearch();
  };

  /**
   * Function to handle click event for protein simple search.
   **/
  const searchProteinSimpleClick = () => {
    setPageLoading(true);
    proteinSimpleSearch();
  };

  return (
    <>
      <Helmet>
        {getTitle("proteinSearch")}
        {getMeta("proteinSearch")}
      </Helmet>
      <FeedbackWidget />
      <div className="lander">
        <Container>
          <PageLoader pageLoading={pageLoading} />
          <DialogAlert
            alertInput={alertDialogInput}
            setOpen={input => {
              setAlertDialogInput({ show: input });
            }}
          />
          <div className="content-box-md">
            <h1 className="page-heading">{proteinSearchData.pageTitle}</h1>
          </div>
          <Tabs
            defaultActiveKey="Advanced-Search"
            transition={false}
            activeKey={proActTabKey}
            mountOnEnter={true}
            unmountOnExit={true}
            onSelect={key => setProActTabKey(key)}
          >
            <Tab
              eventKey="Simple-Search"
              className="tab-content-padding"
              title={simpleSearch.tabTitle}
            >
              <TextAlert alertInput={alertTextInput} />
              <div style={{ paddingBottom: "20px" }}></div>
              <Container className="tab-content-border">
                {initData.simple_search_category && (
                  <SimpleSearchControl
                    simpleSearchCategory={proSimpleSearchCategory}
                    simpleSearchCategoryLabel={
                      commonProteinData.term_category.name
                    }
                    simpleSearchTerm={proSimpleSearchTerm}
                    simple_search_category={initData.simple_search_category}
                    simple_search={simpleSearch.categories}
                    searchSimpleClick={searchProteinSimpleClick}
                    setSimpleSearchCategory={setProSimpleSearchCategory}
                    setSimpleSearchTerm={setProSimpleSearchTerm}
                    length={simpleSearch.length}
                    errorText={simpleSearch.errorText}
                  />
                )}
              </Container>
            </Tab>
            <Tab
              eventKey="Advanced-Search"
              className="tab-content-padding"
              title={advancedSearch.tabTitle}
            >
              <TextAlert alertInput={alertTextInput} />
              <Container className="tab-content-border">
                {initData && (
                  <ProteinAdvancedSearch
                    searchProteinAdvClick={searchProteinAdvClick}
                    inputValue={proAdvSearchData}
                    initData={initData}
                    setProAdvSearchData={setProAdvSearchData}
                  />
                )}
              </Container>
            </Tab>
            <Tab
              eventKey="Tutorial"
              title={proteinSearchData.tutorial.tabTitle}
              className="tab-content-padding"
            >
              <Container className="tab-content-border">
                <ProteinTutorial />
              </Container>
            </Tab>
          </Tabs>
        </Container>
      </div>
    </>
  );
};

export default ProteinSearch;
