import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const fetchApplicationName = async (applicationId) => {
    try {
      const response = await axios.get(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/applications/${applicationId}`);
      return response.data.name || 'Unknown Application';
    } catch (error) {
      console.error('Error fetching application name:', error);
      return 'Unknown Application';
    }
  };

  const fetchNotifications = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.log('User ID not found in local storage.');
      return;
    }
  
    try {
      const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/chats/unread/user/${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      const adminMessages = data.messages.filter(message => message.sender === 'admin' && message.isRead === 0);
      
      const notificationsWithAppName = await Promise.all(adminMessages.map(async (message) => {
        const applicationName = await fetchApplicationName(message.applicationId);
        return {
          message: message.content || 'No message content',
          messageId: message.id,
          sender: message.sender,
          applicationId: message.applicationId,
          applicationName,
          read: message.isRead === 1,
        };
      }));
  
      setNotifications(notificationsWithAppName);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  
 
  useEffect(() => {
    fetchNotifications(); // Fetch notifications initially

    const intervalId = setInterval(fetchNotifications, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Clean up on component unmount
  }, []);

  const markNotificationAsRead = async (messageId) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.messageId === messageId ? { ...notif, read: true } : notif
      )
    );

    try {
      await axios.put(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/chats/read/${messageId}`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, markNotificationAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Add propTypes validation
NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to use the notification context
export const useNotification = () => {
  return useContext(NotificationContext);
};
