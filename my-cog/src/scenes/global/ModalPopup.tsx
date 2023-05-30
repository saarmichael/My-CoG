import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';


type ModalPopupProps = {
    title: string;
    buttonName: string;
    content: JSX.Element;
};

const ModalPopup: React.FC<ModalPopupProps> = ( { title, buttonName, content }) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: '75%',
    width: '75%',
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
