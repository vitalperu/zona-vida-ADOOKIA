const audio = new Audio("https://radio.zonavidahd.online/listen/hd/radio.mp3");
const playBtn = document.getElementById("playPauseBtn");
const volumeBar = document.getElementById("volumeBar");
const songTitle = document.getElementById("songTitle");
const cover = document.getElementById("cover");
const logoContainer = document.querySelector(".player-logo");

let isPlaying = false;

// Play / Pause
playBtn.addEventListener("click", () => {
  if (!isPlaying) {
    audio.play();
    isPlaying = true;
    playBtn.textContent = "⏸";
    logoContainer.classList.add("playing");
  } else {
    audio.pause();
    isPlaying = false;
    playBtn.textContent = "▶";
    logoContainer.classList.remove("playing");
  }
});

// Volumen
volumeBar.addEventListener("input", () => {
  audio.volume = volumeBar.value;
});

// Cambiar radio desde parrilla
document.querySelectorAll(".radio-item").forEach(item => {
  item.addEventListener("click", () => {
    let stream = item.getAttribute("data-stream");
    audio.src = stream;
    audio.play();
    isPlaying = true;
    playBtn.textContent = "⏸";
    logoContainer.classList.add("playing");
    songTitle.textContent = item.querySelector("p").textContent;
  });
});

// TODO: Aquí podemos integrar metadata del stream si tu servidor lo permite
songTitle.textContent = "Zona Vida Radio";
