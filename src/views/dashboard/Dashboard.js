import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react';
import './styles.css'; // Import the CSS file

const Dashboard = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('User ID not found');
        }
        const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/applications?userId=${userId}`);
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, []);

  const countStatuses = () => {
    let statusCounts = {
      'new': 0,
      'offer': 0,
      'acceptance': 0,
      'payment': 0,
      'waiting': 0,
      'rejected': 0,
      'complete': 0
    };

    applications.forEach((app) => {
      const type = app.appType || 'new'; // Assuming appType is the property you want to count
      if (statusCounts.hasOwnProperty(type)) {
        statusCounts[type]++;
      } else {
        statusCounts['new']++;
      }
    });

    return statusCounts;
  };

  const { new: newCount, offer: offerCount, acceptance: acceptanceCount, payment: paymentCount, waiting: waitingCount, rejected: rejectedCount, complete: completeCount } = countStatuses();

  return (
    <CRow>
      {Object.entries(countStatuses()).map(([status, count]) => (
        <CCol sm="6" lg="3" key={status}>
          <CCard>
            <CCardHeader>{status.charAt(0).toUpperCase() + status.slice(1)}</CCardHeader>
            <CCardBody>
              <h4>{count}</h4>
            </CCardBody>
          </CCard>
        </CCol>
      ))}
    </CRow>
  );
};

export default Dashboard;
