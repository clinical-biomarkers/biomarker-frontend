import React, { useEffect, useState, useReducer } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Helmet from "react-helmet";
import { getTitle, getMeta } from "../utils/head";
import { getTitle as getTitleBiomarker, getMeta as getMetaBiomarker } from "../utils/biomarker/head";
import { Row, Col } from "react-bootstrap";
import OurTalks from "../components/media/OurTalks";
import Portfolio from "../components/media/Portfolio";
import ForMembers from "../components/media/ForMembers";
import { Tree } from 'primereact/tree';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import "../App.css";
import FeedbackWidget from "../components/FeedbackWidget";
import { logActivity } from "../data/logging";
import { axiosError } from "../data/axiosError";
import PageLoader from "../components/load/PageLoader";
import DialogAlert from "../components/alert/DialogAlert";
import Button from "react-bootstrap/Button";
import { getBiomarkerOntology } from "../data/biomarker"
import { PrimeReactProvider } from "primereact/api";
import { usePassThrough } from "primereact/passthrough";
import Tailwind from "primereact/passthrough/tailwind";
import { inputAdornmentClasses } from "@mui/material";
import Card from "react-bootstrap/Card";
import ontologyViewerJSON from "../data/json/ontologyViewer.json";
import HelpTooltip from "../components/tooltip/HelpTooltip";
import stringConstants from "../data/json/stringConstants";

const OntologyViewer = (props) => {
	const navigate = useNavigate();
	const location = useLocation();

	const [nodes, setNodes] = useState([]);
	const [expandedKeys, setExpandedKeys] = useState();
	const [selectedNodeKey, setSelectedNodeKey] = useState('');
	const [metadata, setMetadata] = useState();
	const [currentNode, setCurrentNode] = useState();
	const [pageLoading, setPageLoading] = useState(true);
	const [alertDialogInput, setAlertDialogInput] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{ show: false, id: "" }
	);
	const ontologyViewer = ontologyViewerJSON.ontologyViewer;

	const onSelect = (event) => {
		setMetadata(event.node.data);
		setCurrentNode({ 'id': event.node.key, 'label': event.node.label })
	};

	const onUnselect = (event) => {
		setMetadata();
		setCurrentNode();
	};

	const CustomTailwind = usePassThrough(
		Tailwind,
		{
			panel: {
				title: {
					className: 'leading-none font-light text-2xl'
				}
			}
		}
	);


	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
		logActivity();

		getBiomarkerOntology()
			.then((response) => {
				if (response.error_code) {
					let message = "biomarker ontology api call error";
					logActivity("user", "", message);
				} else {
					let message = "biomarker ontology api call success";
					logActivity("user", "", message);

					function mapData(response) {
						let obj = {
							key: response.id,
							label: response.label,
							data: response.metadata,
							children: null,
							style: { "padding": ".005rem !important", "paddingLeft": "1.05rem !important" }
						};

						if (response.children) {
							obj.children = []
							for (let i = 0; i < response.children.length; i++) {
								let child = mapData(response.children[i]);
								obj.children.push(child);
							}
						}
						return obj;
					}

					let data = [];
					if (response.data) {
						let expandKeys = {};
						for (let i = 0; i < response.data.length; i++) {
							if (response.data[i].id && response.data[i].id !== null) {
								let obj = mapData(response.data[i]);
								data.push(obj)
								expandKeys[response.data[i].id] = true;
							}
						}
						setExpandedKeys(expandKeys);
					}
					setNodes(data);
					setPageLoading(false);
				}
			})
			.catch(function (error) {
				let message = "biomarker ontology api call error";
				axiosError(error, "", message, setPageLoading, setAlertDialogInput);
			});
	}, []);

	return (
		<>
			<div className="gg-baseline list-page-container">
				<Row className="gg-baseline p-4">
					<Col sm={12} md={12} lg={12} xl={4} className1="sidebar-col">
						<div className="ontology-treeview card1 flex1 flex-wrap justify-content-center gap-5">
							<PrimeReactProvider value={{ unstyled: false, pt: CustomTailwind }}>
								<Tree value={nodes} selectionMode="single" selectionKeys={selectedNodeKey}
									onSelect={onSelect} onUnselect={onUnselect} onSelectionChange={(e) => setSelectedNodeKey(e.value)}
									expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)} filter filterMode="strict"
									filterPlaceholder="Search" className="w-full md:w-30rem ontology-tree"
								/>
							</PrimeReactProvider>
						</div>
					</Col>
					<Col sm={12} md={12} lg={12} xl={8} className="sidebar-page">
						<div className="sidebar-page-mb">
							<div className="content-box-md">
								<div className="horizontal-heading text-center">
									<h5>Look At</h5>
									<h2>
										<span>
											Biomarker Ontology
										</span>
									</h2>
								</div>
							</div>

							{window.history && window.history.length > 1 && (
								<div className="text-end pb-3">
									<Button
										type="button"
										className="biom-btn-teal"
										onClick={() => {
											navigate(-1);
										}}
									>
										Back
									</Button>
								</div>
							)}
							<React.Fragment>
								<Helmet>
									{getTitleBiomarker("ontologyViewer")}
									{getMeta("ontologyViewer")}
								</Helmet>
								<FeedbackWidget />
								<PageLoader pageLoading={pageLoading} />
								<DialogAlert
									alertInput={alertDialogInput}
									setOpen={(input) => {
										setAlertDialogInput({ show: input });
									}}
								/>

								<Card>
									<Card.Header style={{ paddingTop: "12px", paddingBottom: "12px" }} className="panelHeadBgr">
										<span className="gg-green d-inline">
											<HelpTooltip
												title={ontologyViewer.metadata.title}
												text={ontologyViewer.metadata.text}
												urlText={ontologyViewer.metadata.urlText}
												url={ontologyViewer.metadata.url}
												helpIcon="gg-helpicon-detail"
											/>
										</span>
										<h4 className="gg-green d-inline">
											{ontologyViewer.metadata.title}
										</h4>
									</Card.Header>
									<Card.Body>
										{currentNode && metadata ? <>
											<div>
												<strong>{"ID"}: </strong>
												{currentNode.id ? currentNode.id : ""}
											</div>
											<div>
												<strong>{"Name"}: </strong>
												{currentNode.label ? currentNode.label : ""}
											</div>
											<div>
												<Row>
													<Col Col md="auto" className="pe-0">
														<strong>{"Definition"}: </strong>
													</Col>
													{metadata.definition ?
														<Col className="nowrap1 d-inline5 ps-1 flex-wrap">
															<span>
																{metadata.definition}
															</span>
														</Col> :
														<Col className="nowrap1 d-inline5 ps-1">
															<span>
																{""}
															</span>
														</Col>}
												</Row>
											</div>
											<div>
												<Row>
													<Col Col md="auto" className="pe-0">
														<strong>{"Synonyms"}: </strong>
													</Col>
													{metadata.synonyms && metadata.synonyms.length >= 0 ?
														<Col className="nowrap1 d-inline5 ps-1 flex-wrap">
															{metadata.synonyms.map((syn) => (
																<div>
																	{syn}
																</div>
															))}
														</Col> :
														<Col className="nowrap1 d-inline5 ps-1">
															<span>
																{""}
															</span>
														</Col>}
												</Row>
											</div>
											<div>
												<Row>
													<Col Col md="auto" className="pe-0">
														<strong>{"Equivalent To"}: </strong>
													</Col>
													{metadata.equivalent_to && metadata.equivalent_to.length >= 0 ?
														<Col className="nowrap1 d-inline5 ps-1 flex-wrap">
															{metadata.equivalent_to.map((equ) => (
																<div>
																	{equ}
																</div>
															))}
														</Col> :
														<Col className="nowrap1 d-inline5 ps-1">
															<span>
																{""}
															</span>
														</Col>}
												</Row>
											</div>
										</> :
											<div>
												<p className="text-center p-3">
													<div>The Biomarker Ontology.</div>
													<div>Please click on a node to explore more.</div>
												</p>
											</div>}
									</Card.Body>
								</Card>
							</React.Fragment>
						</div>
					</Col>
				</Row>
			</div>
		</>
	);
};
export default OntologyViewer;
