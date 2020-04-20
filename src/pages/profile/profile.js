import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './profile.css';

import { auth, storage } from '../../services/firebase';
import LoggedInLayout from '../../components/logged-in-layout';
import Button from '../../components/button/button';
import Webcam from 'react-webcam';

export default function Profile() {
  const user = auth().currentUser;
  const history = useHistory();

  const [displayName, setDisplayName] = useState(user.displayName);

  const [newDisplayName, setNewDisplayName] = useState();

  const [showWebcam, setShowWebcam] = useState(false);

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

  const b64toBlob = (dataURI) => {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  };

  const handleChangeNameClick = (event) => {
    setDisplayName(null);
  };

  const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: 'user',
  };

  const webcamRef = React.useRef(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();

    const blob = b64toBlob(imageSrc);

    const imageRef = storage.ref().child(`images/avatar-${user.uid}.jpg`);

    imageRef.put(blob).then(function (snapshot) {
      console.log(snapshot);
      imageRef.getDownloadURL().then((url) => {
        console.log(url);
        auth()
          .currentUser.updateProfile({
            photoURL: url,
          })
          .then(() => {
            window.location.reload(true);
          });
      });
    });

    setShowWebcam(false);
  }, [webcamRef, user.uid]);

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

        {!showWebcam && (
          <div className="space">
            <Button onClick={() => setShowWebcam(true)}>Change my photo</Button>
          </div>
        )}
        {showWebcam && (
          <React.Fragment>
            <div className="webcam-video-container">
              <Webcam
                className="webcam-video"
                audio={false}
                height={200}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={360}
                videoConstraints={videoConstraints}
              />
            </div>
            <Button onClick={capture}>Capture photo</Button>
          </React.Fragment>
        )}

        <div className="space-large">
          <Button onClick={() => history.push('/lobby')}>Ready to Play</Button>
        </div>
      </div>
    </LoggedInLayout>
  );
}
