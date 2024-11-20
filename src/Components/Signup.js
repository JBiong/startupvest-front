import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Grid, Typography, TextField, Button, Select, MenuItem, FormControl, InputAdornment, IconButton, Menu, FormControlLabel, Checkbox, Tooltip} from '@mui/material';
import genderOptions from '../static/genderOptions';
import roleOptions from '../static/roleOptions';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SignupDialog from '../Dialogs/SignupDialog';
import countries from '../static/countries';
import TermsAndConditionsDialog from '../Dialogs/SignupConditionDialog';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

import { styles } from '../styles/Signup';

function Signup() {
    const [isScaled, setIsScaled] = useState(window.devicePixelRatio > 1);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [contactNumberErrorVisible, setContactNumberErrorVisible] = useState(false);
    const [emailErrorVisible, setEmailErrorVisible] = useState(false);
    const [selectedCountryCode, setSelectedCountryCode] = useState(countries[0]);
    const [attemptedSubmit, setAttemptedSubmit] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const navigate = useNavigate();
    const [role, setRole] = useState('CEO');
    const [openDialog, setOpenDialog] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [startupCode, setStartupCode] = useState('');
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [openTermsDialog, setOpenTermsDialog] = useState(false);

    const [error, setError] = useState('');
    const [contactNumberError, setContactNumberError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordValidation, setPasswordValidation] = useState({
        feedback: {
            length: false,
            hasUpperCase: false,
            hasLowerCase: false,
            hasNumber: false,   
            hasSpecialChar: false,
        },
    });

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordValidation({
            feedback: {
                length: value.length >= 8,
                hasUpperCase: /[A-Z]/.test(value),
                hasLowerCase: /[a-z]/.test(value),
                hasNumber: /\d/.test(value),
                hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
            },
        });

        // Clear password error when typing
        if (passwordError) {
            setPasswordError('');
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address with a domain (e.g., .com).');
            return false;
        }
        setError('');
        return true;
    };

    const validatePassword = (password) => {
        const { length, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar } = passwordValidation.feedback;

        const isValidPassword = length && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
        
        if (!isValidPassword) {
            const feedbackMessages = [];
            if (!length) feedbackMessages.push('Must be at least 8 characters long.');
            if (!hasUpperCase) feedbackMessages.push('Must contain at least one uppercase letter.');
            if (!hasLowerCase) feedbackMessages.push('Must contain at least one lowercase letter.');
            if (!hasNumber) feedbackMessages.push('Must contain at least one number.');
            if (!hasSpecialChar) feedbackMessages.push('Must contain at least one special character.');
            setPasswordError('Please follow the password requirements below!');
            return false;
        }

        setPasswordError('');
        return true;
    };

    // Validate phone number based on selected country
    const validateContactNumber = (number) => {
        try {
            // Check for Philippines-specific validation
            if (selectedCountryCode.code === 'PH') {
                // Philippine numbers should start with a 9
                if (!number.startsWith('9')) {
                    setContactNumberError('Philippine phone numbers must start with 9.');
                    return false;
                }
            }

            // Parse phone number using libphonenumber-js for the selected country
            const phoneNumber = parsePhoneNumber(number, selectedCountryCode.code);

            if (phoneNumber && phoneNumber.isValid()) {
                setContactNumberError('');
                return true;
            }
            setContactNumberError(`Invalid phone number for ${selectedCountryCode.label}.`);
            return false;
        } catch (error) {
            setContactNumberError(`Invalid phone number format for ${selectedCountryCode.label}.`);
            return false;
        }
    };
    
    const handleCountryClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleCountrySelect = (country) => {
        setSelectedCountryCode(country);
        setContactNumber('');  // Reset the phone number on country change
        setAnchorEl(null);
      };
    
      const formatContactNumberForCountry = (number) => {
        try {
          const phoneNumber = parsePhoneNumber(number, selectedCountryCode.code);
          return phoneNumber.formatInternational(); // Formats the phone number in international format
        } catch (error) {
          return number;
        }
      };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setAttemptedSubmit(true);
    
        if (!agreeToTerms) {
            return;
        }
    
        const contactNumber = e.target.elements.contactNumber.value;
    
        // Validate the local format first
        if (!validateContactNumber(contactNumber)) {
            return;
        }
    
        // Format the contact number for saving
        const formattedContactNumber = formatContactNumberForCountry(contactNumber);
    
        const userData = {
            firstName: e.target.elements.firstName.value,
            lastName: e.target.elements.lastName.value,
            email: e.target.elements.email.value,
            contactNumber: formattedContactNumber,
            gender: e.target.elements.gender.value,
            password,
            role: role,
            startupCode: role === 'CFO' ? startupCode : '',
        };
    
        if (!validateEmail(userData.email) || !validatePassword(password)) {
            return;
        }
    
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/register`, userData);
            console.log('Signup successful:', response.data);
            setOpenDialog(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            console.error('Signup failed:', error);
            setError('Signup failed. Please try again.');
        }
    };    

    const checkEmailExists = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/check-email`, { email });
            setEmailExists(response.data.exists);
            setError(response.data.exists ? 'Email already exists. Please enter a different email.' : '');
        } catch (error) {
            console.error('Error checking email:', error);
            setError('Error checking email. Please try again.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        navigate('/login');
    };

    // Detect Windows display scaling (via devicePixelRatio)
    useEffect(() => {
        const handleResize = () => {
            setIsScaled(window.devicePixelRatio > 1.24);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const adjustedTextFieldStyle = {
        ...styles.textField,
        height: isScaled ? '40px' : '50px',
        '& .MuiInputBase-root': { height: isScaled ? '40px' : '50px' },
    };

    const adjustedButtonStyle = {
        ...styles.submitButton,
        height: isScaled ? '40px' : '50px',
    };

    const adjustedTitleStyle = {
        fontSize: isScaled ? '4.5em' : '5.5em',
        fontWeight: 'bold',
        color: '#004A98',
    };

    const handleOpenTermsDialog = () => {
        setOpenTermsDialog(true);
    };

    const handleCloseTermsDialog = () => {
        setOpenTermsDialog(false);
    };

    return (
        <div style={ styles.container }>
            <Grid container>
                <Grid item xs={12} sm={1} sx={styles.sideBar}></Grid>
                
                <Grid item xs={12} sm={6} sx={styles.titleContainer}>
                    <Typography sx={adjustedTitleStyle}>
                        "Empowering <br /> Startups, <br /> Tracking <br /> Investments"
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={4} sx={styles.formContainer}>
                    <Typography variant="h5" component="header" sx={styles.formTitle}> Create Account</Typography>
                    <form onSubmit={handleSubmit} className="signup-form">
                        <Grid container spacing={1.5} className="signup-details">
                            <Grid item xs={6}>
                                <Typography variant="body2" sx={{ color: '#F2F2F2' }}>First Name *</Typography>
                                <TextField fullWidth name="firstName" placeholder="John" required sx={{ width: '100%', ...adjustedTextFieldStyle }} />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" sx={{ color: '#F2F2F2' }}>Last Name *</Typography>
                                <TextField fullWidth name="lastName" placeholder="Doe" required sx={{ width: '100%', ...adjustedTextFieldStyle }} />
                            </Grid>

                            <Grid item xs={12} sm={role === 'CFO' && isScaled ? 6 : 12}>
                                <Typography variant="body2" sx={{ color: '#F2F2F2' }}>Role *</Typography>
                                <FormControl fullWidth>
                                    <Select name="role" sx={{ width: '100%', ...adjustedTextFieldStyle }} defaultValue="CEO"
                                        onChange={(e) => setRole(e.target.value)}>
                                        {roleOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Startup Code: only shown when role is CFO */}
                            {role === 'CFO' && (
                                <Grid item xs={12} sm={isScaled ? 6 : 12}>
                                    <Typography variant="body2" sx={{ color: '#F2F2F2' }}>Startup Code *</Typography>
                                    <TextField required fullWidth name="startupCode" placeholder="Enter Startup Code"
                                        value={startupCode}
                                        onChange={(e) => setStartupCode(e.target.value)}
                                        sx={{ width: '100%', ...adjustedTextFieldStyle }} />
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ color: '#F2F2F2', fontSize: '16px' }}>Email *</Typography>
                                <span>
                                    <TextField fullWidth name="email" placeholder="johndoe@gmail.com" type="email" value={email}
                                        sx={{ width: '100%', ...adjustedTextFieldStyle, fontSize: '16px' }} 
                                        error={emailExists || !!error} 
                                        onChange={(e) => {
                                            const emailInput = e.target.value;
                                            setEmail(emailInput);
                                            validateEmail(emailInput);
                                        }}
                                        onFocus={() => setEmailErrorVisible(true)} 
                                        onBlur={() => {
                                            checkEmailExists();
                                            setEmailErrorVisible(false); 
                                        }}/>
                                </span>
                                {error && emailErrorVisible && ( 
                                    <div style={{ backgroundColor: '#333', color: 'white',  borderRadius: '4px',  padding: '10px',  marginTop: '5px',  fontSize: '14px', 
                                        position: 'absolute', zIndex: 1000,  }}>
                                        {error}
                                    </div>
                                )}
                            </Grid>

                            <Grid item xs={6}>
                                <Typography variant="body2" sx={{ color: '#F2F2F2' }}>Phone Number *</Typography>
                                <TextField fullWidth name="contactNumber" placeholder="Enter phone number" type="tel"
                                    value={contactNumber} sx={{ width: '100%', ...adjustedTextFieldStyle }}
                                    InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                        <IconButton onClick={handleCountryClick}
                                            sx={{ width: 30, height: 30, padding: 2, borderRadius: 1, fontSize: '12px', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center',}}>
                                            {selectedCountryCode.dialCode}
                                        </IconButton>
                                        </InputAdornment>
                                    ),
                                    }}
                                    onChange={(e) => {
                                    const numberInput = e.target.value;
                                    const cleanedInput = numberInput.replace(/\D/g, ''); // Strip non-numeric characters
                                    setContactNumber(cleanedInput);
                                    validateContactNumber(cleanedInput);
                                    }}
                                    error={!!contactNumberError}
                                    onFocus={() => setContactNumberErrorVisible(true)}
                                    onBlur={() => setContactNumberErrorVisible(false)} />

                                {/* Error tooltip */}
                                {contactNumberError && contactNumberErrorVisible && (
                                    <div
                                    style={{ backgroundColor: '#333', color: 'white', borderRadius: '4px', padding: '10px', marginTop: '5px', fontSize: '14px', position: 'absolute',
                                        zIndex: 1000, }}>
                                    {contactNumberError}
                                    </div>
                                )}

                                {/* Country selection menu */}
                                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                                    {countries.map((country) => (
                                    <MenuItem key={country.code} onClick={() => handleCountrySelect(country)}>
                                        {country.label} {country.dialCode}
                                    </MenuItem>
                                    ))}
                                </Menu>
                            </Grid>
                            
                            <Grid item xs={6}>
                                <Typography variant="body2" sx={{ color: '#F2F2F2' }}>Gender *</Typography>
                                <FormControl fullWidth>
                                    <Select name="gender" sx={{ width: '100%', ...adjustedTextFieldStyle }} defaultValue='Male'>
                                        {genderOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ color: '#F2F2F2', fontSize: '16px' }}>Password *</Typography>
                                <span>
                                    <TextField fullWidth name="password" placeholder="Your Password" type={showPassword ? 'text' : 'password'} value={password}
                                        onChange={handlePasswordChange}
                                        onFocus={() => setTooltipVisible(true)} 
                                        onBlur={() => setTooltipVisible(false)} 
                                        sx={{ width: '100%', ...adjustedTextFieldStyle, fontSize: '16px' }} 
                                        error={!!passwordError}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={togglePasswordVisibility}
                                                        edge="end"
                                                        sx={{ p: '10px' }}>
                                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                    </IconButton>
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
                                        }}/>
                                </span>
                                {tooltipVisible && (
                                    <div style={{ backgroundColor: '#333', color: 'white', borderRadius: '4px', padding: '10px', marginTop: '5px', fontSize: '14px', position: 'absolute', zIndex: 1000 }}>
                                        {passwordError && (
                                            <div style={{ color: 'salmon', marginBottom: '5px' }}>{passwordError}</div>
                                        )}
                                        <div style={{ color: passwordValidation.feedback.length ? 'lightgreen' : 'white' }}>
                                            Must be at least 8 characters long.
                                        </div>
                                        <div style={{ color: passwordValidation.feedback.hasUpperCase ? 'lightgreen' : 'white' }}>
                                            Must contain at least one uppercase letter.
                                        </div>
                                        <div style={{ color: passwordValidation.feedback.hasLowerCase ? 'lightgreen' : 'white' }}>
                                            Must contain at least one lowercase letter.
                                        </div>
                                        <div style={{ color: passwordValidation.feedback.hasNumber ? 'lightgreen' : 'white' }}>
                                            Must contain at least one number.
                                        </div>
                                        <div style={{ color: passwordValidation.feedback.hasSpecialChar ? 'lightgreen' : 'white' }}>
                                            Must contain at least one special character.
                                        </div>
                                    </div>
                                )}
                            </Grid>

                            <Grid item xs={12}>
                                <Tooltip title="You need to agree to the terms and conditions" open={attemptedSubmit && !agreeToTerms} placement="bottom" arrow>
                                    <span>
                                        <FormControlLabel control={
                                                <Checkbox checked={agreeToTerms} onChange={() => setAgreeToTerms(!agreeToTerms)}
                                                    sx={{ color: '#f2f2f2', '&.Mui-checked': { color: '#f2f2f2' }, }}/>
                                            }
                                            label={
                                                <>
                                                    I agree to the{' '}
                                                    <span onClick={handleOpenTermsDialog} style={{ fontWeight: 'bold', cursor: 'pointer'}}>
                                                        Terms and Conditions
                                                    </span>
                                                </>
                                            } sx={{ color: 'white' }} />
                                    </span>
                                </Tooltip>
                            </Grid>
                        </Grid>

                        <Button type="submit" fullWidth sx={adjustedButtonStyle}>
                            Sign up
                        </Button>

                        <Typography sx={styles.titleLink}>
                            Already have an account?{' '}
                            <Link to="/login" style={styles.linkText}>
                                Sign in
                            </Link>
                        </Typography>
                    </form>
                </Grid>
            </Grid>
            
            <SignupDialog open={openDialog} handleClose={handleCloseDialog} email={email} />
            <TermsAndConditionsDialog open={openTermsDialog} handleClose={handleCloseTermsDialog} />
        </div>
    );
}

export default Signup;