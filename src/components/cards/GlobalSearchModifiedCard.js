import React from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import RouteLink from '../Link/RouteLink.js'
import routeConstants from '../../data/json/routeConstants';
import "../../css/Search.css";

/**
 * Global search card component to show search results on the card.
 */
export default function GlobalSearchModifiedCard(props) {

	return (
        <div className={"global-search-card"}>
			<Card className={"card"}>
                <Table style={{margin:"0px", padding:"0px"}}>
                    <TableHead>
                        <TableRow hover className="card-row">
                            <TableCell align="center" colSpan={2}>
                                <h4><span><strong>{"Search term match found in:"}</strong></span></h4>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.results && props.results.length > 0 && props.results.map((result) => (
                            <TableRow n={2} hover className="card-row-even" style={{backgroundColor: "#fff !important"}}>
                                <TableCell className={"gs-cell-left"} classes={{body: "gs-cell"}}>
                                    <span><strong>{result.section}</strong></span>
                                </TableCell>
                                <TableCell className={"gs-cell-center"} classes={{body: "gs-cell"}}>
                                    <RouteLink
                                        text1={String(result.resultcount)}
                                        disabled={Number(result.resultcount) === 0}
                                        link={props.route + result.list_id + "/" + props.routeTerm}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
			</Card>
		</div>
	);
}

GlobalSearchModifiedCard.propTypes = {
    term: PropTypes.string,
    routeTerm: PropTypes.string,
    glycanCount: PropTypes.number,
    proteinCount: PropTypes.number,
    glycoproteinCount: PropTypes.number,
    glycanListId: PropTypes.string,
    proteinListId: PropTypes.string,
    glycoproteinListId: PropTypes.string,
};
