import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, CircularProgress, Typography } from '@mui/material';

const ConfirmCancelDialog = ({ open, onClose, onConfirm, companyName }) => {
  const [cancelSuccessDialogOpen, setCancelSuccessDialogOpen] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    let timer;
    if (cancelSuccessDialogOpen) {
      timer = setTimeout(() => {
        setCancelSuccessDialogOpen(false);
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [cancelSuccessDialogOpen]);

  const handleConfirmCancel = async () => {
    setIsCanceling(true);
    try {
      await onConfirm();
      setCancelSuccessDialogOpen(true);
    } catch (error) {
      console.error('Failed to cancel:', error);
    } finally {
      setIsCanceling(false);
      onClose(); 
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#f44336', color: 'white', mb: 3 }}>
          <Typography variant="h6">Cancel Confirmation</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel the profile verification request for <strong>{companyName}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{ color: '#f44336', '&:hover': { backgroundColor: '#fce4e4' } }}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmCancel} 
            sx={{ color: '#4caf50', '&:hover': { backgroundColor: '#e8f5e9' } }}
            autoFocus
            disabled={isCanceling}>
            {isCanceling ? <CircularProgress size={24} sx={{ color: '#4caf50' }} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={cancelSuccessDialogOpen} onClose={() => setCancelSuccessDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#4caf50', color: 'white', mb: 3 }}>
          <Typography variant="h6">Profile Canceled</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            The startup profile verification has been successfully canceled, and the profile is no longer valid or usable.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelSuccessDialogOpen(false)} sx={{ color: '#4caf50', '&:hover': { backgroundColor: '#e8f5e9' } }}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmCancelDialog;
