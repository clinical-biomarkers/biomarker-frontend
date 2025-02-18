import React, { useState, useReducer } from "react";
// import { useHistory } from "react-router";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { logActivity } from "../../data/logging";
import routeConstants from "../../data/json/routeConstants";
import biomarkerSearchData from "../../data/json/biomarkerSearch";
import stringConstants from "../../data/json/stringConstants";
import DialogAlert from "../alert/DialogAlert";
import PageLoader from "../load/PageLoader";
import { axiosError } from "../../data/axiosError";
import "../../css/globalSearch.css";
import {
  getBiomarkerSimpleSearch
} from "../../data/biomarker";
import TextAlert from "../alert/TextAlert";

/**
 * Global search control.
 **/
export default function GlobalSearchControl(props) {
  // let history = useHistory();
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
  const [pageLoading, setPageLoading] = useState(false);

    const navigate = useNavigate();
  
    let simpleSearch = biomarkerSearchData.simple_search;
    let advancedSearch = biomarkerSearchData.advanced_search;
    let biomarkerData = stringConstants.biomarker;
    let commonBiomarkerData = biomarkerData.common;

    const [alertDialogInput, setAlertDialogInput] = useReducer(
      (state, newState) => ({ ...state, ...newState }),
      { show: false, id: "" }
    );
    const [alertTextInput, setAlertTextInput] = useReducer(
      (state, newState) => ({ ...state, ...newState }),
      { show: true, id: "" }
    );

  /**
   * Function to set global search term.
   * @param {string} searchTerm - global search term.
   **/
  // function globalSearchTermChange(searchTerm) {
  //     setGlobalSearchTerm(searchTerm);
  // }

  /**
   * Function to handle global search term onchange event.
   * @param {object} event - event object.
   **/
  const globalSearchTermOnChange = (event) => {
    setGlobalSearchTerm(event.target.value);
  };

  /**
   * Function to handle global search event.
   * @param {object} event - event object.
   **/
  const globalSearchStart = (event) => {
    setPageLoading(true);
    event.preventDefault();
    logActivity("user", globalSearchTerm, "Performing Global Search").finally(() => {
      setPageLoading(false);
      window.location = routeConstants.globalSearchResult + encodeURIComponent(globalSearchTerm);
    });    
  };

  /**
     * Function to handle biomarker simple search.
     **/
    const biomarkerSimpleSearch = (event) => {
      setPageLoading(true);
      event.preventDefault();
      var formjsonSimple = {
        [commonBiomarkerData.operation.id]: "AND",
        [biomarkerData.simple_search.query_type.id]:
        biomarkerData.simple_search.query_type.name,
        [commonBiomarkerData.term.id]: globalSearchTerm,
        [commonBiomarkerData.term_category.id]: 'any'
      };
      logActivity("user", "", "Performing Global Search");
      let message = "Global Search query=" + JSON.stringify(formjsonSimple);
      getBiomarkerSimpleSearch(formjsonSimple)
        .then(response => {
          if (response.data["list_id"] !== "") {
            navigate(
              routeConstants.biomarkerList + response.data["list_id"]
            );
            logActivity(
              "user",
              response.data["list_id"],
              message
            ).finally(() => {
              navigate(
                routeConstants.biomarkerList + response.data["list_id"]
              );
            });
          } else {
            logActivity("user", "", "No results. " + message);
            setAlertDialogInput({"show": true, "id": stringConstants.errors.defaultTextAlert.id});
          }
          setPageLoading(false);
        })
        .catch(function(error) {
          axiosError(error, "", message, setPageLoading, setAlertDialogInput);
        });
    };

  return (
    <>
      <PageLoader pageLoading={pageLoading} />
      <DialogAlert
        alertInput={alertDialogInput}
        setOpen={input => {
          setAlertDialogInput({ show: input });
        }}
      />
      <Paper component="form" onSubmit={biomarkerSimpleSearch} className={"gs-comp-paper"}>
        <InputBase
          value={globalSearchTerm}
          required
          onChange={globalSearchTermOnChange}
          className={"gs-input"}
          placeholder="Search..."
          inputProps={{ "aria-label": "search" }}
        />
        <Divider className={"gs-divider"} orientation="vertical" />
        <IconButton
          disabled={globalSearchTerm.length < 1}
          onClick={biomarkerSimpleSearch}
          className="gs-icon-button"
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
      </Paper>
    </>
  );
}

GlobalSearchControl.propTypes = {
  globalSearchTermChange: PropTypes.func,
};
