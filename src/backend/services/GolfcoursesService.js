import { db } from "../firebase";
import { Event } from "../models/event";
import { Notification } from "../models/notification";
import firebase from "firebase";

export const getGolfcourses = async function () {
  const query = await db.collection("GolfCourses").get();
  console.log("This is the query",query.docs)
  let events = [];

  query.docs.forEach((doc) => {
    console.log("this is dot",doc.data())
    var data = doc.data();
    
    if (data) {
      events.push(data);
    }
  });
  console.log("GolfCourses", events);

  return events;
};

export const addGolfcourses = async function (data) {
  await db
    .collection("GolfCourses")
    .add(data)
    .then(async function (docRef) {
      console.log("THis is h")
      //   console.log("Document written with ID: ", docRef.id);
      data.uuid = docRef.id;
      await updateGolfcourses(docRef.id, data);
    });
};

export const deleteGolfcourses = async function (id) {
  await db.collection("GolfCourses").doc(id).delete();
};

export const closeGolfcourses = async function (id, data) {
  await db.collection("GolfCourses").doc(id).update({
    status: data,
  });
};

// export const closeEntry = async function (id, data) {
//   await db.collection("GolfCourses").doc(id).update({
//     entry: data,
//   });
// };

export const updateGolfcourses = async function (id, data) {
  await db.collection("GolfCourses").doc(id).set(data, { merge: true });
};

// export const updateEventParticipants = async function (id, data) {
//   db.collection("GolfCourses").doc(id).update({
//     participants: data,
//   });
// };

// export const deleteEventParticipant = async function (id, data) {
//   db.collection("GolfCourses")
//     .doc(id)
//     .update({
//       participants: firebase.firestore.FieldValue.arrayRemove(data),
//     });
// };

// export const updateEventDivisions = async function (id, data) {
//   db.collection("GolfCourses").doc(id).update({
//     divisions: data,
//   });
// };

// export const deleteEventDivisions = async function (id, data) {
//   db.collection("GolfCourses")
//     .doc(id)
//     .update({
//       divisions: firebase.firestore.FieldValue.arrayRemove(data),
//     });
// };

// export const updateOtherResults = async function (id, data) {
//   db.collection("GolfCourses").doc(id).update({
//     otherResults: data,
//   });
// };

export const getGolfcoursesById = async function (id) {
  const query = await db.collection("GolfCourses").doc(id).get();
  console.log("this is query",query.data());
  return query.data()
  
};

// export const updateEventGroups = async function (id, data) {
//   db.collection("GolfCourses").doc(id).update({
//     groups: data,
//   });
// };

// export const deleteEventGroup = async function (id, data) {
//   db.collection("GolfCourses")
//     .doc(id)
//     .update({
//       groups: firebase.firestore.FieldValue.arrayRemove(data),
//     });
// };

// ************** Notifications ***************** //
export const addNotification = async function (data) {
  await db
    .collection("Notifications")
    .add(data)
    .then(async function (docRef) {
      //   console.log("Document written with ID: ", docRef.id);
      data.uuid = docRef.id;
      await updateNotification(docRef.id, data);
    });
};

export const updateNotification = async function (id, data) {
  await db.collection("Notifications").doc(id).set(data, { merge: true });
};
