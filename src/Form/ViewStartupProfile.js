import { useState, useRef, useEffect } from 'react';
import countries from '../static/countries';
import industries from '../static/industries';
import quantityOptions from '../static/quantityOptions';
import { Box, Typography, TextField, Avatar, Select, MenuItem, Grid, FormControl, FormHelperText, Button, Autocomplete} from '@mui/material';
import axios from 'axios';

function ViewStartupProfile({ profile }) {
    const [avatar, setAvatar] = useState('');
    const fileInputRef = useRef(null);
    const [isEditable, setIsEditable] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const RequiredAsterisk = <span style={{ color: 'red' }}>*</span>;

    let month = '', day = '', year = '';
    if (profile && profile.foundedDate) {
        [month, day, year] = profile.foundedDate.split(/[\s,]+/);
    }
    
    const [foundedMonth, setFoundedMonth] = useState(month);
    const [foundedDay, setFoundedDay] = useState(day);
    const [foundedYear, setFoundedYear] = useState(year);
    const [typeOfCompany, setTypeOfCompany] = useState(profile ? profile.typeOfCompany : '');
    const [numberOfEmployees, setNumberOfEmployees] = useState(profile ? profile.numberOfEmployees : '');
    const [phoneNumber, setPhoneNumber] = useState(profile ? profile.phoneNumber : '');
    const [contactEmail, setContactEmail] = useState(profile ? profile.contactEmail : '');
    const [industry, setIndustry] = useState(profile ? profile.industry : '');
    const [companyName, setCompanyName] = useState(profile ? profile.companyName : '');
    const [companyDescription, setCompanyDescription] = useState(profile ? profile.companyDescription : '');
    const [streetAddress, setStreetAddress] = useState(profile ? profile.streetAddress : '');
    const [country, setCountry] = useState(profile ? profile.country : '');
    const [city, setCity] = useState(profile ? profile.city : '');
    const [state, setState] = useState(profile ? profile.state : '');
    const [postalCode, setPostalCode] = useState(profile ? profile.postalCode : '');
    const [website, setWebsite] = useState(profile ? profile.website : '');
    const [facebook, setFacebook] = useState(profile ? profile.facebook : '');
    const [twitter, setTwitter] = useState(profile ? profile.twitter : '');
    const [instagram, setInstagram] = useState(profile ? profile.instagram : '');
    const [linkedIn, setLinkedIn] = useState(profile ? profile.linkedIn : '');

    const days = [...Array(31).keys()].map(i => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => {
        return new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(2000, i, 1));
    });
    const years = [...Array(51).keys()].map(i => new Date().getFullYear() - i);

    const contactEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneNumberRegex = /^[0-9]{10,15}$/;

    const handleAvatarClick = (event) => {
        event.preventDefault(); 
        event.stopPropagation();
        fileInputRef.current.click();
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);

            handleUploadProfilePicture(file);
        }
    };

    const validateFields = () => {
        const newErrors = {};
        if (!companyName.trim()) newErrors.companyName = 'Company Name is required';
        if (!companyDescription.trim()) newErrors.companyDescription = 'Company Description is required';
        if (!foundedMonth.trim()) newErrors.foundedMonth = 'Founded Month is required';
        if (!foundedDay.trim()) newErrors.foundedDay = 'Founded Day is required';
        if (!foundedYear.trim()) newErrors.foundedYear = 'Founded Year is required';
        if (!typeOfCompany.trim()) newErrors.typeOfCompany = 'Type of Company is required';
        if (!numberOfEmployees.trim()) newErrors.numberOfEmployees = 'Number of Employees is required';
        
        if (!phoneNumber.trim()) 
            newErrors.phoneNumber = 'Phone Number is required';
        else if (!phoneNumberRegex.test(phoneNumber)) 
            newErrors.phoneNumber = 'Enter a valid phone number (10-15 digits).';
        
        if (!contactEmail.trim()) {
                newErrors.contactEmail = 'Contact Email is required';
        } else if (!contactEmailRegex.test(contactEmail)) {
                newErrors.contactEmail = 'Contact Email is invalid';
        }

        if (!streetAddress.trim()) newErrors.streetAddress = 'Street Address is required';
        if (!country) newErrors.country = 'Country is required';
        if (!city.trim()) newErrors.city = 'City is required';
        if (!state.trim()) newErrors.state = 'Province/State is required';
        if (!postalCode.trim()) newErrors.postalCode = 'Postal/Zip Code is required';
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };

    const handleUpdateProfile = async () => {
        if (isEditable) {
            if (!validateFields()) {
                return;
            }

            setIsLoading(true);
    
            try {
                const profileData = {
                    streetAddress: streetAddress,
                    country: country,
                    city: city,
                    state: state,
                    postalCode: postalCode,
                    website: website,
                    facebook: facebook,
                    twitter: twitter,
                    instagram: instagram,
                    linkedIn: linkedIn,
                    companyName: companyName,
                    companyDescription: companyDescription,
                    foundedDate: `${foundedMonth} ${foundedDay}, ${foundedYear}`,
                    typeOfCompany: typeOfCompany,
                    numberOfEmployees: numberOfEmployees,
                    phoneNumber: phoneNumber,
                    contactEmail: contactEmail,
                    industry: industry,
                };
    
                const endpoint = `http://localhost:3000/startups/${profile.id}`;
                
                await axios.put(endpoint, profileData, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
    
                await handleUploadProfilePicture();
    
                setIsEditable(false);
    
                // Add a small delay before refreshing to ensure the server has processed the update
                setTimeout(() => {
                    window.location.reload();
                }, 500);
    
            } catch (error) {
                console.error('Failed to update profile:', error);
                setIsLoading(false);
                // Optionally, show an error message to the user
            }
        } else {
            setIsEditable(true);
        }
    };

    const handleUploadProfilePicture = async () => {
        if (fileInputRef.current.files[0]) {
          try {
            const pictureFormData = new FormData();
            pictureFormData.append('file', fileInputRef.current.files[0]);
      
            const pictureEndpoint = `http://localhost:3000/profile-picture/startup/${profile.id}/update`;
      
            await axios.put(pictureEndpoint, pictureFormData, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'multipart/form-data',
              },
            });
      
            // Fetch the updated profile picture and set it in the state
            await fetchProfilePicture();
          } catch (error) {
            console.error('Failed to upload profile picture:', error);
          }
        }
      };
      

      const fetchProfilePicture = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/profile-picture/startup/${profile.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            responseType: 'blob', 
          });
      
          const imageUrl = URL.createObjectURL(response.data);
          setAvatar(imageUrl);
        } catch (error) {
          console.error('Failed to fetch profile picture:', error);
        }
      };

      useEffect(() => {
        if (profile.id) {
          fetchProfilePicture();
        }
      }, [profile.id]);

    return (
        <>
        <Box component="main" sx={{ flexGrow: 1, width: '100%', overflowX: 'hidden', maxWidth: '1000px',  background: '#F2F2F2'}}>

            <Typography variant="h6" sx={{ color: '#414a4c', fontWeight: '500', pl: 5, pb: 3 }}>
                Upload Profile
            </Typography>

            <Grid item xs={12} sm={3}>
                <label htmlFor="avatar-upload" onClick={handleAvatarClick}>
                <Avatar sx={{ width: 200, height: 200, mb: 2, ml: 49.5, cursor: 'pointer', border: '5px rgba(0, 116, 144, 1) solid' }}
                        src={avatar} onClick={handleAvatarClick} />
                </label>
            
                <input type="file" accept="image/*" id="avatar-upload" onChange={handleAvatarChange}
                disabled={!isEditable}  ref={fileInputRef} style={{ display: 'none'}}/>                      
            </Grid>

            <Box component="main" sx={{mr: 5, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: '#414a4c', fontWeight: '500', pl: 5, pt: 3, pb: 3 }}>
                Overview
            </Typography>

            <Grid container spacing={3} sx={{ ml: 2 }}>
                <Grid item xs={12} sm={11.4}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <label>Company Name {RequiredAsterisk}</label>
                            <TextField fullWidth variant="outlined" value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)} disabled={!isEditable}
                                sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                                error={!!errors.companyName}/>
                                {errors.companyName && (
                                <FormHelperText error>{errors.companyName}</FormHelperText>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <label>Company Description {RequiredAsterisk}</label>
                            <TextField fullWidth variant="outlined" value={companyDescription}
                                onChange={(e) => setCompanyDescription(e.target.value)} disabled={!isEditable} 
                                multiline rows={5}
                                error={!!errors.companyDescription}/>
                                {errors.companyDescription && (
                                <FormHelperText error>{errors.companyDescription}</FormHelperText>
                            )}
                        </Grid>

                    <Grid item xs={4}>
                        <label><b>Founded Date {RequiredAsterisk}</b><br/>Month</label>
                        <FormControl fullWidth variant="outlined">
                            <Select labelId="month-label" value={foundedMonth}
                                onChange={(e) => setFoundedMonth(e.target.value)} disabled={!isEditable} sx={{ height: '45px'}}
                                error={!!errors.foundedMonth}>  
                                {months.map((month) => (
                                    <MenuItem key={month} value={month}>{month}</MenuItem>
                                ))}
                            </Select>
                            {errors.foundedMonth && (
                                <FormHelperText error>{errors.foundedMonth}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                        <label><br/>Day</label>
                        <FormControl fullWidth variant="outlined">
                            <Select labelId="day-label" value={foundedDay}
                                onChange={(e) => setFoundedDay(e.target.value)} disabled={!isEditable} sx={{ height: '45px'}}
                                error={!!errors.foundedDay}>
                                {days.map((day) => (
                                    <MenuItem key={day} value={day}>{day}</MenuItem>
                                ))}
                            </Select>
                            {errors.foundedDay && (
                                <FormHelperText error>{errors.foundedDay}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                    <label><br/>Year</label>
                    <FormControl fullWidth variant="outlined">
                        <Select labelId="year-label" value={foundedYear}
                            onChange={(e) => setFoundedYear(e.target.value)} disabled={!isEditable} sx={{ height: '45px'}}
                            error={!!errors.foundedYear}>
                            {years.map((year) => (
                                <MenuItem key={year} value={year}>{year}</MenuItem>
                            ))}
                        </Select>
                        {errors.foundedYear && (
                            <FormHelperText error>{errors.foundedYear}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>

                <Grid item xs={4}>
                    <label>Type of Company {RequiredAsterisk}</label>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>  
                            <Select fullWidth variant="outlined" value={typeOfCompany}
                                onChange={(e) => setTypeOfCompany(e.target.value)} disabled={!isEditable} sx={{ height: '45px'}}
                                error={!!errors.typeOfCompany}>
                                <MenuItem value={'profit'}>Profit</MenuItem>
                                <MenuItem value={'non-profit'}>Non-Profit</MenuItem>
                            </Select>
                            {errors.typeOfCompany && (
                                <FormHelperText error>{errors.typeOfCompany}</FormHelperText>
                            )}
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={4}>
                    <label>No. of Employees {RequiredAsterisk}</label>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>  
                            <Select  fullWidth  variant="outlined" value={numberOfEmployees}
                                onChange={(e) => setNumberOfEmployees(e.target.value)} disabled={!isEditable} sx={{ height: '45px'}}
                                error={!!errors.numberOfEmployees}>
                                {quantityOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.numberOfEmployees && (
                                <FormHelperText error>{errors.numberOfEmployees}</FormHelperText>
                            )}
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={4}>
                    <label>Phone Number {RequiredAsterisk}</label>
                    <TextField 
                        fullWidth 
                        variant="outlined" 
                        value={phoneNumber} 
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value) && value.length <= 15) { 
                                setPhoneNumber(value); 
                                validateFields(); 
                            }
                        }} 
                        disabled={!isEditable} 
                        sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                        error={!!errors.phoneNumber}
                    />
                    {errors.phoneNumber && (
                        <FormHelperText error>{errors.phoneNumber}</FormHelperText>
                    )}
                </Grid>

                <Grid item xs={12}>
                    <label>Contact Email {RequiredAsterisk}</label>
                    <TextField
                        fullWidth
                        variant="outlined"
                        type='email'
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)} // Update value without validation on change
                        error={!!errors.contactEmail}
                        disabled={!isEditable}
                        sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                    />
                    {errors.contactEmail && (
                        <FormHelperText error>{errors.contactEmail}</FormHelperText>
                    )}
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
                    <Grid item xs={8}>
                        <label>Street Address {RequiredAsterisk}</label>
                        <TextField fullWidth variant="outlined" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} disabled={!isEditable} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                            error={!!errors.streetAddress}
                            />
                            {errors.streetAddress && (
                            <FormHelperText error>{errors.streetAddress}</FormHelperText>
                            )}
                    </Grid>

                    <Grid item xs={4}>
                        <label>Country {RequiredAsterisk}</label>
                        <Autocomplete options={countries}
                            getOptionLabel={(option) => option.label}
                            value={countries.find(c => c.label === country) || null}
                            onChange={(event, newValue) => {
                                setCountry(newValue ? newValue.label : '');
                            }}
                            renderOption={(props, option) => (
                                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                    <img loading="lazy" width="20"
                                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                        alt="" />
                                    {option.label} ({option.code}) +{option.phone}
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth variant="outlined"
                                    inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password',
                                    }}
                                    disabled={!isEditable}
                                    error={!!errors.country}
                                />
                            )}
                            clearIcon={isEditable ? undefined : null}
                            disabled={!isEditable}
                            sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px'} }}
                        />
                        {errors.country && (
                        <FormHelperText error>{errors.country}</FormHelperText>
                        )}
                    </Grid>

                    <Grid item xs={4}>
                        <label>City {RequiredAsterisk}</label>
                        <TextField fullWidth variant="outlined" value={city} onChange={(e) => setCity(e.target.value)} disabled={!isEditable} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                            error={!!errors.city}
                            />
                            {errors.city && (
                            <FormHelperText error>{errors.city}</FormHelperText>
                            )}
                    </Grid>

                    <Grid item xs={4}>
                        <label>Province/State {RequiredAsterisk}</label>
                        <TextField fullWidth variant="outlined" value={state} onChange={(e) => setState(e.target.value)} disabled={!isEditable} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                            error={!!errors.state}
                            />
                            {errors.state && (
                            <FormHelperText error>{errors.state}</FormHelperText>
                            )}
                    </Grid>

                    <Grid item xs={4}>
                        <label>Postal/Zip Code {RequiredAsterisk}</label>
                        <TextField fullWidth variant="outlined" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} disabled={!isEditable} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                        error={!!errors.postalCode}
                        />
                        {errors.postalCode && (
                        <FormHelperText error>{errors.postalCode}</FormHelperText>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>

        <Typography variant="h6" sx={{ color: '#414a4c', fontWeight: '500', pl: 5, pt: 3, pb: 3 }}>
            Industry
        </Typography>

        <Grid container spacing={3} sx={{ ml: 2 }}>
        <Grid item xs={12} sm={11.4}>
            <Grid container spacing={2}>
            <Grid item xs={12}>  
                <Select fullWidth variant="outlined" value={industry} onChange={(e) => setIndustry(e.target.value)} disabled={!isEditable} sx={{ height: '45px' }}>
                {industries.map(industry => (
                    <MenuItem key={industry} value={industry}>{industry}</MenuItem>
                ))}
                </Select>
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
                        <TextField fullWidth variant="outlined" value={website} onChange={(e) => setWebsite(e.target.value)} disabled={!isEditable} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}/>
                    </Grid>

                    <Grid item xs={12}>
                        <label>Facebook</label>
                        <TextField fullWidth variant="outlined" value={facebook} onChange={(e) => setFacebook(e.target.value)} disabled={!isEditable} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }} />
                    </Grid>

                    <Grid item xs={12}>
                        <label>Twitter</label>
                        <TextField fullWidth variant="outlined" value={twitter} onChange={(e) => setTwitter(e.target.value)} disabled={!isEditable} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }} />
                    </Grid>

                    <Grid item xs={12}>
                        <label>Instagram</label>
                        <TextField fullWidth variant="outlined" value={instagram} onChange={(e) => setInstagram(e.target.value)} disabled={!isEditable} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }} />
                    </Grid>

                    <Grid item xs={12}>
                        <label>LinkedIn</label>
                        <TextField fullWidth variant="outlined" value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)} disabled={!isEditable} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        
        <Button variant="contained" sx={{ width: 150, background: 'rgba(0, 116, 144, 1)', '&:hover': { boxShadow: '0 0 10px rgba(0,0,0,0.5)', backgroundColor: 'rgba(0, 116, 144, 1)' } }} style={{ marginLeft: '83.5%' }} 
        onClick={handleUpdateProfile}>
            {isEditable ? 'Save Changes' : 'Edit Profile'}
        </Button>
        
        </Box>
        </Box>
        </>
    );
}

export default ViewStartupProfile;