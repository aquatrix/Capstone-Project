import {
  dbRef,
  onAuthStateChanged,
  auth,
  database,
  get,
  child,
  query,
  orderByChild,
  equalTo,
  onValue,
  ref,
  startAt,
  endAt,
} from "./firebaseConfig.js";

let placeholderDiv = document.getElementById("placeholder");
let mainDiv = document.getElementById("main");
let loginAlert = document.getElementById("heading-alert");
let profileName = document.getElementById("profile-name");
let cardContainer = document.getElementById("card-container");
let carSearch = document.getElementById("car-search");
let searchButton = document.getElementById("search-button");
let select = document.getElementById("sortPrices");
let checkboxes = document.querySelectorAll('input[name="makeFilter"]');

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

        searchButton.addEventListener("click", function () {
          let searchValue = carSearch.value;
          console.log(searchValue);
        });
      })
      .catch((error) => {
        console.error("Error fetching car listings:", error);
      });
  } else {
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
        setTimeout(function () {
          window.location.href = "./login.html";
        }, 800);
      })
      .catch(function (error) {
        console.error("Sign out error:", error);
      });
  }, 800);
});

searchButton.addEventListener("click", function () {
  let searchValue = carSearch.value;
  console.log(searchValue);

  placeholderDiv.style.display = "none";
  mainDiv.style.display = "block";

  if (searchValue == "") {
    location.reload();
  } else {
    const carListingRef = ref(database, "carListing");
    var userInputLower = searchValue.toLowerCase();
    var userInputCapitalized =
      userInputLower.charAt(0).toUpperCase() + userInputLower.slice(1);
    const carQuery = query(
      carListingRef,
      orderByChild("make"),
      equalTo(userInputCapitalized)
    );

    onValue(carQuery, (snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        cardContainer.innerHTML = "";
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
      } else {
        console.log("No cars found");
        cardContainer.innerHTML = "<p>No cars found</p>";
      }
    });
  }
});

select.addEventListener("change", function () {
  if (select.value === "lowToHigh") {
    cheapestFirst();
  } else if (select.value === "highToLow") {
    expensiveFirst();
  } else if (select.value === "newestFirst") {
    newestFirst();
  } else if (select.value === "oldestFirst") {
    oldestFirst();
  }
});

function cheapestFirst() {
  console.log("low to high");
  cardContainer.innerHTML = "";

  const carListingRef = ref(database, "carListing");

  const carQuery = query(carListingRef, orderByChild("price"), startAt(0));
  onValue(carQuery, (snapshot) => {
    if (snapshot.exists()) {
      cardContainer.innerHTML = "";
      const priced = snapshot.val();

      const carArray = Object.entries(priced)
        .map(([key, value]) => ({ id: key, ...value }))
        .sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

      carArray.forEach((car) => {
        cardContainer.innerHTML += `<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                      <div class="card" style="width: 100%">
                        <img src="${car.image}" class="card-img-top" alt="Card image"/>
                        <div class="card-body">
                          <h5 class="card-title">${car.make} ${car.model}</h5>
                          <p class="card-text">
                            ${car.color} ${car.year} ${car.make} ${car.model} with ${car.milage} kilometres, priced at $${car.price}.
                          </p>
                          <a href="#" id="${car.id}" class="btn btn-primary view-details">View Details</a>
                        </div>
                      </div>
                    </div>`;
      });

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
    }
  });
}

function expensiveFirst() {
  console.log("high to low");
  cardContainer.innerHTML = "";

  const carListingRef = ref(database, "carListing");

  const carQuery = query(carListingRef, orderByChild("price"), startAt(0));
  onValue(carQuery, (snapshot) => {
    if (snapshot.exists()) {
      cardContainer.innerHTML = "";
      const priced = snapshot.val();

      const carArray = Object.entries(priced)
        .map(([key, value]) => ({ id: key, ...value }))
        .sort((a, b) => parseFloat(b.price) - parseFloat(a.price));

      carArray.forEach((car) => {
        cardContainer.innerHTML += `<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                      <div class="card" style="width: 100%">
                        <img src="${car.image}" class="card-img-top" alt="Card image"/>
                        <div class="card-body">
                          <h5 class="card-title">${car.make} ${car.model}</h5>
                          <p class="card-text">
                            ${car.color} ${car.year} ${car.make} ${car.model} with ${car.milage} kilometres, priced at $${car.price}.
                          </p>
                          <a href="#" id="${car.id}" class="btn btn-primary view-details">View Details</a>
                        </div>
                      </div>
                    </div>`;
      });

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
    }
  });
}

function newestFirst() {
  console.log("newest first");
  cardContainer.innerHTML = "";

  const carListingRef = ref(database, "carListing");

  const carQuery = query(carListingRef, orderByChild("year"), startAt(0));
  onValue(carQuery, (snapshot) => {
    if (snapshot.exists()) {
      cardContainer.innerHTML = "";
      const cars = snapshot.val();

      const carArray = Object.entries(cars)
        .map(([key, value]) => ({ id: key, ...value }))
        .sort((a, b) => parseInt(b.year) - parseInt(a.year));

      carArray.forEach((car) => {
        cardContainer.innerHTML += `<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                      <div class="card" style="width: 100%">
                        <img src="${car.image}" class="card-img-top" alt="Card image"/>
                        <div class="card-body">
                          <h5 class="card-title">${car.make} ${car.model}</h5>
                          <p class="card-text">
                            ${car.color} ${car.year} ${car.make} ${car.model} with ${car.milage} kilometres, priced at $${car.price}.
                          </p>
                          <a href="#" id="${car.id}" class="btn btn-primary view-details">View Details</a>
                        </div>
                      </div>
                    </div>`;
      });

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
    }
  });
}

function oldestFirst() {
  console.log("oldest first");
  cardContainer.innerHTML = "";

  const carListingRef = ref(database, "carListing");

  const carQuery = query(carListingRef, orderByChild("year"), startAt(0));
  onValue(carQuery, (snapshot) => {
    if (snapshot.exists()) {
      cardContainer.innerHTML = "";
      const cars = snapshot.val();

      const carArray = Object.entries(cars)
        .map(([key, value]) => ({ id: key, ...value }))
        .sort((a, b) => parseInt(a.year) - parseInt(b.year));

      carArray.forEach((car) => {
        cardContainer.innerHTML += `<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                      <div class="card" style="width: 100%">
                        <img src="${car.image}" class="card-img-top" alt="Card image"/>
                        <div class="card-body">
                          <h5 class="card-title">${car.make} ${car.model}</h5>
                          <p class="card-text">
                            ${car.color} ${car.year} ${car.make} ${car.model} with ${car.milage} kilometres, priced at $${car.price}.
                          </p>
                          <a href="#" id="${car.id}" class="btn btn-primary view-details">View Details</a>
                        </div>
                      </div>
                    </div>`;
      });

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
    }
  });
}

function displayCars(cars) {
  cardContainer.innerHTML = "";
  cars.forEach((car) => {
    cardContainer.innerHTML += `<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div class="card" style="width: 100%">
        <img src="${car.image}" class="card-img-top" alt="Card image"/>
        <div class="card-body">
          <h5 class="card-title">${car.make} ${car.model}</h5>
          <p class="card-text">
            ${car.color} ${car.year} ${car.make} ${car.model} with ${car.milage} kilometres, priced at $${car.price}.
          </p>
          <a href="#" id="${car.id}" class="btn btn-primary view-details">View Details</a>
        </div>
      </div>
    </div>`;
  });

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
}

function filterAndDisplayCars() {
  const selectedMakes = Array.from(checkboxes)
    .filter((box) => box.checked)
    .map((box) => box.value);

  if (selectedMakes.length === 0) {
    get(child(ref(database), "carListing")).then((snapshot) => {
      if (snapshot.exists()) {
        const cars = Object.entries(snapshot.val()).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        displayCars(cars);
      }
    });
  } else {
    const carListingRef = ref(database, "carListing");
    const carQuery = query(carListingRef, orderByChild("make"));

    onValue(carQuery, (snapshot) => {
      if (snapshot.exists()) {
        const cars = Object.entries(snapshot.val())
          .map(([key, value]) => ({ id: key, ...value }))
          .filter((car) => selectedMakes.includes(car.make.toLowerCase()));

        displayCars(cars);
      }
    });
  }
}

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", filterAndDisplayCars);
});

filterAndDisplayCars();
