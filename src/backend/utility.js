import firebase from "firebase";
// import firestore from "firebase/firestore";

export async function connectFirebase() {
    const firebaseConfig = {
      apiKey: "AIzaSyDAFQrPtUQuxIyfwvMWzZaq1kaqCvL4Ehk",
      authDomain: "react-native-step-out.firebaseapp.com",
      projectId: "react-native-step-out",
      storageBucket: "react-native-step-out.appspot.com",
      messagingSenderId: "902770175125",
      appId: "1:902770175125:web:71aba1bf2c174f89bfbf9c",
      measurementId: "G-2ZP98N36GT"
    };
  // Initialize Firebase
  if (!firebase.apps.length) {
    console.log("FIREBASE CONNECTED!!!")
    firebase.initializeApp(firebaseConfig);
  }
}

export async function getUserId() {
  let userid = "";
  firebase.auth().then(function(user) {
    userid = user.user.uid;
  });
  return userid;
}

export async function getAllOfCollection(collection) {
  let data = [];
  let querySnapshot = await firebase
    .firestore()
    .collection(collection)
    .get();
  querySnapshot.forEach(function(doc) {
    if (doc.exists) {
      data.push(doc.data());
    } else {
      alert("No document found!");
    }
  });
  return data;
}

export function getData(collection, doc, objectKey) {
  // check if data exists on the given path
  if (objectKey === undefined) {
    return firebase
      .firestore()
      .collection(collection)
      .doc(doc)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          return doc.data();
        } else {
          return false;
        }
      });
  } else {
    return firebase
      .firestore()
      .collection(collection)
      .doc(doc)
      .get()
      .then(function(doc) {
        if (doc.exists && doc.data()[objectKey] != undefined) {
          return doc.data()[objectKey];
        } else {
          return false;
        }
      });
  }
}

export async function saveDataWithoutDocId(collection, jsonObject) {
  let upload = await firebase
    .firestore()
    .collection(collection)
    .doc()
    .set(jsonObject);
  return upload;
}

export async function saveData(collection, doc, jsonObject) {
  firebase
    .firestore()
    .collection(collection)
    .doc(doc)
    .set(jsonObject, { merge: true })
    .then(function() {
      console.log("Document successfully written!");
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
}

export async function saveInitialData(collection, userId) {
  firebase
    .firestore()
    .collection(collection)
    .doc(userId)
    .set({ userdocc: "Me" })
    .then(function() {
      alert("Data saved succesfuly");
    })
    .catch(function(error) {
      alert(error);
    });
}

//Save coordinates of collector to firestore
export async function saveCoordinates(collection, doc, jsonObject) {
  firebase
    .firestore()
    .collection(collection)
    .doc(doc)
    .set({ jsonObject })
    .then(function() {
      console.log("Coordinates saved successfuly");
    })
    .catch({
      function(error) {
        console.log("Failed to save coordinates: ", error);
      }
    });
}

export async function addToArray(collection, doc, array, value) {
  var tempdoc = firebase
    .firestore()
    .collection(collection)
    .doc(doc);

  tempdoc
    .get()
    .then(docData => {
      if (docData.exists) {
        firebase
          .firestore()
          .collection(collection)
          .doc(doc)
          .update({
            [array]: firebase.firestore.FieldValue.arrayUnion(value)
          });
      } else {
        firebase
          .firestore()
          .collection(collection)
          .doc(doc)
          .set({
            [array]: firebase.firestore.FieldValue.arrayUnion(value)
          });
      }

      console.log(docData);
    })
    .catch(fail => {
      firebase
        .firestore()
        .collection(collection)
        .doc(doc)
        .set({
          [array]: firebase.firestore.FieldValue.arrayUnion(value)
        });

      console.log(fail);
    });
}

export async function updateData(collection, doc, array, value) {
  //alert(doc);
  firebase
    .firestore()
    .collection(collection)
    .doc(doc)
    .update({
      [array]: value
    });
}
