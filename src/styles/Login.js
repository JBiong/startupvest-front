const LoginStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    paddingX: { xs: 2, md: 2 },
    transformOrigin: 'center',
  },
  leftSideGrid: {
    textAlign: 'center',
    display: { xs: 'none', sm: 'block' },
  },
  leftSidePaper: {
    pt: { xs: 5, md: 6, lg: 12 },
    pb: { xs: 5, md: 6, lg: 12 },
    px: { xs: 2, md: 4 },
    background: '#004A98',
    borderRadius: '10px',
  },
  leftSideTypography: {
    color: '#F2F2F2',
    fontWeight: 'bold',
    fontSize: { xs: '1.5rem', md: '2.125rem', lg: '2.5rem' },
  },
  leftSideSubtitle: {
    mt: 2,
    mb: 2,
    color: '#F2F2F2',
    fontSize: { xs: '1rem', md: '1.25rem', lg: '1.5rem' },
  },
  leftSideImage: {
    width: '80%',
    maxWidth: '100%',
    boxShadow: '10px 10px 10px rgba(0,0,0,.2)',
    borderRadius: 10,
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: { xs: 4, md: 0 },
  },
  logoImage: {
    width: '70%',
    marginBottom: '10px',
    maxWidth: '100%',
  },
  formPaper: {
    padding: { xs: '30px', md: '50px', lg: '55px' },
    position: 'relative',
    width: { xs: '90%', md: '70%', lg: '62.8%' },
    maxWidth: '500px',
  },
  formHeading: {
    textAlign: 'center',
    mb: 1,
    color: '#004A98',
    fontWeight: 'bold',
    fontSize: { xs: '1.25rem', md: '1.5rem', lg: '2rem' },
  },
  formInput: {
    height: '45px',
    '& .MuiInputBase-root': { height: '45px' },
    boxShadow: '1px 2px 8px rgba(0,0,0,0.1)',
    fontSize: { xs: '0.9rem', lg: '1.1rem' },
    '& input:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 1000px #ffffff inset',
    },
  },
  formSubmitButton: {
    marginTop: 3,
    width: '100%',
    background: '#004A98',
    textTransform: 'none',
    fontSize: { xs: '1rem', md: '1rem' },
    '&:hover': {
      boxShadow: '0 0 10px rgba(0,0,0,0.5)',
      backgroundColor: '#004A98',
    },
  },
  forgotPasswordText: {
    textAlign: 'right',
    cursor: 'pointer',
    color: '#004A98',
    fontSize: { xs: '0.75rem', lg: '0.85rem' },
    mt: 1,
  },
  signUpText: {
    textAlign: 'center',
    color: '#004A98',
    fontSize: { xs: '0.85rem', lg: '1rem' },
  },
  signUpLink: {
    color: '#004A98',
    fontWeight: 'bold',
    fontSize: { xs: '0.85rem', lg: '0.9rem' },
  },
};

export default LoginStyles;
