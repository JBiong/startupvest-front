import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import genderOptions from '../static/genderOptions';
import ChangePasswordDialog from '../Dialogs/ChangePasswordDialog';
import { Box, Typography, Toolbar, TextField, Avatar, Button, Select, MenuItem, Grid, Skeleton, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const drawerWidth = 250;

function Profile() {
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [showFullBio, setShowFullBio] = useState(false);

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    gender: '',
    avatar: '',
    role: '',
    biography: '',
    facebook: '',
    instagram: '',
    twitter: '',
    linkedIn: '',
  });

  const [profilePicUrl, setProfilePicUrl] = useState('');

  const toggleBio = () => {
    setShowFullBio(!showFullBio); 
  };

  // Fetch user data when the component mounts.
  useEffect(() => {
    fetchUserData();
    fetchBusinessProfiles();
    // Call fetchProfilePicture here using the user ID from userData
    if (userData.id) {
      fetchProfilePicture(userData.id);
    }
  }, [userData.id]);

  const fetchUserData = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessProfiles = async () => {
    setLoading(true);
    try {
      const responseStartups = await axios.get(`${process.env.REACT_APP_API_URL}/startups`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const responseInvestors = await axios.get(`${process.env.REACT_APP_API_URL}/investors`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const startups = responseStartups.data.filter(profile => !profile.isDeleted).map(profile => ({ ...profile, type: 'Startup' }));
      const investors = responseInvestors.data.filter(profile => !profile.isDeleted).map(profile => ({ ...profile, type: 'Investor' }));

      setBusinessProfiles([...investors, ...startups]);
    } catch (error) {
      console.error('Failed to fetch business profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditable(!isEditable);
  };

  // Function to fetch and display the profile picture
  const fetchProfilePicture = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile-picture/${userData.id}`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const url = URL.createObjectURL(response.data);
      setProfilePicUrl(url); // Update the profile picture URL state
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };

  // Function to handle profile picture update
  const updateProfilePicture = async (userId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/profile-picture/${userData.id}`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      // After updating, fetch the new profile picture to update the avatar
      fetchProfilePicture(userData.id);
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };

  const validateFields = () => {
    const emptyFieldError = "This field is required";
    const maxDescriptionLength = 1000;

    const errors = {};
    
    if (!userData.firstName.trim()) errors.firstName = emptyFieldError;
    if (!userData.lastName.trim()) errors.lastName = emptyFieldError;
    if (!userData.email.trim()) errors.email = emptyFieldError;
    if (!userData.contactNumber.trim()) errors.contactNumber = emptyFieldError;
    if (!userData.gender.trim()) errors.gender = emptyFieldError;
    if (userData.biography && userData.biography.trim().length === 0) {
      errors.biography = emptyFieldError;
    } else if (userData.biography && userData.biography.length > maxDescriptionLength) {
      errors.biography = `Biography cannot exceed ${maxDescriptionLength} characters.`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveChanges = async () => {
    if (!validateFields()) return;

    try {
      await updateUser(userData);
      setIsEditable(false);
    } catch (error) {
      console.error('Failed to update user data:', error);
    }
  };

  const updateUser = async (userData) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/users/${userData.id}`, userData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('User data updated successfully:', response.data);
      setUserData(userData); 
    } catch (error) {
      console.error('Failed to update user data:', error);
      throw error;
    }
  };

  const areRequiredFieldsFilled = () => {
    return userData.firstName && userData.lastName && userData.email && userData.contactNumber && userData.gender && 
    userData.biography && userData.facebook && userData.twitter && userData.instagram && userData.linkedIn && userData.location;
  };

  const capitalizeFirstLetter = (str) => {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
  };

return (
  <>
    <Navbar />
    <Toolbar />
    <Box component="main" sx={{ flexGrow: 1, pt: 4, pb: 6, paddingLeft: `${drawerWidth}px`, width: '100%', overflowX: 'hidden', backgroundColor: '#f5f5f5' }}>
      <Typography variant="h5" sx={{ paddingLeft: 4, color: '#1E1E1E', mt: 3 }}>Account Information</Typography>

      {userData.role === 'Investor' && !areRequiredFieldsFilled() && (
          <Box sx={{ backgroundColor: '#FFEB3B', padding: 2, borderRadius: 2, marginTop: 2, ml: 3, mr: 5, mb: -1 }}>
            <Typography variant="body1" sx={{ color: '#1E1E1E', fontWeight: 'bold' }}>
              ⚠️ To enhance your credibility and legitimacy, please ensure that your profile is fully completed.
            </Typography>
          </Box>
        )}

      <Grid container spacing={3} sx={{ mt: 1, ml: 'auto', mr: 'auto', width: '100%', display: 'flex'}}>
        <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', }}>
        {loading ? (
                    <Skeleton variant="rectangular" height={400} width="100%" />
                ) : (
          <Box component="main" sx={{ borderRadius: 2, pb: 3, boxShadow: '0 0 10px rgba(0,0,0,0.25)', textAlign: 'center', display: 'flex', flexDirection: 'column',
              alignItems: 'center', background: 'white' }}>
            <Grid container justifyContent="center" sx={{ mt: 2, mb: 2 }}>
              <Grid item xs={12} display="flex" justifyContent="center">
                <label htmlFor="avatar-upload">
                  <Avatar sx={{ width: 220, height: 220, mt: 3, mb: 3, border: '5px #336FB0 solid', cursor: isEditable ? 'pointer' : 'default' }} src={profilePicUrl}  />
                </label>
                <input type="file" accept="image/*" id="avatar-upload" style={{ display: 'none' }}
                  onChange={(event) => {
                    const file = event.target.files[0];
                    if (file && userData.id) {
                      updateProfilePicture(userData.id, file);
                    }
                  }}
                  disabled={!isEditable} />
              </Grid>

              <Grid item xs={12} display="flex" justifyContent="center">
                <Typography variant="h5" sx={{ fontWeight: 'bold'}}>
                  {capitalizeFirstLetter(`${userData.firstName} ${userData.lastName}`)}
                </Typography>
              </Grid>

              <Grid item xs={12} display="flex" justifyContent="center">
                <Typography variant="body1" color="textSecondary">
                  {userData.role === 'Investor' ? userData.location || 'Location not provided' : userData.email}
                </Typography>              
              </Grid>
            </Grid>

            {/* Social Media Icons */}
            <Grid container justifyContent="center">
              <Grid item>
                <IconButton component="a" href={userData.facebook} target="_blank" disabled={!userData.facebook}
                sx={{ color: userData.facebook ? '#3b5998' : '#e0e0e0', '&:hover': { color: userData.facebook ? '#004182' : '#e0e0e0' },borderRadius: '50%',}}>
                <FacebookIcon fontSize="medium"/>
                </IconButton>
              </Grid>

              <Grid item>
                <IconButton component="a" href={userData.instagram} target="_blank" disabled={!userData.instagram}
                sx={{ color: userData.instagram ? '#C13584' : '#e0e0e0', '&:hover': { color: userData.instagram ? '#b02e5a' : '#e0e0e0' }, borderRadius: '50%',}}>
                <InstagramIcon fontSize="medium"/>
                </IconButton>
              </Grid>

              <Grid item>
                <IconButton component="a" href={userData.twitter} target="_blank" disabled={!userData.twitter}
               sx={{ color: userData.twitter ? '#1DA1F2' : '#e0e0e0', '&:hover': { color: userData.twitter ? '#0a8ddb' : '#e0e0e0' }, borderRadius: '50%',}}>
                <TwitterIcon fontSize="medium" />
                </IconButton>
              </Grid>

              <Grid item>
                <IconButton component="a" href={userData.linkedin} target="_blank" disabled={!userData.linkedIn}
                sx={{ color: userData.linkedIn ? '#0077B5' : '#e0e0e0', '&:hover': { color: userData.linkedIn ? '#004182' : '#e0e0e0' }, borderRadius: '50%',}}>
                <LinkedInIcon fontSize="medium"/>
                </IconButton>
              </Grid>
            </Grid>
          </Box>
          )}

          {/* Biography Section */}
          {loading ? (
            <Skeleton variant="rectangular" height={400} width="100%" sx={{ mt: 3 }}/>
          ) : (
            <Box sx={{ p: 4, mt: 3, boxShadow: '0 0 10px rgba(0,0,0,0.25)', borderRadius: 2, textAlign: 'justify', flexGrow: 1, background: 'white' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>About Me</Typography>
              
              {/* Check if there is biography data */}
              {userData.biography ? (
                <Typography variant="body1" color="textSecondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {showFullBio ? userData.biography : `${userData.biography.slice(0, 460)}`}
                  
                  {/* Toggle link for long bios */}
                  {userData.biography.length > 200 && (
                    <Typography component="span" onClick={toggleBio}
                      sx={{ color: '#336FB0', cursor: 'pointer', fontWeight: 'bold', ml: 1 }}>
                      {showFullBio ? 'Show less' : 'See more'}
                    </Typography>
                  )}
                </Typography>
              ) : (
                <Typography variant="body1" color="textSecondary">No profile information available for this user.</Typography>
              )}
            </Box>
          )}
        </Grid>

        {/* Editable Profile Fields */}
        <Grid item xs={12} md={6.5} sx={{ display: 'flex', flexDirection: 'column', }}>
          {loading ? (
                    <Skeleton variant="rectangular" height={800} width="100%" sx={{ flexGrow: 1 }} />
                ) : (
          <Box sx={{ pt: 5, pb: 5, pl: 7, pr: 7, boxShadow: '0 0 10px rgba(0,0,0,0.25)', borderRadius: 2, flexGrow: 1, background: 'white' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Edit Profile</Typography>
                <Button variant="contained" sx={{ background: '#336FB0', '&:hover': { boxShadow: '0 0 10px rgba(0,0,0,0.5)', backgroundColor: '#336FB0' }, width: '150px', textTransform: 'none' }}
                  onClick={isEditable ? handleSaveChanges : handleEditClick}>
                  {isEditable ? 'Save Changes' : 'Edit'}
                </Button>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <label>First Name</label>
                <TextField fullWidth variant="outlined" value={userData.firstName}
                  onChange={(e) => setUserData((prevData) => ({ ...prevData, firstName: e.target.value }))} 
                  error={!!formErrors.firstName} helperText={formErrors.firstName}
                  InputProps={{ disabled: !isEditable, style: { height: '45px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }, }} />
              </Grid>

              <Grid item xs={4}>
                <label>Last Name</label>
                <TextField fullWidth variant="outlined" value={userData.lastName}
                  onChange={(e) => setUserData((prevData) => ({ ...prevData, lastName: e.target.value }))} 
                  error={!!formErrors.lastName} helperText={formErrors.lastName}  
                  InputProps={{ disabled: !isEditable, style: { height: '45px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }, }} />
              </Grid>

              <Grid item xs={4}>
                <label>Gender</label>
                <Select fullWidth variant="outlined" value={userData.gender}
                  onChange={(e) => setUserData((prevData) => ({ ...prevData, gender: e.target.value }))} 
                  disabled={!isEditable} style={{ height: '45px', boxShadow: '0 0 10px rgba(0,0,0,0.2)' }}>
                  {genderOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
                </Select>
              </Grid>

              <Grid item xs={6}>
                <label>Email Address</label>
                <TextField fullWidth variant="outlined" value={userData.email}
                onChange={(e) => setUserData((prevData) => ({ ...prevData, email: e.target.value }))} 
                error={!!formErrors.email} helperText={formErrors.email}
                InputProps={{ disabled: !isEditable, style: { height: '45px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },}} />
              </Grid>

              <Grid item xs={6}>
                <label>Phone Number</label>
                <TextField fullWidth variant="outlined" value={userData.contactNumber}
                  onChange={(e) => {
                  const numericValue = e.target.value.replace(/[^0-9]/g, '');
                  setUserData((prevData) => ({ ...prevData, contactNumber: numericValue }));
                }}
                error={!!formErrors.contactNumber} helperText={formErrors.contactNumber}
                InputProps={{ disabled: !isEditable, style: { height: '45px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }, }} />
              </Grid>

              {userData.role === 'Investor' && (
                <Grid item xs={12}>
                  <label>Location</label>
                  <TextField disabled fullWidth variant="outlined" InputProps={{ style: { height: '45px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', }, }} />
                </Grid>
              )}

              <Grid item xs={12}>
                <label>Biography</label>
                <TextField fullWidth variant="outlined" multiline rows={2.2}
                  value={userData.biography}
                  onChange={(e) => setUserData((prevData) => ({ ...prevData, biography: e.target.value }))} 
                  InputProps={{ disabled: !isEditable, style: { boxShadow: '0 0 10px rgba(0,0,0,0.1)', },}} 
                  sx={{ height: 'auto', '& textarea': { height: 'auto', minHeight: '5em', },}} 
                  error={!!formErrors.biography} helperText={formErrors.biography} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant='h6' sx={{ fontWeight: 'bold' }}>Links</Typography>
              </Grid>

              <Grid item xs={6}>
                <label>Facebook</label>
                  <TextField fullWidth variant="outlined" value={userData.facebook}
                    onChange={(e) => setUserData((prevData) => ({ ...prevData, facebook: e.target.value }))} 
                    InputProps={{ disabled: !isEditable, style: { height: '45px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },}} />
              </Grid>

              <Grid item xs={6}>
                <label>Instagram</label>
                <TextField fullWidth variant="outlined" value={userData.instagram}
                  onChange={(e) => setUserData((prevData) => ({ ...prevData, instagram: e.target.value }))} 
                  InputProps={{ disabled: !isEditable, style: { height: '45px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },
                }} />
              </Grid>

              <Grid item xs={6}>
                <label>Twitter</label>
                <TextField fullWidth variant="outlined" value={userData.twitter}
                  onChange={(e) => setUserData((prevData) => ({ ...prevData, twitter: e.target.value }))} 
                  InputProps={{ disabled: !isEditable, style: { height: '45px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },}} />
              </Grid>

              <Grid item xs={6}>
                <label>LinkedIn</label>
                <TextField fullWidth variant="outlined" value={userData.linkedIn}
                  onChange={(e) => setUserData((prevData) => ({ ...prevData, linkedIn: e.target.value }))} 
                  InputProps={{ disabled: !isEditable, style: { height: '45px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },}} />
              </Grid>
            </Grid>
          </Box>
          )}
        </Grid>

        {/* Change Password and Startup Vest promo*/}
        <Grid item xs={12} md={2.2} sx={{ display: 'flex', flexDirection: 'column', }}>
        {loading ? (
                    <Skeleton variant="rectangular" height={300} width="100%" />
                ) : (
          <Box sx={{ pt: 5, pb: 5, pl: 4, pr: 4, boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderRadius: '12px', background: 'white', maxWidth: '400px', margin: '0 auto', }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1E1E1E', mb: 2 }}>Change Password</Typography>
                <Typography variant="body1" color="textSecondary"
                  sx={{ textAlign: 'justify', fontSize: '15px', lineHeight: '1.6em', }}>
                  Keep your account secure by regularly updating your password. Click the button below to set a new password.
                </Typography>

                <Button variant="outlined" color="primary" fullWidth
                  onClick={() => setOpenChangePassword(true)}
                  sx={{ mt: 3, textTransform: 'none', borderRadius: '8px', padding: '12px 0', }}>
                  Change Password
                </Button>
              </Grid>
            </Grid>
          </Box>
          )}

        {userData.role === 'Investor' && (
          <Box sx={{ mt: 3, pt: 5, pb: 5, pl: 4, pr: 4, boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderRadius: '12px', background: 'white', maxWidth: '400px', }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1E1E1E', mb: 1 }}>Set Current Location</Typography>  
                <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'justify', lineHeight: '1.6', fontSize: '15px' }}>
                  Clicking here will take you to Startup Sphere to update your location. Would you like to continue?
                </Typography>

                <Button variant="outlined" fullWidth 
                  onClick={() => { window.location.href = `https://startupsphere.mugnavo.com/investor/${userData.id}`; }}
                  sx={{ mt: 3, textTransform: 'none', borderRadius: '8px', padding: '12px 0', }}>Set Location
                </Button>
              </Grid>
            </Grid>
          </Box>
          )}
        </Grid>
      </Grid>
    </Box>
    <ChangePasswordDialog open={openChangePassword} onClose={() => setOpenChangePassword(false)} />
  </>
);
}

export default Profile;