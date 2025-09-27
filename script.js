// script.js - Zona Vida Radio

function activarRadioItem(item) {
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
}

// Aplicar a TODAS las radios (ambas parrillas)
document.querySelectorAll('.radio-item').forEach(function(item) {
  item.addEventListener('click', function() {
    activarRadioItem(item);
  });
});

/* ============================= */
/* 🔊 INICIO DE NUEVO REPRODUCTOR*/
/* ============================= */

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const muteIcon = document.getElementById("muteIcon");
const soundIcon = document.getElementById("soundIcon");
const volumeSlider = document.getElementById("volumeSlider");
const volumePercent = document.getElementById("volumePercent");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

let isPlaying = false;

// 🎵 Inicializar contexto de audio
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize = 512;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// 🎛️ Play / Pause
playBtn.addEventListener("click", () => {
  if (!isPlaying) {
    audioCtx.resume();
    audio.play();
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

// 🔇 Mute / Unmute
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

// 🔊 Control de volumen
volumeSlider.addEventListener("input", (e) => {
  const value = e.target.value;
  audio.volume = value / 100;
  volumePercent.textContent = `${value}%`;

  volumeSlider.style.background = `linear-gradient(to right, #00e5ff ${value}%, #444 ${value}%)`;
});

// 🎶 Visualizer simple con ondas
function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function draw() {
  requestAnimationFrame(draw);
  analyser.getByteTimeDomainData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.lineWidth = 2;
  ctx.strokeStyle = "#00e5ff";
  ctx.beginPath();

  const sliceWidth = canvas.width / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * canvas.height) / 2;

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

/* ============================= */
/* 🔊 FIN DE NUEVO REPRODUCTOR   */
/* ============================= */




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

});


// Agregar etiquetas "Radio" a cada item de la segunda parrilla
document.addEventListener("DOMContentLoaded", function () {
  const radios = document.querySelectorAll("#parrillaExtra .radio-item");
  radios.forEach(radio => {
    const etiqueta = document.createElement("div");
    etiqueta.className = "etiqueta-radio";
    etiqueta.textContent = "Radio";
    radio.insertBefore(etiqueta, radio.querySelector("p"));
  });
});
