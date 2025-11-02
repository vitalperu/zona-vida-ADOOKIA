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
// Función para activar radio seleccionada con visualizador
// ----------------------------
function activarRadioItem(item) {
  document.querySelectorAll('.radio-item').forEach(i => i.classList.remove('selected'));
  item.classList.add('selected');

  const logo = document.getElementById('logoRadioActual');
  const radioUrl = item.getAttribute('data-radio');
  const logoUrl = item.getAttribute('data-logo');

  if (logo && logoUrl) logo.src = logoUrl;
  if (audio && radioUrl) {
    audio.src = radioUrl;
    audio.load();
    audio.play();

    const playBtn = document.getElementById('playBtn');
    if (playBtn) {
      playBtn.classList.remove('play');
      playBtn.classList.add('pause');
    }

    const circle = document.querySelector('.circle-player');
    if (circle) circle.classList.add('playing');

    // 🔹 Reconectar audio al visualizador para que siga funcionando
    if (audioCtx && analyser) {
      try {
        analyser.disconnect(); // desconectar conexiones anteriores
      } catch(e) {}

      let newSource = audioCtx.createMediaElementSource(audio);
      newSource.connect(analyser);
      analyser.connect(audioCtx.destination);
    }
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
// 🔊 NUEVO REPRODUCTOR + VISUALIZADOR NEÓN
// =============================

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const muteIcon = document.getElementById("muteIcon");
const soundIcon = document.getElementById("soundIcon");
const volumeSlider = document.getElementById("volumeControl");
const volumePercent = document.getElementById("volumePercent");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");
const logoCentral = document.getElementById("logoRadioActual");

let isPlaying = false;
let audioCtx = null;
let analyser = null;
let sourceNode = null;
let previousHeights = [];

// 🎧 Volumen inicial 95%
audio.volume = 0.95;
volumeSlider.value = 95;
volumePercent.textContent = "95%";
volumeSlider.style.background = `linear-gradient(to right, #00e5ff 95%, #444 95%)`;

// =============================
// Inicialización AudioContext y Analizador
// =============================
function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;

        sourceNode = audioCtx.createMediaElementSource(audio);
        sourceNode.connect(analyser);
        analyser.connect(audioCtx.destination);

        previousHeights = new Array(analyser.frequencyBinCount).fill(0);
        startVisualizer();
    }
}

// =============================
// Play / Pause
// =============================
playBtn.addEventListener("click", async () => {
    if (!isPlaying) {
        await audio.play();
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        } else {
            initAudioContext();
        }
        playBtn.classList.remove("play");
        playBtn.classList.add("pause");
        isPlaying = true;
    } else {
        audio.pause();
        playBtn.classList.remove("pause");
        playBtn.classList.add("play");
        isPlaying = false;
    }
});

// =============================
// Mute / Unmute
// =============================
muteIcon.addEventListener("click", () => {
    audio.muted = true;
    muteIcon.classList.add("active");
    soundIcon.classList.remove("active");
});

soundIcon.addEventListener("click", () => {
    audio.muted = false;
    muteIcon.classList.remove("active");
    soundIcon.classList.add("active");
});

// =============================
// Control de Volumen
// =============================
volumeSlider.addEventListener("input", (e) => {
    const value = e.target.value;
    audio.volume = value / 100;
    volumePercent.textContent = `${value}%`;
    volumeSlider.style.background = `linear-gradient(to right, #00e5ff ${value}%, #444 ${value}%)`;
});

// =============================
// Activar Radio
// =============================
function activarRadioItem(item) {
    document.querySelectorAll('.radio-item').forEach(i => i.classList.remove('selected'));
    item.classList.add('selected');

    const radioUrl = item.getAttribute('data-radio');
    const logoUrl = item.getAttribute('data-logo');

    if (logoUrl) logoCentral.src = logoUrl;
    if (radioUrl) {
        audio.src = radioUrl;
        audio.load();

        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        } else {
            initAudioContext();
        }

        audio.play();
        playBtn.classList.remove("play");
        playBtn.classList.add("pause");
    }
}

// =============================
// Aplicar evento click a TODAS las radios
// =============================
document.querySelectorAll('.radio-item').forEach(item => {
    item.addEventListener('click', () => activarRadioItem(item));
});

// =============================
// Visualizador tipo barras neón
// =============================
function startVisualizer() {
    const bufferLength = analyser.frequencyBinCount;
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function draw() {
        requestAnimationFrame(draw);
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 1; // barras delgadas
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            // suavizado lento para parpadeo
            previousHeights[i] = previousHeights[i] * 0.8 + dataArray[i] * 0.2;
            const barHeight = previousHeights[i] / 255 * canvas.height;

            // degradado neón
            const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
            gradient.addColorStop(0, "#00f0ff");
            gradient.addColorStop(1, "#ff00ff");

            ctx.fillStyle = gradient;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 0.5; // espacio mínimo
        }
    }
    draw();
}

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
