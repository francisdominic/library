import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCN8yzQCYTQHSHMv6Q80V3Xm6Vns_8IUg0",
  authDomain: "athena-69319.firebaseapp.com",
  databaseURL:
    "https://athena-69319-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "athena-69319",
  storageBucket: "athena-69319.appspot.com",
  messagingSenderId: "563546162362",
  appId: "1:563546162362:web:a5496fbd05da55ef392e83",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const TIMELOGS_TABLE = "library-timelogs";
export const STUDENTS_TABLE = "library-students";
