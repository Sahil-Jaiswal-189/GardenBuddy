# GardenBuddy

A weather-aware plant care companion.

GardenBuddy helps plant owners make better daily care decisions by combining plant stage, sunlight, watering history, local weather, long-term plant memory, and optional local AI planning into a simple dashboard.

## Run locally

```bash
npm start
```

Open `http://localhost:3000`.

## Optional Local AI

If Ollama is running, GardenBuddy calls `qwen2.5:3b` by default for local care planning.

```bash
ollama serve
OLLAMA_MODEL=qwen2.5:3b npm start
```

The app still works without Ollama. In that mode, GardenBuddy uses deterministic care rules, weather, and stored plant history.

## Optional Cloud Database

GardenBuddy can use MongoDB as its cloud data layer. Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Set:

```bash
MONGODB_URI="mongodb+srv://..."
MONGODB_DB=gardenbuddy
GARDEN_ID=demo-garden
```

Do not commit `.env`. It is ignored by git.

### Database setup

1. Create a MongoDB database.
2. Create a database user with read/write permissions.
3. Add your IP address to Network Access. For a quick local demo, use your current IP. For a hosted demo, add the host's outbound IP or use Atlas's temporary broad access option carefully.
4. Copy the Node.js connection string from Atlas.
5. Paste it into `.env` as `MONGODB_URI`.
6. Start GardenBuddy:

```bash
npm start
```

You do not need to manually create collections. GardenBuddy creates them automatically on first use.

To initialize and verify the collections manually, run:

```bash
npm run setup:mongodb
```

### Collections

GardenBuddy uses four MongoDB collections:

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
  createdAt: "2026-10-04T...",
  updatedAt: "2026-10-04T..."
}
```

`careLogs` stores individual plant-care events:

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

`aiPlans` stores generated care explanations:

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

`plantMemories` stores plant-scoped AI chat memories:

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

Before the assistant answers a plant chat, GardenBuddy queries prior `plantMemories` for that same plant using a text index and keyword fallback. The retrieved incidents are passed into the local model so it can say when a symptom or care pattern looks similar to something that happened before.

### Indexes

GardenBuddy creates these indexes automatically:

```js
gardens: { gardenId: 1 } unique
careLogs: { gardenId: 1, plantId: 1, createdAt: -1 }
aiPlans: { gardenId: 1, plantId: 1, createdAt: -1 }
plantMemories: { gardenId: 1, plantId: 1, createdAt: -1 }
plantMemories text: { gardenId: 1, plantId: 1, memoryText: "text", tags: "text" }
```

### Verify cloud mode

Open `http://localhost:3000`. The top weather panel should show:

```txt
Data layer: cloud database
```

You can also test:

```bash
curl http://localhost:3000/api/state
```

Expected:

```json
{"mode":"atlas","plants":[]}
```

When `MONGODB_URI` is present, the app stores:

- plant profiles
- watering logs
- generated care plans
- plant-scoped chat memories
- garden state

Without `MONGODB_URI`, the app falls back to browser `localStorage`.
