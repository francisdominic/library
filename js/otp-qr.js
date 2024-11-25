import {
    doc,
    getDoc,
  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
    onAuthStateChanged,
  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { db, auth, ADMIN_DETAILS_TABLE } from "./firebase.js";

document.addEventListener("DOMContentLoaded", function () {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
        window.location.href = "login.html";
        } else {
                    
            // Access otplib from the global window object
            const otplib = window.otplib;

            // Setup OTP and QR Code
            
            const docRef = doc(db, ADMIN_DETAILS_TABLE, user.uid);
            getDoc(docRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const adminDetails = snapshot.data();
                    
                    const otpAuth = otplib.authenticator.keyuri(user.email, "Library System", adminDetails.secret); // OTP Auth URI

                    // Generate QR Code
                    QRCode.toCanvas(document.getElementById('qrcode'), otpAuth, function (error) {
                    if (error) console.error(error);
                    console.log('QR Code generated successfully');
                    });

                    // Handle OTP Verification
                    document.getElementById('verifyOtp').addEventListener('click', () => {
                    const userOtp = document.getElementById('otpInput').value;
                    const isValid = otplib.authenticator.check(userOtp, adminDetails.secret); // Verify OTP
                    document.getElementById('result').textContent = isValid ? "OTP is valid!" : "OTP is invalid!";
                    });
                }
            });
            
        }
    });
});