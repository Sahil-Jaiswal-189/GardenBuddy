# GardenBuddy

A weather-aware plant care companion built for the Hacktoberfest Weekend Challenge.

GardenBuddy helps a friend keep plants alive by combining plant stage, sunlight, watering history, local weather, MongoDB Atlas memory, and local Qwen care planning into a simple dashboard.

## Run locally

```bash
npm start
```

Open `http://localhost:3000`.

## Optional AI

If Ollama is running, GardenBuddy calls `qwen2.5:3b` by default for open-weight care planning.

```bash
ollama serve
OLLAMA_MODEL=qwen2.5:3b npm start
```

The app still works without Ollama, but Qwen care plans are the intended open-source AI layer for the challenge submission.

## MongoDB Atlas

GardenBuddy can use MongoDB Atlas as its data layer. Create `.env` from `.env.example`:

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

### Atlas setup

1. Create a free MongoDB Atlas cluster.
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

`aiPlans` stores open-model care explanations:

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

`plantMemories` stores plant-scoped Qwen chat memories:

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

Before Qwen answers a plant chat, GardenBuddy queries Atlas for prior `plantMemories` for that same plant using a text index and keyword fallback. The retrieved incidents are passed into the open-weight model so it can say when a symptom or care pattern looks similar to something that happened before.

### Indexes

GardenBuddy creates these indexes automatically:

```js
gardens: { gardenId: 1 } unique
careLogs: { gardenId: 1, plantId: 1, createdAt: -1 }
aiPlans: { gardenId: 1, plantId: 1, createdAt: -1 }
plantMemories: { gardenId: 1, plantId: 1, createdAt: -1 }
plantMemories text: { gardenId: 1, plantId: 1, memoryText: "text", tags: "text" }
```

### Verify Atlas mode

Open `http://localhost:3000`. The top weather panel should show:

```txt
Data layer: MongoDB Atlas
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
- generated Qwen care plans
- plant-scoped Qwen chat memories
- garden state

Without `MONGODB_URI`, the app falls back to browser `localStorage`.

## Prize category path

- Qwen: open-weight care planning layer through Ollama.
- MongoDB Atlas: plant-scoped long-term memory for the Qwen agent, including chat incident recall through `plantMemories` text retrieval.
- Mastra: later agent orchestration layer for tools and care workflows.
- Temporal: later durable reminder workflow.
- Entire: later agent-session evidence for the DEV write-up.
