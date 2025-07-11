document.addEventListener('DOMContentLoaded', function () {
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

  // Control de volumen
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

  // Integrar Media Session API
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: 'Zona Vida Radio',
      artist: 'La música que te inspira',
      album: 'Zona Vida',
      artwork: [
        { src: './img/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: './img/icon-512x512.png', sizes: '512x512', type: 'image/png' }
      ]
    });

    // Controles desde la barra de bloqueo
    navigator.mediaSession.setActionHandler('play', () => {
      player.play();
      playPauseIcon.textContent = 'pause';
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      player.pause();
      playPauseIcon.textContent = 'play_arrow';
    });

    navigator.mediaSession.setActionHandler('stop', () => {
      player.pause();
      playPauseIcon.textContent = 'play_arrow';
    });
  }
});

let wakeLock = null;

async function requestWakeLock() {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', () => {
      console.log('Wake Lock liberado');
    });
    console.log('Wake Lock activado');
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
}

// Solicitar wake lock al reproducir audio
player.addEventListener('play', () => {
  if ('wakeLock' in navigator) {
    requestWakeLock();
  }
});

// Liberarlo al pausar
player.addEventListener('pause', () => {
  if (wakeLock !== null) {
    wakeLock.release();
    wakeLock = null;
  }
});

