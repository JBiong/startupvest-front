import React, { useState, useEffect } from 'react';
import { Typography, Toolbar, Grid, Box, Tabs, Tab, Skeleton } from "@mui/material";
import Navbar from "../Navbar/Navbar";
import InvestmentTable from '../Tables/InvestorMyInvestments';
import InvestorRequest from '../Tables/InvestorMyRequests';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TopInfoBox, TopInfoText, TopInfoTitle } from '../styles/StartupDashboard';

const drawerWidth = 285;

function createData(id, fundingName, startupName, fundingType, moneyRaised, moneyRaisedCurrency,
  announcedDate, closedDate, avatar, preMoneyValuation, capTableInvestors, minimumShare, startupId, totalShares, targetFunding) {
  return {
    id,
    fundingName,
    startupName,
    fundingType,
    moneyRaised,
    moneyRaisedCurrency,
    announcedDate,
    closedDate,
    avatar,
    preMoneyValuation,
    capTableInvestors,
    minimumShare,
    startupId,
    totalShares,
    targetFunding
  };
}

const InvestorDashboard = () => {
  const userId = localStorage.getItem('userId');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [investmentCount, setInvestmentCount] = useState(0);

  const [userData, setUserData] = useState(null);
  const [profilePictures, setProfilePictures] = useState({});
  const [topInvestedCompany, setTopInvestedCompany] = useState('None');
  const [averageInvestmentSize, setAverageInvestmentSize] = useState(0);
  const [totalInvestmentAmount, setTotalInvestmentAmount] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  const conversionRates = {
    USD: 50.0,
    PHP: 1
  };

  const handleChangeTab = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    document.body.style.backgroundColor = "#f5f5f5";

    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchFundingRounds = async () => {
      if (!userData?.id) return;

      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/funding-rounds/all`);
        const fetchedRows = response.data.map(fundingRound => createData(
          fundingRound.id,
          fundingRound.fundingName || 'N/A',
          fundingRound.startup?.companyName ?? 'N/A',
          fundingRound.fundingType || 'N/A',
          fundingRound.moneyRaised || '---',
          fundingRound.moneyRaisedCurrency || 'USD',
          fundingRound.announcedDate ? new Date(fundingRound.announcedDate).toLocaleDateString() : 'N/A',
          fundingRound.closedDate ? new Date(fundingRound.closedDate).toLocaleDateString() : 'N/A',
          fundingRound.avatar || '',
          fundingRound.preMoneyValuation || 'N/A',
          fundingRound.capTableInvestors || [],
          fundingRound.minimumShare || 'N/A',
          fundingRound.startup?.id || null,
          fundingRound.totalShares || 0,
          fundingRound.targetFunding || '---',
        ));

        setRows(fetchedRows);
        const acceptedRows = filterAcceptedInvestments(fetchedRows, userData.id);
        setFilteredRows(acceptedRows);
        await fetchAllProfilePictures(acceptedRows);
      } catch (error) {
        console.error('Error fetching funding rounds:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userData && userData.id) {
      fetchFundingRounds();
    }
  }, [userData]);

  const filterAcceptedInvestments = (allRows, userId) => {
    return allRows
      .map(row => ({
        ...row,
        capTableInvestors: row.capTableInvestors.filter(investor => 
          investor.status === 'accepted' && investor.investor?.id === userId && !investor.investorRemoved
        ),
      }))
      .filter(row => row.capTableInvestors.length > 0); // Only keep rows with accepted investors
  };
  
  useEffect(() => {
    if (filteredRows.length > 0) {
      const investmentTotals = {};
      let totalInvestmentPHP = 0;
      let totalInvestments = 0;
      let actualInvestmentCount = 0;
  
      filteredRows.forEach(row => {
        row.capTableInvestors.forEach(investor => {
          const investmentValue = investor.totalInvestment || 0;
          const investmentValuePHP = investmentValue * (conversionRates[row.moneyRaisedCurrency] || 1);
  
          totalInvestmentPHP += investmentValuePHP;
          totalInvestments++;
          actualInvestmentCount++;
  
          if (!investmentTotals[row.startupName]) {
            investmentTotals[row.startupName] = 0;
          }
          investmentTotals[row.startupName] += investmentValuePHP;
        });
      });
  
      // Find top company based on investment totals
      const topCompany = Object.entries(investmentTotals).reduce(
        (a, b) => (a[1] > b[1] ? a : b), ['None', 0]
      )[0];
  
      setTopInvestedCompany(topCompany);
      setTotalInvestmentAmount(totalInvestmentPHP);
      const averageInvestmentPHP = totalInvestments > 0 ? totalInvestmentPHP / totalInvestments : 0;
      setAverageInvestmentSize(averageInvestmentPHP);
      setInvestmentCount(actualInvestmentCount);
    } else {
      // Reset to defaults if no investments
      setTopInvestedCompany('None');
      setTotalInvestmentAmount(0);
      setAverageInvestmentSize(0);
      setInvestmentCount(0);
    }
  }, [filteredRows]);
  
  const fetchAllProfilePictures = async (fundingRounds) => {
    const pictures = {};
    await Promise.all(
      fundingRounds.map(async (fundingRound) => {
        const startupId = fundingRound.startupId;
        if (!startupId) return;

        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile-picture/startup/${startupId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            responseType: 'blob',
          });
          const imageUrl = URL.createObjectURL(response.data);
          pictures[startupId] = imageUrl;
        } catch (error) {
          console.error(`Failed to fetch profile picture for startup ID ${startupId}:`, error);
        }
      })
    );
    setProfilePictures(pictures);
  };

  const handleRowClick = (fundinground) => {
    navigate(`/fundingroundview`, { state: { fundinground } });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Navbar />
      <Toolbar />

      <Grid container spacing={2} sx={{ paddingLeft: `${drawerWidth}px`, pt: 8, pr: 6 }}>
        <Grid item xs={12}>
          {loading ? (
            <Skeleton variant="text" width={200} height={40} />
          ) : (
            <Typography variant="h5" color='#232023'>
              Investor Dashboard
            </Typography>
          )}
        </Grid>

        <Grid item xs={12} sm={3}>
          {loading ? (
            <Skeleton variant="rectangular" width="100%" height={80} />
          ) : (
            <TopInfoBox>
              <TopInfoText>Top Company Invested</TopInfoText>
              <TopInfoTitle>{topInvestedCompany}</TopInfoTitle>
            </TopInfoBox>
          )}
        </Grid>

        <Grid item xs={12} sm={3}>
          {loading ? (
            <Skeleton variant="rectangular" width="100%" height={80} />
          ) : (
            <TopInfoBox>
              <TopInfoText>Investment Count</TopInfoText>
              <TopInfoTitle>{investmentCount}</TopInfoTitle>
            </TopInfoBox>
          )}
        </Grid>

        <Grid item xs={12} sm={3}>
          {loading ? (
            <Skeleton variant="rectangular" width="100%" height={80} />
          ) : (
            <TopInfoBox>
              <TopInfoText>Average Investment Size</TopInfoText>
              <TopInfoTitle>{averageInvestmentSize.toLocaleString('en-PH', { maximumFractionDigits: 2 })}</TopInfoTitle>
            </TopInfoBox>
          )}
        </Grid>

        <Grid item xs={12} sm={3}>
          {loading ? (
            <Skeleton variant="rectangular" width="100%" height={80} />
          ) : (
            <TopInfoBox>
              <TopInfoText>Total Investment Amount</TopInfoText>
              <TopInfoTitle>{totalInvestmentAmount.toLocaleString('en-PH', { maximumFractionDigits: 2 })}</TopInfoTitle>
            </TopInfoBox>
          )}
        </Grid>
      </Grid>

      {/* Tabs Section */}
      <Box sx={{ width: '100%', pl: '285px', pr: '50px', pt: 3 }}>
      {loading ? (
          <Skeleton variant="rectangular" width="100%" height={50} sx={{ mb: 3 }} />
        ) : (
          <Tabs value={tabIndex} onChange={handleChangeTab} aria-label="Investor Profile Tabs" TabIndicatorProps={{ style: { backgroundColor: '#004A98' } }}>
            <Tab label={`Pending Request (${pendingRequestsCount})`}
                sx={{ color: tabIndex === 0 ? "#1E1E1E" : "text.secondary", "&.Mui-selected": { color: "#1E1E1E", }, }} />
            <Tab label="My Investments"
                sx={{ color: tabIndex === 1 ? "#1E1E1E" : "text.secondary", "&.Mui-selected": { color: "#1E1E1E", }, }} />
          </Tabs>
        )}

        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={300} />
        ) : tabIndex === 0 ? (
          <InvestorRequest onPendingRequestsCountChange={setPendingRequestsCount} />
        ) : (
          <InvestmentTable  filteredRows={filteredRows} page={page} rowsPerPage={rowsPerPage} handleRowClick={handleRowClick} 
            profilePictures={profilePictures} handleChangePage={handleChangePage} />
        )}
      </Box>
    </Box>
  );
};

export default InvestorDashboard;