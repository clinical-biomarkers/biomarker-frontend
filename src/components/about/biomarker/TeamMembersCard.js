import React from "react";
import Container from "@mui/material/Container";
import { Row, Col, Image } from "react-bootstrap";

const TeamMembersCard = (props) => {
	return (
		<React.Fragment>
			<Container maxWidth="lg">
				{props.data.url ? 
					(<a
						href={props.data.url}
						target="_blank"
						rel="noopener noreferrer">
						<h2 className="section-heading">{props.data.heading}</h2>
					</a>) : (
					<h2 className="section-heading">{props.data.heading}</h2>
				)}
				<h3>{props.data.subheading}</h3>

				<Row className="gg-align-center">
					{props.data.people.map((json) => (
						<Col md={4} lg={3} className="team">
							<>
								{json.url ? (
									<>
										<a
											href={json.url}
											target="_blank"
											rel="noopener noreferrer">
											{!props.formerMembers && (<Image
												className="img-circle"
												src={process.env.PUBLIC_URL + json.image}
												alt={json.imageText}
											/>)}
										</a>
										<a
											href={json.url}
											target="_blank"
											rel="noopener noreferrer">
											<h5>{json.name}</h5>
										</a>
									</>
								) : (
									<>
										{!props.formerMembers && (<Image
											className="img-circle"
											src={process.env.PUBLIC_URL + json.image}
											alt={json.imageText}
										/>)}
										<h5>{json.name}</h5>
									</>
								)}
								<p>
									{json.nameSubtext1 && json.nameSubtext2 && <div>
										{"("}
										{json.nameSubtext1Url ? <a
											href={json.nameSubtext1Url}
											target="_blank"
											rel="noopener noreferrer">
											<span>{json.nameSubtext1}</span>
											</a> : <span>{json.nameSubtext1}</span>}
										{" - "}
										{json.nameSubtext2Url ? <a
											href={json.nameSubtext2Url}
											target="_blank"
											rel="noopener noreferrer">
											<span>{json.nameSubtext2}</span>
											</a> : <span>{json.nameSubtext2}</span>}
										{")"}
									</div>}
									<div>{json.position}</div>
									{json.urlLink ? 
										(<a
											href={json.urlLink}
											target="_blank"
											rel="noopener noreferrer">
											<div>{json.urlText}</div>
										</a>) : (
										<div>{json.urlText}</div>
									)}
									<div>{json.department}</div>
									<div>{json.institution}</div>
									<div>{json.location}</div>
									<div>
										<em>{json.dateLeft}</em>
									</div>
								</p>
							</>
						</Col>
					))}
				</Row>
			</Container>
		</React.Fragment>
	);
};
export default TeamMembersCard;
