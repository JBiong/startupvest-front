import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Select, MenuItem, Grid, FormControl, FormHelperText, Autocomplete, Link } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import currencyOptions from '../static/currencyOptions';
import fundingOptions from '../static/fundingOptions';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';
import SuccessCreateFundingRoundDialog from '../Dialogs/SuccessCreateFundingRoundDialog';
import CreateBusinessProfileDialog from "../Dialogs/CreateBusinessProfileDialog";

import { logActivity } from '../utils/activityUtils';

function CreateFundingRound({ onSuccess }) {
    const [startups, setStartups] = useState([]);
    const [selectedStartupId, setSelectedStartupId] = useState('');
    const [fundingType, setFundingType] = useState('');
    const [fundingName, setFundingName] = useState('');
    const [announcedMonth, setAnnouncedMonth] = useState('');
    const [announcedDay, setAnnouncedDay] = useState('');
    const [announcedYear, setAnnouncedYear] = useState('');
    const [closedMonth, setClosedMonth] = useState('');
    const [closedDay, setClosedDay] = useState('');
    const [closedYear, setClosedYear] = useState('');
    const [moneyRaised, setMoneyRaised] = useState(0);
    const [currency, setCurrency] = useState('₱'); 
    const [targetFunding, setTargetFunding] = useState('');
    const [preMoneyValuation, setPreMoneyValuation] = useState('');
    const [minimumShare, setMinimumShare] = useState('');
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const RequiredAsterisk = <span style={{ color: 'red' }}>*</span>;
    const [openCreateBusinessProfile, setCreateBusinessProfile] = useState(false);

    const selectedStartup = startups.find(startup => startup.id === selectedStartupId);
    const selectedCompanyName = selectedStartup ? selectedStartup.companyName : '';

    // CAP TABLE
    const [allInvestors, setAllInvestors] = useState([]);
    const [investors, setInvestors] = useState([{ name: null, title: '', shares: '' }]);
    const [errors, setErrors] = useState({});

    const days = [...Array(31).keys()].map(i => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => {
        return new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(2000, i, 1));
    });
    const years = [...Array(51).keys()].map(i => new Date().getFullYear() + i);

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
                setAllInvestors(response.data);
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
        if (!announcedMonth) newErrors.announcedMonth = requiredErrorMessage;
        if (!announcedDay) newErrors.announcedDay = requiredErrorMessage;
        if (!announcedYear) newErrors.announcedYear = requiredErrorMessage;
        if (!closedMonth) newErrors.closedMonth = requiredErrorMessage;
        if (!closedDay) newErrors.closedDay = requiredErrorMessage;
        if (!closedYear) newErrors.closedYear = requiredErrorMessage;
        if (!targetFunding) newErrors.targetFunding = requiredErrorMessage;
        if (!preMoneyValuation) newErrors.preMoneyValuation = requiredErrorMessage;
        if (!minimumShare) newErrors.minimumShare = requiredErrorMessage;

        // Check if closedYear is earlier than announcedYear
        if (announcedYear && closedYear && parseInt(closedYear) < parseInt(announcedYear)) {
            newErrors.closedYear = 'Closed year can\'t be before announced year.';
        }

        // If the years are the same, check the months and days
        if (announcedYear && closedYear && parseInt(closedYear) === parseInt(announcedYear)) {
            if (closedMonth < announcedMonth) {
                newErrors.closedMonth = 'Closed month can\'t be before announced month.';
            } else if (closedMonth === announcedMonth && closedDay < announcedDay) {
                newErrors.closedDay = 'Closed day can\'t be before announced day.';
            }
        }

        setErrors(newErrors); 
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateFundingRound = async () => {
        if (!validateForm()) return;

        try {
            const selectedInvestors = investors
                .filter(investor => investor.name && investor.name.id !== null)
                .map(investor => ({
                    id: investor.name.id,
                    title: investor.title,
                    shares: parseInt(parseFormattedNumber(investor.shares), 10)
                }));
                console.log("Selected Investors",selectedInvestors);

            const moneyRaised = selectedInvestors.reduce((acc, investor) => acc + investor.shares, 0);
            setMoneyRaised(moneyRaised);

            const formData = {
                startup: { id: selectedStartupId },
                fundingType,
                fundingName,
                announcedDate: `${announcedYear}-${announcedMonth}-${announcedDay}`,
                closedDate: `${closedYear}-${closedMonth}-${closedDay}`,
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

    const handleOpenBusinessProfile = () => {
        setCreateBusinessProfile(true); 
    };

    const handleCloseBusinessProfile = async () => {
        setCreateBusinessProfile(false);
        window.location.reload();
    };

    return (
        <Box component="main" sx={{ flexGrow: 1, width: '100%', overflowX: 'hidden', maxWidth: '1000px', background: '#F2F2F2' }}>
            <Typography variant="h5" sx={{ color: '#414a4c', fontWeight: '500', pl: 5, pb: 3 }}>
                Organization
            </Typography>

            <Grid container spacing={3} sx={{ ml: 2 }}>
                <Grid item xs={12} sm={11}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <label>Startup Name {RequiredAsterisk}</label>
                            <FormControl fullWidth variant="outlined" error={!!errors.selectedStartupId}>
                                <Select fullWidth variant="outlined" value={selectedStartupId}
                                    onChange={(e) => setSelectedStartupId(e.target.value)}
                                    sx={{ height: '45px' }}>
                                    {startups.map((startup) => (
                                        <MenuItem key={startup.id} value={startup.id}>{startup.companyName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {errors.selectedStartupId && (
                                <FormHelperText sx={{ color: 'red' }}>
                                    {errors.selectedStartupId}
                                </FormHelperText>
                            )}

                            {startups.length === 0 && (
                                <FormHelperText sx={{ color: 'red', marginTop: '8px' }}>
                                You currently do not have any startups associated with your account. Would you like to &nbsp;
                                <span 
                                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} 
                                    onClick={handleOpenBusinessProfile}>
                                     create one?
                                </span>
                            </FormHelperText>
                            )}
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
                                sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }} />
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

                        <Grid item xs={4}>
                            <label><b>Announced Date {RequiredAsterisk}</b><br />Month</label>
                            <FormControl fullWidth variant="outlined" error={!!errors.announcedMonth}>
                                <Select labelId="month-label" value={announcedMonth} onChange={(e) => setAnnouncedMonth(e.target.value)} sx={{ height: '45px' }}>
                                    {months.map((month, index) => (
                                        <MenuItem key={index} value={index + 1}>{month}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {errors.announcedMonth && <FormHelperText sx={{color:'red'}}>{errors.announcedMonth}</FormHelperText>}
                        </Grid>

                        <Grid item xs={4}>
                            <label><br />Day</label>
                            <FormControl fullWidth variant="outlined" error={!!errors.announcedDay}>
                                <Select labelId="day-label" value={announcedDay} onChange={(e) => setAnnouncedDay(e.target.value)} sx={{ height: '45px' }}>
                                    {days.map((day) => (
                                        <MenuItem key={day} value={day}>{day}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {errors.announcedDay && <FormHelperText sx={{color:'red'}}>{errors.announcedDay}</FormHelperText>}
                        </Grid>

                        <Grid item xs={4}>
                            <label><br />Year</label>
                            <FormControl fullWidth variant="outlined" error={!!errors.announcedYear}>
                                <Select labelId="year-label" value={announcedYear} onChange={(e) => setAnnouncedYear(e.target.value)} sx={{ height: '45px' }}>
                                    {years.map((year) => (
                                        <MenuItem key={year} value={year}>{year}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {errors.announcedYear && <FormHelperText sx={{color:'red'}}>{errors.announcedYear}</FormHelperText>}
                        </Grid>

                        <Grid item xs={4}>
                            <label><b>Closed on Date {RequiredAsterisk}</b><br />Month</label>
                            <FormControl fullWidth variant="outlined" error={!!errors.closedMonth}>
                                <Select labelId="month-label" value={closedMonth} onChange={(e) => setClosedMonth(e.target.value)} sx={{ height: '45px' }}>
                                    {months.map((month, index) => (
                                        <MenuItem key={index} value={index + 1}>{month}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {errors.closedMonth && <FormHelperText sx={{color:'red'}}>{errors.closedMonth}</FormHelperText>}
                        </Grid>

                        <Grid item xs={4}>
                            <label><br />Day</label>
                            <FormControl fullWidth variant="outlined" error={!!errors.closedDay}>
                                <Select labelId="day-label" value={closedDay} onChange={(e) => setClosedDay(e.target.value)} sx={{ height: '45px' }}>
                                    {days.map((day) => (
                                        <MenuItem key={day} value={day}>{day}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {errors.closedDay && <FormHelperText sx={{color:'red'}}>{errors.closedDay}</FormHelperText>}
                        </Grid>

                        <Grid item xs={4}>
                            <label><br />Year</label>
                            <FormControl fullWidth variant="outlined" error={!!errors.closedYear}>
                                <Select labelId="year-label" value={closedYear} onChange={(e) => setClosedYear(e.target.value)} sx={{ height: '45px' }}>
                                    {years.map((year) => (
                                        <MenuItem key={year} value={year}>{year}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {errors.closedYear && <FormHelperText sx={{color:'red'}}>{errors.closedYear}</FormHelperText>}
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
            style={{ marginLeft: '80.56%' }} onClick={handleCreateFundingRound}>
                Create Round
            </Button>

            <CreateBusinessProfileDialog open={openCreateBusinessProfile} onClose={handleCloseBusinessProfile} />

            {/* Success Dialog */}
            <SuccessCreateFundingRoundDialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}
                selectedStartupId={selectedStartupId}
                fundingType={fundingType}
                companyName={selectedCompanyName} />
        </Box>
    );
}

export default CreateFundingRound;