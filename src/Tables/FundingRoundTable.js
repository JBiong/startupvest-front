import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, FormControl, Select, MenuItem, Stack, Pagination } from '@mui/material';

import ViewFundingRoundDialog from '../Dialogs/ViewFundingRoundDialog';
import ConfirmDeleteDialog from '../Dialogs/ConfirmDeleteFundingRoundDialog';
import { tableStyles } from '../styles/tables';

function FundingRoundTable({
  fundingRounds = [], 
  fundingRowsPerPage = 5, 
  fundingPage = 0,
  handleViewFundingRound,
  handleSoftDeleteFundingRound,
  selectedFundingRoundDetails,
  openViewFundingRound,
  handleCloseFundingProfile,
  businessProfiles,
  onTotalAmountFundedChange,
  onFundingRoundsCountChange,
  onMoneyRaisedCountChange,
  onHighestMoneyRaisedCompanyChange,
}) {
  const [localFundingPage, setLocalFundingPage] = useState(fundingPage);
  const [localFundingRowsPerPage, setLocalFundingRowsPerPage] = useState(fundingRowsPerPage);

  const [openDeleteFundingRoundDialog, setOpenDeleteFundingRoundDialog] = useState(false);
  const [fundingRoundToDelete, setFundingRoundToDelete] = useState(null);
  const [selectedStartupFunding, setSelectedStartupFunding] = useState('All');

  const [filteredFundingRoundsCount, setFilteredFundingRoundsCount] = useState(0);
  const [totalAmountFunded, setTotalAmountFunded] = useState(0);
  const [fundingRoundsWithMoneyRaised, setFundingRoundsWithMoneyRaised] = useState(0);
  const [highestMoneyRaisedCompany, setHighestMoneyRaisedCompany] = useState({ companyName: '', totalMoneyRaised: 0 });

  const handleStartupChangeFunding = (event) => {
    setSelectedStartupFunding(event.target.value);
  };

  const getFundingRoundStatus = (closedDate, moneyRaised, targetFunding) => {
    const today = new Date();

    if (moneyRaised >= targetFunding) {
      return 'Completed';
    }

    return new Date(closedDate) < today ? 'Completed' : 'Ongoing';
  };

  // Get list of startup IDs the user created
  const userCreatedStartupIds = businessProfiles
    .filter(profile => profile.type === 'Startup')
    .map(startup => startup.id);

  // Filter funding rounds based on the selected startup
  const filteredFundingRounds = selectedStartupFunding === 'All'
    ? fundingRounds.filter(round => round.startup && userCreatedStartupIds.includes(round.startup.id))
    : fundingRounds.filter(round => round.startup && round.startup.id === selectedStartupFunding);

  // Sort funding rounds by closedDate in ascending order
  const sortedFundingRounds = filteredFundingRounds.sort((a, b) => new Date(a.closedDate) - new Date(b.closedDate));

  // Calculate the total amount funded and rounds with moneyRaised > 0
  useEffect(() => {
    const totalFunded = sortedFundingRounds.reduce((sum, round) => sum + (round.moneyRaised || 0), 0);
    setTotalAmountFunded(totalFunded);
    setFilteredFundingRoundsCount(sortedFundingRounds.length);
    onTotalAmountFundedChange(totalFunded);

    const roundsWithMoneyRaised = sortedFundingRounds.filter(round => round.moneyRaised > 0).length;
    setFundingRoundsWithMoneyRaised(roundsWithMoneyRaised);
    
    if (onMoneyRaisedCountChange) {
      onMoneyRaisedCountChange(roundsWithMoneyRaised);
    }

    onFundingRoundsCountChange(sortedFundingRounds.length);

    // Calculate and update the highest money raised company
    const companyMoneyRaised = sortedFundingRounds.reduce((acc, round) => {
      const companyId = round.startup?.id;
      if (companyId) {
        if (!acc[companyId]) {
          acc[companyId] = {
            companyName: round.startup.companyName,
            totalMoneyRaised: 0,
          };
        }
        acc[companyId].totalMoneyRaised += round.moneyRaised || 0;
      }
      return acc;
    }, {});

    const highestMoneyRaised = Object.values(companyMoneyRaised).reduce((max, company) => {
      return company.totalMoneyRaised > max.totalMoneyRaised ? company : max;
    }, { companyName: '', totalMoneyRaised: 0 });

    setHighestMoneyRaisedCompany(highestMoneyRaised);

    if (onHighestMoneyRaisedCompanyChange) {
      onHighestMoneyRaisedCompanyChange(highestMoneyRaised);
    }
  }, [sortedFundingRounds, onTotalAmountFundedChange, onFundingRoundsCountChange, onMoneyRaisedCountChange, onHighestMoneyRaisedCompanyChange]);

  const totalMoneyRaised = sortedFundingRounds.reduce((sum, round) => sum + (round.moneyRaised || 0), 0);
  const totalTargetFunding = sortedFundingRounds.reduce((sum, round) => sum + (round.targetFunding || 0), 0);
  const currencySymbol = sortedFundingRounds.length > 0 ? sortedFundingRounds[0].moneyRaisedCurrency : '';

  const formatCurrency = (value) => {
    if (value === undefined || value === null || isNaN(value)) return '';
    return `${currencySymbol} ${Number(value).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const startIndex = localFundingPage * localFundingRowsPerPage;
  const endIndex = startIndex + localFundingRowsPerPage;
  const paginatedFundingRounds = sortedFundingRounds.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedFundingRounds.length / localFundingRowsPerPage);

  const handleOpenDeleteFundingRoundDialog = (round) => {
    setFundingRoundToDelete(round);
    setOpenDeleteFundingRoundDialog(true);
  };

  const handleCloseDeleteFundingRoundDialog = () => {
    setOpenDeleteFundingRoundDialog(false);
    setFundingRoundToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (fundingRoundToDelete) {
      handleSoftDeleteFundingRound(fundingRoundToDelete.id);
      handleCloseDeleteFundingRoundDialog();
    }
  };

  const handleFundingPageChange = (event, newPage) => {
    setLocalFundingPage(newPage - 1);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ pr: 1 }}>Select Startup</Typography>
          <FormControl sx={{ minWidth: 200, background: 'white' }}>
            <Select value={selectedStartupFunding} onChange={handleStartupChangeFunding} variant="outlined" 
              sx={{ minWidth: 100, height: '45px' }}>
              <MenuItem value="All">All</MenuItem>
              {businessProfiles.filter(profile => profile.type === 'Startup')
                .map((startup) => (
                  <MenuItem key={startup.id} value={startup.id}>{startup.companyName}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TableContainer sx={tableStyles.container}>
        <Table>
          <TableHead sx={tableStyles.head}>
            <TableRow>
              <TableCell sx={tableStyles.head}><Typography sx={tableStyles.typography}>Status</Typography></TableCell>
              <TableCell sx={tableStyles.head}><Typography sx={tableStyles.typography}>Closed on Date</Typography></TableCell>
              <TableCell sx={tableStyles.head}><Typography sx={tableStyles.typography}>Funding Name</Typography></TableCell>
              <TableCell sx={tableStyles.head}><Typography sx={tableStyles.typography}>Funding Type</Typography></TableCell>
              <TableCell sx={tableStyles.head}><Typography sx={tableStyles.typography}>Money Raised</Typography></TableCell>
              <TableCell sx={tableStyles.head}><Typography sx={tableStyles.typography}>Target Funding</Typography></TableCell>
              <TableCell sx={tableStyles.head}><Typography sx={tableStyles.typography}>Action</Typography></TableCell>        
            </TableRow>
          </TableHead>
          
          <TableBody>
            {paginatedFundingRounds.length > 0 ? (
              paginatedFundingRounds.map((round) => {                
                return (
                  <TableRow key={round.id}
                  sx={{ backgroundColor: 'white' }}>
                    <TableCell sx={tableStyles.cell}>{getFundingRoundStatus(round.closedDate, round.moneyRaised, round.targetFunding)}</TableCell>
                    <TableCell sx={tableStyles.cell}>{formatDate(round.closedDate)}</TableCell>
                    <TableCell sx={tableStyles.cell}>{round.fundingName}</TableCell>
                    <TableCell sx={tableStyles.cell}>{round.fundingType}</TableCell>
                    <TableCell sx={tableStyles.cell}>{formatCurrency(round.moneyRaised)}</TableCell>
                    <TableCell sx={tableStyles.cell}>{formatCurrency(round.targetFunding)}</TableCell>
                    <TableCell sx={tableStyles.cell}>
                      <Button variant="contained" sx={tableStyles.actionButton} onClick={() => handleViewFundingRound(round.id)}>
                        View
                      </Button>
                      <Button variant="text" sx={tableStyles.deleteButton} 
                        onClick={() => handleOpenDeleteFundingRoundDialog(round)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow sx={{ background: 'white' }}>
                <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    No funding rounds available for your startups.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {paginatedFundingRounds.length > 0 && (
            <TableBody>
              <TableRow sx={{ background: 'white' }}>
                <TableCell sx={tableStyles.cell}></TableCell>
                <TableCell sx={tableStyles.cell}></TableCell>
                <TableCell sx={tableStyles.cell}></TableCell>
                <TableCell sx={tableStyles.cell}><Typography sx={{ fontWeight: 'bold' }}>Total</Typography></TableCell>
                <TableCell sx={{ ...tableStyles.cell, fontWeight: 'bold' }}>{formatCurrency(totalMoneyRaised)}</TableCell>
                <TableCell sx={{ ...tableStyles.cell, fontWeight: 'bold' }}>{formatCurrency(totalTargetFunding)}</TableCell>
                <TableCell sx={tableStyles.cell}></TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>

        <Stack spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2, background: 'white' }}>
          <Pagination count={totalPages} page={localFundingPage + 1} onChange={handleFundingPageChange} size="medium" />
        </Stack>
      </TableContainer>

      <ViewFundingRoundDialog open={openViewFundingRound} fundingRoundDetails={selectedFundingRoundDetails} 
      onClose={handleCloseFundingProfile} />
      
      <ConfirmDeleteDialog open={openDeleteFundingRoundDialog} onClose={handleCloseDeleteFundingRoundDialog} 
      onConfirm={handleConfirmDelete} companyName={fundingRoundToDelete ? fundingRoundToDelete.companyName : ''} />
    </Box>
  );
}

export default FundingRoundTable;