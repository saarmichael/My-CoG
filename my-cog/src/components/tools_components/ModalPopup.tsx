import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { GlobalDataContext, IGlobalDataContext } from '../../contexts/ElectrodeFocusContext';

type ModalPopupProps = {
    title: string;
    buttonName: string;
    content: JSX.Element;
    width?: string;
    height?: string;
};

const ModalPopup: React.FC<ModalPopupProps> = ( { title, buttonName, content, width = '50%', height = '50%' }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { chosenFile } = useContext(GlobalDataContext) as IGlobalDataContext;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setOpen(false);
  }, [chosenFile]);

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '75%',
    maxHeight: '75%',
    width: width,
    height: height,
    overflow: 'scroll',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div>
        <div onClick={handleOpen}>{buttonName}</div>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
            <IconButton 
                aria-label="close" 
                onClick={handleClose} 
                sx={{ position: 'absolute', right: 8, top: 8 }}>
                <CloseIcon />
            </IconButton>
            <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {content}
            </Typography>
        </Box>
        </Modal>
        
    </div>
  );
}

export default ModalPopup;
