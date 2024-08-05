import {
  auth,
  createUserWithEmailAndPassword,
  database,
  dbRef,
  set,
} from "./firebaseConfig.js";

let navbar = document.getElementById("navbar");
let navbarNav = document.getElementById("navbarNav");
let navbarBrand = document.getElementById("navbar-brand");
let menuLink = document.getElementById("menu-link");

document.addEventListener("DOMContentLoaded", function () {
  let signupButton = document.getElementById("signup-button");
  let emailInput = document.getElementById("emailInput");
  let passwordInput = document.getElementById("password-input");
  let firstName = document.getElementById("firstName");
  let lastName = document.getElementById("lastName");
  let cityName = document.getElementById("city-name");
  let signupAlert = document.getElementById("signup-alert");
  let spinner = document.getElementById("spinner");
  let signupForm = document.getElementById("signup-form");

  signupAlert.classList.add("d-none");
  spinner.classList.add("d-none");

  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (signupForm.checkValidity() === false) {
      event.stopPropagation();
    } else {
      signupUser();
    }
    signupForm.classList.add("was-validated");
  });

  function signupUser() {
    let provinceDropdown = document.getElementById("province-dropdown");

    let email = emailInput.value;
    let pwd = passwordInput.value;
    let selectedValue = provinceDropdown.value;
    let firstN = firstName.value;
    let lastN = lastName.value;
    let cityN = cityName.value;

    if (email && pwd) {
      signupButton.textContent = "Signing Up..";
      spinner.classList.remove("d-none");
      createUserWithEmailAndPassword(auth, email, pwd)
        .then((userCredential) => {
          const user = userCredential.user;

          set(dbRef(database, "users/" + user.uid), {
            email: email,
            firstName: firstN,
            lastName: lastN,
            province: selectedValue,
            cityName: cityN,
          })
            .then(() => {
              setTimeout(() => {
                signupAlert.classList.remove("d-none");
                spinner.classList.add("d-none");
                setTimeout(() => {
                  window.location.href = "login.html";
                }, 2000);
              }, 2000);
            })
            .catch((error) => {
              console.error("Error saving user data: ", error);
              signupButton.textContent = "Signup";
              spinner.classList.add("d-none");
            });
        })
        .catch((error) => {
          console.error("Error creating user: ", error);
          signupButton.textContent = "Signup";
          spinner.classList.add("d-none");
        });
    } else {
      console.error("Email and password must be provided");
    }
  }
});

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

  if (!body.classList.contains("dark-mode")) {
    body.classList.add("light-mode");
  }
});
