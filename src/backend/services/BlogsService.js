import { db } from "../firebase";
import { Blogs } from "../models/blogs";

export const getBlogs = async function () {
  const query = await db.collection("Blogs").get();
   let blogs = [];
  query.docs.forEach((doc) => {
    const blog = Blogs.fromFirestore(doc);
    if (blog) {
      blogs.push(blog);
    }
  });
  console.log("Blogs", blogs);

  return blogs;
};

export const addBlogs = async function (data) {
    console.log("venueobj",data)
    await db
      .collection("Blogs")
      .add(data)
      .then(async function (docRef) {
        //   console.log("Document written with ID: ", docRef.id);
        data.id = docRef.id;
        await updateBlogs(docRef.id, data);
      });
  };

  export const deleteBlog = async function (id) {
    await db.collection("Blogs").doc(id).delete();
  };

  export const updateBlogs = async function (id, data) {
    //   console.log("Edit data:", data);
    await db.collection("Blogs").doc(id).set(data, { merge: true });
  };