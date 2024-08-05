import {
  auth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "./firebaseConfig.js";

let emailInput = document.getElementById("emailInput");
let passwordInput = document.getElementById("passwordInput");
let loginButton = document.getElementById("login-button");
let loginSpinner = document.getElementById("login-spinner");
let errorDisplay = document.getElementById("error-display");
let emailValidation = document.getElementById("email-validation");
let passwordValidation = document.getElementById("password-validation");
let forgotPassword = document.getElementById("forgot");

let navbar = document.getElementById("navbar");
let navbarNav = document.getElementById("navbarNav");
let navbarBrand = document.getElementById("navbar-brand");
let menuLink = document.getElementById("menu-link");

document.addEventListener("DOMContentLoaded", () => {
  const switchButton = document.getElementById("flexSwitchCheckDefault");
  const body = document.body;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    body.classList.add(savedTheme);
    if (savedTheme === "dark-mode") {
      switchButton.checked = true;
    }
  }

  switchButton.addEventListener("change", () => {
    if (switchButton.checked) {
      body.classList.replace("light-mode", "dark-mode");
      navbar.classList.add("navbar-darkmode");
      localStorage.setItem("theme", "dark-mode");
      menuLink.style.color = "white";
      navbarBrand.style.color = "white";
      console.log(navbarBrand);
    } else {
      body.classList.replace("dark-mode", "light-mode");
      navbar.classList.remove("navbar-darkmode");
      localStorage.setItem("theme", "light-mode");
      navbarBrand.style.color = "black";
    }
  });

  // Set initial theme
  if (!body.classList.contains("dark-mode")) {
    body.classList.add("light-mode");
  }
});

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

    signInWithEmailAndPassword(auth, email, pwd)
      .then((userCredential) => {
        loginButton.textContent = "Logging in...";
        loginSpinner.style.display = "block";
        const user = userCredential.user;

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

forgotPassword.addEventListener("click", function () {
  PasswordRest();
});

function PasswordRest() {
  sendPasswordResetEmail(auth, emailInput.value)
    .then(() => {})
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
}
