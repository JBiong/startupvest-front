// CompaniesStyles.js
import { styled } from '@mui/material/styles';
import { Paper, Avatar, TableRow, TableCell, Stack } from '@mui/material';

export const Title = styled('div')(({ theme }) => ({
  flex: '1 1 100%', 
  color: '#1E1E1E', 
  fontSize: '1.5rem'
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  boxShadow: 'none',
}));

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 50,
  height: 50,
  marginRight: theme.spacing(2),
  border: `2px solid #336FB0`,
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: 'pointer',
  height: '75px',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: 'left',
  color: 'black'
}));

export const StyledStack = styled(Stack)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'left',
  alignItems: 'center',
}));
