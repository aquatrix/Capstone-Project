if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js", { scope: "/" })
    .then((registration) => {
      console.log("Register Success:", registration);
    })
    .catch((error) => {
      console.log("Register Failed:", error);
    });
} else {
  console.log("Service Workers are not supported");
}

let navbar = document.getElementById("navbar");
let navbarNav = document.getElementById("navbarNav");
let navbarBrand = document.getElementById("navbar-brand");
let menuLink = document.getElementById("menu-link");

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
