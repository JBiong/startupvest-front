import React, { useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Pagination, Avatar } from '@mui/material';
import ViewStartupProfileDialog from '../Dialogs/ViewStartupProfileDialog';
import ViewInvestorProfileDialog from '../Dialogs/ViewInvestorProfileDialog';
import ConfirmDeleteDialog from '../Dialogs/ConfirmDeleteProfileDialog';
import { tableStyles } from '../styles/tables';

function BusinessProfileTable({
  businessProfiles,
  handleOpenStartUp,
  handleOpenInvestor,
  handleOpenDeleteDialog,
  selectedBusinessProfile,
  openViewStartup,
  openViewInvestor,
  openDeleteDialog,
  handleCloseStartUp,
  handleCloseInvestor,
  handleCloseDeleteDialog,
  handleSoftDelete,
  profileToDelete
}) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const totalPageCount = Math.ceil(businessProfiles.length / rowsPerPage);

  return (
    <Box component="main" sx={{ display: 'flex', flexDirection: 'column' }}>
      <TableContainer sx={tableStyles.container}>
        <Table>
          <TableHead sx={tableStyles.head}>
            <TableRow>
            <TableCell sx={{...tableStyles.cell, width: '10%' }}>
            <Typography sx={tableStyles.typography}>Type</Typography>
              </TableCell>
              <TableCell sx={{ width: '20%' }}>
                <Typography sx={tableStyles.typography}>Company Name</Typography>
              </TableCell>
              <TableCell sx={{...tableStyles.cell, width: '30%' }}>
              <Typography sx={tableStyles.typography}>Location</Typography>
              </TableCell>
              <TableCell sx={tableStyles.cell}>
                <Typography sx={tableStyles.typography}>Industry</Typography>
              </TableCell>
              <TableCell sx={{...tableStyles.cell, width: '18%' }}>
              <Typography sx={tableStyles.typography}>Action</Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {businessProfiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    No profiles available in this user.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              businessProfiles
                .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                .map((profile) => (
                  <TableRow
                    key={`${profile.type}-${profile.id}`}
                    sx={tableStyles.row(profile.type)}>
                    <TableCell sx={tableStyles.cell}>{profile.type}</TableCell>
                    <TableCell sx={{ ...tableStyles.cell, display: 'flex', alignItems: 'center'}}>
                      <Avatar sx={{ border: '2px rgba(0, 116, 144, 1) solid', borderRadius: 1, mr: 2, justifyContent: 'center' }} variant="square" />
                      {profile && profile.type === 'Investor'
                        ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || '---'
                        : profile?.companyName || '---'}
                    </TableCell>
                    <TableCell sx={tableStyles.cell}>811 Ucma Village, Cebu City, Philippines, 6000</TableCell>
                    <TableCell sx={tableStyles.cell}>{profile.industry}</TableCell>
                    <TableCell sx={tableStyles.cell}>
                      {profile.type === 'Investor' ? (
                        <Button variant="contained" sx={{ width: 'calc(100% - 10px)', ...tableStyles.actionButton }}
                          onClick={() => handleOpenInvestor(profile)}>
                          View
                        </Button>
                      ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <Button variant="contained" sx={{ width: 'calc(50% - 5px)', ...tableStyles.actionButton }}
                            onClick={() => handleOpenStartUp(profile)}>
                            View
                          </Button>
                          <Button variant="text" sx={tableStyles.deleteButton}
                            onClick={() => handleOpenDeleteDialog(profile)}>
                            Delete
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
          <Pagination count={totalPageCount} page={page} onChange={handleChangePage} size="medium" />
        </Box>
      </TableContainer>

      <ViewStartupProfileDialog open={openViewStartup} profile={selectedBusinessProfile} onClose={handleCloseStartUp} />
      <ViewInvestorProfileDialog open={openViewInvestor} profile={selectedBusinessProfile} onClose={handleCloseInvestor} />
      <ConfirmDeleteDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleSoftDelete}
        companyName={profileToDelete ? profileToDelete.companyName : null} />
    </Box>
  );
}

export default BusinessProfileTable;