const users = {
    ERON: { password: "0022", score: 0 },
    LAWIN: { password: "0023", score: 0 }
};

let currentUser = "";

// LOGIN
function login() {
    const u = document.getElementById("username").value.toUpperCase();
    const p = document.getElementById("password").value;

    if (users[u] && users[u].password === p) {
        currentUser = u;
        loadDashboard();
    } else {
        document.getElementById("error").innerText = "Invalid login!";
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
}

// USER CARD
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
      <div class="user-name">${user}</div>
      <div class="score" id="score-${user}">${users[user].score}</div>
      ${controls}
    </div>
  `;
}

// SCORE UPDATE
function updateScore(user, value) {
    if (user === currentUser) {
        users[user].score += value;
        if (users[user].score < 0) users[user].score = 0;
        document.getElementById(`score-${user}`).innerText = users[user].score;
    }
}