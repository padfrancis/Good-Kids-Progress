const auth = firebase.auth();
const db = firebase.database();

const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorText = document.getElementById("login-error");
const userEmailDisplay = document.getElementById("user-email");

const difficultySelect = document.getElementById("difficulty");
const progressContainer = document.getElementById("progress-container");
const loadingIndicator = document.getElementById("loading");
const noProgressMessage = document.getElementById("no-progress");

loginBtn.addEventListener("click", () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  errorText.textContent = "";

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
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
  });
});

auth.onAuthStateChanged(user => {
  if (user) {
    showDashboard();
  }
});

function showDashboard() {
  const user = auth.currentUser;
  if (user) {
    loginSection.style.display = "none";
    dashboardSection.style.display = "block";
    logoutBtn.style.display = "block";
    userEmailDisplay.textContent = `Logged in as: ${user.email}`;
  }
}

difficultySelect.addEventListener("change", () => {
  const difficulty = difficultySelect.value;
  const user = auth.currentUser;
  if (!difficulty || !user) return;

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
      card.innerHTML = `
        <strong>Level:</strong> ${level}<br/>
        <strong>Score:</strong> ${details.score || 0}<br/>
        <strong>Choices:</strong> ${details.choices || "N/A"}<br/>
        <strong>Completed:</strong> ${details.completed ? "Yes" : "No"}
      `;
      progressContainer.appendChild(card);
    });
  });
});
