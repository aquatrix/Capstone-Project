import {
  dbRef,
  onAuthStateChanged,
  auth,
  database,
  get,
  child,
} from "./firebaseConfig.js";

let placeholderDiv = document.getElementById("placeholder");
let mainDiv = document.getElementById("main");
let loginAlert = document.getElementById("heading-alert");
let profileName = document.getElementById("profile-name");
let cardContainer = document.getElementById("card-container");

onAuthStateChanged(auth, function (user) {
  if (user) {
    const ref = dbRef(database);

    get(child(ref, `users/${user.uid}`))
      .then((snapshot) => {
        const user = snapshot.val();
        profileName.textContent = `${user.firstName}'s Profile`;

        placeholderDiv.style.display = "block";
        setTimeout(function () {
          placeholderDiv.style.display = "none";
          mainDiv.style.display = "block";
        }, 3000);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });

    get(child(ref, "carListing"))
      .then((snapshot) => {
        const carListings = snapshot.val();

        for (let id in carListings) {
          cardContainer.innerHTML += `<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div class="card" style="width: 100%">
              <img src="${carListings[id].image}" class="card-img-top" alt="Card image"/>
              <div class="card-body">
                <h5 class="card-title">${carListings[id].make} ${carListings[id].model}</h5>
                <p class="card-text">
                  ${carListings[id].color} ${carListings[id].year} ${carListings[id].make} ${carListings[id].model} with ${carListings[id].milage} kilometres, priced at $${carListings[id].price}.
                </p>
                <a href="#" id="${id}" class="btn btn-primary view-details">View Details</a>
              </div>
            </div>
          </div>`;
        }

        var buttons = document.querySelectorAll(".view-details");
        buttons.forEach(function (button) {
          button.addEventListener("click", function (event) {
            event.preventDefault();
            const carId = button.id;
            console.log("Button clicked for car ID:", carId);
            localStorage.setItem("selectedCarId", carId);
            window.location.href = "./cardetails.html";
          });
        });
      })
      .catch((error) => {
        console.error("Error fetching car listings:", error);
      });
  } else {
    console.log("No user is signed in.");
    setTimeout(function () {
      window.location.href = "./login.html";
    }, 3000);

    setTimeout(function () {
      loginAlert.textContent = "Login Required!";
      loginAlert.style.color = "red";
    }, 1000);
  }
});

let logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", function () {
  logoutButton.disabled = true;
  logoutButton.textContent = "Logging Out...";

  setTimeout(function () {
    auth
      .signOut()
      .then(function () {
        console.log("User signed out.");
        setTimeout(function () {
          window.location.href = "./login.html";
        }, 800);
      })
      .catch(function (error) {
        console.error("Sign out error:", error);
      });
  }, 800);
});
