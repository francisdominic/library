// Log in function
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { db, auth, ADMIN_DETAILS_TABLE } from "./firebase.js";

function logIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email == "" || password == "") {
    return;
  }
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

      const user = userCredential.user;
      
      const docRef = doc(db, ADMIN_DETAILS_TABLE, user.uid);
      getDoc(docRef).then((snapshot) => {
        if (snapshot.exists()) {
          const adminDetails = snapshot.data();
          
          // ask and check the provided OTP before redirecting to admin dashboard
          const secret = adminDetails.secret;
          const otplib = window.otplib;
          do {
            var otp = prompt("Enter OTP: ");
            var isValid = otplib.authenticator.check(otp, secret); // Verify OTP
            if (!isValid) {
              alert("OTP is invalid! Please try again.");
            }
          } while (!isValid);

          window.location.href = "/admin/dashboard.html";
        }
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error Logging In:", errorCode, errorMessage);
      alert("Wrong username or password!");
    });
}
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("login-btn").addEventListener("click", logIn);
});
