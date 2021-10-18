import React, { useState, useEffect, useReducer } from "react";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { getSuperSearchList, getSiteSearchInit } from "../data/supersearch";
import SitequerySummary from "../components/SitequerySummary";
// import { SITE_COLUMNS } from "../data/supersearch";
import PaginatedTable from "../components/PaginatedTable";
import Container from "@material-ui/core/Container";
import FeedbackWidget from "../components/FeedbackWidget";
import stringConstants from "../data/json/stringConstants.json";
// import ReactHtmlParser from "react-html-parser";
import routeConstants from "../data/json/routeConstants";
import { logActivity } from "../data/logging";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import { axiosError } from "../data/axiosError";
import DownloadButton from "../components/DownloadButton";
import LineTooltip from "../components/tooltip/LineTooltip";
import HitScoreTooltip from "../components/tooltip/HitScoreTooltip";
import { Link } from "react-router-dom";
const proteinStrings = stringConstants.protein.common;
const siteStrings = stringConstants.site.common;


// import { GLYGEN_BASENAME } from "../envVariables";

// const proteinStrings = stringConstants.protein.common;

const SiteList = props => {
  let { id } = useParams();
  let { searchId } = useParams();
  const [data, setData] = useState([]);
  const [query, setQuery] = useState([]);
  const [timestamp, setTimeStamp] = useState();
  const [pagination, setPagination] = useState([]);
  // const [selectedColumns, setSelectedColumns] = useState(SITE_COLUMNS);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(20);
  const [totalSize, setTotalSize] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [alertDialogInput, setAlertDialogInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    { show: false, id: "" }
  );

  const [configData, setConfigData] = useState({});

  useEffect(() => {
    setPageLoading(true);

    logActivity("user", id);

    const dataPromise = Promise.all([
      getSiteSearchInit(),
      getSuperSearchList(id)
    ]);

    dataPromise.then(([{ data: initData }, { data }]) => {
      if (data.error_code) {
        let message = "list api call";
        logActivity("user", id, "No results. " + message);
      } else {
        setData(data.results);
        setQuery(data.cache_info.query);
        setTimeStamp(data.cache_info.ts);
        setPagination(data.pagination);
        const currentPage = (data.pagination.offset - 1) / sizePerPage + 1;

        setPage(currentPage);
        setTotalSize(data.pagination.total_length);
        setConfigData(initData);
      }
    });

    dataPromise.catch(function(error) {
      let message = "list api call";
      axiosError(error, id, message, setPageLoading, setAlertDialogInput);
    });

    dataPromise.finally(() => {
      setPageLoading(false);
    });
  }, [id, sizePerPage]);

  // useEffect(() => {
  //   setPageLoading(true);
  //   logActivity("user", id);
  //   getSuperSearchList(id)
  //     .then(({ data }) => {
  //       if (data.error_code) {
  //         let message = "list api call";
  //         logActivity("user", id, "No results. " + message);
  //         setPageLoading(false);
  //       } else {
  //         setData(data.results);
  //         setQuery(data.cache_info.query);
  //         setTimeStamp(data.cache_info.ts);
  //         setPagination(data.pagination);
  //         const currentPage = (data.pagination.offset - 1) / sizePerPage + 1;
  //         setPage(currentPage);
  //         setTotalSize(data.pagination.total_length);
  //         setPageLoading(false);
  //       }
  //     })
  //     .catch(function(error) {
  //       let message = "list api call";
  //       axiosError(error, id, message, setPageLoading, setAlertDialogInput);
  //     });
  // }, []);

  const handleTableChange = (
    type,
    { page, sizePerPage, sortField, sortOrder }
  ) => {
    setPage(page);
    setSizePerPage(sizePerPage);
    setPageLoading(true);
    getSuperSearchList(
      id,
      (page - 1) * sizePerPage + 1,
      sizePerPage,
      sortField,
      sortOrder
    ).then(({ data }) => {
      setPageLoading(false);
      if (!data.error_code) {
        setData(data.results);
        setTimeStamp(data.cache_info.ts);
        setPagination(data.pagination);
        setTotalSize(data.pagination.total_length);
      }
    });
  };

  const handleModifySearch = () => {
    if (searchId === "sups") {
      props.history.push(routeConstants.superSearch + id);
    } else {
      props.history.push(routeConstants.siteSearch + id);
    }
  };

  function rowStyleFormat(row, rowIdx) {
    return { backgroundColor: rowIdx % 2 === 0 ? "red" : "blue" };
  }

  const yesNoFormater = (value, row) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const siteColumns = [
    {
      dataField: proteinStrings.shortName,
      text: proteinStrings.uniprot_accession.name,
      sort: true,
      selected: true,
      formatter: (value, row) => (
        <LineTooltip text="View details">
          <Link to={routeConstants.proteinDetail + row.uniprot_canonical_ac}>
            {row.uniprot_canonical_ac}
          </Link>
        </LineTooltip>
      )
    },
    {
      dataField: "hit_score",
      text: "Hit Score",
      sort: true,
      formatter: (value, row) => (
        <>
          <HitScoreTooltip
            title={"Hit Score"}
            text={"Hit Score Formula"}
            formula={"0.1 + ∑ (Weight + 0.01 * Frequency)"}
            contributions={row.score_info.contributions.map((item) => {return {c:siteStrings.contributions[item.c] ? siteStrings.contributions[item.c].name: item.c, w: item.w, f: item.f}})}
          />
          {row.hit_score}
        </>
      )
    },
    {
      dataField: "start_pos",
      text: "Start Pos",
      sort: true,
      formatter: (value, row) =>
        row.start_pos === row.end_pos ? (
          <LineTooltip text="View siteview details">
            <Link
              to={`${routeConstants.siteview + row.uniprot_canonical_ac}/${
                row.start_pos
              }`}
            >
              {row.start_pos}
            </Link>
          </LineTooltip>
        ) : (
          value
        )
    },
    {
      dataField: "end_pos",
      text: "End Pos",
      sort: true,
      formatter: (value, row) =>
        row.start_pos === row.end_pos ? (
          <LineTooltip text="View siteview details">
            <Link
              to={`${routeConstants.siteview + row.uniprot_canonical_ac}/${
                row.end_pos
              }`}
            >
              {row.end_pos}
            </Link>
          </LineTooltip>
        ) : (
          value
        )
    },
    {
      dataField: "snv",
      text: "SNV",
      sort: true,
      formatter: yesNoFormater
    },
    {
      dataField: "glycosylation",
      text: "Glycosylation",
      sort: true,
      formatter: yesNoFormater
    },
    {
      dataField: "mutagenesis",
      text: "Mutagenesis",
      sort: true,
      formatter: yesNoFormater
    },
    {
      dataField: "glycation",
      text: "Glycation",
      sort: true,
      formatter: yesNoFormater
    },
    {
      dataField: "phosphorylation",
      text: "Phosphorylation",
      sort: true,
      formatter: yesNoFormater
    }
  ];

  return (
    <>
      <Helmet>
        {getTitle("siteList")}
        {getMeta("siteList")}
      </Helmet>

      <FeedbackWidget />
      <Container maxWidth="xl" className="gg-container">
        <PageLoader pageLoading={pageLoading} />
        <DialogAlert
          alertInput={alertDialogInput}
          setOpen={input => {
            setAlertDialogInput({ show: input });
          }}
        />
        <section className="content-box-md">
          {query && (
            <SitequerySummary
              data={query}
              timestamp={timestamp}
              searchId={searchId}
              onModifySearch={handleModifySearch}
              initData={configData}
            />
          )}
        </section>
        <section>
          <DownloadButton
            types={[
              {
                display:
                  stringConstants.download.proteinsite_csvdata.displayname,
                type: "csv",
                data: "site_list"
              },
              {
                display:
                  stringConstants.download.proteinsite_jsondata.displayname,
                type: "json",
                data: "site_list"
              }
            ]}
            dataId={id}
            itemType="site"
          />
          {/* {data && data.length !== 0 && ( */}
          {!!(data && data.length) && (
            <PaginatedTable
              trStyle={rowStyleFormat}
              data={data}
              columns={siteColumns}
              page={page}
              pagination={pagination}
              sizePerPage={sizePerPage}
              totalSize={totalSize}
              onTableChange={handleTableChange}
              defaultSortField="hit_score"
              defaultSortOrder="desc"
            />
          )}
        </section>
      </Container>
    </>
  );
};

export default SiteList;
