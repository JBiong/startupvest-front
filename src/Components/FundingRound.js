import { useState, useEffect, useMemo } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Toolbar, Typography, TextField, Pagination, Skeleton } from '@mui/material';
import PropTypes from 'prop-types';
import SearchIcon from '@mui/icons-material/Search';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { StyledPaper, StyledAvatar, StyledTableRow, StyledTableCell, StyledStack, Title } from '../styles/components'; 

const drawerWidth = 240;

function createData(id, transactionName, startupName, fundingType, moneyRaised, moneyRaisedCurrency, announcedDate, closedDate, avatar, preMoneyValuation, capTableInvestors, 
  minimumShare, startupId, fundingName, targetFunding ) {
  const currentDate = new Date();
  const isClosedDatePassed = new Date(closedDate) < currentDate;
  const isFundingCompleted = targetFunding !== '---' && moneyRaised !== '---' && Number(moneyRaised) >= Number(targetFunding);
  const status = (isClosedDatePassed || isFundingCompleted) ? 'Completed' : 'Ongoing';
    
  return {
    id,
    transactionName,
    startupName,
    fundingType,
    moneyRaised: isNaN(moneyRaised) ? '---' : moneyRaised,
    moneyRaisedCurrency,
    announcedDate,
    closedDate,
    avatar,
    preMoneyValuation,
    capTableInvestors: capTableInvestors.filter(investor => investor.status === 'accepted'),
    minimumShare,
    startupId,
    fundingName,
    targetFunding: isNaN(targetFunding) ? '---' : targetFunding,
    status
  };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'startupName', numeric: false, disablePadding: false, label: 'StartUp Name', width: '15%' },
  { id: 'fundingName', numeric: false, disablePadding: false, label: 'Funding Name', width: '15%' },
  { id: 'fundingType', numeric: false, disablePadding: false, label: 'Funding Type', width: '15%' },
  { id: 'moneyRaised', numeric: true, disablePadding: false, label: 'Money Raised', width: '15%' },
  { id: 'closedDate', numeric: false, disablePadding: false, label: 'Closed on Date', width: '15%' },
  { id: 'Status', numeric: false, disablePadding: false, label: 'Status', width: '15%' },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align="left" padding={headCell.disablePadding ? 'none' : 'normal'} 
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ width: headCell.width, fontWeight: 'bold', backgroundColor: '#336FB0', color: '#ffffff' }}>
            <TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)} style={{ color: '#ffffff' }}> 
                {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

function EnhancedTableToolbar({ onRequestSearch }) {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (event) => {
    setSearchText(event.target.value);
    onRequestSearch(event.target.value);
  };

  return (
    <Toolbar sx={{ pt: 12, mb: 3, ml: -3 }}>
      <Title>Search Funding Round</Title>
      <TextField variant="outlined" placeholder="Search…" onChange={handleSearch} value={searchText} 
      sx={{ width: 350, mr: -3, '& .MuiInputBase-root': { height: '45px' }, '& input': { padding: '10px 14px' } }}
        InputProps={{ startAdornment: <SearchIcon /> }} />
    </Toolbar>
  );
}

export default function FundingRound() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('transactionName');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [profilePictures, setProfilePictures] = useState({});
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFundingRounds = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/funding-rounds/all`);
        const fetchedRows = response.data
          .map(fundingRound => createData(
            fundingRound.id,
            fundingRound.transactionName || '---',
            fundingRound.startup?.companyName ?? '---',
            fundingRound.fundingType || '---',
            fundingRound.moneyRaised || '---',
            fundingRound.moneyRaisedCurrency || 'USD',
            new Date(fundingRound.announcedDate).toLocaleDateString(),
            new Date(fundingRound.closedDate).toLocaleDateString(),
            fundingRound.avatar || '',
            fundingRound.preMoneyValuation || '---',
            fundingRound.capTableInvestors || [],
            fundingRound.minimumShare || '---',
            fundingRound.startup?.id,
            fundingRound.fundingName || '---',
            fundingRound.targetFunding || '---' 
          ));
          
        setRows(fetchedRows);
        setFilteredRows(fetchedRows);
        await fetchAllProfilePictures(response.data); 
      } catch (error) {
        console.error('Error fetching funding rounds:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchFundingRounds();
  }, []);
  
  const fetchAllProfilePictures = async (fundingRounds) => {
    const pictures = {};
    await Promise.all(
      fundingRounds.map(async (fundingRound) => {
        const startupId = fundingRound.startup?.id;
        if (!startupId) return
  
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile-picture/startup/${startupId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            responseType: 'blob',
          });
  
          const imageUrl = URL.createObjectURL(response.data); 
          pictures[fundingRound.id] = imageUrl; 
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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearch = (searchText) => {
    const filtered = rows.filter(row =>
      (row.startupName.toLowerCase() || '').includes(searchText.toLowerCase()) ||
      (row.fundingName.toLowerCase() || '').includes(searchText.toLowerCase()) ||
      (row.fundingType?.toLowerCase() || '').includes(searchText.toLowerCase())
    );
    setFilteredRows(filtered);
  };

  const visibleRows = useMemo(
    () =>
      stableSort(filteredRows, getComparator(order, orderBy)).slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, filteredRows],
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box sx={{ width: '100%', paddingLeft: `${drawerWidth}px` }}>
      <Navbar />
      <StyledPaper elevation={0}>
        <EnhancedTableToolbar onRequestSearch={handleSearch} />
        <TableContainer>
          <Table stickyHeader>
            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
            <TableBody>
              {loading ? (
                [...Array(rowsPerPage)].map((_, index) => (
                  <TableRow key={index}>
                    <StyledTableCell>
                      <StyledStack direction="row" alignItems="center">
                        <Skeleton variant="rectangular" width={50} height={50} sx={{ borderRadius: '4px' }} />
                        <Skeleton variant="text" width="30%" sx={{ ml: 2 }} />
                      </StyledStack>
                    </StyledTableCell>
                    
                    <StyledTableCell><Skeleton variant="text" width="60%" /></StyledTableCell>
                    <StyledTableCell><Skeleton variant="text" width="40%" /></StyledTableCell>
                    <StyledTableCell><Skeleton variant="text" width="30%" /></StyledTableCell>
                    <StyledTableCell><Skeleton variant="text" width="50%" /></StyledTableCell>
                    <StyledTableCell><Skeleton variant="text" width="50%" /></StyledTableCell>
                    <StyledTableCell><Skeleton variant="text" width="50%" /></StyledTableCell>                    
                  </TableRow>
                ))
              ) : (
                visibleRows.map((row) => (
                  <StyledTableRow key={row.id} onClick={() => handleRowClick(row)}>
                    <StyledTableCell>
                      <StyledStack direction="row" alignItems="center">
                        <StyledAvatar alt={row.startupName} src={profilePictures[row.id]} variant='rounded'/>
                        {row.startupName}
                      </StyledStack>
                    </StyledTableCell>
                    <StyledTableCell>{row.fundingName}</StyledTableCell>
                    <StyledTableCell>{row.fundingType}</StyledTableCell>
                    <StyledTableCell>
                      {row.moneyRaisedCurrency} {row.moneyRaised === '---' ? row.moneyRaised : Number(row.moneyRaised).toLocaleString()}
                    </StyledTableCell>
                    <StyledTableCell>{formatDate(row.closedDate)}</StyledTableCell>
                    <StyledTableCell>{row.status}</StyledTableCell>
                  </StyledTableRow>
                ))
              )}
              {visibleRows.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="textSecondary">No funding rounds available.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination count={Math.ceil(filteredRows.length / rowsPerPage)} page={page} onChange={handlePageChange}
          sx={{ mt: 2, mb: 3, display: 'flex', justifyContent: 'center' }} />
      </StyledPaper>
    </Box>
  );
}