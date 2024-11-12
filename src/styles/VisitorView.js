import { styled } from '@mui/material/styles';
import { Box, Avatar, Typography, Table, TableHead, TableCell, Card } from '@mui/material';

// Avatar Styles
export const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 160,
    height: 160,
    border: '3px solid #336FB0',
    borderRadius: 3,
    marginLeft: theme.spacing(9),
    fontSize: '3rem',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

// Box for User Info
export const UserInfoBox = styled(Box)(({ theme }) => ({
    background: 'white',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 2,
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
}));

// Styles for Overview 
export const OverviewBox = styled(Box)(({ theme }) => ({
    background: 'white',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 2,
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
  }));  

export const OverviewTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    color: '#1E1E1E',
}));

export const InvestorTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: '#336FB0',
}));

// Styles for Icons Container
export const IconsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    position: 'fixed',
    bottom: 20,
    right: 15,
}));

// Styled Table
export const StyledTable = styled(Table)(({ theme }) => ({
    backgroundColor: 'white',
}));
  
export const StyledTableHead = styled(TableHead)(({ theme }) => ({
    backgroundColor: '#336FB0',
}));
  
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
}));
  
// Styled Pagination Box
export const PaginationBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(3),
}));

// STARTUP PROFILE FINANCIAL VIEW
export const CardStyled = styled(Card)(({ theme }) => ({
    padding: theme.spacing(3.2),
    boxShadow: 3,
    borderRadius: 10,
    transition: '0.3s',
    border: '1px solid lightgray',
    '&:hover': {
      boxShadow: 6,
      transform: 'translateY(-5px)',
    },
  }));
  
  export const FundingChartCard = styled(Card)(({ theme }) => ({
    borderRadius: 10,
    height: '100%',
    padding: theme.spacing(2),
    border: '1px solid lightgray',
  }));
  
  export const FundingBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  }));
  
  export const FundingTitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1E1E1E',
  }));
  
  export const FundingDescription = styled(Typography)(({ theme }) => ({
    fontSize: '1.1rem',
    color: '#333',
  }));
  
  export const FundingNote = styled(Typography)(({ theme }) => ({
    color: 'gray',
    marginTop: theme.spacing(1),
  }));