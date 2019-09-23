//@author: Rupali Mahadik
// @description: UO1 Version-1.1.
//31st july

/**
 * Adding function to String prototype to shortcut string to a desire length.
 * @param {int} n - The length of the string
 * @returns {int} -Short String
 */
String.prototype.trunc = String.prototype.trunc ||
    function (n) {
        return (this.length > n) ? this.substr(0, n - 1) + '&hellip;' : this;
    };

var page = 1;
var sort = 'uniprot_canonical_ac';
var dir = $('.dir-select').val();
var url = getWsUrl('list_glycangene') + "?action=get_user";
var limit = 20;

function buildSummary(queryInfo, question) {

    //quick search
    var summaryTemplate = $('#summary-template').html();
    queryInfo.execution_time = moment().format('MMMM Do YYYY, h:mm:ss a');
    queryInfo[question] = true;
    var summaryHtml = Mustache.render(summaryTemplate, queryInfo);
    $('#summary-table').html(summaryHtml);
}

/**
 * Format function to create link to the details page
 * @param {object} value - The data binded to that particular cell.
 * @return -Details particular Protein Id
 */
function PageFormat(value, row, index, field) {
    return "<a href='protein_detail.html?uniprot_canonical_ac=" + value + "&listID=" + id + "'>" + value + "</a>";
}

// to show results on list page 
function totalNoSearch(total_length) {
    $('.searchresult').html("\"" + total_length + " Proteins were found\"");
}

/**
 * Handling a succesful call to the server for list page
 * @param {Object} data - the data set returned from the server on success
 * @param {Array} data.results - Array of individual results
 * @param {Object} data.pagination - the dataset for pagination info
 * @param {Object} data.query - the dataset for query
 */
function ajaxListSuccess(data) {
    if (data.code) {
        console.log(data.code);
        displayErrorByCode(data.code);
        activityTracker("error", id, "error code: " + data.code + " (page: " + page + ", sort:" + sort + ", dir: " + dir + ", limit: " + limit + ")");
    } else {
        var $table = $('#gen-table');
        var items = [];
        if (data.results) {
            for (var i = 0; i < data.results.length; i++) {
                var glycan = data.results[i];
                items.push({
                    evidence: glycan.evidence,
                    uniprot_canonical_ac: glycan.uniprot_canonical_ac,
                    gene_link: glycan.gene_link,
                    gene_name: glycan.gene_name,
                    protein_name: glycan.protein_name,
                    organism: glycan.organism,
                    tax_id: glycan.tax_id
                });
                // this is in evidence_badge js
                formatEvidences(items);
            }
        }

        $table.bootstrapTable('removeAll');
        $table.bootstrapTable('append', items);

        // this is in evidence_badge js
        setupEvidenceList();

        // this is in pagination js
        buildPages(data.pagination);
        buildSummary(data.query, question);

        document.title = 'Orthologus-list';
        activityTracker("user", id, "successful response " + question + " (page: " + page + ", sort: " + sort + ", dir: " + dir + ", limit: " + limit + ")");
    }
}
/**
 * LoadDataList function to configure and start the request to GWU  service
 * @param {string} id - The glycan id to load
 * */
function LoadDataList() {
    var ajaxConfig = {
        dataType: "json",
        url: getWsUrl("list_glycangene"),
        data: getListPostData(id, page, sort, dir, limit),
        method: 'POST',
        success: ajaxListSuccess,
        error: ajaxFailure
    };

    $.ajax(ajaxConfig);
}

/**
 * getParameterByName function to EXtract query parametes from url
 * @param {string} name - The name of the variable variable to extract from query string
 * @param {string} url- The complete url with query string values
 * @return- A new string representing the decoded version of the given encoded Uniform Resource Identifier (URI) component.
 */
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var id = getParameterByName('id');
var question = getParameterByName('question');
LoadDataList(id);

/**
 * hides the loading gif and displays the page after the results are loaded.
 * @author Gaurav Agarwal
 * @date July 25, 2018
 */
$(document).ajaxStop(function () {
    $('#loading_image').fadeOut();
});
