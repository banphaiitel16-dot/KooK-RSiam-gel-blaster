import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf8"));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function list() {
  const querySnapshot = await getDocs(collection(db, "products"));
  const docs = [];
  querySnapshot.forEach(doc => docs.push(doc));
  docs.sort((a,b) => a.id.localeCompare(b.id));
  docs.forEach(doc => console.log(doc.id, doc.data().name));
}
list();
