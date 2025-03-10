import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from '@coreui/react';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    'new': 0,
    'offer': 0,
    'acceptance': 0,
    'payment': 0,
    'waiting': 0,
    'rejected': 0,
    'complete': 0
  });
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    role: '',
    company: ''
  });

  const statusMapping = {
    'new': { text: 'New Application', borderColor: '#737373', textColor: '#737373' },
    'waiting': { text: 'Waiting for data processing', borderColor: '#eab308', textColor: '#eab308' },
    'offer': { text: 'Initial Acceptance', borderColor: '#2563eb', textColor: '#2563eb' },
    'payment': { text: 'Waiting for payment', borderColor: '#0d9488', textColor: '#0d9488' },
    'acceptance': { text: 'Final Acceptance', borderColor: '#16a34a', textColor: '#16a34a' },
    'rejected': { text: 'Rejected', borderColor: '#dc2626', textColor: '#dc2626' },
    'complete': { text: 'Completed', borderColor: '#1f2937', textColor: '#1f2937' }
  };

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

  useEffect(() => {
    const countStatuses = () => {
      let counts = {
        'new': 0,
        'offer': 0,
        'acceptance': 0,
        'payment': 0,
        'waiting': 0,
        'rejected': 0,
        'complete': 0
      };

      applications.forEach((app) => {
        const type = app.appType || 'new'; // Assuming appType is the property for application type
        if (counts.hasOwnProperty(type)) {
          counts[type]++;
        } else {
          counts['new']++;
        }
      });

      return counts;
    };

    if (Array.isArray(applications)) {
      const counts = countStatuses();
      setStatusCounts(counts);
    }
  }, [applications]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('User ID not found');
        }
        const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/user/${userId}`);
        const data = await response.json();
        setUserInfo({
          name: data.name,
          email: data.email,
          role: data.role,
          company: data.company
        });
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <>
      {/* User Information Card */}
      <CRow className="justify-content mb-4">
        <CCol sm="12" md="6" lg="3">
          <CCard className="shadow-lg rounded-lg" style={{ maxWidth: '260px', height: 'auto', minHeight: '150px', background: 'linear-gradient(to bottom right, #f9f9f9, #e0e0e0)', borderRadius: '15px' }}>
            <CCardHeader className="text-sm text-center" style={{ fontWeight: 'bold', fontSize: '1.1rem', backgroundColor: '#54AF47', color: '#ffffff', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
              User Information
            </CCardHeader>
            <CCardBody style={{ padding: '1rem', borderBottomLeftRadius: '15px', borderBottomRightRadius: '15px' }}>
              <p style={{ margin: '5px 0', fontSize: '0.875rem', color: '#333333' }}><strong>Name:</strong> {userInfo.name}</p>
              <p style={{ margin: '5px 0', fontSize: '0.875rem', color: '#333333' }}><strong>Email:</strong> {userInfo.email}</p>
              <p style={{ margin: '5px 0', fontSize: '0.875rem', color: '#333333' }}><strong>Role:</strong> {userInfo.role}</p>
              <p style={{ margin: '5px 0', fontSize: '0.875rem', color: '#333333' }}><strong>Company:</strong> {userInfo.company}</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Status Cards */}
      <CRow className="gap-4 ">
        {Object.entries(statusCounts).map(([status, count]) => (
          <CCol sm="6" lg="3" key={status}>
            <CCard className="shadow-lg rounded-lg" style={{ border: `2px solid ${statusMapping[status].borderColor}`, borderRadius: '10px' }}>
              <CCardHeader
                style={{ color: statusMapping[status].textColor, fontWeight: 'bold', fontSize: '1.1rem' }}
                className="text-lg text-center"
              >
                {statusMapping[status].text}
              </CCardHeader>
              <CCardBody className="flex items-center justify-center">
                <h4
                  style={{ color: statusMapping[status].textColor, fontWeight: 'bold' }}
                  className="text-3xl text-center"
                >
                  {count}
                </h4>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
    </>
  );
};

export default Dashboard;
