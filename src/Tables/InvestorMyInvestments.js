import React from 'react';
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Avatar, TableContainer, Paper, Stack, Pagination, Box, Button } from "@mui/material";
import { tableStyles } from '../styles/tables';
import Papa from 'papaparse';
import DescriptionIcon from '@mui/icons-material/Description';

const InvestmentTable = ({ filteredRows, page, rowsPerPage, handleRowClick, profilePictures, handleChangePage }) => {
  const calculateInvestmentData = (row) => {
    const acceptedInvestors = row.capTableInvestors.filter(investor => investor.status === 'accepted');
    const totalShares = acceptedInvestors.reduce((sum, investor) => sum + Number(investor.shares), 0);
    const totalInvestment = acceptedInvestors.reduce((sum, investor) => sum + Number(investor.totalInvestment), 0);
    const overallTotalShares = row.moneyRaised / row.minimumShare;
    const percentage = overallTotalShares > 0 ? ((totalShares / overallTotalShares) * 100).toFixed(2) : '0.00';

    return { totalShares, totalInvestment, percentage };
  };

  const getInvestmentHeaders = () => {
    return ['Startup Name', 'Funding Name', 'Type', 'Shares', 'Total Investment'];
  };

  const handleDownloadCSV = () => {

    const csvData = filteredRows.map((row) => {
      const { totalShares, totalInvestment, percentage } = calculateInvestmentData(row);
      return {
        'Startup Name': row.startupName,
        'Funding Name': row.fundingName,
        'Type': row.fundingType,
        'Shares': totalShares,
        'Total Investment': `${row.moneyRaisedCurrency} ${totalInvestment.toFixed(2)}`
      };
    });

    const headers = getInvestmentHeaders();

    // const csvString = parse(csvData, { header: true }).data.join('\n');
    const csvFile = Papa.unparse(csvData, {
      headers: headers,
    });

    const blob = new Blob(["\uFEFF" + csvFile], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download   = 'Investment Summary.csv';
    link.click();

    window.URL.revokeObjectURL(url);
  };

  // Calculate total shares and total investment for all rows
  const totalShares = filteredRows.reduce((sum, row) => {
    const { totalShares } = calculateInvestmentData(row);
    return sum + totalShares;
  }, 0);

  const totalInvestment = filteredRows.reduce((sum, row) => {
    const { totalInvestment } = calculateInvestmentData(row);
    return sum + totalInvestment;
  }, 0);


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', }}>
        <Button variant="contained" onClick={handleDownloadCSV} sx={{ mt: 3, background: '#336FB0', textTransform: 'none' }}>
          <DescriptionIcon sx={{ mr: 1 }} />Generate Report
        </Button>
      </Box>

      {/* Investment Table */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table sx={tableStyles} aria-label="investments table">
          <TableHead sx={tableStyles.head}>
            <TableRow>
              <TableCell>
                <Typography sx={{ fontWeight: 'bold', color: 'white', ml: 5 }}>Startup Name</Typography>
              </TableCell>
              <TableCell sx={tableStyles.head}>
                <Typography sx={tableStyles.typography}>Funding Name</Typography>
              </TableCell>
              <TableCell sx={tableStyles.head}>
                <Typography sx={tableStyles.typography}>Type</Typography>
              </TableCell>
              <TableCell sx={tableStyles.head}>
                <Typography sx={tableStyles.typography}>Shares</Typography>
              </TableCell>
              <TableCell sx={tableStyles.head}>
                <Typography sx={tableStyles.typography}>Total Investment</Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredRows.length > 0 ? (
              filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row) => {
                const { totalShares, totalInvestment, percentage } = calculateInvestmentData(row);

                return (
                  <TableRow key={row.id} hover onClick={() => handleRowClick(row)} sx={{ cursor: 'pointer' }}>
                    <TableCell sx={{ ...tableStyles.cell, width: '20%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', ml: 5 }}>
                        <Avatar src={profilePictures[row.startupId]} sx={{ mr: 2, border: '2px rgba(0, 116, 144, 1) solid', borderRadius: 1 }} variant='square' />
                        {row.startupName}
                      </Box>
                    </TableCell>
                    <TableCell sx={tableStyles.cell}>{row.fundingName}</TableCell>
                    <TableCell sx={tableStyles.cell}>{row.fundingType}</TableCell>
                    <TableCell sx={tableStyles.cell}>{Number(totalShares).toLocaleString()}</TableCell>
                    <TableCell sx={tableStyles.cell}>{row.moneyRaisedCurrency} {Number(totalInvestment).toLocaleString()}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    You currently have no active investments.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {/* Total Row */}
            {filteredRows.length > 0 && (
              <TableRow>
                <TableCell colSpan={2} />
                <TableCell sx={{...tableStyles.cell, fontWeight: 'bold'}}>Total</TableCell>
                <TableCell sx={{...tableStyles.cell, fontWeight: 'bold'}}>{totalShares.toLocaleString()}</TableCell>
                <TableCell sx={{...tableStyles.cell, fontWeight: 'bold'}}>{filteredRows[0]?.moneyRaisedCurrency} {totalInvestment.toLocaleString()}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {filteredRows.length > 0 && (
          <Stack spacing={2} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <Pagination count={Math.ceil(filteredRows.length / rowsPerPage)} page={page} onChange={handleChangePage} size="medium" />
          </Stack>
        )}
      </TableContainer>
    
    </Box>
  );
};

export default InvestmentTable;