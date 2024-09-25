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
        document.getElementById("timelogs-container").classList.remove("hidden");
        document.getElementById("clear-btn").classList.remove("hidden");
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
  document.getElementById("clear-btn").addEventListener("click", clearTimelogs);
  document.getElementById("download-monthly-report-btn").addEventListener("click", downloadMonthlyReport);
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

function clearTimelogs() {
  document.getElementById("lrn").value = "";
  document.getElementById("timelogs-container").classList.add("hidden");
  document.getElementById("clear-btn").classList.add("hidden");
}

function downloadMonthlyReport() {
  console.log("downloading monthly report starting from date: " + getFirstDayOfMonth());
  
  // fetch all timelogs based on the first day of the month
  fetchTimelogsFromDate(getFirstDayOfMonth());
}

function getFirstDayOfMonth() {
  // Get the year, month, and day
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');  // Add 1 to the month and pad with 0 if needed

  // Combine into the format YYYY-MM-DD
  return `${year}-${month}-01`;
}

function fetchTimelogsFromDate(startDate) {
  const timelogsRef = collection(db, TIMELOGS_TABLE);
  let results = "";
  let q = query(timelogsRef, orderBy("timestamp"), where("timestamp", ">=", startDate));
  getDocs(q).then((snapshot) => {
    // Convert data to CSV string
    const csvContent = convertToCSV(snapshot);

    // Create a Blob from the CSV string
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a link element
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `timelogs-for-${startDate}.csv`);

    // Append link to the body (required for Firefox)
    document.body.appendChild(link);
    link.click();  // Trigger the download
    document.body.removeChild(link);  // Remove link from the document
  });
}

function convertToCSV(snapshot) {
  const headers = "Timestamp,Type,StudentID";
  if (!snapshot.empty) {
    // get rows
    let rows = [headers];
    snapshot.forEach((doc) => {
      const rowData = doc.data();
      rows.push(`${rowData.timestamp},${rowData.type},${rowData.lrn}`);
    });
    
    return rows.join("\n");
  }

  return "";
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
