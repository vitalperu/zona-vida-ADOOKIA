// script.js - Zona Vida Radio

// Selección de radios y cambio de logo/stream
document.querySelectorAll('.radio-item').forEach(function(item) {
  item.addEventListener('click', function() {
    document.querySelectorAll('.radio-item').forEach(i => i.classList.remove('selected'));
    item.classList.add('selected');
    const logo = document.getElementById('logoRadioActual');
    const player = document.getElementById('player');
    const radioUrl = item.getAttribute('data-radio');
    const logoUrl = item.getAttribute('data-logo');

    if (logo && logoUrl) logo.src = logoUrl;
    if (player && radioUrl) {
      player.src = radioUrl;
      player.load();
      player.play();
      document.getElementById('playPauseIcon').textContent = 'pause';
      document.querySelector('.circle-player').classList.add('playing');
    }
  });
});

// Botón Play/Pause
const playPauseBtn = document.getElementById('playPauseBtn');
const playPauseIcon = document.getElementById('playPauseIcon');
const player = document.getElementById('player');

if (playPauseBtn && playPauseIcon && player) {
  playPauseBtn.addEventListener('click', function() {
    if (player.paused) {
      player.play();
      playPauseIcon.textContent = 'pause';
      document.querySelector('.circle-player').classList.add('playing');
    } else {
      player.pause();
      playPauseIcon.textContent = 'play_arrow';
      document.querySelector('.circle-player').classList.remove('playing');
    }
  });
}

// Control de volumen y mute
const volumeBar = document.getElementById('volumeBar');
const volIcon = document.getElementById('muteIcon');
const volValue = document.getElementById('volValue');

if (volumeBar && volIcon && volValue) {
  volIcon.addEventListener('click', () => {
    player.muted = !player.muted;
    if (player.muted) {
      volIcon.textContent = 'volume_off';
      volumeBar.value = 0;
    } else {
      volIcon.textContent = 'volume_up';
      volumeBar.value = player.volume || 1;
    }
    volValue.textContent = Math.round(volumeBar.value * 100) + '%';
  });

  volumeBar.addEventListener('input', () => {
    player.volume = volumeBar.value;
    if (player.volume == 0) {
      player.muted = true;
      volIcon.textContent = 'volume_off';
    } else {
      player.muted = false;
      volIcon.textContent = 'volume_up';
    }
    volValue.textContent = Math.round(volumeBar.value * 100) + '%';
  });
}

// Registro de Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registrado con éxito:', registration.scope);
      })
      .catch(error => {
        console.log('Error al registrar Service Worker:', error);
      });
  });
}

// Botón de instalación PWA
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

if (installBtn) {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'inline-block';
  });

  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('App instalada correctamente');
        installBtn.textContent = '¡Instalada!';
      }
      deferredPrompt = null;
    } else {
      alert("Para instalar, usa Chrome, Brave o Edge.");
    }
  });
}

// Compartir App
function shareApp() {
  if (navigator.share) {
    navigator.share({
      title: 'Zona Vida Radio',
      text: 'Escucha Zona Vida Radio en tu dispositivo.',
      url: window.location.href
    }).then(() => {
      console.log('Compartido con éxito');
    }).catch((error) => {
      console.error('Error al compartir:', error);
    });
  } else {
    alert("Tu navegador no soporta la función de compartir.");
  }
}

// Cerrar App
function closeApp() {
  if (confirm("¿Quieres salir de la app?")) {
    window.close();
  }
}

// Inicializar menú hamburguesa (Materialize)
document.addEventListener('DOMContentLoaded', function() {
  var sidenavs = document.querySelectorAll('.sidenav');
  if (sidenavs.length) {
    M.Sidenav.init(sidenavs);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const btnMasRadios = document.getElementById("btnMasRadios");
  const parrillaExtra = document.getElementById("parrillaExtra");

  btnMasRadios.addEventListener("click", function () {
    parrillaExtra.classList.toggle("oculto");
  });
});
