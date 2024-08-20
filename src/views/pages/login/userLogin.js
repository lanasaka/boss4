import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import logo from '../../../assets/Boss4 Student logo_1.png';

const UserLogin = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    setIsButtonDisabled(!(name && password));
  }, [name, password]);

  const handleLogin = async () => {
    if (!name || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    try {
      const response = await fetch('https://boss4edu-a37be3e5a8d0.herokuapp.com/api/users/subset', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const users = await response.json();
        const user = users.find(user => user.name === name && user.password === password);

        if (user) {
          localStorage.setItem('userId', user.id); // Store the user ID in local storage
          localStorage.setItem('userName', user.name); // Store the user name in local storage
          localStorage.setItem('userEmail', user.email); // Store the user email in local storage
          localStorage.setItem('userRole', user.role); // Store the user role in local storage
          localStorage.setItem('userCompany', user.company); // Store the user company in local storage
          
          console.log('Logged in user ID:', user.id); // Log the user ID
          toast.success('Login successful');
          navigate('/dashboard');
        } else {
          toast.error('Invalid username or password');
        }
      } else {
        toast.error('Invalid username or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('An error occurred during login');
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4" style={{ height: '350px' }}>
                <CCardBody>
                  <CForm>
                    <h1>WELCOME!</h1>
                    <p className="text-medium-emphasis">Log In to your user account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          className="px-4"
                          style={{ backgroundColor: '#54af47', border: 'none', outline: 'none' }}
                          onClick={handleLogin}
                          disabled={isButtonDisabled}
                        >
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        {/* Additional content if needed */}
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard
                className="text-white py-5 d-flex justify-content-center align-items-center"
                style={{ width: '44%', backgroundColor: '#C8FFBC', height: '350px' }}
              >
                <img src={logo} alt="Logo for Boss4 Student" style={{ maxWidth: '140%', maxHeight: '140%', width: 'auto', height: 'auto' }} />
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
      <ToastContainer />
    </div>
  );
};

export default UserLogin;
