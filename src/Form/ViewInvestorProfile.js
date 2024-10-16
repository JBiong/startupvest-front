import { useState, useRef, useEffect } from 'react';
import countries from '../static/countries';
import { Box, Typography, TextField, Avatar, Select, MenuItem, Grid, Button, Autocomplete, FormHelperText } from '@mui/material';
import genderOptions from '../static/genderOptions';
import axios from 'axios';

function ViewInvestorProfile({ profile }) {
  const [avatar, setAvatar] = useState('');
  const fileInputRef = useRef(null);

  const [isEditable, setIsEditable] = useState(false);
  const [errors, setErrors] = useState({});
  const RequiredAsterisk = <span style={{ color: 'red' }}>*</span>;

  const [firstName, setFirstName] = useState(profile ? profile.firstName : '');
  const [lastName, setLastName] = useState(profile ? profile.lastName : '');
  const [emailAddress, setEmailAddress] = useState(profile ? profile.emailAddress : '');
  const [contactInformation, setContactInformation] = useState(profile ? profile.contactInformation : '');
  const [gender, setGender] = useState(profile ? profile.gender : '');
  const [biography, setBiography] = useState(profile ? profile.biography : '');
  const [streetAddress, setStreetAddress] = useState(profile ? profile.locationName : '');
  const [country, setCountry] = useState(profile ? profile.country : '');
  const [city, setCity] = useState(profile ? profile.city : '');
  const [state, setState] = useState(profile ? profile.state : '');
  const [postalCode, setPostalCode] = useState(profile ? profile.postalCode : '');
  const [website, setWebsite] = useState(profile ? profile.website : '');
  const [facebook, setFacebook] = useState(profile ? profile.facebook : '');
  const [twitter, setTwitter] = useState(profile ? profile.twitter : '');
  const [instagram, setInstagram] = useState(profile ? profile.instagram : '');
  const [linkedIn, setLinkedIn] = useState(profile ? profile.linkedIn : '');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const contactInfoRegex = /^[0-9]{10,15}$/;

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
    const emptyFieldError = 'This field cannot be empty';

    if (!firstName.trim()) newErrors.firstName = emptyFieldError;
    if (!lastName.trim()) newErrors.lastName = emptyFieldError;
    if (!emailAddress.trim()) newErrors.emailAddress = emptyFieldError;
    else if (!emailRegex.test(emailAddress)) newErrors.emailAddress = 'Invalid email address format'; // Check if email is valid
    if (!contactInformation.trim()) newErrors.contactInformation = emptyFieldError;
    else if (!contactInfoRegex.test(contactInformation)) newErrors.contactInformation = 'Enter a valid contact number (10-15 digits).'; // Check if contact information is valid
    if (!gender) newErrors.gender = emptyFieldError;
    if (!biography.trim()) newErrors.biography = emptyFieldError;
    if (!streetAddress.trim()) newErrors.streetAddress = emptyFieldError;
    if (!country) newErrors.country = emptyFieldError;
    if (!city.trim()) newErrors.city = emptyFieldError;
    if (!state.trim()) newErrors.state = emptyFieldError;
    if (!postalCode.trim()) newErrors.postalCode = emptyFieldError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (isEditable) {
      if (!validateFields()) {
        return; // Don't proceed if there are validation errors
      }

      try {
        const profileData = {
          firstName,
          lastName,
          emailAddress,
          contactInformation,
          gender,
          biography,
          streetAddress,
          country,
          city,
          state,
          postalCode,
          website,
          facebook,
          twitter,
          instagram,
          linkedIn,
        };

        const endpoint = `${process.env.REACT_APP_API_URL}/investors/${profile.id}`;

        await axios.put(endpoint, profileData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setIsEditable(false);

        // Add a small delay before refreshing to ensure the server has processed the update
        setTimeout(() => {
          window.location.reload();
        }, 500);

      } catch (error) {
        console.error('Failed to update profile:', error);
        // Optionally, show an error message to the user
      }
    } else {
      setIsEditable(true);
    }
  };

  const handleUploadProfilePicture = async (file) => {
    if (file) {
      try {
        const pictureFormData = new FormData();
        pictureFormData.append('file', file);

        const pictureEndpoint = `${process.env.REACT_APP_API_URL}/profile-picture/investor/${profile.id}/update`;

        await axios.put(pictureEndpoint, pictureFormData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        await fetchProfilePicture();
      } catch (error) {
        console.error('Failed to upload profile picture:', error);
      }
    }
  };

  const fetchProfilePicture = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile-picture/investor/${profile.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
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
                    <Avatar sx={{ width: 200, height: 200, mb: 2, ml: 49.5, cursor: 'pointer', border: '5px #336FB0 solid' }} src={avatar} onClick={handleAvatarClick} />
                    </label>
                
                    <input type="file" accept="image/*" id="avatar-upload" onChange={handleAvatarChange}
                    disabled={!isEditable} ref={fileInputRef} style={{ display: 'none'}}/>                      
                </Grid>

                <Box component="main" sx={{mr: 5, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ color: '#414a4c', fontWeight: '500', pl: 5, pb: 3, pt: 1 }}>
                        Overview
                    </Typography>
                
                    <Grid container spacing={3} sx={{ ml: 2 }}>
                        <Grid item xs={12} sm={11.4}>
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <label>First Name {RequiredAsterisk}</label>
                                <TextField 
                                  fullWidth 
                                  variant="outlined" 
                                  value={firstName} 
                                  onChange={(e) => setFirstName(e.target.value)} 
                                  disabled={!isEditable} 
                                  sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                                  error={!!errors.firstName}
                                />
                                {errors.firstName && (
                                  <FormHelperText error>{errors.firstName}</FormHelperText>
                                )}
                              </Grid>

                              <Grid item xs={6}>
                                <label>Last Name {RequiredAsterisk}</label>
                                <TextField 
                                  fullWidth 
                                  variant="outlined" 
                                  value={lastName} 
                                  onChange={(e) => setLastName(e.target.value)} 
                                  disabled={!isEditable} 
                                  sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                                  error={!!errors.lastName}
                                />
                                {errors.lastName && (
                                  <FormHelperText error>{errors.lastName}</FormHelperText>
                                )}
                              </Grid>

                              <Grid item xs={12}>
                                <label>Email Address {RequiredAsterisk}</label>
                                <TextField 
                                  fullWidth 
                                  variant="outlined" 
                                  value={emailAddress} 
                                  onChange={(e) => setEmailAddress(e.target.value)} 
                                  disabled={!isEditable} 
                                  sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                                  error={!!errors.emailAddress}
                                />
                                {errors.emailAddress && ( 
                                  <FormHelperText error>{errors.emailAddress}</FormHelperText>
                                )}
                              </Grid>

                              <Grid item xs={6}>
                                <label>Contact Information {RequiredAsterisk}</label>
                                <TextField
                                  fullWidth
                                  variant="outlined"
                                  value={contactInformation}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value) && (value.length <= 15)) { // Ensure only numbers and max length is 15
                                      setContactInformation(value);
                                    }
                                  }}
                                  disabled={!isEditable}
                                  error={!!errors.contactInformation} // Show error if validation fails
                                  sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                                />
                                {errors.contactInformation && (
                                  <FormHelperText error>{errors.contactInformation}</FormHelperText>
                                )}
                              </Grid>

                              <Grid item xs={6}>
                                <label>Gender {RequiredAsterisk}</label>
                                <Select 
                                  fullWidth 
                                  variant="outlined" 
                                  value={gender} 
                                  onChange={(e) => setGender(e.target.value)} 
                                  disabled={!isEditable} 
                                  sx={{ height: '45px' }}
                                  error={!!errors.gender}
                                >
                                  {genderOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                      {option.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errors.gender && (
                                  <FormHelperText error>{errors.gender}</FormHelperText>
                                )}
                              </Grid>

                              <Grid item xs={12}>
                                <label>Biography {RequiredAsterisk}</label>
                                <TextField 
                                  fullWidth 
                                  variant="outlined" 
                                  multiline 
                                  rows={6} 
                                  value={biography} 
                                  onChange={(e) => setBiography(e.target.value)} 
                                  disabled={!isEditable}
                                  error={!!errors.biography}
                                />
                                {errors.biography && (
                                  <FormHelperText error>{errors.biography}</FormHelperText>
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
                              <Grid item xs={12}>
                                <label>Address {RequiredAsterisk}</label>
                                <TextField 
                                  fullWidth 
                                  variant="outlined" 
                                  value={streetAddress} 
                                  onChange={(e) => setStreetAddress(e.target.value)} 
                                  disabled 
                                  sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                                  error={!!errors.streetAddress}
                                />
                                {errors.streetAddress && (
                                  <FormHelperText error>{errors.streetAddress}</FormHelperText>
                                )}
                              </Grid>

                              <Grid item xs={4} sm={11.4}>
                    <Button
                      variant="contained"
                      sx={{
                        width: 150,
                        background: "#336FB0",
                        "&:hover": {
                          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                          backgroundColor: "#336FB0",
                        },
                      }}
                      onClick={() =>
                        (window.location.href = `https://startupsphere.mugnavo.com/investor/${profile.id}`)
                      }
                    >
                      Set Location
                    </Button>
                  </Grid>

                              <Grid item xs={8}>
                                <label>Country {RequiredAsterisk}</label>
                                <Autocomplete
                                  options={countries}
                                  getOptionLabel={(option) => option.label}
                                  value={countries.find(c => c.label === country) || null}
                                  onChange={(event, newValue) => {
                                    if (isEditable) { // Only allow changes if it's editable
                                      setCountry(newValue ? newValue.label : '');
                                    }
                                  }}
                                  renderOption={(props, option) => (
                                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                      <img
                                        loading="lazy"
                                        width="20"
                                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                        alt=""
                                      />
                                      {option.label} ({option.code}) +{option.phone}
                                    </Box>
                                  )}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      variant="outlined"
                                      inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password',
                                      }}
                                      disabled={!isEditable} // Disable input if not in edit mode
                                      error={!!errors.country}
                                    />
                                  )}
                                  disabled={!isEditable} // Disable the entire dropdown if not in edit mode
                                  clearIcon={isEditable ? undefined : null} // Show clear icon only if editable
                                  disableClearable={!isEditable} // Disable clearing when not in edit mode
                                  sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                                />
                                {errors.country && (
                                  <FormHelperText error>{errors.country}</FormHelperText>
                                )}
                              </Grid>

                              

                              <Grid item xs={4}>
                                <label>Postal/Zip Code {RequiredAsterisk}</label>
                                <TextField 
                                  fullWidth 
                                  variant="outlined" 
                                  value={postalCode} 
                                  onChange={(e) => setPostalCode(e.target.value)} 
                                  disabled={!isEditable} 
                                  sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
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
                                    <TextField fullWidth variant="outlined" value={facebook} onChange={(e) => setFacebook(e.target.value)} disabled={!isEditable} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}/>
                                </Grid>

                                <Grid item xs={12}>
                                    <label>Twitter</label>
                                    <TextField fullWidth variant="outlined" value={twitter} onChange={(e) => setTwitter(e.target.value)} disabled={!isEditable} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}/>
                                </Grid>

                                <Grid item xs={12}>
                                    <label>Instagram</label>
                                    <TextField fullWidth variant="outlined" value={instagram} onChange={(e) => setInstagram(e.target.value)} disabled={!isEditable} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}/>
                                </Grid>

                                <Grid item xs={12}>
                                    <label>LinkedIn</label>
                                    <TextField fullWidth variant="outlined" value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)} disabled={!isEditable} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}/>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Button variant="contained" 
                    sx={{ width: 150, background: '#336FB0', '&:hover': { boxShadow: '0 0 10px rgba(0,0,0,0.5)', backgroundColor: '#336FB0' } }} style={{marginLeft: '83.5%'}} onClick={handleUpdateProfile}>
                        {isEditable ? 'Save Changes' : 'Edit Profile'}
                    </Button>
                </Box>
            </Box>
        </>
    );
}

export default ViewInvestorProfile;