import React, { useState, useEffect } from 'react';
import { Avatar, Box, Divider, Toolbar, Typography, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, DialogActions, FormControl, TablePagination } from '@mui/material';
import StarsIcon from '@mui/icons-material/Stars';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';

const drawerWidth = 240;

function FundingRoundView() {
  const [isFollowed, setIsFollowed] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const location = useLocation();
  const { fundinground } = location.state || {};  

  console.log('Funding Round Data:', fundinground); 

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!fundinground?.startupId) {
        console.error('startupId is undefined');
        setAvatarUrl('path/to/default/image.png'); // Set a fallback image
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/profile-picture/startup/${fundinground.startupId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            responseType: 'blob',
          }
        );

        const imageUrl = URL.createObjectURL(response.data);
        setAvatarUrl(imageUrl);

        // Cleanup function to revoke URL
        return () => {
          URL.revokeObjectURL(imageUrl);
        };
      } catch (error) {
        console.error('Failed to fetch profile picture:', error.message);
        setAvatarUrl('path/to/default/image.png');
      }
    };

    fetchProfilePicture();
  }, [fundinground]);

  const handleFollowToggle = () => {
    setIsFollowed(!isFollowed);
  };

  if (!fundinground) {
    return <div>No funding round data available</div>;
  }

  console.log('Startup ID:', fundinground.startupId);

  return (
    <>
      <Navbar />
      <Toolbar />

      <Box sx={{ width: '100%', paddingLeft: `${drawerWidth}px`, mt: 5 }}>
        <Box display="flex" alignItems="center">
          <Box mr={4}>
          <Avatar
              variant="rounded"
              src={avatarUrl || 'path/to/default/image.png'} // Ensure fallback image path is correct
              sx={{
                width: 150,
                height: 150,
                border: '5px solid rgba(0, 116, 144, 1)',
                borderRadius: 3,
                ml: 8,
              }}
            />
          </Box>
          <Typography variant="h4" gutterBottom>{fundinground.fundingType} - {fundinground.startupName}</Typography>
          <StarsIcon sx={{ cursor: 'pointer', ml: 1, mt: -1, color: isFollowed ? 'rgba(0, 116, 144, 1)' : 'inherit' }} onClick={handleFollowToggle} />
        </Box>

        <Divider sx={{ mt: 5 }} />

        <Box component="main" sx={{ display: 'flex', flexGrow: 1, p: 4, width: '100%', overflowX: 'hidden' }}>
          <Grid container spacing={2}>
            {/* Left Box. Investor Information */}
            <Grid item xs={12} md={8}>
              <Box sx={{ background: 'white', display: 'flex', flexDirection: 'column', borderRadius: 2, pb: 3, pl: 5, pr: 5 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'rgba(0, 116, 144, 1)', mb: 2 }}>Overview</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                    <Grid item xs={12}>
                    <Typography variant="body1">
                      To invest in our company, a minimum purchase of {fundinground.moneyRaisedCurrency} {parseInt(fundinground.minimumShare, 10).toLocaleString()} shares 
                      is required. This ensures a meaningful investment and supports our long-term growth.
                      <br /><br />
                      For more information, please contact us.
                    </Typography>
                      </Grid>

                      <Grid item xs={4}>
                        <Typography><strong>StartUp Name</strong></Typography>
                        <Typography variant="body1">{fundinground.startupName}</Typography>
                      </Grid>

                      <Grid item xs={4}>
                        <Typography><strong>Announced Date</strong></Typography>
                        <Typography variant="body1">{fundinground.announcedDate}</Typography>
                      </Grid>

                      <Grid item xs={4}>
                        <Typography><strong>Closed on Date</strong></Typography>
                        <Typography variant="body1">{fundinground.closedDate}</Typography>
                      </Grid>

                      <Grid item xs={4}>
                        <Typography><strong>Funding Type</strong></Typography>
                        <Typography variant="body1">{fundinground.fundingType}</Typography>
                      </Grid>

                      <Grid item xs={4}>
                        <Typography><strong>Money Raised</strong></Typography>
                        {fundinground.moneyRaisedCurrency} {fundinground.moneyRaised ? Number(fundinground.moneyRaised).toLocaleString() : 'N/A'}
                      </Grid>

                      <Grid item xs={4}>
                        <Typography><strong>Pre-Money Valuation</strong></Typography>
                        <Typography variant="body1">
                        {fundinground.moneyRaisedCurrency} {fundinground.preMoneyValuation ? Number(fundinground.preMoneyValuation).toLocaleString() : 'N/A'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Divider sx={{ mt: 5, mb: 3 }} />

                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'rgba(0, 116, 144, 1)', }}>Investors</Typography>
                <TableContainer component={Box} sx={{ mt: 2, backgroundColor: 'white'}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>Investor Name</TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>Title</TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>Share</TableCell>
                            </TableRow>
                        </TableHead>
                        
                        <TableBody>
                      {/* Loop through each capTableInvestor */}
                      {fundinground.capTableInvestors && fundinground.capTableInvestors.map((investorDetail, index) => {
                        const investor = investorDetail.investor || {};
                        return (
                          <TableRow key={index}>
                            <TableCell sx={{ textAlign: 'center' }}>
                              {investor.firstName || 
                                fundinground.capTableInvestors[0]?.investorDetails.firstName || 
                                'N/A'} {investor.lastName || 
                                fundinground.capTableInvestors[0]?.investorDetails.lastName || 
                                'N/A'}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>{investorDetail.title || 'N/A'}</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              {Number(investorDetail.shares || 0).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                    </Table>
                </TableContainer>
                    
                {/* <TablePagination
                    rowsPerPageOptions={[3]}
                    component="div"
                    count={businessProfiles.length}
                    rowsPerPage={businessRowsPerPage}
                    page={businessPage}
                    onPageChange={handleBusinessPageChange}
                    onRowsPerPageChange={handleBusinessRowsPerPageChange}/> */}
                </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default FundingRoundView;
