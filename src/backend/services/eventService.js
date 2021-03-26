import { db } from "../firebase";
import { Event } from "../models/event";
import { Notification } from "../models/notification";
import firebase from "firebase";

export const getEvents = async function () {
  const query = await db.collection("Events").get();

  let events = [];

  query.docs.forEach((doc) => {
    const event = Event.fromFirestore(doc);
    if (event) {
      events.push(event);
    }
  });
  console.log("Events", events);

  return events;
};

export const addEvent = async function (data) {
  await db
    .collection("Events")
    .add(data)
    .then(async function (docRef) {
      //   console.log("Document written with ID: ", docRef.id);
      data.uuid = docRef.id;
      await updateEvent(docRef.id, data);
    });
};

export const deleteEvent = async function (id) {
  await db.collection("Events").doc(id).delete();
};

export const closeEvent = async function (id, data) {
  await db.collection("Events").doc(id).update({
    status: data,
  });
};

export const closeEntry = async function (id, data) {
  await db.collection("Events").doc(id).update({
    entry: data,
  });
};

export const updateEvent = async function (id, data) {
  await db.collection("Events").doc(id).set(data, { merge: true });
};

export const updateEventParticipants = async function (id, data) {
  db.collection("Events").doc(id).update({
    participants: data,
  });
};

export const deleteEventParticipant = async function (id, data) {
  db.collection("Events")
    .doc(id)
    .update({
      participants: firebase.firestore.FieldValue.arrayRemove(data),
    });
};

export const updateEventDivisions = async function (id, data) {
  db.collection("Events").doc(id).update({
    divisions: data,
  });
};

export const deleteEventDivisions = async function (id, data) {
  db.collection("Events")
    .doc(id)
    .update({
      divisions: firebase.firestore.FieldValue.arrayRemove(data),
    });
};

export const updateOtherResults = async function (id, data) {
  db.collection("Events").doc(id).update({
    otherResults: data,
  });
};

export const getEventById = async function (id) {
  const query = await db.collection("Events").doc(id).get();
  return Event.fromFirestore(query);
};

export const updateEventGroups = async function (id, data) {
  db.collection("Events").doc(id).update({
    groups: data,
  });
};

export const deleteEventGroup = async function (id, data) {
  db.collection("Events")
    .doc(id)
    .update({
      groups: firebase.firestore.FieldValue.arrayRemove(data),
    });
};

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
