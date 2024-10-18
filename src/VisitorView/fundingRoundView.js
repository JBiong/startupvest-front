import React, { useState, useEffect } from 'react';
import { Box, Divider, Toolbar, Typography, Grid, Button, Pagination, PaginationItem, TableRow, TableBody, TableCell, Skeleton, Tooltip } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InvestNowDialog from '../Dialogs/InvestNowDialog';
import { useAuth } from '../Context/AuthContext';

import { StyledAvatar, OverviewBox, OverviewTitle, StyledTable, StyledTableHead, StyledTableCell, PaginationBox, InvestorTitle } from '../styles/VisitorView';

const drawerWidth = 240;

function FundingRoundView() {
  const { role } = useAuth();

  const [avatarUrl, setAvatarUrl] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { fundinground } = location.state || {};

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!fundinground?.startupId) {
        console.error('startupId is undefined');
        setAvatarUrl('path/to/default/image.png');
        setLoading(false); 
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/profile-picture/startup/${fundinground.startupId}`,
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
      } finally {
        setLoading(false);
      }
    };

    fetchProfilePicture();
  }, [fundinground]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (!fundinground) {
    return <div>No funding round data available</div>;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const combineInvestors = (investors) => {
    const combinedInvestors = {};
    
    investors.forEach((investorDetail) => {
      const investor = investorDetail.investor || {};
      if (investor.isDeleted || investorDetail.investorRemoved) return;

      const fullName = `${investor.firstName || ''} ${investor.lastName || ''}`.trim();
      
      if (fullName in combinedInvestors) {
        combinedInvestors[fullName].shares += Number(investorDetail.shares || 0);
        combinedInvestors[fullName].totalInvestment += Number(investorDetail.totalInvestment || 0);
      } else {
        combinedInvestors[fullName] = {
          name: fullName,
          title: investorDetail.title || 'N/A',
          shares: Number(investorDetail.shares || 0),
          totalInvestment: Number(investorDetail.totalInvestment || 0),
        };
      }
    });

    return Object.values(combinedInvestors);
  };

  const isFundingRoundClosed = () => {
    const currentDate = new Date();
    const closedDate = new Date(fundinground.closedDate);
    const isClosed = closedDate < currentDate || fundinground.moneyRaised > fundinground.targetFunding;

    return isClosed;
  };

  return (
    <>
      <Navbar />
      <Toolbar />

      <Box sx={{ width: '100%', paddingLeft: `${drawerWidth}px`, mt: 5 }}>
        <Grid container alignItems="center">
          <Grid item mr={4}>
            {loading ? (
              <Skeleton variant="rounded" width={160} height={160} sx={{ ml: 9 }} />
            ) : (
              <StyledAvatar variant="rounded" src={avatarUrl || 'path/to/default/image.png'} />
            )}
          </Grid>

          <Grid item>
            {loading ? (
              <Skeleton variant="text" width={300} height={60} />
            ) : (
              <Typography variant="h4" gutterBottom>
                {fundinground.fundingType} - {fundinground.startupName}
              </Typography>
            )}

            {loading ? (
              <Skeleton variant="rectangular" width={150} height={40} />
            ) : role === 'Investor' ? (
              isFundingRoundClosed() ? (
                <Tooltip title="This funding round has been closed." arrow>
                  <span>
                    <Button variant="outlined" sx={{ width: '150px' }} disabled>Invest Now</Button>
                  </span>
                </Tooltip>
              ) : (
                <Button variant="outlined" sx={{ width: '150px' }}
                  onClick={handleOpenDialog}>
                  Invest Now
                </Button>
              )
            ) : null}
          </Grid>
        </Grid>

        <Divider sx={{ mt: 2 }} />

        <Box component="main" sx={{ display: 'flex', flexGrow: 1, p: 4, width: '100%', overflowX: 'hidden' }}>
          <Grid container spacing={2}>
            {/* Left Box. Investor Information */}
            <Grid item xs={10} md={10}>
              <OverviewBox>
              < OverviewTitle variant="h5" sx={{ mb: 3 }}>{loading? <Skeleton width={100} /> : 'Overview' }</OverviewTitle>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        {loading ? (
                          <Skeleton variant="text" height={100} />
                        ) : (
                          <Typography variant="body1" textAlign="justify">
                            To invest in our company, we require a minimum purchase of{' '}
                            <b>
                              {fundinground.moneyRaisedCurrency}
                              {parseInt(fundinground.minimumShare, 10).toLocaleString()}
                            </b>{' '}
                            worth of shares. This ensures a significant commitment to our long-term growth and aligns investors with our strategic goals. By setting this threshold, we aim to attract serious investors who are dedicated to supporting our vision and contributing to our future success. We appreciate your consideration in joining us on this journey.
                            <br />
                            <br />
                            For more information, please contact us.
                          </Typography>
                        )}
                      </Grid>

                      <Grid item xs={3}>
                        {loading ? (
                          <Skeleton variant="text" />
                        ) : (
                          <Box>
                            <Typography>
                              <strong>Funding Name</strong>
                            </Typography>
                            <Typography variant="body1">{fundinground.fundingName}</Typography>
                          </Box>
                        )}
                      </Grid>

                      <Grid item xs={3}>
                        {loading ? (
                          <Skeleton variant="text" />
                        ) : (
                          <Box>
                            <Typography>
                              <strong>Funding Type</strong>
                            </Typography>
                            <Typography variant="body1">{fundinground.fundingType}</Typography>
                          </Box>
                        )}
                      </Grid>

                      <Grid item xs={3}>
                        {loading ? (
                          <Skeleton variant="text" />
                        ) : (
                          <Box>
                            <Typography>
                              <strong>Announced Date</strong>
                            </Typography>
                            <Typography variant="body1">{formatDate(fundinground.announcedDate)}</Typography>
                          </Box>
                        )}
                      </Grid>

                      <Grid item xs={3}>
                        {loading ? (
                          <Skeleton variant="text" />
                        ) : (
                          <Box>
                            <Typography>
                              <strong>Closed on Date</strong>
                            </Typography>
                            <Typography variant="body1">{formatDate(fundinground.closedDate)}</Typography>
                          </Box>
                        )}
                      </Grid>

                      {/* Additional Information */}
                      <Grid item xs={3}>
                        {loading ? (
                          <Skeleton variant="text" />
                        ) : (
                          <Box>
                            <Typography>
                              <strong>Target Funding</strong>
                            </Typography>
                            <Typography variant="body1">
                              {fundinground.moneyRaisedCurrency}{' '}
                              {fundinground.targetFunding
                                ? Number(fundinground.targetFunding).toLocaleString()
                                : 'N/A'}
                            </Typography>
                          </Box>
                        )}
                      </Grid>

                      <Grid item xs={3}>
                        {loading ? (
                          <Skeleton variant="text" />
                        ) : (
                          <Box>
                            <Typography>
                              <strong>Money Raised</strong>
                            </Typography>
                            <Typography variant="body1">
                              {fundinground.moneyRaisedCurrency}{' '}
                              {fundinground.moneyRaised
                                ? Number(fundinground.moneyRaised).toLocaleString()
                                : 'N/A'}
                            </Typography>
                          </Box>
                        )}
                      </Grid>

                      <Grid item xs={4}>
                        {loading ? (
                          <Skeleton variant="text" />
                        ) : (
                          <Box>
                            <Typography>
                              <strong>Pre-Money Valuation</strong>
                            </Typography>
                            <Typography variant="body1">
                              {fundinground.moneyRaisedCurrency}{' '}
                              {fundinground.preMoneyValuation
                                ? Number(fundinground.preMoneyValuation).toLocaleString()
                                : 'N/A'}
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Divider sx={{ mt: 5 }} />

                <InvestorTitle variant="h5" sx={{ mt: 5, mb: 3 }}>{loading? <Skeleton width={100} /> : 'Investors' }</InvestorTitle>
                <StyledTable>
                  <StyledTableHead>
                    <TableRow>
                      <StyledTableCell>Investor Name</StyledTableCell>
                      <StyledTableCell>Title</StyledTableCell>
                      <StyledTableCell>Share</StyledTableCell>
                      <StyledTableCell>Total Share</StyledTableCell>
                    </TableRow>
                  </StyledTableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Skeleton variant="text" />
                        </TableCell>
                      </TableRow>
                    ) : (
                      combineInvestors(fundinground.capTableInvestors)
                        .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                        .map((investor, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ textAlign: 'center' }}>
                              {investor.name}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              {investor.title}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              {Number(investor.shares).toLocaleString()}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              {fundinground.moneyRaisedCurrency}{' '}
                              {Number(investor.totalInvestment).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </StyledTable>

                {fundinground.capTableInvestors && fundinground.capTableInvestors.length > rowsPerPage && (
                  <PaginationBox>
                    <Pagination count={Math.ceil(fundinground.capTableInvestors.length / rowsPerPage)} page={currentPage}
                      onChange={handlePageChange}
                      renderItem={(item) => (
                        <PaginationItem
                          slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                          {...item}/>
                      )}/>
                  </PaginationBox>
                )}
              </OverviewBox>
            </Grid>
          </Grid>
        </Box>

        {/* Invest Now Dialog */}
        <InvestNowDialog open={openDialog} onClose={handleCloseDialog} pricePerShare={fundinground.minimumShare} companyName={fundinground.startupName}
          fundingRound={fundinground.fundingType} fundingRoundId={fundinground.id} investorId={localStorage.getItem('userId')}/>
      </Box>
    </>
  );
}

export default FundingRoundView;