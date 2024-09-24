import {
  doc,
  setDoc,
  where,
  addDoc,
  getDoc,
  getDocs,
  query,
  collection,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

import { db, auth, STUDENTS_TABLE, TIMELOGS_TABLE } from "./firebase.js";

function fetchStudents() {
  const studentsRef = collection(db, STUDENTS_TABLE);
  let q = query(studentsRef, orderBy("course"));

  getDocs(q).then((snapshot) => {
    let results = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      results += `
            <tr>
                <td>${doc.id}</td>
                <td>${data.full_name}</td>
                <td>${data.course}</td>
                <td>${data.year_level}</td>
            </tr>
            `;
    });
    document.getElementById("students-list").innerHTML = results;
  });
}

function searchStudent(id) {
  if (id == "") {
    fetchStudents();
    return;
  }
  const docRef = doc(db, STUDENTS_TABLE, id);
  getDoc(docRef).then((snapshot) => {
    if (snapshot.exists()) {
      const student = snapshot.data();
      document.getElementById("student-name").innerHTML = student.full_name;

      const studentsRef = collection(db, TIMELOGS_TABLE);
      let q = query(studentsRef, orderBy("timestamp"), where("lrn", "==", id));
      getDocs(q).then((snapshot) => {
        let results = "";
        snapshot.forEach((doc) => {
          const data = doc.data();
          results += `
                    <tr>
                        <td>${data.type}</td>
                        <td>${data.timestamp}</td>
                    </tr>
                    `;
        });
        document.getElementById("timelogs").innerHTML = results;
      });
    }
  });
}

function onSubmit(e) {
  e.preventDefault();
  const studentId = document.getElementById("lrn").value;
  searchStudent(studentId);
}

document.addEventListener("DOMContentLoaded", function () {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "login.html";
    }
  });
  document.querySelector("form").addEventListener("submit", onSubmit);
  document.getElementById("logout-btn").addEventListener("click", logOut);
});

function logOut() {
  signOut(auth)
    .then(() => {
      console.log("Logged Out");
    })
    .catch((error) => {
      console.error("Error Logging Out:", error);
    });
}
document.getElementById('fileInput').addEventListener('change', readFile);
function readFile(event) {

  const file = event.target.files[0];

  if (!file) {
    alert("No file selected!");
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e) {
    var json = JSON.parse(e.target.result);
    console.log(json);
    json.forEach(function(obj) {
       setDoc(doc(db, STUDENTS_TABLE, obj.lrn), {
          course: obj.course,
          full_name: obj.full_name,
          year_level: obj.year_level
       });
   });
    
  };

  reader.readAsText(file);
  alert("done importing student data");
  fetchStudents();
}
fetchStudents();
