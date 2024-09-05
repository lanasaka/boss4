import React from 'react';
import PropTypes from 'prop-types'; 
import {
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import { cilBell } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useNotification } from './NotficationContext'; 
import { Link } from 'react-router-dom';

const NotificationDropdown = ({ isOpen, toggleDropdown }) => {
  const notificationContext = useNotification();

  // Check if notificationContext is available
  if (!notificationContext) {
    return <CDropdown>No notifications available</CDropdown>; // Or handle the error appropriately
  }

  const { notifications, markNotificationAsRead } = notificationContext;

  // Filter for unread admin notifications
  const unreadAdminNotifications = notifications.filter(
    notif => !notif.read && notif.sender === 'admin'
  );

  const notificationCount = unreadAdminNotifications.length;

  const handleNotificationClick = (messageId) => {
    markNotificationAsRead(messageId);
    toggleDropdown(); // Optionally close the dropdown when clicking a notification
  };

  return (
    <CDropdown variant="nav-item" show={isOpen} toggle={toggleDropdown}>
      <CDropdownToggle
        placement="bottom-end"
        className="relative flex items-center"
        caret={false}
      >
        {notificationCount > 0 && (
          <span
            style={{
              position: 'absolute',
              right: '-6px',
              top: '-10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              color: '#fff',
              backgroundColor: '#e53e3e',
              fontSize: '15px',
              fontWeight: 'bold',
              borderRadius: '50%',
              zIndex: 10
            }}
          >
            {notificationCount}
          </span>
        )}
        <CIcon icon={cilBell} size="lg" className="text-gray-700 ml-8" />
      </CDropdownToggle>
      <CDropdownMenu className="dropdown-menu-right">
        <CDropdownHeader>Notifications</CDropdownHeader>
        {unreadAdminNotifications.length > 0 ? (
          unreadAdminNotifications.map((notif, index) => (
            <Link
              to={`/apps/${notif.applicationId}`}
              key={notif.messageId}
              onClick={() => handleNotificationClick(notif.messageId)}
              style={{ 
                textDecoration: 'none', 
                display: 'block',
                backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#e0e0e0',
                color: '#333',
              }}
            >
              <CDropdownItem
                style={{ padding: '10px 15px', backgroundColor: 'transparent' }}
              >
                {notif.message || 'No message content'} in ({notif.applicationName})
              </CDropdownItem>
            </Link>
          ))
        ) : (
          <CDropdownItem>No new notifications</CDropdownItem>
        )}
      </CDropdownMenu>
    </CDropdown>
  );
};

// Add propTypes validation
NotificationDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleDropdown: PropTypes.func.isRequired,
};

export default NotificationDropdown;
