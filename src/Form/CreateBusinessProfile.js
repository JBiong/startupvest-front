import { useState } from 'react';
import industries from '../static/industries';
import quantityOptions from '../static/quantityOptions';
import SuccessCreateBusinessProfileDialog from '../Dialogs/SuccessCreateBusinessProfileDialog';
import { Box, Typography, TextField, Select, MenuItem, Grid, FormControl, CardContent, Button, Autocomplete, FormHelperText, Menu, IconButton, InputAdornment } from '@mui/material';
import { Business, Info } from '@mui/icons-material'; 
import { StyledCard } from '../styles/CardStyles';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import countries from '../static/countries';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

import axios from 'axios';

import { logActivity } from '../utils/activityUtils';
import { generateStartupCode } from '../Components/StartupCode';

function CreateBusinessProfile({ onSuccess, companyCount }) {
    const [selectedProfileType, setSelectedProfileType] = useState('Startup Company');

    // Profile Form Data Usestates
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [contactInformation, setContactInformation] = useState('');
    const [gender, setGender] = useState('');
    const [biography, setBiography] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [website, setWebsite] = useState('');
    const [facebook, setFacebook] = useState('');
    const [twitter, setTwitter] = useState('');
    const [instagram, setInstagram] = useState('');
    const [linkedIn, setLinkedIn] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyDescription, setCompanyDescription] = useState('');
    const [foundedDate, setFoundedDate] = useState(null);
    const [typeOfCompany, setTypeOfCompany] = useState('');
    const [numberOfEmployees, setNumberOfEmployees] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [industry, setIndustry] = useState('');
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);

    const [selectedCountryCode, setSelectedCountryCode] = useState(countries[0]);
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

    const RequiredAsterisk = <span style={{ color: 'red' }}>*</span>;
    const [loading, setLoading] = useState(false);

    // Error State Variables
    const [errors, setErrors] = useState({});
    const [phoneNumberErrorVisible, setPhoneNumberErrorVisible] = useState(false);

    const handleDateChange = (newDate) => {
        setFoundedDate(newDate);
        
        if (!newDate) {
          setErrors({ foundedDate: 'Please select a valid date' });
        } else {
          setErrors({ foundedDate: '' });
        }
    };

    const formattedDateString = foundedDate ? dayjs(foundedDate).format('MMMM D, YYYY') : '';

    const validateFields = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const contactInfoRegex = /^[0-9]{10,15}$/;
        const emptyFieldError = 'This field cannot be empty';
        const maxDescriptionLength = 1000;

        if (!companyName.trim()) newErrors.companyName = emptyFieldError;
        if (!companyDescription.trim()) newErrors.companyDescription = emptyFieldError;
            else if (companyDescription.length > maxDescriptionLength) 
            newErrors.companyDescription = `Company description cannot exceed ${maxDescriptionLength} characters.`;
        if (!foundedDate) newErrors.foundedDate = emptyFieldError;
        if (!typeOfCompany) newErrors.typeOfCompany = emptyFieldError;
        if (!numberOfEmployees) newErrors.numberOfEmployees = emptyFieldError;
        if (phoneNumberError) {
            newErrors.phoneNumber = phoneNumberError;
        }            
        else if (!contactInfoRegex.test(phoneNumber)) newErrors.phoneNumber = 'Enter a valid phone number (10-15 digits).';
        if (!contactEmail.trim()) newErrors.contactEmail = emptyFieldError;
            else if (!emailRegex.test(contactEmail)) newErrors.contactEmail = 'Invalid email address format';
        if (!industry) newErrors.industry = emptyFieldError;
        
            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
        };

    const handleCreateProfile = async () => {
        if (loading) return;

        if (!validateFields()) {
            return;
        }
  
        setLoading(true);
        const formattedContactNumber = formatContactNumberForCountry(phoneNumber);

        const profileData = {
            firstName, lastName, emailAddress, contactInformation, gender, biography,
            streetAddress, country, city, state, postalCode, website, facebook, twitter, 
            foundedDate: formattedDateString,
            instagram, linkedIn, companyName, companyDescription, 
            typeOfCompany, numberOfEmployees, phoneNumber: formattedContactNumber, contactEmail, industry,startupCode: generateStartupCode(),
          };
    
          let endpoint;
          let logMessage;
          if (selectedProfileType === 'Startup Company') {
            endpoint = `${process.env.REACT_APP_API_URL}/startups/create`;
            logMessage = `${companyName} Profile created successfully.`;
          } else if (selectedProfileType === 'Investor') {  
            endpoint = `${process.env.REACT_APP_API_URL}/investors/create`;
            logMessage = `${firstName} ${lastName} profile created successfully.`;
          } else {
            console.error('Invalid profile type:', selectedProfileType);
            setLoading(false);
            return;
          }
    
          try {
            await axios.post(endpoint, profileData, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
            });
    
            setSuccessDialogOpen(true);
    
            await logActivity(logMessage, `Awaiting admin approval to verify your startup.`);
    
            setTimeout(() => {
              setSuccessDialogOpen(false);
              onSuccess();
            }, 1000);
          } catch (error) {
            console.error('Failed to create profile:', error);
            setLoading(false);
          }
      };

      const validateContactNumber = (number) => {
        try {
            // Parsing the phone number using libphonenumber
            const phoneNumberInstance = parsePhoneNumber(number, selectedCountryCode.code);
            
            if (!phoneNumberInstance.isValid()) {
                setPhoneNumberError(`Invalid ${selectedCountryCode.label} phone number.`);
                return false;
            }
            
            // If valid, clear the error
            setPhoneNumberError('');
            return true;
        } catch (error) {
            setPhoneNumberError('Invalid phone number format.');
            return false;
        }
    };

    const formatContactNumberForCountry = (number) => {
        try {
            const phoneNumberInstance = parsePhoneNumber(number, selectedCountryCode.code);
            return phoneNumberInstance.formatInternational(); // Formats number in international format
        } catch (error) {
            console.error('Phone number formatting error:', error);
            return number; // Return as is if formatting fails
        }
    };

    const handleCountryClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCountrySelect = (country) => {
        setSelectedCountryCode(country);
        setPhoneNumber('');
        setAnchorEl(null);
    };
    
    return (
        <>
        <Box component="main" sx={{ flexGrow: 1, width: '100%', overflowX: 'hidden', maxWidth: '1000px',  background: '#F2F2F2'}}>
            <Box component="main" sx={{mr: 5, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: '#414a4c', fontWeight: '500', pl: 5, pb: 3, display: 'none' }}>Profile Type </Typography>

                <Box sx={{ display: 'flex', gap: 2, pl: 5, pb: 2, textAlign: 'center', flexDirection: { xs: 'column', sm: 'row' }, backgroundColor: '#f5f5f5', borderRadius: 2, display: 'none'}}>
                    <StyledCard color="#004A98"
                        onClick={() => setSelectedProfileType('Startup Company')} 
                        selected={selectedProfileType === 'Startup Company'}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                                <Business />
                                <Typography variant="h5" sx={{ fontWeight: 'bold', ml: 1 }}>Startup Company</Typography>
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Box>

                {selectedProfileType === 'Startup Company' && (
                <>
                    {companyCount === 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#FFEB3B', padding: 2, borderRadius: 2, ml: 5, mb: 2 }}>
                        <Typography variant="caption" sx={{ color: '#1E1E1E', fontWeight: 'bold' }}>
                            🏠︎ Welcome to the platform! To get started, please create your startup profile. This is essential for setting up funding rounds and unlocking other key features tailored to your business.
                        </Typography>
                    </Box>
                )}

                {companyCount > 0 && (
                <Box sx={{ backgroundColor: '#FFEB3B', display: 'flex', alignItems: 'center', padding: 2, borderRadius: 2, ml: 5, mb: 2 }}>
                    <Typography variant="caption" sx={{ color: '#1E1E1E', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <Info sx={{ mr: 1, color: "#1E1E1E", fontSize: 24 }} />
                    You can create as many startup profiles as you'd like. Add more profiles to track different businesses and funding rounds at any time.
                    </Typography>
                </Box>
                )}
          
                <Typography variant="h6" sx={{ color: '#414a4c', fontWeight: '500', pl: 5, pb: 3}}>Overview</Typography>

                <Grid container spacing={3} sx={{ ml: 2 }}>
                    <Grid item xs={12} sm={11.4}>
                        <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <label>Startup Name {RequiredAsterisk}</label>
                            <TextField fullWidth  required variant="outlined" value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                               sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                                error={!!errors.companyName} />
                                {errors.companyName && (<FormHelperText error>{errors.companyName}</FormHelperText>)}
                        </Grid>

                        <Grid item xs={12}>
                            <label>Description {RequiredAsterisk}</label>
                            <TextField fullWidth variant="outlined" value={companyDescription} multiline rows={6}
                                onChange={(e) => setCompanyDescription(e.target.value)}
                                error={!!errors.companyDescription}/>
                                {errors.companyDescription && (<FormHelperText error>{errors.companyDescription}</FormHelperText>)}
                        </Grid>

                        <Grid item xs={6}>
                            <label>Founded Date {RequiredAsterisk} <br /></label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker value={foundedDate} onChange={handleDateChange}
                                maxDate={dayjs().endOf('day')}
                                onAccept={(date) => {
                                    if (date.year() > dayjs().year()) {
                                        date = dayjs().year(dayjs().year()).month(date.month()).date(date.date());
                                    }
                                    handleDateChange(date);
                                }} 
                                renderInput={(params) => (
                                <TextField {...params} error={!!errors.foundedDate} helperText={errors.foundedDate} />
                                )}
                                sx={{ width: '100%', height: '45px',
                                    '& .MuiInputBase-root': { height: '45px', padding: '0px 14px', } }} />
                            </LocalizationProvider>
                            {errors.foundedDate && (<FormHelperText error>{errors.foundedDate}</FormHelperText>)}
                        </Grid>

                        <Grid item xs={6}>
                            <label>Type of Company {RequiredAsterisk}</label>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>  
                                    <Select fullWidth variant="outlined" value={typeOfCompany}
                                        onChange={(e) => setTypeOfCompany(e.target.value)}
                                        sx={{ height: '45px' }}
                                        error={!!errors.typeOfCompany}>
                                        <MenuItem value={'profit'}>Profit</MenuItem>
                                        <MenuItem value={'non-profit'}>Non-Profit</MenuItem>
                                    </Select>
                                    {errors.typeOfCompany && (<FormHelperText error>{errors.typeOfCompany}</FormHelperText>)}
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={6}>
                            <label>No. of Employees {RequiredAsterisk}</label>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>  
                                    <Select fullWidth  variant="outlined" value={numberOfEmployees}
                                        onChange={(e) => setNumberOfEmployees(e.target.value)}
                                        sx={{ height: '45px' }}
                                        error={!!errors.numberOfEmployees}>
                                        {quantityOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.typeOfCompany && (<FormHelperText error>{errors.typeOfCompany}</FormHelperText>)}
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={6}>
                            <label>Phone Number {RequiredAsterisk}</label>
                            <TextField
                                fullWidth
                                name="phoneNumber"
                                placeholder="Enter phone number"
                                type="tel"
                                value={phoneNumber}
                                sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconButton
                                                onClick={handleCountryClick}
                                                sx={{
                                                    width: 30, height: 30, padding: 2, borderRadius: 1,
                                                    fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}>
                                                {selectedCountryCode.label} {selectedCountryCode.dialCode}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                onChange={(e) => {
                                    const numberInput = e.target.value;
                                    const cleanedInput = numberInput.replace(/\D/g, ''); 
                                    setPhoneNumber(cleanedInput);
                                    validateContactNumber(cleanedInput);
                                }}
                                error={!!phoneNumberError}
                                onFocus={() => setPhoneNumberErrorVisible(true)}
                                onBlur={() => setPhoneNumberErrorVisible(false)} />
                            {phoneNumberError && (
                                <FormHelperText error>{phoneNumberError}</FormHelperText>
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

                        <Grid item xs={12}>
                            <label>Contact Email {RequiredAsterisk}</label>
                                <TextField fullWidth variant="outlined" type='email' value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}
                                    sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                                    error={!!errors.contactEmail} />
                                    {errors.contactEmail && (<FormHelperText error>{errors.contactEmail}</FormHelperText>)}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Typography variant="h6" sx={{ color: '#414a4c', fontWeight: '500', pl: 5, pt: 3, pb: 3 }}>
                    Industry {RequiredAsterisk}
                </Typography>

                <Grid container spacing={3} sx={{ ml: 2 }}>
                    <Grid item xs={12} sm={11.4}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined">
                                    <Autocomplete
                                        freeSolo 
                                        options={industries} 
                                        value={industry}
                                        onChange={(event, newValue) => setIndustry(newValue)}
                                        onInputChange={(event, newInputValue) => setIndustry(newInputValue)} 
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                error={!!errors.industry}
                                                sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }} />
                                        )} />
                                </FormControl>
                                {errors.industry && (<FormHelperText error>{errors.industry}</FormHelperText>)}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Typography variant="h6" sx={{ color: '#414a4c', fontWeight: '500', pl: 5, pt: 3, pb: 3 }}>
                    Links
                </Typography>

                <Grid container spacing={3} sx={{ ml: 2, mb: 2 }}>
                    <Grid item xs={12} sm={11.4}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <label>Website</label>
                                <TextField fullWidth variant="outlined" value={website} onChange={(e) => setWebsite(e.target.value)}
                                    sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}/>
                            </Grid>

                            <Grid item xs={12}>
                                <label>Facebook</label>
                                <TextField fullWidth variant="outlined" value={facebook} onChange={(e) => setFacebook(e.target.value)} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}/>
                            </Grid>

                            <Grid item xs={12}>
                                <label>Twitter</label>
                                <TextField fullWidth variant="outlined" value={twitter} onChange={(e) => setTwitter(e.target.value)}
                                    sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}/>
                            </Grid>

                            <Grid item xs={12}>
                                <label>Instagram</label>
                                <TextField fullWidth variant="outlined"value={instagram} onChange={(e) => setInstagram(e.target.value)} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}/>
                            </Grid>

                            <Grid item xs={12}>
                                <label>LinkedIn</label>
                                <TextField fullWidth variant="outlined"value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Button variant="contained" sx={{ background: '#336FB0', '&:hover': { boxShadow: '0 0 10px rgba(0,0,0,0.5)', backgroundColor: '#336FB0' }}} 
                style={{marginLeft: '82.7%', width: '158px' }} onClick={handleCreateProfile} disabled={loading}>
                   {loading ? 'Creating...' : 'Create Profile'}
                </Button>
                </>
            )}
            </Box>
        </Box>

        {/* Success Dialog */}
        <SuccessCreateBusinessProfileDialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}
            companyName={companyName}
            firstName={firstName}
            lastName={lastName}/>
        </>
    );
}

export default CreateBusinessProfile;