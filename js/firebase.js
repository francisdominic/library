import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBhuPcodnhv1wznGVQsos5vLx68IEtaM_M",
  authDomain: "timelogger-75e24.firebaseapp.com",
  projectId: "timelogger-75e24",
  storageBucket: "timelogger-75e24.appspot.com",
  messagingSenderId: "83903013398",
  appId: "1:83903013398:web:08f65bcbddc9a648c80b37",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const TIMELOGS_TABLE = "library-timelogs";
export const STUDENTS_TABLE = "library-students";
