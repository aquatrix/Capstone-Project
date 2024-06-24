// import {
//   dbRef,
//   onAuthStateChanged,
//   auth,
//   database,
//   get,
//   child,
// } from "./firebaseConfig.js";

// let profileName = document.getElementById("profile-name");
// let displayImage = document.getElementById("display-image");
// let carHeader = document.getElementById("car-header");
// let carPrice = document.getElementById("price");
// let carColor = document.getElementById("color");
// let carMileage = document.getElementById("mileage");
// let carYear = document.getElementById("year");
// let carDescription = document.getElementById("car-description");
// let heart = document.getElementById("heart");
// let carOwner = document.getElementById("list-owner");
// let carId;

// document.addEventListener("DOMContentLoaded", function () {
//   carId = localStorage.getItem("selectedCarId");
//   console.log("Car ID retrieved from storage:", carId);
//   get(child(ref, `carListing/${carId}`))
//     .then((snapshot) => {
//       if (snapshot.exists()) {
//         const carDetails = snapshot.val();
//         console.log(carDetails.image);
//         displayImage.src = carDetails.image;
//         carHeader.innerHTML = `${carDetails.make} ${carDetails.model}`;
//         carPrice.innerHTML = `<i class="fa-solid fa-dollar-sign"></i> ${carDetails.price}`;
//         carColor.innerHTML = `<i class="fa-solid fa-paint-roller"></i> ${carDetails.color}`;
//         carMileage.innerHTML = `<i class="fa-solid fa-road"></i> ${carDetails.milage}`;
//         carYear.innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${carDetails.year}`;
//         carDescription.innerHTML = `Introducing a pristine ${carDetails.color} ${carDetails.year} ${carDetails.make} ${carDetails.model}, a stylish and reliable compact car perfect for both city driving and longer journeys. Priced at an affordable $${carDetails.price}, this vehicle offers excellent value for its class. With ${carDetails.milage} kilometres on the odometer, it demonstrates durability and consistent performance over the years. The ${carDetails.make} ${carDetails.model} is renowned for its sporty design, fuel efficiency, and smooth handling. Its sleek white exterior is complemented by a well-maintained interior, featuring modern amenities and comfortable seating. Whether you're commuting daily or planning road trips, this ${carDetails.make} ${carDetails.model} promises a dependable and enjoyable driving experience. Don't miss the chance to own this versatile and economical vehicle that combines quality, affordability, and style.`;
//       } else {
//         console.log("No data available for this car ID.");
//       }
//     })
//     .catch((error) => {
//       console.error("Error fetching car details:", error);
//     });
// });

// onAuthStateChanged(auth, function (user) {
//   if (user) {
//     const ref = dbRef(database);

//     get(child(ref, `users/${user.uid}`))
//       .then((snapshot) => {
//         const user = snapshot.val();
//         profileName.textContent = `${user.firstName}'s Profile`;
//         carOwner.innerHTML = `Listed by ${user.firstName} ${user.lastName}`;
//       })
//       .catch((error) => {
//         console.error("Error fetching user data:", error);
//       });
//   } else {
//     console.log("No user is signed in.");
//     setTimeout(function () {
//       window.location.href = "./login.html";
//     }, 3000);
//   }
// });

// const ref = dbRef(database);

// heart.addEventListener("click", function () {
//   console.log(heart.className);
//   if (heart.className == "heart fa-regular fa-heart") {
//     console.log(carId)

//     heart.className = "heart fa-solid fa-heart";
//   } else if (heart.className == "heart fa-solid fa-heart") {
//     heart.className = "heart fa-regular fa-heart";
//   }
// });

//Success

// import {
//   dbRef,
//   onAuthStateChanged,
//   auth,
//   database,
//   get,
//   child,
//   push,
//   set
// } from "./firebaseConfig.js";

// let profileName = document.getElementById("profile-name");
// let displayImage = document.getElementById("display-image");
// let carHeader = document.getElementById("car-header");
// let carPrice = document.getElementById("price");
// let carColor = document.getElementById("color");
// let carMileage = document.getElementById("mileage");
// let carYear = document.getElementById("year");
// let carDescription = document.getElementById("car-description");
// let heart = document.getElementById("heart");
// let carOwner = document.getElementById("list-owner");
// let carId;

// document.addEventListener("DOMContentLoaded", function () {
//   carId = localStorage.getItem("selectedCarId");
//   console.log("Car ID retrieved from storage:", carId);
//   const ref = dbRef(database);

//   get(child(ref, `carListing/${carId}`))
//     .then((snapshot) => {
//       if (snapshot.exists()) {
//         const carDetails = snapshot.val();
//         console.log(carDetails.image);
//         displayImage.src = carDetails.image;
//         carHeader.innerHTML = `${carDetails.make} ${carDetails.model}`;
//         carPrice.innerHTML = `<i class="fa-solid fa-dollar-sign"></i> ${carDetails.price}`;
//         carColor.innerHTML = `<i class="fa-solid fa-paint-roller"></i> ${carDetails.color}`;
//         carMileage.innerHTML = `<i class="fa-solid fa-road"></i> ${carDetails.milage}`;
//         carYear.innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${carDetails.year}`;
//         carDescription.innerHTML = `Introducing a pristine ${carDetails.color} ${carDetails.year} ${carDetails.make} ${carDetails.model}, a stylish and reliable compact car perfect for both city driving and longer journeys. Priced at an affordable $${carDetails.price}, this vehicle offers excellent value for its class. With ${carDetails.milage} kilometres on the odometer, it demonstrates durability and consistent performance over the years. The ${carDetails.make} ${carDetails.model} is renowned for its sporty design, fuel efficiency, and smooth handling. Its sleek white exterior is complemented by a well-maintained interior, featuring modern amenities and comfortable seating. Whether you're commuting daily or planning road trips, this ${carDetails.make} ${carDetails.model} promises a dependable and enjoyable driving experience. Don't miss the chance to own this versatile and economical vehicle that combines quality, affordability, and style.`;
//       } else {
//         console.log("No data available for this car ID.");
//       }
//     })
//     .catch((error) => {
//       console.error("Error fetching car details:", error);
//     });
// });

// onAuthStateChanged(auth, function (user) {
//   if (user) {
//     const ref = dbRef(database);

//     get(child(ref, `users/${user.uid}`))
//       .then((snapshot) => {
//         const userData = snapshot.val();
//         profileName.textContent = `${userData.firstName}'s Profile`;
//         carOwner.innerHTML = `Listed by ${userData.firstName} ${userData.lastName}`;
//       })
//       .catch((error) => {
//         console.error("Error fetching user data:", error);
//       });
//   } else {
//     console.log("No user is signed in.");
//     setTimeout(function () {
//       window.location.href = "./login.html";
//     }, 3000);
//   }
// });

// const ref = dbRef(database);

// heart.addEventListener("click", function () {
//   console.log(heart.className);
//   if (heart.className == "heart fa-regular fa-heart") {
//     console.log(carId);

//     heart.className = "heart fa-solid fa-heart";

//     onAuthStateChanged(auth, function (user) {
//       if (user) {
//         const userId = user.uid;
//         const wishlistRef = push(dbRef(database, `users/${userId}/wishlist`))
//         //const newCarRef = push(dbRef(database, "carListing"));

//         let wishlistObject = {
//           carId: carId
//         }

//         set(wishlistRef, wishlistObject)
//       .then(() => {
//         console.log("Car list data saved to the new node:");
//       })
//       .catch((error) => {
//         console.log("Error saving car list data: ", error);
//       });
//       }
//     });

//   } else if (heart.className == "heart fa-solid fa-heart") {
//     heart.className = "heart fa-regular fa-heart";
//     // Optionally implement remove from wishlist logic here
//   }
// });

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

document.addEventListener("DOMContentLoaded", function () {
  carId = localStorage.getItem("selectedCarId");
  console.log("Car ID retrieved from storage:", carId);
  const ref = dbRef(database);

  get(child(ref, `carListing/${carId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        carDetails = snapshot.val();
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
        const userData = snapshot.val();
        profileName.textContent = `${userData.firstName}'s Profile`;
        carOwner.innerHTML = `Listed by ${userData.firstName} ${userData.lastName}`;
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
    console.log(carId);

    heart.className = "heart fa-solid fa-heart";

    onAuthStateChanged(auth, function (user) {
      if (user) {
        const userId = user.uid;
        const wishlistRef = dbRef(
          database,
          `users/${userId}/wishlist/${carId}`
        );

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
      }
    });
  } else if (heart.className == "heart fa-solid fa-heart") {
    console.log(carId);

    heart.className = "heart fa-regular fa-heart";

    onAuthStateChanged(auth, function (user) {
      if (user) {
        const userId = user.uid;
        const wishlistRef = dbRef(
          database,
          `users/${userId}/wishlist/${carId}`
        );

        remove(wishlistRef)
          .then(() => {
            console.log("Car removed from wishlist");
          })
          .catch((error) => {
            console.error("Error removing car from wishlist:", error);
          });
      }
    });
  }
});
