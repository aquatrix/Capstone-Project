document.addEventListener("DOMContentLoaded", function () {
  let signupButton = document.getElementById("signup-button");
  let emailInput = document.getElementById("emailInput");
  let passwordInput = document.getElementById("password-input");
  let firstName = document.getElementById("firstName");
  let lastName = document.getElementById("lastName");
  let cityName = document.getElementById("city-name");
  let signupAlert = document.getElementById("signup-alert");
  let spinner = document.getElementById("spinner");

  signupAlert.style.display = "none";
  spinner.style.display = "none";

  signupButton.addEventListener("click", function (event) {
    event.preventDefault();
    signupUser();
  });

  function signupUser() {
    let provinceDropdown = document.getElementById("province-dropdown");

    let email = emailInput.value;
    let pwd = passwordInput.value;
    let selectedValue = provinceDropdown.value;
    let firstN = firstName.value;
    let lastN = lastName.value;
    let cityN = cityName.value;

    console.log(selectedValue);
    console.log(firstName.value);
    console.log(lastName.value);
    console.log(emailInput.value);
    console.log(passwordInput.value);
    console.log(cityName.value);

    if (email && pwd) {
      signupButton.textContent = "Signing Up..";
      spinner.style.display = "block";
     
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, pwd)
        .then((userCredential) => {
          const user = userCredential.user;
          firebase
            .database()
            .ref("users/" + user.uid)
            .set({
              email: email,
              firstName: firstN,
              lastName: lastN,
              province: selectedValue,
              cityName: cityN,
            })
            .then(() => {
              console.log("User data saved successfully");
              setTimeout(() => {
                signupAlert.style.display = "block";
                
                setTimeout(() => {
                  window.location.href = "login.html";
                }, 2000); 
              }, 2000);
             
            })
            .catch((error) => {
              console.error("Error saving user data: ", error);
            });
        })
        .catch((error) => {
          console.error("Error creating user: ", error);
        });
    } else {
      console.error("Email and password must be provided");
    }
  }
});
