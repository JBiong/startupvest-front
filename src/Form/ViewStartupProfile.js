import { useState, useRef, useEffect } from 'react';
import industries from '../static/industries';
import quantityOptions from '../static/quantityOptions';
import { Box, Typography, TextField, Avatar, Select, MenuItem, Grid, FormControl, FormHelperText, Button, Autocomplete, Menu, IconButton, InputAdornment} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import { parsePhoneNumber } from 'libphonenumber-js';
import countries from '../static/countries';

import axios from 'axios';

function ViewStartupProfile({ profile }) {
    const [avatar, setAvatar] = useState('');
    const fileInputRef = useRef(null);
    const [isEditable, setIsEditable] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const RequiredAsterisk = <span style={{ color: 'red' }}>*</span>;
    
    const [foundedDate, setFoundedDate] = useState(profile?.foundedDate ? dayjs(profile.foundedDate) : null);
    const [typeOfCompany, setTypeOfCompany] = useState(profile ? profile.typeOfCompany : '');
    const [numberOfEmployees, setNumberOfEmployees] = useState(profile ? profile.numberOfEmployees : '');
    const [phoneNumber, setPhoneNumber] = useState(profile ? profile.phoneNumber : '');
    const [contactEmail, setContactEmail] = useState(profile ? profile.contactEmail : '');
    const [industry, setIndustry] = useState(profile && profile.industry ? profile.industry : '');
    const [companyName, setCompanyName] = useState(profile ? profile.companyName : '');
    const [companyDescription, setCompanyDescription] = useState(profile ? profile.companyDescription : '');
    const [streetAddress, setStreetAddress] = useState(profile ? profile.locationName : '');
    const [startupCode, setStartupCode] = useState(profile ? profile.startupCode : '');
    const [country, setCountry] = useState(profile ? profile.country : '');
    const [city, setCity] = useState(profile ? profile.city : '');
    const [state, setState] = useState(profile ? profile.state : '');
    const [postalCode, setPostalCode] = useState(profile ? profile.postalCode : '');
    const [website, setWebsite] = useState(profile ? profile.website : '');
    const [facebook, setFacebook] = useState(profile ? profile.facebook : '');
    const [twitter, setTwitter] = useState(profile ? profile.twitter : '');
    const [instagram, setInstagram] = useState(profile ? profile.instagram : '');
    const [linkedIn, setLinkedIn] = useState(profile ? profile.linkedIn : '');
    
    const [selectedCountryCode, setSelectedCountryCode] = useState(countries[0]);
    const [phoneNumberErrorVisible, setPhoneNumberErrorVisible] = useState(false);
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

    const contactEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Phone number validation function
    const validatePhoneNumber = (number, countryCode) => {
      try {
          const phoneNumberInstance = parsePhoneNumber(number, countryCode);

          // Check if the phone number is valid for the selected country
          if (!phoneNumberInstance.isValid()) {
              return 'Invalid phone number.';
          }

          return ''; // No error if valid
      } catch (error) {
          return 'Invalid phone number format.';
      }
  };
  
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

    const handleDateChange = (newDate) => {
      setFoundedDate(newDate);
      
      if (!newDate) {
        setErrors({ foundedDate: 'Please select a valid date' });
      } else {
        setErrors({ foundedDate: '' });
      }
    };    

    const validateFields = () => {
        const newErrors = {};
        const emptyFieldError = 'This field cannot be empty';
        const maxDescriptionLength = 1000;

        if (!companyName.trim()) newErrors.companyName = emptyFieldError;
        if (!companyDescription || companyDescription.trim().length === 0) {
          newErrors.companyDescription = emptyFieldError;
        } else if (companyDescription.length > maxDescriptionLength) {
            newErrors.companyDescription = `Company Description cannot exceed ${maxDescriptionLength} characters.`;
        }
        if (!foundedDate || !foundedDate.isValid()) {newErrors.foundedDate = emptyFieldError;
        }       
        if (!typeOfCompany.trim()) newErrors.typeOfCompany = emptyFieldError;
        if (!numberOfEmployees.trim()) newErrors.numberOfEmployees = emptyFieldError;
        
        if (!phoneNumber.trim()) 
          newErrors.phoneNumber = emptyFieldError;
        else {
            const phoneNumberError = validatePhoneNumber(phoneNumber, country);
            if (phoneNumberError) newErrors.phoneNumber = phoneNumberError;
        }

        if (!contactEmail.trim()) {
                newErrors.contactEmail = emptyFieldError;
        } else if (!contactEmailRegex.test(contactEmail)) {
                newErrors.contactEmail = 'Contact Email is invalid';
        }

        if (!industry || industry.trim() === '') {
            newErrors.industry = emptyFieldError;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };

      const formattedDateString = foundedDate ? dayjs(foundedDate).format('MMMM D, YYYY') : '';
            
    const handleUpdateProfile = async () => {
        if (isEditable) {
            if (!validateFields()) {
                return;
            }

            setIsLoading(true);
            const formattedContactNumber = formatContactNumberForCountry(phoneNumber);

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
                    startupCode: startupCode,
                    companyName: companyName,
                    companyDescription: companyDescription,
                    foundedDate: formattedDateString,
                    typeOfCompany: typeOfCompany,
                    numberOfEmployees: numberOfEmployees,
                    phoneNumber: formattedContactNumber,
                    contactEmail: contactEmail,
                    industry: industry,    
                
                };
    
                const endpoint = `${process.env.REACT_APP_API_URL}/startups/${profile.id}`;
                
                await axios.put(endpoint, profileData, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
    
                await handleUploadProfilePicture();
    
                setIsEditable(false);
    
            } catch (error) {
                console.error('Failed to update profile:', error);
                setIsLoading(false);
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
      
            const pictureEndpoint = `${process.env.REACT_APP_API_URL}/profile-picture/startup/${profile.id}/update`;
      
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
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile-picture/startup/${profile.id}`, {
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

      useEffect(() => {
        if (phoneNumber) {
            const matchingCountry = countries.find((country) => phoneNumber.startsWith(country.dialCode));
            if (matchingCountry) {
                setSelectedCountryCode(matchingCountry);
            }
        }
    }, [phoneNumber]);

    const validateContactNumber = (phoneNumber) => {
        try {
            const phoneNumberInstance = parsePhoneNumber(phoneNumber, selectedCountryCode.code);
            if (!phoneNumberInstance.isValid()) {
                setPhoneNumberError(`Invalid phone number for ${selectedCountryCode.label}.`);
                return false;
            }
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
          return phoneNumberInstance.formatInternational();
      } catch (error) {
          console.error('Phone number formatting error:', error);
          return number;
      }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountryCode(country);
    setPhoneNumber(''); 
    setAnchorEl(null);
  };

    return (
      <>
        <Box component="main" sx={{ flexGrow: 1, width: "100%", overflowX: "hidden", maxWidth: "1000px", background: "#F2F2F2", }}>
          <Typography variant="h6" sx={{ color: "#414a4c", fontWeight: "500", pl: 5, pb: 3 }}>Upload Profile</Typography>

          <Grid item xs={12} sm={3}>
            <label htmlFor="avatar-upload" onClick={handleAvatarClick}>
              <Avatar sx={{ width: 200, height: 200, mb: 2, ml: 49.5, cursor: "pointer", border: "5px #336FB0 solid", }}
                src={avatar}
                onClick={handleAvatarClick} />
            </label>

            <input type="file" accept="image/*" id="avatar-upload"
              onChange={handleAvatarChange} disabled={!isEditable} ref={fileInputRef}
              style={{ display: "none" }} />
          </Grid>

          <Box component="main" sx={{ mr: 5, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: "#414a4c", fontWeight: "500", pl: 5, pt: 3, pb: 3 }}>Overview</Typography>

            <Grid container spacing={3} sx={{ ml: 2 }}>
              <Grid item xs={12} sm={11.4}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <label>Startup Code</label>
                    <TextField
                      fullWidth
                      required
                      variant="outlined"
                      disabled
                      value={startupCode}
                      sx={{
                        height: "45px",
                        "& .MuiInputBase-root": { height: "45px" },
                      }}/>
                  </Grid>
                  <Grid item xs={8}>
                    <label>Company Name {RequiredAsterisk}</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      disabled={!isEditable}
                      sx={{
                        height: "45px",
                        "& .MuiInputBase-root": { height: "45px" },
                      }}
                      error={!!errors.companyName} />
                    {errors.companyName && (
                      <FormHelperText error>
                        {errors.companyName}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <label>Company Description {RequiredAsterisk}</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                      disabled={!isEditable}
                      multiline
                      rows={8}
                      error={!!errors.companyDescription}/>
                    {errors.companyDescription && (
                      <FormHelperText error>
                        {errors.companyDescription}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={6}>
                    <label>Founded Date {RequiredAsterisk} <br /></label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker value={foundedDate} onChange={handleDateChange} disabled={!isEditable}
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
                            sx={{ width: '100%', height: '45px', '& .MuiInputBase-root': { height: '45px', padding: '0px 14px', } }} />
                      </LocalizationProvider>
                      {errors.foundedDate && (<FormHelperText error>{errors.foundedDate}</FormHelperText>)}
                  </Grid>

                  <Grid item xs={6}>
                    <label>Type of Company {RequiredAsterisk}</label>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Select
                          fullWidth
                          variant="outlined"
                          value={typeOfCompany}
                          onChange={(e) => setTypeOfCompany(e.target.value)}
                          disabled={!isEditable}
                          sx={{ height: "45px" }}
                          error={!!errors.typeOfCompany}>
                          <MenuItem value={"profit"}>Profit</MenuItem>
                          <MenuItem value={"non-profit"}>Non-Profit</MenuItem>
                        </Select>
                        {errors.typeOfCompany && (
                          <FormHelperText error>
                            {errors.typeOfCompany}
                          </FormHelperText>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={6}>
                    <label>No. of Employees {RequiredAsterisk}</label>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Select
                          fullWidth
                          variant="outlined"
                          value={numberOfEmployees}
                          onChange={(e) => setNumberOfEmployees(e.target.value)}
                          disabled={!isEditable}
                          sx={{ height: "45px" }}
                          error={!!errors.numberOfEmployees}>
                          {quantityOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.numberOfEmployees && (
                          <FormHelperText error>
                            {errors.numberOfEmployees}
                          </FormHelperText>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={6}>
                    <label>Phone Number <span style={{ color: 'red' }}>*</span></label>
                    <TextField fullWidth name="phoneNumber" placeholder="Enter phone number" type="tel" disabled={!isEditable}
                        value={phoneNumber.replace(selectedCountryCode.dialCode, '')}
                        sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconButton
                                        onClick={(e) => setAnchorEl(e.currentTarget)}
                                        sx={{ width: 30, height: 30, padding: 2, borderRadius: 1, fontSize: '12px', display: 'flex', 
                                          alignItems: 'center', justifyContent: 'center', }}>
                                        {selectedCountryCode.label} {selectedCountryCode.dialCode}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        onChange={(e) => {
                            const numberInput = e.target.value;
                            const cleanedInput = numberInput.replace(/\D/g, '');
                            const fullPhoneNumber = `${selectedCountryCode.dialCode}${cleanedInput}`;
                            
                            setPhoneNumber(fullPhoneNumber);
                            validateContactNumber(cleanedInput);
                        }}
                        error={!!phoneNumberError}
                        onFocus={() => setPhoneNumberErrorVisible(true)}
                        onBlur={() => setPhoneNumberErrorVisible(false)} />

                    {phoneNumberError && (
                        <FormHelperText error>{phoneNumberError}</FormHelperText>
                    )}

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
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      error={!!errors.contactEmail}
                      disabled={!isEditable}
                      sx={{
                        height: "45px",
                        "& .MuiInputBase-root": { height: "45px" },
                      }}/>
                    {errors.contactEmail && (
                      <FormHelperText error>
                        {errors.contactEmail}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container alignItems="center" spacing={3} sx={{ ml: 2, display: 'flex', pt: 5, pb: 3 }}>
            < Grid item>
                <Typography variant="h6" sx={{ color: "#414a4c", fontWeight: "500", }}>Location</Typography>
              </Grid>
              
              <Grid item>
                <Button disabled={!isEditable} variant="contained"
                  sx={{ width: 120, background: "#336FB0", textTransform: 'none',
                    "&:hover": {
                      boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                      backgroundColor: "#336FB0",
                      textTransform: 'none'
                    },
                  }}
                  onClick={() =>
                    (window.location.href = `https://startupsphere.mugnavo.com/startup/${profile.id}`)
                  }>
                  Set Location
                </Button>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ ml: 2 }}>
              <Grid item xs={12} sm={11.4}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <label>Full Address {RequiredAsterisk}</label>
                    <TextField fullWidth variant="outlined" value={streetAddress} disabled
                      onChange={(e) => setStreetAddress(e.target.value)}
                      sx={{
                        height: "45px",
                        "& .MuiInputBase-root": { height: "45px" },
                      }}
                      error={!!errors.streetAddress}/>
                    {errors.streetAddress && (
                      <FormHelperText error>
                        {errors.streetAddress}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ color: "#414a4c", fontWeight: "500", pl: 5, pt: 3, pb: 3 }}>
              Industry
            </Typography>
            <Grid container spacing={3} sx={{ ml: 2 }}>
              <Grid item xs={12} sm={11.4}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                      <Autocomplete
                        freeSolo
                        options={industries}
                        value={industry || ""}
                        onChange={(event, newValue) => {
                          if (isEditable) {
                            setIndustry(newValue || "");
                          }
                        }}
                        onInputChange={(event, newInputValue) => {
                          if (isEditable) {
                            setIndustry(newInputValue || "");
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            disabled={!isEditable}
                            error={!!errors.industry}
                            sx={{
                              height: "45px",
                              "& .MuiInputBase-root": { height: "45px" },
                            }}
                          />
                        )}
                        readOnly={!isEditable} />
                    </FormControl>
                    {errors.industry && (
                      <FormHelperText error>{errors.industry}</FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Typography variant="h6" sx={{ color: "#414a4c", fontWeight: "500", pl: 5, pt: 3, pb: 3 }}>
              Links
            </Typography>

            <Grid container spacing={3} sx={{ ml: 2, mb: 2 }}>
              <Grid item xs={12} sm={11.4}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <label>Website</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      disabled={!isEditable}
                      sx={{
                        height: "45px",
                        "& .MuiInputBase-root": { height: "45px" },
                      }}/>
                  </Grid>

                  <Grid item xs={12}>
                    <label>Facebook</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      disabled={!isEditable}
                      sx={{
                        height: "45px",
                        "& .MuiInputBase-root": { height: "45px" },
                      }}/>
                  </Grid>

                  <Grid item xs={12}>
                    <label>Twitter</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      disabled={!isEditable}
                      sx={{
                        height: "45px",
                        "& .MuiInputBase-root": { height: "45px" },
                      }}/>
                  </Grid>

                  <Grid item xs={12}>
                    <label>Instagram</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      disabled={!isEditable}
                      sx={{
                        height: "45px",
                        "& .MuiInputBase-root": { height: "45px" },
                      }}/>
                  </Grid>

                  <Grid item xs={12}>
                    <label>LinkedIn</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={linkedIn}
                      onChange={(e) => setLinkedIn(e.target.value)}
                      disabled={!isEditable}
                      sx={{
                        height: "45px",
                        "& .MuiInputBase-root": { height: "45px" },
                      }}/>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Button variant="contained" 
              sx={{
                width: 150,
                background: "#336FB0",
                "&:hover": {
                  boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                  backgroundColor: "#336FB0",
                },
              }}
              style={{ marginLeft: "83.5%" }}
              onClick={handleUpdateProfile}>
              {isEditable ? "Save Changes" : "Edit Profile"}
            </Button>
          </Box>
        </Box>
      </>
    );
}

export default ViewStartupProfile;