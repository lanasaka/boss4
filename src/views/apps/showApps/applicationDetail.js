import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatComponent from './ChatComponent'; // Import ChatComponent
import './ApplicationDetails.css';
import { faDownload, faUpload } from '@fortawesome/free-solid-svg-icons';


const getFileUrl = (fileName) => `https://boss4edu.com/uploads/${fileName}`;
const ApplicationDetails = () => {
  const { appId } = useParams();
  const [academicDetails, setAcademicDetails] = useState([]);
  const [extraFiles, setExtraFiles] = useState([]);

  const [otherFile, setOtherFile] = useState(null);
  const [otherFileName, setOtherFileName] = useState('');
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [type, setType] = useState('');
  const [semester, setSemester] = useState('');
  const [extraFileName, setExtraFileName] = useState('');
  const [academicDegree, setAcademicDegree] = useState('');
  const [universities, setUniversities] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [offerLetter, setOfferLetter] = useState(null);
  const [acceptanceLetter, setAcceptanceLetter] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [PassportNumber, setPassportNumber] = useState('');
  const [application, setApplication] = useState(null);
  const [Name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nationality, setNationality] = useState('');
  const [countryResidence, setCountryResidence] = useState('');
  const [activeTab, setActiveTab] = useState('status');
  const [appType, setAppType] = useState('new');

  const [offerLetterFile, setOfferLetterFile] = useState(null);
  const [offerLetterName, setOfferLetterName] = useState('');
  const [offerLetters, setOfferLetters] = useState([]);

  const [finalLetterFile, setFinalLetterFile] = useState(null);
  const [finalLetterName, setFinalLetterName] = useState('');
  const [finalLetters, setFinalLetters] = useState([]);

  const handleFileChange2 = (e) => {
    const file = e.target.files[0];
    setOtherFile(file);
    setOtherFileName(file.name);
  };
  
  const uploadExtraFile = async () => {
    if (!otherFile) {
      toast.error('Please select a file.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', otherFile);
    formData.append('application_id', appId);
    formData.append('file_name', otherFileName);
  
    try {
      const response = await fetch('https://boss4edu-a37be3e5a8d0.herokuapp.com/api/extra-file', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to upload file.');
      }
  
      toast.success('File uploaded successfully.');
      fetchFiles(); // Refresh file list
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file. Please try again later.');
    }
  };
  const fetchFiles = async () => {
    try {
      const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/extra-files/${appId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch extra files');
      }
      const data = await response.json();
      console.log(data); // Check if this is an array
      setExtraFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error(`Error fetching files: ${error.message}`);
    }
  };

  
  useEffect(() => {
    fetchFiles();
  }, [appId]);
  
  const buttonConfig = {
    new: { text: 'New Application', color: 'secondary' },
    waiting: { text: 'Waiting for data processing', color: 'warning' },
    offer: { text: 'Initial Acceptance', color: 'primary' },
    payment: { text: 'Waiting for payment', color: 'info' },
    acceptance: { text: 'Final Acceptance', color: 'success' },
    rejected: { text: 'Rejected', color: 'danger' },
    complete: { text: 'Completed', color: 'dark' }
  };

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/applications/${appId}`);
        const data = await response.json();
        setApplication(data);
        fetchOfferLetters();
        fetchFinalLetters(); // Fetch offer letters after fetching application details
        setApplication(data);
        fetchAcademicDetails(); // Fetch academic details based on appId

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
        setAppType(data.appType || 'new'); // Set the application type
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicationDetails();
  }, [appId]);

  const fetchOfferLetters = async () => {
    try {
      const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/offer-letters/${appId}`);
      const data = await response.json();
      setOfferLetters(data);
    } catch (error) {
      console.error('Error fetching offer letters:', error);
      // Handle error as needed
    }
  };
  const fetchAcademicDetails = async () => {
    try {
      const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/application-details`);
      const data = await response.json();
      const filteredData = data.filter(detail => detail.application_id === parseInt(appId));
      setAcademicDetails(filteredData);
    } catch (error) {
      console.error('Error fetching academic details:', error);
      setError(error.message);
    }
  };
  
  const fetchFinalLetters = async () => {
    try {
      const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/final-letters/${appId}`);
      const data = await response.json();
      setFinalLetters(data);
    } catch (error) {
      console.error('Error fetching offer letters:', error);
      // Handle error as needed
    }
  };

 const handleFileChange = (e) => {
    const file = e.target.files[0];
    setOfferLetterFile(file);
    setOfferLetterName(file.name);
    setFinalLetterFile(file);
    setFinalLetterName(file.name);
  };

  const uploadOfferLetter = async () => {
    if (!offerLetterFile || !offerLetterName) {
      toast.error('Please select a file to upload.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', offerLetterFile);
    formData.append('application_id', appId);
    formData.append('offer_letter_name', offerLetterName);
  
    try {
      const response = await fetch('https://boss4edu-a37be3e5a8d0.herokuapp.com/api/offer-letters', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to upload offer letter.');
      }
      
      toast.success('Offer letter uploaded successfully.');
      fetchOfferLetters(); // Refresh offer letters after successful upload
      setAppType('offer'); // Update appType to 'offer'
      await updateAppType('offer'); // Ensure the server is updated
    } catch (error) {
      console.error('Error uploading offer letter:', error);
      toast.error('Error uploading offer letter. Please try again later.');
    }
  };
  
  const uploadFinalLetter = async () => {
    if (!finalLetterFile || !finalLetterName) {
      toast.error('Please select a file to upload.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', finalLetterFile);
    formData.append('application_id', appId);
    formData.append('final_letter_name', finalLetterName);
  
    try {
      const response = await fetch('https://boss4edu-a37be3e5a8d0.herokuapp.com/api/final-letters', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to upload final letter.');
      }
      
      toast.success('Final letter uploaded successfully.');
      fetchFinalLetters(); // Refresh final letters after successful upload
      setAppType('acceptance'); // Update appType to 'acceptance'
      await updateAppType('acceptance'); // Ensure the server is updated
    } catch (error) {
      console.error('Error uploading final letter:', error);
      toast.error('Error uploading final letter. Please try again later.');
    }
  };
  
  const updateAppType = async (newType) => {
    try {
      const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/applications/${appId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appType: newType }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update application type.');
      }
  
      toast.success('Application type updated successfully.');
    } catch (error) {
      console.error('Error updating application type:', error);
      toast.error('Error updating application type. Please try again later.');
    }
  };
  
  


  const downloadFinalLetter = async (finalLetterPath) => {
    if (!finalLetterPath) {
      toast.warn('final letter path is empty.');
      return;
    }

    try {
      const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/download/${finalLetterPath}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', finalLetterPath.split('/').pop());
      document.body.appendChild(link);
      link.click();
      toast.success(`Final letter ${finalLetterPath.split('/').pop()} downloaded successfully.`);
    } catch (error) {
      console.error('Error downloading final letter:', error);
      toast.error('Error downloading final letter. Please try again later.');
    }
  };

  const downloadOfferLetter = async (offerLetterPath) => {
    if (!offerLetterPath) {
      toast.warn('Offer letter path is empty.');
      return;
    }

    try {
      const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/download/${offerLetterPath}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', offerLetterPath.split('/').pop());
      document.body.appendChild(link);
      link.click();
      toast.success(`Offer letter ${offerLetterPath.split('/').pop()} downloaded successfully.`);
    } catch (error) {
      console.error('Error downloading offer letter:', error);
      toast.error('Error downloading offer letter. Please try again later.');
    }
  };

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
  const handleAppTypeChange = (newAppType) => {
    setAppType(newAppType);
  };
  const handleSave = async () => {
    const updateData = {
      appType: appType,
      // Include other fields if necessary
    };
    try {
      const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/applications/${appId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appType }), // Include other fields if necessary
      });

      if (!response.ok) {
        throw new Error('Failed to save application details.');
      }

      toast.success('Application details saved successfully.');
    } catch (error) {
      console.error('Error saving application details:', error);
      toast.error('Error saving application details. Please try again later.');
    }
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case 'status':
        return (
          <div>
            <Row>
              <Col md="6">
                <Card>
                <Button color={buttonConfig[appType]?.color || 'secondary'} size="lg">
                          {buttonConfig[appType]?.text || 'New'}
                        </Button>
                  <CardBody>
                    <h4 className="card-title">{Name}</h4>
                    <Form>
                   
                      <FormGroup>
                        <Label for="name">Student First Name + Father Name + Last Name :</Label>
                        <p>{Name}</p>
                      </FormGroup>
                      <FormGroup>
                        <Label for="passportNumber">Passport Number:</Label>
                        <p>{PassportNumber}</p>
                      </FormGroup>
                      <FormGroup>
                        <Label for="email">Email:</Label>
                        <p>{email}</p>
                      </FormGroup>
                      <FormGroup>
                        <Label for="phoneNumber">Phone Number:</Label>
                        <p>{application?.phoneNumber || ''}</p>
                      </FormGroup>
                      <FormGroup>
                        <Label for="nationality">Nationality:</Label>
                        <p>{nationality}</p>
                      </FormGroup>
                      <FormGroup>
                        <Label for="countryResidence">Country of Residence:</Label>
                        <p>{countryResidence}</p>
                      </FormGroup>
                      <FormGroup>
                        <Label for="type">Student Type:</Label>
                        <p>{selectedType}</p>
                      </FormGroup>
                   
                      <FormGroup>
                        <Label for="type">Semester:</Label>
                        <p>{semester}</p>
                      </FormGroup>
                    
                     
                 
                      
                    </Form>
                  </CardBody>
                </Card>
              </Col>
              {/* <Col md="6">
                <ChatComponent />
              </Col> */}
            </Row>
          </div>
        );
     case 'desires':
      return (
        <div>
          <h2>Desires</h2>
          <Table responsive>
            <thead>
              <tr>
                <th>Academic Degree</th>
                <th>University</th>
                <th>Program</th>
              </tr>
            </thead>
            <tbody>
              {academicDetails.map(detail => (
                <tr key={detail.id}>
                  <td>{detail.academic_degree}</td>
                  <td>{detail.university}</td>
                  <td>{detail.program}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      );
      case 'files':
        return (
          <div>
          <Card>
            <CardBody>
              <h4 className="card-title">Check the Documents</h4>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Document</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Photo of Passport</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faDownload}
                        onClick={() => downloadDocument(application?.passportPhoto)}
                        style={{ cursor: 'pointer', color: '#007bff' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Personal Photo</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faDownload}
                        onClick={() => downloadDocument(application?.personalPhoto)}
                        style={{ cursor: 'pointer', color: '#007bff' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>High School Certificate</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faDownload}
                        onClick={() => downloadDocument(application?.highSchoolCertificate)}
                        style={{ cursor: 'pointer', color: '#007bff' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>High School Certificate in English</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faDownload}
                        onClick={() => downloadDocument(application?.highSchoolCertificateEnglish)}
                        style={{ cursor: 'pointer', color: '#007bff' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>High School Transcript</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faDownload}
                        onClick={() => downloadDocument(application?.highSchoolTranscript)}
                        style={{ cursor: 'pointer', color: '#007bff' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>High School Transcript in English</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faDownload}
                        onClick={() => downloadDocument(application?.highSchoolTranscriptEnglish)}
                        style={{ cursor: 'pointer', color: '#007bff' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Extra File</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faDownload}
                        onClick={() => downloadDocument(application?.extraFile)}
                        style={{ cursor: 'pointer', color: '#007bff' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Label for="extraFileName">Extra File Name</Label>
                    </td>
                    <td>
                      <p>{extraFileName}</p>
                    </td>
                  </tr>
                  <tr>
                  <FormGroup>
                <Label for="otherFile">Upload Extra File:</Label>
                <Input type="file" id="otherFile" onChange={handleFileChange2} />
                <Button color="primary" onClick={uploadExtraFile}>
                  Upload File
                </Button>
              </FormGroup>

              </tr>
         

            </tbody>
            <tbody>
          {Array.isArray(extraFiles) && extraFiles.map(file => (
            <tr key={file.id}>
              <td>{file.file_name}</td>
              <td>
                <a href={getFileUrl(file.file_name)} target="_blank" rel="noopener noreferrer">
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
          </Table>
        </CardBody>
          </Card>
        </div>
        );
      case 'initial-acceptance':
        return (
          <div className="application-details">
        
            <div className="tab-pane fade show active" id="initial-acceptance" role="tabpanel" aria-labelledby="initial-acceptance-tab">
              <h4>Initial Acceptance</h4>
             
              <hr />
        
              <Table responsive>
                <thead>
                  <tr>
                    <th>Initial Acceptance Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {offerLetters.map((letter) => (
                    <tr key={letter.id}>
                      <td>{letter.offer_letter_name}</td>
                      <td>
                        <FontAwesomeIcon
                          icon={faDownload}
                          onClick={() => downloadOfferLetter(letter.offer_letter_path)}
                          style={{ cursor: 'pointer', color: '#007bff', marginRight: '10px' }}
                        />
                     
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
  
        </div>
        );
      case 'final-acceptance':
        return (
          <div className="application-details">
        
            <div className="tab-pane fade show active" id="initial-acceptance" role="tabpanel" aria-labelledby="initial-acceptance-tab">
              <h4>Final Acceptance</h4>
             
              <hr />
            
              <Table responsive>
                <thead>
                  <tr>
                    <th>Final Acceptance Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {finalLetters.map((letter) => (
                    <tr key={letter.id}>
                      <td>{letter.final_letter_name}</td>
                      <td>
                        <FontAwesomeIcon
                          icon={faDownload}
                          onClick={() => downloadFinalLetter(letter.final_letter_path)}
                          style={{ cursor: 'pointer', color: '#007bff', marginRight: '10px' }}
                        />
                     
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
  
        </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="application-details">
      <div className="tabs">
        <button
          onClick={() => setActiveTab('status')}
          className={activeTab === 'status' ? 'active' : ''}
        >
          Status
        </button>
        <button
          onClick={() => setActiveTab('desires')}
          className={activeTab === 'desires' ? 'active' : ''}
        >
          Desires
        </button>
        <button
          onClick={() => setActiveTab('files')}
          className={activeTab === 'files' ? 'active' : ''}
        >
          Files
        </button>
        <button
          onClick={() => setActiveTab('initial-acceptance')}
          className={activeTab === 'initial-acceptance' ? 'active' : ''}
        >
          Initial Acceptance
        </button>
        <button
          onClick={() => setActiveTab('final-acceptance')}
          className={activeTab === 'final-acceptance' ? 'active' : ''}
        >
          Final Acceptance
        </button>
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ApplicationDetails;
