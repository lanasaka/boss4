import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ShowApps = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchApplications = async () => {
    try {
      // Retrieve userId from localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }
  
      const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/applications?userId=${userId}`);
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error fetching applications. Please try again later.');
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const deleteApplication = async (id) => {
    try {
      const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/applications/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchApplications();
        toast.success('Application deleted successfully');
      } else {
        toast.error('Failed to delete application');
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error('Error deleting application. Please try again later.');
    }
  };

  const getButtonConfig = (application) => {
    switch (application.type) {
      case 'new':
        return { text: 'New', color: 'secondary' };
      case 'waiting':
        return { text: 'Waiting', color: 'warning' };
      case 'offer':
        return { text: 'Offer', color: 'primary' };
      case 'payment':
        return { text: 'Payment', color: 'info' };
      case 'acceptance':
        return { text: 'Acceptance', color: 'success' };
      case 'rejected':
        return { text: 'Rejected', color: 'danger' };
      case 'complete':
        return { text: 'Complete', color: 'dark' };
      default:
        return { text: 'New', color: 'secondary' };
    }
  };

  const filteredApplications = applications.filter((app) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <h4 className="mt-4 mb-4">List of Applications</h4>
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by Name or Email"
        className="mb-3"
      />
      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Nationality</th>
            <th>Email</th>
            <th>University</th>
            <th>Academic Degree</th>
            <th>Program</th>
            <th>Semester</th>
            <th>Application Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredApplications.map((app, index) => (
            <tr key={app.id}>
              <th scope="row">{index + 1}</th>
              <td>{app.name}</td>
              <td>{app.nationality}</td>
              <td>{app.email}</td>
              <td>{app.university}</td>
              <td>{app.academicDegree}</td>
              <td>{app.program}</td>
              <td>{app.semester}</td>
              <td>
                <Button color={getButtonConfig(app).color} size="md">{getButtonConfig(app).text}</Button>
              </td>
              <td>
                <Button color="info" size="md" className="mr-2">
                  <Link to={`/apps/${app.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>Details</Link>
                </Button>
                <Button color="danger" size="md" onClick={() => deleteApplication(app.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ShowApps;
