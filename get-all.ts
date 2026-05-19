import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf8"));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function list() {
  const querySnapshot = await getDocs(collection(db, "products"));
  const docs: any[] = [];
  querySnapshot.forEach(doc => docs.push(doc.data()));
  console.log(JSON.stringify(docs, null, 2));
}
list();
