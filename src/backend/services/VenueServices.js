import { db } from "../firebase";
import { Venue } from "../models/venue";

export const getVenues = async function () {
  const query = await db.collection("Venues").get();
   let users = [];
  query.docs.forEach((doc) => {
    const user = Venue.fromFirestore(doc);
    if (user) {
      users.push(user);
    }
  });
  console.log("Users", users);

  return users;
};

export const addVenue = async function (data) {
    console.log("venueobj",data)
    await db
      .collection("Venues")
      .add(data)
      .then(async function (docRef) {
          console.log("Document written with ID: ", docRef.id);
          data.id = docRef.id;
          await updateVenue(docRef.id, data);
      })
  };

  export const deleteVenue = async function (id) {
    await db.collection("Venues").doc(id).delete();
  };

  export const updateVenue = async function (id, data) {
       console.log("Edit data:", data);
    await db.collection("Venues").doc(id).set(data, { merge: true });
  };