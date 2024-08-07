import {
  dbRef,
  onAuthStateChanged,
  auth,
  database,
  get,
  child,
  push,
  set,
  remove,
} from "./firebaseConfig.js";

let profileName = document.getElementById("profile-name");
let displayImage = document.getElementById("display-image");
let carHeader = document.getElementById("car-header");
let carPrice = document.getElementById("price");
let carColor = document.getElementById("color");
let carMileage = document.getElementById("mileage");
let carYear = document.getElementById("year");
let carDescription = document.getElementById("car-description");
let heart = document.getElementById("heart");
let carOwner = document.getElementById("list-owner");
let carId;
let carDetails;

let navbar = document.getElementById("navbar");
let navbarNav = document.getElementById("navbarNav");
let navbarBrand = document.getElementById("navbar-brand");
let menuLink = document.getElementById("menu-link");
let fetchPrice;

document.addEventListener("DOMContentLoaded", function () {
  carId = localStorage.getItem("selectedCarId");
  const ref = dbRef(database);

  get(child(ref, `carListing/${carId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        carDetails = snapshot.val();
        displayImage.src = carDetails.image;
        carHeader.innerHTML = `${carDetails.make} ${carDetails.model}`;
        carPrice.innerHTML = `<i class="fa-solid fa-dollar-sign"></i> ${carDetails.price}`;
        carColor.innerHTML = `<i class="fa-solid fa-paint-roller"></i> ${carDetails.color}`;
        carMileage.innerHTML = `<i class="fa-solid fa-road"></i> ${carDetails.milage}`;
        carYear.innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${carDetails.year}`;
        carDescription.innerHTML = `Introducing a pristine ${carDetails.color} ${carDetails.year} ${carDetails.make} ${carDetails.model}, a stylish and reliable compact car perfect for both city driving and longer journeys. Priced at an affordable $${carDetails.price}, this vehicle offers excellent value for its class. With ${carDetails.milage} kilometres on the odometer, it demonstrates durability and consistent performance over the years. The ${carDetails.make} ${carDetails.model} is renowned for its sporty design, fuel efficiency, and smooth handling. Its sleek white exterior is complemented by a well-maintained interior, featuring modern amenities and comfortable seating. Whether you're commuting daily or planning road trips, this ${carDetails.make} ${carDetails.model} promises a dependable and enjoyable driving experience. Don't miss the chance to own this versatile and economical vehicle that combines quality, affordability, and style.`;
        carOwner.innerHTML = `Listed by ${carDetails.owner}`;
        fetchPrice = carDetails.price;
        onAuthStateChanged(auth, function (user) {
          if (user) {
            const wishlistRef = dbRef(
              database,
              `users/${user.uid}/wishlist/${carId}`
            );
            get(wishlistRef)
              .then((snapshot) => {
                if (snapshot.exists()) {
                  heart.className = "heart fa-solid fa-heart";
                }
              })
              .catch((error) => {
                console.error("Error checking wishlist:", error);
              });
          }
        });
      } else {
        console.log("No data available for this car ID.");
      }
    })
    .catch((error) => {
      console.error("Error fetching car details:", error);
    });
});

onAuthStateChanged(auth, function (user) {
  if (user) {
    const ref = dbRef(database);

    get(child(ref, `users/${user.uid}`))
      .then((snapshot) => {
        const userData = snapshot.val();
        profileName.textContent = `${userData.firstName}'s Profile`;
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  } else {
    console.log("No user is signed in.");
    setTimeout(function () {
      window.location.href = "./login.html";
    }, 3000);
  }
});

const ref = dbRef(database);

heart.addEventListener("click", function () {
  if (heart.className == "heart fa-regular fa-heart") {
    heart.className = "heart fa-solid fa-heart";
    updateWishlist(true);
  } else if (heart.className == "heart fa-solid fa-heart") {
    heart.className = "heart fa-regular fa-heart";
    updateWishlist(false);
  }
});

function updateWishlist(addToWishlist) {
  onAuthStateChanged(auth, function (user) {
    if (user) {
      const userId = user.uid;
      const wishlistRef = dbRef(database, `users/${userId}/wishlist/${carId}`);
      if (addToWishlist) {
        let carObject = {
          model: carDetails.model,
          make: carDetails.make,
          milage: carDetails.milage,
          price: carDetails.price,
          year: carDetails.year,
          image: carDetails.image,
          color: carDetails.color,
        };
        set(wishlistRef, carObject)
          .then(() => {
            console.log("Car added to wishlist");
          })
          .catch((error) => {
            console.error("Error adding car to wishlist:", error);
          });
      } else {
        remove(wishlistRef)
          .then(() => {
            console.log("Car removed from wishlist");
          })
          .catch((error) => {
            console.error("Error removing car from wishlist:", error);
          });
      }
    }
  });
}

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

document.getElementById("apply-credit").addEventListener("click", function () {
  carId = localStorage.getItem("selectedCarId");
  const ref = dbRef(database);

  get(child(ref, `carListing/${carId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const carDetails = snapshot.val();
      } else {
        console.log("No data available for the selected car.");
      }
    })
    .catch((error) => {
      console.error("Error retrieving car details: ", error);
    });
  const financePeriod = document.getElementById("finance-period").value;
  const paymentFrequency = document.getElementById("payment-frequency").value;
  const downPayment = parseFloat(document.getElementById("down-payment").value);
  const tradeInValue = parseFloat(
    document.getElementById("trade-in-value").value
  );
  const totalAmount = carDetails.price;
  const interestRate = 0.0499;
  const months = parseInt(financePeriod);
  const loanAmount = totalAmount - downPayment - tradeInValue;

  let paymentAmount;
  if (paymentFrequency === "weekly") {
    paymentAmount =
      (loanAmount * interestRate) /
      52 /
      (1 - Math.pow(1 + interestRate / 52, -months * 4.33));
  } else if (paymentFrequency === "bi-weekly") {
    paymentAmount =
      (loanAmount * interestRate) /
      26 /
      (1 - Math.pow(1 + interestRate / 26, -months * 2.165));
  } else {
    paymentAmount =
      (loanAmount * interestRate) /
      12 /
      (1 - Math.pow(1 + interestRate / 12, -months));
  }

  document.getElementById("payment-amount").textContent = `${
    paymentFrequency.charAt(0).toUpperCase() + paymentFrequency.slice(1)
  } Payment: $${paymentAmount.toFixed(2)}`;
});
