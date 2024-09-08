import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatComponent from './ChatComponent'; // Import ChatComponent
import './ApplicationDetails.css';
import { faDownload, faUpload ,faTrashAlt} from '@fortawesome/free-solid-svg-icons';


const getFileUrl = (fileName) => `https://boss4edu.com/uploads/${fileName}`;
const ApplicationDetails = () => {
  const { appId } = useParams();
  const [academicDetails, setAcademicDetails] = useState([]);
  const [extraFiles, setExtraFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [otherFile, setOtherFile] = useState(null);
  const [otherFileName, setOtherFileName] = useState('');
  const [applicationCode, setApplicationCode] = useState('');
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
  const deleteExtraFile = async (fileId, filePath) => {
    try {
      const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/extra-files/${fileId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete file.');
      }
  
  
       await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/delete-file/${filePath}`, {
         method: 'DELETE',
       });
  
      toast.success('File deleted successfully.');
      fetchFiles(); // Refresh file list after deletion
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Error deleting file. Please try again later.');
    }
  };
  
  const downloadExtraFile = async (filePath) => {
    // Ensure filePath is provided
    if (!filePath) {
      toast.warn('File path is empty.');
      console.warn('Received file path:', filePath); // Log the filePath
      return;
    }
  
    // Ensure filePath starts with '/'
    if (!filePath.startsWith('/')) {
      filePath = `/${filePath}`;
    }
  
    try {
      // Fetch the file from the server
      const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com${filePath}`);
      if (!response.ok) {
        throw new Error('Failed to download file.');
      }
  
      // Create a blob from the response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      // Create a link element to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filePath.split('/').pop()); // Extract file name from the path
      document.body.appendChild(link);
      link.click();
  
      // Cleanup the link element
      document.body.removeChild(link);
  
      // Notify success
      toast.success(`File ${filePath.split('/').pop()} downloaded successfully.`);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Error downloading file. Please try again later.');
    }
  };
  
  
  
  const fetchFiles = async () => {
    try {
      const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/extra-files/${appId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setFiles(data); // Adjust according to your actual data structure
    } catch (error) {
      console.error('Error fetching extra files:', error);
      toast.error('Error fetching extra files. Please try again later.');
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
        setApplicationCode(data.applicationCode || '');
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
      console.error('Error fetching Initial Acceptance:', error);
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
      console.error('Error fetching final letters:', error);
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
    if (finalLetterPath && finalLetterPath !== 'null') {
      try {
        const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com${finalLetterPath}`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', finalLetterPath.split('/').pop()); // Extract file name
        document.body.appendChild(link);
        link.click();
        toast.success('Final Acceptance Letter downloaded successfully.');
      } catch (error) {
        console.error('Error downloading final acceptance letter:', error);
        toast.error('Error downloading the file. Please try again later.');
      }
    } else {
      toast.warn('Cannot download an empty file.');
    }
  };
  
  const downloadOfferLetter = async (offerLetterPath) => {
    if (offerLetterPath && offerLetterPath !== 'null') {
      try {
        const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com${offerLetterPath}`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', offerLetterPath.split('/').pop());
        document.body.appendChild(link);
        link.click();
        toast.success(`File downloaded successfully.`);
      } catch (error) {
        console.error('Error downloading Initial Acceptance:', error);
        toast.error('Error downloading the file. Please try again later.');
      }
    } else {
      toast.warn('Cannot download an empty file.');
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
                        <Label for="applicationCode">Application Code:</Label>
                        <p>{applicationCode}</p>
                      </FormGroup>
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
               <Col md="6">
               <ChatComponent applicationId={appId} />
              </Col> 
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
                <Button color="primary" onClick={uploadExtraFile} className='mt-2'>
                  Upload File
                </Button>
              </FormGroup>

              </tr>
         

            </tbody>
     
          </Table>
          <Table responsive className="table-striped table-bordered">
  <thead>
    <tr>
      <th>File Name</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {files.map((file, index) => (
      <tr key={index}>
        <td>{file.file_name}</td>
        <td>
          <FontAwesomeIcon
            icon={faDownload}
            onClick={() => downloadExtraFile(file.file_path)}
            style={{ cursor: 'pointer', color: '#007bff', marginRight: '10px' }}
          />
          <FontAwesomeIcon
            icon={faTrashAlt}
            onClick={() => deleteExtraFile(file.id, file.file_path)}
            style={{ cursor: 'pointer', color: '#dc3545' }}
          />
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
