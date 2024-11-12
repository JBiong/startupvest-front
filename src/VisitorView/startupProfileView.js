import React, { useState, useEffect } from 'react';
import { Box, Divider, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Grid, IconButton, Skeleton } from '@mui/material';
import axios from 'axios';
import PaidIcon from '@mui/icons-material/Paid';
import StoreIcon from '@mui/icons-material/Store';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import MonthlyFundingChart from "../Components/Chart";
import { StyledAvatar, OverviewTitle, CardStyled, FundingChartCard, FundingBox, FundingTitle, FundingDescription, FundingNote, IconsContainer} from '../styles/VisitorView';

const drawerWidth = 240;

function StartUpView() {
  const [selectedPage, setSelectedPage] = useState('summary');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [companyId, setCompanyId] = useState(null);
  const { startup } = location.state || {};

  // Fetch the profile picture
  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!startup?.id) return;
      setCompanyId(startup.id);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile-picture/startup/${startup.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          responseType: 'blob',
        });

        const imageUrl = URL.createObjectURL(response.data);
        setAvatarUrl(imageUrl);
      } catch (error) {
        console.error('Failed to fetch profile picture:', error);
      }
      setLoading(false); 
    };

    fetchProfilePicture();
  }, [startup]);

  const handlePageChange = (page) => {
    setSelectedPage(page);
  };

  if (!startup) {
    return <div>No startup data available</div>;
  }

    // Helper function to get only accepted investors
    const getAcceptedInvestors = () => {
      return startup.fundingRounds
        .flatMap(round => round.capTableInvestors)
        .filter(investorDetail => 
          !investorDetail.isDeleted && 
          !investorDetail.investorRemoved &&
          investorDetail.status === 'accepted'
        );
    };
  
    // Calculate total money raised from accepted investments only
    const totalMoneyRaised = startup.fundingRounds
      .flatMap(round => round.capTableInvestors)
      .filter(investorDetail => 
        !investorDetail.isDeleted && 
        !investorDetail.investorRemoved &&
        investorDetail.status === 'accepted'
      )
      .reduce((total, investor) => total + (investor.totalInvestment || 0), 0);
  
    // Get unique accepted investors count
    const uniqueAcceptedInvestorsCount = getAcceptedInvestors()
      .map(investorDetail => investorDetail.investor.id)
      .filter((value, index, self) => self.indexOf(value) === index)
      .length;
  
    // Get lead investor (highest total investment among accepted investors)
    const getLeadInvestor = () => {
      const acceptedInvestors = getAcceptedInvestors();
      if (acceptedInvestors.length === 0) return 'N/A';
  
      const leadInvestor = acceptedInvestors.reduce((prev, current) => {
        return (prev.totalInvestment > current.totalInvestment) ? prev : current;
      }, { totalInvestment: 0 });
  
      return leadInvestor.investor?.firstName 
        ? `${leadInvestor.investor.firstName} ${leadInvestor.investor.lastName}`
        : 'N/A';
    };
  
    // Get repeat investor (investor with multiple accepted investments)
    const getRepeatInvestor = () => {
      const investmentCounts = {};
      const acceptedInvestors = getAcceptedInvestors();
  
      acceptedInvestors.forEach(investorDetail => {
        const investorId = investorDetail.investor.id;
        if (investmentCounts[investorId]) {
          investmentCounts[investorId].count += 1;
          investmentCounts[investorId].investor = investorDetail.investor;
        } else {
          investmentCounts[investorId] = { 
            count: 1, 
            investor: investorDetail.investor 
          };
        }
      });
  
      const repeatInvestors = Object.values(investmentCounts)
        .filter(investor => investor.count > 1)
        .sort((a, b) => b.count - a.count);
  
      return repeatInvestors.length > 0
        ? `${repeatInvestors[0].investor.firstName} ${repeatInvestors[0].investor.lastName}`
        : 'N/A';
    };

  const streetAddress = startup.streetAddress === "N/A" ? "" : startup.streetAddress || "";
  const city = startup.city === "N/A" ? "" : startup.city || "";
  const state = startup.state === "N/A" ? "" : startup.state || "";

  return (
    <Box sx={{ width: '100%', paddingLeft: `${drawerWidth}px`, mt: 5 }}>
      <Navbar />
      <Toolbar />

      <Box display="flex" alignItems="center">
        {loading ? (
          <Skeleton variant="rounded" width={160} height={160} sx={{ ml: 9 }} />
        ) : (
          <StyledAvatar variant="rounded" src={avatarUrl} />
        )}
        {loading ? (
          <Skeleton variant="text" width={250} height={80} sx={{ ml: 4 }} />
        ) : (
          <Typography variant="h4" gutterBottom sx={{ ml: 4 }}>
            {startup.companyName}
          </Typography>
        )}
      </Box>

      <Box display="flex" alignItems="center" justifyContent="flex-end" sx={{ mt: -7 }}>
        <List sx={{ display: 'flex', flexDirection: 'row', mr: 5 }}>
          {loading ? (
            <>
              <Skeleton variant="rectangular" width={150} height={50} sx={{ mr: 1, borderRadius: 1 }} />
              <Skeleton variant="rectangular" width={150} height={50} sx={{ borderRadius: 1 }} />
            </>
          ) : (
            <>
              {/* Summary Button */}
              <ListItem  button  selected={selectedPage === 'summary'} onClick={() => handlePageChange('summary')}
                sx={{ 
                  '&.Mui-selected': { 
                    backgroundColor: '#336FB0', 
                    color: 'white', 
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    }
                  },
                  '&:hover': { 
                    backgroundColor: '#336FB0 !important', 
                    color: 'white', 
                    '& .MuiListItemIcon-root': {
                      color: 'white', 
                    }
                  }, 
                  mr: 1, 
                  borderRadius: 1, 
                  cursor: 'pointer',
                }}>
                <ListItemIcon>
                  <StoreIcon />
                </ListItemIcon>
                <ListItemText primary="Summary" />
              </ListItem>

              {/* Financial Button */}
              <ListItem  button  selected={selectedPage === 'financial'} onClick={() => handlePageChange('financial')}
                sx={{ 
                  '&.Mui-selected': { 
                    backgroundColor: '#336FB0', 
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    }
                  },
                  '&:hover': { 
                    backgroundColor: '#336FB0 !important', 
                    color: 'white', 
                    '& .MuiListItemIcon-root': {
                      color: 'white', 
                    }
                  }, 
                  borderRadius: 1, 
                  cursor: 'pointer',
                }}>
                <ListItemIcon>
                  <PaidIcon />
                </ListItemIcon>
                <ListItemText primary="Financial" />
              </ListItem>
            </>
          )}
        </List>
      </Box>

      <Divider sx={{ mt: 2 }} />

      <Box ml={4} flexGrow={1}>
        {selectedPage === 'summary' && (
          <Box component="main" sx={{ display: 'flex', flexGrow: 1, width: '100%', overflowX: 'hidden' }}>
            <Grid container spacing={2}>
              <Grid item xs={10} md={8}>
                <Box sx={{ display: 'flex', flexDirection: 'column', borderRadius: 2, pl: 5, mt: 5 }}>
                  <OverviewTitle variant="h5" sx={{ mb: 3 }}>{loading? <Skeleton width={100} /> : 'Overview' }</OverviewTitle>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sx={{ textAlign: 'justify' }}>
                          <Typography><strong>Description</strong></Typography>
                            {loading ? (
                              <Skeleton variant="text" width="100%" height={80} />
                            ) : (
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{startup.companyDescription}</Typography>
                            )}
                        </Grid>

                        <Grid item xs={3}>
                          <Typography>
                            <strong>Founded Date</strong>
                          </Typography>
                          {loading ? <Skeleton width={100} /> : <Typography variant="body1">{startup.foundedDate}</Typography>}
                        </Grid>

                        <Grid item xs={3}>
                          <Typography>
                            <strong>Industry</strong>
                          </Typography>
                          {loading ? <Skeleton width={100} /> : <Typography variant="body1">{startup.industry}</Typography>}
                        </Grid>

                        <Grid item xs={3}>
                          <Typography>
                            <strong>Company Type</strong>
                          </Typography>
                          {loading ? <Skeleton width={100} /> : <Typography variant="body1">{startup.typeOfCompany}</Typography>}
                        </Grid>

                        <Grid item xs={3}>
                          <Typography>
                            <strong>No. of Employees</strong>
                          </Typography>
                          {loading ? <Skeleton width={100} /> : <Typography variant="body1">{startup.numberOfEmployees}</Typography>}
                        </Grid>

                        <Grid item xs={8}>
                          <Typography>
                            <strong>Location</strong>
                          </Typography>
                          {loading ? <Skeleton width={100} /> : <Typography variant="body1">{startup.locationName || "Location not available"}</Typography>}
                        </Grid>

                        {/* Icons */}
                        <Grid item xs={12}>
                          <IconsContainer>
                            {loading ? (
                              <Skeleton variant="circular" width={40} height={40} />
                            ) : (
                              <IconButton href={startup.website || "#"} target="_blank" disabled={!startup.website}
                                sx={{ backgroundColor: startup.website ? '#007bff' : '#e0e0e0', color: 'white', '&:hover': { backgroundColor: startup.website ? '#0069d9' : '#e0e0e0' }, borderRadius: '50%', }}>
                                <LanguageIcon />
                              </IconButton>
                            )}

                            {loading ? (
                              <Skeleton variant="circular" width={40} height={40} />
                            ) : (
                              <IconButton href={startup.linkedIn || "#"} target="_blank" disabled={!startup.linkedIn}
                                sx={{ backgroundColor: startup.linkedIn ? '#0A66C2' : '#e0e0e0', color: 'white', '&:hover': { backgroundColor: startup.linkedIn ? '#004182' : '#e0e0e0' }, borderRadius: '50%', }}>
                                <LinkedInIcon />
                              </IconButton>
                            )}

                            {loading ? (
                              <Skeleton variant="circular" width={40} height={40} />
                            ) : (
                              <IconButton href={startup.facebook || "#"} target="_blank" disabled={!startup.facebook}
                                sx={{ backgroundColor: startup.facebook ? '#1877F2' : '#e0e0e0', color: 'white', '&:hover': { backgroundColor: startup.facebook ? '#0a52cc' : '#e0e0e0' }, borderRadius: '50%', }}>
                                <FacebookIcon />
                              </IconButton>
                            )}

                            {loading ? (
                              <Skeleton variant="circular" width={40} height={40} />
                            ) : (
                              <IconButton href={startup.twitter || "#"} target="_blank" disabled={!startup.twitter}
                                sx={{ backgroundColor: startup.twitter ? '#1DA1F2' : '#e0e0e0', color: 'white', '&:hover': { backgroundColor: startup.twitter ? '#0c85d0' : '#e0e0e0' }, borderRadius: '50%', }}>
                                <TwitterIcon />
                              </IconButton>
                            )}

                            {loading ? (
                              <Skeleton variant="circular" width={40} height={40} />
                            ) : (
                              <IconButton href={startup.instagram || "#"} target="_blank" disabled={!startup.instagram}
                                sx={{ backgroundColor: startup.instagram ? '#C13584' : '#e0e0e0', color: 'white', '&:hover': { backgroundColor: startup.instagram ? '#aa1d68' : '#e0e0e0' }, borderRadius: '50%', }}>
                                <InstagramIcon />
                              </IconButton>
                            )}
                          </IconsContainer>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {selectedPage === 'financial' && (
          <Box component="main" sx={{ display: 'flex', flexGrow: 1, width: '100%', overflowX: 'hidden', pl: 3, pr: 5, pt: 3, pb: 3, }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FundingBox>
                  {/* Total Investment Card */}
                  <CardStyled>
                    <FundingTitle>Total Investment</FundingTitle>

                    <Divider sx={{ mb: 2 }} />

                    <FundingDescription>Total Funds Raised: <strong>{startup.fundingRounds.length > 0 ? <span>{startup.fundingRounds[0].moneyRaisedCurrency} {totalMoneyRaised.toLocaleString()}</span> : <span>None</span>}</strong></FundingDescription>
                    <FundingNote>*Funds raised through various funding rounds.</FundingNote>
                  </CardStyled>

                  {/* Number of Funding Rounds Card */}
                  <CardStyled>
                    <FundingTitle>Funding Rounds</FundingTitle>
                    <Divider sx={{ mb: 2 }} />
                    <FundingDescription>Total Number of Rounds: <strong>{startup.fundingRounds.filter(round => !round.isDeleted).length}</strong></FundingDescription>
                    <FundingNote>*Includes all funding rounds since inception.</FundingNote>
                  </CardStyled>

                  {/* Investors Card */}
                  <CardStyled>
                    <FundingTitle>Investors</FundingTitle>
                    <Divider sx={{ mb: 2, }} />
                    <FundingDescription>Total Number of Investors: <strong>{uniqueAcceptedInvestorsCount}</strong></FundingDescription>
                    <FundingNote>*Includes all investors from every funding round since inception.</FundingNote>
                  </CardStyled>
                </FundingBox>
              </Grid>

              {/* Graph Section */}
              <Grid item xs={12} md={8}>
                <FundingChartCard>
                  <FundingTitle>Funding Progress Chart</FundingTitle>
                  <Box sx={{ width: '100%' }}>
                    {companyId && <MonthlyFundingChart companyId={companyId} />}
                  </Box>
                </FundingChartCard>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default StartUpView;