import {
  auth,
  onAuthStateChanged,
  get,
  child,
  dbRef,
  database,
  signOut,
  uploadBytes,
  storageRef,
  getDownloadURL,
  storage,
  set,
  update,
} from "./firebaseConfig.js";

let profileName = document.getElementById("profile-name");
let profileUserName = document.getElementById("profile-username");
let profileImg = document.getElementById("profileImg");
let newImage = document.getElementById("new-profile");

let emailAddress = document.getElementById("email");
let city = document.getElementById("city");
let state = document.getElementById("state");
let province = document.getElementById("province");

let firstName = document.getElementById("input-f-name");
let lastName = document.getElementById("input-l-name");

let cityName = document.getElementById("input-city");

let editProfileButton = document.getElementById("edit-btn");
let profileSection = document.getElementById("profile-section");
let editButton = document.getElementById("edit-button");

let editProfile = document.getElementById("edit-profile");
let saveBtn = document.getElementById("save-btn");
let cancelBtn = document.getElementById("cancel");

let uploadBtn = document.getElementById("uploadPicture");

let cardContainer = document.getElementById("card-container");

let wishlistContainer = document.getElementById("wishlist-container");

let uid = "";

let navbar = document.getElementById("navbar");
let navbarNav = document.getElementById("navbarNav");
let navbarBrand = document.getElementById("navbar-brand");
let menuLink = document.getElementById("menu-link");
let badgeTitle = document.getElementById("badge-title");
let badgeContainer = document.getElementById("badgeContainer");

onAuthStateChanged(auth, function (user) {
  if (user) {
    uid = user.uid;
    const ref = dbRef(database);
    get(child(ref, `users/${user.uid}`))
      .then((snapshot) => {
        const user = snapshot.val();

        profileName.textContent = `${user.firstName}'s Profile`;
        profileUserName.innerHTML = `${user.firstName} ${user.lastName}`;
        emailAddress.innerHTML = user.email;
        city.innerHTML = user.cityName;
        state.innerHTML = user.province;

        profileImg.src = user.profileImage;
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  } else {
    console.log("No user is signed in.");
  }
});

let logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", function () {
  logoutButton.disabled = true;
  logoutButton.textContent = "Logging Out...";

  setTimeout(function () {
    signOut(auth)
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

editProfileButton.addEventListener("click", function () {
  profileSection.style.display = "none";
  editButton.style.display = "none";
  editProfile.style.display = "flex";
  saveBtn.style.display = "flex";

  const ref = dbRef(database);
  get(child(ref, `users/${uid}`))
    .then((snapshot) => {
      const user = snapshot.val();
      newImage.src = user.profileImage;
      firstName.value = user.firstName;
      lastName.value = user.lastName;
      cityName.value = user.cityName;
      province.value = user.province;
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
});

saveBtn.addEventListener("click", function () {
  console.log(lastName.value);
  console.log(province.value);
  console.log(cityName.value);
  console.log(firstName.value);
  console.log("click");

  const updatedUserData = {
    firstName: firstName.value,
    lastName: lastName.value,
    cityName: cityName.value,
    province: province.value,
  };

  const userRef = dbRef(database, `users/${uid}`);

  update(userRef, updatedUserData)
    .then(() => {
      console.log("User data updated successfully!");

      profileSection.style.display = "flex";
      editButton.style.display = "flex";
      editProfile.style.display = "none";
      saveBtn.style.display = "none";
    })
    .catch((error) => {
      console.error("Error updating user data:", error);
    });
  location.reload();
});

cancelBtn.addEventListener("click", function () {
  profileSection.style.display = "flex";
  editButton.style.display = "flex";
  editProfile.style.display = "none";
  saveBtn.style.display = "none";
});

uploadBtn.addEventListener("click", () => {
  let picture = document.createElement("input");
  picture.type = "file";

  picture.addEventListener("change", (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const storageReference = storageRef(
        storage,
        "profileImg/" + selectedFile.name
      );

      uploadBytes(storageReference, selectedFile)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((url) => {
              newImage.src = url;

              var userRef = dbRef(database, `users/${uid}/profileImage`);

              set(userRef, url)
                .then(() => {})
                .catch((error) => {
                  console.error("Error updating profile image URL:", error);
                });
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
  });
  picture.click();
});

onAuthStateChanged(auth, function (user) {
  if (user) {
    const ref = dbRef(database);

    get(child(ref, `users/${user.uid}/myListings`))
      .then((snapshot) => {
        const carListings = snapshot.val();
        if (carListings) {
          Object.keys(carListings).forEach((listingKey) => {
            const listing = carListings[listingKey];

            cardContainer.innerHTML += `<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div class="card" style="width: 100%">
              <img src="${listing.image}" class="card-img-top" alt="Card image"/>
              <div class="card-body">
                <h5 class="card-title">${listing.make} ${listing.model}</h5>
                <p class="card-text">
                  ${listing.color} ${listing.year} ${listing.make} ${listing.model} with ${listing.milage} kilometres, priced at $${listing.price}.
                </p>
                <a href="cardetails.html" id=${listingKey} class="btn btn-primary view-details">View Details</a>
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
        } else {
          console.log("No listings found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching car listings:", error);
      });
  } else {
    console.log("No user is signed in.");
  }
});

onAuthStateChanged(auth, function (user) {
  if (user) {
    const ref = dbRef(database);

    get(child(ref, `users/${user.uid}/wishlist`))
      .then((snapshot) => {
        const carListings = snapshot.val();
        if (carListings) {
          Object.keys(carListings).forEach((listingKey) => {
            const listing = carListings[listingKey];

            wishlistContainer.innerHTML += `<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div class="card" style="width: 100%">
              <img src="${listing.image}" class="card-img-top" alt="Card image"/>
              <div class="card-body">
                <h5 class="card-title">${listing.make} ${listing.model}</h5>
                <p class="card-text">
                  ${listing.color} ${listing.year} ${listing.make} ${listing.model} with ${listing.milage} kilometres, priced at $${listing.price}.
                </p>
                <a href="cardetails.html" id=${listingKey} class="btn btn-primary view-details">View Details</a>
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
        } else {
        }
      })
      .catch((error) => {
        console.error("Error fetching car listings:", error);
      });
  } else {
    console.log("No user is signed in.");
  }
});

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

onAuthStateChanged(auth, function (user) {
  if (user) {
    console.log("User ID:", user.uid);

    const checkForChildNode = (nodePath) => {
      const nodeRef = dbRef(database, nodePath);

      get(nodeRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            let numChildren = 0;
            snapshot.forEach(() => {
              numChildren++;
            });

            if (numChildren === 1) {
              console.log("1 record found");
              badgeTitle.textContent = "Rookie Seller";
              badgeContainer.style.display = "block";
            } else if (numChildren > 4) {
              console.log("More than 4 records found");
              badgeTitle.textContent = "Top Seller";
              badgeContainer.style.backgroundColor = "red";
              badgeContainer.style.display = "block";
            }
          } else {
            console.log("No records found");
          }
        })
        .catch((error) => {
          console.error("Error getting data:", error);
        });
    };

    checkForChildNode(`users/${user.uid}/myListings`);
  } else {
    console.log("No user is signed in.");
  }
});
