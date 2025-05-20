import { getJson, postToAndGetBlob, glycanImageUrl, postFormDataTo1 } from "./api";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { logActivity } from "./logging";
import routeConstants from "./json/routeConstants";
import stringConstants from "./json/stringConstants";
import LineTooltip from "../components/tooltip/LineTooltip";
import HitScoreTooltip from "../components/tooltip/HitScoreTooltip";
import HitScoreTooltipBiomarker from "../components/tooltip/biomarker/HitScoreTooltip";
import { Link } from "react-router-dom";
import { GLYGEN_BUILD } from "../envVariables";
import CollapsibleText from "../components/CollapsibleText";

function HeaderwithsameStyle(colum, colIndex) {
  return { backgroundColor: "#167d7d", color: "white" };
}
const proteinStrings = stringConstants.protein.common;
const biomarkerStrings = stringConstants.biomarker.common;


export const getBiomarkerDetailDownload = (id, format, compressed, type, headers) => {
  let message = "downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, "download_type": type, format, compressed };
  const url = `/data/detail_download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};

export const getBiomarkerDetail = (
  id,
) => {
  const queryParams = {
    paginated_tables:[{"table_id": "publication","offset":1, "limit":200,"sort": "date","order":"desc"}]
  };

  const queryParamString = JSON.stringify(queryParams);
  const url = `/biomarker/detail/${id}?query=${queryParamString}`;
  return getJson(url);
};

export const getGlycanImageUrl = (glytoucan_id) => {
  return glycanImageUrl + glytoucan_id;
};

export const getBiomarkerSectionDownload = (id, format, compressed, type, headers, section) => {
  let message = "downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, "download_type": type, section, format, compressed };
  const url = `/data/section_download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};


/**
 * Gets JSON for biomarker search.
 * @param {object} formObject - biomarker search JSON query object.
 */
export const getBiomarkerSearch = formObject => {
  var json = "query=" + JSON.stringify(formObject);
  const url = "/biomarker/search?" + json;
  return getJson(url);
};

/**
 * Gets JSON for biomarker simple search.
 * @param {object} formObject - biomarker simple search JSON query object.
 */
export const getBiomarkerSimpleSearch = formObject => {
  var json = "query=" + JSON.stringify(formObject);
  const url = "/biomarker/search_simple?" + json;
  return getJson(url);
};

/**
 * Gets JSON for biomarker natural language search.
 * @param {object} formObject - biomarker natural language search JSON query object.
 */
export const getBiomarkerNaturalLanguageSearch = formObject => {
  var json = "query=" + JSON.stringify(formObject);
  const url = "/biomarker/ai_search?"; // + json;
  return postFormDataTo1(url, formObject);
};

/**
 * Gets JSON for biomarker search init.
 */
export const getBiomarkerInit = () => {
  const url = `/biomarker/search_init`;
  return getJson(url);
};

/**
 * Gets JSON for biomarker search init.
 */
export const getBiomarkerOntology = () => {
  const url = `/pages/ontology`;
  return getJson(url);
};



/**
 * Gets JSON for biomarker list.
 */
export const getBiomarkerList = (
  biomarkerListId,
  offset = 1,
  limit = 20,
  sort = decodeURI("hit_score"),
  order = "desc",
  filters = []
) => {
  const queryParams = {
    id: biomarkerListId,
    offset: offset,
    sort: sort,
    limit: limit,
    order: order,
    filters: filters
  };
  const queryParamString = JSON.stringify(queryParams);
  const url = `/biomarker/list?query=${queryParamString}`;
  return getJson(url);
};

export const getBiomarkerListDownload = (
  id,
  format,
  compressed,
  type,
  headers, 
  section, 
  filters
) => {
  let message = "downloaded successfully ";
  logActivity("user", id, format, compressed, "No results. " + message);
  const query = { id, "download_type": type, format, compressed, filters };
  const url = `/data/list_download?query=${JSON.stringify(query)}`;
  return postToAndGetBlob(url, headers);
};


export const BIOMARKER_COLUMNS = [
  {
    dataField: biomarkerStrings.biomarker_id.id,
    text: biomarkerStrings.biomarker_id.name,
    sort: true,
    selected: true,
    canonicalID: false,
    headerStyle: HeaderwithsameStyle,
    formatter: (value, row) => (
      <LineTooltip text="View details">
        <Link to={routeConstants.biomarkerDetail + row.biomarker_id}>
          {row.biomarker_id}
        </Link>
      </LineTooltip>
    )
  },
  {
    dataField: biomarkerStrings.canonical_id.id,
    text: biomarkerStrings.canonical_id.name,
    sort: true,
    selected: true,
    canonicalID: true,
    headerStyle: HeaderwithsameStyle,
    formatter: (value, row) => (
      <LineTooltip text="View details">
        <Link to={routeConstants.canonicalList + row.biomarker_canonical_id}>
          {row.biomarker_canonical_id}
        </Link>
      </LineTooltip>
    )
  },
  {
    dataField: biomarkerStrings.biomarker.id,
    text: biomarkerStrings.biomarker.name,
    sort: true,
    headerStyle: HeaderwithsameStyle,
    formatter: (value, row) => <CollapsibleText text={value} lines={5} />
  },

  {
    dataField: biomarkerStrings.assessed_biomarker_entity.id,
    text: biomarkerStrings.assessed_biomarker_entity.shortName,
    sort: true,
    headerStyle: HeaderwithsameStyle,
    formatter: (value, row) => <CollapsibleText text={value} lines={5} />
  },
  {
    dataField: biomarkerStrings.assessed_biomarker_entity_id.id,
    text: biomarkerStrings.assessed_biomarker_entity_id.name,
    sort: true,
    headerStyle: HeaderwithsameStyle,
    formatter: (value, row) => <CollapsibleText text={value} lines={5} />
  },
  {
    dataField: proteinStrings.hit_score.id,
    text: proteinStrings.hit_score.name,
    sort: true,
    headerStyle: HeaderwithsameStyle,
    formatter: (value, row) => (
      <>
        {GLYGEN_BUILD === "glygen" ? <HitScoreTooltip
          title={"Hit Score"}
          text={"Hit Score Formula"}
          formula={"0.1 + ∑ (Weight + 0.01 * Frequency)"}
          contributions={row.score_info && row.score_info.contributions && row.score_info.contributions.map(item => {
            return {
              c: biomarkerStrings.contributions[item.c]
                ? biomarkerStrings.contributions[item.c].name
                : item.c,
              w: item.w,
              f: item.f
            };
          })}
        /> :
        <HitScoreTooltipBiomarker
          title={"Hit Score"}
          text={"Hit Score Formula"}
          formula={"∑ (Weight * Frequency)"}
          contributions={row.score_info && row.score_info.contributions && row.score_info.contributions.map(item => {
            return {
              c: biomarkerStrings.contributions[item.c]
                ? biomarkerStrings.contributions[item.c].name
                : item.c,
              w: item.w,
              f: item.f
            };
          })}
        />}
        {row.hit_score > 0 ? row.hit_score : <span style={{color:'red'}}>{row.hit_score}</span>}
      </>
    )
  },
  {
    dataField: biomarkerStrings.condition.id,
    text: biomarkerStrings.condition.name,
    sort: true,
    headerStyle: HeaderwithsameStyle
  },
  // {
  //   dataField: "exposure_agent",
  //   text: "Exposure Agent",
  //   sort: true,
  //   headerStyle: HeaderwithsameStyle
  // }
];