import Axios from 'axios';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import React, { useState, useEffect } from 'react';

const NewApp = () => {
  const [Name, setName] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nationality, setNationality] = useState('');
  const [countryResidence, setCountryResidence] = useState('');
  const [academicDegree, setAcademicDegree] = useState('');
  const [universities, setUniversities] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [passportPhoto, setPassportPhoto] = useState(null);

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
      extraFileName: ''
    });
  
    const handleFileChange = (event, fieldName) => {
      setFormData({
        ...formData,
        [fieldName]: event.target.files[0]
      });
    };
    const handleTypeChange = (e) => {
      setFormData({
        ...formData,
        type: e.target.value
      });
    };
    
  
    const handleFormSubmit = async () => {
      try {
        const formDataToSend = new FormData();
        for (const key in formData) {
          formDataToSend.append(key, formData[key]);
        }
  
        // Retrieve userId from localStorage
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('User ID not found');
        }
  
        // Add userId to form data
        formDataToSend.append('userId', userId);
  
        // Submit form data to the backend
        await Axios.post('https://boss4edu-a37be3e5a8d0.herokuapp.com/api/applications', formDataToSend);
        alert('Application submitted successfully!');
  
        // Reset form data after successful submission
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
      } catch (error) {
        console.error('Error submitting application:', error);
        alert('Error submitting application. Please try again later.');
      }
    };
  

    useEffect(() => {
      fetchUniversities();
    }, [academicDegree]);
    const handleAcademicDegreeChange = (selectedDegree) => {
      setFormData({
        ...formData,
        academicDegree: selectedDegree
      });
    };
    
  
    const fetchUniversities = () => {
      if (academicDegree) {
        Axios.get(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/${academicDegree}-universities`)
          .then(response => {
            setUniversities(response.data);
          })
          .catch(error => {
            console.error('Error fetching universities:', error);
          });
      }
    };
  
    const fetchPrograms = (universityId, academicDegree) => {
      let programEndpoint;
      if (academicDegree === 'diploma') {
        programEndpoint = 'diploma_programs';
      } else if (academicDegree === 'bachelor') {
        programEndpoint = 'bachelor_programs';
      } else if (academicDegree === 'master') {
        programEndpoint = 'master_programs';
      } else if (academicDegree === 'phd') {
        programEndpoint = 'phd_programs';
      }
  
      Axios.get(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/universities/${universityId}/${programEndpoint}`)
        .then(response => {
          setPrograms(response.data);
        })
        .catch(error => {
          console.error('Error fetching programs:', error);
        });
    };
      const handleUniversityChange = (e) => {
      const universityId = e.target.value;
      const selectedUniversity = universities.find(university => university.id === parseInt(universityId));
      const universityName = selectedUniversity ? selectedUniversity.name : ''; // Get the name of the selected university
      
      setFormData({
        ...formData,
        university: universityName // Save the name of the selected university
      });
      fetchPrograms(universityId, academicDegree);
    };
    
    const handleProgramChange = (e) => {
      const selectedProgramId = e.target.value;
      const selectedProgram = programs.find(program => program.id === parseInt(selectedProgramId));
      const programName = selectedProgram ? selectedProgram.name : ''; // Get the name of the selected program
    
      setFormData({
        ...formData,
        program: programName // Save the name of the selected program
      });
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value
      });
    };
    const handleInputChange2 = (event) => {
      const { name, value } = event.target;
      setFormData({
        ...formData,
        [name]: value.toUpperCase() // Convert input to uppercase
      });
    };
    const handleSemesterChange = (e) => {
      const selectedSemester = e.target.value;
      setFormData({
        ...formData,
        semester: selectedSemester
      });
    };
  
    return (
      <Container>
        <Row>
          <Col md="4">
            <Card>
              <CardBody>
                <h4 className="card-title">Personal Information</h4>
                <Form>
                  <FormGroup>
                    <Label for="name">Student First Name + Father Name + Last Name<span style={{ color: 'red' }}>*</span></Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter student's name"
                      value={formData.name}
                      onChange={handleInputChange2}
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
                </Form>
              </CardBody>
            </Card>
          </Col>
  
          <Col md="4">
            <Card>
              <CardBody>
                <h4 className="card-title">Documents</h4>
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
              </CardBody>
            </Card>
          </Col>
  
          <Col md="4">
            <Card>
              <CardBody>
                <h4 className="card-title">Application Information</h4>
                <Form>
                <FormGroup>
              <Label for="type">Student Type <span style={{ color: 'red' }}>*</span></Label>
              <Input
                type="select"
                id="type"
                onChange={handleTypeChange}
                value={formData.type} // Ensure the selected value reflects the state
              >
                <option value="">Select Student type</option>
                <option value="newStudent">New Student</option>
                <option value="transferStudent">Transfer Student</option>
              </Input>
            </FormGroup>

                <FormGroup>
            <Label for="academicDegree">Academic Degree <span style={{ color: 'red' }}>*</span></Label>
            <Input
              type="select"
              id="academicDegree"
              value={academicDegree}
              onChange={(e) => {
                setAcademicDegree(e.target.value);
                handleAcademicDegreeChange(e.target.value);
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
                    onChange={handleUniversityChange}
                  >
                    <option value="">Select University</option>
                    {universities.map(university => (
                      <option key={university.id} value={university.id}>{university.name}</option>
                    ))}
                  </Input>
                </FormGroup>  
               
                <FormGroup>
                  <Label for="program">Program <span style={{ color: 'red' }}>*</span></Label>
                  <Input
                  type="select"
                  id="program"
                  onChange={(e) => {
                    setFormData({ ...formData, program: e.target.value });
                    handleProgramChange(e); // Call handleProgramChange separately
                  }}
                >

                    <option value="">Select Program</option>
                    {programs.map(program => (
                      <option key={program.id} value={program.id}>{program.name}</option>
                    ))}
                  </Input>
                </FormGroup>
                  <FormGroup>
                    <Label for="semester">Semester <span style={{ color: 'red' }}>*</span></Label>
                    <Input type="select" id="semester" name="semester" value={formData.semester} onChange={handleSemesterChange}>
                      <option value="">Select Semester</option>
                      <option value="spring">Spring</option>
                      <option value="fall">Fall</option>
                    </Input>
                  </FormGroup>
                  <Button color="primary" onClick={handleFormSubmit}>
                    Submit
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  };
  
  export default NewApp;
  