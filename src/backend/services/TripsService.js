import { db } from "../firebase";
import { Trips } from "../models/trips";

export const getTrips = async function () {
  const query = await db.collection("Trips").get();
   let users = [];
  query.docs.forEach((doc) => {
    const trip = Trips.fromFirestore(doc);
    if (trip) {
      users.push(trip);
    }
  });
  console.log("Trips", users);

  return users;
};
export const addTrip = async function (data) {
    console.log("venueobj",data)
    await db
      .collection("Trips")
      .add(data)
      .then(async function (docRef) {
        //   console.log("Document written with ID: ", docRef.id);
        data.id = docRef.id;
        await updateTrip(docRef.id, data);
      }).catch((err) => {
        console.log("Error:", err);
        this.setState({
          loading: false,
          showSnackBar: true,
          snackBarMessage: "Error creating trip",
          snackBarVariant: "error",
        });
      });
  };
  export const deleteTrip = async function (id) {
    await db.collection("Trips").doc(id).delete();
  };
  export const updateTrip = async function (id, data) {
    //   console.log("Edit data:", data);
    await db.collection("Trips").doc(id).set(data, { merge: true });
  };