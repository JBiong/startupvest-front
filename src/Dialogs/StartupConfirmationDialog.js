import React, { useState } from 'react';
import { 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  Button, 
  Typography 
} from '@mui/material';

const StartupConfirmationDialog = ({ open, onClose, onConfirm, title, message, success }) => {
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const handleConfirm = async () => {
    await onConfirm(); 
    setSuccessDialogOpen(true); 
    onClose(); 
  };

  return (
    <>
      {/* Confirmation Dialog */}
      <Dialog 
        open={open} 
        onClose={onClose} 
        aria-labelledby="confirmation-dialog-title" 
        aria-describedby="confirmation-dialog-description" 
        maxWidth="sm" 
        fullWidth>
        <DialogTitle id="confirmation-dialog-title" sx={{ p: 3 }}>
          <Typography variant="h6">{title}</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body1">
              {message}
            </Typography>
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button 
            onClick={onClose} 
            sx={{ color: '#f44336', '&:hover': { backgroundColor: '#fce4e4' } }}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            sx={{ color: '#4caf50', '&:hover': { backgroundColor: '#e8f5e9' } }} 
            autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog 
        open={successDialogOpen} 
        onClose={() => setSuccessDialogOpen(false)} 
        aria-labelledby="success-dialog-title" 
        aria-describedby="success-dialog-description" 
        maxWidth="sm" 
        fullWidth>
        <DialogTitle id="success-dialog-title" sx={{ bgcolor: '#4caf50', color: 'white', mb: 3 }}>
          <Typography variant="h6">Operation Successful</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body1">
              {success}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setSuccessDialogOpen(false)} 
            sx={{ color: '#4caf50', '&:hover': { backgroundColor: '#e8f5e9' } }}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StartupConfirmationDialog;
