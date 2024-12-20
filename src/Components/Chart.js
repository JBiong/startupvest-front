import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { CircularProgress, Box, Typography } from '@mui/material';

// Register chart elements
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MonthlyFundingChart = ({ userId, companyId }) => {
  const currentYear = new Date().getFullYear();
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(currentYear);

  // Years for the dropdown from current year to 4 years back
  const availableYears = Array.from({ length: 5 }, (val, index) => currentYear - index);

  // Function to convert "YYYY-MM" to month name
  const getMonthName = (monthString) => {
    const date = new Date(monthString + '-01'); // Add a day to create a valid date
    return date.toLocaleString('default', { month: 'long' }); // Get the full month name
  };

  useEffect(() => {
    const fetchMonthlyFunding = async () => {
      try {
        let url = '';
        if (userId) {
          url = `${process.env.REACT_APP_API_URL}/funding-rounds/monthly-funding/${userId}?year=${year}`;
        } else if (companyId) {
          url = `${process.env.REACT_APP_API_URL}/funding-rounds/company-monthly-funding/${companyId}?year=${year}`;
        } else {
          const storedUserId = localStorage.getItem('userId');
          if (storedUserId) {
            url = `${process.env.REACT_APP_API_URL}/funding-rounds/monthly-funding/${storedUserId}?year=${year}`;
          } else {
            throw new Error('User ID or Company ID must be provided');
          }
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = response.data;
        const labels = data.map(item => {
          const date = new Date(item.month);
          return date.toLocaleString('default', { month: 'short', year: 'numeric' });
        });
        const totals = data.map(item => item.total);

        setChartData({
          labels,
          datasets: [
            {
              label: ` Monthly Funding for ${year}`,
              data: totals,
              borderColor: '#336FB0', // Updated border color
              backgroundColor: (ctx) => {
                const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, 'rgba(51, 111, 176, 0.5)'); // Updated gradient start
                gradient.addColorStop(1, 'rgba(51, 111, 176, 0)');   // Updated gradient end
                return gradient;
              },
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: '#336FB0', // Updated point color
              pointHoverRadius: 7,
              pointHoverBorderColor: '#336FB0', // Updated hover border color
              pointHoverBackgroundColor: '#fff',
            },
          ],
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching monthly funding data:', error);
        setLoading(false);
      }
    };

    fetchMonthlyFunding();
  }, [userId, companyId]);

  if (loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
      <CircularProgress />
      <Typography variant="body1" sx={{ mt: 2 }}>Loading data...</Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        minHeight: '480px',
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false,
              },
              title: {
                display: true,
                text: 'Months',
                font: {
                  size: 14,
                },
              },
            },
            y: {
              grid: {
                color: 'rgba(200, 200, 200, 0.2)', 
              },
              title: {
                display: true,
                text: 'Total Funding',
                font: {
                  size: 14,
                },
              },
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 20,
                padding: 15,
              },
            },
            tooltip: {
              backgroundColor: 'rgba(51, 111, 176, 0.8)',
              titleFont: {
                size: 14,
              },
              bodyFont: {
                size: 12,
              },
              padding: 10,
              borderColor: '#fff',
              borderWidth: 1,
            },
          },
          layout: {
            padding: {
              left: 20,
              right: 40,
            },
          },
        }}
      />
    </Box>
  );
};

export default MonthlyFundingChart;