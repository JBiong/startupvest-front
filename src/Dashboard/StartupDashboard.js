import { useEffect, useState } from "react";
import axios from "axios";
import Joyride from 'react-joyride';
import { Box, Typography, Toolbar, Grid, Menu, MenuItem, Tabs, Tab, ListItemText, ListItem, Button, Divider, Skeleton, Tooltip } from "@mui/material";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { History, AddCircle, MonetizationOnRounded, Person2, Business } from '@mui/icons-material';

import Navbar from "../Navbar/Navbar";
import CreateFundingRoundDialog from "../Dialogs/CreateFundingRoundDialog";
import CreateBusinessProfileDialog from "../Dialogs/CreateBusinessProfileDialog";
import ConfirmCancelDialog from '../Dialogs/ConfirmCancelDialog';
import BusinessProfileTable from "../Tables/BusinessProfileTable";
import FundingRoundTable from "../Tables/FundingRoundTable";
import PendingRequestInvestor from "../Tables/PendingRequestInvestorTable";
import CapTable from "../Tables/CapTableTable";
import ActivitiesDialog from "../Dialogs/AcitivtiesDialog";

import { logActivity } from '../utils/activityUtils';
import MonthlyFundingChart from "../Components/Chart";

import { Container, HeaderBox, RecentActivityBox, RecentActivityList, TopInfoBox, TopInfoIcon, TopInfoText, TopInfoTitle,   CreateButton, GraphTitle, RecentActivityTitle } from "../styles/StartupDashboard";

function StartupDashboard() {
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [joyrideRun, setJoyrideRun] = useState(false);
    const [joyrideFinished, setJoyrideFinished] = useState(false);
    const [steps, setSteps] = useState([]);
        
    // PROFILE
    const [businessProfiles, setBusinessProfiles] = useState([]);
    const [createBusinessProfile, setCreateBusinessProfile] = useState(false);
    const [selectedBusinessProfile, setSelectedBusinessProfile] = useState(null);
    const [openViewStartup, setOpenViewStartup] = useState(false);
    const [openViewInvestor, setOpenViewInvestor] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [profileToDelete, setProfileToDelete] = useState(null);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [profileToCancel, setProfileToCancel] = useState(null); 

    // FUNDING ROUND
    const [openCreateFundingRound, setOpenCreateFundingRound] = useState(false);
    const [fundingRounds, setFundingRounds] = useState([]);
    const [selectedFundingRoundDetails, setSelectedFundingRoundDetails] = useState(null);
    const [openViewFundingRound, setOpenViewFundingRound] = useState(false);
    const [filteredFundingRounds, setFilteredFundingRounds] = useState([]);

    // CAP TABLE
    const [selectedStartupCapTable, setSelectedStartupCapTable] = useState("Select Company");
    const [capTables, setCapTables] = useState([]);
    const [filteredCapTables, setFilteredCapTables] = useState([]);
    const fundingRound = fundingRounds.length > 0 ? fundingRounds[0] : null;

    // COUNTS
    const [companyCount, setCompanyCount] = useState(0);
    const [investorCount, setInvestorCount] = useState(0);
    const [totalAmountFunded, setTotalAmountFunded] = useState(0);
    const [fundingRoundsCount, setFundingRoundsCount] = useState(0);
    const [moneyRaisedCount, setMoneyRaisedCount] = useState(0);
    const [highestMoneyRaisedCompany, setHighestMoneyRaisedCompany] = useState({ companyName: '', totalMoneyRaised: 0 });
    const [topInvestor, setTopInvestor] = useState({ topInvestorName: '' });
    const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [recentActivities, setRecentActivities] = useState([]);
    const [userId, setUserId] = useState(null);

    const handleViewHistoryClick = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
    
            try {
                await Promise.all([
                    fetchBusinessProfiles(),
                    fetchFundingRounds(),
                    fetchAllInvestorsByEachUsersCompany(),
                    fetchRecentActivities(),
                    fetchCountInvestor(),
                    fetchTopInvestorContributor(),
                ]);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
                handleCompanyCount();
            }
        };
    
        const handleCompanyCount = () => {
            if (companyCount === 0) {
                setCreateBusinessProfile(true);
                setJoyrideRun(true);
            } else {
                setJoyrideFinished(true);
                setCreateBusinessProfile(false);
            }
        };
    
        fetchData();
    
    }, [companyCount]);
    

    const handleJoyrideCallback = (data) => {
        if (data.status === 'finished' || data.status === 'skipped') {
            setJoyrideFinished(true); 
        }
    };
    
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // PROFILE
    const handleOpenBusinessProfile = () => {
        setCreateBusinessProfile(true);
    };
    
    const handleCloseBusinessProfile = async () => {
        setCreateBusinessProfile(false);
        await fetchBusinessProfiles();
        await fetchRecentActivities();
    };

    const handleOpenStartUp = (profile) => {
        setSelectedBusinessProfile(profile);
        setOpenViewStartup(true);
    };

    const handleCloseStartUp = async () => {
        setOpenViewStartup(false);
        await fetchBusinessProfiles();
    };  

    const handleOpenInvestor = (profile) => {
        setSelectedBusinessProfile(profile);
        setOpenViewInvestor(true);
    };

    const handleCloseInvestor = () => {
        setOpenViewInvestor(false);
    };

    const handleOpenDeleteDialog = (profile) => {
        setProfileToDelete(profile);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = async () => {
        setOpenDeleteDialog(false);
    };

    const handleOpenCancelDialog = (profile) => {
        setProfileToCancel(profile);
        setOpenCancelDialog(true);
      };
      
      const handleCloseCancelDialog = () => {
        setOpenCancelDialog(false);
        setProfileToCancel(null);
      };

    const fetchRecentActivities = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/activities`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.status === 200) {
                setRecentActivities(response.data);
            } else {
                console.error('Error fetching recent activities:', response.data);
            }
        } catch (error) {
            console.error('Error fetching recent activities:', error);
        }
    };

    const fetchBusinessProfiles = async () => {
        try {
            const [responseStartups, responseInvestors] = await Promise.all([
                axios.get(`${process.env.REACT_APP_API_URL}/startups`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }),
                axios.get(`${process.env.REACT_APP_API_URL}/investors`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })
            ]);
    
            const fetchProfilePicture = async (id, type) => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile-picture/${type}/${id}`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                        responseType: 'blob',
                    });
                    return URL.createObjectURL(response.data);
                } catch (error) {
                    console.error(`Failed to fetch profile picture for ${type} ID ${id}:`, error);
                    return null;
                }
            };
    
            const startups = await Promise.all(responseStartups.data
                .filter((profile) => !profile.isDeleted)
                .map(async (profile) => ({
                    ...profile,
                    type: "Startup",
                    photo: await fetchProfilePicture(profile.id, 'startup')
                })));

            const approvedStartups = startups.filter(profile => profile.status === 'approved');
            setCompanyCount(approvedStartups.length);
    
            const investors = await Promise.all(responseInvestors.data
                .filter((profile) => !profile.isDeleted)
                .map(async (profile) => ({
                    ...profile,
                    type: "Investor",
                    photo: await fetchProfilePicture(profile.id, 'investor')
                })));

                
    
            const allProfiles = [...investors, ...startups];
            const sortedProfiles = allProfiles.sort((a, b) => {
                if (a.status === 'approved' && b.status !== 'approved') return -1;
                if (b.status === 'approved' && a.status !== 'approved') return 1;
                return 0;
            });

            setBusinessProfiles(sortedProfiles);
            return sortedProfiles;
        } catch (error) {
            console.error('Failed to fetch business profiles:', error);
        }
    };

    const handleSoftDelete = async () => {
        if (!profileToDelete) {
            console.error("No profile selected");
            return;
        }

        try {
            const endpoint = `${process.env.REACT_APP_API_URL}/startups/${profileToDelete.id}/delete`;

            await axios.put(endpoint, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            await fetchBusinessProfiles();

            // Log recent activity
            const companyName = profileToDelete.companyName || 'Unknown Company';
            await logActivity(
                `${companyName} profile has been deleted.`,
                'Startup profile removed successfully.',
                fetchRecentActivities
            );

        } catch (error) {
            console.error('Failed to delete profile:', error);
        }
    };

    const handleCancelStartup = async (startupId) => {
        try {
          await axios.put(
            `${process.env.REACT_APP_API_URL}/startups/${startupId}/cancel`,
            {},
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
    
          await fetchBusinessProfiles();

        } catch (error) {
          console.error("Error cancelling startup:", error);
        }
      };
      
      const handleConfirmCancel = async () => {
        if (profileToCancel) {
          await handleCancelStartup(profileToCancel.id);
          handleCloseCancelDialog();
        }
      };
    
    // FUNDING ROUND
    const handleOpenFundingRound = () => {
        setOpenCreateFundingRound(true);
    };

    const handleCloseFundingRound = async () => {
        setOpenCreateFundingRound(false);
        await fetchFundingRounds();
        await fetchRecentActivities();
    };    

    const handleCloseFundingProfile = () => {
        setOpenViewFundingRound(false);
        fetchFundingRounds();
    }

    const handleTotalAmountFundedChange = (total) => {
        setTotalAmountFunded(total);
    };

    const handleFundingRoundsCountChange = (count) => {
        setFundingRoundsCount(count);
    };

    const handleHighestMoneyRaisedCompanyChange = (company) => {
        setHighestMoneyRaisedCompany(company);
    };

    const handleMoneyRaisedCountChange = (count) => {
        setMoneyRaisedCount(count);
      };

    const fetchCountInvestor = async () => {
        try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/cap-table-investor`,
            {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            }
        );
        setInvestorCount(response.data.length);
        } catch (error) {
        console.error("Error fetching funding round details:", error);
        }
    };

    const fetchTopInvestorContributor = async (userId) => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/cap-table-investor/${userId}/top`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setTopInvestor(response.data);
        } catch (error) {
          console.error("Error fetching top investor details:", error);
        }
      };

    const handleViewFundingRound = async (fundingRoundId) => {
        try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/funding-rounds/${fundingRoundId}`,
            {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            }
        );
        console.log("Funding Round Details:", response.data);
        setSelectedFundingRoundDetails(response.data);
        setOpenViewFundingRound(true);
        } catch (error) {
        console.error("Error fetching funding round details:", error);
        }
    };

    const handleSoftDeleteFundingRound = async (fundingRoundId) => {
        try {
        const fundingRoundToDelete = fundingRounds.find(round => round.id === fundingRoundId);

        if (fundingRoundToDelete) {
            const companyName = fundingRoundToDelete?.startup?.companyName || 'Unknown Company';
            const fundingType = fundingRoundToDelete?.fundingType || 'Unknown Funding Type';

            await axios.put(`${process.env.REACT_APP_API_URL}/funding-rounds/${fundingRoundId}/delete`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Remove the deleted funding round 
            const updatedFundingRounds = fundingRounds.filter(round => round.id !== fundingRoundId);
            setFundingRounds(updatedFundingRounds);
            setFilteredFundingRounds(updatedFundingRounds);

            await logActivity(
                `${companyName} - ${fundingType} funding round has been deleted.`,
                'Funding round removed successfully.',
                fetchRecentActivities                );
            }
        } catch (error) {
            console.error('Failed to soft delete funding round:', error);
        }
    };

    const fetchFundingRounds = async () => {
      
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/funding-rounds/all`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            
            setFundingRounds(response.data);
            setFilteredFundingRounds(response.data);
        } catch (error) {
            console.error('Error fetching funding rounds:', error);
        }
    };

    // CAP TABLE
    useEffect(() => {
        if (selectedStartupCapTable === 'Select Company') {
            fetchAllInvestorsByEachUsersCompany();
        } else {
            // fetchCapTable(selectedStartupCapTable);
        }
    }, [selectedStartupCapTable]);
    

    const fetchAllInvestorsByEachUsersCompany = async (companyId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/funding-rounds/${companyId}/investors/all`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setCapTables(response.data);
            setFilteredCapTables(response.data);
        } catch (error) {
            console.error('Error fetching funding rounds:', error);
        }
    };

  const handleStartupChangeCapTable = (event) => {
    const selectedCompanyId = event.target.value;
    setSelectedStartupCapTable(selectedCompanyId);
    fetchAllInvestorsByEachUsersCompany(selectedCompanyId);
  };

  useEffect(() => {
    const fetchPendingRequestsCount = async () => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/cap-table-investor/all?userId=${userId}`);
            setPendingRequestsCount(response.data.length);
        } catch (error) {
            console.error('Error fetching pending requests count:', error);
        }
    };
    fetchPendingRequestsCount();
  }, []);

  useEffect(() => {
    const tutorialSteps = [
        {
          target: '.create-button',
          content: 'Click here to create a new Startup Profile or Funding Round.',
        },
        {
          target: '.highest-funded-company',
          content: 'This box shows the highest-funded company in your portfolio.',
        },
        {
          target: '.top-investment-contributor',
          content: 'This box displays the top investor contributing to your startups.',
        },
        {
          target: '.funded-companies',
        content: 'Here you can see how many startups have raised money compared to the total number of companies.',
        },
        {
          target: '.company-count',
          content: 'This box shows the total number of startups you are tracking.',
        },
        {
          target: '.investor-count',
          content: 'This box shows the total number of investors involved across all your startups.'
        },
        {
          target: '.funding-rounds', 
          content: 'This box displays the number of funding rounds in your portfolio.',
        },
        {
          target: '.total-funded-amount',
          content: 'Here you can see the total amount funded across all the startups you have.'
        },
        {
            target: '.monthly-funding-overview',
            content: 'This chart shows a visual overview of the funding trends over the last few months.',
        },
        {
            target: '.recent-activity',
            content: 'This section shows your recent activities and updates related to your investments and companies.',
        },
        {
            target: '.tabs-round', 
            content: 'In the "My Funding Rounds" tab, you can view, edit, or delete funding round details as needed.'
        },
        {
            target: '.tabs-startups', 
            content: 'In the "My Startups" tab, you can view, edit, and delete your startup profiles to keep them up to date.'
        },
        {
            target: '.tabs-captable', 
            content: 'The "Cap Table" tab displays investors from each funding round, including their titles, shares, and ownership percentages, helping you manage shareholder information.'
        },
        {
            target: '.tabs-investorrequest', 
            content: 'The "Investor Requests" tab displays requests from potential investors. You can review and respond to pending requests here.'
        },        
      ];

    setSteps(tutorialSteps);
  }, []);

return (
    <>
      <Navbar />
      <Toolbar />

      <Container>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <HeaderBox>
                    {loading ? (
                        <Skeleton variant="text" width="15%" height={40} />
                        ) : (
                        <Typography variant="h5">Startup Dashboard</Typography>
                        )}                    
                        <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                        <>
                        {loading ? (
                            <Skeleton variant="rectangular" width="10%" height={40} />
                            ) : (
                            <CreateButton className="create-button" {...bindTrigger(popupState)}><AddCircle sx={{ mr: 1}} />Create</CreateButton>
                        )}
                            <Menu {...bindMenu(popupState)}>
                                <MenuItem onClick={() => { handleOpenBusinessProfile(); popupState.close(); }}>
                                    <Business sx={{ mr: 1, color: "#336FB0" }} /> Startup Profile
                                </MenuItem>

                                {companyCount === 0 ? (
                                    <Tooltip title="You need to create a Startup Profile first to access this." arrow>
                                        <div><MenuItem disabled><MonetizationOnRounded sx={{ mr: 1, color: "#336FB0" }} /> Funding Round</MenuItem></div>
                                    </Tooltip>
                                ) : (
                                    <MenuItem onClick={() => { handleOpenFundingRound(); popupState.close(); }}>
                                        <MonetizationOnRounded sx={{ mr: 1, color: "#336FB0" }} /> Funding Round
                                    </MenuItem>
                                )}
                            </Menu>
                        </>
                        )}
                    </PopupState>
                </HeaderBox>
            </Grid>

            {/* Top Row - 5 Boxes */}
            <Grid item xs={12} sm={6}>
                {loading ? (
                    <Skeleton variant="rectangular" height={100} width="100%" />
                ) : (
                    <TopInfoBox className="highest-funded-company">
                        <TopInfoIcon><Business sx={{ color: '#f5f5f5' }}/></TopInfoIcon>
                        <TopInfoText>Highest-Funded Startup</TopInfoText>
                        <TopInfoTitle>{highestMoneyRaisedCompany.companyName || 'None'}</TopInfoTitle>
                    </TopInfoBox>
                )}
            </Grid>

            <Grid item xs={12} sm={6}>
                {loading ? (
                    <Skeleton variant="rectangular" height={100} width="100%" />
                ) : (
                    <TopInfoBox className="top-investment-contributor">
                        <TopInfoIcon><Person2 sx={{ color: '#f5f5f5' }} /></TopInfoIcon>
                        <TopInfoText>Top Investment Contributor</TopInfoText>
                        <TopInfoTitle>{topInvestor.topInvestorName || 'None'}</TopInfoTitle>
                    </TopInfoBox>
                )}
            </Grid>

            <Grid item xs={12} sm={3}>
                {loading ? (
                    <Skeleton variant="rectangular" height={100} width="100%" />
                ) : (
                    <TopInfoBox className="funded-companies">
                        <TopInfoText>Funded Startups</TopInfoText>
                        <TopInfoTitle>{moneyRaisedCount} out of {companyCount}</TopInfoTitle>
                    </TopInfoBox>
                )}
            </Grid>

            <Grid item xs={12} sm={2}>
                {loading ? (
                    <Skeleton variant="rectangular" height={100} width="100%" />
                ) : (
                    <TopInfoBox className="company-count">
                        <TopInfoText>Company Count</TopInfoText>
                        <TopInfoTitle>{companyCount}</TopInfoTitle>
                    </TopInfoBox>
                )}
            </Grid>

            <Grid item xs={12} sm={2}>
                {loading ? (
                    <Skeleton variant="rectangular" height={100} width="100%" />
                ) : (
                    <TopInfoBox className="investor-count">
                        <TopInfoText>Investor Count</TopInfoText>
                        <TopInfoTitle>{investorCount}</TopInfoTitle>
                    </TopInfoBox>
                )}
            </Grid>

            <Grid item xs={12} sm={2}>
                {loading ? (
                    <Skeleton variant="rectangular" height={100} width="100%" />
                ) : (
                    <TopInfoBox className="funding-rounds">
                        <TopInfoText>Funding Rounds</TopInfoText>
                        <TopInfoTitle>{fundingRoundsCount}</TopInfoTitle>
                    </TopInfoBox>
                )}
            </Grid>

            <Grid item xs={12} sm={3}>
                {loading ? (
                    <Skeleton variant="rectangular" height={100} width="100%" />
                ) : (
                    <TopInfoBox className="total-funded-amount">
                        <TopInfoText>Total Amount Funded</TopInfoText>
                        <TopInfoTitle>{totalAmountFunded.toLocaleString()}</TopInfoTitle>
                    </TopInfoBox>
                )}
            </Grid>

            {/* Middle Row - Two Boxes */}
            <Grid item xs={12} sm={9}>
                {loading ? (
                    <Skeleton variant="rectangular" height={500} width="100%" />
                ) : (
                    <RecentActivityBox className="monthly-funding-overview">
                        <GraphTitle>Monthly Funding Overview</GraphTitle>
                        <MonthlyFundingChart userId={userId} />
                    </RecentActivityBox>
                )}
            </Grid>

            <Grid item xs={12} sm={3}>
            {loading ? (
                <Skeleton variant="rectangular" height={500} width="100%" />
            ) : (
                <RecentActivityBox className="recent-activity">
                    <RecentActivityTitle><History sx={{ mr: 1 }} />Recent Activity</RecentActivityTitle>
                    <Divider />
                    <RecentActivityList>
                        {recentActivities.length === 0 ? (
                            <ListItem>
                                <ListItemText primary="No recent activity" />
                            </ListItem>
                        ) : (
                            recentActivities
                                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                .slice(0, 10)
                                .map((activity, index) => {
                                    const formattedTimestamp = new Date(activity.timestamp).toLocaleString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true,
                                    });

                                    return (
                                        <div key={index}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={activity.action}
                                                    secondary={
                                                        <div>
                                                            <div>{activity.details}</div>
                                                            <div style={{ fontSize: '0.875rem', color: '#757575' }}>
                                                                {formattedTimestamp}
                                                            </div>
                                                        </div>
                                                    }/>
                                            </ListItem>
                                        </div>
                                    );
                                })
                            )}
                            {recentActivities.length > 10 && (
                                <Box display="flex" justifyContent="center" mt={2}>
                                    <Button size="small" variant="text" color="primary" onClick={handleViewHistoryClick}>View History</Button>
                                </Box>
                            )}
                        </RecentActivityList>
                    </RecentActivityBox>
                )}
            </Grid>

            <Grid item xs={12}>
                {loading ? (
                    <Skeleton variant="rectangular" height={48} width="100%" />
                ) : (
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="tabs"
                    sx={{ mt: 2, "& .MuiTabs-indicator": { backgroundColor: "#004A98" }, }}>
                <Tab label="My Funding Rounds" className="tabs-round"
                    sx={{ color: tabValue === 0 ? "#1E1E1E" : "text.secondary", "&.Mui-selected": { color: "#1E1E1E" },}}/>
                <Tab label="My Startups" className="tabs-startups"
                    sx={{ color: tabValue === 1 ? "#1E1E1E" : "text.secondary", "&.Mui-selected": { color: "#1E1E1E",},}}/>
                <Tab label="My Cap Table" className="tabs-captable"
                    sx={{color: tabValue === 2 ? "#1E1E1E" : "text.secondary", "&.Mui-selected": {color: "#1E1E1E",},}}/>
                <Tab label={`Investor Requests (${pendingRequestsCount})`} className="tabs-investorrequest"
                    sx={{ color: tabValue === 3 ? "#1E1E1E" : "text.secondary", "&.Mui-selected": { color: "#1E1E1E", },}}/>
                </Tabs>
                )}

                <Box sx={{ pt: 3}}>
                    {tabValue === 0 && (
                        loading ? (
                            <Skeleton variant="rectangular" height={400} width="100%" />
                        ) : (
                        <FundingRoundTable 
                            filteredFundingRounds={filteredFundingRounds}
                            fundingRounds={fundingRounds}
                            handleViewFundingRound={handleViewFundingRound}
                            handleSoftDeleteFundingRound={handleSoftDeleteFundingRound}
                            selectedFundingRoundDetails={selectedFundingRoundDetails}
                            openViewFundingRound={openViewFundingRound}
                            handleCloseFundingRound={handleCloseFundingRound}
                            handleCloseFundingProfile={handleCloseFundingProfile}
                            businessProfiles={businessProfiles}
                            onTotalAmountFundedChange={handleTotalAmountFundedChange}
                            onFundingRoundsCountChange={handleFundingRoundsCountChange}
                            onMoneyRaisedCountChange={handleMoneyRaisedCountChange}
                            onHighestMoneyRaisedCompanyChange={handleHighestMoneyRaisedCompanyChange} />
                        )
                    )}

                    {tabValue === 1 && (
                        <BusinessProfileTable 
                            businessProfiles={businessProfiles}
                            handleOpenStartUp={handleOpenStartUp}
                            handleOpenInvestor={handleOpenInvestor}
                            handleOpenDeleteDialog={handleOpenDeleteDialog}
                            handleOpenCancelDialog={handleOpenCancelDialog}
                            selectedBusinessProfile={selectedBusinessProfile}
                            openViewStartup={openViewStartup}
                            openViewInvestor={openViewInvestor}
                            openDeleteDialog={openDeleteDialog}
                            handleCloseStartUp={handleCloseStartUp}
                            handleCloseInvestor={handleCloseInvestor}
                            handleCloseDeleteDialog={handleCloseDeleteDialog}
                            handleCloseCancelDialog={handleCloseCancelDialog}
                            handleSoftDelete={handleSoftDelete}
                            profileToDelete={profileToDelete}/>                            
                        )}

                    {tabValue === 2 && (
                        <CapTable 
                            filteredCapTables={filteredCapTables}
                            businessProfiles={businessProfiles} 
                            selectedStartupCapTable={selectedStartupCapTable} 
                            handleStartupChangeCapTable={handleStartupChangeCapTable}
                            fundingRound={fundingRound} />
                        )}

                    {tabValue === 3 && (
                        <PendingRequestInvestor onPendingRequestsCountChange={setPendingRequestsCount} />
                        )}
                    </Box>
                </Grid> 
            </Grid>

            {joyrideRun && !joyrideFinished ? (
                <Joyride steps={steps} callback={handleJoyrideCallback} run={joyrideRun} continuous showSkipButton showProgress 
                disableCloseOnEsc disableOverlayClose scrollOffset={80}     
                styles={{ options: { zIndex: 10000, }, overlay: { zIndex: 10000, }, spotlight: { zIndex: 10001, }, tooltip: { zIndex: 10002, }, }}/>
            ) : (
                !loading && createBusinessProfile && joyrideFinished && (
                    <CreateBusinessProfileDialog open={createBusinessProfile} onClose={handleCloseBusinessProfile} companyCount={companyCount} />
                )
            )}

            <CreateFundingRoundDialog open={openCreateFundingRound} onClose={handleCloseFundingRound} />
            <ActivitiesDialog open={dialogOpen} onClose={handleCloseDialog} activities={recentActivities}/>
            <ConfirmCancelDialog open={openCancelDialog} onClose={handleCloseCancelDialog} 
                onConfirm={handleConfirmCancel} companyName={profileToCancel ? profileToCancel.companyName : ""} />
        </Container>
    </>
  );
}

export default StartupDashboard;