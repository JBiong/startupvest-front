import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Box, Drawer, AppBar, List, Typography, CssBaseline, Toolbar, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, IconButton } from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOnRounded';
import PeopleIcon from '@mui/icons-material/PeopleRounded';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import HelpIcon from '@mui/icons-material/Help';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NavigationIcon from '@mui/icons-material/Navigation';

import UserGuideStartup from '../Dialogs/UserGuideStartup';
import UserGuideInvestor from '../Dialogs/UserGuideInvestor';
import { useAuth } from '../Context/AuthContext';

const drawerWidth = 240;

export default function Navbar() {
  const { role } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userPhoto, setUserPhoto] = useState('');
  const location = useLocation(); 
  const [openDialog, setOpenDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const dashboardPath = role === 'Investor' ? '/investorDashboard' : '/startupDashboard';

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon sx={{ color: '#F2F2F2' }} />, path: dashboardPath },
    { text: 'Companies', icon: <StoreIcon sx={{ color: '#F2F2F2' }} />, path: '/companies' },
    { text: 'Funding Round', icon: <MonetizationOnIcon sx={{ color: '#F2F2F2' }} />, path: '/fundinground' },
    { text: 'People', icon: <PeopleIcon sx={{ color: '#F2F2F2' }} />, path: '/people' },
    { text: 'FAQs', icon: <HelpIcon sx={{ color: '#F2F2F2' }} />, path: '/faqs' },
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      setFirstName(response.data.firstName);
      setLastName(response.data.lastName);
  
      try {
        const profilePicResponse = await axios.get(`${process.env.REACT_APP_API_URL}/profile-picture/${response.data.id}`, {
          responseType: 'blob',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        const profilePicUrl = URL.createObjectURL(profilePicResponse.data);
        setUserPhoto(profilePicUrl);
      } catch (picError) {
        if (picError.response && picError.response.status === 404) {
          console.log('Profile picture not found, using default initials.');
          setUserPhoto(null);
        } else {
          console.error('Error fetching profile picture:', picError);
        }
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };  

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    window.location = '/login';
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setActiveStep(0); 
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: '#004A98' }}>
        <Toolbar>
          <Avatar sx={{ ml: -1, width: 40, height: 40, mr: 1 }} src='images/logoV1.png' />
          <Typography variant="h6" noWrap component="div">Startup Vest</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Avatar sx={{ mr: 1, width: 40, height: 40, border: '2px #F2F2F2 solid' }}>
            {userPhoto ? (
              <img src={userPhoto} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
            ) : (
              `${firstName[0]}${lastName[0]}`
            )}
          </Avatar>
          <Typography variant="h6" noWrap component="div">{lastName}, {firstName}</Typography>
          <IconButton size="medium" aria-label="show 17 new notifications" color="inherit">
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent"
        sx={{ width: drawerWidth, flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', background: '#004A98', color: '#F2F2F2' }, }}>
        <Toolbar />
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/profile" sx={{ p: 2 }}>
                  <Avatar sx={{ mr: 1, width: 40, height: 40, border: '2px #F2F2F2 solid' }}>
                    {userPhoto ? (
                      <img src={userPhoto} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', }} />
                    ) : (
                      `${firstName[0]}${lastName[0]}`
                    )}
                  </Avatar>
                  <Typography variant="h6" noWrap component="div">{firstName} {lastName}</Typography>
                </ListItemButton>
              </ListItem>

              <Divider />

              {menuItems.map((item) => {
                const isActive = location.pathname === item.path; 

                return (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton component={Link} to={item.path} 
                      sx={{ pt: 2, pb: 2, backgroundColor: isActive ? '#003B7A' : 'transparent', 
                        '&:hover': { 
                          backgroundColor: isActive ? '#003B7A' : 'rgba(255, 255, 255, 0.1)', 
                        } }}>
                      <ListItemIcon>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  </ListItem>
                );
              })}

              <Divider />

              <ListItem disablePadding>
                <ListItemButton component={Link} to="/" onClick={handleLogout} sx={{ pt: 2, pb: 2 }}>
                  <ListItemIcon>
                    <LogoutIcon sx={{ color: '#F2F2F2' }} />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>

          <Box sx={{ p: 1, position: 'relative', bottom: 0}}>
            <List>
              <ListItem disablePadding sx={{ background: '#336FB0', borderRadius: 2, color: '#f2f2f2' }}>
                <ListItemButton onClick={handleClickOpen}>
                  <ListItemIcon>
                      <NavigationIcon sx={{ color: '#f2f2f2' }} />
                  </ListItemIcon>
                  <ListItemText primary="User Guide" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Box>
      </Drawer>
      
      {role === 'CEO' ? (
        <UserGuideStartup open={openDialog} onClose={handleCloseDialog} activeStep={activeStep} setActiveStep={setActiveStep} />
      ) : (
        <UserGuideInvestor open={openDialog} onClose={handleCloseDialog} activeStep={activeStep} setActiveStep={setActiveStep} />
      )}
    </Box>
  );
}
