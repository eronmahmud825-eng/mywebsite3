// 🔥 FIREBASE IMPORTS (MODULAR v9)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  increment
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// 🔥 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCfVDdwgkMkhdd-1TIQJbd3M_UWvNZQw8k",
  authDomain: "score-dashboard-304f0.firebaseapp.com",
  projectId: "score-dashboard-304f0",
  storageBucket: "score-dashboard-304f0.appspot.com",
  messagingSenderId: "405203630122",
  appId: "1:405203630122:web:5521fd42b703af4e5e2b53"
};

// 🔥 INIT FIREBASE
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// USERS (LOCAL AUTH)
const users = {
  ERON: "0022",
  LAWIN: "0023"
};

let currentUser = "";
let busy = false; // ⛔ stop double tap

// LOGIN
document.getElementById("loginBtn").addEventListener("click", login);

function login() {
  const u = document.getElementById("username").value.toUpperCase();
  const p = document.getElementById("password").value;

  if (users[u] && users[u] === p) {
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
      ${card("ERON")}
      ${card("LAWIN")}
    </div>
  `;

  listenScore("ERON");
  listenScore("LAWIN");
}

// USER CARD
function card(user) {
  const controls =
    user === currentUser
      ? `
    <div class="controls">
      <button class="plus" id="plus-${user}" type="button">+</button>
      <button class="minus" id="minus-${user}" type="button">−</button>
    </div>`
      : "";

  return `
    <div class="user-card">
      <div class="user-name">${user}</div>
      <div class="score" id="score-${user}">0</div>
      ${controls}
    </div>
  `;
}

// REALTIME LISTENER
function listenScore(user) {
  const ref = doc(db, "scores", user);

  onSnapshot(ref, snap => {
    if (snap.exists()) {
      document.getElementById(`score-${user}`).innerText = snap.data().value;
    }
  });

  if (user === currentUser) {
    document.getElementById(`plus-${user}`).onclick = () => change(user, 1);
    document.getElementById(`minus-${user}`).onclick = () => change(user, -1);
  }
}

// UPDATE SCORE (SAFE)
async function change(user, val) {
  if (busy) return;
  busy = true;

  try {
    await updateDoc(doc(db, "scores", user), {
      value: increment(val)
    });
  } catch {
    alert("Connection problem");
  }

  busy = false;
}



