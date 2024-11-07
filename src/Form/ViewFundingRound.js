import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Select, MenuItem, Grid, FormControl, FormHelperText, Autocomplete, Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import fundingOptions from '../static/fundingOptions';
import currencyOptions from '../static/currencyOptions';
import axios from 'axios';
import DescriptionIcon from '@mui/icons-material/Description';
import Papa from 'papaparse';

function ViewFundingRound({ fundingRoundDetails }) {
    const [startups, setStartups] = useState([]);
    const [selectedStartupId, setSelectedStartupId] = useState('');
    const [fundingName, setFundingName] = useState('');
    const [fundingType, setFundingType] = useState('');
    const [announcedMonth, setAnnouncedMonth] = useState('');
    const [announcedDay, setAnnouncedDay] = useState('');
    const [announcedYear, setAnnouncedYear] = useState('');
    const [closedMonth, setClosedMonth] = useState('');
    const [closedDay, setClosedDay] = useState('');
    const [closedYear, setClosedYear] = useState('');
    const [moneyRaised, setMoneyRaised] = useState(0);
    const [currency, setCurrency] = useState(''); 
    const [targetFunding, setTargetFunding] = useState('');
    const [preMoneyValuation, setPreMoneyValuation] = useState('');
    const [minimumShare, setMinimumShare] = useState('');
    const [formattedMoneyRaised, setFormattedMoneyRaised] = useState('');
    const [formattedTargetFunding, setFormattedTargetFunding] = useState('');
    const [formattedPreMoneyValuation, setFormattedPreMoneyValuation] = useState('');
    const [formattedMinimumShare, setFormattedMinimumShare] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);

    //CAP TABLE
    const [allInvestors, setAllInvestors] = useState([]);
    const [investors, setInvestors] = useState([{ name: null, title: '', shares: '', investorRemoved: false }]);
    const [errors, setErrors] = useState({});

    const days = [...Array(31).keys()].map(i => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => {
        return new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(2000, i, 1));
    });
    const years = [...Array(51).keys()].map(i => new Date().getFullYear() + i);

    useEffect(() => {
        console.log('Received Funding Round Details:', fundingRoundDetails); 
    }, [fundingRoundDetails]);

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
        console.log(allInvestors);
    }, []);

    const handleInvestorChange = (index, field, value) => {
        const updatedInvestors = [...investors];
        updatedInvestors[index][field] = value;
        setInvestors(updatedInvestors);

        // Clear the error for this field
        const newErrors = { ...errors };
        if (newErrors.investors && newErrors.investors[index]) {
            newErrors.investors[index][field] = '';
        }
        setErrors(newErrors);
    };

    const validateForm = () => {
        const newErrors = {};
        const emptyFieldError = 'This field cannot be empty';

        // Validate closed date
        if (!closedMonth) newErrors.closedMonth = "Closed month is required.";
        if (!closedDay) newErrors.closedDay = 'Closed day is required.';
        if (!closedYear) newErrors.closedYear = 'Closed year is required.';

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

        // Validate target funding and pre-money valuation
        if (!formattedTargetFunding) newErrors.targetFunding = emptyFieldError;
        if (!formattedPreMoneyValuation) newErrors.preMoneyValuation = emptyFieldError;

        // Validate investors
        const investorErrors = investors.map(investor => ({
            name: !investor.name ? emptyFieldError : '',
            title: !investor.title ? emptyFieldError : '',
            shares: !investor.shares ? emptyFieldError : ''
        }));

        if (investorErrors.some(error => error.name || error.title || error.shares)) {
            newErrors.investors = investorErrors;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddInvestor = () => {
        setInvestors([...investors, { name: '', title: '', shares: '', investorRemoved: false }]);
    };

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const unformatNumber = (str) => {
        return str.replace(/,/g, '');
    };

    const handleSharesChange = (index, value) => {
        const unformattedValue = unformatNumber(value);
        if (!isNaN(unformattedValue) || unformattedValue === '') {
            const updatedInvestors = [...investors];
            updatedInvestors[index] = {
                ...updatedInvestors[index],
                shares: unformattedValue, 
                formattedShares: formatNumber(unformattedValue)
            };
            setInvestors(updatedInvestors);

            // Clear the error for this field
            const newErrors = { ...errors };
            if (newErrors.investors && newErrors.investors[index]) {
                newErrors.investors[index].shares = '';
            }
            setErrors(newErrors);
        }
    };

    const handleNumberChange = (setter, errorField) => (e) => {
        const value = e.target.value;
        const unformattedValue = unformatNumber(value);
        if (!isNaN(unformattedValue) || unformattedValue === '') {
            setter(formatNumber(unformattedValue));
            // Clear the error for this field
            setErrors(prev => ({ ...prev, [errorField]: '' }));
        }
    };

    // Initialize the investors state with existing investors
    useEffect(() => {
        if (fundingRoundDetails) {
            setSelectedStartupId(fundingRoundDetails.startup.id);
            setFundingName(fundingRoundDetails.fundingName);
            setFundingType(fundingRoundDetails.fundingType);
            setTargetFunding(fundingRoundDetails.targetFunding);
            setPreMoneyValuation(fundingRoundDetails.preMoneyValuation);
            setCurrency(fundingRoundDetails.moneyRaisedCurrency);
            setMoneyRaised(fundingRoundDetails.moneyRaised);
            setMinimumShare(fundingRoundDetails.minimumShare);
            setFormattedMoneyRaised(formatNumber(fundingRoundDetails.moneyRaised));
            setFormattedTargetFunding(formatNumber(fundingRoundDetails.targetFunding));
            setFormattedPreMoneyValuation(formatNumber(fundingRoundDetails.preMoneyValuation));
            setFormattedMinimumShare(formatNumber(fundingRoundDetails.minimumShare));

            const announcedDate = new Date(fundingRoundDetails.announcedDate);
            setAnnouncedDay(announcedDate.getDate());
            setAnnouncedMonth(announcedDate.getMonth() + 1); 
            setAnnouncedYear(announcedDate.getFullYear());
    
            // Initialize closedDate state variables
            const closedDate = new Date(fundingRoundDetails.closedDate);
            setClosedDay(closedDate.getDate());
            setClosedMonth(closedDate.getMonth() + 1); 
            setClosedYear(closedDate.getFullYear());
        }

        if (fundingRoundDetails?.capTableInvestors) {
            const existingInvestors = fundingRoundDetails.capTableInvestors
                .filter(investor => !investor.investorRemoved && investor.status === 'accepted')
                .map(investor => ({
                    name: investor.investor.id, 
                    title: investor.title,
                    shares: investor.shares.toString(),
                    formattedShares: formatNumber(investor.shares.toString())
                }));
            setInvestors(existingInvestors);
        }
    }, [fundingRoundDetails]);

    const handleUpdateFundingRound = async () => {
        if (!validateForm()) {
            return; 
        }
    
        try {
            const updatedInvestors = investors.map(investor => ({
                id: investor.name, 
                title: investor.title,
                shares: parseInt(unformatNumber(investor.shares))
            }));
    
            const updatePayload = {
                updateData: {
                    startup: { id: selectedStartupId },
                    fundingName,
                    fundingType,
                    announcedDate: `${announcedYear}-${String(announcedMonth).padStart(2, '0')}-${String(announcedDay).padStart(2, '0')}`,
                    closedDate: `${closedYear}-${String(closedMonth).padStart(2, '0')}-${String(closedDay).padStart(2, '0')}`,
                    moneyRaised: parseInt(unformatNumber(formattedMoneyRaised)),
                    moneyRaisedCurrency: currency,
                    targetFunding: parseInt(unformatNumber(formattedTargetFunding)),
                    preMoneyValuation: parseInt(unformatNumber(formattedPreMoneyValuation)),
                    minimumShare: parseFloat(unformatNumber(formattedMinimumShare)),
                },
                investors: updatedInvestors
            };
    
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/funding-rounds/${fundingRoundDetails.id}`, updatePayload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            setIsEditMode(false);
    
        } catch (error) {
            console.error('Failed to update funding round:', error);
        }
    };

    const handleRemoveInvestor = async (index) => {
        try {
            const investorToRemove = investors[index];
            
            // Remove the investor from the UI first
            const updatedInvestors = investors.filter((_, i) => i !== index);
            setInvestors(updatedInvestors);
    
            // Send a request to the backend to mark the investor as removed
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/cap-table-investor/${investorToRemove.name}/${fundingRoundDetails.id}`, {
                investorRemoved: true, 
            });
    
            console.log('Investor removed successfully:', response.data);
        } catch (error) {
            console.error('Error removing investor:', error);
        }
    };

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    const getFundingRoundHeaders = () => {
        return [
          'Startup Name', 'Funding Name', 'Funding Type', 'Announced Date', 
          'Closed Date', 'Money Raised', 'Currency', 'Target Funding', 
          'Pre-money Valuation', 'Price Per Share', 'Investor Name', 'Title', 'Shares'
        ];
      };

      const handleDownloadFundingRoundCSV = () => {
        const csvData = fundingRoundDetails.capTableInvestors
            .filter(investor => !investor.investorRemoved && investor.status === 'accepted')
            .map((capInvestor) => ({
                'Startup Name': fundingRoundDetails ? fundingRoundDetails.startup.companyName : '',
                'Funding Name': fundingName,
                'Funding Type': fundingType,
                'Announced Date': `${announcedYear}-${String(announcedMonth).padStart(2, '0')}-${String(announcedDay).padStart(2, '0')}`,
                'Closed Date': `${closedYear}-${String(closedMonth).padStart(2, '0')}-${String(closedDay).padStart(2, '0')}`,
                'Money Raised': `${currency} ${formatNumber(moneyRaised)}`,
                'Currency': currency,
                'Target Funding': formatNumber(targetFunding),
                'Pre-money Valuation': formatNumber(preMoneyValuation),
                'Price Per Share': formatNumber(minimumShare),
                'Investor Name': `${capInvestor.investor.firstName} ${capInvestor.investor.lastName}`,
                'Title': capInvestor.title,
                'Shares': formatNumber(capInvestor.shares),
            }));
    
        const csvFile = Papa.unparse(csvData, { header: true, columns: getFundingRoundHeaders() });
    
        // Add UTF-8 BOM to fix special character display issues
        const blob = new Blob(["\uFEFF" + csvFile], { type: 'text/csv;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
    
        const link = document.createElement('a');
        link.href = url;
        link.download = `Funding Round Details for ${fundingName}.csv`;
        link.click();
    
        window.URL.revokeObjectURL(url);
    };
    
    return (
        <Box component="main" sx={{ flexGrow: 1, width: '100%', overflowX: 'hidden', maxWidth: '1000px', background: '#F2F2F2' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center',  mt: 1, mb: 1 }}>
                <Typography variant="h5" sx={{ color: '#414a4c', fontWeight: '500', pl: 5,}}>
                    Organization
                </Typography>

                <Tooltip title="Generate Report for this Funding Round" arrow>
                <Button  variant="contained" sx={{ width: 'auto', background: '#336FB0', '&:hover': {  boxShadow: '0 0 10px rgba(0,0,0,0.5)',  backgroundColor: '#336FB0' }, 
                            ml: 'auto', mr: 5.6 }}
                    onClick={handleDownloadFundingRoundCSV}>
                    <DescriptionIcon  />
                </Button>
                </Tooltip>
            </Box>

            <Grid container spacing={3} sx={{ ml: 2 }}>
                <Grid item xs={12} sm={11}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                        <label>StartUp Name</label>    
                        <FormControl fullWidth variant="outlined">
                            <Select fullWidth variant="outlined"
                                value={fundingRoundDetails ? fundingRoundDetails.startup.id : selectedStartupId}
                                onChange={(e) => setSelectedStartupId(e.target.value)}
                                disabled={!!fundingRoundDetails}
                                sx={{ height: '45px' }}>
                                {startups.map((startup) => (
                                    <MenuItem key={startup.id} value={startup.id}>{startup.companyName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Typography variant="h5" sx={{ color: '#414a4c', fontWeight: '500', pl: 5, pt: 3, pb: 1 }}>
                Funding Round Details
            </Typography>

            <Grid container spacing={3} sx={{ ml: 2 }}>
                <Grid item xs={12} sm={11}>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <label>Funding Name</label>
                            <TextField fullWidth variant="outlined" value={fundingName} onChange={(e) => setFundingName(e.target.value)} 
                                disabled={!!fundingRoundDetails} sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }} />
                        </Grid>

                        <Grid item xs={4}>
                        <label>Funding Type</label> 
                            <FormControl fullWidth variant="outlined">
                                <Select fullWidth variant="outlined" value={fundingType} disabled={!isEditMode} onChange={(e) => setFundingType(e.target.value)} sx={{ height: '45px' }} >
                                {fundingOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <label><b>Announced Date</b><br />Month</label>
                            <FormControl fullWidth variant="outlined">
                                <Select labelId="month-label" value={announcedMonth} onChange={(e) => setAnnouncedMonth(e.target.value)} sx={{ height: '45px' }} disabled>
                                    {months.map((month, index) => (
                                        <MenuItem key={index} value={index + 1}>{month}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <label><br />Day</label>
                            <FormControl fullWidth variant="outlined">
                                <Select labelId="day-label" value={announcedDay} onChange={(e) => setAnnouncedDay(e.target.value)} 
                                sx={{ height: '45px' }} disabled>
                                    {days.map((day) => (
                                        <MenuItem key={day} value={day}>{day}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <label><br />Year</label>
                            <FormControl fullWidth variant="outlined">
                                <Select labelId="year-label" value={announcedYear} onChange={(e) => setAnnouncedYear(e.target.value)} sx={{ height: '45px' }} disabled>
                                    {years.map((year) => (
                                        <MenuItem key={year} value={year}>{year}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <label><b>Closed on Date</b><br />Month</label>
                            <FormControl fullWidth variant="outlined" error={!!errors.closedMonth}>
                                <Select labelId="month-label" value={closedMonth} onChange={(e) => {
                                    setClosedMonth(e.target.value);
                                    setErrors(prev => ({ ...prev, closedMonth: '' }));
                                }} disabled={!isEditMode} sx={{ height: '45px' }}>
                                    {months.map((month, index) => (
                                        <MenuItem key={index} value={index + 1}>{month}</MenuItem>
                                    ))}
                                </Select>
                                {errors.closedMonth && <FormHelperText>{errors.closedMonth}</FormHelperText>}
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <label><br />Day</label>
                            <FormControl fullWidth variant="outlined" error={!!errors.closedDay}>
                                <Select labelId="day-label" value={closedDay} onChange={(e) => {
                                    setClosedDay(e.target.value);
                                    setErrors(prev => ({ ...prev, closedDay: '' }));
                                }} disabled={!isEditMode} sx={{ height: '45px' }}>
                                    {days.map((day) => (
                                        <MenuItem key={day} value={day}>{day}</MenuItem>
                                    ))}
                                </Select>
                                {errors.closedDay && <FormHelperText>{errors.closedDay}</FormHelperText>}
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <label><br />Year</label>
                            <FormControl fullWidth variant="outlined" error={!!errors.closedYear}>
                                <Select labelId="year-label" value={closedYear} onChange={(e) => {
                                    setClosedYear(e.target.value);
                                    setErrors(prev => ({ ...prev, closedYear: '' }));
                                }} disabled={!isEditMode} sx={{ height: '45px' }}>
                                    {years.map((year) => (
                                        <MenuItem key={year} value={year}>{year}</MenuItem>
                                    ))}
                                </Select>
                                {errors.closedYear && <FormHelperText>{errors.closedYear}</FormHelperText>}
                            </FormControl>
                        </Grid>

                        <Grid item xs={8}>
                            <label>Money Raised Amount</label>
                            <TextField fullWidth variant="outlined" value={formattedMoneyRaised}
                                onChange={handleNumberChange(setFormattedMoneyRaised)} disabled
                                sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }} />
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

                        <Grid item xs={8}>
                            <FormControl fullWidth variant="outlined">
                            <label>Target Funding Amount</label>
                            <TextField fullWidth variant="outlined" value={formattedTargetFunding}
                                onChange={handleNumberChange(setFormattedTargetFunding, 'targetFunding')} disabled={!isEditMode}
                                sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                                error={!!errors.targetFunding}
                            />
                            </FormControl>
                            {errors.targetFunding && <FormHelperText sx={{ color: 'red' }}>{errors.targetFunding}</FormHelperText>}
                        </Grid>

                        <Grid item xs={4}>
                            <label>Currency</label>
                            <Select fullWidth variant="outlined" value={currency}
                                onChange={(e) => setCurrency(e.target.value)} disabled={!isEditMode}
                                sx={{ height: '45px' }}>
                                {currencyOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined">
                            <label>Pre-Money Valuation</label>
                            <TextField fullWidth variant="outlined" value={formattedPreMoneyValuation}
                                onChange={handleNumberChange(setFormattedPreMoneyValuation, 'preMoneyValuation')} disabled={!isEditMode}
                                sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                                error={!!errors.preMoneyValuation}/>
                            </FormControl>
                            {errors.preMoneyValuation && <FormHelperText sx={{ color: 'red' }}>{errors.preMoneyValuation}</FormHelperText>}
                        </Grid>

                        <Grid item xs={12}>
                            <Typography sx={{ color: '#336FB0'}}>
                            The price per share refers to the amount of money you need to pay to purchase one share of a company's stock. For example, if the price per share is P10,000, you would need to invest P10,000 to acquire a single share in that company.
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={8}>
                            <label>Price per Share</label>
                            <TextField fullWidth variant="outlined" value={formattedMinimumShare}
                                onChange={handleNumberChange(setFormattedMinimumShare)} disabled
                                sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}/>
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
                Investors to this Funding Round
            </Typography>

            <Grid container spacing={3} sx={{ ml: 2 }}>
                {investors.map((investor, index) => (
                    <Grid item xs={12} sm={11} key={index}>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <label>Shareholder Name</label>
                                <FormControl fullWidth variant="outlined" error={!!(errors.investors && errors.investors[index] && errors.investors[index].name)}>
                                    <Autocomplete disablePortal options={allInvestors}
                                        sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                                        getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                                        value={allInvestors.find(inv => inv.id === investor.name) || null}
                                        onChange={(event, newValue) => handleInvestorChange(index, 'name', newValue ? newValue.id : '')}
                                        disabled={!isEditMode}
                                        renderInput={(params) => (
                                        <TextField {...params} variant="outlined" error={!!(errors.investors && errors.investors[index] && errors.investors[index].name)} />
                                        )}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                    />
                                </FormControl>
                                {errors.investors && errors.investors[index] && errors.investors[index].name && <FormHelperText sx={{ color: 'red' }}>{errors.investors[index].name}</FormHelperText>}
                            </Grid>
                            
                            <Grid item xs={4}>
                                <formControl fullWidth variant="outlined">
                                <label>Title</label>
                                <TextField fullWidth variant="outlined" value={investor.title}
                                    onChange={(e) => handleInvestorChange(index, 'title', e.target.value)}
                                    disabled={!isEditMode}
                                    sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                                    error={!!(errors.investors && errors.investors[index] && errors.investors[index].title)}
                                />
                                </formControl>
                                {errors.investors && errors.investors[index] && errors.investors[index].title && <FormHelperText sx={{ color: 'red' }}>{errors.investors[index].title}</FormHelperText>}
                            </Grid>

                            <Grid item xs={3.5}>
                                <formControl fullWidth variant="outlined">
                                <label>Shares</label>
                                <TextField fullWidth variant="outlined" value={investor.formattedShares}
                                    onChange={(e) => handleSharesChange(index, e.target.value)} disabled={!isEditMode}
                                    sx={{ height: '45px', '& .MuiInputBase-root': { height: '45px' } }}
                                    error={!!(errors.investors && errors.investors[index] && errors.investors[index].shares)}
                                />
                                </formControl>
                                {errors.investors && errors.investors[index] && errors.investors[index].shares && <FormHelperText sx={{ color: 'red' }}>{errors.investors[index].shares}</FormHelperText>}
                            </Grid>

                            <Grid item xs={.5}>
                            {investors.length > 0 && (
                                <IconButton sx={{ mt: 3}} color="error" aria-label="remove"
                                    disabled={!isEditMode} value={investor.id}
                                    onClick={() => handleRemoveInvestor(index)}>
                                    <CloseIcon />
                                </IconButton>
                            )}
                            </Grid>
                        </Grid>
                    </Grid>
                ))}
                <Grid item xs={12} sm={11}>
                    <Button variant="outlined" sx={{ color: '#336FB0', borderColor: '#336FB0', '&:hover': { color: '#336FB0)', borderColor: '#336FB0' } }} 
                    onClick={handleAddInvestor} disabled={!isEditMode}>
                        Add Investor
                    </Button>
                </Grid>
            </Grid>

            <Button variant="contained"
                sx={{ width: 150, background: '#336FB0', '&:hover': { boxShadow: '0 0 10px rgba(0,0,0,0.5)',backgroundColor: '#336FB0' } }} style={{ marginLeft: '80%' }}
                onClick={() => {
                    const action = isEditMode ? handleUpdateFundingRound : toggleEditMode;
                    action(); action();}}>
                    {isEditMode ? 'Save Changes' : 'Edit Funding'}
                </Button>
        </Box>
    );
}

export default ViewFundingRound;