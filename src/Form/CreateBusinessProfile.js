import { useState } from 'react';
import countries from '../static/countries';
import industries from '../static/industries';
import genderOptions from '../static/genderOptions';
import quantityOptions from '../static/quantityOptions';
import SuccessCreateBusinessProfileDialog from '../Dialogs/SuccessCreateBusinessProfileDialog';
import { Box, Typography, TextField, Select, MenuItem, Grid, FormControl, CardContent, Button, Autocomplete, FormHelperText, Tooltip } from '@mui/material';
import { Business, MonetizationOn } from '@mui/icons-material'; 
import { StyledCard } from '../styles/CardStyles';
import axios from 'axios';

import { logActivity } from '../utils/activityUtils';
import { generateStartupCode } from '../Components/StartupCode';

function CreateBusinessProfile({ onSuccess, hasInvestorProfile }) {
    const [selectedProfileType, setSelectedProfileType] = useState(null);

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
    const [foundedDay, setFoundedDay] = useState('');
    const [foundedMonth, setFoundedMonth] = useState('');
    const [foundedYear, setFoundedYear] = useState('');
    const [typeOfCompany, setTypeOfCompany] = useState('');
    const [numberOfEmployees, setNumberOfEmployees] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [industry, setIndustry] = useState('');
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const RequiredAsterisk = <span style={{ color: 'red' }}>*</span>;

    const cardTypes = [
        { label: 'Startup Company', icon: <Business />, color: '#336FB0' },
        { label: 'Investor', icon: <MonetizationOn />, color: '#336FB0' },
    ];
    
    // Error State Variables
    const [errors, setErrors] = useState({});
    const days = [...Array(31).keys()].map(i => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => {
        return new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(2000, i, 1));
    });
    const years = [...Array(51).keys()].map(i => new Date().getFullYear() - i);

    const fetchCurrentUser = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/current`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          });
          
          // Only set specific fields for investor profile
          setFirstName(response.data.firstName || '');
          setLastName(response.data.lastName || '');
          setEmailAddress(response.data.email || '');
          setContactInformation(response.data.contactNumber || '');
          setGender(response.data.gender || '');
        } catch (error) {
          console.error('Failed to fetch current user data:', error);
        }
      };

    const handleCardClick = (cardType) => {
        setSelectedProfileType(cardType);
        if (cardType === 'Investor') {
            fetchCurrentUser();
        }
    };

    const validateFields = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const contactInfoRegex = /^[0-9]{10,15}$/;
        const emptyFieldError = 'This field cannot be empty';
        const maxDescriptionLength = 1000;
        
        if (selectedProfileType === 'Startup Company') {
            if (!companyName.trim()) newErrors.companyName = emptyFieldError;
            if (!companyDescription.trim()) newErrors.companyDescription = emptyFieldError;
            else if (companyDescription.length > maxDescriptionLength) 
                newErrors.companyDescription = `Company description cannot exceed ${maxDescriptionLength} characters.`;
            if (!foundedMonth) newErrors.foundedMonth = emptyFieldError;
            if (!foundedDay) newErrors.foundedDay = emptyFieldError;
            if (!foundedYear) newErrors.foundedYear = emptyFieldError;
            if (!typeOfCompany) newErrors.typeOfCompany = emptyFieldError;
            if (!numberOfEmployees) newErrors.numberOfEmployees = emptyFieldError;
            if (!phoneNumber.trim()) newErrors.phoneNumber = emptyFieldError;
            else if (!contactInfoRegex.test(phoneNumber)) newErrors.phoneNumber = 'Enter a valid phone number (10-15 digits).';
            if (!contactEmail.trim()) newErrors.contactEmail = emptyFieldError;
            else if (!emailRegex.test(contactEmail)) newErrors.contactEmail = 'Invalid email address format';
            if (!industry) newErrors.industry = emptyFieldError;
        } else {
            if (!firstName.trim()) newErrors.firstName = emptyFieldError;
            if (!lastName.trim()) newErrors.lastName = emptyFieldError;
            if (!emailAddress.trim()) newErrors.emailAddress = emptyFieldError;
            else if (!emailRegex.test(emailAddress)) newErrors.emailAddress = 'Invalid email address format';
            if (!contactInformation.trim()) newErrors.contactInformation = emptyFieldError;
            else if (!contactInfoRegex.test(contactInformation)) newErrors.contactInformation = 'Enter a valid contact number (10-15 digits).';
            if (!gender) newErrors.gender = emptyFieldError;
            if (!biography.trim()) newErrors.biography = emptyFieldError;
            else if (biography.length > maxDescriptionLength) 
                newErrors.biography = `Biography cannot exceed ${maxDescriptionLength} characters.`;
        }
        
        
        if (!country) newErrors.country = emptyFieldError;
        if (!postalCode.trim()) newErrors.postalCode = emptyFieldError;
      
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };    

    const handleCreateProfile = async () => {
        if (!validateFields()) {
            console.log('Validation failed');
            return;
        }
  
        const profileData = {
            firstName, lastName, emailAddress, contactInformation, gender, biography,
            streetAddress, country, city, state, postalCode, website, facebook, twitter, 
            instagram, linkedIn, companyName, companyDescription, 
            foundedDate: `${foundedMonth} ${foundedDay}, ${foundedYear}`,
            typeOfCompany, numberOfEmployees, phoneNumber, contactEmail, industry,startupCode: generateStartupCode(),
          };
    
          let endpoint;
          let logMessage;
          if (selectedProfileType === 'Startup Company') {
            endpoint = `${process.env.REACT_APP_API_URL}/startups/create`;
            logMessage = `${companyName} profile created successfully.`;
          } else if (selectedProfileType === 'Investor') {
            endpoint = `${process.env.REACT_APP_API_URL}/investors/create`;
            logMessage = `${firstName} ${lastName} profile created successfully.`;
          } else {
            console.error('Invalid profile type:', selectedProfileType);
            return;
          }
    
          try {
            await axios.post(endpoint, profileData, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
            });
    
            setSuccessDialogOpen(true);
    
            await logActivity(logMessage, `${selectedProfileType} profile`);
    
            setTimeout(() => {
              setSuccessDialogOpen(false);
              onSuccess();
            }, 1500);
          } catch (error) {
            console.error('Failed to create profile:', error);
          }
      };

      const handleInputChange = (e, type) => {
        const value = e.target.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const contactInfoRegex = /^[0-9]{0,15}$/;
      
        switch (type) {
          case 'phoneNumber':
          case 'contactInformation':
            if (contactInfoRegex.test(value)) {
              type === 'phoneNumber' ? setPhoneNumber(value) : setContactInformation(value);
              setErrors(prev => ({ ...prev, [type]: '' }));
            } else {
              setErrors(prev => ({ ...prev, [type]: 'Enter numbers only (max 15 digits).' }));
            }
            break;
          case 'emailAddress':
          case 'contactEmail':
            if (emailRegex.test(value) || value === '') {
              type === 'emailAddress' ? setEmailAddress(value) : setContactEmail(value);
              setErrors(prev => ({ ...prev, [type]: '' }));
            } else {
              setErrors(prev => ({ ...prev, [type]: 'Invalid email address format' }));
            }
            break;
          case 'postalCode':
            if (/^[A-Za-z0-9 ]*$/.test(value) || value === '') {
              setPostalCode(value);
              setErrors(prev => ({ ...prev, postalCode: '' }));
            } else {
              setErrors(prev => ({ ...prev, postalCode: 'Please enter a valid postal code.' }));
            }
            break;
          default:
            // Handle other input types if needed
            break;
        }
    };

    return (
        <>
        <Box component="main" sx={{ flexGrow: 1, width: '100%', overflowX: 'hidden', maxWidth: '1000px',  background: '#F2F2F2'}}>
            <Box component="main" sx={{mr: 5, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ color: '#414a4c', fontWeight: '500', pl: 5, pb: 3 }}>
                    Profile Type 
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, pl: 5, pb: 2, textAlign: 'center', flexDirection: { xs: 'column', sm: 'row' }, backgroundColor: '#f5f5f5', borderRadius: 2, }}>
                {cardTypes.map(({ label, icon, color }) => (
                    <Tooltip key={label} arrow
                        title={hasInvestorProfile && label === 'Investor' ? "Only one Investor profile can be created." : ""}
                         disableHoverListener={!hasInvestorProfile || label !== 'Investor'}>
                        
                        <StyledCard key={label} color={color}
                            onClick={() => {
                                if (hasInvestorProfile && label === 'Investor') {
                                    return; 
                                }
                                handleCardClick(label);
                            }}
                            selected={selectedProfileType === label}
                            disabled={hasInvestorProfile && label === 'Investor'} >
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                                    {icon}
                                    <Typography variant="h5" sx={{ fontWeight: 'bold', ml: 1 }}>{label}</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Click to choose
                                </Typography>
                            </CardContent>
                        </StyledCard>
                    </Tooltip>
                ))}
            </Box>

            {selectedProfileType === 'Startup Company' && (
                <>
                    <Typography variant="h6" sx={{ color: '#414a4c', fontWeight: '500', pl: 5, pb: 3}}>
                        Overview
                    </Typography>

                    <Grid container spacing={3} sx={{ ml: 2 }}>
                        <Grid item xs={12} sm={11.4}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <label>Company Name {RequiredAsterisk}</label>
                                    <TextField fullWidth  required variant="outlined" value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                                        error={!!errors.companyName} />
                                        {errors.companyName && (<FormHelperText error>{errors.companyName}</FormHelperText>)}
                                </Grid>

                                <Grid item xs={12}>
                                    <label>Company Description {RequiredAsterisk}</label>
                                    <TextField fullWidth variant="outlined" value={companyDescription} multiline rows={6}
                                        onChange={(e) => setCompanyDescription(e.target.value)}
                                        error={!!errors.companyDescription}/>
                                        {errors.companyDescription && (<FormHelperText error>{errors.companyDescription}</FormHelperText>)}
                                </Grid>

                            <Grid item xs={4}>
                                <label><b>Founded Date {RequiredAsterisk}</b><br/>Month</label>
                                <FormControl fullWidth variant="outlined">
                                    <Select labelId="month-label" value={foundedMonth} 
                                        onChange={(e) => setFoundedMonth(e.target.value)}
                                        sx={{ height: '45px' }}
                                        error={!!errors.foundedMonth}>  
                                        {months.map((month) => (
                                            <MenuItem key={month} value={month}>{month}</MenuItem>
                                        )) 
                                        }
                                    </Select>
                                </FormControl>
                                {errors.foundedMonth && (<FormHelperText error>{errors.foundedMonth}</FormHelperText>)}
                            </Grid>

                            <Grid item xs={4}>
                                <label><br/>Day</label>
                                <FormControl fullWidth variant="outlined">
                                    <Select labelId="day-label" error={!!errors.foundedDay} value={foundedDay}
                                        onChange={(e) => setFoundedDay(e.target.value)}
                                        sx={{ height: '45px' }}>
                                        {days.map((day) => (
                                            <MenuItem key={day} value={day}>{day}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                {errors.foundedDay && (<FormHelperText error>{errors.foundedDay}</FormHelperText>)}
                            </Grid>

                            <Grid item xs={4}>
                            <label><br/>Year</label>
                            <FormControl fullWidth variant="outlined">
                                <Select labelId="year-label" error={!!errors.foundedYear} value={foundedYear}
                                    onChange={(e) => setFoundedYear(e.target.value)}
                                    sx={{ height: '45px' }}>
                                    {years.map((year) => (
                                        <MenuItem key={year} value={year}>{year}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {errors.foundedYear && (<FormHelperText error>{errors.foundedYear}</FormHelperText>)}
                        </Grid>

                        <Grid item xs={4}>
                            <label>Type of Company {RequiredAsterisk}</label>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>  
                                    <Select  fullWidth  variant="outlined" value={typeOfCompany}
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

                        <Grid item xs={4}>
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

                        <Grid item xs={4}>
                            <label>Phone Number {RequiredAsterisk}</label>
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={phoneNumber}
                                onChange={(e) => handleInputChange(e, 'phoneNumber')}
                                error={!!errors.phoneNumber}
                                sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' }}}
                                />
                                {errors.phoneNumber && (<FormHelperText error>{errors.phoneNumber}</FormHelperText>)}
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
                    Location
                </Typography>

                <Grid container spacing={3} sx={{ ml: 2 }}>
                    <Grid item xs={12} sm={11.4}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <label>Country {RequiredAsterisk}</label>
                                <Autocomplete
                                    options={countries}
                                    getOptionLabel={(option) => option.label}
                                    value={countries.find(c => c.label === country) || null}
                                    onChange={(event, newValue) => {
                                        setCountry(newValue ? newValue.label : '');
                                    }}
                                    renderOption={(props, option) => (
                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                            <img
                                                loading="lazy"
                                                width="20"
                                                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                                srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                            />
                                            {option.label} ({option.code}) +{option.phone}
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <>
                                            <TextField
                                                {...params}
                                                fullWidth
                                                variant="outlined"
                                                error={!!errors.country}
                                                inputProps={{
                                                    ...params.inputProps,
                                                    autoComplete: 'new-password', // disable autocomplete and autofill
                                                }}
                                            />
                                            {errors.country && (
                                                <FormHelperText error>{errors.country}</FormHelperText>
                                            )}
                                        </>
                                    )}
                                    sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px'} }}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <label>Postal/Zip Code {RequiredAsterisk}</label>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={postalCode}
                                    onChange={(e) => handleInputChange(e, 'postalCode')}
                                    error={!!errors.postalCode}
                                    sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' }}}
                                    />
                                    {errors.postalCode && (<FormHelperText error>{errors.postalCode}</FormHelperText>)}
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
                style={{marginLeft: '82.7%'}} onClick={handleCreateProfile}>
                    Create Profile
                </Button>
            </>
        )}

            {selectedProfileType === 'Investor' && (
                <>
                    <Typography variant="h6" sx={{ color: '#414a4c', fontWeight: '500', pl: 5, pb: 3 }}>
                        Overview
                    </Typography>
                
                    <Grid container spacing={3} sx={{ ml: 2 }}>
                    <Grid item xs={12} sm={11.4}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <label>First Name {RequiredAsterisk}</label>
                                <TextField fullWidth variant="outlined" value={firstName} onChange={(e) => setFirstName(e.target.value)} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' }}}
                                error={!!errors.firstName}/>
                                {errors.firstName && (<FormHelperText error>{errors.firstName}</FormHelperText>)}
                            </Grid>

                            <Grid item xs={6}>
                                <label>Last Name {RequiredAsterisk}</label>
                                <TextField fullWidth variant="outlined" value={lastName} onChange={(e) => setLastName(e.target.value)} 
                                sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' }}}
                                error={!!errors.lastName}/>
                                {errors.lastName && (<FormHelperText error>{errors.lastName}</FormHelperText>)}
                            </Grid>

                            <Grid item xs={12}>
                                <label>Email Address {RequiredAsterisk}</label>
                                <TextField fullWidth variant="outlined" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} 
                                sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' }}}
                                error={!!errors.emailAddress}/>
                                {errors.emailAddress && (<FormHelperText error>{errors.emailAddress}</FormHelperText>)}
                            </Grid>

                            <Grid item xs={6}>
                                <label>Contact Information {RequiredAsterisk}</label>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={contactInformation}
                                    onChange={(e) => handleInputChange(e, 'contactInformation')}
                                    error={!!errors.contactInformation}
                                    sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' }}}
                                    />
                                {errors.contactInformation && (<FormHelperText error>{errors.contactInformation}</FormHelperText>)}
                            </Grid>

                            <Grid item xs={6}>
                                <label>Gender {RequiredAsterisk}</label>
                                    <Select fullWidth variant="outlined" value={gender} onChange={(e) => setGender(e.target.value)}
                                        sx={{ height: '45px',}} error={!!errors.gender}>
                                        {genderOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.gender && (<FormHelperText error>{errors.gender}</FormHelperText>)}
                            </Grid>

                            <Grid item xs={12}>
                                <label>Biography {RequiredAsterisk}</label>
                                <TextField fullWidth variant="outlined" multiline rows={6} value={biography} onChange={(e) => setBiography(e.target.value)}
                                error={!!errors.biography} />
                                {errors.biography && (<FormHelperText error>{errors.biography}</FormHelperText>)}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Typography variant="h6" sx={{ color: '#414a4c', fontWeight: '500', pl: 5, pt: 3, pb: 3 }}>
                    Location
                </Typography>

                <Grid container spacing={3} sx={{ ml: 2 }}>
                    <Grid item xs={12} sm={11.4}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <label>Country {RequiredAsterisk}</label>
                                <Autocomplete
                                    options={countries}
                                    getOptionLabel={(option) => option.label}
                                    value={countries.find(c => c.label === country) || null}
                                    onChange={(event, newValue) => {
                                        setCountry(newValue ? newValue.label : '');
                                    }}
                                    renderOption={(props, option) => (
                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                            <img
                                                loading="lazy"
                                                width="20"
                                                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                                srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`} 
                                            />
                                            {option.label} ({option.code}) +{option.phone}
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            variant="outlined"
                                            error={!!errors.country}
                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                            }}
                                        />
                                    )}
                                    sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px'}, }}
                                />
                                {errors.country && (<FormHelperText error>{errors.country}</FormHelperText>)}
                            </Grid>

     
                            <Grid item xs={6}>
                                <label>Postal/Zip Code {RequiredAsterisk}</label>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={postalCode}
                                    onChange={(e) => handleInputChange(e, 'postalCode')}
                                    error={!!errors.postalCode}
                                    sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' }}}
                                    />
                                    {errors.postalCode && (<FormHelperText error>{errors.postalCode}</FormHelperText>)}
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
                                <TextField fullWidth variant="outlined" value={website} onChange={(e) => setWebsite(e.target.value)} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' }}}/>
                            </Grid>

                            <Grid item xs={12}>
                                <label>Facebook</label>
                                <TextField fullWidth variant="outlined" value={facebook} onChange={(e) => setFacebook(e.target.value)} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' }}}/>
                            </Grid>

                            <Grid item xs={12}>
                                <label>Twitter</label>
                                <TextField fullWidth variant="outlined" value={twitter} onChange={(e) => setTwitter(e.target.value)} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}/>
                            </Grid>

                            <Grid item xs={12}>
                                <label>Instagram</label>
                                <TextField fullWidth variant="outlined" value={instagram} onChange={(e) => setInstagram(e.target.value)} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' }}}/>
                            </Grid>

                            <Grid item xs={12}>
                                <label>LinkedIn</label>
                                <TextField fullWidth variant="outlined" value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                
                <Button variant="contained" sx={{ background: '#336FB0', '&:hover': { boxShadow: '0 0 10px rgba(0,0,0,0.5)', backgroundColor: '#336FB0)' }}} 
                style={{marginLeft: '82.7%'}} 
                    onClick={handleCreateProfile} onClose={handleCreateProfile}>
                    Create Profile
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