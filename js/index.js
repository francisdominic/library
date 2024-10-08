import { db, STUDENTS_TABLE, TIMELOGS_TABLE } from "./firebase.js";
import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const retrieveStudentInfo = (id) => {
  document.getElementById("actions").classList.add("hidden");
  document.getElementById("student-info").classList.add("hidden");
  document.getElementById("action-message").classList.add("hidden");
  document.getElementById("search-btn").innerHTML = "Searching...";
  document.getElementById("search-btn").setAttribute("disabled", "disabled");

  const docRef = doc(db, STUDENTS_TABLE, id);
  getDoc(docRef).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      document.getElementById("student-id").innerHTML = snapshot.id;
      document.getElementById("student-name").innerHTML = data.full_name;
      document.getElementById("student-course").innerHTML = data.course;
      document.getElementById("student-level").innerHTML = data.year_level;
      console.log("Student data:", snapshot.data());
      document.getElementById("student-info").classList.remove("hidden");

      // display either IN or OUT button depending on the student's current status
      if (data.status && data.status == "in") {
        document.getElementById("time-out-btn").classList.remove("hidden");
        document.getElementById("time-in-btn").classList.add("hidden");
      } else {
        document.getElementById("time-in-btn").classList.remove("hidden");
        document.getElementById("time-out-btn").classList.add("hidden");
      }
      document.getElementById("actions").classList.remove("hidden");
     
      document.getElementById("lrn").value = "";

    } else {
      alert(`Student with LRN ${id} does not exist!`);
    }
    document.getElementById("search-btn").innerHTML = "Search";
    document.getElementById("search-btn").removeAttribute("disabled");
  });
};

function onSubmit(e) {
  e.preventDefault();
  const studentId = document.getElementById("lrn").value.trim();
  retrieveStudentInfo(studentId);
}

function updateStatus(status, lrnId) {
  const docRef = doc(db, STUDENTS_TABLE, lrnId);
  getDoc(docRef).then(async (snapshot) => {
    if (snapshot.exists()) {
      const updatedData = {
        status: status
      };
      try {
        await updateDoc(docRef, updatedData);
      } catch (error) {
        alert(`Error while updating the status of student with LRN ${lrnId}.`);
      }
    } else {
      alert(`Student with LRN ${lrnId} does not exist!`);
    }
  });
}

function performTimeIn() {
  const now = moment().format('YYYY-MM-DD hh:mm:ss a');
  const lrnId = document.getElementById("student-id").innerHTML;
  
  // add to timelogs

  const data = {
    lrn: lrnId,
    type: "time-in",
    timestamp: now,
  };
  addDoc(collection(db, TIMELOGS_TABLE), data).then((ref) => {
    document.getElementById("action-type").innerHTML = "time in";
    document.getElementById("action-timestamp").innerHTML = now;
    document.getElementById("action-message").classList.remove("hidden");
    document.getElementById("actions").classList.add("hidden");
  });

  updateStatus("in", lrnId);
}

function performTimeOut() {
  const now = moment().format('YYYY-MM-DD hh:mm:ss a')
  const lrnId = document.getElementById("student-id").innerHTML;
  const data = {
    lrn: lrnId,
    type: "time-out",
    timestamp: now,
  };

  // add to timelogs

  addDoc(collection(db, TIMELOGS_TABLE), data).then((ref) => {
    document.getElementById("action-type").innerHTML = "time out";
    document.getElementById("action-timestamp").innerHTML = now;
    document.getElementById("action-message").classList.remove("hidden");
    document.getElementById("actions").classList.add("hidden");
  });

  updateStatus("out", lrnId); 
}

function performSearch() {
  const lrnId = document.getElementById("lrn").value.trim();
   if (lrnId.length >= 10) {
    document.getElementById("search-btn").click();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("lrn").addEventListener("input", performSearch);
  document.querySelector("form").addEventListener("submit", onSubmit);
  document
    .getElementById("time-in-btn")
    .addEventListener("click", performTimeIn);
  document
    .getElementById("time-out-btn")
    .addEventListener("click", performTimeOut);
});
