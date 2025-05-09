const auth = firebase.auth();
const db = firebase.database();

const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorText = document.getElementById("login-error");
const greeting = document.getElementById("greeting");

const difficultySelect = document.getElementById("difficulty");
const progressContainer = document.getElementById("progress-container");
const loadingIndicator = document.getElementById("loading");
const noProgressMessage = document.getElementById("no-progress");

logoutBtn.style.display = "none";
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && loginSection.style.display !== "none") {
    loginBtn.click();
  }
});

// Login functionality
loginBtn.addEventListener("click", () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  errorText.textContent = "";

  if (!email || !password) {
    errorText.textContent = "Please enter email and password.";
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      emailInput.value = "";
      passwordInput.value = "";
      showDashboard();
    })
    .catch(error => {
      errorText.textContent = error.message;
    });
});


logoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    loginSection.style.display = "block";
    dashboardSection.style.display = "none";
    logoutBtn.style.display = "none";
    greeting.textContent = '';
    progressContainer.innerHTML = '';
    difficultySelect.selectedIndex = 0;
    noProgressMessage.classList.add("hidden");
  });
});

auth.onAuthStateChanged(user => {
  if (user) {
    showDashboard();
  }
});

// Show dashboard and greet user
function showDashboard() {
  const user = auth.currentUser;
  if (user) {
    loginSection.style.display = "none";
    dashboardSection.style.display = "block";
    logoutBtn.style.display = "block";

    // Get username from database
    const userRef = db.ref(`users/${user.uid}`);
    userRef.once("value").then(snapshot => {
      const userData = snapshot.val();
      if (userData && userData.username) {
        greeting.textContent = `Welcome, ${userData.username}`;
      } else {
        greeting.textContent = `Welcome!`;
      }
    });

    loginSection.style.display = "none";
    dashboardSection.style.display = "block";
    logoutBtn.style.display = "block";
    progressContainer.innerHTML = '';
    difficultySelect.selectedIndex = 0;
    noProgressMessage.classList.add("hidden");
  }
}

// Handle difficulty change
difficultySelect.addEventListener("change", () => {
  const difficulty = difficultySelect.value;
  const user = auth.currentUser;
  if (!difficulty || !user) return;
  
  const defaultOption = difficultySelect.querySelector("option[value='']");
  if (defaultOption) defaultOption.style.display = "none";

  progressContainer.innerHTML = "";
  loadingIndicator.classList.remove("hidden");
  noProgressMessage.classList.add("hidden");

  const userRef = db.ref(`users/${user.uid}/progress/${difficulty}`);
  userRef.once("value").then(snapshot => {
    loadingIndicator.classList.add("hidden");
    const data = snapshot.val();

    if (!data) {
      noProgressMessage.classList.remove("hidden");
      return;
    }

    Object.entries(data).forEach(([level, details]) => {
      const card = document.createElement("div");
      card.className = "card";

      let choicesHtml = "N/A";
      if (details.choices && typeof details.choices === "object") {
        choicesHtml = "<ul class='choice-list'>";
        Object.entries(details.choices).forEach(([key, value]) => {
          choicesHtml += `<li><strong>${key}:</strong> ${value}</li>`;
        });
        choicesHtml += "</ul>";
      }

      card.innerHTML = `
        <strong>Level:</strong> ${level}<br/>
        <strong>Score:</strong> ${details.score || 0}<br/>
        <strong>Choices:</strong> ${choicesHtml}<br/>
        <strong>Completed:</strong> ${details.completed ? "Yes" : "No"}
      `;

      progressContainer.appendChild(card);
    });
  });
});
