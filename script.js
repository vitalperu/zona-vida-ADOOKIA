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

        // Reconectar AudioContext al nuevo stream
        if (audioCtx && analyser) {
            try {
                const newStream = player.captureStream ? player.captureStream() : player.mozCaptureStream();
                if (newStream) {
                    const newSource = audioCtx.createMediaStreamSource(newStream);
                    newSource.connect(analyser);
                }
            } catch (e) {
                console.error("Error al reconectar visualizador:", e);
            }
        }

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
// 🔊 NUEVO REPRODUCTOR - AUDIO DIRECTO CON VISUALIZADOR
// =============================
const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const volumeControl = document.getElementById("volumeControl");
const volumePercent = document.getElementById("volumePercent");
const logoRadioActual = document.getElementById("logoRadioActual");
const visualizer = document.getElementById("visualizer");
const ctx = visualizer.getContext("2d");

let isPlaying = false;
let currentStream = audio.src;

// 🎚 Control de volumen (sin restricción)
volumeControl.addEventListener("input", () => {
  const volume = volumeControl.value / 100;
  audio.volume = volume;
  volumePercent.textContent = `${volumeControl.value}%`;
});

// ▶ Control Play/Pause
playBtn.addEventListener("click", () => {
  if (!isPlaying) {
    audio.play().catch(console.error);
  } else {
    audio.pause();
  }
});

audio.addEventListener("play", () => {
  isPlaying = true;
  playBtn.classList.remove("play");
  playBtn.classList.add("pause");
  document.getElementById("player-visual").classList.add("playing");
});

audio.addEventListener("pause", () => {
  isPlaying = false;
  playBtn.classList.remove("pause");
  playBtn.classList.add("play");
  document.getElementById("player-visual").classList.remove("playing");
});

// 🎧 Cambio de radio al hacer clic
document.querySelectorAll(".radio-item").forEach(item => {
  item.addEventListener("click", () => {
    const newStream = item.getAttribute("data-radio");
    const newLogo = item.getAttribute("data-logo");

    document.querySelectorAll(".radio-item").forEach(el => el.classList.remove("selected"));
    item.classList.add("selected");

    if (newStream !== currentStream) {
      currentStream = newStream;
      audio.src = newStream;
      logoRadioActual.src = newLogo;
      audio.play().catch(console.error);
    }
  });
});

// 🎵 Espectro visual básico (no afecta volumen real)
const analyserContext = new (window.AudioContext || window.webkitAudioContext)();
const source = analyserContext.createMediaElementSource(audio);
const analyser = analyserContext.createAnalyser();
source.connect(analyser);
analyser.connect(analyserContext.destination);

analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function drawVisualizer() {
  requestAnimationFrame(drawVisualizer);

  analyser.getByteFrequencyData(dataArray);
  ctx.clearRect(0, 0, visualizer.width, visualizer.height);

  const barWidth = (visualizer.width / bufferLength) * 2.5;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] / 2;
    ctx.fillStyle = `rgba(0, 255, 255, ${barHeight / 255})`;
    ctx.fillRect(x, visualizer.height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
}

// Ajustar canvas al tamaño del contenedor
function resizeCanvas() {
  visualizer.width = visualizer.clientWidth;
  visualizer.height = visualizer.clientHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawVisualizer();

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
