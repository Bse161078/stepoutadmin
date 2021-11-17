
import { db } from '../firebase';
import { Admin } from '../models/admin';
// import * as admin from 'firebase-admin';

export const getAdmins = async function () {
    const query = await db.collection("Fee").get();
    return query.data();
};

export const getFee = async function () {
    const query = await db.collection("Fee").doc("Fee").get();
    console.log("This is the query",query.data())
    // query.docs.forEach((doc) => {
    //     console.log("this is dot",doc.data())
    //     var data = doc.data();
        
    //     if (data) {
    //       events.push(data);
    //     }
    //   });
    return query.data();
};

export const addAdmin = async function (data) {
    await db.collection('Fee').add(data);
};

export const deleteAdmin = async function (id) {
    await db.collection('Fee').doc("Fee").delete();
};

export const updateFee = async function (data) {
    await db.collection('Fee').doc("Fee").set(data, { merge: true });
};

export const getAdminById = async function (id) {
    const query = await db.collection('Fee').doc(id).get();
    return Admin.fromFirestore(query);
};

// export const getAllAdmins = () => {
//     admin.auth().listUsers(100)
//       .then(function(listUsersResult) {
//         listUsersResult.users.forEach(function(userRecord) {
//           console.log('user', userRecord.toJSON());
//         });
//       })
//       .catch(function(error) {
//         console.log('Error listing users:', error);
//       });
//   }
