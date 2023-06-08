import { makeStyles, Theme } from '@material-ui/core/styles';


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