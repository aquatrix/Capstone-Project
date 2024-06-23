import { auth, createUserWithEmailAndPassword, database, dbRef, set } from "./firebaseConfig.js";


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

              set(dbRef(database, "users/" + user.uid),{
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
  