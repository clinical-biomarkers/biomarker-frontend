import { useReducer, useEffect } from 'react';
import HelpTooltip from '../tooltip/HelpTooltip';
import ExampleControl from "../example/ExampleControl";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FormHelperText from '@mui/material/FormHelperText';
import PropTypes from 'prop-types';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import Button from 'react-bootstrap/Button';
import '../../css/Search.css';
import biomarkerSearchData from '../../data/json/biomarkerSearch';
import stringConstants from '../../data/json/stringConstants';

/**
 * AI Query Assistant control.
 */
const AIQueryAssistant = (props) => {
    let commonBiomarkerData = stringConstants.biomarker.common;
    let advancedSearch = biomarkerSearchData.ai_query_assistant;

	const [aIQueryAssistantError, setAIQueryAssistantError] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{
		  bioAIQAssistantDisabled: props.inputValue.length <= 0,
		  bioAIQueryAssistantInput: false,
		}
	  );

	/**
	 * Function to set AI Query Assistant value.
	 * @param {string} inputBioAIQueryAssistant - input AI Query Assistant value.
	 **/
	function bioAIQueryAssistantChange(inputBioAIQueryAssistant) {
		props.setInputValue(inputBioAIQueryAssistant);
	}

	/**
	 * Function to handle onchange event for AI Query Assistant value.
	 * @param {object} event - event object.
	 **/
	const AIQueryAssistantChange = (event) => {
		props.setInputValue(event.target.value);
	}
	 
	/**
	 * Function to clear input field values.
	 **/
	const clearAIQueryAssistant = () => {
		props.setInputValue('');
	};

	 useEffect(() => { 
		setAIQueryAssistantError({ bioAIQueryAssistantInput: props.inputValue.length > advancedSearch.ai_query_assistant.length, bioAIQAssistantDisabled: props.inputValue.length <= 0 });
	 }, [props.inputValue]);

	return (
		<>
			<Grid
				container
				style={{ margin: "0 0 0 -12px" }}
				spacing={3}
				justifyContent='center'>
				{/* Buttons Top */}
				<Grid item xs={12} sm={10}>
					<div className='gg-align-right pt-2 pb-2 me-1'>
						<Button className='biom-btn-outline me-4' onClick={clearAIQueryAssistant}>
							Clear Fields
						</Button>
						<Button
							className='biom-btn-teal'
							onClick={props.aIQueryAssistantClick}
							disabled={
								!Object.keys(aIQueryAssistantError).every(
									(err) => aIQueryAssistantError[err] === false
								  )
							}>
							Search
						</Button>
					</div>
				</Grid>
				{/* Natural Language Question */}
				<Grid item xs={12} sm={10}>
					<FormControl
						fullWidth
						variant='outlined'
					>
						<Typography className={'search-lbl'} gutterBottom>
							<HelpTooltip
                                title={commonBiomarkerData.ai_query_assistant.tooltip.title}
                                text={commonBiomarkerData.ai_query_assistant.tooltip.text}
								urlText={commonBiomarkerData.ai_query_assistant.tooltip.urlText}
         						url={commonBiomarkerData.ai_query_assistant.tooltip.url}
                            />
                            {commonBiomarkerData.ai_query_assistant.name}
						</Typography>
						<OutlinedInput
                            placeholder={advancedSearch.ai_query_assistant.placeholder}
							margin='dense'
							multiline
							rows={3}
                            value={props.inputValue}
                            onChange={AIQueryAssistantChange}
                            error={props.inputValue.length > advancedSearch.ai_query_assistant.length}
						/>
						{props.inputValue.length > advancedSearch.ai_query_assistant.length && (
							<FormHelperText className={"error-text"} error>
								{advancedSearch.ai_query_assistant.errorText}
							</FormHelperText>
						)}
						<ExampleControl
							exampleMap={advancedSearch.ai_query_assistant.examples}
							type={advancedSearch.ai_query_assistant.examples.ai_query_assistant.id}
							setInputValue={input => {
								bioAIQueryAssistantChange(input);
							}}
						/>
					</FormControl>
				</Grid>
				{/* Buttons Buttom */}
				<Grid item xs={12} sm={10}>
					{/* <Row className='gg-align-right pt-3 mb-2 mr-1'> */}
					<div className='gg-align-right pt-3 mb-2 me-1'>
						<Button className='biom-btn-outline me-4' onClick={clearAIQueryAssistant}>
							Clear Fields
						</Button>
						<Button
							className='biom-btn-teal'
							onClick={props.aIQueryAssistantClick}
							disabled={
								!Object.keys(aIQueryAssistantError).every(
									(err) => aIQueryAssistantError[err] === false
								  )
							}>
							Search
						</Button>
					</div>
					{/* </Row> */}
				</Grid>
			</Grid>
		</>
	);
};

export default AIQueryAssistant;

AIQueryAssistant.propTypes = {
	inputValue: PropTypes.object,
	aIQueryAssistantClick: PropTypes.func,
	setInputValue: PropTypes.func,
};
