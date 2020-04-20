import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './profile.css';

import { auth } from '../../services/firebase';
import LoggedInLayout from '../../components/logged-in-layout';
import Button from '../../components/button/button';

export default function Profile() {
  const user = auth().currentUser;
  const history = useHistory();

  const [displayName, setDisplayName] = useState(user.displayName);

  const [newDisplayName, setNewDisplayName] = useState();

  const handleChange = (event) => {
    setNewDisplayName(event.target.value);
  };

  const handleUpdateDisplayName = (event) => {
    event.preventDefault();

    auth().currentUser.updateProfile({
      displayName: newDisplayName,
    });

    setDisplayName(newDisplayName);
  };

  const handleChangeNameClick = (event) => {
    setDisplayName(null);
  };

  return (
    <LoggedInLayout title="Profile">
      <div className="profile">
        {displayName && (
          <div className="name-section">
            <h2>Hi {displayName}</h2>
            <Button onClick={() => handleChangeNameClick()}>
              Change my name
            </Button>
          </div>
        )}
        {!displayName && (
          <form
            className="name-section"
            onSubmit={(event) => handleUpdateDisplayName(event)}
          >
            <h2>Who dis?</h2>
            <input
              placeholder="Name"
              name="name"
              type="text"
              onChange={(event) => handleChange(event)}
            />

            <Button>Save</Button>
          </form>
        )}
        <div className="space-large">
          <Button onClick={() => history.push('/lobby')}>Ready to Play</Button>
        </div>
      </div>
    </LoggedInLayout>
  );
}
