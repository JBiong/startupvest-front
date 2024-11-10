import React, { useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Pagination, Avatar, FormControl, Select, MenuItem } from '@mui/material';
import ViewStartupProfileDialog from '../Dialogs/ViewStartupProfileDialog';
import ConfirmDeleteDialog from '../Dialogs/ConfirmDeleteProfileDialog';
import { tableStyles } from '../styles/tables';

function BusinessProfileTable({
  businessProfiles,
  handleOpenStartUp,
  handleOpenDeleteDialog,
  selectedBusinessProfile,
  openViewStartup,
  openDeleteDialog,
  handleCloseStartUp,
  handleCloseDeleteDialog,
  handleSoftDelete,
  profileToDelete
}) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState('approved'); // Default filter is 'approved'

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const totalPageCount = Math.ceil(businessProfiles.length / rowsPerPage);

  const handleFilterChange = (event) => {
    setFilter(event.target.value); // Update filter state when user selects a filter
  };

  const filteredProfiles = businessProfiles.filter((profile) => {
    if (filter === 'pending') {
      return profile.status === 'Pending'; // Only show pending profiles
    }
    if (filter === 'approved') {
      return profile.status === 'Verified'; // Only show verified profiles
    }
    return true; // Show all profiles if no filter is selected
  });

  return (
    <Box component="main" sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* Filter Section */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ pr: 1 }}>Filter</Typography>
          <FormControl sx={{ minWidth: 200, background: 'white' }}>
            <Select variant="outlined" value={filter} onChange={handleFilterChange} sx={{ minWidth: 100, height: '45px' }}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending Requests</MenuItem>
              <MenuItem value="approved">Verified Startups</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Table Section */}
      <TableContainer sx={tableStyles.container}>
        <Table>
          <TableHead sx={tableStyles.head}>
            <TableRow>
              {/* Conditionally render columns based on the filter */}
              {filter !== 'pending' && (
                <TableCell sx={{ ...tableStyles.cell, width: '5%', pl: 5 }}><Typography sx={tableStyles.typography}>Startup Code</Typography></TableCell>
              )}

              {filter === 'pending' && (
                <>
                  <TableCell sx={{ ...tableStyles.cell, width: '10%' }}><Typography sx={tableStyles.typography}>Application Date</Typography></TableCell>
                </>
              )}

              <TableCell sx={{ width: '10%', pl: 8 }}><Typography sx={tableStyles.typography}>Startup Name</Typography></TableCell>

              {/* Show Industry and Location for non-pending status */}
              {filter !== 'pending' && (
                <>
                  <TableCell sx={{ ...tableStyles.cell, width: '10%' }}><Typography sx={tableStyles.typography}>Industry</Typography></TableCell>
                  <TableCell sx={{ width: '15%' }}><Typography sx={tableStyles.typography}>Location</Typography></TableCell>
                </>
              )}

              {/* Show Status and Message for Pending Requests */}
              {filter === 'pending' && (
                <>
                  <TableCell sx={{ ...tableStyles.cell, width: '10%' }}><Typography sx={tableStyles.typography}>Status</Typography></TableCell>
                  <TableCell sx={{ width: '20%' }}><Typography sx={tableStyles.typography}>Message</Typography></TableCell>
                </>
              )}
              
              <TableCell sx={{ ...tableStyles.cell, width: '10%' }}><Typography sx={tableStyles.typography}>Action</Typography></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredProfiles.length === 0 ? (
              <TableRow sx={{ background: 'white' }}>
                <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    No startup profiles available in this user.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredProfiles
                .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                .map((profile) => (
                  <TableRow key={`${profile.type}-${profile.id}`} sx={{ backgroundColor: 'white' }}>
                    {/* Conditionally render columns based on the filter */}
                    {filter !== 'pending' && (
                      <TableCell sx={{ ...tableStyles.cell, pl: 5 }}>{profile.startupCode}</TableCell>
                    )}
                    <TableCell sx={{ ...tableStyles.cell, display: 'flex', alignItems: 'center', pl: 8 }}>
                      <Avatar src={profile.photo} alt={profile.companyName}
                        sx={{ border: '2px rgba(0, 116, 144, 1) solid', borderRadius: 1, mr: 2, width: 40, height: 40 }} 
                        variant="square">
                        {profile.companyName?.charAt(0) || ''}
                      </Avatar>
                      {profile?.companyName || '---'}
                    </TableCell>

                    {/* Show Industry and Location for non-pending status */}
                    {filter !== 'pending' && (
                      <>
                        <TableCell sx={tableStyles.cell}>{profile.industry}</TableCell>
                        <TableCell>
                          <span>
                            {profile.locationName || (
                              <>
                                No location selected at the moment.{' '}
                                <span
                                  style={{ color: '#336FB0', textDecoration: 'underline', cursor: 'pointer' }}
                                  onClick={() => window.location.href = `https://startupsphere.mugnavo.com/startup/${profile.id}`}
                                >
                                  Set Location
                                </span>
                              </>
                            )}
                          </span>
                        </TableCell>
                      </>
                    )}

                    {/* Show Status and Message for Pending Requests */}
                    {filter === 'pending' && (
                      <>
                        <TableCell sx={tableStyles.cell}>{profile.status || 'Pending'}</TableCell>
                        <TableCell>{profile.message || 'No message available'}</TableCell>
                      </>
                    )}

                    <TableCell sx={tableStyles.cell}>
                      <Box>
                        <Button variant="contained" sx={tableStyles.actionButton} onClick={() => handleOpenStartUp(profile)}>View</Button>
                        <Button variant="text" sx={tableStyles.deleteButton} onClick={() => handleOpenDeleteDialog(profile)}>Delete</Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2, background: 'white' }}>
          <Pagination count={totalPageCount} page={page} onChange={handleChangePage} size="medium" />
        </Box>
      </TableContainer>

      <ViewStartupProfileDialog open={openViewStartup} profile={selectedBusinessProfile} onClose={handleCloseStartUp} />
      <ConfirmDeleteDialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} onConfirm={handleSoftDelete}
        companyName={profileToDelete ? profileToDelete.companyName : null} />
    </Box>
  );
}

export default BusinessProfileTable;