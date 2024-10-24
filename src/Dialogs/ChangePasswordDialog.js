import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Box, IconButton, InputAdornment, Typography, LinearProgress, } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const ChangePasswordDialog = ({ open, onClose, onSave }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Updated Password requirements
  const passwordRequirements = {
    minLength: 8,
    hasUpperCase: /[A-Z]/,
    hasLowerCase: /[a-z]/,
    hasNumber: /\d/,
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
  };

  const checkPasswordStrength = (password) => {
    const conditions = [
      password.length >= passwordRequirements.minLength,
      passwordRequirements.hasUpperCase.test(password),
      passwordRequirements.hasLowerCase.test(password),
      passwordRequirements.hasNumber.test(password),
      passwordRequirements.hasSpecialChar.test(password),
    ];
    return conditions.filter(Boolean).length;
  };

  const getPasswordStrength = () => {
    const strength = checkPasswordStrength(newPassword);
    return (strength / 5) * 100; 
  };

  const handleSave = () => {
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match');
      return;
    }
    onSave(currentPassword, newPassword);
    onClose();
  };

  const isSaveDisabled =
    !currentPassword ||
    !newPassword ||
    !confirmNewPassword ||
    newPassword !== confirmNewPassword;

  // Check if password meets requirements
  const passwordMeetsRequirements = () => {
    return (
      newPassword.length >= passwordRequirements.minLength &&
      passwordRequirements.hasUpperCase.test(newPassword) &&
      passwordRequirements.hasLowerCase.test(newPassword) &&
      passwordRequirements.hasNumber.test(newPassword) &&
      passwordRequirements.hasSpecialChar.test(newPassword)
    );
  };

  const handleDialogClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ position: 'relative', padding: '16px 24px' }}>
        <Typography variant="h6" fontWeight="bold">Change Password</Typography>
        <IconButton aria-label="close" onClick={onClose}
          sx={{ position: 'absolute', right: 0, top: 3, color: '#ED262A' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

    <DialogContent sx={{ padding: '24px' }}>
        <Box component="form" sx={{ mt: 2 }}>
            <Typography variant="subtitle1" color="text.secondary">Password Requirements:</Typography>

            <ul>
                <li style={{ color: newPassword.length >= passwordRequirements.minLength ? 'green' : 'inherit' }}>
                    Must be at least {passwordRequirements.minLength} characters long.
                </li>
                <li style={{ color: passwordRequirements.hasUpperCase.test(newPassword) ? 'green' : 'inherit' }}>
                    Must contain at least one uppercase letter.
                </li>
                <li style={{ color: passwordRequirements.hasLowerCase.test(newPassword) ? 'green' : 'inherit' }}>
                    Must contain at least one lowercase letter.
                </li>
                <li style={{ color: passwordRequirements.hasNumber.test(newPassword) ? 'green' : 'inherit' }}>
                    Must contain at least one number.
                </li>
                <li style={{ color: passwordRequirements.hasSpecialChar.test(newPassword) ? 'green' : 'inherit' }}>
                    Must contain at least one special character.
                </li>
            </ul>

            <Typography variant="body2">Current Password</Typography>
            <TextField fullWidth placeholder="**********" type='password' value={currentPassword}sx={{ mb: 3 }}
            onChange={(e) => setCurrentPassword(e.target.value)} 
            onCut={(e) => {
              e.preventDefault();
            }} 
            onCopy={(e) => {
              e.preventDefault();
            }} 
            onPaste={(e) => {
              e.preventDefault();
            }}/>

            <Typography variant="body2">New Password</Typography>
            <TextField fullWidth placeholder="**********" type='password' value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
                endAdornment: (
                <InputAdornment position="end">
                    {passwordMeetsRequirements() ? (
                    <CheckCircleIcon color="success" />
                    ) : (
                    <ErrorIcon color="error" />
                    )}
                </InputAdornment>
                ),
            }}
            sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'error.main',
                },
                '&.Mui-success .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'success.main',
                },
                },
            }} 
            onCut={(e) => {
              e.preventDefault();
            }} 
            onCopy={(e) => {
              e.preventDefault();
            }} 
            onPaste={(e) => {
              e.preventDefault();
            }}/>
            <LinearProgress variant="determinate" value={getPasswordStrength()}
            sx={{ mb: 2, height: 8, borderRadius: 4, backgroundColor: (theme) => theme.palette.grey[300] }}/>

            <Typography variant="body2">Confirm Current Password</Typography>
            <TextField fullWidth placeholder="**********"  type='password' value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            error={newPassword !== confirmNewPassword && confirmNewPassword !== ''}
            helperText={
                newPassword !== confirmNewPassword && confirmNewPassword !== ''
                ? 'Passwords do not match'
                : ''
            }
            sx={{
                '& .MuiOutlinedInput-root': {
                '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'error.main',
                },
                '&.Mui-success .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'success.main',
                },
                },
            }}
            onCut={(e) => {
              e.preventDefault();
            }} 
            onCopy={(e) => {
              e.preventDefault();
            }} 
            onPaste={(e) => {
              e.preventDefault();
            }}/>
        </Box>
    </DialogContent>

    <DialogActions sx={{ justifyContent: 'flex-end', padding: '16px', mr: 1 }}>
        <Button onClick={handleSave} color="primary" variant="contained" disabled={isSaveDisabled}>Confirm</Button></DialogActions>
    </Dialog>
  );
};

export default ChangePasswordDialog;