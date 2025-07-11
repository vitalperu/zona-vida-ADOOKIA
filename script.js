// ========== INICIALIZACIÓN DE COMPONENTES MATERIALIZE ==========
document.addEventListener('DOMContentLoaded', function () {
  // Inicializa menú hamburguesa
  var elems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems);

  // Inicializa tooltips para redes sociales
  var tooltips = document.querySelectorAll('.tooltipped');
  M.Tooltip.init(tooltips);
});

// ========== REPRODUCTOR DE AUDIO ==========
const player = document.getElementById('player');
const playPauseBtn = document.getElementById('playPauseBtn');
const playPauseIcon = document.getElementById('playPauseIcon');
const volumeBar = document.getElementById('volumeBar');
const volIcon = document.getElementById('volIcon');
const volValue = document.getElementById('volValue');

// Play / Pause
playPauseBtn.addEventListener('click', () => {
  if (player.paused) {
    player.play();
    playPauseIcon.textContent = 'pause';
  } else {
    player.pause();
    playPauseIcon.textContent = 'play_arrow';
  }
});

// Control de Volumen
volumeBar.addEventListener('input', () => {
  player.volume = volumeBar.value;
  volValue.textContent = Math.round(volumeBar.value * 100) + '%';

  if (volumeBar.value == 0) {
    volIcon.innerHTML = '<i class="material-icons">volume_off</i>';
  } else if (volumeBar.value <= 0.5) {
    volIcon.innerHTML = '<i class="material-icons">volume_down</i>';
  } else {
    volIcon.innerHTML = '<i class="material-icons">volume_up</i>';
  }
});

// Mute / Volumen Máximo con Click en Icono
volIcon.addEventListener('click', () => {
  if (player.volume > 0) {
    player.volume = 0;
    volumeBar.value = 0;
    volIcon.innerHTML = '<i class="material-icons">volume_off</i>';
    volValue.textContent = '0%';
  } else {
    player.volume = 1;
    volumeBar.value = 1;
    volIcon.innerHTML = '<i class="material-icons">volume_up</i>';
    volValue.textContent = '100%';
  }
});

// ========== INSTALAR PWA ==========
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'flex';
});

installBtn.addEventListener('click', () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA instalada');
      }
      deferredPrompt = null;
    });
  }
});
