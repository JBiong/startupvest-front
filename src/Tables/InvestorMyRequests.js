import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Avatar, Pagination } from '@mui/material';
import axios from 'axios';
import { tableStyles } from '../styles/tables';
import InvestorConfirmationDialog from '../Dialogs/InvestorConfirmationDialog';

function InvestorRequest({ onPendingRequestsCountChange }) {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const requestsPerPage = 5;
  const [profilePictures, setProfilePictures] = useState({});

  useEffect(() => {
    const fetchPendingRequests = async () => {
      const investorId = localStorage.getItem('userId');
      if (!investorId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/cap-table-investor/investor-requests/${investorId}`);
        
        // Filter pending requests
        const pending = response.data.filter(request => request.status === 'pending');
        
        onPendingRequestsCountChange(pending.length);
        
        if (pending.length === 0) {
          setPendingRequests([]); 
        } else {
          setPendingRequests(pending);
          fetchAllProfilePictures(pending);
        }

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch pending requests', error);
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, [onPendingRequestsCountChange]);

  const fetchAllProfilePictures = async (requests) => {
    const pictures = {};
    await Promise.all(
      requests.map(async (request) => {
        if (!request.startupId) return;

        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile-picture/startup/${request.startupId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            responseType: 'blob',
          });
          const imageUrl = URL.createObjectURL(response.data);
          pictures[request.startupId] = imageUrl;
        } catch (error) {
          console.error(`Failed to fetch profile picture for startup ID ${request.startupId}:`, error);
        }
      })
    );
    setProfilePictures(pictures);
  };

  const handleOpenDialog = (request) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirmCancel = async () => {
    const capTableInvestorId = selectedRequest?.capTableInvestorId;

    if (!capTableInvestorId) return;

    try {
      // Call the API to reject the request
      await axios.put(`${process.env.REACT_APP_API_URL}/funding-rounds/${capTableInvestorId}/status`, { status: 'rejected' });

      // Update the local state to remove the canceled request
      setPendingRequests(prevRequests => prevRequests.filter(request => request.capTableInvestorId !== capTableInvestorId));
      onPendingRequestsCountChange(pendingRequests.length - 1);
      handleCloseDialog();
    } catch (error) {
      console.error('Error canceling request:', error);
    }
  };

  const currentPageRequests = pendingRequests.slice((page - 1) * requestsPerPage, page * requestsPerPage);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (loading) {
    return <Typography>Loading...</Typography>; 
  }

  return (
    <Box component="main" sx={{ display: 'flex', flexDirection: 'column', height: '100%', mt: 3 }}>
      <TableContainer sx={tableStyles.container}>
        <Table>
          <TableHead sx={tableStyles.head}>
            <TableRow>
              <TableCell sx={{ ...tableStyles.head }}><Typography sx={tableStyles.typography}>Date</Typography></TableCell>
              <TableCell><Typography sx={tableStyles.typography}>Startup Name</Typography></TableCell>
              <TableCell sx={{ ...tableStyles.head }}><Typography sx={tableStyles.typography}>Shares</Typography></TableCell>
              <TableCell sx={{ ...tableStyles.head }}><Typography sx={tableStyles.typography}>Total Shares</Typography></TableCell>
              <TableCell sx={{ ...tableStyles.head }}><Typography sx={tableStyles.typography}>Status</Typography>
              </TableCell><TableCell sx={{ ...tableStyles.head }}><Typography sx={tableStyles.typography}>Action</Typography></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {currentPageRequests.length > 0 ? (
              currentPageRequests.map((request) => (
                <TableRow key={request.capTableInvestorId} sx={{ backgroundColor: 'white' }}>
                  <TableCell sx={tableStyles.cell}>
                    {formatDate(request.createdAt)}
                  </TableCell>
                  <TableCell sx={{ ...tableStyles.cell, width: '20%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                      <Avatar variant='square'
                        src={profilePictures[request.startupId] || "https://via.placeholder.com/40"}
                        sx={{ mr: 2, border: '2px rgba(0, 116, 144, 1) solid', borderRadius: 1 }}/>
                      {request.startupName}
                    </Box>
                  </TableCell>
                  <TableCell sx={tableStyles.cell}>{formatNumber(request.shares)}</TableCell>
                  <TableCell sx={tableStyles.cell}>{request.currency} {formatNumber(request.totalinvestment)}</TableCell>
                  <TableCell sx={tableStyles.cell}>{request.status}</TableCell>
                  <TableCell sx={tableStyles.cell}>
                    {request.status === 'pending' && (
                      <Button variant="text" sx={tableStyles.rejectButton} onClick={() => handleOpenDialog(request)}>Cancel</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', background: 'white' }}>
                  <Typography variant='body2' color="textSecondary">No pending requests found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {currentPageRequests.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2, background: 'white' }}>
            <Pagination count={Math.ceil(pendingRequests.length / requestsPerPage)} page={page} onChange={handleChangePage} size="medium" />
          </Box>
        )}
      </TableContainer>

      {selectedRequest && (
        <InvestorConfirmationDialog open={dialogOpen} onClose={handleCloseDialog} onConfirm={handleConfirmCancel} companyName={selectedRequest.startupName} />
      )}
    </Box>
  );
}

export default InvestorRequest;