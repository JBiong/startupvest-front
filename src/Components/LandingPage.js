import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button, Grid, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/system';

const BorderBox = styled(Box)(({ position, direction }) => ({
  position: 'fixed',
  [position]: 0,
  [direction]: '0',
  backgroundColor: '#004A98',
  zIndex: 10,
}));

const LandingPage = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [isZoom100, setIsZoom100] = useState(window.devicePixelRatio === 1);

  // Listen to zoom changes
  useEffect(() => {
    const handleZoomChange = () => {
      setIsZoom100(window.devicePixelRatio === 1);
    };

    window.addEventListener('resize', handleZoomChange);

    return () => {
      window.removeEventListener('resize', handleZoomChange);
    };
  }, []);

  // Font sizes for title and body text (adjusted for zoom level)
  const titleFontSize = isZoom100
    ? { xs: '3rem', md: '4.5rem', lg: '4.2rem' } // Larger title for 100% zoom
    : { xs: '2.5rem', md: '4rem', lg: '3.2rem' }; // Default title size

  const bodyFontSize = isZoom100
    ? { xs: '1rem', md: '1.4rem', lg: '1.2rem' } // Larger body font for 100% zoom
    : { xs: '0.8rem', md: '1.2rem', lg: '1rem' }; // Default body size

  return (
    <Container maxWidth="xxl"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative',
        minHeight: '100vh', px: { xs: 2, md: 15 }, }}>

      {/* Header Section */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ width: '100%', ml: 3 }}>
        {/* Logo */}
        <Grid item xs={6} md={4} lg={3}>
          <Box component="img"
            src="/images/logo_name.png"
            alt="Startup Vest Logo"
            sx={{ width: '78%', height: 'auto' }} />
        </Grid>

        {/* Buttons */}
        <Grid item xs={6} md={8} lg={4} sx={{ textAlign: 'right', pr: { xs: 2, md: 8 } }}>
          <Button component={Link} variant="text" to="/login"
            sx={{ mr: 2, color: '#004A98' }}
            aria-label="Login Button">
            Login
          </Button>

          <Button component={Link} variant="contained" to="/signup"
            sx={{ background: '#336FB0', color: '#FFFFFF', mr: 1, }}
            aria-label="Signup Button">
            Signup
          </Button>
        </Grid>
      </Grid>

      {/* Border Designs for Large Screens */}
      {isLargeScreen && (
        <>
          <BorderBox position="top" direction="right" sx={{ width: '50%', height: '15px', borderRadius: '0 0 0 10px' }} />
          <BorderBox position="top" direction="right" sx={{ width: '25px', height: '50%', borderRadius: '0 0 0 10px' }} />
          <BorderBox position="bottom" direction="left" sx={{ width: '50%', height: '15px', borderRadius: '0 10px 0 0' }} />
          <BorderBox position="bottom" direction="left" sx={{ width: '25px', height: '50%', borderRadius: '0 10px 0 0' }} />
        </>
      )}

      {/* Main Content */}
      <Grid container spacing={4} sx={{ width: '100%' }}>
        {/* Text Section */}
        <Grid item xs={12} md={isMediumScreen ? 12 : 6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant={isLargeScreen ? 'h2' : isMediumScreen ? 'h3' : 'h5'}
              gutterBottom sx={{ fontWeight: 'bold', color: '#004A98', mt: { xs: 5, md: 8 }, fontSize: titleFontSize, }}>
              Turn Bold Ideas <br /> Into Startup Reality!
            </Typography>

            <Typography variant={isLargeScreen ? 'h6' : isMediumScreen ? 'body1' : 'body2'} align="justify" paragraph
              sx={{ color: theme.palette.text.primary, mt: 2, fontSize: bodyFontSize, }}>
              Our application equips startup owners with essential tools for effective funding management. Users can access key metrics like the highest-funded companies, top investors, and total funding amounts. They can also track investor counts, review funding rounds, and visualize monthly funding trends.
            </Typography>

            <Typography variant={isLargeScreen ? 'h6' : isMediumScreen ? 'body1' : 'body2'}align="justify" paragraph
              sx={{ color: theme.palette.text.primary, fontSize: bodyFontSize }}>
              For investors, the app streamlines investment monitoring by highlighting top companies, tracking investment counts, analyzing average investment sizes, and allowing users to track the specific companies they have invested in.
            </Typography>
          </Box>
        </Grid>

        {/* Image Section */}
        {!isMediumScreen && ( 
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Box
                component="img"
                src="/images/startup_illustration new.png"
                alt="Illustration of a Startup"
                loading="lazy"
                sx={{ width: isLargeScreen ? '100%' : isSmallScreen ? '100%' : 'none', height: 'auto', maxHeight: isSmallScreen ? '250px' : 'none',}}/>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default LandingPage;