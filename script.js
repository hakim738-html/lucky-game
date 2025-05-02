const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
let names = [];
let currentAngle = 0;
let originalNames = [];
let winnerList = [];

function initWheel() {
  const input = document.getElementById("namesInput").value;
  names = input.split(".").map(n => n.trim()).filter(n => n !== "");
  originalNames = [...names];
  winnerList = [];
  document.getElementById("winnerList").innerHTML = "";
  drawWheel();
}

function drawWheel() {
  const total = names.length;
  const angle = 2 * Math.PI / total;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < total; i++) {
    ctx.fillStyle = `hsl(${i * 360 / total}, 85%, 65%)`;
    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.arc(150, 150, 150, i * angle, (i + 1) * angle);
    ctx.lineTo(150, 150);
    ctx.fill();

    ctx.save();
    ctx.translate(150, 150);
    ctx.rotate(i * angle + angle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px Tahoma";
    ctx.fillText(names[i], 130, 0);
    ctx.restore();
  }

  canvas.style.transition = "none";
  canvas.style.transform = `rotate(0deg)`;
}

function spinOnce(callback) {
  if (names.length === 0) return;

  const index = Math.floor(Math.random() * names.length);
  const anglePerSegment = 360 / names.length;
  const stopAngle = 360 - (index * anglePerSegment) - anglePerSegment / 2;
  currentAngle += 1440 + stopAngle;

  canvas.style.transition = "transform 3s ease-out";
  canvas.style.transform = `rotate(${currentAngle}deg)`;

  setTimeout(() => {
    const winner = names.splice(index, 1)[0];
    winnerList.push(winner);
    updateWinners();
    drawWheel();
    if (callback) callback();
  }, 3000);
}

function startSpin() {
  if (names.length < 1) {
    alert("أدخل أسماء أولاً!");
    return;
  }

  function spinLoop() {
    if (names.length >= 2) {
      spinOnce(() => {
        spinOnce(() => {
          setTimeout(spinLoop, 500);
        });
      });
    } else if (names.length === 1) {
      spinOnce();
    }
  }

  spinLoop();
}

function updateWinners() {
  const ul = document.getElementById("winnerList");
  ul.innerHTML = "";
  for (let i = 0; i < winnerList.length; i += 2) {
    const pair = winnerList.slice(i, i + 2).join(" VS ");
    const li = document.createElement("li");
    li.textContent = pair;
    ul.appendChild(li);
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

function resetGame() {
  names = [...originalNames];
  winnerList = [];
  document.getElementById("winnerList").innerHTML = "";
  currentAngle = 0;
  canvas.style.transform = `rotate(0deg)`;
  drawWheel();
}