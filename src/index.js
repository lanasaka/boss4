import 'react-app-polyfill/stable';
import 'core-js';
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationProvider } from './NotficationContext'; // Import NotificationProvider

const POLLING_INTERVAL = 5000; // Poll every 5 seconds

const Root = () => {
  useEffect(() => {
    let pollingInterval;

    const fetchUnreadMessages = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await fetch(`https://boss4edu-a37be3e5a8d0.herokuapp.com/api/chats/unread/user/${userId}`);
          if (response.ok) {
            const { messages } = await response.json();
            const adminUnreadMessages = messages.filter(
              message => message.sender === 'admin' && message.isRead === 0
            );
            console.log('Unread messages from admin:', adminUnreadMessages.length);
          } else {
            console.error('Failed to fetch unread messages. Status:', response.status);
          }
        } catch (error) {
          console.error('Error fetching unread messages:', error);
        }
      } else {
        console.log('User ID not found in local storage.');
      }
    };

    // Start polling for unread messages
    pollingInterval = setInterval(fetchUnreadMessages, POLLING_INTERVAL);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(pollingInterval);
  }, []);

  return (
    <Provider store={store}>
        <NotificationProvider>
      <App />
      <ToastContainer />
      </NotificationProvider>
    </Provider>
  );
};

createRoot(document.getElementById('root')).render(<Root />);
