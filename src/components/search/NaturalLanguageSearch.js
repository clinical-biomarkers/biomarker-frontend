import { useReducer } from 'react';
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
 * Sequence search control.
 */
const NaturalLanguageSearch = (props) => {
    let commonBiomarkerData = stringConstants.biomarker.common;
    let advancedSearch = biomarkerSearchData.natural_language_search;

	const [naturalLanguageError, setNaturalLanguageError] = useReducer(
		(state, newState) => ({ ...state, ...newState }),
		{
		  bioNLSearchDisabled: props.inputValue.length <= 0,
		  bioNaturalLanguageInput: false,
		}
	  );

	/**
	 * Function to set natural language search value.
	 * @param {string} inputBioNaturalLanguage - input natural language search value.
	 **/
	function bioNaturalLanguageChange(inputBioNaturalLanguage) {
		props.setInputValue(inputBioNaturalLanguage);
		setNaturalLanguageError({ bioNaturalLanguageInput: inputBioNaturalLanguage.length > advancedSearch.natural_language.length, bioNLSearchDisabled: inputBioNaturalLanguage.length <= 0 });
	}

	/**
	 * Function to handle onchange event for natural language search value.
	 * @param {object} event - event object.
	 **/
	const NaturalLanguageChange = (event) => {
		props.setInputValue(event.target.value);
		setNaturalLanguageError({ bioNaturalLanguageInput: event.target.value.length > advancedSearch.natural_language.length, bioNLSearchDisabled: event.target.value.length <= 0 });
	}
	 
	/**
	 * Function to clear input field values.
	 **/
	const clearNaturalLanguage = () => {
		props.setInputValue('');
		setNaturalLanguageError({ bioNaturalLanguageInput: false, bioNLSearchDisabled: true });
	};

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
						<Button className='gg-btn-outline me-4' onClick={clearNaturalLanguage}>
							Clear Fields
						</Button>
						<Button
							className='gg-btn-blue'
							onClick={props.searchNaturalLanguageClick}
							disabled={
								!Object.keys(naturalLanguageError).every(
									(err) => naturalLanguageError[err] === false
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
                                title={commonBiomarkerData.natural_language_question.tooltip.title}
                                text={commonBiomarkerData.natural_language_question.tooltip.text}
                            />
                            {commonBiomarkerData.natural_language_question.name}
						</Typography>
						<OutlinedInput
                            placeholder={advancedSearch.natural_language.placeholder}
							margin='dense'
							multiline
							rows={3}
                            value={props.inputValue}
                            onChange={NaturalLanguageChange}
                            error={props.inputValue.length > advancedSearch.natural_language.length}
						/>
						{props.inputValue.length > advancedSearch.natural_language.length && (
							<FormHelperText className={"error-text"} error>
								{advancedSearch.natural_language.errorText}
							</FormHelperText>
						)}
						<ExampleControl
							exampleMap={advancedSearch.natural_language.examples}
							type={advancedSearch.natural_language.examples.natural_language.id}
							setInputValue={input => {
								bioNaturalLanguageChange(input);
							}}
						/>
					</FormControl>
				</Grid>
				{/* Buttons Buttom */}
				<Grid item xs={12} sm={10}>
					{/* <Row className='gg-align-right pt-3 mb-2 mr-1'> */}
					<div className='gg-align-right pt-3 mb-2 me-1'>
						<Button className='gg-btn-outline me-4' onClick={clearNaturalLanguage}>
							Clear Fields
						</Button>
						<Button
							className='gg-btn-blue'
							onClick={props.searchNaturalLanguageClick}
							disabled={
								!Object.keys(naturalLanguageError).every(
									(err) => naturalLanguageError[err] === false
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

export default NaturalLanguageSearch;

NaturalLanguageSearch.propTypes = {
	inputValue: PropTypes.object,
	searchNaturalLanguageClick: PropTypes.func,
	setInputValue: PropTypes.func,
};
