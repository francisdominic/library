import { db, STUDENTS_TABLE, TIMELOGS_TABLE } from "./firebase.js";
import {
  doc,
  getDoc,
  addDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const retrieveStudentInfo = (id) => {
  document.getElementById("actions").classList.add("hidden");
  document.getElementById("action-message").classList.add("hidden");

  const docRef = doc(db, STUDENTS_TABLE, id);
  getDoc(docRef).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      document.getElementById("student-id").innerHTML = snapshot.id;
      document.getElementById("student-name").innerHTML = data.full_name;
      document.getElementById("student-course").innerHTML = data.course;
      document.getElementById("student-level").innerHTML = data.year_level;
      console.log("Student data:", snapshot.data());
      document.getElementById("actions").classList.remove("hidden");
    } else {
      alert(`Student with LRN ${id} does not exist!`);
    }
  });
};

function onSubmit(e) {
  e.preventDefault();
  const studentId = document.getElementById("lrn").value;
  retrieveStudentInfo(studentId);
}

function performTimeIn(id) {
  const now = new Date().toLocaleString();
  const data = {
    lrn: document.getElementById("student-id").innerHTML,
    type: "time-in",
    timestamp: now,
  };
  addDoc(collection(db, TIMELOGS_TABLE), data).then((ref) => {
    document.getElementById("action-type").innerHTML = "time in";
    document.getElementById("action-id").innerHTML = ref.id;
    document.getElementById("action-timestamp").innerHTML = now;
    document.getElementById("action-message").classList.remove("hidden");
    document.getElementById("actions").classList.add("hidden");
  });
}
function performTimeOut(id) {
  const now = new Date().toLocaleString();
  const data = {
    lrn: document.getElementById("student-id").innerHTML,
    type: "time-out",
    timestamp: now,
  };
  addDoc(collection(db, TIMELOGS_TABLE), data).then((ref) => {
    document.getElementById("action-type").innerHTML = "time out";
    document.getElementById("action-id").innerHTML = ref.id;
    document.getElementById("action-timestamp").innerHTML = now;
    document.getElementById("action-message").classList.remove("hidden");
    document.getElementById("actions").classList.add("hidden");
  });
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("form").addEventListener("submit", onSubmit);
  document
    .getElementById("time-in-btn")
    .addEventListener("click", performTimeIn);
  document
    .getElementById("time-out-btn")
    .addEventListener("click", performTimeOut);
});
