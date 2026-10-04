# GardenBuddy

GardenBuddy is a weather-aware plant care dashboard for people who want simple, practical help with their plants.

It tracks each plant separately, checks the local forecast for that plant's city, creates a care calendar, and can use a local open-weight model through Ollama for plant-specific planning and chat. The app is designed to stay useful even when the AI model is not running.

## What It Does

- Add plants with name, type, city, region, stage, placement, sunlight, watering rhythm, and notes.
- Fetch a 7-day forecast for each plant location using Open-Meteo.
- Show clear care signals such as `Needs water`, `Skip watering`, `Heat watch`, `Protect from rain`, and `Too cold outside`.
- Build a horizontal care calendar with watering checks, weather warnings, and user-added tasks.
- Let you log care actions such as watering.
- Keep plant-specific memory, so later AI answers can refer to past issues for that same plant.
- Store data in MongoDB when configured, or fall back to browser storage for a quick local demo.
- Use optional local AI through Ollama for care plans and plant questions.

## How It Works

GardenBuddy combines three layers:

1. Plant profile data entered by the user.
2. Live weather data from Open-Meteo.
3. Care rules and optional local AI.

The rule engine always runs first. It decides the main care signal from watering cadence, placement, rainfall, high temperature, low temperature, and plant notes. If Ollama is available, the AI planner uses the same plant context plus saved memory to produce a more detailed plan or answer questions.

The AI does not replace the rules. It adds explanation, pattern recognition, and plant-specific guidance on top of the computed care signal.

## Project Structure

```txt
GardenBuddy/
+-- public/
|   +-- index.html
|   +-- app.js
|   +-- styles.css
+-- scripts/
|   +-- setup-mongodb.mjs
+-- server.mjs
+-- package.json
+-- README.md
+-- SPEC.md
```

## Requirements

- Node.js 18 or newer
- npm
- Optional: Ollama for local AI
- Optional: MongoDB Atlas or another MongoDB database for cloud persistence

## Run Locally

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm start
```

Open:

```txt
http://localhost:3000
```

If no database is configured, GardenBuddy still runs and stores data in the browser.

## Optional Local AI

GardenBuddy can use a local Ollama model for care plans and plant chat.

Install and start Ollama, then pull the default model:

```bash
ollama pull qwen2.5:3b
ollama serve
```

In another terminal, start GardenBuddy:

```bash
OLLAMA_MODEL=qwen2.5:3b npm start
```

You can also place this in `.env`:

```txt
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen2.5:3b
```

If Ollama is not running, the app continues to work with rules, weather, calendar, and stored data. Only AI-generated plans and chat answers are unavailable.

## Optional MongoDB Setup

MongoDB is used when you want data to persist outside the browser. This is useful for demos, hosted deployments, and keeping plant history across devices.

Create a local `.env` file:

```bash
cp .env.example .env
```

Set these values:

```txt
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/?appName=GardenBuddy
MONGODB_DB=gardenbuddy
GARDEN_ID=demo-garden
```

Do not commit `.env`. It is already ignored by git.

### MongoDB Atlas Steps

1. Create a MongoDB Atlas project and cluster.
2. Create a database user with read/write access.
3. Add your current IP address in Network Access.
4. Copy the Node.js connection string from Atlas.
5. Paste it into `.env` as `MONGODB_URI`.
6. Run the setup script:

```bash
npm run setup:mongodb
```

The setup script creates indexes only. It does not delete existing data.

You do not need to manually create collections. GardenBuddy creates collections on first use.

## Database Collections

GardenBuddy uses four collections:

```txt
gardens
careLogs
aiPlans
plantMemories
```

`gardens` stores the current garden state:

```js
{
  gardenId: "demo-garden",
  plants: [],
  calendarItems: [],
  hiddenCalendarItems: [],
  createdAt: "2026-10-04T...",
  updatedAt: "2026-10-04T..."
}
```

`careLogs` stores care actions:

```js
{
  gardenId: "demo-garden",
  plantId: "...",
  plantName: "Kitchen basil",
  action: "Watered",
  date: "2026-10-04",
  createdAt: "2026-10-04T..."
}
```

`aiPlans` stores generated care plans:

```js
{
  gardenId: "demo-garden",
  plantId: "...",
  plantName: "Kitchen basil",
  model: "qwen2.5:3b",
  text: "...",
  signal: {},
  weather: {},
  createdAt: "2026-10-04T..."
}
```

`plantMemories` stores plant-specific AI memory:

```js
{
  gardenId: "demo-garden",
  plantId: "...",
  plantName: "Kitchen basil",
  question: "Why are the leaves yellow again?",
  answer: "This looks similar to...",
  signalStatus: "Skip watering",
  tags: ["yellow", "leaves", "rain"],
  memoryText: "Plant: ...\nQuestion: ...\nAnswer: ...",
  createdAt: "2026-10-04T..."
}
```

Before answering a plant chat, GardenBuddy searches previous `plantMemories` for that same plant. This keeps the memory focused. A tomato plant's history will not be mixed with a snake plant's history.

## Environment Variables

```txt
MONGODB_URI       Optional MongoDB connection string.
MONGODB_DB        MongoDB database name. Defaults to gardenbuddy.
GARDEN_ID         Garden state key. Defaults to demo-garden.
OLLAMA_BASE_URL   Ollama server URL. Defaults to http://127.0.0.1:11434.
OLLAMA_MODEL      Local model name. Defaults to qwen2.5:3b.
```

## Scripts

```bash
npm start          # Start the app
npm run dev        # Same as npm start
npm run setup:mongodb
                   # Create MongoDB indexes and verify the connection
```

## Verify Storage Mode

Open the app and check the top status text:

```txt
Data layer: cloud database
```

You can also check the API:

```bash
curl http://localhost:3000/api/state
```

When MongoDB is configured, the response includes:

```json
{"mode":"atlas","plants":[]}
```

Without `MONGODB_URI`, the app returns local mode and uses browser storage.

## Troubleshooting

If plant data disappears after refreshing, check whether you are using browser storage or MongoDB. Browser storage is tied to the current browser and domain.

If AI plans fail, make sure Ollama is running and the model is installed:

```bash
ollama list
```

If weather does not load, check the city and region. GardenBuddy uses Open-Meteo geocoding, so more specific locations usually work better.

If MongoDB connection fails, confirm the connection string, database user password, and Atlas Network Access settings.
