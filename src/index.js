import 'react-app-polyfill/stable';
import 'core-js';
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationProvider } from './NotficationContext'; 
import { UpdateProvider } from './UpdateContext'; // Import UpdateProvider

const Root = () => {
  
  return (
    <Provider store={store}>
      <NotificationProvider>
      <UpdateProvider>
        <App />
        </UpdateProvider>
        <ToastContainer />
      </NotificationProvider>
    </Provider>
  );
};

createRoot(document.getElementById('root')).render(<Root />);
