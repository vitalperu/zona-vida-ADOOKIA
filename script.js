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
// 🔊 INICIO DE NUEVO REPRODUCTOR
// =============================

// 🎧 Control básico del reproductor
const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const volumeControl = document.getElementById("volumeControl");
const volumePercent = document.getElementById("volumePercent");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

let isPlaying = false;
let animationId = null;

// 🔄 Ajustar tamaño del canvas
function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ▶️ Play/Pause
playBtn.addEventListener("click", () => {
  if (!isPlaying) {
    audio.play();
  } else {
    audio.pause();
  }
});

audio.addEventListener("play", () => {
  isPlaying = true;
  playBtn.classList.add("playing");

  // 🛑 Cancelar animaciones previas
  if (animationId) cancelAnimationFrame(animationId);

  animateVisualizer();
});

audio.addEventListener("pause", () => {
  isPlaying = false;
  playBtn.classList.remove("playing");

  if (animationId) cancelAnimationFrame(animationId);
  drawStaticVisualizer();
});

// 🔊 Control de volumen
volumeControl.addEventListener("input", () => {
  audio.volume = volumeControl.value / 100;
  volumePercent.textContent = `${volumeControl.value}%`;
});

// 💫 Efecto visual (pulso neón animado)
let pulse = 0;
function animateVisualizer() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const centerY = canvas.height / 2;
  const barCount = 50;
  const barWidth = canvas.width / barCount;

  pulse += 0.05;

  for (let i = 0; i < barCount; i++) {
    const height = Math.sin(pulse + i * 0.5) * 20 + 40;
    const x = i * barWidth;
    const color = `hsl(${(pulse * 50 + i * 10) % 360}, 100%, 60%)`;
    ctx.fillStyle = color;
    ctx.fillRect(x, centerY - height / 2, barWidth - 2, height);
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
  }

  animationId = requestAnimationFrame(animateVisualizer);
}

// 🎵 Visual fijo cuando está en pausa
function drawStaticVisualizer() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const centerY = canvas.height / 2;
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillRect(0, centerY - 2, canvas.width, 4);
}

// Dibuja una línea inicial
drawStaticVisualizer();

// =============================
// 🔊 FIN DE NUEVO REPRODUCTOR
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
