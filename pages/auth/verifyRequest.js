import React from "react";
import styles from "../../styles/authentication/verifyRequest.module.css";
import { useState, useEffect } from "react";
import { connectToDatabase } from "../../../utils/mongodb";
function verifyRequest({ categories_data, setCategories }) {
  //Sets the subNav instantly with no load time
  useEffect(() => {
    if (categories_data) {
      setCategories(categories_data);
    }
  }, [categories_data]);
  return (
    <div className={styles.mainDiv}>
      <div className={styles.header}> Check your email ! </div>
      <div className={styles.subHeader}>
        A sign in link has been sent to your email address.
      </div>
    </div>
  );
}

export default verifyRequest;

export async function getStaticProps(context) {
  const { db } = await connectToDatabase();

  const categories_data = await db
    .collection("Categories")
    .find()
    .project({ _id: 0, category: 1, brand: 1 })
    .toArray();

  return {
    props: {
      categories_data,
    },
    revalidate: 600,
  };
}
