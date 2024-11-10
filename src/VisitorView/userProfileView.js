import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Divider, Toolbar, Typography, Grid, IconButton, Skeleton } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { StyledAvatar, UserInfoBox, OverviewTitle, IconsContainer } from '../styles/VisitorView';

const drawerWidth = 240;

function UserProfileView() {
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true); 
  const location = useLocation();
  const profile = location.state?.profile;

  const fetchProfilePicture = async () => {
    if (!profile?.id) return;

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile-picture/${profile.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        responseType: 'blob',
      });

      const imageUrl = URL.createObjectURL(response.data);
      setAvatarUrl(imageUrl);
    } catch (error) {
      console.error('Failed to fetch profile picture:', error);
      setAvatarUrl('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfilePicture();
  }, [profile?.id]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  const streetAddress = profile.streetAddress === "N/A" ? "" : profile.streetAddress || "";
  const city = profile.city === "N/A" ? "" : profile.city || "";
  const country = profile.country === "N/A" ? "" : profile.country || "";
  const locationParts = [streetAddress, city, country].filter(part => part !== "").join(", ");
  const locationDisplay = locationParts ? locationParts : "Address not available";

  return (
    <>
      <Navbar />
      <Toolbar />

      <Box sx={{ width: '100%', paddingLeft: `${drawerWidth}px`, mt: 5 }}>
        <Box display="flex" alignItems="center">
          <Box mr={4}>
            {loading ? (
              <Skeleton variant="rounded" width={160} height={160} sx={{ ml: 9 }} />
            ) : (
              <StyledAvatar variant="rounded" src={avatarUrl}>
                {!profile.photo && `${profile.firstName[0]}${profile.lastName[0]}`}
              </StyledAvatar>
            )}
          </Box>
          {loading ? (
            <Skeleton width={300} height={80} />
          ) : (
            <Typography variant="h4" gutterBottom>{`${profile.firstName} ${profile.lastName}`}</Typography>
          )}
        </Box>

        <Divider sx={{ mt: 2 }} />

        <Box component="main" sx={{ display: 'flex', flexGrow: 1, p: 4, width: '100%', overflowX: 'hidden' }}>
          <Grid container spacing={2}>
            <Grid item xs={10} md={8}>
              <UserInfoBox>
                <OverviewTitle variant="h5" sx= {{ mb: 3 }}>{loading ? <Skeleton width={200} /> : 'Overview'}</OverviewTitle>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography><strong>Biography</strong></Typography>
                        {loading ? (
                          <Skeleton variant="text" width="100%" height={100} />
                        ) : (
                            <Typography variant="body1" textAlign="justify" sx={{ whiteSpace: 'pre-wrap' }}>{profile.biography || `Additional information for ${profile.lastName} is currently unavailable.`}</Typography>
                        )}
                      </Grid>

                      <Grid item xs={10} lg={12}>
                        <Typography><strong>Location</strong></Typography>
                        {loading ? (
                          <Skeleton variant="text" width="100%" />
                        ) : (
                          <Typography variant="body1">{locationDisplay}</Typography>
                        )}
                      </Grid>

                      <Grid item xs={12}>
                        <IconsContainer>
                          {loading ? (
                            <>
                              <Skeleton variant="circular" width={40} height={40} />
                              <Skeleton variant="circular" width={40} height={40} />
                              <Skeleton variant="circular" width={40} height={40} />
                              <Skeleton variant="circular" width={40} height={40} />
                              <Skeleton variant="circular" width={40} height={40} />
                            </>
                          ) : (
                            <>
                              <IconButton href={profile.linkedIn || "#"} target="_blank" disabled={!profile.linkedIn}
                                sx={{ backgroundColor: profile.linkedIn ? '#0A66C2' : '#e0e0e0', color: 'white',
                                  '&:hover': { backgroundColor: profile.linkedIn ? '#004182' : '#e0e0e0' },borderRadius: '50%',
                                }}>
                                <LinkedInIcon />
                              </IconButton>

                              <IconButton href={profile.facebook || "#"} target="_blank" disabled={!profile.facebook}
                                sx={{ backgroundColor: profile.facebook ? '#1877F2' : '#e0e0e0',color: 'white',
                                  '&:hover': { backgroundColor: profile.facebook ? '#0a52cc' : '#e0e0e0' },borderRadius: '50%',
                                }}>
                                <FacebookIcon />
                              </IconButton>

                              <IconButton href={profile.twitter || "#"} target="_blank" disabled={!profile.twitter}
                                sx={{ backgroundColor: profile.twitter ? '#1DA1F2' : '#e0e0e0',color: 'white',
                                  '&:hover': { backgroundColor: profile.twitter ? '#0a8ddb' : '#e0e0e0' },borderRadius: '50%',
                                }}>
                                <TwitterIcon />
                              </IconButton>

                              <IconButton href={profile.instagram || "#"} target="_blank" disabled={!profile.instagram}
                                sx={{ backgroundColor: profile.instagram ? '#E1306C' : '#e0e0e0', color: 'white',
                                  '&:hover': { backgroundColor: profile.instagram ? '#b02e5a' : '#e0e0e0' }, borderRadius: '50%',
                                }}>
                                <InstagramIcon />
                              </IconButton>
                            </>
                          )}
                        </IconsContainer>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </UserInfoBox>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default UserProfileView;