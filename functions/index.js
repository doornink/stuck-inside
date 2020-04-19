const functions = require('firebase-functions');

// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
// exports.makeUppercase = functions.database
//   .ref('/games/{gameID}/currentTurn')
//   .onUpdate((snapshot, context) => {
//     // Grab the current value of what was written to the Realtime Database.
//     // const original = snapshot.val();
//     console.log('triggering yo', context.params.gameID, snapshot);
//     const uppercase = original.toUpperCase();
//     // You must return a Promise when performing asynchronous tasks inside a Functions such as
//     // writing to the Firebase Realtime Database.
//     // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
//     return snapshot.ref.parent.child('uppercase').set(uppercase);
//   });
