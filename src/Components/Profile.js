import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import genderOptions from '../static/genderOptions';
import ChangePasswordDialog from '../Dialogs/ChangePasswordDialog';
import { Box, Typography, Toolbar, TextField, Avatar, Button, Select, MenuItem, Grid, Skeleton } from '@mui/material';

const drawerWidth = 240;

function Profile() {
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleSaveChanges = async () => {
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
      setUserData(userData); // Update local state with new user data
    } catch (error) {
      console.error('Failed to update user data:', error);
      throw error;
    }
  };

  const handleSavePassword = (currentPassword, newPassword) => {
    console.log('Current Password:', currentPassword);
    console.log('New Password:', newPassword);
  };

  return (
    <>
      <Navbar />
      <Toolbar />
      <Box component="main" sx={{ flexGrow: 1, p: 4, mt: 3, paddingLeft: `${drawerWidth}px`, width: '100%', overflowX: 'hidden' }}>
        <Typography variant="h5" sx={{ paddingLeft: 8, color: '#1E1E1E', fontWeight: 'bold' }}>
          Account Information
        </Typography>

        {userData.role === 'Investor' && (
        <Box sx={{ backgroundColor: '#FFEB3B', padding: 2, borderRadius: 2, marginTop: 2, ml: 8, mr: 5, mb: -1 }}>
          <Typography variant="body1" sx={{ color: '#1E1E1E', fontWeight: 'bold' }}>
            ⚠️ To enhance your credibility and legitimacy, please ensure that your profile is fully completed.
          </Typography>
        </Box>
        )}

        <Box component="main" sx={{ mr: 5, borderRadius: 2, ml: 8, pb: 6, mt: 3, boxShadow: '0 0 10px rgba(0,0,0,0.25)' }}>
          <Typography sx={{ color: 'white', background: '#336FB0', fontWeight: '500', pl: 8, pt: 1.5, pb: 1.5, mb: 3, fontSize: '20px' }}>
            Personal Information
          </Typography>

          {loading ? (
            <Grid container spacing={2} sx={{ ml: 7 }}>
              <Grid item xs={12} sm={2.5}>
                <Skeleton variant="circular" width={220} height={220} sx={{ mt: 2, mt: 2, ml: 5, }} />
                <Skeleton variant="text" width="30%" sx={{ mt: 1, ml: 12, }} />
              </Grid>

              <Grid item xs={12} sm={7.8}>
                <Grid container spacing={2}>
                  <Grid item xs={2}><Skeleton variant="text" width="100%" height={45} /></Grid>
                  <Grid item xs={4}><Skeleton variant="text" width="100%" height={45} /></Grid>
                  <Grid item xs={6}><Skeleton variant="text" width="100%" height={45} /></Grid>
                  <Grid item xs={6}><Skeleton variant="text" width="100%" height={45} /></Grid>
                  <Grid item xs={6}><Skeleton variant="text" width="100%" height={45} /></Grid>
                  <Grid item xs={6}><Skeleton variant="text" width="100%" height={45} /></Grid>
                  <Grid item xs={6}><Skeleton variant="text" width="100%" height={45} /></Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Grid container sx={{ ml: 7 }}>
              <Grid item xs={12} sm={2.5}>
                <label htmlFor="avatar-upload">
                  <Avatar sx={{ width: 220, height: 220, mt: 2, ml: 5, border: '5px #336FB0 solid', cursor: isEditable ? 'pointer' : 'default' }} src={profilePicUrl}  />
                </label>
                <input type="file" accept="image/*" id="avatar-upload" style={{ display: 'none' }}
                  onChange={(event) => {
                    const file = event.target.files[0];
                    if (file && userData.id) {
                      updateProfilePicture(userData.id, file);
                    }
                  }}
                  disabled={!isEditable} />
                <Typography sx={{ mt: 1, ml: 12, color: '#336FB0' }}>Upload Photo</Typography>
              </Grid>

              <Grid item xs={12} sm={7.8}>
                <Grid container spacing={3}>
                  <Grid item xs={1.5}>
                    <label>Role</label>
                    <TextField fullWidth variant="outlined" value={userData.role} disabled
                      InputProps={{ sx: { height: '45px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' } }} />
                  </Grid>
                  <Grid item xs={4.5}>
                    <label>First Name</label>
                    <TextField fullWidth variant="outlined" value={userData.firstName}
                      onChange={(e) => setUserData((prevData) => ({ ...prevData, firstName: e.target.value }))} 
                      InputProps={{
                        disabled: !isEditable,
                        style: { height: '45px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },
                      }} />
                  </Grid>
                  <Grid item xs={6}>
                    <label>Last Name</label>
                    <TextField fullWidth variant="outlined" value={userData.lastName}
                      onChange={(e) => setUserData((prevData) => ({ ...prevData, lastName: e.target.value }))} 
                      InputProps={{
                        disabled: !isEditable,
                        style: { height: '45px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },
                      }} />
                  </Grid>
                  <Grid item xs={6}>
                    <label>Email Address</label>
                    <TextField fullWidth variant="outlined" value={userData.email}
                      onChange={(e) => setUserData((prevData) => ({ ...prevData, email: e.target.value }))} 
                      InputProps={{
                        disabled: !isEditable,
                        style: { height: '45px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },
                      }} />
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <label>Password</label>
                      {isEditable ? (
                        <Typography variant="caption" sx={{ color: '#336FB0', ml: 1, textDecoration: 'underline', cursor: 'pointer' }}
                          onClick={() => setOpenChangePassword(true)}>
                          Change Password
                        </Typography>
                      ) : (
                        <Typography variant="caption" sx={{ color: 'gray', ml: 1, textDecoration: 'underline' }}>
                          Change Password
                        </Typography>
                      )}
                    </Box>
                    <TextField fullWidth variant="outlined" type="password" disabled
                      InputProps={{
                        style: {
                          height: '45px',
                          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                        },
                      }} />
                  </Grid>

                  <Grid item xs={6}>
                    <label>Phone Number</label>
                    <TextField fullWidth variant="outlined" value={userData.contactNumber}
                      onChange={(e) => setUserData((prevData) => ({ ...prevData, contactNumber: e.target.value }))} 
                      InputProps={{
                        disabled: !isEditable,
                        style: { height: '45px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },
                      }} />
                  </Grid>

                  <Grid item xs={6}>
                    <label>Gender</label>
                    <Select fullWidth variant="outlined" value={userData.gender}
                      onChange={(e) => setUserData((prevData) => ({ ...prevData, gender: e.target.value }))} 
                      disabled={!isEditable}
                      style={{ height: '45px', boxShadow: '0 0 10px rgba(0,0,0,0.2)' }}>
                      {genderOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}

          {/* Additional fields important for investor role to fill up*/}
          <Box sx={{ mt: 3, pl: 8, pr: 20 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <label>Biography</label>
                {loading ? (
                  <Skeleton variant="text" width="100%" height={45} />
                ) : (
                  <TextField fullWidth variant="outlined" multiline rows={2}
                    value={userData.biography}
                    onChange={(e) => setUserData((prevData) => ({ ...prevData, biography: e.target.value }))} 
                    InputProps={{
                      disabled: !isEditable,
                      style: {
                        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                      },
                    }} 
                    sx={{ 
                      height: 'auto',
                      '& textarea': { 
                        height: 'auto',
                        minHeight: '6em', 
                      },
                    }} />
                )}
              </Grid>

              {userData.role === 'Investor' && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <label>Location</label>
                      {isEditable ? (
                        <Typography variant="caption" sx={{ color: '#336FB0', ml: 1, textDecoration: 'underline',cursor: 'pointer', }}
                          onClick={() => {
                              window.location.href = `https://startupsphere.mugnavo.com/investor/${userData.id}`;
                            } 
                              }
                           >
                          Click to Set Your Current Location
                        </Typography>
                      ) : (
                        <Typography variant="caption"sx={{ color: 'gray', ml: 1,}}>Click to Set Your Current Location</Typography>
                      )}
                    </Box>
                    <TextField fullWidth variant="outlined" type="password" disabled
                      InputProps={{
                        style: {
                          height: '45px',
                          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                        },
                      }}/>
                  </Grid>
                  )}

              <Grid item xs={12}>
              <Typography variant='h5'>Links</Typography>
              </Grid>

              <Grid item xs={6}>
                <label>Facebook</label>
                {loading ? (
                  <Skeleton variant="text" width="100%" height={45} />
                ) : (
                  <TextField fullWidth variant="outlined" value={userData.facebook}
                    onChange={(e) => setUserData((prevData) => ({ ...prevData, facebook: e.target.value }))} 
                    InputProps={{
                      disabled: !isEditable,
                      style: { height: '45px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },
                    }} />
                )}
              </Grid>

              <Grid item xs={6}>
                <label>Instagram</label>
                {loading ? (
                  <Skeleton variant="text" width="100%" height={45} />
                ) : (
                  <TextField fullWidth variant="outlined" value={userData.instagram}
                    onChange={(e) => setUserData((prevData) => ({ ...prevData, instagram: e.target.value }))} 
                    InputProps={{
                      disabled: !isEditable,
                      style: { height: '45px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },
                    }} />
                )}
              </Grid>

              <Grid item xs={6}>
                <label>Twitter</label>
                {loading ? (
                  <Skeleton variant="text" width="100%" height={45} />
                ) : (
                  <TextField fullWidth variant="outlined" value={userData.twitter}
                    onChange={(e) => setUserData((prevData) => ({ ...prevData, twitter: e.target.value }))} 
                    InputProps={{
                      disabled: !isEditable,
                      style: { height: '45px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },
                    }} />
                )}
              </Grid>

              <Grid item xs={6}>
                <label>LinkedIn</label>
                {loading ? (
                  <Skeleton variant="text" width="100%" height={45} />
                ) : (
                  <TextField fullWidth variant="outlined" value={userData.linkedIn}
                    onChange={(e) => setUserData((prevData) => ({ ...prevData, linkedIn: e.target.value }))} 
                    InputProps={{
                      disabled: !isEditable,
                      style: { height: '45px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },
                    }} />
                )}
              </Grid>
            </Grid>
          </Box>

          <Grid container justifyContent="flex-end" sx={{ mt: 3, pr: 20 }}>
            <Grid item>
              {loading ? (
                <Skeleton variant="text" width={150} height={45} />
              ) : (
                <Button variant="contained"
                  sx={{ width: 150, background: '#336FB0',
                    '&:hover': { boxShadow: '0 0 10px rgba(0,0,0,0.5)', backgroundColor: '#336FB0' },
                  }}
                  onClick={isEditable ? handleSaveChanges : handleEditClick}>
                  {isEditable ? 'Save Changes' : 'Edit Profile'}
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
      <ChangePasswordDialog open={openChangePassword} onClose={() => setOpenChangePassword(false)} onSave={handleSavePassword} />
    </>
  );
}

export default Profile;
