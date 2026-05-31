import React, { useEffect, useReducer, useState } from 'react';
import Helmet from 'react-helmet';
import { getTitle, getMeta } from '../utils/head';
import PageLoader from '../components/load/PageLoader';
import GlobalSearchCard from '../components/cards/GlobalSearchCard';
import GlobalSearchDualCard from '../components/cards/GlobalSearchDualCard';
import GlobalSearchModifiedCard from '../components/cards/GlobalSearchModifiedCard';
import DialogAlert from '../components/alert/DialogAlert';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import '../css/Search.css';
import routeConstants from '../data/json/routeConstants';
import {logActivity} from '../data/logging';
import {axiosError} from '../data/axiosError';
import FeedbackWidget from "../components/FeedbackWidget";
import { Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Link } from "react-router-dom";
import LineTooltip from "../components/tooltip/LineTooltip";
import { getGlobalSearch} from '../data/commonApi';
import stringConstants from "../data/json/stringConstants";

/**
 * GlobalSearchResult component for showing global search result.
 */
const GlobalSearchResult = (props) => {
	let { id } = useParams("");
	let glycanGlobalSearch = stringConstants.glycan.global_search_results;
	let proteinGlobalSearch = stringConstants.protein.global_search_results;

	const [pageLoading, setPageLoading] = useState(true);
	const [alertDialogInput, setAlertDialogInput] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{show: false, id: ""}
	);
	const [globalSearchData, setGlobalSearchData] = useState({});
	const [proteinKeyList, setProteinKeyList] = useState([]);

	function getExactMatchLink(type, exactId) {
		let link = ""
		if (type === "biomarker") {
			link = routeConstants.biomarkerDetail + exactId;
		} else {
			link = routeConstants.biomarkerDetail + exactId;
		}
		return link;
	}

	/**
	 * useEffect for retriving data from api and showing page loading effects.
	 */
    useEffect(() => {
		setPageLoading(true);
		logActivity();
		getGlobalSearch(id).then(({ data }) => {
		logActivity("user", (id || ""), "Global search term=" + id);
		setGlobalSearchData(data);
										
		setPageLoading(false);
	})
	.catch(function (error) {
		let message = "global search api call term=" + id;
		axiosError(error, id, message, setPageLoading, setAlertDialogInput);
	});
}, [id]);
    
	return (
		<>
			<Helmet>
				{getTitle('globalSearchResult')}
				{getMeta('globalSearchResult')}
			</Helmet>
			<FeedbackWidget />
			<div className='lander'>
				<Container>
					<PageLoader pageLoading={pageLoading} />
					<DialogAlert
						alertInput={alertDialogInput}
						setOpen={(input) => {
							setAlertDialogInput({"show": input})
						}}
					/>

                    <Paper className={"gs-result-paper"}>
                        <div className="gs-panel-heading gs-panel">
                            <h2><strong>Search result for <span style={{ color: "#008080" }}>{id}</span></strong></h2>
                        </div>

						<Typography className={"gs-exact-match"} variant="h6"> 	
							{globalSearchData.exact_match && globalSearchData.exact_match.map((searchMatch) => 
								<div key={searchMatch.id}>
									<span>A {searchMatch.type} exactly matching </span>
									<LineTooltip text="Click to see details page."> 
										<Link
											className={"gs-exact-match-link"}
											to={getExactMatchLink(searchMatch.type, searchMatch.id)}
										>
										{id}
										</Link>
									</LineTooltip>
									<span> was found.</span>
								</div>
								)}
						</Typography>
					<Grid
						container
						style={{ margin: '0  auto' }}
						justifyContent='center'>
							<Grid item md={4}>
								{globalSearchData.results && <GlobalSearchModifiedCard
									results={globalSearchData.results}
									route={routeConstants.biomarkerList}
									term={id}
									routeTerm="gs"
								/>}
							</Grid>
						</Grid>
                    </Paper>
                </Container>
            </div>
		</>
	);
};

export default GlobalSearchResult;