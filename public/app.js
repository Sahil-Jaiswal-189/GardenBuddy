const storageKey = "gardenbuddy:v2";

const plantLibrary = {
  basil: {
    label: "Basil",
    image: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?auto=format&fit=crop&w=900&q=80",
    cadence: 2,
    light: "Partial sun",
    idealMin: 18,
    idealMax: 30,
    hardMax: 34,
    coldMin: 10,
    heavyRain: 8,
    growthTip: "Give morning sun, keep soil evenly moist, and pinch flower buds to keep leaves growing."
  },
  monstera: {
    label: "Monstera",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=900&q=80",
    cadence: 5,
    light: "Low light",
    idealMin: 18,
    idealMax: 29,
    hardMax: 33,
    coldMin: 12,
    heavyRain: 6,
    growthTip: "Keep in bright indirect light, rotate weekly, and avoid harsh direct sun on leaves."
  },
  tomato: {
    label: "Tomato",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80",
    cadence: 2,
    light: "Full sun",
    idealMin: 18,
    idealMax: 32,
    hardMax: 36,
    coldMin: 10,
    heavyRain: 12,
    growthTip: "Keep in strong sun, maintain consistent moisture, and support flowering stems."
  },
  rose: {
    label: "Rose",
    image: "https://images.unsplash.com/photo-1559563362-c667ba5f5480?auto=format&fit=crop&w=900&q=80",
    cadence: 3,
    light: "Full sun",
    idealMin: 15,
    idealMax: 30,
    hardMax: 35,
    coldMin: 5,
    heavyRain: 15,
    growthTip: "Give at least 5 hours of sun and prune weak or crossing stems."
  },
  "snake plant": {
    label: "Snake plant",
    image: "https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?auto=format&fit=crop&w=900&q=80",
    cadence: 7,
    light: "Low light",
    idealMin: 16,
    idealMax: 30,
    hardMax: 35,
    coldMin: 10,
    heavyRain: 6,
    growthTip: "Let soil dry between watering and keep it in bright indirect light for faster growth."
  },
  "money plant": {
    label: "Money plant",
    image: "https://images.unsplash.com/photo-1620127682229-33388276e540?auto=format&fit=crop&w=900&q=80",
    cadence: 5,
    light: "Partial sun",
    idealMin: 18,
    idealMax: 30,
    hardMax: 34,
    coldMin: 10,
    heavyRain: 8,
    growthTip: "Use bright indirect light and trim long vines to encourage fuller growth."
  },
  "aloe vera": {
    label: "Aloe vera",
    image: "https://images.unsplash.com/photo-1569745358610-b01866003860?auto=format&fit=crop&w=900&q=80",
    cadence: 7,
    light: "Full sun",
    idealMin: 15,
    idealMax: 32,
    hardMax: 38,
    coldMin: 8,
    heavyRain: 6,
    growthTip: "Give bright light, use a gritty mix, and water deeply only when soil is dry."
  },
  mint: {
    label: "Mint",
    image: "https://images.unsplash.com/photo-1628557044797-f21a177c37ec?auto=format&fit=crop&w=900&q=80",
    cadence: 2,
    light: "Partial sun",
    idealMin: 16,
    idealMax: 29,
    hardMax: 33,
    coldMin: 8,
    heavyRain: 8,
    growthTip: "Keep soil consistently moist and trim tips often for bushier growth."
  },
  "chilli pepper": {
    label: "Chilli pepper",
    image: "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?auto=format&fit=crop&w=900&q=80",
    cadence: 2,
    light: "Full sun",
    idealMin: 18,
    idealMax: 32,
    hardMax: 36,
    coldMin: 12,
    heavyRain: 10,
    growthTip: "Keep in full sun, avoid waterlogging, and feed lightly during flowering."
  },
  jasmine: {
    label: "Jasmine",
    image: "https://images.unsplash.com/photo-1598512752271-33f913a5af13?auto=format&fit=crop&w=900&q=80",
    cadence: 3,
    light: "Partial sun",
    idealMin: 16,
    idealMax: 30,
    hardMax: 35,
    coldMin: 8,
    heavyRain: 10,
    growthTip: "Give bright sun for buds, moist soil, and prune after flowering."
  },
  orchid: {
    label: "Orchid",
    image: "https://images.unsplash.com/photo-1566908829550-e6551b00979b?auto=format&fit=crop&w=900&q=80",
    cadence: 6,
    light: "Partial sun",
    idealMin: 18,
    idealMax: 30,
    hardMax: 34,
    coldMin: 12,
    heavyRain: 5,
    growthTip: "Use bright indirect light, airflow, and let roots approach dryness before watering."
  },
  lavender: {
    label: "Lavender",
    image: "https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?auto=format&fit=crop&w=900&q=80",
    cadence: 6,
    light: "Full sun",
    idealMin: 15,
    idealMax: 30,
    hardMax: 36,
    coldMin: 4,
    heavyRain: 6,
    growthTip: "Give strong sun, excellent drainage, and avoid frequent watering."
  },
  "peace lily": {
    label: "Peace lily",
    image: "https://images.unsplash.com/photo-1617209299414-dbf3acba816a?auto=format&fit=crop&w=900&q=80",
    cadence: 4,
    light: "Low light",
    idealMin: 18,
    idealMax: 29,
    hardMax: 33,
    coldMin: 12,
    heavyRain: 6,
    growthTip: "Keep in bright indirect light and water when leaves soften slightly."
  },
  "curry leaf": {
    label: "Curry leaf",
    image: "https://images.unsplash.com/photo-1628557044797-f21a177c37ec?auto=format&fit=crop&w=900&q=80",
    cadence: 3,
    light: "Full sun",
    idealMin: 20,
    idealMax: 34,
    hardMax: 38,
    coldMin: 12,
    heavyRain: 12,
    growthTip: "Give strong sun, warm conditions, and prune tips for bushier growth."
  },
  hibiscus: {
    label: "Hibiscus",
    image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=900&q=80",
    cadence: 2,
    light: "Full sun",
    idealMin: 18,
    idealMax: 32,
    hardMax: 37,
    coldMin: 8,
    heavyRain: 14,
    growthTip: "Give sun, regular moisture, and remove spent flowers to support blooming."
  }
};

function plantTypeData(type) {
  return plantLibrary[type] || plantLibrary.basil;
}

let state = loadState();
let weatherCache = {};
let selectedPlantType = "";
let selectedLocation = null;
let locationSearchTimer = 0;
let backendMode = "local";
let selectedCalendarPlant = "all";

const elements = {
  form: document.querySelector("#plantForm"),
  grid: document.querySelector("#plantGrid"),
  calendar: document.querySelector("#calendar"),
  todayTaskCount: document.querySelector("#todayTaskCount"),
  weatherSummary: document.querySelector("#weatherSummary"),
  dataMode: document.querySelector("#dataMode"),
  plantCount: document.querySelector("#plantCount"),
  needCareCount: document.querySelector("#needCareCount"),
  rainSkipCount: document.querySelector("#rainSkipCount"),
  aiMode: document.querySelector("#aiMode"),
  clearGarden: document.querySelector("#clearGarden"),
  plantSearch: document.querySelector("#plantSearch"),
  plantSuggestions: document.querySelector("#plantSuggestions"),
  locationSearch: document.querySelector("#locationSearch"),
  locationSuggestions: document.querySelector("#locationSuggestions"),
  calendarForm: document.querySelector("#calendarForm"),
  calendarDate: document.querySelector("#calendarDate"),
  calendarTitle: document.querySelector("#calendarTitle"),
  calendarPlantFilters: document.querySelector("#calendarPlantFilters"),
  cadencePreview: document.querySelector("#cadencePreview"),
  dialog: document.querySelector("#careDialog"),
  dialogTitle: document.querySelector("#dialogTitle"),
  dialogBody: document.querySelector("#dialogBody"),
  closeDialog: document.querySelector("#closeDialog")
};

document.querySelector("#lastWatered").value = offsetDate(-1);
elements.calendarDate.value = today();
elements.plantSearch.addEventListener("input", () => {
  selectedPlantType = "";
  renderPlantSuggestions(elements.plantSearch.value);
  updateCadencePreview();
});
elements.plantSearch.addEventListener("focus", () => renderPlantSuggestions(elements.plantSearch.value));
elements.locationSearch.addEventListener("input", () => {
  selectedLocation = null;
  window.clearTimeout(locationSearchTimer);
  locationSearchTimer = window.setTimeout(searchLocations, 180);
});
elements.locationSearch.addEventListener("focus", () => {
  if (elements.locationSuggestions.children.length > 0) elements.locationSuggestions.hidden = false;
});
document.querySelector("#plantStage").addEventListener("change", updateCadencePreview);
document.querySelector("#plantPlace").addEventListener("change", updateCadencePreview);
document.addEventListener("click", (event) => {
  if (!event.target.closest(".combo")) {
    elements.plantSuggestions.hidden = true;
    elements.locationSuggestions.hidden = true;
  }
});

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const type = selectedPlantType || guessPlantType(valueOf("plantSearch"));
  const selectedPlant = plantTypeData(type);
  const location = selectedLocation || parseLocation(valueOf("locationSearch"));
  const wateringDays = calculateBaseCadence(selectedPlant, valueOf("plantStage"), valueOf("plantPlace"));
  const plant = {
    id: crypto.randomUUID(),
    type,
    name: valueOf("plantName") || selectedPlant.label,
    city: location.city,
    region: location.region,
    stage: valueOf("plantStage"),
    place: valueOf("plantPlace"),
    light: valueOf("plantLight"),
    lastWatered: valueOf("lastWatered") || today(),
    wateringDays,
    notes: valueOf("plantNotes"),
    image: selectedPlant.image,
    logs: [{ date: valueOf("lastWatered") || today(), action: "Watered" }]
  };

  state.plants.unshift(plant);
  saveState();
  elements.form.reset();
  selectedPlantType = "";
  selectedLocation = null;
  updateCadencePreview();
  document.querySelector("#lastWatered").value = offsetDate(-1);
  render();
});

elements.clearGarden.addEventListener("click", () => {
  state = { plants: [], calendarItems: [], hiddenCalendarItems: [] };
  saveState();
  weatherCache = {};
  render();
});

elements.calendarForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addCalendarItem({
    date: elements.calendarDate.value || today(),
    title: elements.calendarTitle.value.trim(),
    type: "custom"
  });
  elements.calendarTitle.value = "";
});

elements.closeDialog.addEventListener("click", () => elements.dialog.close());

function valueOf(id) {
  return document.querySelector(`#${id}`).value.trim();
}

function renderPlantSuggestions(query = "") {
  const normalized = query.toLowerCase().trim();
  const matches = Object.entries(plantLibrary)
    .filter(([key, plant]) => {
      const value = `${key} ${plant.label}`.toLowerCase();
      return !normalized || value.includes(normalized);
    })
    .slice(0, 8);

  elements.plantSuggestions.innerHTML = matches
    .map(
      ([key, plant]) => `
        <button type="button" data-plant="${escapeHtml(key)}">
          <span>${escapeHtml(plant.label)}</span>
          <small>${plant.light} · auto ${plant.cadence}d rhythm</small>
        </button>
      `
    )
    .join("");
  elements.plantSuggestions.hidden = matches.length === 0;
  elements.plantSuggestions.querySelectorAll("[data-plant]").forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.plant;
      const plant = plantTypeData(type);
      selectedPlantType = type;
      elements.plantSearch.value = plant.label;
      document.querySelector("#plantLight").value = plant.light;
      elements.plantSuggestions.hidden = true;
      updateCadencePreview();
    });
  });
}

async function searchLocations() {
  const query = elements.locationSearch.value.trim();
  if (query.length < 2) {
    elements.locationSuggestions.hidden = true;
    return;
  }

  try {
    const response = await fetch(`/api/locations?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    const locations = data.locations || [];
    elements.locationSuggestions.innerHTML = locations
      .map(
        (location, index) => `
          <button type="button" data-location="${index}">
            <span>${escapeHtml(location.name)}</span>
            <small>${escapeHtml(location.region || "Unknown region")}</small>
          </button>
        `
      )
      .join("");
    elements.locationSuggestions.hidden = locations.length === 0;
    elements.locationSuggestions.querySelectorAll("[data-location]").forEach((button) => {
      button.addEventListener("click", () => {
        const location = locations[Number(button.dataset.location)];
        selectedLocation = {
          city: location.name,
          region: location.region,
          label: location.label
        };
        elements.locationSearch.value = location.label;
        elements.locationSuggestions.hidden = true;
      });
    });
  } catch {
    elements.locationSuggestions.hidden = true;
  }
}

function parseLocation(value) {
  const [city = "", ...rest] = value.split(",").map((part) => part.trim()).filter(Boolean);
  return {
    city,
    region: rest.join(", ")
  };
}

function calculateBaseCadence(plant, stage, place) {
  let cadence = Number(plant.cadence || 3);
  if (stage === "Seedling" || stage === "Flowering") cadence -= 1;
  if (place === "Indoor") cadence += 1;
  if (place === "Garden bed") cadence += 1;
  return Math.max(1, Math.min(10, cadence));
}

function updateCadencePreview() {
  const type = selectedPlantType || guessPlantType(elements.plantSearch.value);
  if (!elements.plantSearch.value.trim() && !selectedPlantType) {
    elements.cadencePreview.textContent = "Select a plant";
    return;
  }
  const plant = plantTypeData(type);
  const cadence = calculateBaseCadence(plant, valueOf("plantStage"), valueOf("plantPlace"));
  elements.cadencePreview.textContent = `${cadence}-day rhythm`;
}

function loadState() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return { plants: [], calendarItems: [], hiddenCalendarItems: [] };
    const parsed = JSON.parse(saved);
    return normalizeState(parsed);
  } catch {
    return { plants: [], calendarItems: [], hiddenCalendarItems: [] };
  }
}

function normalizeState(value) {
  return {
    plants: Array.isArray(value?.plants) ? value.plants : [],
    calendarItems: Array.isArray(value?.calendarItems) ? value.calendarItems : [],
    hiddenCalendarItems: Array.isArray(value?.hiddenCalendarItems) ? value.hiddenCalendarItems : []
  };
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
  persistGarden();
}

async function syncFromBackend() {
  try {
    const response = await fetch("/api/state");
    const data = await response.json();
    backendMode = data.mode || "local";
    if (backendMode === "atlas" && Array.isArray(data.plants)) {
      state = normalizeState(data);
      localStorage.setItem(storageKey, JSON.stringify(state));
    }
  } catch {
    backendMode = "local";
  }
}

async function persistGarden() {
  try {
    const response = await fetch("/api/state", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(state)
    });
    const data = await response.json();
    backendMode = data.mode || backendMode;
  } catch {
    backendMode = "local";
  }
}

async function persistCareLog(plant, action) {
  try {
    await fetch("/api/logs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        plantId: plant.id,
        plantName: plant.name,
        action,
        date: today()
      })
    });
  } catch {
    // Local storage already holds the user-visible log.
  }
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function offsetDate(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function daysSince(date) {
  const start = new Date(`${date}T00:00:00`);
  const now = new Date(`${today()}T00:00:00`);
  return Math.floor((now - start) / 86400000);
}

function addDays(date, amount) {
  const next = new Date(`${date}T00:00:00`);
  next.setDate(next.getDate() + amount);
  return next.toISOString().slice(0, 10);
}

function formatDay(date) {
  return new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" }).format(
    new Date(`${date}T00:00:00`)
  );
}

function dailyWeatherFor(plant) {
  const weather = weatherCache[locationKey(plant)];
  if (!weather?.daily?.time?.length) return undefined;
  return {
    location: weather.location,
    date: weather.daily.time[0],
    rain: Number(weather.daily.precipitation_sum?.[0] || 0),
    max: Number(weather.daily.temperature_2m_max?.[0] || 0),
    min: Number(weather.daily.temperature_2m_min?.[0] || 0),
    forecast: weather.daily
  };
}

function weatherForDate(plant, date) {
  const weather = weatherCache[locationKey(plant)];
  const index = weather?.daily?.time?.indexOf(date) ?? -1;
  if (index < 0) return undefined;
  return {
    location: weather.location,
    date,
    rain: Number(weather.daily.precipitation_sum?.[index] || 0),
    max: Number(weather.daily.temperature_2m_max?.[index] || 0),
    min: Number(weather.daily.temperature_2m_min?.[index] || 0)
  };
}

function weatherMood(weather) {
  if (!weather) return "plain";
  if (weather.rain >= 6) return "rainy";
  if (weather.max >= 34) return "hot";
  if (weather.min > 0 && weather.min <= 10) return "cold";
  if (weather.max >= 25 && weather.rain < 2) return "sunny";
  return "cloudy";
}

function careSignal(plant) {
  const profile = plantTypeData(plant.type);
  const weather = dailyWeatherFor(plant);
  const dryDays = daysSince(plant.lastWatered);
  const due = dryDays >= Number(plant.wateringDays);
  const rain = weather?.rain || 0;
  const heat = weather?.max || 0;
  const cold = weather?.min || 0;
  const seedling = plant.stage === "Seedling";
  const harshSun = plant.light === "Harsh afternoon sun";
  const outside = plant.place !== "Indoor";
  const rainSkip = rain >= Math.min(5, profile.heavyRain) && outside;
  const heavyRain = rain >= profile.heavyRain && outside;
  const heatRisk = heat >= profile.hardMax || (seedling && heat >= profile.idealMax);
  const coldRisk = cold > 0 && cold <= profile.coldMin;
  const idealWeather = heat >= profile.idealMin && heat <= profile.idealMax && !heavyRain && !coldRisk;

  let status = "Steady";
  let tone = "ok";
  let task = "Check soil and leaf posture.";
  let reason = "Care is on track from the current watering rhythm.";
  let placement = outside ? "Outdoor conditions look acceptable." : "Indoor placement is stable.";
  let growth = profile.growthTip;

  if (heavyRain) {
    status = "Protect from rain";
    tone = "danger";
    task = "Move under cover or improve drainage.";
    reason = `${rain.toFixed(1)}mm rain may waterlog ${profile.label.toLowerCase()}.`;
    placement = "Keep it sheltered today; avoid standing water around roots.";
  } else if (coldRisk) {
    status = "Too cold outside";
    tone = "danger";
    task = "Move indoors or cover overnight.";
    reason = `${profile.label} can struggle near ${cold.toFixed(0)}°C.`;
    placement = "Protect from cold drafts and keep near bright light.";
  } else if (heatRisk) {
    status = "Heat watch";
    tone = "warn";
    task = seedling ? "Give filtered light and check soil twice." : "Add afternoon shade and check soil.";
    reason = `${heat.toFixed(0)}°C is above the comfortable range for ${profile.label.toLowerCase()}.`;
    placement = "Keep morning sun, avoid harsh afternoon exposure.";
  } else if (rainSkip) {
    status = "Skip watering";
    tone = "rain";
    task = "Let rain handle watering today.";
    reason = `${rain.toFixed(1)}mm rain is expected, so outdoor watering can wait.`;
  } else if (due) {
    status = "Needs water";
    tone = "danger";
    task = "Water today, then log the care.";
    reason = `${dryDays} days since last watering; normal rhythm is every ${plant.wateringDays} days.`;
  } else if (harshSun && plant.light !== profile.light) {
    status = "Light adjustment";
    tone = "warn";
    task = "Shift to gentler light for part of the day.";
    reason = `${profile.label} grows fastest around ${profile.light.toLowerCase()}, not constant harsh sun.`;
    placement = "Use morning sun and filtered afternoon light.";
  } else if (idealWeather) {
    growth = `Good growth window today. ${profile.growthTip}`;
  }

  const nextWater = rainSkip ? addDays(today(), 1) : due ? today() : addDays(plant.lastWatered, Number(plant.wateringDays));
  const actionNeeded = due || rainSkip || heavyRain || heatRisk || coldRisk || harshSun;
  const moveOrProtect = heavyRain || heatRisk || coldRisk;
  return {
    status,
    tone,
    task,
    reason,
    placement,
    growth,
    dryDays,
    rainSkip,
    due,
    heat,
    cold,
    rain,
    nextWater,
    actionNeeded,
    moveOrProtect,
    basis: [
      `${dryDays}d since water`,
      weather ? `${heat.toFixed(0)}°/${cold.toFixed(0)}°C` : "weather pending",
      `${rain.toFixed(1)}mm rain`,
      plant.stage,
      plant.place
    ]
  };
}

async function fetchWeather(city) {
  const key = city;
  if (!key || weatherCache[key]) return;
  try {
    const [plantCity, plantRegion = ""] = key.split("||");
    const params = new URLSearchParams({ city: plantCity });
    if (plantRegion) params.set("region", plantRegion);
    const response = await fetch(`/api/weather?${params.toString()}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Weather unavailable.");
    weatherCache[key] = data;
  } catch {
    weatherCache[key] = { error: true };
  }
}

async function render() {
  state.plants = state.plants.map(normalizePlant);
  await Promise.all([...new Set(state.plants.map(locationKey))].map(fetchWeather));
  elements.dataMode.textContent =
    backendMode === "atlas" ? "Data layer: MongoDB Atlas" : "Data layer: local browser";
  renderStats();
  renderPlants();
  renderCalendarFilters();
  renderCalendar();
}

function renderStats() {
  const signals = state.plants.map(careSignal);
  const needCare = signals.filter((signal) => signal.actionNeeded).length;
  const moveOrProtect = signals.filter((signal) => signal.moveOrProtect).length;
  const todayTasks = needCare;
  const firstWeather = state.plants.map(dailyWeatherFor).find(Boolean);

  elements.plantCount.textContent = state.plants.length;
  elements.needCareCount.textContent = needCare;
  elements.rainSkipCount.textContent = moveOrProtect;
  elements.todayTaskCount.textContent = `${todayTasks} ${todayTasks === 1 ? "task" : "tasks"}`;
  elements.weatherSummary.textContent = firstWeather
    ? `${firstWeather.location}: ${firstWeather.max.toFixed(0)}°C high, ${firstWeather.rain.toFixed(1)}mm rain expected.`
    : "Weather loads automatically from each plant's city.";
}

function renderPlants() {
  elements.grid.innerHTML = "";
  if (state.plants.length === 0) {
    elements.grid.innerHTML = `
      <div class="emptyGarden">
        <h3>Add your first real plant</h3>
        <p>Choose the plant type, city, and region. GardenBuddy will pull local weather and tell you whether to water, move, shade, or protect it.</p>
      </div>
    `;
    return;
  }
  for (const plant of state.plants) {
    const signal = careSignal(plant);
    const weather = dailyWeatherFor(plant);
    const card = document.createElement("article");
    card.className = "plantCard";
    card.innerHTML = `
      <div class="plantImage" style="background-image:url('${plant.image}')">
        <h3>${escapeHtml(plant.name)}</h3>
        <span>${escapeHtml(plantTypeData(plant.type).label)}</span>
      </div>
      <div class="plantBody">
        <div class="badges">
          <span class="badge">${escapeHtml(plant.city)}${plant.region ? `, ${escapeHtml(plant.region)}` : ""}</span>
          <span class="badge">${escapeHtml(plant.stage)}</span>
          <span class="badge">${escapeHtml(plant.place)}</span>
          <span class="badge ${signal.tone === "warn" ? "warn" : signal.tone === "danger" ? "danger" : ""}">${signal.status}</span>
        </div>
        <div class="weatherStrip">
          ${
            weather
              ? `
                <div><span>High</span><strong>${weather.max.toFixed(0)}°C</strong></div>
                <div><span>Low</span><strong>${weather.min.toFixed(0)}°C</strong></div>
                <div><span>Rain</span><strong>${weather.rain.toFixed(1)}mm</strong></div>
                <p>${escapeHtml(weather.location)}</p>
              `
              : `
                <div><span>Weather</span><strong>Loading</strong></div>
                <p>Searching forecast for ${escapeHtml(plant.city)}${plant.region ? `, ${escapeHtml(plant.region)}` : ""}.</p>
              `
          }
        </div>
        <details class="collapsible ruleWindow" open>
          <summary>
            <span>Rule plan</span>
            <strong>${escapeHtml(signal.status)}</strong>
          </summary>
          <div class="signal">
            <span>Rule signal</span>
            <strong>${escapeHtml(signal.task)}</strong>
            <p>${escapeHtml(signal.reason)}</p>
            <div class="signalBasis">
              ${signal.basis.map((item) => `<em>${escapeHtml(item)}</em>`).join("")}
            </div>
          </div>
          <div class="plantAdvice">
            <div>
              <span>Placement</span>
              <p>${escapeHtml(signal.placement)}</p>
            </div>
            <div>
              <span>Fastest growth</span>
              <p>${escapeHtml(signal.growth)}</p>
            </div>
          </div>
          <button class="miniAction" data-add-rule="${plant.id}">Add rule advice to calendar</button>
        </details>
        <p>${escapeHtml(plant.notes || "No notes yet.")}</p>
        <div class="cardActions">
          <button class="cardButton" data-water="${plant.id}">Log watered</button>
          <button class="cardButton secondary" data-plan="${plant.id}">Qwen plan</button>
          <button class="cardButton secondary" data-chat="${plant.id}">Ask Qwen</button>
        </div>
      </div>
    `;
    elements.grid.appendChild(card);
  }

  elements.grid.querySelectorAll("[data-water]").forEach((button) => {
    button.addEventListener("click", () => {
      const plant = state.plants.find((item) => item.id === button.dataset.water);
      if (!plant) return;
      plant.lastWatered = today();
      plant.logs.unshift({ date: today(), action: "Watered" });
      saveState();
      persistCareLog(plant, "Watered");
      render();
    });
  });

  elements.grid.querySelectorAll("[data-plan]").forEach((button) => {
    button.addEventListener("click", () => generatePlantPlan(button.dataset.plan));
  });

  elements.grid.querySelectorAll("[data-chat]").forEach((button) => {
    button.addEventListener("click", () => openPlantChat(button.dataset.chat));
  });

  elements.grid.querySelectorAll("[data-add-rule]").forEach((button) => {
    button.addEventListener("click", () => {
      const plant = state.plants.find((item) => item.id === button.dataset.addRule);
      if (!plant) return;
      const signal = careSignal(plant);
      addCalendarItem({
        date: signal.nextWater || today(),
        title: signal.task,
        type: "advice",
        plantId: plant.id
      });
    });
  });

}

function renderCalendar() {
  elements.calendar.innerHTML = "";
  if (state.plants.length === 0) {
    elements.calendarPlantFilters.innerHTML = "";
    elements.calendar.innerHTML = `
      <div class="calendarEmpty">
        Your care calendar will appear after you add a plant.
      </div>
    `;
    return;
  }
  const days = Array.from({ length: 7 }, (_, index) => offsetDate(index));
  for (const date of days) {
    const day = document.createElement("div");
    const visiblePlants = filteredCalendarPlants();
    const weather = visiblePlants.map((plant) => weatherForDate(plant, date)).find(Boolean);
    day.className = `day ${weatherMood(weather)} ${date === today() ? "todayDay" : ""}`;
    const tasks = calendarTasksForDate(date);
    day.innerHTML = `
      <div class="dayTop">
        <strong>${formatDay(date)}</strong>
        <span>${weatherIcon(weather)} ${weather ? `${weather.max.toFixed(0)}°/${weather.min.toFixed(0)}°` : "--"}</span>
      </div>
      ${weather ? `<p class="dayForecast">${weather.rain.toFixed(1)}mm rain · ${escapeHtml(weather.location)}</p>` : ""}
      <div class="dayTasks">
        ${
          tasks.length
            ? renderCalendarTaskGroups(tasks)
            : `<span class="task emptyTask">Observe garden</span>`
        }
      </div>
    `;
    elements.calendar.appendChild(day);
  }
  elements.calendar.querySelectorAll("[data-remove-task]").forEach((button) => {
    button.addEventListener("click", () => removeCalendarTask(button.dataset.removeTask, button.dataset.taskKind));
  });
}

function renderCalendarFilters() {
  if (!state.plants.length) {
    elements.calendarPlantFilters.innerHTML = "";
    return;
  }
  if (selectedCalendarPlant !== "all" && !state.plants.some((plant) => plant.id === selectedCalendarPlant)) {
    selectedCalendarPlant = "all";
  }
  elements.calendarPlantFilters.innerHTML = `
    <button class="${selectedCalendarPlant === "all" ? "active" : ""}" data-calendar-plant="all">
      <span class="filterSwatch allSwatch">All</span>
      <strong>All plants</strong>
      <small>${state.plants.length} active</small>
    </button>
    ${state.plants.map((plant) => `
      <button class="${selectedCalendarPlant === plant.id ? "active" : ""}" data-calendar-plant="${escapeHtml(plant.id)}" style="--plant-color:${plantColor(plant.id)}">
        <img src="${escapeHtml(plant.image)}" alt="" />
        <strong>${escapeHtml(plant.name)}</strong>
        <small>${escapeHtml(plant.place)} · ${escapeHtml(plantTypeData(plant.type).label)}</small>
      </button>
    `).join("")}
  `;
  elements.calendarPlantFilters.querySelectorAll("[data-calendar-plant]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedCalendarPlant = button.dataset.calendarPlant || "all";
      renderCalendarFilters();
      renderCalendar();
    });
  });
}

function filteredCalendarPlants() {
  if (selectedCalendarPlant === "all") return state.plants;
  return state.plants.filter((plant) => plant.id === selectedCalendarPlant);
}

function calendarTasksForDate(date) {
  const hidden = new Set(state.hiddenCalendarItems || []);
  const visibleIds = new Set(filteredCalendarPlants().map((plant) => plant.id));
  const generated = filteredCalendarPlants()
    .flatMap((plant) => generatedTasksForPlant(plant, date))
    .filter((task) => !hidden.has(task.id));
  const custom = (state.calendarItems || []).filter(
    (item) => item.date === date && (selectedCalendarPlant === "all" || !item.plantId || visibleIds.has(item.plantId))
  );
  return uniqueCalendarTasks([...generated, ...custom]).sort(compareCalendarTasks).slice(0, 10);
}

function uniqueCalendarTasks(tasks) {
  const seen = new Set();
  return tasks.filter((task) => {
    const key = [task.date || "", task.plantId || "", task.type || "", task.title || ""].join("::").toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function compareCalendarTasks(first, second) {
  const firstPlant = plantOrder(first.plantId);
  const secondPlant = plantOrder(second.plantId);
  if (firstPlant !== secondPlant) return firstPlant - secondPlant;
  return taskPriority(first.type) - taskPriority(second.type);
}

function plantOrder(plantId = "") {
  const index = state.plants.findIndex((plant) => plant.id === plantId);
  return index >= 0 ? index : state.plants.length + 1;
}

function taskPriority(type = "") {
  const order = { protect: 0, weather: 1, rain: 2, water: 3, advice: 4, qwen: 5, custom: 6 };
  return order[type] ?? 9;
}

function generatedTasksForPlant(plant, date) {
  const signal = careSignal(plant);
  const tasks = [];
  if (isScheduledWaterDate(plant, signal, date)) {
    tasks.push({
      id: `auto:${date}:${plant.id}:water`,
      kind: "auto",
      type: signal.rainSkip ? "rain" : "water",
      title: signal.nextWater === date ? signal.task : "Scheduled watering check",
      plantId: plant.id,
      plantName: plant.name,
      placement: plant.place
    });
  }
  if (date === today() && signal.moveOrProtect) {
    tasks.push({
      id: `auto:${date}:${plant.id}:protect`,
      kind: "auto",
      type: "protect",
      title: signal.placement,
      plantId: plant.id,
      plantName: plant.name,
      placement: plant.place
    });
  }
  const weather = weatherForDate(plant, date);
  if (weather && (weather.rain >= 6 || weather.max >= 34 || weather.min <= 10)) {
    tasks.push({
      id: `auto:${date}:${plant.id}:weather`,
      kind: "auto",
      type: "weather",
      title: "Weather watch",
      plantId: plant.id,
      plantName: plant.name,
      placement: plant.place
    });
  }
  return tasks;
}

function isScheduledWaterDate(plant, signal, date) {
  const cadence = Math.max(1, Number(plant.wateringDays || 3));
  let cursor = signal.nextWater || addDays(plant.lastWatered, cadence);
  for (let index = 0; index < 5; index += 1) {
    if (cursor === date) return true;
    cursor = addDays(cursor, cadence);
  }
  return false;
}

function renderCalendarTask(task) {
  const plant = state.plants.find((item) => item.id === task.plantId);
  const plantName = task.plantName || plant?.name || "Garden";
  const placement = task.placement || plant?.place || "";
  return `
    <span class="task ${escapeHtml(task.type || "custom")}" style="--plant-color:${plantColor(task.plantId || plantName)}">
      <span>
        <b>${escapeHtml(plantName)}</b>
        <em>${escapeHtml(task.title)}</em>
        ${placement ? `<small>${escapeHtml(placement)}</small>` : ""}
      </span>
      ${task.kind === "empty" ? "" : `<button data-remove-task="${escapeHtml(task.id)}" data-task-kind="${escapeHtml(task.kind || "custom")}" title="Remove from calendar">×</button>`}
    </span>
  `;
}

function renderCalendarTaskGroups(tasks) {
  const groups = [];
  for (const task of tasks) {
    const key = task.plantId || "general";
    let group = groups.find((item) => item.key === key);
    if (!group) {
      const plant = state.plants.find((item) => item.id === task.plantId);
      group = {
        key,
        plant,
        plantName: task.plantName || plant?.name || "General",
        placement: task.placement || plant?.place || "",
        tasks: []
      };
      groups.push(group);
    }
    group.tasks.push(task);
  }

  return groups
    .map((group) => {
      const colorKey = group.plant?.id || group.plantName;
      return `
        <details class="calendarPlantGroup" open style="--plant-color:${plantColor(colorKey)}">
          <summary>
            ${
              group.plant
                ? `<img src="${escapeHtml(group.plant.image)}" alt="" />`
                : `<span class="groupFallback">All</span>`
            }
            <span>
              <b>${escapeHtml(group.plantName)}</b>
              <small>${escapeHtml(group.placement || `${group.tasks.length} item${group.tasks.length === 1 ? "" : "s"}`)}</small>
            </span>
            <em>${group.tasks.length}</em>
          </summary>
          <div class="calendarGroupTasks">
            ${group.tasks.map((task) => renderCalendarTask(task)).join("")}
          </div>
        </details>
      `;
    })
    .join("");
}

function addCalendarItem(item) {
  if (!item.title) return;
  const plant = state.plants.find((entry) => entry.id === item.plantId);
  const normalizedTitle = item.title.trim();
  const duplicate = (state.calendarItems || []).some(
    (entry) =>
      entry.date === item.date &&
      (entry.plantId || "") === (item.plantId || "") &&
      (entry.type || "custom") === (item.type || "custom") &&
      entry.title.trim().toLowerCase() === normalizedTitle.toLowerCase()
  );
  if (duplicate) return;
  state.calendarItems.unshift({
    id: crypto.randomUUID(),
    date: item.date,
    title: normalizedTitle,
    type: item.type || "custom",
    plantId: item.plantId || "",
    plantName: plant?.name || "",
    placement: plant?.place || ""
  });
  saveState();
  render();
}

function removeCalendarTask(id, kind) {
  if (kind === "auto") {
    state.hiddenCalendarItems = [...new Set([...(state.hiddenCalendarItems || []), id])];
  } else {
    state.calendarItems = (state.calendarItems || []).filter((item) => item.id !== id);
  }
  saveState();
  render();
}

function weatherIcon(weather) {
  const mood = weatherMood(weather);
  if (mood === "rainy") return "☔";
  if (mood === "hot") return "☀";
  if (mood === "sunny") return "☀";
  if (mood === "cold") return "❄";
  if (mood === "cloudy") return "☁";
  return "○";
}

function plantColor(value = "") {
  const colors = ["#2d7b4a", "#4f8fc7", "#b45f4a", "#8a6f21", "#6b7f35", "#7b6bb7", "#2f7b78"];
  const key = String(value || "garden");
  let hash = 0;
  for (let index = 0; index < key.length; index += 1) hash = (hash + key.charCodeAt(index) * (index + 1)) % colors.length;
  return colors[hash];
}

async function showCareExplanation(plantId) {
  const plant = state.plants.find((item) => item.id === plantId);
  if (!plant) return;
  const signal = careSignal(plant);
  const weather = dailyWeatherFor(plant);

  elements.dialogTitle.textContent = `${plant.name} care note`;
  elements.dialogBody.textContent = "Asking the local model for a concise explanation...";
  elements.dialog.showModal();

  const response = await fetch("/api/explain", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ plant, weather, signal })
  });
  const data = await response.json();
  elements.aiMode.textContent = data.model === "offline" ? "Rules" : data.model;
  elements.dialogBody.textContent = data.text;
}

async function generatePlantPlan(plantId) {
  const plant = state.plants.find((item) => item.id === plantId);
  if (!plant) return;
  const signal = careSignal(plant);
  const weather = dailyWeatherFor(plant);

  elements.dialogTitle.textContent = `${plant.name} Qwen plan`;
  elements.dialogBody.textContent = "Generating a local open-weight care plan with Qwen...";
  elements.dialog.showModal();

  const response = await fetch("/api/plan", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ plant, weather, signal })
  });
  const data = await response.json();
  if (!response.ok) {
    elements.dialogBody.textContent = data.error || "Could not generate Qwen plan.";
    return;
  }

  plant.aiPlan = {
    model: data.model,
    plan: data.plan,
    createdAt: new Date().toISOString()
  };
  saveState();
  elements.aiMode.textContent = data.model;
  elements.dialogBody.innerHTML = renderPlanDialog(data.plan, data.model);
  render();
}

function openPlantChat(plantId) {
  const plant = state.plants.find((item) => item.id === plantId);
  if (!plant) return;
  elements.dialogTitle.textContent = `${plant.name} Qwen chat`;
  elements.dialogBody.innerHTML = `
    <div class="chatPanel" data-chat-plant="${escapeHtml(plant.id)}">
      <div class="chatContext">
        <img src="${escapeHtml(plant.image)}" alt="" />
        <div>
          <strong>${escapeHtml(plant.name)}</strong>
          <span>${escapeHtml(plant.place)} · ${escapeHtml(plant.city)}${plant.region ? `, ${escapeHtml(plant.region)}` : ""}</span>
        </div>
      </div>
      <div class="chatMessages" id="chatMessages">
        <div class="chatBubble assistant">
          Ask about watering, placement, weather risk, completed tasks, or why a recommendation appeared. I will use this garden's saved history and schedule.
        </div>
      </div>
      <form class="chatForm" id="chatForm">
        <input id="chatQuestion" autocomplete="off" placeholder="Should I keep this outside tonight?" />
        <button class="primary" type="submit">Ask</button>
      </form>
    </div>
  `;
  elements.dialog.showModal();
  document.querySelector("#chatQuestion")?.focus();
  document.querySelector("#chatForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    askPlantQuestion(plant.id);
  });
}

async function askPlantQuestion(plantId) {
  const input = document.querySelector("#chatQuestion");
  const messages = document.querySelector("#chatMessages");
  const question = input?.value.trim();
  if (!question || !messages) return;
  const plant = state.plants.find((item) => item.id === plantId);
  if (!plant) return;
  input.value = "";
  messages.insertAdjacentHTML("beforeend", `<div class="chatBubble user">${escapeHtml(question)}</div>`);
  const pending = document.createElement("div");
  pending.className = "chatBubble assistant pending";
  pending.textContent = "Checking garden memory with Qwen...";
  messages.appendChild(pending);
  messages.scrollTop = messages.scrollHeight;

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      plantId,
      question,
      state: plantScopedState(plant),
      weather: dailyWeatherFor(plant),
      signal: careSignal(plant),
      schedule: buildPlantScheduleContext(plant)
    })
  });
  const data = await response.json();
  pending.classList.remove("pending");
  pending.textContent = response.ok ? data.text : data.error || "Qwen could not answer right now.";
  elements.aiMode.textContent = data.model || elements.aiMode.textContent;
  messages.scrollTop = messages.scrollHeight;
}

function plantScopedState(plant) {
  return {
    plants: [plant],
    calendarItems: (state.calendarItems || []).filter((item) => item.plantId === plant.id),
    hiddenCalendarItems: (state.hiddenCalendarItems || []).filter((item) => item.includes(`:${plant.id}:`))
  };
}

function buildPlantScheduleContext(plant) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = offsetDate(index);
    return {
      date,
      weather: weatherForDate(plant, date),
      generatedTasks: generatedTasksForPlant(plant, date),
      savedTasks: (state.calendarItems || []).filter((item) => item.date === date && item.plantId === plant.id)
    };
  });
}

function renderPlanDialog(plan, model) {
  const week = Array.isArray(plan.week) ? plan.week.slice(0, 5) : [];
  const watch = Array.isArray(plan.watch) ? plan.watch.slice(0, 4) : [];
  const todaySteps = Array.isArray(plan.todaySteps) ? plan.todaySteps.slice(0, 4) : [];
  return `
    <div class="planDialog">
      <section class="planTop">
        <div>
          <p>Local model plan</p>
          <h3>${escapeHtml(plan.focus || "Personalized next steps")}</h3>
        </div>
        <span>${escapeHtml(model)}</span>
      </section>

      <section class="planToday">
        <div class="planSectionTitle">Today's routine</div>
        ${todaySteps.length ? `
          <ol class="planSteps">
            ${todaySteps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
          </ol>
        ` : `<p>${escapeHtml(plan.today || "Check the plant once and follow the safest care signal.")}</p>`}
      </section>

      <div class="planDetailGrid">
        <section class="planDetail">
          <span>Placement</span>
          <p>${escapeHtml(plan.placement || "Keep placement steady and observe leaf posture.")}</p>
        </section>
        <section class="planDetail">
          <span>Watering</span>
          <p>${escapeHtml(plan.watering || "Check soil before watering.")}</p>
        </section>
        <section class="planDetail">
          <span>Growth experiment</span>
          <p>${escapeHtml(plan.growth || "Track one visible growth marker this week after keeping care consistent.")}</p>
        </section>
      </div>

      ${watch.length ? `
        <section class="planSection">
          <div class="planSectionTitle">Watch signals</div>
          <div class="planWatch">
            ${watch.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
          </div>
        </section>
      ` : ""}

      ${week.length ? `
        <section class="planSection">
          <div class="planSectionTitle">This week</div>
          <div class="planWeek">
            ${week.map((item) => `
              <div>
                <b>${escapeHtml(item.day || "")}</b>
                <p>${escapeHtml(item.task || "")}</p>
              </div>
            `).join("")}
          </div>
        </section>
      ` : ""}
    </div>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function locationKey(plant) {
  return `${plant.city || ""}||${plant.region || ""}`;
}

function normalizePlant(plant) {
  const type = plant.type || guessPlantType(plant.name);
  const data = plantTypeData(type);
  const brokenImage =
    !plant.image ||
    plant.image.includes("photo-1501004318641") ||
    plant.image.includes("photo-1593691509543-c55fb32e5cee") ||
    plant.image.includes("photo-1596547609652-9cf5d8cdd1bc") ||
    plant.image.includes("photo-1593482892290-f54927ae2b8f");
  return {
    ...plant,
    type,
    city: plant.city || "Pune",
    region: plant.region || "",
    image: brokenImage ? data.image : plant.image,
    wateringDays: Number(plant.wateringDays || calculateBaseCadence(data, plant.stage || "Mature", plant.place || "Outdoor")),
    light: plant.light || data.light
  };
}

function guessPlantType(name = "") {
  const normalized = name.toLowerCase();
  return Object.keys(plantLibrary).find((type) => normalized.includes(type)) || "basil";
}

syncFromBackend().then(render);
