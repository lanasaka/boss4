import Axios from 'axios';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import React, { useState, useEffect } from 'react';
import './NewApp.css'; // Import your custom CSS for additional styling

const NewApp = () => {
  const [applicationId, setApplicationId] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [academicDegree, setAcademicDegree] = useState('');
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    passportNumber: '',
    email: '',
    phoneNumber: '',
    nationality: '',
    countryResidence: '',
    type: '',
    academicDegree: '',
    semester: '',
    university: '',
    program: '',
    passportPhoto: null,
    personalPhoto: null,
    highSchoolCertificate: null,
    highSchoolCertificateEnglish: null,
    highSchoolTranscript: null,
    highSchoolTranscriptEnglish: null,
    extraFile: null,
    extraFileName: '',
    applicationCode: '' 
    
  });

  const [activeTab, setActiveTab] = useState('personal');
  const generateApplicationCode = () => {
    return `#ST-${Date.now()}`; // Simple example: timestamp-based code
  };

  // Function to handle file changes
  const handleFileChange = (event, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: event.target.files[0]
    });
  };

  
  // const handleApplicationSubmit = async () => {
  //   try {
  //     const formDataToSend = new FormData();
  //     for (const key in formData) {
  //       formDataToSend.append(key, formData[key]);
  //     }

  //     const userId = localStorage.getItem('userId');
  //     if (!userId) {
  //       throw new Error('User ID not found');
  //     }

  //     formDataToSend.append('userId', userId);

  //     const response = await Axios.post('https://boss4edu-a37be3e5a8d0.herokuapp.com/api/applications', formDataToSend);

  //     console.log('Full Response:', response);
  //     console.log('Response Data:', response.data);

  //     const applicationId = response.data.id;
  //     setApplicationId(applicationId);
  //     console.log('Submitted Application ID:', applicationId);
  //     alert('Application submitted successfully!');
  //     goToUniversityTab();
  //   } catch (error) {
  //     console.error('Error submitting application:', error);
  //     alert('Error submitting application. Please try again later.');
  //   }
  // };
  
  const handleApplicationSubmit = async () => {
    try {
      const applicationCode = generateApplicationCode();
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      formDataToSend.append('applicationCode', applicationCode);
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName');
      if (!userId || !userName) {
        throw new Error('User ID or Name not found');
      }
  
      formDataToSend.append('userId', userId);
      formDataToSend.append('userName', userName);
  
      const response = await Axios.post('https://boss4edu-a37be3e5a8d0.herokuapp.com/api/applications', formDataToSend);
      const { id } = response.data;
      setApplicationId(id);
      setFormData({
        ...formData,
        applicationCode // Set application code in form data state
      });
      alert('Application submitted successfully!');
      goToUniversityTab();
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again later.');
    }
  };
  
  
  const goToUniversityTab = () => {
    setActiveTab('university');
  };
  const handleApplicationDetailsSubmit = async () => {
    try {
      if (!applicationId) {
        alert('Application ID is missing. Please submit the application first.');
        return;
      }
  
      const dataToSend = {
        application_id: applicationId, // Ensure applicationId is included
        academic_degree: formData.academicDegree,
        university: formData.university,
        program: formData.program,
        application_code: formData.applicationCode // Include application code
      };

      await Axios.post('https://boss4edu-a37be3e5a8d0.herokuapp.com/api/application-details', dataToSend, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert('Application Details submitted successfully!');
    } catch (error) {
      console.error('Error submitting application details:', error);
      alert('Error submitting application details. Please try again later.');
    }
  };
  
  

useEffect(() => {
  fetchUniversities();
}, [academicDegree]);

  // Function to handle form submission
  const handleFormSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName');
      if (!userId || !userName) {
        throw new Error('User ID or Name not found');
      }

      formDataToSend.append('userId', userId);
      formDataToSend.append('userName', userName);

      await Axios.post('https://boss4edu-a37be3e5a8d0.herokuapp.com/api/applications', formDataToSend);
      alert('Application submitted successfully!');
      resetForm(); // Reset the form after successful submission
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again later.');
    }
  };

  // Function to fetch universities based on selected academic degree
  useEffect(() => {
    fetchUniversities();
  }, [academicDegree]);

  
  const handleAcademicDegreeChange = (selectedDegree) => {
    setFormData({
      ...formData,
      academicDegree: selectedDegree
    });
  };
  
  const handleUniversityChange = (e) => {
    const universityId = e.target.value;
    const selectedUniversity = universities.find(university => university.id === parseInt(universityId));
    
    setFormData({
      ...formData,
      university: selectedUniversity ? selectedUniversity.name : ''
    });
    
    fetchPrograms(universityId, formData.academicDegree);
  };
  
  const handleProgramChange = (e) => {
    const selectedProgramId = e.target.value;
    const selectedProgram = programs.find(program => program.id === parseInt(selectedProgramId));
    
    setFormData({
      ...formData,
      program: selectedProgram ? selectedProgram.name : ''
    });
  };
  
const fetchUniversities = () => {
  if (academicDegree) {
    Axios.get(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/${academicDegree}-universities`)
      .then(response => {
        setUniversities(response.data); // response.data should be an array of universities
      })
      .catch(error => {
        console.error('Error fetching universities:', error);
      });
  }
};

const fetchPrograms = (universityId, academicDegree) => {
  let programEndpoint;
  switch (academicDegree) {
    case 'diploma':
      programEndpoint = 'diploma_programs';
      break;
    case 'bachelor':
      programEndpoint = 'bachelor_programs';
      break;
    case 'master':
      programEndpoint = 'master_programs';
      break;
    case 'phd':
      programEndpoint = 'phd_programs';
      break;
    default:
      programEndpoint = '';
  }

  if (programEndpoint) {
    Axios.get(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/universities/${universityId}/${programEndpoint}`)
      .then(response => {
        setPrograms(response.data); // response.data should be an array of programs
      })
      .catch(error => {
        console.error('Error fetching programs:', error);
      });
  }
};


  // Function to handle input changes (except for special cases like nationality)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Function to handle specific input changes that require uppercasing
  const handleInputChange2 = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value.toUpperCase()
    });
  };

  // Function to handle changes in semester selection
  const handleSemesterChange = (e) => {
    const selectedSemester = e.target.value;
    setFormData({
      ...formData,
      semester: selectedSemester
    });
  };

  // Function to reset the form fields
  const resetForm = () => {
    setFormData({
      name: '',
      passportNumber: '',
      email: '',
      phoneNumber: '',
      nationality: '',
      countryResidence: '',
      type: '',
      academicDegree: '',
      semester: '',
      university: '',
      program: '',
      passportPhoto: null,
      personalPhoto: null,
      highSchoolCertificate: null,
      highSchoolCertificateEnglish: null,
      highSchoolTranscript: null,
      highSchoolTranscriptEnglish: null,
      extraFile: null,
      extraFileName: ''
    });
  };

  // Function to navigate to Documents tab
  const goToDocumentsTab = () => {
    setActiveTab('documents');
  };

  // Function to navigate to Application Information tab
  const goToApplicationTab = () => {
    setActiveTab('application');
  };

  return (
    <div className="application-details">
   
   <div className="tabs">
        <button className={activeTab === 'personal' ? 'active-tab' : 'inactive-tab'} onClick={() => setActiveTab('personal')}>
          Personal Information
        </button>
        <button className={activeTab === 'documents' ? 'active-tab' : 'inactive-tab'} onClick={goToDocumentsTab}>
          Documents
        </button>
        <button className={activeTab === 'application' ? 'active-tab' : 'inactive-tab'} onClick={goToApplicationTab}>
          Application Information
        </button>
        <button className={activeTab === 'university' ? 'active-tab' : 'inactive-tab'} onClick={goToUniversityTab}>
          University Information
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 'personal' && (
          <Row className="justify-content-center">
            <Col md="6">
           
                <CardBody>
                  <h4 className="card-title">Personal Information</h4>
                  <Form>
                    <FormGroup>
                      <Label for="name"> Student First Name + Father Name + Last Name  <span style={{ color: 'red' }}>*</span></Label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter student's name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="passportNumber">Passport Number <span style={{ color: 'red' }}>*</span></Label>
                      <Input
                        type="text"
                        id="passportNumber"
                        name="passportNumber"
                        placeholder="Enter passport number"
                        value={formData.passportNumber}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="email">Email <span style={{ color: 'red' }}>*</span></Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="phoneNumber">Phone Number <span style={{ color: 'red' }}>*</span></Label>
                      <Input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        placeholder="Enter phone number"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="nationality">Nationality <span style={{ color: 'red' }}>*</span></Label>
                      <Input
                        type="text"
                        id="nationality"
                        name="nationality"
                        placeholder="Enter nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="countryResidence">Country of Residence <span style={{ color: 'red' }}>*</span></Label>
                      <Input
                        type="text"
                        id="countryResidence"
                        name="countryResidence"
                        placeholder="Enter country of residence"
                        value={formData.countryResidence}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                    <Button color="success" onClick={goToDocumentsTab}>
                      Next: Documents
                    </Button>
                  </Form>
                </CardBody>
    
            </Col>
          </Row>
        )}

        {activeTab === 'documents' && (
           <Row className="justify-content-center">
            <Col md="6">
        
                <CardBody>
                  <h4 className="card-title">Documents</h4>
                  <Form>
                    <FormGroup>
                      <Label for="passportPhoto">Passport Photo <span style={{ color: 'red' }}>*</span></Label>
                      <Input
                        type="file"
                        id="passportPhoto"
                        onChange={(e) => handleFileChange(e, 'passportPhoto')}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="personalPhoto">Personal Photo</Label>
                      <Input
                        type="file"
                        id="personalPhoto"
                        onChange={(e) => handleFileChange(e, 'personalPhoto')}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="highSchoolCertificate">High School Certificate</Label>
                      <Input
                        type="file"
                        id="highSchoolCertificate"
                        onChange={(e) => handleFileChange(e, 'highSchoolCertificate')}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="highSchoolCertificateEnglish">High School Certificate (English Translated)</Label>
                      <Input
                        type="file"
                        id="highSchoolCertificateEnglish"
                        onChange={(e) => handleFileChange(e, 'highSchoolCertificateEnglish')}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="highSchoolTranscript">High School Transcript <span style={{ color: 'red' }}>*</span></Label>
                      <Input
                        type="file"
                        id="highSchoolTranscript"
                        onChange={(e) => handleFileChange(e, 'highSchoolTranscript')}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="highSchoolTranscriptEnglish">High School Transcript (English Translated)</Label>
                      <Input
                        type="file"
                        id="highSchoolTranscriptEnglish"
                        onChange={(e) => handleFileChange(e, 'highSchoolTranscriptEnglish')}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="extraFileName">Extra File Name</Label>
                      <Input
                        type="text"
                        id="extraFileName"
                        name="extraFileName"
                        value={formData.extraFileName}
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="extraFile">Extra File</Label>
                      <Input
                        type="file"
                        id="extraFile"
                        onChange={(e) => handleFileChange(e, 'extraFile')}
                      />
                    </FormGroup>
                    <div className="navigation-buttons">
                      <Button color="primary" onClick={() => setActiveTab('personal')}>
                        Back: Personal Information
                      </Button>
                      <Button color="success" onClick={goToApplicationTab}>
                        Next: Application Information
                      </Button>
                    </div>
                  </Form>
                </CardBody>
    
            </Col>
          </Row>
        )}

{activeTab === 'application' && (
           <Row className="justify-content-center">
            <Col md="6">
          
                <CardBody>
                  <h4 className="card-title">Application Information</h4>
                  <Form>
                    <FormGroup>
                      <Label for="type">Student Type <span style={{ color: 'red' }}>*</span></Label>
                      <Input
                        type="select"
                        id="type"
                        onChange={handleInputChange}
                        value={formData.type}
                        name="type"
                      >
                        <option value="">Select Student type</option>
                        <option value="new">New Student</option>
                        <option value="transfer">Transfer Student</option>
                      </Input>
                    </FormGroup>
                   
                    <FormGroup>
                      <Label for="semester">Semester <span style={{ color: 'red' }}>*</span></Label>
                      <Input
                        type="select"
                        id="semester"
                        name="semester"
                        value={formData.semester}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Semester</option>
                        <option value="spring">Spring</option>
                        <option value="fall">Fall</option>
                      </Input>
                    </FormGroup> 

                   
                    <div className="navigation-buttons">
                     
                    <Button color="success" onClick={handleApplicationSubmit}>Submit</Button>
                    </div>
                  </Form>
                </CardBody>
           
           
            </Col>
          </Row>
        )}
          {activeTab === 'university' && (
           <Row className="justify-content-center">
            <Col md="6">
          
                <CardBody>
                  <h4 className="card-title">University Information</h4>
                  <Form>
                    
                  <FormGroup>
                      <Label for="academicDegree">Academic Degree <span style={{ color: 'red' }}>*</span></Label>
                     <Input
                        type="select"
                        id="academicDegree"
                        value={formData.academicDegree}
                        onChange={(e) => {
                          const selectedDegree = e.target.value;
                          setAcademicDegree(selectedDegree);
                          handleAcademicDegreeChange(selectedDegree);
                        }}
                      >
                        <option value="">Select Academic Degree</option>
                        <option value="diploma">Diploma</option>
                        <option value="bachelor">Bachelor</option>
                        <option value="master">Master</option>
                        <option value="phd">PhD</option>
                      </Input>
                    </FormGroup>
                    <FormGroup>
  <Label for="university">University <span style={{ color: 'red' }}>*</span></Label>
  <Input
    type="select"
    id="university"
    value={universities.find(university => university.name === formData.university)?.id || ''}
    onChange={handleUniversityChange}
  >
    <option value="">Select University</option>
    {universities.map((university) => (
      <option key={university.id} value={university.id}>{university.name}</option>
    ))}
  </Input>
</FormGroup>

<FormGroup>
  <Label for="program">Program <span style={{ color: 'red' }}>*</span></Label>
  <Input
    type="select"
    id="program"
    value={programs.find(program => program.name === formData.program)?.id || ''}
    onChange={handleProgramChange}
  >
    <option value="">Select Program</option>
    {programs.map((program) => (
      <option key={program.id} value={program.id}>{program.name}</option>
    ))}
  </Input>
</FormGroup>
<div className="navigation-buttons">
  <Button color="primary" onClick={() => setActiveTab('application')}>
    Back: Application Information
  </Button>
  <Button color="success" onClick={handleApplicationDetailsSubmit}>
  Submit Application Details
</Button>

                    </div>
                  </Form>
                </CardBody>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default NewApp;
