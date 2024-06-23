import { auth, signInWithEmailAndPassword } from "./firebaseConfig.js";

let emailInput = document.getElementById("emailInput");
let passwordInput = document.getElementById("passwordInput");
let loginButton = document.getElementById("login-button");
let loginSpinner = document.getElementById("login-spinner");
let errorDisplay = document.getElementById("error-display");
let emailValidation = document.getElementById("email-validation");
let passwordValidation = document.getElementById("password-validation");

loginSpinner.style.display = "none";

loginButton.addEventListener("click", function (event) {
  event.preventDefault();
  loginUser();
});

function loginUser() {
  let email = emailInput.value;
  let pwd = passwordInput.value;

  if (!email && !pwd) {
    emailValidation.style.display = "block";
    passwordValidation.style.display = "block";
  } else if (email && !pwd) {
    passwordValidation.style.display = "block";
    emailValidation.style.display = "none";
  } else if (!email && pwd) {
    passwordValidation.style.display = "none";
    emailValidation.style.display = "block";
  } else if (email && pwd) {
    emailValidation.style.display = "none";
    passwordValidation.style.display = "none";

    signInWithEmailAndPassword(auth,email, pwd)
      .then((userCredential) => {
        loginButton.textContent = "Logging in...";
        loginSpinner.style.display = "block";
        const user = userCredential.user;
        console.log("User ID: ", user.uid);

        setTimeout(function () {
          window.location.href = "shopcars.html";
        }, 2000);
      })
      .catch((error) => {
        console.error("Error signing in: ", error.message);
        errorDisplay.style.display = "block";
      });
  } else {
    console.error("Email and password must be provided");
  }
}