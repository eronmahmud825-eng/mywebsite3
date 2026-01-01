// 🔥 FIREBASE IMPORTS (MODULAR v9)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// 🔥 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCfVDdwgkMkhdd-1TIQJbd3M_UWvNZQw8k",
  authDomain: "score-dashboard-304f0.firebaseapp.com",
  projectId: "score-dashboard-304f0",
  storageBucket: "score-dashboard-304f0.firebasestorage.app",
  messagingSenderId: "405203630122",
  appId: "1:405203630122:web:5521fd42b703af4e5e2b53"
};

// 🔥 INIT FIREBASE
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// USERS
const users = {
  ERON: { password: "0022", score: 0 },
  LAWIN: { password: "0023", score: 0 }
};

let currentUser = "";
let saving = false; // 🔴 IMPORTANT FLAG

// LOGIN
document.getElementById("loginBtn").addEventListener("click", login);

function login() {
  const u = document.getElementById("username").value.toUpperCase();
  const p = document.getElementById("password").value;

  if (users[u] && users[u].password === p) {
    currentUser = u;
    loadDashboard();
  } else {
    document.getElementById("error").innerText = "Wrong login";
  }
}

// DASHBOARD
function loadDashboard() {
  document.body.innerHTML = `
    <div class="dashboard">
      <h2>Welcome ${currentUser}</h2>
      ${createCard("ERON")}
      ${createCard("LAWIN")}
    </div>
  `;
  loadScores();
}

// CARD
function createCard(user) {
  let controls = "";

  if (user === currentUser) {
    controls = `
      <div class="controls">
        <button class="plus" onclick="updateScore('${user}',1)">+</button>
        <button class="minus" onclick="updateScore('${user}',-1)">−</button>
      </div>
    `;
  }

  return `
    <div class="user-card">
      <h3>${user}</h3>
      <div class="score" id="score-${user}">0</div>
      ${controls}
    </div>
  `;
}

// LOAD SCORES
async function loadScores() {
  for (let user of ["ERON", "LAWIN"]) {
    const ref = doc(db, "scores", user);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      users[user].score = snap.data().value;
      document.getElementById(`score-${user}`).innerText = users[user].score;
    }
  }
}

// 🔥 UPDATE SCORE (MOBILE + GITHUB SAFE)
window.updateScore = async function (user, change) {
  if (user !== currentUser) return;
  if (saving) return; // stop double tap

  const newScore = users[user].score + change;
  if (newScore < 0) return;

  saving = true;

  // disable all buttons
  document.querySelectorAll("button").forEach(b => b.disabled = true);

  try {
    // 🔥 WAIT UNTIL FIRESTORE CONFIRMS SAVE
    await setDoc(doc(db, "scores", user), {
      value: newScore
    });

    // update UI AFTER save
    users[user].score = newScore;
    document.getElementById(`score-${user}`).innerText = newScore;

  } catch (error) {
    alert("Save failed. Check internet connection.");
  }

  // enable buttons
  document.querySelectorAll("button").forEach(b => b.disabled = false);
  saving = false;
};


