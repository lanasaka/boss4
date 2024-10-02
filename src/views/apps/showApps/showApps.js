import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Input, Spinner,Row,Col,Card,CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const ShowApps = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [applicationTypeFilter, setApplicationTypeFilter] = useState('');
  const applicationTypes = ['new', 'waiting', 'offer', 'payment', 'acceptance', 'rejected', 'complete'];
  const fetchApplications = async () => {
    try {
      // Retrieve userId from localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }
  
      const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/applications?userId=${userId}`);
      const data = await response.json();
      
      // Log appType values for each application
      data.forEach(app => {
        console.log(`Application ID: ${app.id}, appType: ${app.appType}`);
      });
  
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
      const response = await axios.delete(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/applications/${id}`);
      if (response.status === 200) {
        fetchApplications();
        toast.success('Application deleted successfully');
      } else {
        toast.error('Failed to delete application');
      }
    } catch (error) {
      console.error('Error deleting application:', error.response ? error.response.data : error.message);
      toast.error('Error deleting application. Please try again later.');
    }
  };
  
  
  const getButtonConfig = (application) => {
    switch (application.appType) {
      case 'new':
        return { text: 'New Application', color: 'secondary' };
      case 'waiting':
        return { text: 'Waiting for data processing', color: 'warning' };
      case 'offer':
        return { text: 'Initial Acceptance', color: 'primary' };
      case 'payment':
        return { text: 'Waiting for payment', color: 'info' };
      case 'acceptance':
        return { text: 'Final Acceptance', color: 'success' };
      case 'rejected':
        return { text: 'Rejected', color: 'danger' };
      case 'complete':
        return { text: 'Completed', color: 'dark' };
      default:
        return { text: 'New Application', color: 'secondary' };
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearchTerm = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               app.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesApplicationType = applicationTypeFilter === '' || 
                                   (applicationTypeFilter === 'new' && (app.appType === '' || !app.appType || app.appType === 'new')) ||
                                   app.appType === applicationTypeFilter;



    return matchesSearchTerm && matchesApplicationType;
  });

  if (loading) {
    return (
      <Container className="text-center">
        <Spinner style={{ width: '3rem', height: '3rem' }} /> Loading applications...
      </Container>
    );
  }

  return (
    <Container>
      <Card className="mb-4" style={{ borderColor: '#28a745', borderWidth: '2px', borderStyle: 'solid' }}>
        <CardBody>
          <Row className="align-items-center">
            <Col md={6} className="mb-3 mb-md-0">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Name or Email"
                className="w-100"
                style={{ maxWidth: '650px', borderColor: '#28a745' }}
              />
            </Col>
            <Col md={6}>
              <Row form>
                <Col md={6} className="mb-3">
                  <label className="mr-2">Filter by Application Status:</label>
                  <Input
                    type="select"
                    value={applicationTypeFilter}
                    onChange={(e) => setApplicationTypeFilter(e.target.value)}
                    style={{ borderColor: '#28a745' }}
                  >
                    <option value="">All Types</option>
                    <option value="new">New Application</option>
                    <option value="waiting">Waiting for data processing</option>
                    <option value="offer">Initial Acceptance</option>
                    <option value="payment">Waiting for payment</option>
                    <option value="acceptance">Final Acceptance</option>
                    <option value="complete">Completed</option>
                    {applicationTypes.filter(type => type !== 'new' && type !== 'waiting' && type !== 'offer' && type !== 'payment' && type !== 'acceptance' && type !== 'complete').map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </Input>
                </Col>

              </Row>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Application Code</th>
            <th>Name</th>
            <th>Nationality</th>
            <th>Email</th>
            <th>Semester</th>
            <th>Application Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app, index) => {
              const { id, name, nationality, email, university, academicDegree, program, semester, appType } = app;
            
              return (
                <tr key={id}>
                  <th scope="row">{index + 1}</th>
                  <td>{app.applicationCode}</td>
                  <td>{name}</td>
                  <td>{nationality}</td>
                  <td>{email}</td>
                  <td>{semester}</td>
                  <td>
                <Button color={getButtonConfig(app).color} size="md">{getButtonConfig(app).text}</Button>
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
