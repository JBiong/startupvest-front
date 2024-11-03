import { Box, Typography, Grid } from "@mui/material";

const startupUserGuideSteps = [
    {   
        label: "Dashboard Overview", 
        content: (
            <Box>
                <Typography variant="body1" textAlign='justify' sx={{ mt: 5}}>
                    Welcome to InvestTrack! This guide will help you manage your startup profile, funding rounds, and investments. Our platform is designed to provide a comprehensive view of your startup's funding activities and manage investor relations seamlessly.
                </Typography>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <Typography variant="h5" textAlign='justify' sx={{ mb: 1}}>Dashboard Overview</Typography>
                        <img src="/images/userGuideStartup/dashboard.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} /> 
                        <Typography variant="body1" textAlign='justify' sx={{ mb: 1, mt: 1}}>
                            When you log in, the Dashboard offers an at-a-glance view of key metrics for your startup:
                            <ul>
                                <li><strong>Highest-Funded Company</strong>: Displays the startup with the most significant funding raised.</li>
                                <li><strong>Top Investment Contributor</strong>: Shows the investor who has contributed the most to your funding.</li>
                                <li><strong>Funded Companies</strong>: Lists all companies that have received funding.</li>
                                <li><strong>Company Count</strong>: Total number of companies on the platform.</li>
                                <li><strong>Investor Count</strong>: Displays the number of investors associated with your startup.</li>
                                <li><strong>Funding Round Count</strong>: Number of funding rounds you’ve raised.</li>
                                <li><strong>Total Amount Funded</strong>: Total capital your startup has secured.</li>
                                <li><strong>Monthly Funding Overview</strong>: A graph or chart summarizing the monthly funding trend.</li>
                                <li><strong>Recent Activities</strong>: A feed of the latest actions, such as profile creations/deletions and funding round creations/deletions.</li>
                            </ul>
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h5" textAlign='justify' sx={{ mb: 1}}>Tabs for Quick Access</Typography>
                        <img src="/images/userGuideStartup/tabs.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} />   
                        <Typography variant="body1" sx={{ mt: 1, mb: 1 }}>
                        In addition to the metrics, you’ll find tabs for easy access to manage specific areas of your startup:
                        <ul>
                            <li><strong>My Funding Rounds</strong>: View all funding rounds for your startup. Here, you can edit or delete existing rounds.</li>
                            <li><strong>My Startups</strong>: Manage your startup’s profile information. You can edit or delete your profile details to ensure your information is always accurate and up-to-date.</li>
                        </ul>

                        Additional tabs that provide valuable insights:
                        <ul>
                            <li><strong>My Cap Table</strong>: Automatically generated based on each funding round created and its associated investors. This table provides a detailed view of shareholder information, such as names, titles, shares, total shares, and ownership percentage.</li>
                            <li><strong>Investor Requests</strong>: Review and manage incoming investment requests. You can accept or reject potential investors who want to invest in your company, helping you control your startup’s growth and investor relations effectively.</li>
                        </ul>

                        Each tab allows for seamless management of your startup's critical data, helping you stay organized and informed at every stage of your startup journey.
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        ) 
    },
    {   
        label: "Profile Management", 
        content: (
            <Box>
                <Typography variant="body1" textAlign='justify' sx={{ mt: 5}}>
                    Managing your startup profile is crucial for attracting investors and presenting your company effectively. Here’s how to create, edit, and delete your startup profile in InvestTrack.
                </Typography>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                        <Typography variant="h5" textAlign='justify' sx={{ mb: 1}}>Creating a Startup Profile</Typography>
                        <Typography variant="body1" sx={{ mt: 1, mb: 1, fontWeight: 'bold' }}>Step 1: Initiate Profile Creation</Typography>
                            <ul>
                                <li>Click the <strong>Create</strong> button on the dashboard.</li>
                                <li>Select <strong>Startup Profile</strong> from the dropdown menu.</li>
                            </ul>
                            <img src="/images/userGuideStartup/create.png" alt="Overview" style={{ width: '25%', borderRadius: '8px' }} />

                            <Typography variant="body1" sx={{ mt: 2,  mb: 1, fontWeight: 'bold' }}>Step 2: Fill up the form</Typography>
                            <img src="/images/userGuideStartup/formProfile.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} />    
                            <Typography variant="body1" sx={{ mt: 2,  mb: 1, fontWeight: 'bold' }}>Step 3: Create Profile</Typography>
                            <ul>
                                <li>Once all necessary fields are filled, click the <strong>Create Profile</strong> button to save your startup profile.</li>
                                <li>Your newly created profile will now be visible in the <strong>My Startups</strong> section.</li>
                            </ul>
                            <img src="/images/userGuideStartup/tabStartup.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} /> 
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h5" textAlign='justify' sx={{ mb: 1, mt: 1 }}>Editing or Deleting a Startup Profile</Typography>
                        <Typography variant="body1" sx={{ mt: 1, mb: 1, fontWeight: 'bold' }}>Step 1: Navigate to My Startups</Typography>
                            <ul>
                                <li>Click on the <strong>My Startups</strong> tab in the dashboard to view all your created startup profiles.</li>
                            </ul>

                            <Typography variant="body1" sx={{ mt: 2,  mb: 1, fontWeight: 'bold' }}>Step 2: Select a Profile</Typography>
                            <ul>
                                <li>Choose the profile you wish to edit or delete from the list.</li>
                            </ul>
                            <img src="/images/userGuideStartup/tabStartup.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} />   

                            <Typography variant="body1" sx={{ mt: 2,  mb: 1, fontWeight: 'bold' }}>Step 3: Edit Profile</Typography>
                            <ul>
                                <li>Click on the <strong>View</strong> button to modify any details. Then click <strong>Edit Profile </strong>button. Make the necessary changes and ensure all information is up-to-date.</li>
                                <li>After making changes, click <strong>Save Changes</strong> to update the profile.</li>
                            </ul>
                            <img src="/images/userGuideStartup/editProfile.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} /> 

                            <Typography variant="body1" sx={{ mt: 2,  mb: 1, fontWeight: 'bold' }}>Step 4: Delete Profile</Typography>
                            <ul>
                                <li>If you need to remove a profile, click the <strong>Delete</strong> button. 
                                    Confirm the deletion when prompted to permanently remove the profile from the platform.
                                </li>
                            </ul>
                            <img src="/images/userGuideStartup/deleteProfile.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} /> 
                    </Grid>
                </Grid>
            </Box>
        ) 
    },
    {   
        label: "Funding Round Management", 
        content: (
            <Box>
                <Typography variant="body1" textAlign='justify' sx={{ mt: 5}}>
                    Managing your funding rounds is essential for tracking investment opportunities and maintaining clear communication with investors. Here’s how to create, edit, and delete funding rounds in InvestTrack.
                </Typography>

                <Grid container spacing={2} sx={{ mt: 1, mb: 1 }}>
                    <Grid item xs={12}>
                        <Typography variant="h5" textAlign='justify' sx={{ mb: 1}}>Creating a Funding Round</Typography>
                        <Typography variant="body1" sx={{ mt: 1, mb: 1, fontWeight: 'bold' }}>Step 1: Initiate Funding Round Creation</Typography>
                            <ul>
                                <li>Click the <strong>Create</strong> button on the dashboard.</li>
                                <li>Select <strong>Funding Round</strong> from the dropdown menu.</li>
                            </ul>
                            <img src="/images/userGuideStartup/create1.png" alt="Overview" style={{ width: '25%', borderRadius: '8px' }} />

                            <Typography variant="body1" sx={{ mt: 2,  mb: 1, fontWeight: 'bold' }}>Step 2: Fill up the form</Typography>
                            <img src="/images/userGuideStartup/formRound.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} />    
                            <Typography variant="body1" sx={{ mt: 2,  mb: 1, fontWeight: 'bold' }}>Step 3: Create Funding Round</Typography>
                            <ul>
                                <li>Once all necessary fields are filled, click the <strong>Create Round</strong> button to save your funding round.</li>
                                <li>Your newly created profile will now be visible in the My Startups section.</li>
                            </ul>
                            <img src="/images/userGuideStartup/tabRound.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} /> 
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h5" textAlign='justify' sx={{ mb: 1, mt: 1 }}>Editing or Deleting a Funding Round</Typography>
                        <Typography variant="body1" sx={{ mt: 1, mb: 1, fontWeight: 'bold' }}>Step 1: Navigate to My Funding Round</Typography>
                            <ul>
                                <li>Click on the <strong>My Funding Rounds</strong> tab in the dashboard to view all your created funding rounds.</li>
                            </ul>

                            <Typography variant="body1" sx={{ mt: 2,  mb: 1, fontWeight: 'bold' }}>Step 2: Select a Profile</Typography>
                            <ul>
                                <li>Choose the funding round you wish to edit or delete from the list.</li>
                            </ul>
                            <img src="/images/userGuideStartup/tabRound.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} />   

                            <Typography variant="body1" sx={{ mt: 2,  mb: 1, fontWeight: 'bold' }}>Step 3: Edit Profile</Typography>
                            <ul>
                                <li>Click on the <strong>View</strong> button to modify any details. Then click <strong>Edit Funding</strong> button. Make the necessary changes and ensure all information is up-to-date.</li>
                                <li>After making changes, click <strong>Save Changes</strong> to update the profile.</li>
                            </ul>
                            <img src="/images/userGuideStartup/editRound.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} /> 

                            <Typography variant="body1" sx={{ mt: 2,  mb: 1, fontWeight: 'bold' }}>Step 4: Delete Profile</Typography>
                            <ul>
                                <li>If you need to remove a funding round, click the <strong>Delete</strong> button. 
                                    Confirm the deletion when prompted to permanently remove the profile from the platform.
                                </li>
                            </ul>
                            <img src="/images/userGuideStartup/deleteRound.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} /> 
                    </Grid>
                </Grid>
            </Box>
        ) 
    },
    {   
        label: "Cap Table Management", 
        content: (
            <Box>
                <Typography variant="body1" textAlign='justify' sx={{ mt: 5}}>
                    The Cap Table provides a detailed view of shareholder equity and ownership breakdown for each funding round. This feature is automatically generated based on the investors associated with each round, allowing you to easily track ownership distribution.
                </Typography>

                <Grid container spacing={2} sx={{ mt: 1, mb: 1 }}>
                    <Grid item xs={12}>
                        <Typography variant="h5" textAlign='justify' sx={{ mb: 1}}>Viewing Your Cap Table</Typography>
                        <Typography variant="body1" sx={{ mt: 1, mb: 1, fontWeight: 'bold' }}>Step 1: Navigate to My Cap Table</Typography>
                            <ul>
                                <li>On the dashboard, click on the <strong>My Cap Table</strong> tab.</li>
                            </ul>

                            <Typography variant="body1" sx={{ mt: 2,  mb: 1, fontWeight: 'bold' }}>Step 2: Select a Startup</Typography>
                            <ul>
                                <li>From the list, choose the startup for which you’d like to view the cap table.</li>
                            </ul>
                            <img src="/images/userGuideStartup/select.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} />    

                            <Typography variant="body1" sx={{ mt: 2,  mb: 1, fontWeight: 'bold' }}>Step 3: Review Investor Details</Typography>
                            The cap table for the selected startup will display investor information, including:
                            <ul>
                                <li>Shareholder Name</li>
                                <li>Title (e.g., Founder, Investor)</li>
                                <li>Shares held by each shareholder</li>
                                <li>Total Shares in the funding round</li>
                                <li>Percentage Ownership based on total shares</li>
                            </ul>
                            <img src="/images/userGuideStartup/selected.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} /> 
                    </Grid>
                </Grid>
            </Box>
        ) 
    },
    {   
        label: "Investor Request Management", 
        content: (
            <Box>
                <Typography variant="body1" textAlign='justify' sx={{ mt: 5}}>
                    Managing investor requests is crucial for maintaining relationships with potential investors and ensuring that you select the right partners for your startup. Here’s how to view and manage investor requests in InvestTrack.
                </Typography>

                <Grid container spacing={2} sx={{ mt: 1, mb: 1 }}>
                    <Grid item xs={12}>
                        <Typography variant="h5" textAlign='justify' sx={{ mb: 1}}>Reviewing Investor Requests</Typography>
                        <Typography variant="body1" sx={{ mt: 1, mb: 1, fontWeight: 'bold' }}>Step 1: Navigate to Investor Requests</Typography>
                            <ul>
                                <li>Click on the <strong>Investor Requests</strong> tab in the dashboard to view all pending investment requests.</li>
                            </ul>

                            <Typography variant="body1" sx={{ mt: 2,  mb: 1, fontWeight: 'bold' }}>Step 2: View Incoming Requests</Typography>
                            The list will display details for each investor request, including:
                            <ul>
                                <li>Date</li>
                                <li>Startup Name</li>
                                <li>Email</li>
                                <li>Investor Name</li>
                                <li>Shares</li>
                            </ul>
                            <img src="/images/userGuideStartup/tabRequest.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} />   

                        <Typography variant="h5" textAlign='justify' sx={{ mb: 1, mt: 2}}>Accepting an Investor Request</Typography>
                        <Typography variant="body1" sx={{ mt: 1, mb: 1, fontWeight: 'bold' }}>Step 1: Select an Investor Request</Typography>
                            <ul>
                                <li>From the list of incoming requests, find the investor you wish to accept.</li>
                            </ul>

                            <Typography variant="body1" sx={{ mt: 2,  mb: 1, fontWeight: 'bold' }}>Step 2: Accept the Request</Typography>
                            The list will display details for each investor request, including:
                            <ul>
                                <li>Click the <strong>Accept</strong> button next to the investor's name.</li>
                                <li>The status of the request will change to Accepted.</li>
                                <li>The investor will now be added to your cap table, reflecting their investment in your startup.</li>
                            </ul>
                            <img src="/images/userGuideStartup/accept.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} /> 
                            <img src="/images/userGuideStartup/captable.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} />     
 
                        <Typography variant="h5" textAlign='justify' sx={{ mb: 1, mt: 2 }}>Rejecting an Investor Request</Typography>
                        <Typography variant="body1" sx={{ mt: 1, mb: 1, fontWeight: 'bold' }}>Step 1: Select an Investor Request</Typography>
                            <ul>
                                <li>From the list of incoming requests, find the investor you wish to reject.</li>
                            </ul>

                            <Typography variant="body1" sx={{ mt: 2,  mb: 1, fontWeight: 'bold' }}>Step 2: Reject the Request</Typography>
                            The list will display details for each investor request, including:
                            <ul>
                                <li>Click the <strong>Reject</strong> button next to the investor's name.</li>
                                <li>The status of the request will change to Rejected.</li>
                            </ul>
                            <img src="/images/userGuideStartup/reject.png" alt="Overview" style={{ width: '100%', borderRadius: '8px' }} />   
 
                    </Grid>
                </Grid>
            </Box>
        ) 
    },
];

export default startupUserGuideSteps;