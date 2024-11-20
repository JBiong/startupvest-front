import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Select, MenuItem, Grid, FormControl, FormHelperText, Autocomplete } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import currencyOptions from '../static/currencyOptions';
import fundingOptions from '../static/fundingOptions';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';
import SuccessCreateFundingRoundDialog from '../Dialogs/SuccessCreateFundingRoundDialog';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import { logActivity } from '../utils/activityUtils';

function CreateFundingRound({ onSuccess }) {
    const [startups, setStartups] = useState([]);
    const [selectedStartupId, setSelectedStartupId] = useState('');
    const [fundingType, setFundingType] = useState('');
    const [fundingName, setFundingName] = useState('');
    const [announcedDate, setAnnouncedDate] = useState(dayjs());
    const [closedDate, setClosedDate] = useState(null);
    const [moneyRaised, setMoneyRaised] = useState(0);
    const [currency, setCurrency] = useState('₱'); 
    const [targetFunding, setTargetFunding] = useState('');
    const [preMoneyValuation, setPreMoneyValuation] = useState('');
    const [minimumShare, setMinimumShare] = useState('');
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const RequiredAsterisk = <span style={{ color: 'red' }}>*</span>;
    const [loading, setLoading] = useState(false);

    const selectedStartup = startups.find(startup => startup.id === selectedStartupId);
    const selectedCompanyName = selectedStartup ? selectedStartup.companyName : '';

    const today = dayjs();
    const twoYearsLater = today.add(2, 'year');

    // CAP TABLE
    const [allInvestors, setAllInvestors] = useState([]);
    const [investors, setInvestors] = useState([{ name: null, title: '', shares: '' }]);
    const [errors, setErrors] = useState({});

    const handleAnnouncedDateChange = (newDate) => {
        setAnnouncedDate(newDate);
    };
    
    const handleDateChange = (newDate) => {
        setClosedDate(newDate);
        
        if (!newDate) {
          setErrors({ closedDate: 'Please select a valid date' });
        } else {
          setErrors({ closedDate: '' });
        }
    };

    const formattedDateClosed = closedDate ? dayjs(closedDate).format('MMMM D, YYYY') : '';
    const formattedDateAnnounced = closedDate ? dayjs(announcedDate).format('MMMM D, YYYY') : '';

    useEffect(() => {
        const fetchStartups = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/startups`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setStartups(response.data);
            } catch (error) {
                console.error('Error fetching startups:', error);
            }
        };

        const fetchInvestors = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/investors/All`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const verifiedInvestors = response.data.filter(investor => investor.user.isVerified);
                setAllInvestors(verifiedInvestors);
            } catch (error) {
                console.error('Error fetching investors:', error);
            }
        };

        fetchStartups();
        fetchInvestors();
    }, []);

    const handleInvestorChange = (index, field, value) => {
        const updatedInvestors = [...investors];
        updatedInvestors[index][field] = value;
        setInvestors(updatedInvestors);
    };

    const handleAddInvestor = () => {
        setInvestors([...investors, { name: null, title: '', shares: '' }]);
    };

    const validateForm = () => {
        const requiredErrorMessage = 'This field cannot be empty.';
        const newErrors = {};

        if (!selectedStartupId) newErrors.selectedStartupId = requiredErrorMessage;
        if (!fundingName) newErrors.fundingName = requiredErrorMessage;
        if (!fundingType) newErrors.fundingType = requiredErrorMessage;
        if (!announcedDate) newErrors.announcedDate = requiredErrorMessage;
        if (!closedDate) newErrors.closedDate = requiredErrorMessage;
        if (!targetFunding) newErrors.targetFunding = requiredErrorMessage;
        if (!preMoneyValuation) newErrors.preMoneyValuation = requiredErrorMessage;
        if (!minimumShare) newErrors.minimumShare = requiredErrorMessage;

        setErrors(newErrors); 
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateFundingRound = async () => {
        if (loading) return;
        setLoading(true);
        
        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const selectedInvestors = investors
                .filter(investor => investor.name && investor.name.id !== null)
                .map(investor => ({
                    id: investor.name.id,
                    title: investor.title,
                    shares: parseInt(parseFormattedNumber(investor.shares), 10)
                }));

            const moneyRaised = selectedInvestors.reduce((acc, investor) => acc + investor.shares, 0);
            setMoneyRaised(moneyRaised);

            const formData = {
                startup: { id: selectedStartupId },
                fundingType,
                fundingName,
                announcedDate: formattedDateAnnounced,
                closedDate: formattedDateClosed,
                moneyRaised,
                moneyRaisedCurrency: currency,
                targetFunding: parseFloat(parseFormattedNumber(targetFunding)),
                preMoneyValuation: parseFloat(parseFormattedNumber(preMoneyValuation)),
                minimumShare: parseFloat(parseFormattedNumber(minimumShare)),
                investors: selectedInvestors,
                shares: selectedInvestors.map(investor => investor.shares),
                titles: selectedInvestors.map(investor => investor.title),
                userId: localStorage.getItem('userId')
            };

            await axios.post(`${process.env.REACT_APP_API_URL}/funding-rounds/createfund`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            setSuccessDialogOpen(true);

            await logActivity(
                `${selectedCompanyName} funding round created successfully.`,
                `${fundingType} funding round created.`
            );

            setTimeout(() => {
                setSuccessDialogOpen(false);
                onSuccess();
            }, 1500);
        } catch (error) {
            console.error('Failed to create funding round:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNumericChange = (values, sourceInfo) => {
        const { formattedValue, floatValue } = values;
        switch (sourceInfo.source) {
            case 'targetFunding':
                setTargetFunding(formattedValue);
                break;
            case 'preMoneyValuation':
                setPreMoneyValuation(formattedValue);
                break;
            case 'minimumShare':
                setMinimumShare(formattedValue);
                break;
            default:
                break;
        }
    };

    const handleSharesChange = (index, values) => {
        const { formattedValue } = values;
        const updatedInvestors = [...investors];
        updatedInvestors[index].shares = formattedValue;
        setInvestors(updatedInvestors);
    };

    const handleRemoveInvestor = (index) => {
        const updatedInvestors = [...investors];
        updatedInvestors.splice(index, 1);
        setInvestors(updatedInvestors);
    };
      
    const parseFormattedNumber = (value) => {
        return value.replace(/,/g, '');
    };

    return (
        <Box component="main" sx={{ flexGrow: 1, width: '100%', overflowX: 'hidden', maxWidth: '1000px', background: '#F2F2F2' }}>
            <Typography variant="h5" sx={{ color: '#414a4c', fontWeight: '500', pl: 5, pb: 3 }}>Organization</Typography>

            <Grid container spacing={3} sx={{ ml: 2 }}>
                <Grid item xs={12} sm={11}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <label>Startup Name {RequiredAsterisk}</label>
                            <FormControl fullWidth variant="outlined" error={!!errors.selectedStartupId}>
                                <Select fullWidth variant="outlined" value={selectedStartupId}
                                    onChange={(e) => setSelectedStartupId(e.target.value)}
                                    sx={{ height: '45px' }}>
                                    {startups
                                    .filter((row) => row.status === 'approved')
                                    .map((startup) => (
                                        <MenuItem key={startup.id} value={startup.id}>{startup.companyName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {errors.selectedStartupId && <FormHelperText sx={{color:'red'}}>{errors.selectedStartupId}</FormHelperText>}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Typography variant="h5" sx={{ color: '#414a4c', fontWeight: '500', pl: 5, pt: 3, pb: 3 }}>
                Add Funding Round Details
            </Typography>

            <Grid container spacing={3} sx={{ ml: 2 }}>
                <Grid item xs={12} sm={11}>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <label>Funding Name {RequiredAsterisk}</label>
                            <FormControl fullWidth variant="outlined" error={!!errors.fundingName}>
                            <TextField fullWidth variant="outlined"
                                value={fundingName} onChange={(e) => setFundingName(e.target.value)}
                                sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                                error={!!errors.fundingName} />
                            </FormControl>
                            {errors.fundingName && <FormHelperText sx={{color:'red'}}>{errors.fundingName}</FormHelperText>}
                        </Grid>

                        <Grid item xs={4}>
                            <label>Funding Type {RequiredAsterisk}</label>
                            <FormControl fullWidth variant="outlined" error={!!errors.fundingType}>
                                <Select fullWidth variant="outlined" value={fundingType} onChange={(e) => setFundingType(e.target.value)} sx={{ height: '45px' }}>
                                {fundingOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                            {errors.fundingType && <FormHelperText sx={{color:'red'}}>{errors.fundingType}</FormHelperText>}
                        </Grid>

                        <Grid item xs={6}>
                            <label>Opening Date {RequiredAsterisk} <br /></label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker value={announcedDate} onChange={handleAnnouncedDateChange} disabled
                                    renderInput={(params) => (
                                        <TextField {...params} error={!!errors.announcedDate} helperText={errors.announcedDate} />
                                    )}
                                    sx={{ width: '100%', height: '45px', '& .MuiInputBase-root': { height: '45px', padding: '0px 14px' } }}/>
                            </LocalizationProvider>
                            {errors.announcedDate && (<FormHelperText error>{errors.announcedDate}</FormHelperText>)}
                        </Grid>

                        <Grid item xs={6}>
                            <label>Closed on Date {RequiredAsterisk} <br /></label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker value={closedDate} onChange={handleDateChange} minDate={today} maxDate={twoYearsLater}
                                    renderInput={(params) => (
                                    <TextField {...params} error={!!errors.closedDate} helperText={errors.closedDate} />
                                    )}
                                    sx={{ width: '100%', height: '45px', '& .MuiInputBase-root': { height: '45px', padding: '0px 14px', } }} />
                            </LocalizationProvider>
                            {errors.closedDate && (<FormHelperText error>{errors.closedDate}</FormHelperText>)}
                        </Grid>

                        <Grid item xs={8}>
                            <label>Target Funding Amount {RequiredAsterisk}</label>
                            <FormControl fullWidth variant="outlined" error={!!errors.targetFunding}>
                                <NumericFormat
                                    customInput={TextField}
                                    thousandSeparator={true}
                                    value={targetFunding}
                                    onValueChange={(values) => handleNumericChange(values, { source: 'targetFunding' })}
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.targetFunding}
                                    sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                                />
                            </FormControl>
                            {errors.targetFunding && <FormHelperText sx={{color:'red'}}>{errors.targetFunding}</FormHelperText>}
                        </Grid>
                        <Grid item xs={4}>
                            <label>Currency</label>
                            <Select fullWidth variant="outlined" value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                sx={{ height: '45px' }}>
                                {currencyOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>

                        <Grid item xs={12}>
                            <label>Pre-Money Valuation {RequiredAsterisk}</label>
                            <FormControl fullWidth variant="outlined" error={!!errors.preMoneyValuation}>
                                <NumericFormat
                                    customInput={TextField}
                                    thousandSeparator={true}
                                    value={preMoneyValuation}
                                    onValueChange={(values) => handleNumericChange(values, { source: 'preMoneyValuation' })}
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.preMoneyValuation}
                                    sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                                />
                            </FormControl>
                            {errors.preMoneyValuation && <FormHelperText sx={{color:'red'}}>{errors.preMoneyValuation}</FormHelperText>}
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Typography sx={{ color: '#336FB0'}}>
                            The price per share refers to the amount of money you need to pay to purchase one share of a company's stock. For example, if the price per share is P10,000, you would need to invest P10,000 to acquire a single share in that company.                            
                            </Typography>
                        </Grid>

                        <Grid item xs={8}>
                            <label>Price per Share {RequiredAsterisk}</label>
                            <FormControl fullWidth variant="outlined" error={!!errors.minimumShare}>
                                <NumericFormat
                                    customInput={TextField}
                                    thousandSeparator={true}
                                    value={minimumShare}
                                    onValueChange={(values) => handleNumericChange(values, { source: 'minimumShare' })}
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.minimumShare}
                                    sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                                />
                            </FormControl>
                            {errors.minimumShare && <FormHelperText sx={{color:'red'}}>{errors.minimumShare}</FormHelperText>}
                        </Grid>
                        <Grid item xs={4}>
                            <label>Currency</label>
                            <Select fullWidth variant="outlined" value={currency}
                                onChange={(e) => setCurrency(e.target.value)} disabled
                                sx={{ height: '45px' }}>
                                {currencyOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Typography variant="h5" sx={{ color: '#414a4c', fontWeight: '500', pl: 5, pt: 3, pb: 3 }}>
                Add Investors to this Funding Round
            </Typography>

            <Grid container spacing={3} sx={{ ml: 2 }}>
                {investors.map((investor, index) => (
                    <Grid item xs={12} sm={11} key={index}>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <label>Shareholder's Name</label>
                                <Autocomplete options={allInvestors}
                                    getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                                    value={investor.name ? allInvestors.find((option) => option.id === investor.name.id) : null}
                                    onChange={(event, newValue) => handleInvestorChange(index, 'name', newValue)}
                                    renderInput={(params) => <TextField {...params} variant="outlined" />}
                                    sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }} />
                            </Grid>

                            <Grid item xs={4}>
                                <label>Title</label>
                                <TextField fullWidth variant="outlined" value={investor.title}
                                    onChange={(e) => handleInvestorChange(index, 'title', e.target.value)}
                                    sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}/>
                            </Grid>

                            <Grid item xs={3.5}>
                                <label>Shares</label>
                                <NumericFormat
                                    customInput={TextField}
                                    thousandSeparator={true}
                                    value={investor.shares}
                                    onValueChange={(values) => handleSharesChange(index, values)}
                                    variant="outlined"
                                    fullWidth
                                    sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                                />
                            </Grid>
                            <Grid item xs={.5}>
                                {investors.length > 0 && (
                                    <IconButton  sx = {{ mt: 3 }} color="error" aria-label="remove"
                                        onClick={() => handleRemoveInvestor(index)}> 
                                        <CloseIcon />
                                    </IconButton>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                ))}
                <Grid item xs={12} sm={11}>
                    <Button variant="outlined" sx={{ color: '#336FB0', borderColor: '#336FB0', '&:hover': { color: '#336FB0', borderColor: '#336FB0' } }} 
                    onClick={handleAddInvestor}>
                        Add Investor
                    </Button>
                </Grid>
            </Grid>

            <Button variant="contained" sx={{ background: '#336FB0', '&:hover': { boxShadow: '0 0 10px rgba(0,0,0,0.5)', backgroundColor: '#336FB0' } }} 
            style={{ marginLeft: '80.56%', width: '150px' }} onClick={handleCreateFundingRound} disabled={loading}>
                {loading ? 'Creating...' : 'Create Round'}
            </Button>


            {/* Success Dialog */}
            <SuccessCreateFundingRoundDialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}
                selectedStartupId={selectedStartupId} fundingType={fundingType} companyName={selectedCompanyName} />
        </Box>
    );
}

export default CreateFundingRound;