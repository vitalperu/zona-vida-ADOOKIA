// ===============================
// script.js - Zona Vida Radio
// ===============================

// ===============================
// 🔹 SEGUNDA PARRILLA VERTICAL - Botón MÁS RADIOS
// ===============================
document.addEventListener("DOMContentLoaded", function() {

  // Inicializar menú hamburguesa (Materialize)
  var sidenavs = document.querySelectorAll('.sidenav');
  if (sidenavs.length) {
    M.Sidenav.init(sidenavs);
  }

  // ----------------------------
  // Referencias del DOM
  // ----------------------------
  const btnMasRadios = document.getElementById('btnMasRadios');
  const iconoMasRadios = document.getElementById('iconoMasRadios');
  const contenedorParrillaExtra = document.getElementById('contenedorParrillaExtra');
  let visible = false;

  // Configuración inicial del contenedor
  if (contenedorParrillaExtra) {
    contenedorParrillaExtra.style.maxHeight = "0px";
    contenedorParrillaExtra.style.overflow = "hidden";
    contenedorParrillaExtra.style.transition = "max-height 0.3s ease";
  }

  // ----------------------------
  // Botón "Más Radios" - mostrar/ocultar
  // ----------------------------
  if (btnMasRadios && contenedorParrillaExtra) {
    btnMasRadios.addEventListener('click', () => {
      visible = !visible;

      // Cambiar icono y color del botón
      iconoMasRadios.textContent = visible ? 'remove' : 'add';
      btnMasRadios.style.backgroundColor = visible ? '#4CAF50' : '#FF4081';

      // Animar contenedor vertical
      if (visible) {
        contenedorParrillaExtra.style.maxHeight = contenedorParrillaExtra.scrollHeight + "px";
      } else {
        contenedorParrillaExtra.style.maxHeight = "0px";
      }
    });
  }

  // ----------------------------
  // Función para activar radio seleccionada
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
      const playBtn = document.getElementById('playBtn');
      if(playBtn){
        playBtn.classList.remove('play');
        playBtn.classList.add('pause');
      }
      const circle = document.querySelector('.circle-player');
      if(circle) circle.classList.add('playing');
    }
  }

  // ----------------------------
  // Aplicar evento click a TODAS las radios
  // ----------------------------
  document.querySelectorAll('.radio-item').forEach(item => {
    item.addEventListener('click', () => activarRadioItem(item));
  });

});
// ===============================
// 🔹 FIN SEGUNDA PARRILLA VERTICAL
// ===============================

  
// =============================
// 🌙 VISUALIZADOR SUAVE TIPO LUNA PLAYER
// =============================

function startVisualizer() {
  analyser.fftSize = 1024;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let hue = 200;

  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 🌈 Color animado
    hue = (hue + 0.5) % 360;
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, `hsl(${hue}, 100%, 60%)`);
    gradient.addColorStop(1, `hsl(${(hue + 60) % 360}, 100%, 60%)`);

    ctx.lineWidth = 2;
    ctx.strokeStyle = gradient;
    ctx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 255;
      const y = canvas.height / 2 - (v * canvas.height) / 2.2 * Math.sin(i * 0.1);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }

  draw();
}

// =============================
// 🌙 FIN VISUALIZADOR
// =============================




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
