import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Typography, Box, IconButton, Checkbox } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TermsAndConditionsDialog from './TermsAndConditionsDialog';

const InvestNowDialog = ({
  open,
  onClose,
  pricePerShare = 0,
  companyName = '',
  fundingRound = '',
  fundingRoundId,
  investorId,
  targetFunding,
  moneyRaised,
}) => {
  const [shareAmount, setShareAmount] = useState('');
  const [displayShareAmount, setDisplayShareAmount] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  const [errors, setErrors] = useState({});
  const [successDialogOpen, setSuccessDialogOpen] = useState(false); 
  const [isChecked, setIsChecked] = useState(false);
  const [investmentError, setInvestmentError] = useState('');
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  // Function to calculate available shares considering NaN moneyRaised and rounding up
  const calculateAvailableShares = () => {
    // Ensure moneyRaised is a valid number, if not, set it to 0
    const validMoneyRaised = isNaN(moneyRaised) ? 0 : moneyRaised;

    // Available shares = (Target Funding - Money Raised) / Price per Share
    const remainingMoney = targetFunding - validMoneyRaised;
    const remainingShares = remainingMoney / pricePerShare;

    // Round up to the next integer
    return Math.ceil(remainingShares);
  };

      // Get available shares
  const availableShares = calculateAvailableShares();


  useEffect(() => {
    const total = shareAmount ? shareAmount * pricePerShare : 0;
    setTotalCost(total);
  }, [shareAmount, pricePerShare]);

  // Clear state when dialog closes
  const handleClose = () => {
    setShareAmount('');
    setDisplayShareAmount('');
    setIsChecked(false);
    setErrors({});
    onClose();
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleShareAmountChange = (e) => {
    const inputValue = e.target.value.replace(/,/g, '');
    let shares = parseInt(inputValue, 10);
  
    // Check if the input is a valid number and within bounds
    if (isNaN(shares) || shares < 1) {
      setErrors((prev) => ({ ...prev, shareAmount: 'Please enter a valid number.' }));
      setShareAmount('');
      setDisplayShareAmount('');
    } else {
      if (shares > availableShares) {
        setErrors((prev) => ({ ...prev, shareAmount: 'You cannot purchase more shares than the available quantity.' }));
        setShareAmount(''); 
        setDisplayShareAmount(''); 
      } else {
        setErrors((prev) => ({ ...prev, shareAmount: '' })); 
        setShareAmount(shares.toString()); 
        setDisplayShareAmount(formatNumber(shares)); 
      }
    }
  };  

  const handleConfirm = async () => {
    if (shareAmount <= 0) {
      setErrors((prev) => ({ ...prev, shareAmount: 'Please enter a valid number.' }));
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/funding-rounds/${fundingRoundId}/investment`,
        {
          shares: shareAmount,
          investorId: investorId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccessDialogOpen(true);
        setInvestmentError('');
      } else {
        setInvestmentError('Investment failed. Please try again.');
      }
    } catch (error) {
      setInvestmentError('You currently have a pending investment in this funding round. Please wait for its review and acceptance before making any additional investments.');
    }
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
    handleClose(); 
  };

  const handleTermsOpen = () => {
    setTermsDialogOpen(true);
  };

  const handleTermsClose = () => {
    setTermsDialogOpen(false);
  };

  return (
    <>
      {/* Main Investment Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'justify', position: 'relative', mt: 2, ml: 3,}}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Invest in {companyName}
          </Typography>
          <IconButton edge="end" aria-label="close" sx={{ position: 'absolute', right: 15, top: -12, color: '#ED262A' }} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pl: 6, pr: 6 }}>
          <Grid container spacing={1}>
            {/* Investment Information */}
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom align="justify">
                You are about to invest in the <strong>{fundingRound}</strong> funding round conducted by{' '}
                <strong>{companyName}</strong>. The price per share is{' '}
                <strong>₱ {Number(pricePerShare).toLocaleString() || '0'}</strong>.
              </Typography>
            </Grid>

            {/* Shares Input */}
            <Grid item xs={12}>
              <Typography>Number of shares to buy:</Typography>
              <TextField margin="dense" id="share" type="number" fullWidth variant="outlined" placeholder="e.g., 5" value={displayShareAmount}
                onChange={handleShareAmountChange} helperText={errors.shareAmount} error={!!errors.shareAmount}
                inputProps={{ max: availableShares, min: 1 }} />
            </Grid>
            <Typography variant="caption" sx={{ mb: 1, ml: 1, mt: 1}}>Shares Available: <strong>{availableShares}</strong></Typography>

            {/* Investment Summary */}
            <Grid item xs={12}>
              <Box p={3} sx={{ backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Investment Summary</Typography>

                <Typography variant="body2" gutterBottom>
                  You are buying <strong>{(shareAmount <= availableShares && shareAmount > 0) ? shareAmount : 0} shares</strong> at a price of{' '}
                  <strong>₱ {pricePerShare ? Number(pricePerShare).toLocaleString() : '0'}</strong> per share.
                </Typography>

                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  Total cost: ₱
                  {shareAmount <= availableShares && shareAmount > 0
                    ? (pricePerShare * shareAmount).toLocaleString()
                    : '0'}
                </Typography>
              </Box>
            </Grid>

            {/* Terms and Conditions */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox checked={isChecked} onChange={handleCheckboxChange} sx={{ color: '#1976d2' }}/>
                <Typography variant="body2" sx={{ color: '#555'}}>
                  I agree to the 
                  <strong style={{ cursor: 'pointer', color: '#1976d2', marginLeft: '5px' }} onClick={handleTermsOpen}>
                    Terms and Conditions
                  </strong>.
                </Typography>
              </Box>
            </Grid>

            {/* Display Investment Error */}
            {investmentError && (
              <Grid item xs={12}>
                <Typography variant="body2" color="error">
                  {investmentError}
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button onClick={handleConfirm} variant="contained" color="primary" sx={{ px: 8 }}
            disabled={!shareAmount || shareAmount <= 0 || !isChecked || displayShareAmount > availableShares }>
            Confirm Investment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onClose={handleSuccessDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ mt: 2, ml: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Investment Request Submitted</Typography>
        </DialogTitle>

        <DialogContent sx={{ pl: 6, pr: 6 }}>
          <Typography variant="body1"  color="text.secondary" gutterBottom align="justify">
            Congratulations! Your request to invest in <strong>{companyName} - {fundingRound}</strong> has been successfully submitted. The company will reach out to you soon via email with details to finalize your investment. <br/><br/>Thank you for your trust. Rest assured that your request is being processed. Please keep an eye on your inbox for updates!
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 3, justifyContent: 'right' }}>
          <Button onClick={handleSuccessDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <TermsAndConditionsDialog open={termsDialogOpen} onClose={handleTermsClose} />
    </>
  );
};

export default InvestNowDialog;