import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; 
import termsAndConditions from '../static/termsandcondition';

const TermsAndConditionsDialog = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth fullscreen>
      <DialogTitle sx={{ position: 'relative' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Terms and Conditions for Investments
        </Typography>

        <IconButton 
          onClick={onClose} 
          sx={{  position: 'absolute',  right: 0, top: 8,  color: '#ED262A'  }}>
          <CloseIcon />
        </IconButton>

      </DialogTitle>
      <DialogContent>
        <div dangerouslySetInnerHTML={{ __html: termsAndConditions }} 
          style={{ textAlign: 'justify', margin: '0 16px', lineHeight: '1.6' }} />
      </DialogContent>
    </Dialog>
  );
};

export default TermsAndConditionsDialog;
