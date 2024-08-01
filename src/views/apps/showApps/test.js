import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import axios from 'axios';
import Axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ApplicationDetails = () => {
  const { appId } = useParams();

  const [notes, setNotes] = useState([]);
  
 

  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const [error, setError] = useState(null);
  const [PassportNumber, setPassportNumber] = useState('');
  const [application, setApplication] = useState(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [Name, setName] = useState('');
  const [isOfferLetterUploaded, setIsOfferLetterUploaded] = useState(false);
  const [isAcceptanceLetterUploaded, setIsAcceptanceLetterUploaded] = useState(false);
  const [isReceiptUploaded, setIsReceiptUploaded] = useState(false);
  const [type, setType] = useState('');  // Changed from array to string
  const [semester, setSemester] = useState('');  // Changed from array to string
  const [extraFileName, setExtraFileName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nationality, setNationality] = useState('');
  const [countryResidence, setCountryResidence] = useState('');
  const [academicDegree, setAcademicDegree] = useState('');
  const [universities, setUniversities] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [passportPhoto, setPassportPhoto] = useState(null);

    const [offerLetter, setOfferLetter] = useState(null);
    const [acceptanceLetter, setAcceptanceLetter] = useState(null);
    const [receipt, setReceipt] = useState(null);
    const [offerLetterName, setOfferLetterName] = useState('');
    const [acceptanceLetterName, setAcceptanceLetterName] = useState('');
    const [receiptName, setReceiptName] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [offerLetterUrl, setOfferLetterUrl] = useState('');
const [acceptanceLetterUrl, setAcceptanceLetterUrl] = useState('');
const [receiptUrl, setReceiptUrl] = useState('');


  // Add state variables for other document URLs as needed


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
    offerLetter: null,
    acceptanceLetter: null,
    receipt: null
  });
  
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/applications/${appId}/notes`);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const handleNewNoteSubmit = async (e) => {
    e.preventDefault();
    if (!newNoteTitle || !newNoteContent) return;

    try {
      const response = await axios.post(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/applications/${appId}/notes`, {
        title: newNoteTitle,
        content: newNoteContent,
      });
      setNotes([...notes, response.data]);
      setNewNoteTitle('');
      setNewNoteContent('');
    } catch (error) {
      console.error('Error adding note:', error);
      setError('Failed to add note');
    }
  };

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/applications/${appId}`);
        const data = await response.json();
        setApplication(data);
        setName(data.name || '');
        setPassportNumber(data.passportNumber || '');
        setEmail(data.email || ''); 
        setSelectedType(data.type); // Set the initial application type
        setPhoneNumber(data.phoneNumber || ''); 
        setNationality(data.nationality || ''); 
        setCountryResidence(data.countryResidence || ''); 
        setType(data.type || '');
        setAcademicDegree(data.academicDegree || '');
        setSemester(data.semester || '');
        setExtraFileName(data.extraFileName || '');

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicationDetails();
  }, [appId]);

  const handleInputChange = (e, fieldName) => {
    const { value } = e.target;
    if (fieldName === 'name') {
      setName(value);
    } else if (fieldName === 'passportNumber') {
      setPassportNumber(value);
    } else if (fieldName === 'email') {
      setEmail(value);
    } else if (fieldName === 'phoneNumber') {
      setPhoneNumber(value);
    } else if (fieldName === 'nationality') {
      setNationality(value);
    } else if (fieldName === 'countryResidence') {
      setCountryResidence(value);
    } else if (fieldName === 'type') {
      setType(value);
    } else if (fieldName === 'academicDegree') {
      setAcademicDegree(value);
    } else if (fieldName === 'semester') {
      setSemester(value);
    } else if (fieldName === 'extraFileName') {
      setExtraFileName(value);
    } else {
      setApplication({ ...application, [fieldName]: value });
    }
  };

  const fetchUniversities = () => {
    if (academicDegree) {
      Axios.get(`https://boss4edu-a37be3e5a8d0.herokuapp.com/${academicDegree}-universities`)
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


  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/applications/${appId}`);
        const data = await response.json();
        setApplication(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicationDetails();
  }, [appId]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      switch (type) {
        case 'offerLetter':
          setOfferLetter(file);
          break;
        case 'acceptanceLetter':
          setAcceptanceLetter(file);
          break;
        case 'receipt':
          setReceipt(file);
          break;
        default:
          break;
      }
    }
  };

  const handleSave = async () => {
    const payload = {
      name: Name,
      passportNumber: PassportNumber,
      email: email,
      phoneNumber: phoneNumber,
      nationality: nationality,
      countryResidence: countryResidence,
      type: selectedType,
      academicDegree: academicDegree,
      semester: semester,
      extraFileName: extraFileName,
      type:type,
    };
  
    try {
      await axios.put(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/applications/${appId}`, payload);
      toast.success('Application updated successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update application');
    }
  
    // Upload documents if necessary
    if (isOfferLetterUploaded || isAcceptanceLetterUploaded || isReceiptUploaded) {
      const formData = new FormData();
      if (offerLetter) formData.append('offerLetter', offerLetter);
      if (acceptanceLetter) formData.append('acceptanceLetter', acceptanceLetter);
      if (receipt) formData.append('receipt', receipt);
  
      try {
        await axios.put(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/applications/${appId}/documents`, formData);
        setSuccess(true);
        setError(null);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to save documents');
        setSuccess(false);
      }
    }
  };
  
  const downloadDocument = async (documentName) => {
    if (documentName && documentName !== 'null') {
      try {
        const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/download/${documentName}`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', documentName);
        document.body.appendChild(link);
        link.click();
        toast.success(`File ${documentName} downloaded successfully.`);
      } catch (error) {
        console.error('Error downloading document:', error);
        toast.error('Error downloading document. Please try again later.');
      }
    } else {
      toast.warn('Cannot download empty file.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }



  
  
  return (
    <Container>
      <Row>
        <Col md="4">
          <Card>
            <CardBody>
              <h4 className="card-title">Personal Information</h4>
              <Form>
                <FormGroup>
                  <Label for="name">Students Name<span style={{ color: 'red' }}>*</span></Label>
                  <Input
                    type="text"
                    id="firstName"
                    placeholder="Enter student's name"
                    value={Name}
                    onChange={(e) => handleInputChange(e, 'name')}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="passportNumber">Passport Number <span style={{ color: 'red' }}>*</span></Label>
                  <Input
                      type="text"
                      id="passportNumber"
                      placeholder="Enter passport number"
                      value={PassportNumber}
                      onChange={(e) => handleInputChange(e, 'passportNumber')}
                    />
                </FormGroup>
                <FormGroup>
                  <Label for="email">Email <span style={{ color: 'red' }}>*</span></Label>
                  <Input
                  type="email"
                  id="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => handleInputChange(e, 'email')}
                />
                </FormGroup>
                <FormGroup>
                  <Label for="phoneNumber">Phone Number <span style={{ color: 'red' }}>*</span></Label>
                  <Input
                    type="tel"
                    id="phoneNumber"
                    placeholder="Enter phone number"
                    value={application?.phoneNumber || ''}
                  onChange={(e) => handleInputChange(e, 'phoneNumber')}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="nationality">Nationality <span style={{ color: 'red' }}>*</span></Label>
                  <Input
                    type="text"
                    id="nationality"
                    placeholder="Enter nationality"
                    value={nationality}
                    onChange={(e) => handleInputChange(e, 'nationality')}
                  />

                </FormGroup>
                <FormGroup>
                  <Label for="countryResidence">Country of Residence <span style={{ color: 'red' }}>*</span></Label>
                  <Input
                  type="text"
                  id="countryResidence"
                  placeholder="Enter country of residence"
                  value={countryResidence}
                  onChange={(e) => handleInputChange(e, 'countryResidence')}
                />
                </FormGroup>
                {/* Other form groups for personal information */}
               
              </Form>
            </CardBody>
          </Card>
        </Col> 
        <Col md="4">
          <Card>
            <CardBody>
              <h4 className="card-title">University Information</h4>
              <Form>

              <FormGroup>
              <Label for="type">Student Type <span style={{ color: 'red' }}>*</span></Label>
              <Input
                type="select"
                id="type"
                value={type}
                  onChange={(e) => handleInputChange(e, 'type')}
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
                  onChange={(e) =>{
                handleInputChange(e, 'academicDegree');
                 setAcademicDegree(e.target.value);}}
             
            >
              <option value="">Select Academic Degree</option>
              <option value="diploma">Diploma</option>
              <option value="bachelor">Bachelor</option>
              <option value="master">Master</option>
              <option value="phd">PhD</option>
            </Input>
          </FormGroup>
                   <FormGroup>
                      <Label for="semester">Semester <span style={{ color: 'red' }}>*</span></Label>
                      <Input
                        type="select"
                        id="semester"
                        value={semester}
                        onChange={(e) => handleInputChange(e, 'semester')}
                     
                      >
                        <option value="">Select Semester</option>
                        <option value="fall">Fall</option>
                        <option value="spring">Spring</option>
                      </Input>
                    </FormGroup>

                    <FormGroup>
  <Label for="university">University <span style={{ color: 'red' }}>*</span></Label>
  <Input
    type="text"
    id="university"
    placeholder="Enter university"
    value={application?.university || ''}
    onChange={(e) => handleInputChange(e, 'university')}
    disabled // Add disabled attribute here
  />
</FormGroup>

<FormGroup>
  <Label for="program">Program <span style={{ color: 'red' }}>*</span></Label>
  <Input
    type="text"
    id="program"
    placeholder="Enter program"
    value={application?.program || ''}
    onChange={(e) => handleInputChange(e, 'program')}
    disabled // Add disabled attribute here
  />
</FormGroup>

                </Form>
            </CardBody>
          </Card>
        </Col>
        <Col md="4">
          <Card>
            <CardBody>
              <h4 className="card-title">Check the Documents</h4>
              <Form>
              <FormGroup>
              <Label for="passportPhoto">Photo of Passport</Label>
              <div>
          <Button onClick={() => downloadDocument(application?.passportPhoto)}>Download</Button>
             </div>
            </FormGroup>

               
              <FormGroup>
                <Label for="personalPhoto">Personal Photo</Label>
                <div>
          <Button onClick={() => downloadDocument(application?.personalPhoto)}>Download </Button>
        </div>
              </FormGroup>
              <FormGroup>
              <Label for="highSchoolCertificate">High School Certificate</Label>
              <div>
          <Button onClick={() => downloadDocument(application?.highSchoolCertificate)}>Download </Button>
        </div>
            </FormGroup>


                <FormGroup>
                  <Label for="highSchoolCertificateEnglish">High School Certificate in English</Label>
                  <div>
          <Button onClick={() => downloadDocument(application?.highSchoolCertificateEnglish)}>Download </Button>
        </div>
                </FormGroup>
                <FormGroup>
                  <Label for="highSchoolTranscript">High School Transcript <span style={{ color: 'red' }}>*</span></Label>
                  <div>
          <Button onClick={() => downloadDocument(application?.highSchoolTranscript)}>Download </Button>
        </div>

                </FormGroup>
                <FormGroup>
                  <Label for="highSchoolTranscriptEnglish">High School Transcript in English</Label>
                  <div>
          <Button onClick={() => downloadDocument(application?.highSchoolTranscriptEnglish)}>Download</Button>
        </div>
                </FormGroup>
                <FormGroup>
                  <Label for="extraFile">Extra File</Label>
                  <div>
          <Button onClick={() => downloadDocument(application?.extraFile)}>Download</Button>
        </div>
                </FormGroup>
                <FormGroup>
                  <Label for="extraFileName">Extra File Name</Label>
                  <Input
                    type="text"
                    id="extraFileName"
                    value={extraFileName}
                      onChange={(e) => handleInputChange(e, 'extraFileName')}
                   
                  />
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
        <Col md="4">
        <Card>
  <CardBody>
    <h4 className="card-title">University Documents</h4>
    <Form>
    <FormGroup>
                  <Label for="offerLetter">Offer Letter</Label>
                  <div className="d-flex align-items-center">
                    
                    <div style={{ marginLeft: '10px' }}>
                      <Button onClick={() => downloadDocument(application?.offerLetter)}>Download</Button>
                    </div>
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label for="acceptanceLetter">Acceptance Letter</Label>
                  <div className="d-flex align-items-center">
                    
                    <div style={{ marginLeft: '10px' }}>
                      <Button onClick={() => downloadDocument(application?.acceptanceLetter)}>Download</Button>
                    </div>
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label for="receipt">Receipt</Label>
                  <div className="d-flex align-items-center">
                   
                    <div style={{ marginLeft: '10px' }}>
                      <Button onClick={() => downloadDocument(application?.receipt)}>Download</Button>
                    </div>
                  </div>
                </FormGroup>

    </Form>
  </CardBody>
</Card>
</Col>
<Col md="5">
          <Card>
            <CardBody>
              <h4 className="card-title">Notes</h4>
              {loading ? (
                <p>Loading notes...</p>
              ) : error ? (
                <p>Error fetching notes: {error}</p>
              ) : notes.length === 0 ? (
                <p>No notes found for this application.</p>
              ) : (
                <ul>
                  {notes.map((note) => (
                    <li key={note.id}>
                      <strong>{note.title}</strong>
                      <p>{note.content}</p>
                      <p>Created At: {new Date(note.createdAt).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              )}
              <Form onSubmit={handleNewNoteSubmit}>
                <FormGroup>
                  <Label for="newNoteTitle">Title</Label>
                  <Input
                    type="text"
                    id="newNoteTitle"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="newNoteContent">Content</Label>
                  <Input
                    type="textarea"
                    id="newNoteContent"
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                  />
                </FormGroup>
                <Button type="submit" color="primary">Add Note</Button>
              </Form>
            </CardBody>
          </Card>
        </Col>

 
      
      </Row>
      <Button color="primary" onClick={() => handleSave(application._id)}>Save</Button>    

    </Container>
  );
};

export default ApplicationDetails;

