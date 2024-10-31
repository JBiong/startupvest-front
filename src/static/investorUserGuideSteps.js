import { Box, Typography, Grid } from "@mui/material";

const investorUserGuideSteps = [
    {   
        label: "Dashboard Overview", 
        content: (
            <Box>
                <Typography variant="body1" textAlign='justify' sx={{ mt: 5}}>
                    Welcome to Startup Vest! This guide will help you navigate the Investor Dashboard, where you can effectively manage your investments and track funding activities. Our platform is designed to provide you with a comprehensive view of your investment portfolio and streamline your interactions with startups seeking funding.
                </Typography>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <Typography variant="h5" textAlign='justify' sx={{ mb: 1}}>Dashboard Overview</Typography>
                        <img src="/images/userGuideInvestor/dashboard.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} /> 
                        <Typography variant="body1" textAlign='justify' sx={{ mb: 1, mt: 1}}>
                            When you log in, the Dashboard offers an at-a-glance view of key metrics for your investment performance:
                            <ul>
                                <li><strong>Top Company Invested</strong>: Identify the startup where you have invested the most.</li>
                                <li><strong>Investment Count</strong>: Track the total number of investments you've made across different startups.</li>
                                <li><strong>Average Investment Size</strong>: Gain insights into your typical investment amount</li>
                                <li><strong>Total Investment Amount</strong>: View the cumulative total of all your investments.</li>
                            </ul>
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h5" textAlign='justify' sx={{ mb: 1}}>Tabs for Quick Access</Typography>
                        <img src="/images/userGuideInvestor/investments.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} />   
                        <Typography variant="body1" sx={{ mt: 1, mb: 1 }}>
                        In addition to the metrics, you’ll find tabs for easy access to manage specific areas of your investments:
                        <ul>
                            <li><strong>Pending Requests</strong>: Review all your pending investment requests. Monitor their status and details, such as the startup name and requested investment amount.</li>
                            <li><strong>My Investments</strong>: Access a detailed view of all your current investments, including information on each startup and the amounts you have invested.</li>
                        </ul>
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        ) 
    },
    {   
        label: "Investment Request", 
        content: (
            <Box>
                <Typography variant="body1">
                    This section will walk you through the process of requesting an investment in a startup through the Startup Vest platform. Follow these steps to make your investment request seamless and straightforward.
                </Typography>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                            <Typography variant="h5" textAlign='justify' sx={{ mb: 1}}>How to Request an Investment</Typography>
                            <Typography variant="body1" sx={{ mt: 1, mb: 1, fontWeight: 'bold' }}>Step 1: Navigate to Funding Rounds</Typography>
                                <ul>
                                    <li>
                                        Start by clicking on the <strong>Funding Rounds</strong> tab in the navbar. This will provide you with a list of all available funding rounds for various startups.
                                    </li>
                                </ul>
                            <img src="/images/userGuideInvestor/viewRounds.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} />

                            <Typography variant="body1" sx={{ mt: 2,  mb: 1, fontWeight: 'bold' }}>Step 2: Select a Company</Typography>
                                <ul>
                                    <li>
                                        Browse through the list to find a company you wish to invest in. Once you’ve identified a startup, click on its name to view more details.
                                    </li>
                                </ul>

                            <Typography variant="body1" sx={{ mt: 2,  mb: 1, fontWeight: 'bold' }}>Step 3: View Funding Round Details</Typography>
                            <ul>
                                    <li>
                                        On the company’s funding round page, you will see important information, including the target amount, current amount raised, and the price per share.
                                    </li>
                                </ul>
                            <img src="/images/userGuideInvestor/viewProfile.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} /> 
                          
                            <Typography variant="body1" sx={{ mt: 2,  mb: 1, fontWeight: 'bold' }}>Step 4: Initiate Investment</Typography>
                            <ul>
                                    <li>
                                        Look for the <strong>Invest Now</strong> button and click it to begin the investment process.
                                    </li>
                                </ul>
                            <img src="/images/userGuideInvestor/investButton.png" alt="Overview" style={{ width: '50%', borderRadius: '8px' }} /> 
                       
                            <Typography variant="body1" sx={{ mt: 2,  mb: 1, fontWeight: 'bold' }}>Step 5: Enter Investment Details</Typography>
                            <ul>
                                    <li>
                                        A dialog box will appear, prompting you to specify how many shares you want to buy. Enter the desired number of shares you wish to purchase.
                                    </li>
                                </ul>
                            <img src="/images/userGuideInvestor/requestInvest.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} /> 
                           
                            <Typography variant="body1" sx={{ mt: 2,  mb: 1, fontWeight: 'bold' }}>Step 6: Confirm Investment</Typography>
                                <ul>
                                    <li>
                                        After entering the number of shares, click the <strong>Confirm Investment </strong>button to finalize your request. You will receive a confirmation message indicating that your investment request has been submitted.
                                    </li>
                                </ul>
                            <img src="/images/userGuideInvestor/requestSuccess.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} /> 
                    </Grid>
                </Grid>
            </Box>
        ) 
    },
];

export default investorUserGuideSteps;