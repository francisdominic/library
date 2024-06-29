import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, where, getDoc, getDocs, query, collection } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js'

// 1. Connect to firebase app
const firebaseConfig = {
  apiKey: "AIzaSyBhuPcodnhv1wznGVQsos5vLx68IEtaM_M",
  authDomain: "timelogger-75e24.firebaseapp.com",
  projectId: "timelogger-75e24",
  storageBucket: "timelogger-75e24.appspot.com",
  messagingSenderId: "83903013398",
  appId: "1:83903013398:web:08f65bcbddc9a648c80b37"
};

const app = initializeApp(firebaseConfig);


// 2. Initialize firestore (database)
const db = getFirestore(app);

// collection -> document 
function fetchStudents() {
    const studentsRef = collection(db, "students");
    let q = query(studentsRef);

    getDocs(q).then((snapshot) => {
        let results = ""
        snapshot.forEach(doc => {
            const data = doc.data()
            results += `
            <tr>
                <td>${doc.id}</td>
                <td>${data.full_name}</td>
                <td>${data.course}</td>
                <td>${data.year_level}</td>
            </tr>
            `
        })
        document.getElementById("students-list").innerHTML = results
    });
}

function searchStudent(id) {
    if (id == "") {
        fetchStudents()
        return
    }
    const docRef = doc(db, "students", id);
    getDoc(docRef).then((snapshot) => {
        if (snapshot.exists()) {
            const student = snapshot.data()
            document.getElementById("student-name").innerHTML = student.full_name
            
            const studentsRef = collection(db, "timelogs");
            let q = query(studentsRef, where("lrn", "==", id));
            getDocs(q).then((snapshot) => {
                let results = ""
                snapshot.forEach(doc => {
                    const data = doc.data()
                    results += `
                    <tr>
                        <td>${data.type}</td>
                        <td>${data.timestamp}</td>
                    </tr>
                    `
                })
                document.getElementById("timelogs").innerHTML = results
            });
        }
    });
}

export function showTimelogs(id) {
    console.log('bobo');
}

// Define the onSubmit function to handle form submission
function onSubmit(e) {
    e.preventDefault();
    
    // Retrieve the value from the input field
    const studentId = document.getElementById('lrn').value;
    console.log(studentId);
    // Call the function to retrieve student info based on the entered ID
    searchStudent(studentId);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed.");

    // Attach onSubmit function to the form submission
    document.querySelector('form').addEventListener('submit', onSubmit);
});

fetchStudents()