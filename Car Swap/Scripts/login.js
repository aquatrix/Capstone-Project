let emailInput = document.getElementById("emailInput");
let passwordInput = document.getElementById("passwordInput");
let loginButton = document.getElementById("login-button");
let loginSpinner = document.getElementById("login-spinner");

loginSpinner.style.display = "none";

loginButton.addEventListener("click", function (event) {
  event.preventDefault();
  loginUser();
});

function loginUser() {
  let email = emailInput.value;
  let pwd = passwordInput.value;

  if (email && pwd) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, pwd)
      .then((userCredential) => {
        loginButton.textContent = "Logging in...";
        loginSpinner.style.display = "block";
        const user = userCredential.user;
        console.log("User ID: ", user.uid);

        // Redirect to another page after 2 seconds
        setTimeout(function () {
          window.location.href = "shopcars.html";
        }, 2000);
      })
      .catch((error) => {
        console.error("Error signing in: ", error.message);
      });
  } else {
    console.error("Email and password must be provided");
  }
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    console.log("User is signed in:", user.uid);
  } else {
  
    console.log("No user is signed in.");
  }
});
