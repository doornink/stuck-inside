import firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyC9LXtldfo2R1J-w9QbRV48ZFgvi7mo640',
  authDomain: 'catchprase-7c8e1.firebaseapp.com',
  databaseURL: 'https://catchprase-7c8e1.firebaseio.com',
};
firebase.initializeApp(config);
export const auth = firebase.auth;
export const db = firebase.database();
