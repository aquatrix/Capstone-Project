import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import {
  getDatabase,
  ref as dbRef,
  set,
  push,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBUXbpad1YMDEJ5gNUg9jCzDXuiY4mFeZ0",
  authDomain: "carswap-77314.firebaseapp.com",
  databaseURL: "https://carswap-77314-default-rtdb.firebaseio.com",
  projectId: "carswap-77314",
  storageBucket: "carswap-77314.appspot.com",
  messagingSenderId: "142942062618",
  appId: "1:142942062618:web:a4640695de4f70f5cf69a3",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);
const auth = getAuth(app);

const makeInput = document.getElementById("make");
const colorInput = document.getElementById("color");
const modelInput = document.getElementById("model");
const yearInput = document.getElementById("year");
const priceInput = document.getElementById("price");
const mileageInput = document.getElementById("mileage");
const carListingForm = document.getElementById("car-listing-form");
let profileName = document.getElementById("profile-name");
let submitBtn = document.getElementById("submit");
let navbar = document.getElementById("navbar");
let navbarNav = document.getElementById("navbarNav");
let navbarBrand = document.getElementById("navbar-brand");
let menuLink = document.getElementById("menu-link");

let imageUrl = "";
let userData;

onAuthStateChanged(auth, (user) => {
  if (user) {
    get(child(dbRef(database), `users/${user.uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const user = snapshot.val();
          userData = user;

          profileName.textContent = `${user.firstName}'s Profile`;
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  } else {
    console.log("No user is signed in.");

    setTimeout(() => {
      window.location.href = "./login.html";
    }, 3000);

    setTimeout(() => {
      console.log("Login required");
      loginAlert.textContent = "Login Required!";
      loginAlert.style.color = "red";
    }, 1000);
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
    const storageReference = storageRef(storage, "images/" + file.name);

    uploadBytes(storageReference, file)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
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
  imageContainer.innerHTML = "";
  imageContainer.appendChild(img);
}

carListingForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!imageUrl) {
    alert("Please upload an image before submitting the form.");
    return;
  }

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
    owner: userData.firstName + " " + userData.lastName,
  };

  addCarToList(carObject);
});

submitBtn.addEventListener("click", function () {
  submitBtn.textContent = "Submitting...";
  setTimeout(function () {
    window.location.href = "./shopcars.html";
  }, 3000);
});

function addCarToList(carObject) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const userId = user.uid;
    const newCarRef = push(dbRef(database, "carListing"));

    set(newCarRef, carObject)
      .then(() => {
        console.log("Car list data saved to the new node: ", newCarRef.key);

        const myListingsRef = dbRef(
          database,
          `users/${userId}/myListings/${newCarRef.key}`
        );
        set(myListingsRef, carObject)
          .then(() => {
            console.log("Car reference added to user's myListings node.");
          })
          .catch((error) => {
            console.log("Error adding car reference to myListings: ", error);
          });
      })
      .catch((error) => {
        console.log("Error saving car list data: ", error);
      });
  } else {
    console.log("No user is signed in.");
  }
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
