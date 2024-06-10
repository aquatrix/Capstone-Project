// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {getStorage,ref,uploadBytes,getDownloadURL,} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import {  getDatabase,  ref as dbRef,  set,  push,} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUXbpad1YMDEJ5gNUg9jCzDXuiY4mFeZ0",
  authDomain: "carswap-77314.firebaseapp.com",
  databaseURL: "https://carswap-77314-default-rtdb.firebaseio.com",
  projectId: "carswap-77314",
  storageBucket: "carswap-77314.appspot.com",
  messagingSenderId: "142942062618",
  appId: "1:142942062618:web:a4640695de4f70f5cf69a3",
};

// Initialize Firebase and their objects
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const storage = getStorage(app);
const database = getDatabase(app);

const makeInput = document.getElementById("make");
const colorInput = document.getElementById("color");
const modelInput = document.getElementById("model");
const yearInput = document.getElementById("year");
const priceInput = document.getElementById("price");
const mileageInput = document.getElementById("mileage");
const carListingForm = document.getElementById("car-listing-form");
const logoutBtn = document.getElementById("logout-button");
const submitButton = document.getElementById("submitBtn");


let imageUrl = "";
let currentUserId= ""

// Getting user id with the help of auth

onAuthStateChanged(auth, function (user) {
  if (user) {
    console.log("User is signed in:", user.uid);
    currentUserId = user.uid;
    console.log("User id from the sell car is: ", currentUserId)
  } else {
    console.log("No user is signed in.");
    setTimeout(function () {
      window.location.href = "./login.html";
    }, 3000);
      console.log("Login required");
  }
});

const uploadButton = document.getElementById("uploadButton");
uploadButton.addEventListener("click", (e) => {
  e.preventDefault();
  uploadImage();
});

function uploadImage() {
  const file = document.getElementById("imageUpload").files[0];

  if (file) {
    const storageRef = ref(storage, "images/" + file.name);

    uploadBytes(storageRef, file)
      .then((snapshot) => {
        console.log("Image uploaded successfully!");
        getDownloadURL(snapshot.ref)
          .then((url) => {
            console.log(url);
            imageUrl = url;
            displayImage(url);
          })
          .catch((error) => {
            console.error("Error getting download URL", error);
          });
      })
      .catch((error) => {
        console.error("Error uploading image", error);
      });
  } else {
    alert("Please select an image to upload.");
  }
}

function displayImage(url) {
  const imageContainer = document.getElementById("imageContainer");
  const img = document.createElement("img");
  img.src = url;
  imageContainer.innerHTML = ""; // Clear any existing images
  imageContainer.appendChild(img);
}

// Listing for the submit event for the form submission

carListingForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent the default form submission

  if (!imageUrl) {
    alert("Please upload an image before submitting the form.");
    return;
  }

  // Get form data
  const dmake = makeInput.value;
  const dcolor = colorInput.value;
  const dmodel = modelInput.value;
  const dyear = yearInput.value;
  const dprice = priceInput.value;
  const dmileage = mileageInput.value;

  const carObject = {
    color: dcolor,
    image: imageUrl,
    make: dmake,
    milage: dmileage,
    model: dmodel,
    price: dprice,
    year: dyear,
    userId: currentUserId
  };

  addCarToList(carObject);
});

//Adding the data to the carList node in the firebase

function addCarToList(carObject) {
  const newCarRef = push(dbRef(database, "carListing"));
  set(newCarRef, carObject)
    .then(() => {
      console.log("Car list data saved to the new node: ", newCarRef);
    })
    .catch((error) => {
      console.log("error : ", error);
    });
}



submitButton.addEventListener("click", function () {
  submitButton.textContent = "Submitting...";
  setTimeout(function () {
    window.location.href = "./shopcars.html";
  },3000);
});

// Logout button code

logoutBtn.addEventListener("click", function (e) {
  e.preventDefault(); // Prevent the default link action

  signOut(auth).then(() => {
    console.log("User signed out.");
    window.location.href = "./login.html"; // Redirect to login page after logout
  }).catch((error) => {
    console.error("Sign out error:", error);
  });
});

window.addEventListener('popstate', (event) => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "./login.html";
    }
  });
});