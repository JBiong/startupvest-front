import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, Stepper, Step, StepLabel, InputAdornment, LinearProgress, IconButton, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { green, red, yellow } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const steps = ['Input Email', 'Wait for OTP', 'Reset Password'];

function ForgotPasswordDialog({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

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

  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleNext = async () => {
    setErrorMessage(''); 

    if (activeStep === 0) {
      // Simulate sending OTP
      if (email && validateEmail(email)) {
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/users/forgot-password`, { email });
          setIsOtpSent(true);
          setActiveStep((prevStep) => prevStep + 1);
        } catch (error) {
          setErrorMessage('Failed to send OTP. Please try again.');
        }
      } else {
        setErrorMessage('Please enter a valid email address.');
      }
    } else if (activeStep === 1) {
      // Simulate OTP verification
      if (email) {
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/users/verify-otp`, { 
            email, 
            otp: otp.join('') 
          });
          setActiveStep((prevStep) => prevStep + 1);
        } catch (error) {
          setErrorMessage('Invalid OTP. Please try again.');
        }
      } else {
        setErrorMessage('Please enter a valid email address.');
      }
    } else if (activeStep === 2) {
      // Validate new password
      if (newPassword !== confirmNewPassword) {
        setErrorMessage('New passwords do not match.');
        return;
      }
      if (email) {
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/users/reset-password`, { 
            email, 
            newPassword
          });
          setSuccessMessage('Your password has been reset successfully!');
          setActiveStep(steps.length);
        } catch (error) {
          setErrorMessage('Failed to reset password. Please try again.');
        }
      } else {
        setErrorMessage('Please enter a valid email address.');
      }
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return; 
    const otpArray = [...otp];
    otpArray[index] = element.value;
    setOtp(otpArray);
    setErrorMessage(''); 

    // Automatically focus next input box
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const passwordMeetsRequirements = () => {
    return (
      newPassword.length >= passwordRequirements.minLength &&
      passwordRequirements.hasUpperCase.test(newPassword) &&
      passwordRequirements.hasLowerCase.test(newPassword) &&
      passwordRequirements.hasNumber.test(newPassword) &&
      passwordRequirements.hasSpecialChar.test(newPassword)
    );
  };

  const resetForm = () => {
    setActiveStep(0);
    setEmail('');
    setOtp(new Array(6).fill('')); 
    setNewPassword('');
    setConfirmNewPassword('');
    setSuccessMessage('');
    setErrorMessage('');
    setIsOtpSent(false);
  };

  const handleClose = () => {
    resetForm();
    onClose(); 
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm">
      <DialogTitle sx={{ position: 'relative', padding: '20px 24px' }}>
        <Typography variant="h6" fontWeight="bold">Forgot Password</Typography>
        <IconButton aria-label="close" onClick={handleClose} style={{ position: 'absolute', right: 0, top: 3, color: '#ED262A' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {/* Show stepper only if not completed */}
        {activeStep < steps.length && (
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        {activeStep === 0 && (
          <Box>
            <Typography variant="body1" align="justify" sx={{ mb: 2 }}>
              To reset your password, please enter your email address. We'll send you a link to create a new password.
            </Typography>
            <Typography variant="body2" align="justify" sx={{ mt: 2 }}>Email</Typography>
            <TextField autoFocus margin="dense" type="email" fullWidth variant="outlined" value={email} placeholder='Enter your email'
              onChange={(e) => setEmail(e.target.value)} />
          </Box>
        )}

        {activeStep === 1 && isOtpSent && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> 
            <Typography variant="body1" align="justify" sx={{ m: 2 }}>
              An OTP has been sent to your email. Please enter it below to verify your identity and continue the password reset process.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              {otp.map((data, index) => (
                <TextField
                  key={index}
                  autoFocus={index === 0}
                  margin="dense"
                  type="text"
                  required
                  inputProps={{ maxLength: 1 }}
                  value={data}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onInput={(e) => {
                    if (e.target.value.length === 1 && index < otp.length - 1) {
                      document.getElementById(`otp-input-${index + 1}`).focus();
                    }
                  }}
                  id={`otp-input-${index}`}
                  sx={{ width: '69px'}}
                  InputProps={{
                    sx: { fontSize: '24px',    pl: '13px', }, }}/>
              ))}
            </Box>
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 2 }}>Password Requirements:</Typography>
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
            <Typography variant="body2" align="justify" sx={{ mt: 2 }}>Enter your new password</Typography>
            <TextField fullWidth type="password" variant="outlined" value={newPassword}
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
              onCut={(e) => {
                e.preventDefault();
              }} 
              onCopy={(e) => {
                e.preventDefault();
              }} 
              onPaste={(e) => {
                e.preventDefault();
              }}
              sx={{ mb: 2 }}/>

              <LinearProgress variant="determinate"value={getPasswordStrength()}
              sx={{
                mb: 3, height: 8, borderRadius: 4, backgroundColor: (theme) => theme.palette.grey[300],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getPasswordStrength() < 40 ? red[500] : getPasswordStrength() < 80 ? yellow[500] : green[500],
                },
              }}/>

            <Typography variant="body2" align="justify" sx={{ mt: 2 }}>Confirm your new password</Typography>
            <TextField fullWidth type="password" variant="outlined" value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              error={newPassword !== confirmNewPassword && confirmNewPassword !== ''}
              helperText={
                newPassword !== confirmNewPassword && confirmNewPassword !== ''
                  ? 'Passwords do not match'
                  : ''
              } 
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
        )}

        {errorMessage && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {errorMessage}
          </Typography>
        )}

        {successMessage && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: green[50],
            padding: '12px',
            borderRadius: '8px',
            marginTop: 2,
            border: `1px solid ${green[500]}`,
            boxShadow: `0 4px 6px rgba(0, 128, 0, 0.2)`
          }}>
            <CheckCircleIcon sx={{ color: green[500], marginRight: 1, fontSize: 30 }} />
            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 'bold' }}>
              {successMessage}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {activeStep === steps.length ? (
          <Button onClick={handleClose} color="primary" sx={{ mr: 1 }}>
            Close
          </Button>
        ) : (
          <Button onClick={handleNext} color="primary" sx={{ mr: 1 }}>
            {activeStep === steps.length - 1 ? 'Done' : 'Next'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ForgotPasswordDialog;