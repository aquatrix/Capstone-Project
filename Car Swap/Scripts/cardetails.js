import {
  dbRef,
  onAuthStateChanged,
  auth,
  database,
  get,
  child,
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

document.addEventListener("DOMContentLoaded", function () {
  carId = localStorage.getItem("selectedCarId");
  console.log("Car ID retrieved from storage:", carId);
  get(child(ref, `carListing/${carId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const carDetails = snapshot.val();
        console.log(carDetails.image);
        displayImage.src = carDetails.image;
        carHeader.innerHTML = `${carDetails.make} ${carDetails.model}`;
        carPrice.innerHTML = `<i class="fa-solid fa-dollar-sign"></i> ${carDetails.price}`;
        carColor.innerHTML = `<i class="fa-solid fa-paint-roller"></i> ${carDetails.color}`;
        carMileage.innerHTML = `<i class="fa-solid fa-road"></i> ${carDetails.milage}`;
        carYear.innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${carDetails.year}`;
        carDescription.innerHTML = `Introducing a pristine ${carDetails.color} ${carDetails.year} ${carDetails.make} ${carDetails.model}, a stylish and reliable compact car perfect for both city driving and longer journeys. Priced at an affordable $${carDetails.price}, this vehicle offers excellent value for its class. With ${carDetails.milage} kilometres on the odometer, it demonstrates durability and consistent performance over the years. The ${carDetails.make} ${carDetails.model} is renowned for its sporty design, fuel efficiency, and smooth handling. Its sleek white exterior is complemented by a well-maintained interior, featuring modern amenities and comfortable seating. Whether you're commuting daily or planning road trips, this ${carDetails.make} ${carDetails.model} promises a dependable and enjoyable driving experience. Don't miss the chance to own this versatile and economical vehicle that combines quality, affordability, and style.`;
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
        const user = snapshot.val();
        profileName.textContent = `${user.firstName}'s Profile`;
        carOwner.innerHTML = `Listed by ${user.firstName} ${user.lastName}`;
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
  console.log(heart.className);
  if (heart.className == "heart fa-regular fa-heart") {
    heart.className = "heart fa-solid fa-heart";
  } else if (heart.className == "heart fa-solid fa-heart") {
    heart.className = "heart fa-regular fa-heart";
  }
});
