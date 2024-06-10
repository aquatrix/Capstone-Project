let placeholderDiv = document.getElementById("placeholder");
let mainDiv = document.getElementById("main");
let loginAlert = document.getElementById("heading-alert");


const carListingsContainer = document.getElementById('car-listings-container');

const logoutBtn = document.getElementById("logout-button");


firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log("User is signed in:", user.uid);
    placeholderDiv.style.display = "block";
    setTimeout(function () {
      placeholderDiv.style.display = "none";
      main.style.display = "block";
    }, 3000);
  } else {
    console.log("No user is signed in.");
    //window.location.href = "./login.html";
    setTimeout(function () {
      window.location.href = "./login.html";
    }, 3000);
    setTimeout(function () {
      console.log("Login required");
      loginAlert.textContent = "Login Required!";
      loginAlert.style.color = "red";
    }, 1000);
  }
});


function displayCarListings() {
  const carListingsRef = firebase.database().ref('carListing');
  
  carListingsRef.on('value', (snapshot) => {
    if (snapshot.exists()) {
      carListingsContainer.innerHTML = ''; // Clear any existing content
      
      snapshot.forEach((childSnapshot) => {
        const carData = childSnapshot.val();
        const carCard = createCarCard(carData);
        carListingsContainer.appendChild(carCard);
      });
    } else {
      console.log('No car listings found');
    }
  });
}



function createCarCard(carData) {
  const card = document.createElement('div');
  card.className = 'customCard';
  card.style.width = '100%';
  card.style.marginBottom = "20px"// const img = document.createElement('img');
  // img.className = 'card-img-top';
  // img.src = carData.image || 'Assets/card-display.jpg'; // Use car image or a default image
  // img.alt = 'Car image';

  // const cardBody = document.createElement('div');
  // cardBody.className = 'card-body';

  // const cardTitle = document.createElement('h5');
  // cardTitle.className = 'card-title';
  // cardTitle.textContent = carData.make + ' ' + carData.model;

  // const cardText = document.createElement('p');
  // cardText.className = 'card-text';
  // cardText.textContent = `
  //   Color: ${carData.color}
  //   Year: ${carData.year}
  //   Price: ${carData.price}
  //   Mileage: ${carData.milage}
  // `;

  // const cardLink = document.createElement('a');
  // cardLink.href = '#';
  // cardLink.className = 'btn btn-primary';
  // cardLink.textContent = 'Go somewhere';

  // cardBody.appendChild(cardTitle);
  // cardBody.appendChild(cardText);
  // cardBody.appendChild(cardLink);

  // card.appendChild(img);
  // card.appendChild(cardBody);

    card.innerHTML =`<div class="imageContainer">
                      <img src= ${carData.image} || "Assets/card-display.jpg" class="card-img-top" alt="Card image" />
                    </div>

                    <div class="card-body">
                      <h5 class="card-title" style="margin-bottom: 2%;">${carData.make}   <span style="font-weight: 400;">${carData.model} </span></h5>
                      
                      <p class="card-text">
                        This car has ${carData.color} color, ${carData.milage} milage and made in ${carData.year} <br />
                        Price: ${carData.price}
                      </p>
                      <a href="#" class="btn btn-primary">More Information</a>
                    </div>`;
            
  return card;
}

// Call the function to display car listings
displayCarListings();






let logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", function () {
  logoutButton.disabled = true;
  logoutButton.textContent = "Signing Out...";

  setTimeout(function () {
    firebase
      .auth()
      .signOut()
      .then(function () {
        console.log("User signed out.");

        setTimeout(function () {
          window.location.href = "./login.html";
        }, 3000);
      })
      .catch(function (error) {
        console.error("Sign out error:", error);
      });
  }, 3000);
});



// Logout button code
logoutBtn.addEventListener("click", function (e) {
  e.preventDefault(); // Prevent the default link action

  firebase.auth().signOut().then(() => {
    console.log("User signed out.");
    window.location.href = "./login.html"; // Redirect to login page after logout
  }).catch((error) => {
    console.error("Sign out error:", error);
  });
});

window.addEventListener('popstate', function (event) {
  if (!firebase.auth().currentUser) {
    window.location.href = "./login.html";
  }
});
