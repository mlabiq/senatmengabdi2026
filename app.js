// ==========================================================================
// 1. INISIALISASI PETA UTAMA LEAFLET
// ==========================================================================
const map = L.map('map', {
  center: [-7.0940, 107.4430], 
  zoom: 14,
  zoomControl: false
});

L.control.zoom({ position: 'bottomleft' }).addTo(map);

// ==========================================================================
// 2. TIMBAL DATA BASEMAP (PETA DASAR MULTI-PILIHAN)
// ==========================================================================
const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' });
const satelliteLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', { attribution: '&copy; Google Satellite' });
const lightLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; CartoDB Positron' });
const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; CartoDB Dark Matter' });
const hillshadeLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}', { attribution: '&copy; Esri Shaded Relief' });

lightLayer.addTo(map); // Default basemap di awal

const basemapsObject = {
  'osm': osmLayer, 'satellite': satelliteLayer, 'light': lightLayer, 'dark': darkLayer, 'hillshade': hillshadeLayer
};

function switchBaseMap(style) {
  Object.values(basemapsObject).forEach(layer => { if (map.hasLayer(layer)) map.removeLayer(layer); });
  if (basemapsObject[style]) map.addLayer(basemapsObject[style]);
}

// ==========================================================================
// 3. MASTER ARRAY CONFIGURATION (Daftar Isi Layer Spasial)
// ==========================================================================
const spatialLayersConfig = [
  {
    id: 'batasDesa',
    label: 'Batas Desa Mekarsari',
    fileName: 'Batas Desa Mekarsari.json',
    autoZoom: true,
    isExclusive: false,
    hasLegend: false,
    style: { color: "#fff480", weight: 3, fillColor: "#2a9d8f", fillOpacity: 0.15 }
  },
  {
    id: 'wisata',
    label: 'Titik Sebaran Pariwisata',
    fileName: 'Sebaran Wisata.json',
    autoZoom: false,
    isExclusive: false,
    hasLegend: false,
    style: { color: "#ff0101", weight: 3, opacity: 0.85 }
  },
  {
    id: 'aliranSungai',
    label: 'Aliran Air Sungai',
    fileName: 'Aliran Sungai.geojson',
    autoZoom: false,
    isExclusive: false,
    hasLegend: false,
    style: { color: "#0284c7", weight: 3, opacity: 0.85 }
  },
  {
    id: 'elevasi',
    label: 'Elevasi',
    fileName: 'Elevasi.json',
    autoZoom: false,
    isExclusive: true,
    hasLegend: true,
    sourceData: "DEMNAS Resolusi 8 Meter, BIG (Badan Informasi Geospasial) Tahun 2008",
    legendData: [
      { color: "#2ca25f", label: "Rendah / Kelas 1" },
      { color: "#99d8c9", label: "Sedang / Kelas 2" },
      { color: "#fef0d9", label: "Tinggi / Kelas 3" },
      { color: "#fdbb84", label: "Sangat Tinggi / Kelas 4" },
      { color: "#d7301f", label: "Ekstrem / Kelas 5" }
    ],
    style: function(feature) {
      const value = feature.properties.gridcode || feature.properties.Kelas || feature.properties.REMARK;
      let poligonColor = "#edf8fb";
      if (value == 1 || value == "Rendah")          poligonColor = "#2ca25f";
      if (value == 2 || value == "Sedang")          poligonColor = "#99d8c9";
      if (value == 3 || value == "Tinggi")          poligonColor = "#fef0d9";
      if (value == 4 || value == "Sangat Tinggi")    poligonColor = "#fdbb84";
      if (value == 5 || value == "Ekstrem")         poligonColor = "#d7301f";

      return { color: "#64748b00", weight: 1, fillColor: poligonColor, fillOpacity: 0.75 };
    }
  },
  {
    id: 'slope',
    label: 'Kemiringan Lereng',
    fileName: 'Slope.geojson',
    autoZoom: false,
    isExclusive: true,
    hasLegend: true,
    // FIX SINTAKS: Keterangan sumber dipisah menjadi properti string mandiri
    sourceData: "Klasifikasi Kemiringan Lereng: Van Zuidam (1985)",
    legendData: [
      { color: "#045326", label: "0-2% (Datar)" },
      { color: "#0ba840", label: "2-7% (Sangat Landai)" },
      { color: "#52ff02", label: "7-15% (Landai)" },
      { color: "#d0f906", label: "15-30% (Agak Curam)" },
      { color: "#ff6a00", label: "30-70% (Curam)" },
      { color: "#c91b08", label: "70-140% (Sangat Curam)" },
      { color: "#4e0901", label: "140%+ (Terjal)" }
    ],
    style: function(feature) {
      const value = feature.properties.gridcode || feature.properties.Kelas || feature.properties.REMARK;
      let poligonColor = "#edf8fb";
      if (value == 1 || value == "Datar")          poligonColor = "#045326";
      if (value == 2 || value == "Sangat Landai")   poligonColor = "#0ba840";
      if (value == 3 || value == "Landai")          poligonColor = "#52ff02";
      if (value == 4 || value == "Agak Curam")      poligonColor = "#d0f906";
      if (value == 5 || value == "Curam")           poligonColor = "#ff6a00";
      if (value == 6 || value == "Sangat Curam")    poligonColor = "#c91b08";
      if (value == 7 || value == "Terjal")          poligonColor = "#4e0901";

      return { color: "rgba(100, 116, 139, 0)", weight: 1, fillColor: poligonColor, fillOpacity: 0.75 };
    }
  },
  {
    id: 'pl',
    label: 'Penggunaan Lahan',
    fileName: 'PL.geojson',
    autoZoom: false,
    isExclusive: true,
    hasLegend: true,
    sourceData: "Badan Informasi Geospasial (BIG) - Peta Penggunaan Lahan Indonesia 2022",
    legendData: [
      { color: "#136c3a", label: "Hutan Rimba" },
      { color: "#fffc40", label: "Tegalan/Ladang" },
      { color: "#f89b06", label: "Permukiman dan Tempat Kegiatan" },
      { color: "#fdbb84", label: "Gedung/Bangunan" },
      { color: "#aaff00", label: "Semak Belukar" },
      { color: "#00ff1a", label: "Perkebunan/Kebun" },
      { color: "#00ffb3", label: "Sawah Tadah Hujan" },
      { color: "#f6ffc7", label: "Tanah Kosong/Gundul" }
    ],
    style: function(feature) {
      const value = feature.properties.REMARK || feature.properties.Kelas;
      let poligonColor = "#edf8fb";
      if (value == "Hutan Rimba")          poligonColor = "#136c3a";
      if (value == "Tegalan/Ladang")       poligonColor = "#fffc40";
      if (value == "Permukiman dan Tempat Kegiatan") poligonColor = "#f89b06";
      if (value == "Gedung/Bangunan")       poligonColor = "#fdbb84";
      if (value == "Semak Belukar")        poligonColor = "#aaff00";
      if (value == "Perkebunan/Kebun")     poligonColor = "#00ff1a";
      if (value == "Sawah Tadah Hujan")    poligonColor = "#00ffb3";
      if (value == "Tanah Kosong/Gundul")  poligonColor = "#f6ffc7";

      return { color: "rgba(100, 116, 139, 0)", weight: 1, fillColor: poligonColor, fillOpacity: 0.75 };
    }
  },
  {
    id: 'NDVI',
    label: 'Kerapatan Vegetasi',
    fileName: 'NDVI.geojson',
    autoZoom: false,
    isExclusive: true,
    hasLegend: true,
    sourceData: "Band 8 dan band 4 Citra Sentinel Tahun 2025",
    legendData: [
      { color: "#ff0000", label: "Rendah / Kelas 1" },
      { color: "#ff7300", label: "Sedang / Kelas 2" },
      { color: "#ffe626", label: "Tinggi / Kelas 3" },
      { color: "#1aff00", label: "Sangat Tinggi / Kelas 4" },
      { color: "#109d00", label: "Ekstrem / Kelas 5" }
    ],
    style: function(feature) {
      const value = feature.properties.gridcode || feature.properties.Kelas || feature.properties.REMARK;
      let poligonColor = "#edf8fb";
      if (value == 1 || value == "Rendah")          poligonColor = "#ff0000";
      if (value == 2 || value == "Sedang")          poligonColor = "#ff7300";
      if (value == 3 || value == "Tinggi")          poligonColor = "#ffe626";
      if (value == 4 || value == "Sangat Tinggi")    poligonColor = "#1aff00";
      if (value == 5 || value == "Ekstrem")         poligonColor = "#109d00";

      return { color: "rgba(100, 116, 139, 0)", weight: 1, fillColor: poligonColor, fillOpacity: 0.75 };
    }
  }
];

// ==========================================================================
// 4. AUTOMATED ENGINE + INLINE IN-PLACE LEGEND CONTROL
// ==========================================================================
const layersObject = {}; 

function toggleInlineLegend(config, show) {
  const legendBox = document.getElementById(`inline-legend-${config.id}`);
  if (!legendBox) return;

  if (show && config.hasLegend) {
    legendBox.innerHTML = '';
    
    // Render elemen bulatan warna dan keterangan teks kelas
    config.legendData.forEach(item => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '8px';
      row.style.marginTop = '4px';
      row.style.fontSize = '12px';
      row.style.color = '#475569';
      row.innerHTML = `
        <span style="display: inline-block; width: 16px; height: 11px; background-color: ${item.color}; border: 1px solid #cbd5e1; border-radius: 2px;"></span>
        <span>${item.label}</span>
      `;
      legendBox.appendChild(row);
    });

    // FIX: Jika memiliki data sumber (sourceData), suntikkan teksnya di baris paling bawah legenda
    if (config.sourceData) {
      const sourceRow = document.createElement('div');
      sourceRow.style.fontSize = '10.5px';
      sourceRow.style.color = '#64748b';
      sourceRow.style.fontStyle = 'italic';
      sourceRow.style.marginTop = '6px';
      sourceRow.style.paddingTop = '4px';
      sourceRow.style.borderTop = '1px dashed #e2e8f0';
      sourceRow.innerText = config.sourceData;
      legendBox.appendChild(sourceRow);
    }

    legendBox.style.display = 'block';
  } else {
    legendBox.style.display = 'none';
    legendBox.innerHTML = '';
  }
}

function initAutomatedLayers() {
  const container = document.getElementById('dynamic-tematik-layers');
  if (!container) return;

  container.innerHTML = ''; 

  spatialLayersConfig.forEach(config => {
    const leafletGeoJsonInstance = L.geoJSON(null, {
      style: typeof config.style === 'function' ? config.style : function() { return config.style; },
      onEachFeature: function (feature, layer) {
        const attrValue = feature.properties.Nama || feature.properties.REMARK || feature.properties.GRID_CODE || "";
        if (attrValue) {
          layer.bindPopup(`<b>${config.label}:</b> ${attrValue}`);
        } else {
          layer.bindPopup(`<b>${config.label}</b>`);
        }
      }
    });

    if (!config.isExclusive) {
      leafletGeoJsonInstance.addTo(map);
    }

    layersObject[config.id] = leafletGeoJsonInstance;

    const itemWrapper = document.createElement('div');
    itemWrapper.style.display = 'flex';
    itemWrapper.style.flexDirection = 'column';
    itemWrapper.style.marginBottom = '6px';

    const labelRow = document.createElement('label');
    labelRow.className = 'control-item';
    labelRow.style.display = 'flex';
    labelRow.style.alignItems = 'center';
    labelRow.style.gap = '10px';
    labelRow.style.cursor = 'pointer';
    labelRow.style.margin = '0';
    
    const isChecked = !config.isExclusive ? 'checked' : '';
    
    labelRow.innerHTML = `
      <input type="checkbox" id="chk_${config.id}" ${isChecked} style="display:none;">
      <span class="custom-radio-checkbox"></span>
      <span style="font-size: 13.5px; color: #334155; font-weight: 500;">${config.label}</span>
    `;

    const inlineLegendContainer = document.createElement('div');
    inlineLegendContainer.id = `inline-legend-${config.id}`;
    inlineLegendContainer.style.paddingLeft = '26px';
    inlineLegendContainer.style.marginTop = '2px';
    inlineLegendContainer.style.display = 'none';

    itemWrapper.appendChild(labelRow);
    itemWrapper.appendChild(inlineLegendContainer);
    container.appendChild(itemWrapper);

    labelRow.querySelector('input').addEventListener('change', function(e) {
      if (e.target.checked) {
        if (config.isExclusive) {
          spatialLayersConfig.forEach(otherConfig => {
            if (otherConfig.isExclusive && otherConfig.id !== config.id) {
              const otherCheckbox = document.getElementById(`chk_${otherConfig.id}`);
              if (otherCheckbox && otherCheckbox.checked) {
                otherCheckbox.checked = false;
                map.removeLayer(layersObject[otherConfig.id]);
                toggleInlineLegend(otherConfig, false);
              }
            }
          });
        }
        map.addLayer(leafletGeoJsonInstance);
        toggleInlineLegend(config, true);
      } else {
        map.removeLayer(leafletGeoJsonInstance);
        toggleInlineLegend(config, false);
      }
    });

    if (!config.isExclusive) {
      toggleInlineLegend(config, true);
    }

    fetch(`../assets/LAYER/${config.fileName}`)
      .then(response => {
        if (!response.ok) throw new Error(`Berkas ${config.fileName} tidak ditemukan.`);
        return response.json();
      })
      .then(data => {
        leafletGeoJsonInstance.addData(data);
        if (config.autoZoom && leafletGeoJsonInstance.getBounds().isValid()) {
          map.fitBounds(leafletGeoJsonInstance.getBounds(), { padding: [20, 20], maxZoom: 15 });
        }
      })
      .catch(error => console.error(`[SIG Error Load]`, error));
  });
}

// ==========================================================================
// 5. LOGIKA DATA WEATHER FORECAST (API OPEN-METEO)
// ==========================================================================
const latitude = -7.0940;
const longitude = 107.4430;

function getWeatherDescription(weatherCode) {
  const descriptions = {
    0: 'Cerah', 1: 'Cerah Berawan', 2: 'Sebagian Berawan', 3: 'Berawan/Mendung',
    45: 'Berkabut', 48: 'Berkabut Rime', 51: 'Gerimis Ringan',
    53: 'Gerimis Sedang', 55: 'Gerimis Lebat', 61: 'Hujan Ringan',
    63: 'Hujan Sedang', 65: 'Hujan Lebat', 71: 'Salju Ringan',
    75: 'Salju Lebat', 80: 'Hujan Pancaroba Ringan', 81: 'Hujan Sedang',
    82: 'Hujan Sangat Lebat', 95: 'Hujan Badai', 99: 'Hujan Badai Ekstrem'
  };
  return descriptions[weatherCode] || 'Mendung Tipis';
}

function updateWeatherTime() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Jakarta' };
  const formatter = new Intl.DateTimeFormat('id-ID', options);
  const weatherTimeElement = document.getElementById('weatherTime');
  if (weatherTimeElement) weatherTimeElement.textContent = formatter.format(now);
}

function fetchWeatherData() {
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,visibility,uv_index&daily=uv_index_max&temperature_unit=celsius&wind_speed_unit=kmh&timezone=Asia/Jakarta`)
    .then(response => response.json())
    .then(data => {
      const current = data.current;
      const daily = data.daily;
      if (document.getElementById('temperature')) document.getElementById('temperature').textContent = Math.round(current.temperature_2m) + '°C';
      if (document.getElementById('condition')) document.getElementById('condition').textContent = getWeatherDescription(current.weather_code);
      if (document.getElementById('humidity')) document.getElementById('humidity').textContent = current.relative_humidity_2m + '%';
      if (document.getElementById('windSpeed')) document.getElementById('windSpeed').textContent = Math.round(current.wind_speed_10m) + ' km/h';
      
      const visibilityElement = document.getElementById('visibility');
      if (visibilityElement) {
        if (current.visibility >= 10000) visibilityElement.textContent = '10+ km';
        else visibilityElement.textContent = (current.visibility / 1000).toFixed(1) + ' km';
      }
      
      const uvElement = document.getElementById('uvIndex');
      if (uvElement) {
        const uvLevel = Math.round(daily.uv_index_max[0]);
        let uvText = uvLevel;
        if (uvLevel <= 2) uvText += ' (Rendah)';
        else if (uvLevel <= 5) uvText += ' (Sedang)';
        else if (uvLevel <= 7) uvText += ' (Tinggi)';
        else if (uvLevel <= 10) uvText += ' (Sgt Tinggi)';
        else uvText += ' (Ekstrem)';
        uvElement.textContent = uvText;
      }
    })
    .catch(error => console.error('Error fetching weather:', error));
}

// RUN ENGINE UTAMA
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initAutomatedLayers, 50); 
  updateWeatherTime();
  fetchWeatherData();
  setInterval(updateWeatherTime, 1000);
  setInterval(fetchWeatherData, 600000);
});