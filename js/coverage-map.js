(function () {
  "use strict";
  var el = document.getElementById("coverageMap");
  if (!el || typeof L === "undefined") return;

  var map = L.map(el, {
    zoomControl: true,
    scrollWheelZoom: false,
    attributionControl: true
  }).setView([-5.6297, -35.2852], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 17,
    minZoom: 10,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  fetch("assets/coverage.geojson")
    .then(function (r) { return r.json(); })
    .then(function (geojson) {
      var layer = L.geoJSON(geojson, {
        style: function (feature) {
          return {
            color: feature.properties.color,
            weight: 1.5,
            fillColor: feature.properties.color,
            fillOpacity: 0.38,
            opacity: 0.7
          };
        },
        onEachFeature: function (feature, lyr) {
          lyr.bindPopup(
            "<strong>Área atendida — " + feature.properties.municipio + "</strong><br>" +
            "Confirme seu endereço exato pelo WhatsApp."
          );
        }
      }).addTo(map);
      map.fitBounds(layer.getBounds(), { padding: [20, 20] });
    })
    .catch(function () {
      el.innerHTML = '<p style="padding:20px;color:#5b5770;font-size:.9rem">Não foi possível carregar o mapa agora. Tente recarregar a página.</p>';
    });

  el.addEventListener("click", function () { map.scrollWheelZoom.enable(); });
  el.addEventListener("mouseleave", function () { map.scrollWheelZoom.disable(); });
})();
