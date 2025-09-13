// script.js - Zona Vida Radio (versión con Luna Player)

// =============================
// Inicializar Luna Player
// =============================
document.addEventListener("DOMContentLoaded", function () {
  $("#lunaradio").lunaradio({
    streamurl: "https://radio.zonavidahd.online/listen/hd/radio.mp3",
    radioname: "Zona Vida Radio",
    coverimage: "img/logo-zona-vida.png",
    userinterface: "big",
    backgroundcolor: "rgba(0,0,0,0.6)",
    fontcolor: "#ffffff",
    hightlightcolor: "#FF4081",
    fontname: "Montserrat",
    googlefont: "Montserrat:600",
    fontratio: "0.4",
    scroll: "true",
    autoplay: "true",
    coverstyle: "circle",
    usevisualizer: "real",
    visualizertype: "7",
    metadatatechnic: "icy",
    ownmetadataurl: "",
    streamtype: "icecast2",
    shoutcastpath: "/stream",
    shoutcastid: "1",
    metadatainterval: "20000",
    volume: "90",
    usestreamcorsproxy: "false",
    corsproxy: "",
    displayliveicon: "true",
    displayvisualizericon: "true",
    displaycoverart: "true",
    displaymetadata: "true",
    displayvolume: "true",
    displayclock: "false",
  });
});

// =============================
// Activar Radio desde la parrilla
// =============================
function activarRadioItem(item) {
  document.querySelectorAll('.radio-item').forEach(i => i.classList.remove('selected'));
  item.classList.add('selected');

  const radioUrl = item.getAttribute('data-radio');
  const logoUrl = item.getAttribute('data-logo');

  if (radioUrl) {
    // Reiniciar Luna Player con nueva radio
    $("#lunaradio").lunaradio({
      streamurl: radioUrl,
      coverimage: logoUrl || "img/logo-zona-vida.png",
      radioname: item.querySelector("p")?.textContent || "Radio",
      userinterface: "big",
      backgroundcolor: "rgba(0,0,0,0.6)",
      fontcolor: "#ffffff",
      hightlightcolor: "#FF4081",
      fontname: "Montserrat",
      googlefont: "Montserrat:600",
      fontratio: "0.4",
      scroll: "true",
      autoplay: "true",
      coverstyle: "circle",
      usevisualizer: "real",
      visualizertype: "7",
      metadatatechnic: "icy",
      streamtype: "icecast2",
      metadatainterval: "20000",
      volume: "90",
      displayliveicon: "true",
      displayvisualizericon: "true",
      displaycoverart: "true",
      displaymetadata: "true",
      displayvolume: "true",
      displayclock: "false",
    });
  }
}

// Aplicar a TODAS las radios (ambas parrillas)
document.querySelectorAll('.radio-item').forEach(function(item) {
  item.addEventListener('click', function() {
    activarRadioItem(item);
  });
});

// =============================
// Registro de Service Worker
// =============================
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

// =============================
// Botón de instalación PWA
// =============================
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

// =============================
// Compartir App
// =============================
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

// =============================
// Cerrar App
// =============================
function closeApp() {
  if (confirm("¿Quieres salir de la app?")) {
    window.close();
  }
}

// =============================
// Inicializar menú hamburguesa (Materialize)
// =============================
document.addEventListener('DOMContentLoaded', function() {
  var sidenavs = document.querySelectorAll('.sidenav');
  if (sidenavs.length) {
    M.Sidenav.init(sidenavs);
  }
});

// =============================
// Botón Más Radios: alternar parrilla secundaria
// =============================
const btnMasRadios = document.getElementById('btnMasRadios');
const iconoMasRadios = document.getElementById('iconoMasRadios');
const parrillaExtra = document.getElementById('parrillaExtra');
let visible = false;

btnMasRadios.addEventListener('click', () => {
  visible = !visible;
  parrillaExtra.classList.toggle('oculto');
  iconoMasRadios.textContent = visible ? 'remove' : 'add';
  btnMasRadios.style.backgroundColor = visible ? '#4CAF50' : '#FF4081';
});

// =============================
// Agregar etiquetas "Radio" a cada item de la segunda parrilla
// =============================
document.addEventListener("DOMContentLoaded", function () {
  const radios = document.querySelectorAll("#parrillaExtra .radio-item");
  radios.forEach(radio => {
    const etiqueta = document.createElement("div");
    etiqueta.className = "etiqueta-radio";
    etiqueta.textContent = "Radio";
    radio.insertBefore(etiqueta, radio.querySelector("p"));
  });
});
