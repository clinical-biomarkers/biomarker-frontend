import React from 'react';
import TextField from '@material-ui/core/TextField';
import { getCategorizedTypeahed } from '../../data/commonApi';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PropTypes from 'prop-types';
import FormHelperText from '@material-ui/core/FormHelperText';
import '../../css/Search.css';

/**
 * Text input component with categorized typeahead.
 **/
export default function AutoTextInput(props) {
    const [options, setOptions] = React.useState([]);
    const inputValueRef = React.useRef(props.inputValue);
    inputValueRef.current = props.inputValue;

	/**
	 * Function to handle change event for input text.
	 * @param {object} event event object.
	 * @param {string} value input value.
	 * @param {string} reason event reason.
	 **/
	const handleChange = (event, value, reason) => {
		if (!(event === null && value === "" && reason === "reset")){
			  props.setInputValue(value);
		}
	};

	/**
	 * useEffect to get typeahead data from api.
	 **/
	React.useEffect(() => {
		if (props.inputValue.trim().length < 5) {
			setOptions([]);
			return undefined;
		}

		if (props.inputValue) {
			getCategorizedTypeahed(props.typeahedID, props.inputValue).then((response) => inputValueRef.current.trim().length > 4 ? setOptions(response.data) : setOptions([]));
		}

		return;
	}, [props.inputValue, props.typeahedID]);

	return (
		<>
			<Autocomplete
				freeSolo
				getOptionLabel={(option) => option.label}
				groupBy={(option) => option.category}
				classes={{
				 	option: 'categorized-auto-option',
				 	inputRoot: 'auto-input-root',
					input: 'input-auto',
					groupLabel: 'categorized-auto-label'
                }}
                options={options}
                filterOptions={(options) => options}
				autoHighlight={true}
				inputValue={props.inputValue}
				onInputChange={handleChange}
				onClose={(event, reason) => setOptions([])}
				renderInput={(params) => (
					<TextField
						{...params}
						variant='outlined'
						placeholder={props.placeholder}
						error={props.inputValue.length > props.length}
					/>
				)}
			/>
			{props.inputValue.length > props.length && (
				<FormHelperText className={"error-text"} error>
					{props.errorText}
				</FormHelperText>
			)}
		</>
	);
}

AutoTextInput.propTypes = {
	inputValue: PropTypes.string,
	placeholder: PropTypes.string,
	typeahedID: PropTypes.string,
	errorText: PropTypes.string,
	length: PropTypes.number,
	setInputValue: PropTypes.func,
};
