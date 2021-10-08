import { db } from "../firebase";
import { User } from "../models/user";

export const getUsers = async function () {
  const query = await db.collection("Users").get();

  let users = [];

  query.docs.forEach((doc) => {
    const user = User.fromFirestore(doc);
    if (user) {
      users.push(user);
    }
  });
  console.log("Users", users);

  return users;
};

export const addUser = async function (data) {
  await db
    .collection("Users")
    .add(data)
    .then(async function (docRef) {
      //   console.log("Document written with ID: ", docRef.id);
      data.uuid = docRef.id;
      await updateUser(docRef.id, data);
    });
};

export const deleteUser = async function (id) {
  await db.collection("Users").doc(id).delete();
};

export const updateUser = async function (id, data) {
  //   console.log("Edit data:", data);
  await db.collection("Users").doc(id).set(data, { merge: true });
};

export const updateMemberShipUser = async function (id, data) {
  await db.collection("Users").doc(id).update({
    membership: data,
  });
};

export const updateMemberShipPaymentStatusUser = async function (id, data) {
  await db.collection("Users").doc(id).update({
    membership_fee_status: data,
  });
};

export const blockUser = async function (id, data) {
  await db.collection("Users").doc(id).update({
    isActive: data,
  });
};

export const getUserById = async function (id) {
  const query = await db.collection("Users").doc(id).get();
  return User.fromFirestore(query);
};
