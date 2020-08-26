import { getJson, postTo } from "./api";
import routeConstants from './json/routeConstants';
import { GLYGEN_BASENAME } from "../envVariables";

/**
 * This is called when the user selects to be logged.
 * Gets the ID from Web Service and stores in the localStorage of the browser.
 */
export const logID = () => {
    const url = "/auth/userid";
    console.log(url);
    return postTo(url);
}

/**
 * This is called to check if user actitvity is looged with user ID.
 */
export const isLoggingUserActivity = () => {
    if (typeof (Storage) !== "undefined") {
        if (localStorage.getItem("ID")) {
            var userID = localStorage.getItem("ID");
            if (userID === "Anonymous")
                return false;
            return true;    
        } else {
            return false;
        }
    } else {
        return false;
    }
}

/**
 * clears the localStorage i.e. it removes the stored ID.
 */
export const clearLocalStore = () => {
    localStorage.removeItem("ID");
}

/**
 * This is the main function which logs the events.
 * It sends logs to the web service in the defined format.
 * @param {string} type the log type - whether an error or normal access.
 * @param {string} id the ID of the glycan/protein/glycoprotein - list/detail page.
 * @param {string} message descriptive message of the log.
 */
export const logActivity = (type, id, message) => {
    var user = localStorage.getItem("ID");
    var pagePath = window.location.pathname;
    var curPage = GLYGEN_BASENAME === "/" ? pagePath.split("/")[1] || routeConstants.home.replace(/\//g, "") : pagePath.split("/")[2] || routeConstants.home.replace(/\//g, "");

    type = type || "user";
    id = id || "";
    message = message || "page access";

    if (user == null) {
        /* defining the users who have not yet decided an option of activity logging. */
        user = "Undecided";
    }

    var data = {
        "id": id,                         //  "glycan/search ID"
        "user": user,
        "type": type,                     //    "user" or "error"
        "page": curPage,
        "message": message
    };
    const url = "/log/logging?query=" + JSON.stringify(data);
    console.log(url);

   return getJson(url);
}
