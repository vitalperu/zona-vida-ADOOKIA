const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const volumeControl = document.getElementById("volumeControl");
const volumePercent = document.getElementById("volumePercent");
const muteIcon = document.getElementById("muteIcon");
const soundIcon = document.getElementById("soundIcon");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  canvas.width = canvas.clientWidth * dpr;
  canvas.height = canvas.clientHeight * dpr;
  ctx.scale(dpr, dpr);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Web Audio API
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioCtx.destination);
analyser.fftSize = 2048;
const bufferLength = analyser.fftSize;
const dataArray = new Uint8Array(bufferLength);

// Dibujar onda
function draw() {
  requestAnimationFrame(draw);
  analyser.getByteTimeDomainData(dataArray);

  // limpiar canvas
  ctx.fillStyle = "rgba(10,10,26,1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ✅ si está en pausa, muteado o sin volumen, no dibujar nada
  if (audio.paused || audio.muted || audio.volume === 0) {
    return;
  }

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, "rgba(0,229,255,0)");
  gradient.addColorStop(0.05, "rgba(0,229,255,1)");
  gradient.addColorStop(0.95, "rgba(0,229,255,1)");
  gradient.addColorStop(1, "rgba(0,229,255,0)");

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 1;

  ctx.beginPath();
  const step = 8;
  const sliceWidth = canvas.width / (bufferLength / step);
  let x = 0;

  for (let i = 0; i < bufferLength; i += step) {
    const v = dataArray[i] / 128.0;
    const y = (v * canvas.height / 2) + 45;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
    x += sliceWidth;
  }

  ctx.stroke();
}

draw();


// Play / Pause
playBtn.addEventListener("click", async () => {
  if (audioCtx.state === "suspended") {
    await audioCtx.resume(); // 🔹 reanuda el contexto al primer click
  }

  if (audio.paused) {
    audio.play();
    playBtn.classList.remove("play");
    playBtn.classList.add("pause");
  } else {
    audio.pause();
    playBtn.classList.remove("pause");
    playBtn.classList.add("play");
  }
});

// Volumen dinámico
volumeControl.addEventListener("input", () => {
  const value = volumeControl.value;
  audio.volume = value / 100;
  volumePercent.textContent = value + "%";

  // actualizar color del slider
  volumeControl.style.background = `linear-gradient(to right, #00e5ff ${value}%, #444 ${value}%)`;
});

// Mute / Unmute
muteIcon.addEventListener("click", () => {
  audio.muted = true;
  muteIcon.classList.add("active");   // 🔴 se marca como muteado
  soundIcon.classList.remove("active");
});

soundIcon.addEventListener("click", () => {
  audio.muted = false;
  muteIcon.classList.remove("active"); // 🔴 se quita el rojo
  soundIcon.classList.add("active");
});
