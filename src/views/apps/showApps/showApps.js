import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Input, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ShowApps = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
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

  const buttonConfig = {
    new: { text: 'New', color: 'secondary' },
    waiting: { text: 'Waiting', color: 'warning' },
    offer: { text: 'Offer', color: 'primary' },
    payment: { text: 'Payment', color: 'info' },
    acceptance: { text: 'Acceptance', color: 'success' },
    rejected: { text: 'Rejected', color: 'danger' },
    complete: { text: 'Complete', color: 'dark' }
  };

  const filteredApplications = applications.filter(({ name, email }) =>
    name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container className="text-center">
        <Spinner style={{ width: '3rem', height: '3rem' }} /> Loading applications...
      </Container>
    );
  }

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
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app, index) => {
              const { id, name, nationality, email, university, academicDegree, program, semester, appType } = app;
              const { text, color } = buttonConfig[appType] || buttonConfig.new;
              return (
                <tr key={id}>
                  <th scope="row">{index + 1}</th>
                  <td>{name}</td>
                  <td>{nationality}</td>
                  <td>{email}</td>
                  <td>{university}</td>
                  <td>{academicDegree}</td>
                  <td>{program}</td>
                  <td>{semester}</td>
                  <td>
                    <Button color={color} size="md">{text}</Button>
                  </td>
                  <td>
                    <Button color="info" size="md" className="mr-2">
                      <Link to={`/apps/${id}`} style={{ color: 'inherit', textDecoration: 'none' }}>Details</Link>
                    </Button>
                    <Button color="danger" size="md" onClick={() => deleteApplication(id)}>Delete</Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="10" className="text-center">No applications found</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default ShowApps;
