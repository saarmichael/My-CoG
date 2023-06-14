import { makeStyles, Theme } from '@material-ui/core/styles';
import { StylesConfig, GroupBase, CSSObjectWithLabel, OptionProps } from 'react-select';
import { styled } from "@mui/system";

export type OptionType = { label: string; value: number };

export const customStyles: StylesConfig<OptionType, false> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#f1e0ff",
    borderRadius: "5px",
    height: "25px",
    width: "200px",
    padding: "0px 10px",
    marginTop: "10px",
    borderColor: state.isFocused ? "#a040f0" : "#800080",
    boxShadow: state.isFocused ? "0 0 0 1px #a040f0" : "none",
    "&:hover": {
      borderColor: "#800080"
    },
    outline: "none"
  }),
  option: (styles: CSSObjectWithLabel, { isFocused, isSelected }: OptionProps<OptionType, false, GroupBase<OptionType>>) => {
    return {
      ...styles,
      backgroundColor: isSelected ? "" : (isFocused && !isSelected) ? "" : undefined, // Updated condition here
      color: "#800080",
    };
  },
  menu: (base) => ({
    ...base,
    width: "200px",
  })
}


export const useTextFieldsStyle = makeStyles((theme: Theme) => ({
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'purple',
      },
      '&:hover fieldset': {
        borderColor: '#800080',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#a040f0',
      },
    },
    '& .MuiFormLabel-root': {
      color: 'purple',
    },
    '& .MuiFormLabel-root.Mui-focused': {
      color: '#a040f0',
    },
    '& .MuiInputBase-input': {
      color: '#800080',
      backgroundColor: '#f1e0ff',
    },
  },
}));

export const useDropdownStyles = makeStyles({
  customDropdown: {
    backgroundColor: "#f1e0ff",
    color: "#800080",
    borderRadius: "5px",
    height: "30px",
    width: "120px",
    padding: "6px 10px",
    marginTop: "10px",
    border: "1px solid purple",
    outline: "none",
    '&:focus': {
      borderColor: "#a040f0",
    },
    '&:hover': {
      borderColor: "#800080",
    },
  },
});

export const useStyles = makeStyles((theme) => ({
  backdrop: {
    color: '#fff',
  },
}));



export const IconWrapper = styled('div')({
  cursor: 'pointer',
  display: 'inline-flex',
  borderRadius: '50%',
  padding: '5px',
  transition: '0.3s',
  '&:hover': {
    boxShadow: '0 0 10px rgba(0,0,0,0.5)'
  }
});