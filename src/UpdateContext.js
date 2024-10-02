import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const UpdateContext = createContext();

export const UpdateProvider = ({ children }) => {
  const [updates, setUpdates] = useState([]);
  const [unseenFiles, setUnseenFiles] = useState([]);
  const [unseenOfferLetters, setUnseenOfferLetters] = useState([]);
  const [unseenFinalLetters, setUnseenFinalLetters] = useState([]);
  const [applications, setApplications] = useState([]);
  const [appTypeChanges, setAppTypeChanges] = useState([]);

  const checkForAppTypeChanges = async (newApplications) => {
    const updatedChanges = await Promise.all(
      newApplications.map(async (newApp) => {
        const oldApp = applications.find((app) => app.id === newApp.id);
        if (oldApp && oldApp.appType !== newApp.appType) {
          const applicationCode = await fetchApplicationName(newApp.id);
          return {
            id: newApp.id,
            oldType: oldApp.appType,
            newType: newApp.appType,
            applicationCode,
            read: false, // Initialize as unread
          };
        }
        return null;
      })
    );

    setAppTypeChanges((prevChanges) => [
      ...prevChanges,
      ...updatedChanges.filter((change) => change !== null),
    ]);
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      const fetchApplicationData = async () => {
        try {
          const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/applications/app/${userId}`);
          if (response.ok) {
            const newApplications = await response.json();
            checkForAppTypeChanges(newApplications);
            setApplications(newApplications);
          } else {
            console.error('Failed to fetch applications:', response.status);
          }
        } catch (error) {
          console.error('Error fetching applications:', error);
        }
      };

      const intervalId = setInterval(fetchApplicationData, 10000);
      return () => clearInterval(intervalId);
    } else {
      console.log('User ID not found in local storage.');
    }
  }, [applications]);

  const fetchApplicationName = async (applicationId) => {
    if (!applicationId) return 'Unknown Application';
    try {
      const response = await axios.get(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/applications/${applicationId}`);
      return response.data.applicationCode || 'Unknown Application';
    } catch (error) {
      console.error('Error fetching application name:', error);
      return 'Unknown Application';
    }
  };

  const fetchUnseenFiles = async () => {
    try {
      const response = await axios.get('https://boss4edu-a37be3e5a8d0.herokuapp.com/extra-files/un-seen/admin');
      const filesWithAppCodes = await Promise.all(response.data.map(async (file) => {
        const applicationId = file.application_id;
        const applicationCode = await fetchApplicationName(applicationId);
        return {
          ...file,
          applicationCode,
          applicationId,
        };
      }));
      setUnseenFiles(filesWithAppCodes);
    } catch (error) {
      console.error('Error fetching unseen files:', error);
    }
  };

  const fetchUnseenOfferLetters = async () => {
    try {
      const response = await axios.get('https://boss4edu-a37be3e5a8d0.herokuapp.com/offer-letters/un-seen');
      const lettersWithAppCodes = await Promise.all(response.data.map(async (letter) => {
        const applicationId = letter.application_id;
        const applicationCode = await fetchApplicationName(applicationId);
        return {
          ...letter,
          applicationCode,
          applicationId,
        };
      }));
      setUnseenOfferLetters(lettersWithAppCodes);
    } catch (error) {
      console.error('Error fetching unseen offer letters:', error);
    }
  };

  const fetchUnseenFinalLetters = async () => {
    try {
      const response = await axios.get('https://boss4edu-a37be3e5a8d0.herokuapp.com/final-letters/un-seen');
      const lettersWithAppCodes = await Promise.all(response.data.map(async (letter) => {
        const applicationId = letter.application_id;
        const applicationCode = await fetchApplicationName(applicationId);
        return {
          ...letter,
          applicationCode,
          applicationId,
        };
      }));
      setUnseenFinalLetters(lettersWithAppCodes);
    } catch (error) {
      console.error('Error fetching unseen final letters:', error);
    }
  };

  useEffect(() => {
    fetchUnseenFiles();
    fetchUnseenOfferLetters();
    fetchUnseenFinalLetters();
    const intervalId = setInterval(() => {
      fetchUnseenFiles();
      fetchUnseenOfferLetters();
      fetchUnseenFinalLetters();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Function to mark an application type change as read
  const markAppTypeChangeAsRead = (changeId) => {
    setAppTypeChanges((prevChanges) =>
      prevChanges.map((change) =>
        change.id === changeId ? { ...change, read: true } : change
      )
    );
  };

  return (
    <UpdateContext.Provider value={{ updates, unseenFiles, unseenOfferLetters, unseenFinalLetters, appTypeChanges, markAppTypeChangeAsRead }}>
      {children}
    </UpdateContext.Provider>
  );
};

UpdateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUpdate = () => {
  return useContext(UpdateContext);
};
