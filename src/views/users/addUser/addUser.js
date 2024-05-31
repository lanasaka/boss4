import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
} from '@coreui/react';

const AddUser = () => {
  const navigate = useNavigate();
  const [logoFile, setLogoFile] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
    company: ''
  });



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('email', formData.email);
      formDataObj.append('role', formData.role);
      formDataObj.append('password', formData.password);
      formDataObj.append('company', formData.company);
      formDataObj.append('logo', logoFile);
      
      const response = await fetch('http://localhost:5002/api/users', {
        method: 'POST',
        body: formDataObj
      });

      if (response.ok) {
        console.log('User added successfully');
        setFormData({
          name: '',
          email: '',
          role: '',
          password: '',
          company: ''
        });
        // Fetch the updated users list after adding a user
        const usersResponse = await fetch('http://localhost:5002/api/users');
        const usersData = await usersResponse.json();
        navigate('/users/showUsers', { state: { users: usersData } }); // Pass the updated users list
      } else {
        console.error('Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user', error);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-start justify-content-center bg-light" style={{ paddingTop: '10px' }}>
      <CContainer>
        <CRow className="justify-content-center">
          <CCol sm="8" lg="6">
            <CCard className="p-4 shadow">
              <CCardBody>
                <CForm onSubmit={handleSubmit}>
                  <h3 className="text-center mb-4">ADD USER</h3>
                  <CFormLabel>Name</CFormLabel>
                  <CFormInput
                    type="text"
                    placeholder="Enter name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <CFormLabel className="mt-3">Email</CFormLabel>
                  <CFormInput
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
               
                  <CFormLabel className="mt-3">Password</CFormLabel>
                  <CFormInput
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                     <CFormLabel className="mt-3">Role</CFormLabel>
                  <CFormInput
                    type="text"
                    placeholder="Enter role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  />
                  <CFormLabel className="mt-3">Company</CFormLabel>
                  <CFormInput
                    type="text"
                    placeholder="Enter company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                  />
                  <div className="mt-3">
                    <label htmlFor="logoUpload" className="btn btn-primary">
                      Upload Logo
                    </label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      id="logoUpload"
                      onChange={handleFileChange} 
                      ref={fileInputRef} 
                      style={{ display: 'none' }} 
                    />
                  </div>
                  
                  <div className="mt-4 d-grid">
                    <CButton type="submit" color="success">Add</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default AddUser;
