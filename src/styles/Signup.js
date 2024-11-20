export const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  sideBar: {
    background: '#004A98',
    borderRadius: '3px 10px 10px 3px',
    boxShadow: '10px 3px 8px rgba(0,0,0,.15)',
  },
  titleContainer: {
    display: 'flex',               
    justifyContent: 'center',        
    alignItems: 'center',           
    flexDirection: 'column',         
    textAlign: 'center',
    color: '#004A98',
    width: '100%',                  
  },
  title: {
    fontSize: '5.5em',
    fontWeight: 'bold',
  },
  formContainer: {
    p: 8,
    background: '#004A98',
    borderRadius: 2,
    boxShadow: '10px 3px 8px rgba(0,0,0,.15)',
  },
  formTitle: {
    fontWeight: 'bold',
    color: '#F2F2F2',
    pb: 3,
  },
  textField: {
    background: '#F2F2F2',
    borderRadius: 1,
    height: '45px',
    '& .MuiInputBase-root': { height: '45px' },
    '& .MuiInputBase-input': { padding: '12px 14px' },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#fff',
    },
    '& input:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 30px #F2F2F2 inset',
      WebkitTextFillColor: '#000',
    },
    '& input:-moz-autofill': {
      boxShadow: '0 0 0 30px #F2F2F2 inset',
      color: '#000',
    },
  },
  submitButton: {
    mt: 1,
    mb: 2,
    background: '#f2f2f2',
    textTransform: 'none',
    color: '#004A98',
    borderRadius: 1,
    fontSize: '1rem',
    '&:hover': {
      backgroundColor: '#f2f2f2',
      color: '#004A98',
      boxShadow: '0 0 10px rgba(0,0,0,0.5)',
    },
    height: '45px'
  },
  errorText: {
    color: '#f2f2f2',
    fontSize: '10px',
    mt: 1,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#F2F2F2',
    textDecoration: 'underline',
    fontWeight: 'bold',
  },
  titleLink: {
    textAlign: 'center',
    color: '#F2F2F2',
    fontSize: { xs: '0.85rem', lg: '1rem' },
  },
};