import React, { useState, useEffect, useReducer } from "react";
import Helmet from "react-helmet";
import Button from "react-bootstrap/Button";
import { Switch } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { getTitle, getMeta } from "../utils/head";
import { getTitle as getTitleBiomarker, getMeta as getMetaBiomarker } from "../utils/biomarker/head";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { getBiomarkerList } from "../data";
import { BIOMARKER_COLUMNS, getUserSelectedColumns } from "../data/biomarker";
import Typography from '@mui/material/Typography';
import PaginatedTable from "../components/PaginatedTable";
import DownloadButton from "../components/DownloadButton";
import FeedbackWidget from "../components/FeedbackWidget";
import stringConstants from "../data/json/stringConstants.json";
import routeConstants from "../data/json/routeConstants";
import { logActivity } from "../data/logging";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import "../css/Sidebar.css";
import { axiosError } from "../data/axiosError";
import { GLYGEN_BASENAME } from "../envVariables";
import ListFilter from "../components/ListFilter";
import { ReactComponent as ArrowRightIcon } from "../images/icons/arrowRightIcon.svg";
import { ReactComponent as ArrowLeftIcon } from "../images/icons/arrowLeftIcon.svg";
import BiomarkerQuerySummary from "../components/BiomarkerQuerySummary";
import {
  GLYGEN_BUILD,
} from "../envVariables";

const BiomarkerList = props => {
  let { id } = useParams();
  let { searchId } = useParams();
  let quickSearch = stringConstants.quick_search;
  const [data, setData] = useState([]);
  const [query, setQuery] = useState([]);
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState();
  const [dataUnmap, setDataUnmap] = useState([]);
  const [timestamp, setTimeStamp] = useState();
  const [pagination, setPagination] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(BIOMARKER_COLUMNS);
  const [page, setPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [availableFilters, setAvailableFilters] = useState([]);
  const [sizePerPage, setSizePerPage] = useState(20);
  const [totalSize, setTotalSize] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [canonicalID, setCanonicalID] = useState(true);
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );
  const navigate = useNavigate();

  useEffect(() => {
    setPageLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setPage(1);
    logActivity("user", id);
    getBiomarkerList(
      id,
      (page - 1) * sizePerPage + 1,
      sizePerPage,
      "hit_score",
      "desc",
      appliedFilters
    )
      .then(({ data }) => {
        if (data.error_code) {
          let message = "list api call";
          logActivity("user", id, "No results. " + message);
          setPageLoading(false);
        } else {
          setData(data.results);
          setQuery(data.cache_info.query);
          setNaturalLanguageQuery(data.cache_info.ai_parsing);
          setTimeStamp(data.cache_info.ts);
          setPagination(data.pagination);
          setAvailableFilters(data.filters.available);
          if (data.pagination) {
            const currentPage = (data.pagination.offset - 1) / sizePerPage + 1;
            setPage(currentPage);
            setTotalSize(data.pagination.total_length);
          } else {
            setPage(1);
            setTotalSize(0);
          }
          setPageLoading(false);
        }
      })
      .catch(function(error) {
        let message = "list api call";
        axiosError(error, id, message, setPageLoading, setAlertDialogInput);
      });
    // eslint-disable-next-line
  }, [appliedFilters, id]);

  const handleTableChange = (
    type,
    { page, sizePerPage, sortField, sortOrder }
  ) => {
    if (pageLoading) {
      return;
    }
    setPage(page);
    setSizePerPage(sizePerPage);
    setPageLoading(true);
    getBiomarkerList(
      id,
      (page - 1) * sizePerPage + 1,
      sizePerPage,
      sortField || "hit_score",
      sortOrder,
      appliedFilters
    ).then(({ data }) => {
      // place to change values before rendering
      setData(data.results);
      setTimeStamp(data.cache_info.ts);
      setPagination(data.pagination);
      setAvailableFilters(data.filters.available);
      setTotalSize(data.pagination.total_length);
      setPageLoading(false);
    });
  };
  // useEffect(() => {
  //   if (data.results && data.results.length === 0) {
  //     setAlertDialogInput({
  //       show: true,
  //       id: "no-result-found"
  //     });
  //   }
  // }, [data]);

  const handleFilterChange = newFilter => {
    console.log(newFilter);
    // find if a filter exists for this type
    const existingFilter = appliedFilters.find(
      filter => filter.id === newFilter.id
    );
    // if no filter exists
    if (
      existingFilter &&
      existingFilter.selected &&
      newFilter &&
      newFilter.selected &&
      (newFilter.selected.length || existingFilter.selected.length)
    ) {
      // list of all the other filters
      // add a new filter of this type
      const otherFilters = appliedFilters.filter(
        filter => filter.id !== newFilter.id
      );

      if (newFilter.selected.length) {
        // for this existing filter, make sure we remove this option if it existed
        setAppliedFilters([...otherFilters, newFilter]);
      } else {
        setAppliedFilters(otherFilters);
      }
    } else if (newFilter.selected.length) {
      setAppliedFilters([...appliedFilters, newFilter]);
    }
  };

  const handleModifySearch = () => {
      navigate(routeConstants.biomarkerSearch + id);
  };

  function rowStyleFormat(rowIdx) {
    return { backgroundColor: rowIdx % 2 === 0 ? "red" : "blue" };
  }
  const [sidebar, setSidebar] = useState(true);

  const handleCanonicalIDChange = (event) => {
    setCanonicalID(event.target.checked);
  };

  return (
    <>
      <Helmet>
        {GLYGEN_BUILD === "glygen" ? getTitle("biomarkerList") :
          getTitleBiomarker("biomarkerList")}

        {GLYGEN_BUILD === "glygen" ? getMeta("biomarkerList") :
          getMetaBiomarker("biomarkerList")}
      </Helmet>

      <FeedbackWidget />
      <div className="gg-baseline list-page-container">
        {availableFilters && availableFilters.length !== 0 && (
          <div className="list-sidebar-container">
            <div className={"list-sidebar" + (sidebar ? "" : " closed")}>
              <div className="reset-filter-btn-container">
                <Button
                  type="button"
                  className="biom-btn-teal reset-filter-btn"
                  onClick={() => {
                    setAppliedFilters([])
                  }}
                >
                  Reset Filters
                </Button>
              </div>
              <ListFilter
                availableOptions={availableFilters}
                selectedOptions={appliedFilters}
                onFilterChange={handleFilterChange}
              />
              <div className="reset-filter-btn-container ">
                <Button
                  type="button"
                  className="biom-btn-teal reset-filter-btn"
                  onClick={() => {
                    setAppliedFilters([])
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
            <div
              className="list-sidebar-opener sidebar-arrow-center"
              onClick={() => setSidebar(!sidebar)}
            >
              {sidebar ? <ArrowLeftIcon /> : <ArrowRightIcon />}
            </div>
          </div>
        )}
        <div className="sidebar-page" style={{width: "100%"}}>
          <div class="list-mainpage-container list-mainpage-container">
            <PageLoader pageLoading={pageLoading} />
            <DialogAlert
              alertInput={alertDialogInput}
              setOpen={input => {
                setAlertDialogInput({ show: input });
              }}
            />
            <section className="content-box-md">
              {query && (
                <BiomarkerQuerySummary
                  data={query}
                  naturalLanguageQuery={naturalLanguageQuery}
                  question={quickSearch[searchId]}
                  searchId={searchId}
                  timestamp={true}
                  dataUnmap={dataUnmap}
                  onModifySearch={handleModifySearch}
                />
              )}
            </section>
            <section>
              <div>
                <span style={{display: "inline-block", textAlign: "left", width: "35%", marginLeft: "10px", marginRight: "10px" }}>
                  <FormControlLabel 
                    label={<Typography className={'list-toggle-lbl'}>Canonical ID</Typography>}
                    control={
                      <Switch
                        checked={canonicalID}
                        onChange={handleCanonicalIDChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />} 
                  />
                </span>
                <span style={{display: "inline-block", textAlign: "right", width: "62%"}}>
                  <DownloadButton
                    types={[
                      {
                        display:
                          stringConstants.download.biomarker_csvdata.displayname,
                        type: "csv",
                        data: "biomarker_list"
                      },
                      {
                        display:
                          stringConstants.download.biomarker_jsondata.displayname,
                        type: "json",
                        data: "biomarker_list"
                      }
                    ]}
                    dataId={id}
                    itemType="biomarker_list"
                    filters={appliedFilters}
                  />
                </span>
              </div>
              {data && (
                <PaginatedTable
                  trStyle={rowStyleFormat}
                  data={data}
                  columns={selectedColumns.filter(cols => canonicalID ? cols.canonicalID == undefined || cols.canonicalID !== false : cols.canonicalID == undefined || cols.canonicalID !== true)}
                  page={page}
                  sizePerPage={sizePerPage}
                  totalSize={totalSize}
                  onTableChange={handleTableChange}
                  defaultSortField="hit_score"
                  defaultSortOrder="desc"
                  idField="uniprot_canonical_ac"
                  noDataIndication={pageLoading ? "Fetching Data." : "No data available, please select filters."}
                />
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default BiomarkerList;
