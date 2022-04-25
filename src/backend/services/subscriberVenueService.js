import { db } from "../firebase";
import { Venue } from "../models/venue";
import firebase from "firebase";
export const getVenue = async function (id) {
    let users = [];
  const query = await db.collection("SubscriberVenue").doc(id).get()
  .then(snapshot => users=snapshot.data())
 
   
   
  console.log("subscribervenue", users);

  return users;
};

export const addSVenue = async function (data,id) {
    data.id = id
    console.log("venueobj",data,id)
    await db
      .collection("SubscriberVenue")
      .doc(id)
      .set(data)
      addVenue(data,id)
  };
  export const addVenue = async function (data,id) {
    db.collection("Venues").doc(id).set(data)
  };


  export const deleteVenue = async function (id) {
    console.log("revevenue",id)
    await db.collection("Venues").doc(localStorage.getItem("Sid")).delete();
  };
  export const removeVenue = async function (id) {
      deleteVenue(id)
    await db.collection("SubscriberVenue").doc(id).update({
        "Address": firebase.firestore.FieldValue.delete(),
        "Description": firebase.firestore.FieldValue.delete(),
        "Name": firebase.firestore.FieldValue.delete(),
        "Time": firebase.firestore.FieldValue.delete() ,
        "Image": firebase.firestore.FieldValue.delete() ,
        "Images": firebase.firestore.FieldValue.delete() ,
        "IndoorActivities": firebase.firestore.FieldValue.delete() ,
        "OutdoorActivities": firebase.firestore.FieldValue.delete() ,
        "Restaurants": firebase.firestore.FieldValue.delete() ,
        "endTime": firebase.firestore.FieldValue.delete() ,
        "Videos": firebase.firestore.FieldValue.delete() ,
        "id": firebase.firestore.FieldValue.delete(),
        "Promotion": firebase.firestore.FieldValue.delete(),
        "freeze": firebase.firestore.FieldValue.delete(),
      });
//  await db.collection("SubscriberVenue").doc(id).update({
//      "Name": db.deleteField(),
//      Address: db.deleteField()
//  });
};
  export const updateSVenue = async function (id, data) {
       updateVenue(id,data)
    await db.collection("SubscriberVenue").doc(id).set(data, { merge: true });
  };
  export const updateVenue = async function (id, data) {
 await db.collection("Venues").doc(id).set(data, { merge: true });
};
