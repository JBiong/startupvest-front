import React, { useState, useMemo, useEffect } from 'react';
import { Box, Table, TableBody, TableContainer, TableHead, TableRow, TableSortLabel, Toolbar, Typography, TextField, Pagination, TableCell, Skeleton } from '@mui/material';
import PropTypes from 'prop-types';
import SearchIcon from '@mui/icons-material/Search';
import { visuallyHidden } from '@mui/utils';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import { StyledPaper, StyledAvatar, StyledTableRow, StyledTableCell, StyledStack, Title } from '../styles/components'; 

const drawerWidth = 240;

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
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
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'startup', numeric: false, disablePadding: false, label: 'Startup Name', width: '18%' },
  { id: 'location', numeric: false, disablePadding: false, label: 'Location', width: '20%' },
  { id: 'founded', numeric: false, disablePadding: false, label: 'Founded Date', width: '15%' },
  { id: 'description', numeric: false, disablePadding: false, label: 'Description', width: '35%' },
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
            style={{ width: headCell.width, fontWeight: 'bold', backgroundColor: '#336FB0', color: '#ffffff', }}>
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
      <Title>Search Startups</Title>
      <TextField variant="outlined" placeholder="Search…" onChange={handleSearch} value={searchText} 
      sx={{ width: 350, mr: -3, '& .MuiInputBase-root': { height: '45px' }, '& input': { padding: '10px 14px' } }}
        InputProps={{ startAdornment: <SearchIcon /> }} />
    </Toolbar>
  );
}

export default function Companies() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('startup');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [filteredRows, setFilteredRows] = useState([]);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [profilePictures, setProfilePictures] = useState({});
  const [loading, setLoading] = useState(true); 

  const formatAddress = (streetAddress, city, country) => {
    const parts = [streetAddress, city, country].filter(Boolean); 
    return parts.length ? parts.join(', ') : 'Location not available';
  };  

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/startups/all`)
      .then((response) => {
        const approvedStartups = response.data.filter(
          (startup) => startup.status === "approved" && !startup.isDeleted
        );
        setRows(approvedStartups);
        setFilteredRows(approvedStartups);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the startups data!", error);
        setLoading(false);
      });
  }, []);

  // Fetch profile picture for a single startup
  const fetchProfilePicture = async (startupId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile-picture/startup/${startupId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        responseType: 'blob', 
      });

      const imageUrl = URL.createObjectURL(response.data);
      setProfilePictures(prev => ({
        ...prev,
        [startupId]: imageUrl
      }));
    } catch (error) {
      console.error(`Failed to fetch profile picture for startup ID ${startupId}:`, error);
    }
  };

  useEffect(() => {
    // Reset profile pictures when page changes
    setProfilePictures({});

    // Fetch pictures only for visible rows
    visibleRows.forEach(row => {
      fetchProfilePicture(row.id);
    });
  }, [page, filteredRows, rowsPerPage, order, orderBy]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
  };

  const handleSearch = (searchText) => {
    const filtered = rows.filter(row => {
      return Object.keys(row).some(key => {
        return row[key] !== null && row[key].toString().toLowerCase().includes(searchText.toLowerCase());
      });
    });
    setFilteredRows(filtered);
    setPage(0);
  };

  const handleRowClick = (startup) => {
    navigate(`/startupview`, { state: { startup: startup } });
  };

  const visibleRows = useMemo(
    () => stableSort(filteredRows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredRows, order, orderBy, page, rowsPerPage]
  );

  return (
    <Box sx={{ display: 'flex', width: `${drawerWidth}` }}>
      <Navbar />
      <StyledPaper>
        <EnhancedTableToolbar onRequestSearch={handleSearch} />
        <TableContainer>
          <Table>
            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
            <TableBody>
              {loading ? (
                Array.from(new Array(rowsPerPage)).map((_, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>
                      <StyledStack direction="row" alignItems="center">
                        <Skeleton variant="rounded" width={50} height={50} />
                        <Skeleton variant="text" width="30%" sx={{ ml: 2 }} />
                      </StyledStack>
                    </StyledTableCell>

                    <StyledTableCell><Skeleton variant="text" width="100%" /></StyledTableCell>
                    <StyledTableCell><Skeleton variant="text" width="50%" /></StyledTableCell>
                    <StyledTableCell><Skeleton variant="text" width="80%" /></StyledTableCell>
                  </StyledTableRow>
                ))
              ) : visibleRows.map((row, index) => (
                <StyledTableRow hover tabIndex={-1} key={row.id} onClick={() => handleRowClick(row)}>
                  <StyledTableCell>
                    <StyledStack direction="row">
                      <StyledAvatar alt={row.startup} src={profilePictures[row.id]} variant='rounded' />
                      {row.companyName}
                    </StyledStack>
                  </StyledTableCell>
                  <StyledTableCell>{formatAddress(row.locationName)}</StyledTableCell>
                  <StyledTableCell>{row.foundedDate}</StyledTableCell>
                  <StyledTableCell sx={{ textAlign: 'justify' }}>
                    {row.companyDescription.split(' ').slice(0, 15).join(' ')}...
                  </StyledTableCell>
                </StyledTableRow>
              ))}
              {visibleRows.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={headCells.length} align="center">
                    <Typography variant="body2" color="textSecondary">No companies available.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination count={Math.ceil(filteredRows.length / rowsPerPage)} page={page + 1} onChange={handleChangePage}
          sx={{ mt: 2, mb: 3, display: 'flex', justifyContent: 'center' }} />
      </StyledPaper>
    </Box>
  );
}