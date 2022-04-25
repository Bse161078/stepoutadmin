import { db } from '../firebase';
import { Reservation } from '../models/reservation';


export const getReservation = async function () {
    const query = await db.collection('Reservations').get();

    let Reservations = [];

    query.docs.forEach((doc) => {
        const Reser = Reservation.fromFirestore(doc);
        if (Reservations) {
            Reservations.push(Reser);
        }
    });
    console.log('Reservation', Reservations);
    return Reservations;
};

export const addReservation = async function (data) {
    console.log("reservation",data)
    await db
      .collection("Reservations")
      .add(data)
      .then(async function (docRef) {
        //   console.log("Document written with ID: ", docRef.id);
        data.id = docRef.id;
        await updateReservation(docRef.id, data);
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
  export const deleteReservation = async function (id) {
    await db.collection("Reservations").doc(id).delete();
  };
  export const updateReservation = async function (id, data) {
       console.log("Edit data:", data);
    await db.collection("Reservations").doc(id).set(data, { merge: true });
  };

export const getTripReservation = async function () {
    const query = await db.collection('TripReservations').get();

    let Reservations = [];

    query.docs.forEach((doc) => {
        const Reser = Reservation.fromFirestore(doc);
        if (Reservations) {
            Reservations.push(Reser);
        }
    });
    console.log('Trip Reservation', Reservations);
    return Reservations;
};

export const addTripReservation = async function (data) {
    console.log("venueobj",data)
    await db
      .collection("TripReservations")
      .add(data)
      .then(async function (docRef) {
        //   console.log("Document written with ID: ", docRef.id);
        data.id = docRef.id;
        await updateTripReservation(docRef.id, data);
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
  export const deleteTripReservation = async function (id) {
    await db.collection("TripReservations").doc(id).delete();
    console.log("deleteid",id)
  };
  export const updateTripReservation = async function (id, data) {
       console.log("Edit data:", data);
    await db.collection("TripReservations").doc(id).set(data, { merge: true });
  };