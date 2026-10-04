import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { MongoClient } from "mongodb";

const root = process.cwd();
const publicDir = join(root, "public");
const port = Number(process.env.PORT || 3000);
const defaultGardenId = process.env.GARDEN_ID || "demo-garden";
const mongoUri = process.env.MONGODB_URI || "";
const mongoDbName = process.env.MONGODB_DB || "gardenbuddy";
let mongoClient;
let mongoDb;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function sendJson(response, status, payload) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

async function loadEnv() {
  try {
    const envText = await readFile(join(root, ".env"), "utf8");
    for (const line of envText.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const index = trimmed.indexOf("=");
      if (index < 0) continue;
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env is optional; production hosts usually provide real environment variables.
  }
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

async function getDb() {
  const uri = process.env.MONGODB_URI || mongoUri;
  if (!uri) return undefined;
  if (!mongoClient) {
    mongoClient = new MongoClient(uri);
    await mongoClient.connect();
    mongoDb = mongoClient.db(process.env.MONGODB_DB || mongoDbName);
    await mongoDb.collection("gardens").createIndex({ gardenId: 1 }, { unique: true });
    await mongoDb.collection("careLogs").createIndex({ gardenId: 1, plantId: 1, createdAt: -1 });
    await mongoDb.collection("aiPlans").createIndex({ gardenId: 1, plantId: 1, createdAt: -1 });
    await mongoDb.collection("plantMemories").createIndex({ gardenId: 1, plantId: 1, createdAt: -1 });
    await mongoDb.collection("plantMemories").createIndex({ gardenId: 1, plantId: 1, memoryText: "text", tags: "text" });
  }
  return mongoDb;
}

async function loadGarden(gardenId = defaultGardenId) {
  const db = await getDb();
  if (!db) return { mode: "local", plants: [], calendarItems: [], hiddenCalendarItems: [] };
  const garden = await db.collection("gardens").findOne({ gardenId });
  return {
    mode: "atlas",
    plants: garden?.plants || [],
    calendarItems: garden?.calendarItems || [],
    hiddenCalendarItems: garden?.hiddenCalendarItems || [],
    updatedAt: garden?.updatedAt
  };
}

async function saveGarden(payload, gardenId = defaultGardenId) {
  const db = await getDb();
  if (!db) return { mode: "local", saved: false };
  const now = new Date().toISOString();
  const plants = Array.isArray(payload?.plants) ? payload.plants : [];
  await db.collection("gardens").updateOne(
    { gardenId },
    {
      $set: {
        gardenId,
        plants,
        calendarItems: Array.isArray(payload?.calendarItems) ? payload.calendarItems : [],
        hiddenCalendarItems: Array.isArray(payload?.hiddenCalendarItems) ? payload.hiddenCalendarItems : [],
        updatedAt: now
      },
      $setOnInsert: {
        createdAt: now
      }
    },
    { upsert: true }
  );
  return { mode: "atlas", saved: true, updatedAt: now };
}

async function addCareLog(log, gardenId = defaultGardenId) {
  const db = await getDb();
  if (!db) return { mode: "local", saved: false };
  const document = {
    gardenId,
    ...log,
    createdAt: new Date().toISOString()
  };
  await db.collection("careLogs").insertOne(document);
  return { mode: "atlas", saved: true };
}

async function saveAiPlan(plan, gardenId = defaultGardenId) {
  const db = await getDb();
  if (!db) return { mode: "local", saved: false };
  await db.collection("aiPlans").insertOne({
    gardenId,
    ...plan,
    createdAt: new Date().toISOString()
  });
  return { mode: "atlas", saved: true };
}

async function loadGardenMemory(gardenId = defaultGardenId) {
  const garden = await loadGarden(gardenId);
  const db = await getDb();
  if (!db) return { ...garden, careLogs: [], aiPlans: [] };
  const [careLogs, aiPlans] = await Promise.all([
    db.collection("careLogs").find({ gardenId }).sort({ createdAt: -1 }).limit(40).toArray(),
    db.collection("aiPlans").find({ gardenId }).sort({ createdAt: -1 }).limit(20).toArray()
  ]);
  return { ...garden, careLogs, aiPlans };
}

function memoryKeywords(text = "") {
  const stop = new Set(["about", "after", "again", "because", "before", "could", "from", "have", "plant", "should", "that", "this", "today", "water", "what", "when", "where", "with", "would"]);
  return [...new Set(String(text).toLowerCase().match(/[a-z0-9]{4,}/g) || [])]
    .filter((word) => !stop.has(word))
    .slice(0, 12);
}

function memoryTextFor({ question, answer, selectedPlant, signal, weather }) {
  return [
    `Plant: ${selectedPlant?.name || ""} ${selectedPlant?.type || ""}`,
    `Question: ${question}`,
    `Answer: ${answer}`,
    `Signal: ${signal?.status || ""} ${signal?.task || ""} ${signal?.reason || ""}`,
    `Weather: ${weather?.max ?? ""} high ${weather?.min ?? ""} low ${weather?.rain ?? ""} rain`,
    `Placement: ${selectedPlant?.place || ""}`,
    `Notes: ${selectedPlant?.notes || ""}`
  ].join("\n");
}

async function findRelevantPlantMemories({ gardenId, plantId, question }) {
  const db = await getDb();
  if (!db) return [];
  const collection = db.collection("plantMemories");
  const keywords = memoryKeywords(question);
  const searchText = keywords.join(" ");
  let memories = [];
  if (searchText) {
    try {
      memories = await collection
        .find(
          { gardenId, plantId, $text: { $search: searchText } },
          { projection: { score: { $meta: "textScore" }, memoryText: 1, question: 1, answer: 1, tags: 1, createdAt: 1, signalStatus: 1 } }
        )
        .sort({ score: { $meta: "textScore" }, createdAt: -1 })
        .limit(5)
        .toArray();
    } catch {
      memories = [];
    }
  }
  if (memories.length) return memories;
  return collection
    .find(
      { gardenId, plantId },
      { projection: { memoryText: 1, question: 1, answer: 1, tags: 1, createdAt: 1, signalStatus: 1 } }
    )
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray();
}

async function savePlantMemory({ gardenId, plantId, plantName, question, answer, selectedPlant, signal, weather }) {
  const db = await getDb();
  if (!db) return { mode: "local", saved: false };
  const tags = memoryKeywords(`${question} ${answer} ${signal?.status || ""} ${signal?.task || ""} ${selectedPlant?.notes || ""}`);
  await db.collection("plantMemories").insertOne({
    gardenId,
    plantId,
    plantName,
    question,
    answer,
    signalStatus: signal?.status || "",
    weather,
    tags,
    memoryText: memoryTextFor({ question, answer, selectedPlant, signal, weather }),
    createdAt: new Date().toISOString()
  });
  return { mode: "atlas", saved: true };
}

async function getWeather(city, region = "") {
  const geoUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
  geoUrl.searchParams.set("name", city);
  geoUrl.searchParams.set("count", "10");
  geoUrl.searchParams.set("language", "en");
  geoUrl.searchParams.set("format", "json");

  const geoResponse = await fetch(geoUrl);
  if (!geoResponse.ok) throw new Error("Could not find that location.");
  const geo = await geoResponse.json();
  const regionWords = region
    .toLowerCase()
    .match(/[a-z0-9]+/g)
    ?.filter((word) => word.length >= 3) || [];
  const place =
    geo.results?.find((candidate) => {
      const searchable = [candidate.name, candidate.admin1, candidate.admin2, candidate.country]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return regionWords.length > 0 && regionWords.some((word) => searchable.includes(word));
    }) || geo.results?.[0];
  if (!place) throw new Error("Could not find that location.");

  const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
  weatherUrl.searchParams.set("latitude", String(place.latitude));
  weatherUrl.searchParams.set("longitude", String(place.longitude));
  weatherUrl.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,precipitation_sum");
  weatherUrl.searchParams.set("forecast_days", "7");
  weatherUrl.searchParams.set("timezone", "auto");

  const weatherResponse = await fetch(weatherUrl);
  if (!weatherResponse.ok) throw new Error("Could not load weather.");
  const weather = await weatherResponse.json();

  return {
    location: `${place.name}${place.admin1 ? `, ${place.admin1}` : ""}${place.country ? `, ${place.country}` : ""}`,
    latitude: place.latitude,
    longitude: place.longitude,
    daily: weather.daily
  };
}

async function searchLocations(query) {
  const geoUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
  geoUrl.searchParams.set("name", query);
  geoUrl.searchParams.set("count", "8");
  geoUrl.searchParams.set("language", "en");
  geoUrl.searchParams.set("format", "json");

  const response = await fetch(geoUrl);
  if (!response.ok) throw new Error("Could not search locations.");
  const geo = await response.json();
  return (geo.results || []).map((place) => ({
    name: place.name,
    region: [place.admin1, place.country].filter(Boolean).join(", "),
    label: [place.name, place.admin1, place.country].filter(Boolean).join(", "),
    latitude: place.latitude,
    longitude: place.longitude
  }));
}

async function explainCare(payload) {
  const model = process.env.OLLAMA_MODEL || "qwen2.5:3b";
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
  const prompt = `You are GardenBuddy, a concise plant-care decision assistant.
Return 4 specific bullet points only.
Use the computed care signal as the source of truth.
Mention whether to keep the plant outside, move it, shade it, water it, or skip watering.
Avoid generic plant advice. Avoid medical-style certainty. Say "check" or "possible" for issues.

Plant:
${JSON.stringify(payload.plant, null, 2)}

Weather:
${JSON.stringify(payload.weather, null, 2)}

Computed care signal:
${JSON.stringify(payload.signal, null, 2)}`;

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "You explain plant care clearly and briefly." },
        { role: "user", content: prompt }
      ],
      stream: false,
      options: {
        temperature: 0.2,
        num_ctx: 4096,
        num_predict: 220
      }
    })
  });

  if (!response.ok) throw new Error(`Ollama returned ${response.status}.`);
  const data = await response.json();
  return {
    model,
    text: data.message?.content?.trim() || "No explanation returned."
  };
}

function extractJson(text) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return extractJson(fenced[1]);
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) return trimmed;
  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first >= 0 && last > first) return trimmed.slice(first, last + 1);
  throw new Error("Model did not return JSON.");
}

function parsePlanJson(text) {
  try {
    return JSON.parse(extractJson(text || ""));
  } catch {
    return undefined;
  }
}

function stringifyPlanField(value) {
  if (Array.isArray(value)) return value.map(stringifyPlanField).filter(Boolean).join(". ");
  if (typeof value === "string") {
    return value
      .replace(/\s+/g, " ")
      .replace(/\s*,\s*(?=[A-Z])/g, ". ")
      .replace(/\s*,\s*(?=(check|inspect|water|move|place|keep|watch|monitor|avoid)\b)/gi, ". ")
      .trim();
  }
  if (value == null) return "";
  return String(value);
}

function normalizePlanSteps(value, fallback = "") {
  const raw = Array.isArray(value) ? value : [stringifyPlanField(value || fallback)];
  return raw
    .flatMap((item) => stringifyPlanField(item).split(/\.\s+|\n+|;\s+/))
    .map((item) => item.replace(/^[-*\d. )]+/, "").trim())
    .filter((item) => item.length > 4)
    .slice(0, 4);
}

function normalizeGrowthAdvice(value) {
  const growth = stringifyPlanField(value);
  if (!growth) return "";
  if (/\b(seed|seeds|germinat|sprout|propagat|cutting|sow)\b/i.test(growth)) {
    return "Run a one-week growth check on this existing plant: keep placement steady, mark one new leaf or flower cluster, and compare posture at the same time each day.";
  }
  return growth;
}

function normalizeCarePlan(rawPlan, signal) {
  const plan = rawPlan && typeof rawPlan === "object" ? rawPlan : {};
  const watering = stringifyPlanField(plan.watering);
  const today = stringifyPlanField(plan.today);
  const todaySteps = normalizePlanSteps(plan.todaySteps || plan.today, today);
  const week = Array.isArray(plan.week) ? plan.week : [];
  const shouldSkipWater = /skip|avoid watering|do not water/i.test(watering);

  return {
    focus: stringifyPlanField(plan.focus) || "Turn today's signal into a practical plant-care routine.",
    today,
    todaySteps,
    placement: stringifyPlanField(plan.placement),
    watering,
    growth: normalizeGrowthAdvice(plan.growth),
    watch: Array.isArray(plan.watch) ? plan.watch.map(stringifyPlanField).filter(Boolean).slice(0, 4) : [],
    week: week
      .map((item, index) => {
        const day = stringifyPlanField(item?.day) || (index === 0 ? "Today" : `Day ${index + 1}`);
        let task = stringifyPlanField(item?.task);
        if (shouldSkipWater && index > 0) task = task.replace(/\bwater(?:ing)?\b[^.;]*/gi, "check soil moisture");
        return { day, task };
      })
      .filter((item) => item.task)
      .slice(0, 5),
    sourceSignal: {
      status: signal?.status,
      task: signal?.task
    }
  };
}

function fallbackCarePlan(payload, context) {
  const plant = context?.selectedPlant || payload.plant || {};
  const signal = payload.signal || {};
  const weather = payload.weather || {};
  const status = signal.status || "Care check";
  return normalizeCarePlan(
    {
      focus: `${status}: keep ${plant.name || "this plant"} steady while checking the latest conditions.`,
      today: signal.task || "Check soil, leaves, and placement once today.",
      todaySteps: [
        signal.task || "Check soil moisture before changing care.",
        signal.placement || "Keep placement steady unless weather looks risky.",
        "Log what you do so future advice can compare patterns."
      ],
      placement: signal.placement || "Use the saved placement and adjust only for harsh sun, heavy rain, or cold.",
      watering: signal.reason || "Use the saved watering rhythm and check soil before adding water.",
      growth: signal.growth || "Track one visible leaf, bud, or stem marker this week.",
      watch: [
        "Leaf posture compared with yesterday",
        weather.rain ? `${weather.rain}mm rain may affect watering` : "Top soil dryness before watering",
        "Any repeat of symptoms mentioned in notes"
      ],
      week: [
        { day: "Today", task: signal.task || "Check soil and leaf posture" },
        { day: "Tomorrow", task: "Compare leaf posture and soil moisture" },
        { day: "Day 3", task: "Review whether the same symptom repeated" }
      ]
    },
    signal
  );
}

async function buildPlantIntelligenceContext(payload, gardenId, query) {
  const memory = await loadGardenMemory(gardenId);
  const selectedPlant =
    memory.plants.find((plant) => plant.id === payload.plantId || plant.id === payload.plant?.id) ||
    payload.plant ||
    payload.state?.plants?.find((plant) => plant.id === payload.plantId);

  if (!selectedPlant) throw new Error("Plant not found.");

  const plantId = selectedPlant.id;
  const plantCalendarItems = (memory.calendarItems || []).filter((item) => item.plantId === plantId);
  const plantCareLogs = (memory.careLogs || []).filter((log) => log.plantId === plantId);
  const plantAiPlans = (memory.aiPlans || []).filter((plan) => plan.plantId === plantId);
  const cancelledGeneratedActionsForPlant = (memory.hiddenCalendarItems || []).filter((item) => item.includes(`:${plantId}:`));
  const browserPlant = payload.state?.plants?.find((plant) => plant.id === plantId);
  const browserPlantCalendarItems = (payload.state?.calendarItems || []).filter((item) => item.plantId === plantId);
  const relevantPastMemories = await findRelevantPlantMemories({
    gardenId,
    plantId,
    question: query
  });

  return {
    plantId,
    selectedPlant,
    context: {
      selectedPlant,
      browserPlant,
      relevantPastMemories,
      plantCalendarItems,
      browserPlantCalendarItems,
      cancelledGeneratedActionsForPlant,
      plantCareLogs,
      plantAiPlans,
      currentWeather: payload.weather,
      currentRuleSignal: payload.signal,
      selectedPlantSevenDaySchedule: payload.schedule
    }
  };
}

async function generateCarePlan(payload, gardenId = defaultGardenId) {
  const model = process.env.OLLAMA_MODEL || "qwen2.5:3b";
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
  const { selectedPlant, context } = await buildPlantIntelligenceContext(
    payload,
    gardenId,
    `care plan ${payload.signal?.status || ""} ${payload.signal?.task || ""} ${payload.plant?.notes || ""}`
  );
  const jsonShape = `{
  "focus": "one short strategic focus for this plant",
  "today": "one-sentence summary of today's routine",
  "todaySteps": ["2-3 short timed actions for today"],
  "placement": "precise placement timing",
  "watering": "specific soil-check and watering guidance",
  "growth": "one small experiment on this exact plant",
  "watch": ["2-3 observable signals"],
  "week": [
    {"day": "Today", "task": "specific task"},
    {"day": "Tomorrow", "task": "specific task"},
    {"day": "Day 3", "task": "specific task"}
  ]
}`;
  const prompt = `You are GardenBuddy's open-weight plant care planner.
The deterministic rule signal is already visible in the UI. Do not repeat it.
Use it only as safety constraints, then create a practical micro-plan the rules cannot provide.
Return only valid JSON. No markdown. No commentary. No trailing commas.
Make the plan specific to the plant, stage, placement, sunlight, user notes, and weather.
Include concrete timing, simple checks, and a small growth experiment for the existing plant.
Use relevantPastMemories to avoid repeating advice that failed before and to call out recurring patterns.
Do not invent disease diagnoses. Say "check" for possible issues.
Do not suggest planting seeds, germinating, propagation, new cuttings, repotting, or fertilizer products unless the user's notes explicitly ask for that.
Keep every field short. Today must be separate action steps, not one comma-packed sentence.

JSON shape:
${jsonShape}

Selected plant intelligence context:
${JSON.stringify(context, null, 2)}`;

  const requestPlan = async (messages, options = {}) => {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
        format: "json",
        options: {
          temperature: options.temperature ?? 0.1,
          num_ctx: options.num_ctx ?? 8192,
          num_predict: options.num_predict ?? 650
        }
      })
    });
    if (!response.ok) throw new Error(`Ollama returned ${response.status}.`);
    return response.json();
  };

  const data = await requestPlan([
    { role: "system", content: "Return only valid JSON for GardenBuddy care plans. Never include markdown." },
    { role: "user", content: prompt }
  ]);

  let rawPlan = parsePlanJson(data.message?.content || "");
  if (!rawPlan) {
    const repair = await requestPlan(
      [
        { role: "system", content: "Convert the user's content into valid JSON only. No markdown. No explanation." },
        {
          role: "user",
          content: `Return a JSON object matching this exact shape:\n${jsonShape}\n\nInvalid model output:\n${data.message?.content || ""}`
        }
      ],
      { temperature: 0, num_ctx: 4096, num_predict: 500 }
    );
    rawPlan = parsePlanJson(repair.message?.content || "");
  }

  const plan = rawPlan ? normalizeCarePlan(rawPlan, payload.signal) : fallbackCarePlan(payload, context);
  const memory = await savePlantMemory({
    gardenId,
    plantId: selectedPlant.id,
    plantName: selectedPlant.name,
    question: "Generate care plan",
    answer: JSON.stringify(plan),
    selectedPlant,
    signal: payload.signal,
    weather: payload.weather
  });
  return {
    model,
    plan,
    memory: {
      retrieved: context.relevantPastMemories.length,
      persistence: memory
    }
  };
}

async function chatWithGarden(payload, gardenId = defaultGardenId) {
  const model = process.env.OLLAMA_MODEL || "qwen2.5:3b";
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
  const { plantId, selectedPlant, context } = await buildPlantIntelligenceContext(payload, gardenId, payload.question);

  const prompt = `You are GardenBuddy's local open-weight plant chat assistant.
Answer using the selected plant memory below.
This memory is intentionally scoped to one plant because plants may live in different places.
Use this plant's watering history, notes, placement, calendar tasks, cancelled actions, and past Qwen plans to recognize repeated issues.
When relevantPastMemories contains a similar older incident, explicitly say it looks similar to that prior incident and cite the date.
Do not use other plants as evidence unless the user explicitly asks for a comparison.
If the user asks why, mention the specific data point that drove the advice.
Do not pretend you can see the plant. Say "check" for visual symptoms.
Keep the answer practical and concise.

Selected plant memory:
${JSON.stringify(context, null, 2)}

User question:
${payload.question}`;

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "You answer plant-care questions from structured garden memory." },
        { role: "user", content: prompt }
      ],
      stream: false,
      options: {
        temperature: 0.2,
        num_ctx: 8192,
        num_predict: 420
      }
    })
  });

  if (!response.ok) throw new Error(`Ollama returned ${response.status}.`);
  const data = await response.json();
  const text = data.message?.content?.trim() || "I could not generate a useful answer.";
  const persistence = await savePlantMemory({
    gardenId,
    plantId,
    plantName: selectedPlant.name,
    question: payload.question,
    answer: text,
    selectedPlant,
    signal: payload.signal,
    weather: payload.weather
  });
  return {
    model,
    text,
    memory: {
      retrieved: context.relevantPastMemories.length,
      persistence
    }
  };
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host}`);
    const gardenId = url.searchParams.get("gardenId")?.trim() || process.env.GARDEN_ID || defaultGardenId;

    if (request.method === "GET" && url.pathname === "/api/state") {
      return sendJson(response, 200, await loadGarden(gardenId));
    }

    if (request.method === "PUT" && url.pathname === "/api/state") {
      const body = JSON.parse(await readBody(request));
      return sendJson(response, 200, await saveGarden(body, body.gardenId || gardenId));
    }

    if (request.method === "POST" && url.pathname === "/api/logs") {
      const body = JSON.parse(await readBody(request));
      return sendJson(response, 200, await addCareLog(body, body.gardenId || gardenId));
    }

    if (request.method === "GET" && url.pathname === "/api/weather") {
      const city = url.searchParams.get("city")?.trim();
      const region = url.searchParams.get("region")?.trim() || "";
      if (!city) return sendJson(response, 400, { error: "City is required." });
      return sendJson(response, 200, await getWeather(city, region));
    }

    if (request.method === "GET" && url.pathname === "/api/locations") {
      const query = url.searchParams.get("q")?.trim();
      if (!query || query.length < 2) return sendJson(response, 200, { locations: [] });
      return sendJson(response, 200, { locations: await searchLocations(query) });
    }

    if (request.method === "POST" && url.pathname === "/api/explain") {
      const body = JSON.parse(await readBody(request));
      try {
        const explanation = await explainCare(body);
        const persistence = await saveAiPlan({
          plantId: body.plant?.id,
          plantName: body.plant?.name,
          model: explanation.model,
          text: explanation.text,
          signal: body.signal,
          weather: body.weather
        }, body.gardenId || gardenId);
        return sendJson(response, 200, { ...explanation, persistence });
      } catch (error) {
        return sendJson(response, 200, {
          model: "offline",
          text:
            "AI explanation is unavailable because Ollama is not running. The care plan still works from local plant rules and weather data."
        });
      }
    }

    if (request.method === "POST" && url.pathname === "/api/plan") {
      const body = JSON.parse(await readBody(request));
      try {
        const generated = await generateCarePlan(body, body.gardenId || gardenId);
        const persistence = await saveAiPlan({
          plantId: body.plant?.id,
          plantName: body.plant?.name,
          model: generated.model,
          plan: generated.plan,
          signal: body.signal,
          weather: body.weather
        }, body.gardenId || gardenId);
        return sendJson(response, 200, { ...generated, persistence });
      } catch (error) {
        return sendJson(response, 500, {
          error: error instanceof Error ? error.message : "Could not generate care plan."
        });
      }
    }

    if (request.method === "POST" && url.pathname === "/api/chat") {
      const body = JSON.parse(await readBody(request));
      if (!body.question?.trim()) return sendJson(response, 400, { error: "Question is required." });
      try {
        return sendJson(response, 200, await chatWithGarden(body, body.gardenId || gardenId));
      } catch (error) {
        return sendJson(response, 500, {
          error: error instanceof Error ? error.message : "Could not answer plant question."
        });
      }
    }

    const requested = url.pathname === "/" ? "/index.html" : url.pathname;
    const safePath = normalize(requested).replace(/^(\.\.[/\\])+/, "");
    const filePath = join(publicDir, safePath);
    const file = await readFile(filePath);
    response.writeHead(200, { "content-type": mimeTypes[extname(filePath)] || "application/octet-stream" });
    response.end(file);
  } catch (error) {
    if (error.code === "ENOENT") {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    sendJson(response, 500, { error: error instanceof Error ? error.message : "Server error" });
  }
});

await loadEnv();
server.listen(port, () => {
  console.log(`GardenBuddy running at http://localhost:${port}`);
  console.log(process.env.MONGODB_URI ? "MongoDB Atlas persistence: enabled" : "MongoDB Atlas persistence: local fallback");
});
