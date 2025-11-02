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
// 🔊 NUEVO REPRODUCTOR DEFINITIVO
// =============================

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const muteIcon = document.getElementById("muteIcon");
const soundIcon = document.getElementById("soundIcon");
const volumeSlider = document.getElementById("volumeControl");
const volumePercent = document.getElementById("volumePercent");
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

let isPlaying = false;
let audioCtx, analyser, source;
let previousWave = [];

// 🎧 Volumen máximo inicial
audio.volume = 1.0;

playBtn.addEventListener("click", async () => {
    if (!isPlaying) {
        await audio.play();
        playBtn.classList.remove("play");
        playBtn.classList.add("pause");
        isPlaying = true;

        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioCtx.createAnalyser();

            // Conectar el audio directo al altavoz y al visualizador
            source = audioCtx.createMediaElementSource(audio);
            source.connect(audioCtx.destination); // altavoz
            source.connect(analyser);             // visualizador

            startVisualizer();
        }
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

// 🎨 Visualizador
function startVisualizer() {
    analyser.fftSize = 1024;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    previousWave = new Array(bufferLength).fill(canvas.height / 2);

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        previousWave.fill(canvas.height / 2);
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = 'rgba(0,255,255,0.8)';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(0,255,255,0.6)';

        ctx.beginPath();
        let x = 0;
        const sliceWidth = canvas.width / bufferLength;

        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = previousWave[i] = previousWave[i] * 0.9 + (v * canvas.height / 2) * 0.1;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);

            x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
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
