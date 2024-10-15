import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Grid, Typography, TextField, Button, Select, MenuItem, FormControl, InputAdornment, IconButton, Tooltip } from '@mui/material';
import genderOptions from '../static/genderOptions';
import roleOptions from '../static/roleOptions';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SignupDialog from '../Dialogs/SignupDialog';
import { styles } from '../styles/Signup';

function Signup() {
    const navigate = useNavigate();
    const [role, setRole] = useState('CEO');
    const [openDialog, setOpenDialog] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [startupCode, setStartupCode] = useState('');

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
    const [zoomLevel, setZoomLevel] = useState(window.devicePixelRatio);

    // Adjust zoom level on window resize
    useEffect(() => {
        const handleResize = () => {
            setZoomLevel(window.devicePixelRatio);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
            setPasswordError('Please enter valid password.');
            return false;
        }

        setPasswordError('');
        return true;
    };

    const validateContactNumber = (number) => {
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(number)) {
            setContactNumberError('Enter a valid number (10-15 digits).');
            return false;
        }
        setContactNumberError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            firstName: e.target.elements.firstName.value,
            lastName: e.target.elements.lastName.value,
            email: e.target.elements.email.value,
            contactNumber: e.target.elements.contactNumber.value,
            gender: e.target.elements.gender.value,
            password,
            role: role,
            startupCode: role === 'CFO' ? startupCode : '',
        };

        if (!validateEmail(userData.email) || !validatePassword(password) || !validateContactNumber(userData.contactNumber)) {
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

    const scaleFactor = zoomLevel >= 1.25 ? 0.85 : 1;

    return (
        <div style={{ ...styles.container, transform: `scale(${scaleFactor})` }}>
            <Grid container>
                <Grid item xs={12} sm={1} sx={styles.sideBar}></Grid>
                <Grid item xs={12} sm={6} sx={styles.titleContainer}>
                    <Typography sx={styles.title}>
                        "Empowering <br /> Startups, <br /> Tracking <br /> Investments"
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={4} sx={styles.formContainer}>
                    <Typography variant="h5" component="header" sx={styles.formTitle}>
                        Create Account
                    </Typography>

                    <form onSubmit={handleSubmit} className="signup-form">
                        <Grid container spacing={1.5} className="signup-details">
                            <Grid item xs={6}>
                                <Typography variant="body2" sx={{ color: '#F2F2F2' }}>First Name</Typography>
                                <TextField fullWidth name="firstName" placeholder="John" required sx={styles.textField} />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" sx={{ color: '#F2F2F2' }}>Last Name</Typography>
                                <TextField fullWidth name="lastName" placeholder="Doe" required sx={styles.textField} />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ color: '#F2F2F2' }}>Role</Typography>
                                <FormControl fullWidth>
                                    <Select name="role" sx={styles.textField} defaultValue='CEO' onChange={(e) => setRole(e.target.value)}>
                                        {roleOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem> 
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {role === 'CFO' && (
                                <Grid item xs={12}>
                                    <Typography variant="body2" sx={{ color: '#F2F2F2' }}>Startup Code</Typography>
                                    <TextField required fullWidth name="startupCode" placeholder="Enter Startup Code"
                                        value={startupCode}
                                        onChange={(e) => setStartupCode(e.target.value)}
                                        sx={styles.textField} />
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ color: '#F2F2F2' }}>Email</Typography>
                                <Tooltip title={error} open={!!error} placement="bottom-start"
                                    PopperProps={{
                                        modifiers: [
                                            {
                                                name: 'offset',
                                                options: {
                                                    offset: [0, 10],
                                                },
                                            },
                                        ],
                                    }}>
                                    <span>
                                        <TextField fullWidth name="email" placeholder="johndoe@gmail.com"type="email"
                                            value={email} sx={styles.textField}
                                            error={emailExists || !!error}
                                            onChange={(e) => {
                                                const emailInput = e.target.value;
                                                setEmail(emailInput);
                                                validateEmail(emailInput);
                                            }}
                                            onBlur={checkEmailExists} />
                                    </span>
                                </Tooltip>
                            </Grid>

                            <Grid item xs={6}>
                                <Typography variant="body2" sx={{ color: '#F2F2F2' }}>Phone Number</Typography>
                                <Tooltip title={contactNumberError} open={!!contactNumberError} placement="bottom-start"
                                    PopperProps={{
                                        modifiers: [
                                            {
                                                name: 'offset',
                                                options: {
                                                    offset: [0, 10],
                                                },
                                            },
                                        ],
                                    }}>
                                    <span>
                                        <TextField fullWidth name="contactNumber" placeholder="09231321889" type="tel"
                                            value={contactNumber} sx={styles.textField}
                                            onChange={(e) => {
                                                const numberInput = e.target.value;
                                                const cleanedInput = numberInput.replace(/\D/g, '');
                                                setContactNumber(cleanedInput);
                                                validateContactNumber(cleanedInput);
                                            }}
                                            error={!!contactNumberError} />
                                    </span>
                                </Tooltip>
                            </Grid>
                            
                            <Grid item xs={6}>
                                <Typography variant="body2" sx={{ color: '#F2F2F2' }}>Gender</Typography>
                                <FormControl fullWidth>
                                    <Select name="gender" sx={styles.textField} defaultValue='Male'>
                                        {genderOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" sx={{ color: '#F2F2F2' }}>Password</Typography>
                                <Tooltip
                                    title={
                                        <div>
                                            <div style={{ color: passwordValidation.feedback.length ? 'lightgreen' : 'white' }}>
                                                Must be at least 8 characters long.
                                            </div>
                                            <div style={{ color: passwordValidation.feedback.hasLowerCase ? 'lightgreen' : 'white' }}>
                                               Must contain at least one uppercase letter.
                                            </div>
                                            <div style={{ color: passwordValidation.feedback.hasUpperCase ? 'lightgreen' : 'white' }}>
                                              Must contain at least one lowercase letter.
                                            </div>
                                            <div style={{ color: passwordValidation.feedback.hasNumber ? 'lightgreen' : 'white' }}>
                                                Must contain at least one number.
                                            </div>
                                            <div style={{ color: passwordValidation.feedback.hasSpecialChar ? 'lightgreen' : 'white' }}>
                                                Must contain at least one special character.
                                            </div>
                                        </div>
                                    }
                                    PopperProps={{
                                        modifiers: [
                                            {
                                                name: 'offset',
                                                options: {
                                                    offset: [0, 10],
                                                },
                                            },
                                        ],
                                    }}
                                    placement="bottom-start">
                                    <span>
                                        <TextField fullWidth name="password" placeholder="Your Password"
                                            type={showPassword ? 'text' : 'password'} value={password}
                                            onChange={handlePasswordChange} sx={styles.textField}
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
                                            }}/>
                                    </span>
                                </Tooltip>
                                {passwordError && (
                                    <Typography variant="body2" sx={{ color: 'white' }}>{passwordError}</Typography>
                                )}
                            </Grid>
                        </Grid>

                        <Button type="submit" fullWidth sx={styles.submitButton}>
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
        </div>
    );
}

export default Signup;