import React, { useEffect, useState, useReducer, useRef } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../../utils/head";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router-dom";
import { Grid, Typography } from "@material-ui/core";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormControlLabel from "@material-ui/core/FormControl";
import SelectControl from "../select/SelectControl";
import HelpTooltip from "../tooltip/HelpTooltip";
import PageLoader from "../load/PageLoader";
import DialogAlert from "../alert/DialogAlert";
import TextAlert from "../alert/TextAlert";
import "../../css/Search.css";
import { logActivity } from "../../data/logging";
import { axiosError } from "../../data/axiosError";
import idMappingData from "../../data/json/idMapping";
import stringConstants from "../../data/json/stringConstants";
import routeConstants from "../../data/json/routeConstants";
import { getJobInit, postNewJob, getJobStatus, getJobDetails } from "../../data/job";
import ExampleControl2 from "../example/ExampleControl2";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import proteinSearchData from '../../data/json/proteinSearch';
import { thresholdFreedmanDiaconis } from "d3";


let exampleMap = {
  "GlycoCT": {
    "examples": [
      "RES\n1b:b-dglc-HEX-1:5\n2s:n-acetyl\n3b:b-dgal-HEX-1:5\nLIN\n1:1d(2+1)2n\n d2:1o(3+1)3d",
    ],
    "name": "GlycoCT Example",
    "placeholder": "RES\n1b:b-dglc-HEX-1:5\n2s:n-acetyl\n3b:b-dgal-HEX-1:5\nLIN\n1:1d(2+1)2n\n d2:1o(3+1)3d"
  },
  "WURCS": { 
    "examples": [
      "WURCS=2.0/2,2,1/[a2122h-1b_1-5_2*NCC/3=O][a2112h-1b_1-5]/1-2/a3-b1"
    ],
    "name": "WURCS Example",
    "placeholder": "WURCS=2.0/2,2,1/[a2122h-1b_1-5_2*NCC/3=O][a2112h-1b_1-5]/1-2/a3-b1"
  }};

const SubstructureSearchControl = (props) => {
  let { id } = useParams("");
  const [initData, setInitData] = useState([]);
  let advancedSearch = proteinSearchData.advanced_search;
  let commonProteinData = stringConstants.protein.common;

  const [inputValue, setInputValue] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      targetDatabase: "GlycoCT",
      eValue: "10",
      maxHits: "250",
      proSequence: "",
      restrictTo: "none",
    }
  );

  const [blastError, setBlastError] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      proSeqSearchDisabled: true,
      proSequenceInput: false,
    }
  );

  const [pageLoading, setPageLoading] = React.useState(true);
  const [alertTextInput, setAlertTextInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  // let idMapData = stringConstants.id_mapping;
  let commonIdMappingData = stringConstants.id_mapping.common;

  /**
   * Function to set recordtype (molecule) name value.
   * @param {string} value - input recordtype (molecule) name value.
   **/
  const targetDatabaseOnChange = (value) => {
    setInputValue({ targetDatabase: value });
    proSequenceChange("");
  };
  /**
   * Function to set inputNamespace (From ID Type) name value.
   * @param {string} value - input inputNamespace (From ID Type) name value.
   **/
  const eValueOnChange = (event) => {
    setInputValue({ eValue: event.target.value });
  };

  /**
   * Function to set outputNamespace (To ID Type) name value.
   * @param {string} value - input outputNamespace (To ID Type) name value.
   **/
  const maxHitsOnChange = (event) => {
    setInputValue({ maxHits: event.target.value });

  };

  /**
	 * Function to set protein or peptide sequence value.
	 * @param {string} inputProSequence - input protein or peptide sequence value.
	 **/
	function proSequenceChange(inputProSequence) {
    if (inputProSequence.length === 0) {
      setInputValue({ proSequence: inputProSequence });
      setBlastError({ proSequenceInput: false });
      setBlastError({ proSeqSearchDisabled: true });
    } else {
        setInputValue({ proSequence: inputProSequence });
        setBlastError({ proSequenceInput: false });
        setBlastError({ proSeqSearchDisabled: false });
    }
	}

	/**
	 * Function to handle onchange event for protein or peptide sequence.
	 * @param {object} event - event object.
	 **/
	const SequenceChange = (event) => {
		let proSequenceError = event.target.value.length < 20;
    if (event.target.value.length === 0) {
      setInputValue({ proSequence: event.target.value });
      setBlastError({ proSequenceInput: false });
      setBlastError({ proSeqSearchDisabled: true });
    } else {
      setInputValue({ proSequence: event.target.value });
      setBlastError({ proSequenceInput: proSequenceError });
      setBlastError({ proSeqSearchDisabled: proSequenceError });
    }
	}

  const restrictToChange = (event) => {
    setInputValue({ restrictTo: event.target.value });
  }

  const clearMapFields = () => {
    setInputValue({
      targetDatabase: "GlycoCT",
      eValue: "10",
      maxHits: "250",
      restrictTo: "none",
      proSequence: "",
    });

    setBlastError({ proSequenceInput: false, proSeqSearchDisabled: true });

  };

  /**
   * useEffect for retriving data from api and showing page loading effects.
   */
  useEffect(() => {
    setPageLoading(true);
    logActivity();
    document.addEventListener("click", () => {
      setAlertTextInput({ show: false });
    });
    getJobInit()
      .then((response) => {
        let initData = response.data;
        setInitData(initData.blastp.paramlist);
        if (id === undefined) setPageLoading(false);
        id &&
        getJobDetails(id)
            .then(({ data }) => {
              logActivity("user", id, "IdMapping modification initiated");
              setInputValue({
                proSequence:
                  data.parameters.seq === undefined
                    ? ""
                    : data.parameters.seq,
                targetDatabase:
                data.parameters.targetdb === undefined
                    ? "GlycoCT"
                    : data.parameters.targetdb,
                eValue:
                data.parameters.evalue === undefined
                    ? 10
                    : data.parameters.evalue,
                maxHits:
                data.parameters.max_target_seqs === undefined
                    ? 250
                    : data.parameters.max_target_seqs,
              });
              setBlastError({ proSequenceInput: false, proSeqSearchDisabled: false });
              setPageLoading(false);
            })
            .catch(function (error) {
              let message = "list api call";
              axiosError(error, "", message, setPageLoading, setAlertDialogInput);
            });
      })
      .catch(function (error) {
        let message = "search_init api call";
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  }, [id]);

  function searchJson(
    input_proSequence,
    input_targetDatabase,
    input_eValue,
    input_maxHits
  ) {

      var formJson = {
          "jobtype": "blastp",
          "parameters": {
            "seq": input_proSequence,
            "targetdb": input_targetDatabase,
            "evalue": parseFloat(input_eValue),
            "max_target_seqs": parseInt(input_maxHits),
          }
    };

    return formJson;
  }

  const blastSearchSubmit = () => {

    let formObject = searchJson(
      inputValue.proSequence,
      inputValue.targetDatabase,
      inputValue.eValue,
      inputValue.maxHits
    );
    logActivity("user", id, "Performing Blast Search");
    let message = "Blast Search query=" + JSON.stringify(formObject);

      postNewJob(formObject)
      .then((response) => {
        if (response.data["status"] && response.data["status"] !== {}) {
          let josStatus = response.data["status"].status;
          let jobid = response.data["jobid"];
          if (josStatus === "finished") {
            setPageLoading(false);
            if (response.data["status"].result_count && response.data["status"].result_count > 0) {
              logActivity("user", (id || "") + ">" + response.data["jobid"], message).finally(() => {
                props.history.push(routeConstants.blastResult + response.data["jobid"]);
              });
            } else {
              logActivity("user", "", "No results. " + message);
              setPageLoading(false);
              setAlertTextInput({"show": true, "id": stringConstants.errors.blastSearchError.id})
              window.scrollTo(0, 0);
            }
          } else {
            setTimeout((jobID) => {
              blastSearchJobStatus(jobID);
          }, 2000, jobid);
          }
        }  else {
          logActivity("user", "", "No results. " + message);
          setPageLoading(false);
          setAlertTextInput({"show": true, "id": stringConstants.errors.blastSearchError.id})
          window.scrollTo(0, 0);
        }
      })
      .catch(function (error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  };

  const blastSearchJobStatus = (jobID) => {

    logActivity("user", id, "Performing Blast Search");
    let message = "Blast Search query=" + JSON.stringify(jobID);
    getJobStatus(jobID)
      .then((response) => {
        if (response.data["status"] && response.data["status"] !== {}) {
          let josStatus = response.data["status"];
          if (josStatus === "finished") {
            setPageLoading(false);
            if (response.data["result_count"] && response.data["result_count"] > 0) {
              logActivity("user", (id || "") + ">" + jobID, message).finally(() => {
                props.history.push(routeConstants.blastResult + jobID);
              });
            } else {
              logActivity("user", "", "No results. " + message);
              setPageLoading(false);
              setAlertTextInput({"show": true, "id": stringConstants.errors.blastSearchError.id})
              window.scrollTo(0, 0);
            }
        } else {
            setTimeout((jobID) => {
              blastSearchJobStatus(jobID);
          }, 2000, jobID);
          } 
        }  else {
          logActivity("user", "", "No results. " + message);
          setPageLoading(false);
          setAlertTextInput({"show": true, "id": stringConstants.errors.blastSearchError.id})
          window.scrollTo(0, 0);
        }
      })
      .catch(function (error) {
        axiosError(error, "", message, setPageLoading, setAlertDialogInput);
      });
  };

  /**
   * Function to handle click event for blast search.
   **/
  const searchBlastClick = () => {
    // setPageLoading(true);
    // blastSearchSubmit();
  };

  return (
    <>
    <Grid
        container
        style={{ margin: "0  auto" }}
        spacing={3}
        justify="center"
      >
          {/*  Buttons */}
          <Grid item xs={12} sm={10}>
            <Row  className="gg-align-right pt-3 mb-2 mr-1">
              <Button className="gg-btn-outline mr-4" onClick={clearMapFields}>
                Clear Fields
              </Button>
              <Button
                className="gg-btn-blue"
                disabled={
                  !Object.keys(blastError).every(
                    (err) => blastError[err] === false
                  )
                }
                onClick={searchBlastClick}
              >
                Submit
              </Button>
            </Row>
          </Grid>

         {/* 2 Threshold */}
         <Grid item xs={12} sm={10} className="pt-3">
          <FormControl
            fullWidth
            variant="outlined"
          >
            <Typography className={"search-lbl"} gutterBottom>
              <HelpTooltip
                // title={commonIdMappingData.recordtype.tooltip.title}
                title={initData && initData.length > 0 && initData.find((a) => a.id === "targetdb").label}
                text={commonIdMappingData.recordtype.tooltip.text}
              />
              {/* {initData && initData.length > 0 && initData.find((a) => a.id === "targetdb").label} */}
              {"Sequence Type"}
            </Typography>
            <SelectControl
              inputValue={inputValue.targetDatabase}
              setInputValue={targetDatabaseOnChange}
              // menu={initData && initData.length > 0 && initData.find((a) => a.id === "targetdb").optlist.map(item => {return {name : item.label, id : item.value}})
              menu={[{name : "GlycoCT", id : "GlycoCT"}, {name : "WURCS", id : "WURCS"}]}
              required={true}
            />
          </FormControl>
        </Grid>

        {/* 1. Protein or Peptide Sequence */}
				<Grid item xs={12} sm={10} className="pt-3">
					<FormControl
						fullWidth
						variant='outlined'
					>
						<Typography className={'search-lbl'} gutterBottom>
							<HelpTooltip
                title={initData && initData.length > 0 && initData.find((a) => a.id === "seq").label}
                text={commonProteinData.sequence.tooltip.text}
                urlText={commonProteinData.sequence.tooltip.urlText}
                url={commonProteinData.sequence.tooltip.url}
              />
              {initData && initData.length > 0 && initData.find((a) => a.id === "seq").label + " *"}
						</Typography>
						<OutlinedInput
              placeholder={exampleMap[inputValue.targetDatabase].placeholder}
							margin='dense"'
							multiline
							rows={5}
              value={inputValue.proSequence}
              onChange={SequenceChange}
              error={blastError.proSequenceInput}
						/>
						{blastError.proSequenceInput && (
							<FormHelperText className={"error-text"} error>
								{"Entry is too short - min length is 20."}
							</FormHelperText>
						)}
            <ExampleControl2
							setInputValue={proSequenceChange}
              type={inputValue.targetDatabase}
							exampleMap={exampleMap}
						/>
					</FormControl>
				</Grid>

       
        {/* 3 Threshold */}   
          {/* input_namespace From ID Type */}
          <Grid item xs={12} sm={10} className="pt-3">
            <FormControl
              fullWidth
              variant="outlined"
            >
              <Typography className={'search-lbl'} gutterBottom>
							<HelpTooltip
                title={"Restrict To"}
                text={commonProteinData.sequence.tooltip.text}
                urlText={commonProteinData.sequence.tooltip.urlText}
                url={commonProteinData.sequence.tooltip.url}
              />
              {"Restrict To"}
						</Typography>
              <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  onChange={restrictToChange}
                  value={inputValue.restrictTo}
                >
                  <Grid item xs={4} sm={3}>
                    <div><Radio value={"none"} color="primary"/>{"None"}</div>
                  </Grid>
                  <Grid item xs={4} sm={3}>
                    <div><Radio value={"reducingend"} color="primary"/> {"Reducing End"}</div>
                  </Grid>
                  <Grid item xs={4} sm={3}>
                    <div><Radio value={"terminal"} color="primary"/> {"Terminal"}</div>
                  </Grid>
              </RadioGroup>
            </FormControl>
          </Grid>

         {/*  Buttons */}
         <Grid item xs={12} sm={10}>
          <Row  className="gg-align-right pt-3 mb-2 mr-1">
            <Button className="gg-btn-outline mr-4" onClick={clearMapFields}>
              Clear Fields
            </Button>
            <Button
              className="gg-btn-blue"
              disabled={
								!Object.keys(blastError).every(
									(err) => blastError[err] === false
								)
              }
              onClick={searchBlastClick}
            >
              Submit
            </Button>
          </Row>
        </Grid>
        <Grid item xs={12} sm={10}>
        <Row>
          <Col>
            <p className="text-muted mt-2">
              <strong>*</strong> These fields are required.
            </p>
          </Col>
        </Row>
        </Grid>
      </Grid>
    </>
  );
};
export default SubstructureSearchControl;