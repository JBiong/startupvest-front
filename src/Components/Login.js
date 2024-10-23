// src/components/Login.js
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Grid, Typography, TextField, Button, Link, Paper, IconButton, InputAdornment, FormControl, ButtonGroup } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginStyles from '../styles/Login';
import Loading from './Loading';
import ForgotPasswordDialog from '../Dialogs/ForgotPasswordDialog';

import { useAuth } from '../Context/AuthContext';

function Login() {
  const { setRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [zoomLevel, setZoomLevel] = useState(window.devicePixelRatio);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); 
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [selected, setSelected] = useState('Startup Vest');
  
  const handleButtonClick = (value) => {
    setSelected(value);
    };

  const handleOpenForgotPassword = () => {
    setForgotPasswordOpen(true);
  };

  const handleCloseForgotPassword = () => {
    setForgotPasswordOpen(false);
  };

  // Adjust zoom level on window resize (for detecting zoom changes)
  useEffect(() => {
    const handleResize = () => {
      setZoomLevel(window.devicePixelRatio);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, {
            email,
            password,
        });

        if (response.data && response.data.jwt) {
            localStorage.setItem('token', response.data.jwt);
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('role', response.data.role); 
            setRole(response.data.role);
            
            // pass auth to other systems
            window.open(`https://startupsphere.mugnavo.com/sso?token=${response.data.jwt}`, '_blank');
            window.open(`https://finease-test.vercel.app/sso?jwt=${response.data.jwt}&role=${response.data.role}&userId=${response.data.userId}`, '_blank');

            if(selected === 'Finease') {
              setTimeout(() => {
                window.location.href = "https://finease-test.vercel.app"
              }, 2000);
            } else if(selected === 'StartupSphere') {
              setTimeout(() => {
                window.location.href = "https://startupsphere.mugnavo.com"
              }, 2000);
            } else {
              // startupvest, no redirect to other systems
              if (response.data.role === 'Admin') {
                navigate('/admindashboard');
            } else if (response.data.role === 'Investor') {
                navigate('/investorDashboard');
            } else {
                navigate('/startupDashboard');
            }
        }
        } else {
            throw new Error('Invalid login response');
        }
    } catch (error) {
        console.error('Login failed:', error);
        setError('Incorrect email or password');
    } finally {
        setLoading(false);
    }
  };

  const isEmailRegistered = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/check-email`, {
        email,
      });
      setEmailExists(response.data.exists);
    } catch (error) {
      console.error('Error checking email:', error);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const scaleFactor = zoomLevel >= 1.25 ? 0.85 : 1; 

  if (loading) {
    return <Loading />;
  }

  return (
    <Container sx={{ ...LoginStyles.container, transform: `scale(${scaleFactor})`, }}>
      <Grid container>
        {/* Left Side Content */}
        <Grid item  xs={12} sm={7} sx={LoginStyles.leftSideGrid}>
          <Paper elevation={3} sx={LoginStyles.leftSidePaper}>
            <Typography variant="h4" sx={LoginStyles.leftSideTypography}>
              Welcome back! <br /> Excited to have you again. <br /> Sign in to get back on track!
            </Typography>
            <Typography variant="h6" sx={LoginStyles.leftSideSubtitle}>
              "Empowering Startups, Tracking Investments"
            </Typography>
            <img src="images/picture.jpg" alt="Startup Vest Logo"style={LoginStyles.leftSideImage}/>
          </Paper>
        </Grid>

        {/* LOGIN FORM */}
        <Grid item xs={12} sm={5} sx={LoginStyles.formContainer}>
          <Paper elevation={3} sx={LoginStyles.formPaper}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column',}}>
              <Typography variant="h5" sx={LoginStyles.formHeading}>Sign In</Typography>

              {/* Buttons for Application */}
              <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
                <ButtonGroup variant="contained" aria-label="application button group" sx={{ borderRadius: 4, width: '100%' }}>
                  <Button onClick={() => handleButtonClick('Startup Vest')}
                    variant={selected === 'Startup Vest' ? 'contained' : 'outlined'}
                    sx={{ borderRadius: 4, textTransform: 'none', flexGrow: 1 }}>
                    <Typography sx={{ fontSize: '13px' }}>Startup Vest</Typography>
                  </Button>

                  <Button onClick={() => handleButtonClick('Finease')}
                    variant={selected === 'Finease' ? 'contained' : 'outlined'}
                    sx={{ textTransform: 'none', flexGrow: 1 }}>
                    <Typography sx={{ fontSize: '13px' }}>Finease</Typography>
                  </Button>

                  <Button onClick={() => handleButtonClick('StartupSphere')}
                    variant={selected === 'StartupSphere' ? 'contained' : 'outlined'}
                    sx={{ borderRadius: 4, textTransform: 'none', flexGrow: 1 }}>
                    <Typography sx={{ fontSize: '13px' }}>StartupSphere</Typography>
                  </Button>
                </ButtonGroup>
              </FormControl>

              <Typography variant='body2' sx={{ color: '#004A98', mb: -1 }}>Email</Typography>
              <TextField type="text" placeholder="johndoe@gmail.com" required value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailExists(false);
                  setError('');
                }}
                onBlur={isEmailRegistered} fullWidth margin="normal" sx={LoginStyles.formInput}/>

              <Typography variant='body2' sx={{ color: '#004A98', mt: 1.5, mb: 1 }}>Password</Typography>
              <TextField type={showPassword ? 'text' : 'password'}
                placeholder="Example123" required value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }} fullWidthmargin="normal" sx={LoginStyles.formInput}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility} edge="end" size="small">
                        {showPassword ? (
                          <VisibilityOffIcon fontSize="small" />
                        ) : (
                          <VisibilityIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}  
                onCut={(e) => {
                  e.preventDefault();
                  setPassword([...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')); 
                }} 
                onCopy={(e) => {
                  e.preventDefault();
                  setPassword([...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')); 
                }} 
                onPaste={(e) => {
                  e.preventDefault();
                  setPassword([...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')); 
                }} />

              <Typography variant="body2" sx={LoginStyles.forgotPasswordText} onClick={handleOpenForgotPassword}>Forgot password?</Typography>
              {error && ( <Typography variant="body2" color="error">{error}</Typography>)}
              <Button type="submit" variant="contained" color="primary" sx={LoginStyles.formSubmitButton}>Sign In</Button>

              <div style={{ marginTop: '16px' }}>
                <Typography variant="body2" sx={LoginStyles.signUpText}>
                  Don't have an account?{' '}
                  <Link component={RouterLink} to="/signup" sx={LoginStyles.signUpLink}>
                    Sign Up
                  </Link>
                </Typography>
              </div>
            </form>
          </Paper>
        </Grid>
      </Grid>
      <ForgotPasswordDialog open={forgotPasswordOpen} onClose={handleCloseForgotPassword} />
    </Container>
  );
}

export default Login;
