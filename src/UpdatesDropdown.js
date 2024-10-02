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
  const { updates, unseenFiles, unseenOfferLetters, unseenFinalLetters, appTypeChanges } = useUpdate();

  const notificationCount = updates.filter((notif) => !notif.read && notif.sender === 'user').length;
  const unseenFileCount = unseenFiles.length;
  const unseenOfferLetterCount = unseenOfferLetters.length;
  const unseenFinalLetterCount = unseenFinalLetters.length;

  const handleNotificationClick = (messageId) => {
    toggleDropdown();
  };

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
        {appTypeChanges.length > 0 && (
          <>
            <CDropdownHeader>Application Status Changes</CDropdownHeader>
            {appTypeChanges.map((change) => (
              <CDropdownItem key={change.id}>
                <Link to={`/apps/${change.applicationId}`} className="dropdown-item" onClick={() => handleNotificationClick(change.id)}>
                  Application ({change.applicationCode}) status updated
                </Link>
              </CDropdownItem>
            ))}
          </>
        )}

        {unseenFiles.length > 0 && (
          <>
            <CDropdownHeader>Unseen Files</CDropdownHeader>
            {unseenFiles.map((file) => (
              <CDropdownItem key={file.id}>
                <Link to={`/apps/${file.applicationId}`} className="dropdown-item" onClick={() => handleNotificationClick(file.id)}>
                  New file uploaded in ({file.applicationCode})
                </Link>
              </CDropdownItem>
            ))}
          </>
        )}

        {unseenOfferLetters.length > 0 && (
          <>
            <CDropdownHeader>Unseen Offer Letters</CDropdownHeader>
            {unseenOfferLetters.map((letter) => (
              <CDropdownItem key={letter.id}>
                <Link to={`/apps/${letter.applicationId}`} className="dropdown-item" onClick={() => handleNotificationClick(letter.id)}>
                  New Initial Acceptance in ({letter.applicationCode})
                </Link>
              </CDropdownItem>
            ))}
          </>
        )}

        {unseenFinalLetters.length > 0 && (
          <>
            <CDropdownHeader>Unseen Final Letters</CDropdownHeader>
            {unseenFinalLetters.map((letter) => (
              <CDropdownItem key={letter.id}>
                <Link to={`/apps/${letter.applicationId}`} className="dropdown-item" onClick={() => handleNotificationClick(letter.id)}>
                  New Final Acceptance in ({letter.applicationCode})
                </Link>
              </CDropdownItem>
            ))}
          </>
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
