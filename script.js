// ===============================
// script.js - Zona Vida Radio
// ===============================

// Esperar a que el DOM esté cargado
document.addEventListener("DOMContentLoaded", function() {

  // ----------------------------
  // Inicializar menú hamburguesa (Materialize)
  // ----------------------------
  var sidenavs = document.querySelectorAll('.sidenav');
  if (sidenavs.length) {
    M.Sidenav.init(sidenavs);
  }

  // ----------------------------
  // Botón Más Radios: alternar parrillas
  // ----------------------------
  const btnMasRadios = document.getElementById('btnMasRadios');
  const iconoMasRadios = document.getElementById('iconoMasRadios');
  const parrillaExtra = document.getElementById('parrillaExtra');
  const parrillaPrincipal = document.getElementById('parrillaPrincipal');
  let visible = false;

  if (btnMasRadios && iconoMasRadios && parrillaExtra && parrillaPrincipal) {
    btnMasRadios.addEventListener('click', () => {
      visible = !visible;
      parrillaExtra.classList.toggle('oculto');       // mostrar/ocultar segunda parrilla
      parrillaPrincipal.classList.toggle('oculto');   // alternar primera parrilla
      iconoMasRadios.textContent = visible ? 'remove' : 'add';
      btnMasRadios.style.backgroundColor = visible ? '#4CAF50' : '#FF4081';
    });
  }

  // ----------------------------
  // Función para activar radio
  // ----------------------------
  function activarRadioItem(item) {
    document.querySelectorAll('.radio-item').forEach(i => i.classList.remove('selected'));
    item.classList.add('selected');

    const logo = document.getElementById('logoRadioActual');
    const player = document.getElementById('audio');
    const radioUrl = item.getAttribute('data-radio');
    const logoUrl = item.getAttribute('data-logo');

    if (logo && logoUrl) logo.src = logoUrl;
    if (player && radioUrl) {
      player.src = radioUrl;
      player.load();
      player.play();
      document.getElementById('playBtn').classList.remove('play');
      document.getElementById('playBtn').classList.add('pause');
      document.querySelector('.circle-player').classList.add('playing');
    }
  }

  // ----------------------------
  // Aplicar evento click a TODAS las radios
  // ----------------------------
  document.querySelectorAll('.radio-item').forEach(function(item) {
    item.addEventListener('click', function() {
      activarRadioItem(item);
    });
  });

});
  




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
