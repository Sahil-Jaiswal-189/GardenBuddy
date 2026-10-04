# GardenBuddy Product Spec

## Purpose

GardenBuddy helps plant owners make better daily care decisions without needing to read long plant guides or remember every previous issue.

The app turns a plant profile, local weather, watering history, calendar tasks, and plant-specific memory into a clear care view. The goal is not to be a generic chatbot. The goal is to help someone quickly decide what to do for a plant today.

## Target User

GardenBuddy is built for casual plant owners and hobby gardeners who:

- Own multiple plants with different care needs.
- Forget when they last watered.
- Are unsure whether rain, heat, or cold should change the plan.
- Want quick guidance without searching through many websites.
- Notice repeated symptoms but do not remember what happened last time.

## Current Scope

The current version supports:

- Plant creation and removal.
- City and region selection.
- Plant type search.
- Indoor, outdoor, and balcony placement.
- Sunlight preference, growth stage, last watered date, watering cadence, and notes.
- 7-day weather forecast.
- Rule-based care signals.
- Plant cards with real plant images.
- Horizontal care calendar.
- Manual calendar tasks.
- Generated calendar items for watering and weather risks.
- Care logging.
- Optional local AI care plan.
- Optional local AI plant chat.
- MongoDB persistence when configured.
- Browser storage fallback when MongoDB is not configured.

## Non-Goals

GardenBuddy does not currently try to:

- Diagnose plant disease with image recognition.
- Control real watering hardware.
- Replace expert horticulture advice.
- Support multiple user accounts.
- Sync gardens between different users.
- Use paid hosted AI APIs.

These can be added later, but they are outside the current build.

## Main User Flows

### Add a Plant

1. User enters plant name, plant type, city, region, stage, placement, sunlight, last watered date, watering cadence, and optional notes.
2. GardenBuddy saves the plant.
3. GardenBuddy fetches weather for the plant location.
4. The plant appears in the dashboard with a care signal and weather strip.

### Check Today's Care

1. GardenBuddy calculates the plant's rule signal.
2. The UI shows the action, reason, placement advice, fastest growth advice, and weather summary.
3. User can add the advice to the calendar or log care after completing it.

### Use the Calendar

1. User opens the horizontal calendar.
2. Calendar groups tasks by plant.
3. User can filter by one plant or select all plants.
4. Auto-generated watering and weather tasks appear beside manual tasks.
5. User can remove a specific calendar item when it is not useful.

### Ask the AI Assistant

1. User opens the AI assistant for one plant.
2. GardenBuddy gathers that plant's profile, weather, rule signal, care logs, calendar items, cancelled items, previous plans, and plant memories.
3. The local model answers using only that plant's context.
4. The question and answer are stored as a new plant memory if MongoDB is configured.

## System Architecture

```txt
Browser UI
  |
  | HTTP
  v
Node server
  |
  |-- Open-Meteo geocoding and forecast
  |-- Ollama local AI API
  |-- MongoDB persistence
  |
  v
Static frontend state + optional database state
```

### Frontend

The frontend is plain HTML, CSS, and JavaScript in `public/`.

Responsibilities:

- Render plant cards.
- Manage form state.
- Calculate visible care signals.
- Render calendar groups.
- Store fallback state in `localStorage`.
- Call backend APIs for weather, persistence, AI plans, and AI chat.

### Backend

The backend is `server.mjs`, a small Node HTTP server.

Responsibilities:

- Serve the static frontend.
- Load `.env` values.
- Read and write garden state.
- Store care logs, AI plans, and plant memories.
- Fetch weather and location suggestions from Open-Meteo.
- Call Ollama when local AI is available.
- Return graceful fallback messages when AI or database services are offline.

## Care Logic

The rule engine calculates a care signal from:

- Days since last watered.
- Saved watering cadence.
- Plant placement.
- Sunlight preference.
- Forecast high temperature.
- Forecast low temperature.
- Forecast rainfall.
- Plant notes.

Example outputs:

```txt
Needs water
Skip watering
Heat watch
Protect from rain
Too cold outside
Care on track
```

Each signal includes:

- Main action.
- Reason.
- Placement advice.
- Fastest growth advice.
- Weather summary.
- Supporting facts used by the rule.

The rule result is treated as the source of truth for the visible daily decision. AI plans should explain and extend this decision, not contradict it casually.

## AI Behavior

GardenBuddy uses local AI only when Ollama is running.

Default model:

```txt
qwen2.5:3b
```

The AI has two jobs:

- Generate a structured care plan for one plant.
- Answer questions about one plant using saved plant memory.

The AI receives structured context instead of the whole app state. This keeps answers focused and avoids mixing unrelated plants.

## Plant Memory

Plant memory is stored in MongoDB in the `plantMemories` collection.

Each memory contains:

- Plant id.
- Plant name.
- User question or generated plan request.
- AI answer.
- Current care signal.
- Current weather.
- Search tags.
- A combined text field used for text search.

When the user asks a new question, GardenBuddy retrieves recent and relevant memories for the same plant. This allows the assistant to notice patterns such as repeated yellow leaves, recurring overwatering, or stress after heavy rain.

## Data Storage

GardenBuddy has two storage modes.

### Browser Storage

Used when `MONGODB_URI` is missing.

Good for:

- Quick local testing.
- UI demos.
- Trying the app without setup.

Limitations:

- Data stays in one browser.
- AI memory is not durable across environments.

### MongoDB Storage

Used when `MONGODB_URI` is present.

Good for:

- Persistent plant data.
- Care history.
- AI plan history.
- Plant memory retrieval.
- Hosted demos.

Collections:

```txt
gardens
careLogs
aiPlans
plantMemories
```

The setup script creates indexes for fast garden lookup, recent care history, recent AI plans, and plant memory text search.

## API Overview

```txt
GET  /api/state       Load garden state.
PUT  /api/state       Save garden state.
POST /api/logs        Store a care action.
GET  /api/weather     Fetch weather for a city and region.
GET  /api/locations   Search city and region suggestions.
POST /api/explain     Generate a short AI explanation.
POST /api/plan        Generate a structured AI care plan.
POST /api/chat        Answer a plant-specific question.
```

## Reliability Rules

GardenBuddy should remain usable when optional services fail.

- If MongoDB is unavailable, the app can still run locally with browser storage.
- If Ollama is unavailable, the app still shows rule-based care signals and weather.
- If weather fails, the app should keep plant data visible and show a clear weather fallback.
- If AI returns invalid JSON for a plan, the backend normalizes or falls back to a safe plan.

## Future Improvements

- Add photo-based plant issue tracking.
- Add multiple garden profiles.
- Add export and import for plant data.
- Add reminders through email or calendar integration.
- Add better plant-specific rule presets.
- Add a mobile-first care log timeline.
- Add offline support for saved plants and recent weather.
- Add optional hosted AI provider support for users who do not want to run Ollama.
