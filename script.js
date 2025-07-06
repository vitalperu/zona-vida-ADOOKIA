document.addEventListener('DOMContentLoaded', function() {
  // Inicializa menú hamburguesa
  var elems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems);

  // Tooltips
  var tooltips = document.querySelectorAll('.tooltipped');
  M.Tooltip.init(tooltips);

  // Reproductor audio
  const player = document.getElementById('player');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playPauseIcon = document.getElementById('playPauseIcon');
  const volumeBar = document.getElementById('volumeBar');
  const volIcon = document.getElementById('volIcon');
  const volValue = document.getElementById('volValue');

  let audioCtx = null;
  let source = null;
  let filters = [];

  playPauseBtn.addEventListener('click', () => {
    if (!audioCtx) {
      // Inicializa AudioContext al primer click
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      source = audioCtx.createMediaElementSource(player);

      // Filtros del ecualizador
      const freqs = [60, 170, 310, 600, 1000, 3000];
      filters = freqs.map(freq => {
        const f = audioCtx.createBiquadFilter();
        f.type = 'peaking';
        f.frequency.value = freq;
        f.Q.value = 1;
        f.gain.value = 0;
        return f;
      });

      // Conectar filtros en serie
      source.connect(filters[0]);
      for (let i = 0; i < filters.length - 1; i++) {
        filters[i].connect(filters[i + 1]);
      }
      filters[filters.length - 1].connect(audioCtx.destination);

      // Control sliders
      const sliders = [
        document.getElementById('band1'),
        document.getElementById('band2'),
        document.getElementById('band3'),
        document.getElementById('band4'),
        document.getElementById('band5'),
        document.getElementById('band6')
      ];
      sliders.forEach((slider, index) => {
        slider.addEventListener('input', () => {
          filters[index].gain.value = slider.value;
        });
      });
    }

    if (player.paused) {
      player.play();
      playPauseIcon.textContent = 'pause';
    } else {
      player.pause();
      playPauseIcon.textContent = 'play_arrow';
    }
  });

  // Control volumen
  volumeBar.addEventListener('input', () => {
    player.volume = volumeBar.value;
    volValue.textContent = Math.round(volumeBar.value * 100) + '%';
    if (volumeBar.value == 0) volIcon.innerHTML = '<i class="material-icons">volume_off</i>';
    else if (volumeBar.value <= 0.5) volIcon.innerHTML = '<i class="material-icons">volume_down</i>';
    else volIcon.innerHTML = '<i class="material-icons">volume_up</i>';
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

  // PWA instalación
  let deferredPrompt;
  const installBtn = document.getElementById('installBtn');
  installBtn.style.display = 'none';

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

  // Mostrar/ocultar ecualizador
  const toggleEqualizer = document.getElementById('toggleEqualizer');
  const equalizerContainer = document.getElementById('equalizer');
  toggleEqualizer.addEventListener('click', () => {
    equalizerContainer.style.display = (equalizerContainer.style.display === 'none') ? 'block' : 'none';
  });
});
