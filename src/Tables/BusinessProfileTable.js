import React, { useState } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Pagination, Avatar, } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import CancelIcon from '@mui/icons-material/Cancel';
import ViewStartupProfileDialog from "../Dialogs/ViewStartupProfileDialog";
import ConfirmDeleteDialog from "../Dialogs/ConfirmDeleteProfileDialog";
import { tableStyles } from "../styles/tables";

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
  profileToDelete,
  handleOpenCancelDialog,
}) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const totalPageCount = Math.ceil(businessProfiles.length / rowsPerPage);

  return (
    <Box component="main" sx={{ display: "flex", flexDirection: "column" }}>
      <TableContainer sx={tableStyles.container}>
        <Table>
          <TableHead sx={tableStyles.head}>
            <TableRow>
              <TableCell sx={{ width: "2%" }}><Typography sx={tableStyles.typography}>Status</Typography></TableCell>
              <TableCell sx={{ ...tableStyles.cell, width: "5%", pl: 5 }}><Typography sx={tableStyles.typography}>Startup Code</Typography></TableCell>
              <TableCell sx={{ width: "10%", pl: 8 }}><Typography sx={tableStyles.typography}>Startup Name</Typography></TableCell>
              <TableCell sx={{ width: "15%" }}><Typography sx={tableStyles.typography}>Location</Typography></TableCell>
              <TableCell sx={{ ...tableStyles.cell, width: "10%" }}><Typography sx={tableStyles.typography}>Action</Typography></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {businessProfiles.length === 0 ? (
              <TableRow sx={{ background: "white" }}>
                <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                  <Typography variant="body2" color="textSecondary">
                    No startup profiles available in this user.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              businessProfiles
                .filter((profile) => profile.status !== "cancelled")
                .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                .map((profile) => (
                  <TableRow key={`${profile.type}-${profile.id}`} sx={{ backgroundColor: "white" }}>
                    <TableCell sx={{ ...tableStyles.cell }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {profile.status === "approved" && (
                          <CheckCircleIcon sx={{ color: "green", mr: 1 }} />
                        )}
                        {profile.status === "pending" && (
                          <HourglassBottomIcon sx={{ color: "orange", mr: 1 }} />
                        )}
                        {profile.status === "rejected" && (
                          <CancelIcon sx={{ color: "red", mr: 1 }} />
                        )}
                        <Typography variant="body2">{profile.status}</Typography>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ ...tableStyles.cell }}>{profile.startupCode}</TableCell>

                    <TableCell sx={{ ...tableStyles.cell, display: "flex", alignItems: "center", pl: 8, }}>
                      <Avatar src={profile.photo} alt={profile.companyName}
                        sx={{ border: "2px rgba(0, 116, 144, 1) solid", borderRadius: 1, mr: 2, width: 40, height: 40, }} variant="square">
                        {profile.companyName?.charAt(0) || ""}
                      </Avatar>
                      {profile?.companyName || "---"}
                    </TableCell>

                    <TableCell>
                      <span>
                        {profile.locationName || (
                          <>
                            No location selected at the moment.{" "}
                            <span
                              style={{
                                color: "#336FB0",
                                textDecoration: "underline",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                (window.location.href = `https://startupsphere.mugnavo.com/startup/${profile.id}`)
                              }>
                              Set Location
                            </span>
                          </>
                        )}
                      </span>
                    </TableCell>

                    <TableCell sx={tableStyles.cell}>
                      <Box>
                        {profile.status === "pending" && (
                          <Button variant="text" sx={tableStyles.deleteButton} onClick={() => handleOpenCancelDialog(profile)}>Cancel</Button>
                        )}

                        {profile.status === "rejected" ? (
                          <></>
                        ) : (
                          profile.status === "approved" && (
                            <>
                              <Button variant="contained" sx={tableStyles.actionButton} onClick={() => handleOpenStartUp(profile)}>View</Button>
                              <Button variant="text" sx={tableStyles.deleteButton} onClick={() => handleOpenDeleteDialog(profile)}>Delete</Button>
                            </>
                          )
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>

        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 2, background: "white", }}>
          <Pagination count={totalPageCount} page={page} onChange={handleChangePage} size="medium"/>
        </Box>
      </TableContainer>

      <ViewStartupProfileDialog open={openViewStartup} profile={selectedBusinessProfile} onClose={handleCloseStartUp} />
      <ConfirmDeleteDialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} 
      onConfirm={handleSoftDelete}companyName={profileToDelete ? profileToDelete.companyName : null} />
    </Box>
  );
}

export default BusinessProfileTable;