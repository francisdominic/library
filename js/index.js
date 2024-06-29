import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, addDoc, collection } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js'

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

// 3. Create function for retrieving student data
const retrieveStudentInfo = (id) => {
    document.getElementById("actions").classList.add("hidden")
    document.getElementById("action-message").classList.add("hidden")

    const docRef = doc(db, "students", id);
    getDoc(docRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.data()
            document.getElementById("student-id").innerHTML = snapshot.id 
            document.getElementById("student-name").innerHTML = data.full_name 
            document.getElementById("student-course").innerHTML = data.course
            document.getElementById("student-level").innerHTML = data.year_level
            console.log("Student data:", snapshot.data());
            document.getElementById("actions").classList.remove("hidden")
        } else {
        console.log("No such student!");
        }
    })
}

// Define the onSubmit function to handle form submission
function onSubmit(e) {
    e.preventDefault();
    
    // Retrieve the value from the input field
    const studentId = document.getElementById('lrn').value;
    console.log(studentId);
    // Call the function to retrieve student info based on the entered ID
    retrieveStudentInfo(studentId);
}

function performTimeIn(id) {
    const now = new Date().toLocaleString()
    const data = {
        lrn: document.getElementById('student-id').innerHTML,
        type: "time-in",
        timestamp: now
      }
    addDoc(collection(db, "timelogs"), data).then((ref)=>{
        console.log('time in done!', ref.id);
        document.getElementById("action-type").innerHTML = "time in"
        document.getElementById("action-id").innerHTML = ref.id
        document.getElementById("action-timestamp").innerHTML = now
        document.getElementById("action-message").classList.remove("hidden")
        document.getElementById("actions").classList.add("hidden")
      });
}
function performTimeOut(id) {
    const now = new Date().toLocaleString() 
    const data = {
        lrn: document.getElementById('student-id').innerHTML,
        type: "time-out",
        timestamp: now 
      }
    addDoc(collection(db, "timelogs"), data).then((ref)=>{
        console.log('time out done!', ref.id);
        document.getElementById("action-type").innerHTML = "time out"
        document.getElementById("action-id").innerHTML = ref.id
        document.getElementById("action-timestamp").innerHTML = now
        document.getElementById("action-message").classList.remove("hidden")
        document.getElementById("actions").classList.add("hidden")
      });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed.");

    // Attach onSubmit function to the form submission
    document.querySelector('form').addEventListener('submit', onSubmit);
    document.getElementById("time-in-btn").addEventListener('click', performTimeIn)
    document.getElementById("time-out-btn").addEventListener('click', performTimeOut)
});
console.log("loaded");