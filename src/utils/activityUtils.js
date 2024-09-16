import axios from 'axios';

const API_URL = 'http://localhost:3000/activities';

export const fetchRecentActivities = async (setRecentActivities) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.status === 200) {
      setRecentActivities(response.data);
    } else {
      console.error('Error fetching recent activities:', response.data);
    }
  } catch (error) {
    console.error('Error fetching recent activities:', error);
  }
};

export const logActivity = async (action, details, fetchRecentActivities) => {
  try {
    const response = await axios.post(API_URL, { action, details }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (response.status === 201) {
      console.log('Activity logged successfully:', response.data);
      // Refresh activities immediately after logging
      await fetchRecentActivities();
    } else {
      console.error('Error logging activity:', response.data);
    }
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};
