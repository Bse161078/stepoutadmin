import firebase from "firebase";

// const config = {
//     apiKey: "AIzaSyBS7sW8y4EL12VVw2iFxzeWLccqmZG6BD0",
//     authDomain: "sneakerlog-c7664.firebaseapp.com",
//     databaseURL: "https://sneakerlog-c7664.firebaseio.com",
//     projectId: "sneakerlog-c7664",
//     storageBucket: "sneakerlog-c7664.appspot.com",
//     messagingSenderId: "657981798987",
//     appId: "1:657981798987:web:b910a2849ef0e30ab22bce"
//   };
const config = {
  apiKey: "AIzaSyC_Xf1be_jymwZlf9sFnsGgyOqxlsnlHBs",
  authDomain: "nuga-1a565.firebaseapp.com",
  databaseURL: "https://nuga-1a565.firebaseio.com",
  projectId: "nuga-1a565",
  storageBucket: "nuga-1a565.appspot.com",
  messagingSenderId: "593325834593",
  appId: "1:593325834593:web:3b703bef2edb92477d0520",
};
firebase.initializeApp(config);
const db = firebase.firestore();
const auth = firebase.auth();

export { firebase, db, auth };
