import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { auth, db } from '../services/firebase';

export default function Profile() {
  const user = auth().currentUser;

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

  const handleStartPlayingButton = (event) => {};

  return (
    <div className="main">
      {displayName && (
        <div>
          <h2>Hi {displayName}</h2>
          <button onClick={() => handleChangeNameClick()}>
            change my name
          </button>

          <Link to="/lobby">Let's Play!</Link>
        </div>
      )}
      {!displayName && (
        <form onSubmit={(event) => handleUpdateDisplayName(event)}>
          <h2>Who dis?</h2>
          <input
            placeholder="Name"
            name="name"
            type="text"
            onChange={(event) => handleChange(event)}
          />

          <button>Save</button>
        </form>
      )}
    </div>
  );
}
