import { makeStyles, Theme } from '@material-ui/core/styles';


export const useStyles = makeStyles((theme: Theme) => ({
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
      backgroundColor: '#f1e0ff', // Noticable faded purple background
    },
  },
}));