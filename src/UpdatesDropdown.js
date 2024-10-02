import React from 'react';
import {
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import { cilBell } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useUpdate } from './UpdateContext';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const UpdatesDropdown = ({ isOpen, toggleDropdown }) => {
  const {
    updates,
    unseenFiles,
    unseenOfferLetters,
    unseenFinalLetters,
    appTypeChanges,
    markAppTypeChangeAsRead,
    setAppTypeChanges,
    setUnseenFiles,
    setUnseenOfferLetters,
    setUnseenFinalLetters,
  } = useUpdate();

  const notificationCount = updates.filter((notif) => !notif.read && notif.sender === 'user').length;
  const unseenFileCount = unseenFiles.length;
  const unseenOfferLetterCount = unseenOfferLetters.length;
  const unseenFinalLetterCount = unseenFinalLetters.length;

  const handleNotificationClick = (id, type) => {
    if (type === 'appTypeChange') {
      removeNotification(id, 'appTypeChanges');
    } else if (type === 'file') {
      removeNotification(id, 'unseenFiles');
    } else if (type === 'offerLetter') {
      removeNotification(id, 'unseenOfferLetters');
    } else if (type === 'finalLetter') {
      removeNotification(id, 'unseenFinalLetters');
    }
    toggleDropdown(); // Close the dropdown after clicking
  };

  const removeNotification = (id, type) => {
    switch (type) {
      case 'appTypeChanges':
        setAppTypeChanges((prev) => prev.filter(change => change.id !== id));
        break;
      case 'unseenFiles':
        setUnseenFiles((prev) => prev.filter(file => file.id !== id));
        break;
      case 'unseenOfferLetters':
        setUnseenOfferLetters((prev) => prev.filter(letter => letter.id !== id));
        break;
      case 'unseenFinalLetters':
        setUnseenFinalLetters((prev) => prev.filter(letter => letter.id !== id));
        break;
      default:
        break;
    }
  };

  // Check if there are any updates
  const hasUpdates =
    notificationCount > 0 ||
    unseenFileCount > 0 ||
    unseenOfferLetterCount > 0 ||
    unseenFinalLetterCount > 0 ||
    appTypeChanges.length > 0;

  return (
    <CDropdown variant="nav-item" show={isOpen} toggle={toggleDropdown}>
      <CDropdownToggle
        placement="bottom-end"
        className="relative flex items-center"
        caret={false}
      >
        {(notificationCount > 0 || unseenFileCount > 0 || unseenOfferLetterCount > 0 || unseenFinalLetterCount > 0 || appTypeChanges.length > 0) && (
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
              zIndex: 10,
            }}
          >
            {notificationCount + unseenFileCount + unseenOfferLetterCount + unseenFinalLetterCount + appTypeChanges.length}
          </span>
        )}
        <CIcon icon={cilBell} size="lg" className="text-gray-700 ml-8" />
      </CDropdownToggle>

      <CDropdownMenu className="dropdown-menu-right">
      <CDropdownHeader>Updates</CDropdownHeader>
        {hasUpdates ? (
          <>
            {appTypeChanges.length > 0 && (
              <>
             
                {appTypeChanges.map((change) => (
                  <CDropdownItem key={change.id}>
                    <Link
                      to={`/apps/${change.id}`}
                      className="dropdown-item"
                      onClick={() => handleNotificationClick(change.id, 'appTypeChange')}
                    >
                      Application ({change.applicationCode}) status updated
                    </Link>
                  </CDropdownItem>
                ))}
              </>
            )}

            {unseenFiles.length > 0 && (
              <>
             
                {unseenFiles.map((file) => (
                  <CDropdownItem key={file.id}>
                    <Link
                      to={`/apps/${file.applicationId}`}
                      className="dropdown-item"
                      onClick={() => handleNotificationClick(file.id, 'file')}
                    >
                      New file uploaded in ({file.applicationCode})
                    </Link>
                  </CDropdownItem>
                ))}
              </>
            )}

            {unseenOfferLetters.length > 0 && (
              <>
              
                {unseenOfferLetters.map((letter) => (
                  <CDropdownItem key={letter.id}>
                    <Link
                      to={`/apps/${letter.applicationId}`}
                      className="dropdown-item"
                      onClick={() => handleNotificationClick(letter.id, 'offerLetter')}
                    >
                      New Initial Acceptance in ({letter.applicationCode})
                    </Link>
                  </CDropdownItem>
                ))}
              </>
            )}
           

            {unseenFinalLetters.length > 0 && (
              <>
         
                {unseenFinalLetters.map((letter) => (
                  <CDropdownItem key={letter.id}>
                    <Link
                      to={`/apps/${letter.applicationId}`}
                      className="dropdown-item"
                      onClick={() => handleNotificationClick(letter.id, 'finalLetter')}
                    >
                      New Final Acceptance in ({letter.applicationCode})
                    </Link>
                  </CDropdownItem>
                ))}
              </>
            )}
          </>
        ) : (
          // When there are no updates
          <CDropdownHeader>No Updates</CDropdownHeader>
        )}
      </CDropdownMenu>
    </CDropdown>
  );
};

UpdatesDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleDropdown: PropTypes.func.isRequired,
};

export default UpdatesDropdown;
