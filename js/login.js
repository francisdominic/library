// Log in function

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "./firebase.js";

function logIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email == "" || password == "") {
    return;
  }
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      window.location.href = "/admin/dashboard.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error Logging In:", errorCode, errorMessage);
    });
}
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("login-btn").addEventListener("click", logIn);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = "/admin/dashboard.html";
    }
  });
});
