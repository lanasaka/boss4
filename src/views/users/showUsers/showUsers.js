import React, { useState, useEffect } from 'react';
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
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react';

import ConfirmationModal from '../../../components/ConfirmationModal'; // adjust the path as needed

const ShowUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null); // New state for the user to edit

  useEffect(() => {
    fetchUsers();
  }, []); // Fetch users when component mounts

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://boss4edu-a37be3e5a8d0.herokuapp.com/api/users');
      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const handleEditClick = (user) => {
    setUserToEdit(user);
  };

  const handleSaveEdit = async () => {
    // Implement logic to save edited user data
    // You can send a PUT request to update the user data
    // After saving, reset the userToEdit state to null and fetch the updated user list
    setUserToEdit(null);
    fetchUsers();
  };

  const handleCancelEdit = () => {
    setUserToEdit(null);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowConfirmationModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/users/${userToDelete.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          console.log('User deleted successfully');
          // Refresh users list after deletion
          fetchUsers();
        } else {
          const errorMessage = await response.text();
          throw new Error(`Failed to delete user: ${errorMessage}`);
        }
      } catch (error) {
        console.error(error);
      }
    }
    setShowConfirmationModal(false);
    setUserToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowConfirmationModal(false);
    setUserToDelete(null);
  };

  const navigateToAddUser = () => {
    navigate('/users/addUser');
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light" style={{ marginTop: '-20vh' }}>
      <CContainer>
        <CCard>
          <CCardBody>
            <h3 className="text-center mb-4">Users List</h3>
            <CForm className="mb-3">
              <CFormInput
                type="text"
                placeholder="Search users"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control-sm"
              />
            </CForm>
            <CTable striped hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Logo</CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Role</CTableHeaderCell>
                  <CTableHeaderCell>Company</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredUsers.map((user) => (
                  <CTableRow key={user.id}>
                    <CTableDataCell>
                      <img src={user.logo} alt="Logo" style={{ width: '50px', height: '50px' }} />
                    </CTableDataCell>
                    <CTableDataCell>{user.name}</CTableDataCell>
                    <CTableDataCell>{user.email}</CTableDataCell>
                    <CTableDataCell>{user.role}</CTableDataCell>
                    <CTableDataCell>{user.company}</CTableDataCell>
                    <CTableDataCell>
                      <CButton color="primary" size="sm" className="me-2" onClick={() => handleEditClick(user)}>
                        Edit
                      </CButton>
                      <CButton color="danger" size="sm" onClick={() => handleDeleteClick(user)}>
                        Delete
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <div className="text-center mt-4">
              <CButton color="success" onClick={navigateToAddUser}>
                Add User
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      </CContainer>
      <ConfirmationModal
        show={showConfirmationModal}
        onHide={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        userName={userToDelete ? userToDelete.name : ''}
      />
      {userToEdit && (
        <CCard className="mt-4">
     
<CCardBody>

  <h4 className="mb-4">Edit User</h4>
  <CForm>
    <CRow className="mb-3">
    <CCol sm="6">
    <CFormLabel htmlFor="editName">Name</CFormLabel>
    <CFormInput
  id="editName"
  value={userToEdit.name}
  onChange={(e) => setUserToEdit({ ...userToEdit, name: e.target.value })}
/>
</CCol>
<CCol sm="6">
<CFormLabel htmlFor="editEmail">E-mail</CFormLabel>
<CFormInput
  id="editEmail"
  value={userToEdit.email}
  onChange={(e) => setUserToEdit({ ...userToEdit, email: e.target.value })}
/>
</CCol>

    </CRow>
    <CRow className="mb-3">
      <CCol sm="6">
        <CFormLabel htmlFor="editRole">Role</CFormLabel>
        <CFormInput
          id="editRole"
          value={userToEdit.role}
          onChange={(e) => setUserToEdit({ ...userToEdit, role: e.target.value })}
        />
      </CCol>
      <CCol sm="6">
        <CFormLabel htmlFor="editCompany">Company</CFormLabel>
        <CFormInput
          id="editCompany"
          value={userToEdit.company}
          onChange={(e) => setUserToEdit({ ...userToEdit, company: e.target.value })}
        />
      </CCol>
    </CRow>
    {/* Add more form fields for editing user info as needed */}
    <CButton color="primary" className="me-2" onClick={handleSaveEdit}>
      Save
    </CButton>
    <CButton color="secondary" onClick={handleCancelEdit}>
      Cancel
    </CButton>
  </CForm>
</CCardBody>

        </CCard>
      )}
    </div>
  );
};

export default ShowUsers;
