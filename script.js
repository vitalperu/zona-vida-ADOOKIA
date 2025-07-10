document.addEventListener('DOMContentLoaded', function() {
  // Inicializa menú hamburguesa
  var elems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems);

  // Inicializa tooltips para redes sociales
  var tooltips = document.querySelectorAll('.tooltipped');
  M.Tooltip.init(tooltips);

  // Reproductor audio
  const player = document.getElementById('player');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playPauseIcon = document.getElementById('playPauseIcon');
  const volumeBar = document.getElementById('volumeBar');
  const volIcon = document.getElementById('volIcon');
  const volValue = document.getElementById('volValue');

  playPauseBtn.addEventListener('click', () => {
    if (player.paused) {
      player.play();
      playPauseIcon.textContent = 'pause';
    } else {
      player.pause();
      playPauseIcon.textContent = 'play_arrow';
    }
  });

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

  // PWA instalar botón
  let deferredPrompt;
  const installBtn = document.getElementById('installBtn');
  installBtn.style.display = 'none'; // Oculta el botón inicialmente

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'inline-flex';
    console.log('Evento beforeinstallprompt disparado');
  });

  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) {
      alert('Para instalar, usa Chrome en Android o PC.');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      installBtn.textContent = '¡Instalada!';
    }
    deferredPrompt = null;
    installBtn.style.display = 'none';
  });
});
