import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography, Toolbar, CssBaseline, AppBar, Box, IconButton, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, Pagination, Tooltip, Button, } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import UserRegistrationsChart from "../Components/ChartAdmin";
import DescriptionIcon from "@mui/icons-material/Description";
import { Skeleton } from "@mui/material";

import Papa from "papaparse";
import { TopInfoBox, TopInfoText, TopInfoTitle, } from "../styles/StartupDashboard";

const AdminDashboard = () => {
  const [filter, setFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [startups, setStartups] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [fundingRounds, setFundingRounds] = useState([]);
  const [profilePictures, setProfilePictures] = useState({});
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          usersResponse,
          startupsResponse,
          investorsResponse,
          fundingRoundsResponse,
        ] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/users/all`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/startups/all`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/investors/all`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/funding-rounds/all`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        // Filter out admin users
        const nonAdminUsers = usersResponse.data.filter(
          (user) => user.role !== "Admin"
        );

        const usersWithPhotos = await Promise.all(
          nonAdminUsers.map(async (user) => {
            try {
              const profilePicResponse = await axios.get(
                `${process.env.REACT_APP_API_URL}/profile-picture/${user.id}`,
                {
                  responseType: "blob",
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              const profilePicUrl = URL.createObjectURL(
                profilePicResponse.data
              );
              return { ...user, photo: profilePicUrl };
            } catch (picError) {
              console.error("Error fetching profile picture:", picError);
              return { ...user, photo: null };
            }
          })
        );

        setUsers(usersWithPhotos);
        setStartups(startupsResponse.data);
        setInvestors(investorsResponse.data);
        setFundingRounds(fundingRoundsResponse.data);

        const pictures = {};
        await Promise.all([
          ...startupsResponse.data.map(async (startup) => {
            try {
              const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/profile-picture/startup/${startup.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  responseType: "blob",
                }
              );
              pictures[`startup_${startup.id}`] = URL.createObjectURL(
                response.data
              );
            } catch (error) {
              console.error(
                `Failed to fetch profile picture for startup ID ${startup.id}:`,
                error
              );
            }
          }),
          ...investorsResponse.data.map(async (investor) => {
            try {
              const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/profile-picture/${investor.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  responseType: "blob",
                }
              );
              pictures[`investor_${investor.id}`] = URL.createObjectURL(
                response.data
              );
            } catch (error) {
              console.error(
                `Failed to fetch profile picture for investor ID ${investor.id}:`,
                error
              );
            }
          }),
        ]);
        setProfilePictures(pictures);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location = "/";
  };

  // DOWNLOAD TO CSV FILE
  const downloadData = () => {
    const filteredData = getFilteredData();
    const headers = getTableHeaders(filter); 

    // Filter the data based on selected filter for download
    const formattedData = filteredData.map((item) => {
      switch (filter) {
        case "startup":
          return {
            "Company Name": item.companyName,
            "Founded Date": item.foundedDate,
            Industry: item.industry,
            "Contact Email": item.contactEmail,
          };
        case "investor":
          return {
            Name: `${item.firstName} ${item.lastName}`,
            Email: item.emailAddress,
            "Contact Information": item.contactInformation,
            Address: `${item.locationLat}, ${item.locationLng}, ${item.locationName}`,
          };
        case "funding":
          return {
            "Company Name": item.startup.companyName,
            "Funding Type": item.fundingType,
            "Announced Date": formatDate(item.announcedDate),
            "Target Funding": formatCurrency(item.targetFunding),
            "Money Raised": formatCurrency(item.moneyRaised),
          };
        default:
          return {
            Name: `${item.firstName} ${item.lastName}`,
            Gender: item.gender,
            Email: item.email,
            "Contact Number": item.contactNumber,
          };
      }
    });

    const csvData = Papa.unparse(formattedData, {
      headers: headers,
    });

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `InvestTrack_${filter}.csv`;
    link.click();

    window.URL.revokeObjectURL(url);
  };

  // FILTER DATA INFORMATION
  const getFilteredData = () => {
    switch (filter) {
      case "all":
        return users.filter(user => user.isVerified);
      case "startup":
        return startups.filter(startup => startup.status === "approved" || startup.status === "rejected");
      case "investor":
        return investors;
      case "funding":
        return fundingRounds.filter(fundingRound => !fundingRound.isDeleted);
      default:
        return [];
    }
  };

  // HEADERS FOR DATA INFORMATION
  const getTableHeaders = () => {
    switch (filter) {
      case "all":
        return ["Name", "Gender", "Email", "Contact Number", "User Photo"];
      case "startup":
        return [
          "Status",
          "Company Name",
          "Founded Date",
          "Industry",
          "Contact Email",
          "Company Photo",
        ];
      case "investor":
        return [
          "Name",
          "Email",
          "Contact Information",
          "Address",
          "Investor Photo",
        ];
      case "funding":
        return [
          "Company Name",
          "Funding Type",
          "Announced Date",
          "Target Funding",
          "Money Raised",
        ];
      default:
        return [];
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  const paginatedData = getFilteredData().slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleApproveStartup = async (startupId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/startups/${startupId}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setStartups((prevStartups) =>
        prevStartups.map((startup) =>
          startup.id === startupId
            ? { ...startup, status: "Approved" }
            : startup
        )
      );
    } catch (error) {
      console.error("Error approving startup:", error);
    }
  };

  const handleRejectStartup = async (startupId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/startups/${startupId}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setStartups((prevStartups) =>
        prevStartups.map((startup) =>
          startup.id === startupId
            ? { ...startup, status: "Rejected" }
            : startup
        )
      );
    } catch (error) {
      console.error("Error rejecting startup:", error);
    }
  };

  const renderTable = () => {
    return (
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#336FB0" }}>
              {getTableHeaders().map((header) => (
                <TableCell key={header} sx={{ color: "white" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* COLUMN DATA */}
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={getTableHeaders().length}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow key={item.id}>
                  {filter === "startup" ? (
                    <>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>{item.companyName}</TableCell>
                      <TableCell>{item.foundedDate}</TableCell>
                      <TableCell>{item.industry}</TableCell>
                      <TableCell>{item.contactEmail}</TableCell>
                      <TableCell>
                        {profilePictures[`startup_${item.id}`] ? (
                          <Avatar src={profilePictures[`startup_${item.id}`]} sx={{ width: 50, height: 50, border: "1px solid #336FB0", }} />
                        ) : (
                          <Avatar sx={{ width: 50, height: 50, border: "1px solid #336FB0", }}>{item.companyName[0]}</Avatar>
                        )}
                      </TableCell>
                    </>
                  ) : filter === "investor" ? (
                    <>
                      <TableCell>{`${item.firstName} ${item.lastName}`}</TableCell>
                      <TableCell>{item.emailAddress}</TableCell>
                      <TableCell>{item.contactInformation}</TableCell>
                      <TableCell>{item.locationLng}, {item.locationLat},{" "} {item.locationName}</TableCell>
                      <TableCell>
                        {profilePictures[`investor_${item.id}`] ? (
                          <Avatar src={profilePictures[`investor_${item.id}`]} sx={{ width: 50, height: 50, border: "1px solid #336FB0", }} />
                        ) : (
                          <Avatar sx={{ width: 50, height: 50, border: "1px solid #336FB0", }}>
                            {item.firstName[0]}
                            {item.lastName[0]}
                          </Avatar>
                        )}
                      </TableCell>
                    </>
                  ) : filter === "funding" ? (
                    <>
                      <TableCell>{item.startup.companyName}</TableCell>
                      <TableCell>{item.fundingType}</TableCell>
                      <TableCell>{formatDate(item.announcedDate)}</TableCell>
                      <TableCell>{`${item.moneyRaisedCurrency}${formatCurrency(item.targetFunding)}`}</TableCell>
                      <TableCell>{`${item.moneyRaisedCurrency}${formatCurrency(item.moneyRaised)}`}</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{item.firstName} {item.lastName}</TableCell>
                      <TableCell>{item.gender}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.contactNumber}</TableCell>
                      <TableCell>
                        {item.photo ? (
                          <Avatar src={item.photo} sx={{ width: 50, height: 50, border: "1px solid #336FB0", }} />
                        ) : (
                          <Avatar sx={{ width: 50, height: 50, border: "1px solid #336FB0", }}>{item.firstName[0]} {item.lastName[0]}</Avatar>
                        )}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Box display="flex" justifyContent="center">
          <Pagination count={Math.ceil(getFilteredData().length / itemsPerPage)} page={page} onChange={handlePageChange} color="primary" sx={{ m: 2 }} />
        </Box>
      </TableContainer>
    );
  };

  return (
    <div style={{ marginTop: "78px", background: "#f5f5f5" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: "#004A98", }}>
        <Toolbar>
          <Avatar sx={{ width: 40, height: 40, mr: 2 }} src="images/logoV1.png"></Avatar>
          <Typography variant="h6" noWrap component="div" sx={{ ml: -1 }}>Startup Vest</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton size="medium" aria-label="show 17 new notifications" color="inherit" sx={{ marginRight: 5 }} onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Grid container spacing={3} sx={{ padding: 3 }}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Typography variant="h5" color="#232023">Admin Dashboard</Typography>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TopInfoBox>
                <TopInfoText>Total Users</TopInfoText>
                <TopInfoTitle>
                  {loading ? "Loading..." : users.filter(user => user.isVerified).length}
                </TopInfoTitle>
              </TopInfoBox>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TopInfoBox>
                <TopInfoText>Total Startups</TopInfoText>
                <TopInfoTitle>
                  {loading ? "Loading..." : startups.filter(startup => startup.status === "approved" && !startup.isDeleted).length}
                </TopInfoTitle>
              </TopInfoBox>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TopInfoBox>
                <TopInfoText>Total Investors</TopInfoText>
                <TopInfoTitle>
                  {loading ? "Loading..." : investors.length}
                </TopInfoTitle>
              </TopInfoBox>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TopInfoBox>
                <TopInfoText>Total Funding Rounds</TopInfoText>
                <TopInfoTitle>
                  {loading ? "Loading..." : fundingRounds.filter(fundingRound => !fundingRound.isDeleted)
                .length}
                </TopInfoTitle>
              </TopInfoBox>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper elevation={3} style={{ padding: "20px", height: "100%" }}>
                <Typography variant="h6" color="#1E1E1E">
                  User Growth Graph
                </Typography>
                <UserRegistrationsChart />
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper elevation={3} style={{ padding: "20px", height: "100%" }}>
                <Typography variant="h6" color="#1E1E1E">Latest User</Typography>
                <TableContainer component={Paper} sx={{ mt: 1 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#336FB0" }}>
                        <TableCell sx={{ color: "white" }}>Name</TableCell>
                        <TableCell sx={{ color: "white" }}>Photo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={2}>Loading...</TableCell>
                        </TableRow>
                      ) : (
                        users
                          .filter((user) => user.isVerified)
                          .sort((a, b) => b.id - a.id)
                          .slice(0, 6)
                          .map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                {user.firstName} {user.lastName}
                              </TableCell>
                              <TableCell>
                                {user.photo ? (
                                  <Avatar src={user.photo} sx={{ border: "1px solid #336FB0", width: 50, height: 50, }}/>
                                ) : (
                                  <Avatar sx={{ border: "1px solid #336FB0", width: 50, height: 50, }}>{user.firstName[0]} {user.lastName[0]}</Avatar>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={12}>
              <Paper elevation={3} style={{ padding: "20px", height: "100%" }}>
                <Typography variant="h6" color="#1E1E1E">Startup Profile Request</Typography>
                <TableContainer component={Paper} sx={{ mt: 1 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#336FB0" }}>
                        <TableCell sx={{ color: "white" }}>Startup Owner</TableCell>
                        <TableCell sx={{ color: "white" }}>Startup Name</TableCell>
                        <TableCell sx={{ color: "white" }}>Description</TableCell>
                        <TableCell sx={{ color: "white" }}>Type of Company</TableCell>
                        <TableCell sx={{ color: "white" }}>Contact Number</TableCell>
                        <TableCell sx={{ color: "white" }}>Contact Email</TableCell>
                        <TableCell sx={{ color: "white" }}>Industry</TableCell>
                        <TableCell sx={{ color: "white" }}>Action</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={8}>
                            <Skeleton variant="rectangular" width="100%" height={60} />
                          </TableCell>
                        </TableRow>
                      ) : (
                        startups
                        .filter((row) => row.status === 'pending')
                        .map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>
                              <div style={{ display: "flex",alignItems: "center", }}>
                                <Avatar variant="square"sx={{ border: "1px solid #336FB0", width: 50, height: 50, mr: 1, transition: "transform 0.3s ease",
                                    "&:hover": { transform: "scale(1.5)" }, }}
                                  src={row.avatarUrl}/>{row.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div style={{ display: "flex", alignItems: "center", }}>
                                <Avatar variant="square"
                                  sx={{ border: "1px solid #336FB0", width: 50, height: 50, mr: 1, transition: "transform 0.3s ease", "&:hover": { transform: "scale(1.5)" },}}
                                  src={row.companyLogoUrl}/>{row.companyName}
                              </div>
                            </TableCell>
                            <TableCell>{row.companyDescription}</TableCell>
                            <TableCell>{row.typeOfCompany}</TableCell>
                            <TableCell>{row.phoneNumber}</TableCell>
                            <TableCell>{row.contactEmail}</TableCell>
                            <TableCell>{row.industry}</TableCell>
                            <TableCell>
                              <div style={{ display: "flex", gap: "10px" }}>
                                <Button variant="contained" color="success" onClick={() => handleApproveStartup(row.id)}>Approve</Button>
                                <Button variant="contained" color="error" onClick={() => handleRejectStartup(row.id)}>Reject</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={12}>
              <Paper elevation={3} style={{ padding: "20px", height: "100%" }}>
                <Typography variant="h6" color="#1E1E1E">DELETION OF Startup Profile Request
                </Typography>
                <TableContainer component={Paper} sx={{ mt: 1 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#336FB0" }}>
                        <TableCell sx={{ color: "white" }}>Startup Owner</TableCell>
                        <TableCell sx={{ color: "white" }}>Startup Name</TableCell>
                        <TableCell sx={{ color: "white" }}>Description</TableCell>
                        <TableCell sx={{ color: "white" }}>Type of Company</TableCell>
                        <TableCell sx={{ color: "white" }}>Contact Number</TableCell>
                        <TableCell sx={{ color: "white" }}>Contact Email</TableCell>
                        <TableCell sx={{ color: "white" }}>Industry</TableCell>
                        <TableCell sx={{ color: "white" }}>Action</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={8}>
                            <Skeleton variant="rectangular" width="100%" height={60}/>
                          </TableCell>
                        </TableRow>
                      ) : (
                        startups
                        .filter((row) => row.status === 'pending')
                        .map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>
                              <div style={{ display: "flex", alignItems: "center", }}>
                                <Avatar variant="square" sx={{ border: "1px solid #336FB0", width: 50, height: 50, mr: 1, transition: "transform 0.3s ease",
                                    "&:hover": { transform: "scale(1.5)" }, }}src={row.avatarUrl}/>{row.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div style={{ display: "flex", alignItems: "center", }}>
                                <Avatar variant="square" sx={{ border: "1px solid #336FB0", width: 50, height: 50, mr: 1, transition: "transform 0.3s ease", "&:hover": { transform: "scale(1.5)" }, }} src={row.companyLogoUrl}/>{row.companyName}
                              </div>
                            </TableCell>
                            <TableCell>{row.companyDescription}</TableCell>
                            <TableCell>{row.typeOfCompany}</TableCell>
                            <TableCell>{row.phoneNumber}</TableCell>
                            <TableCell>{row.contactEmail}</TableCell>
                            <TableCell>{row.industry}</TableCell>
                            <TableCell>
                              <div style={{ display: "flex", gap: "10px" }}>
                                <Button variant="contained" color="success" onClick={() => handleApproveStartup(row.id)}>Approve</Button>
                                <Button variant="contained" color="error" onClick={() => handleRejectStartup(row.id)}>Reject</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2, }}>
                  <Typography variant="h6">
                    {filter === "all"
                      ? "User"
                      : filter === "startup"
                      ? "Startup"
                      : filter === "investor"
                      ? "Investor"
                      : "Funding Round"}{" "}
                    Information
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, }}>
                    <Select value={filter}
                      onChange={(e) => {
                        setFilter(e.target.value);
                        setPage(1);
                      }}
                      sx={{ minWidth: 200, height: 45, ".MuiSelect-select": { padding: "8px 14px", display: "flex", alignItems: "center", },}}>
                      <MenuItem value="all">Users</MenuItem>
                      <MenuItem value="startup">Startups</MenuItem>
                      <MenuItem value="investor">Investors</MenuItem>
                      <MenuItem value="funding">Funding Rounds</MenuItem>
                    </Select>

                    <Tooltip title={`Generate Report for ${filter}`} arrow>
                      <Button variant="contained" onClick={downloadData}>
                        <DescriptionIcon />
                      </Button>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Render your table based on paginated data */}
                {renderTable(paginatedData)}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminDashboard;