# GardenBuddy MVP Spec

## Goal

GardenBuddy helps a friend keep plants alive by combining plant profile, local weather, watering history, and open-model explanations into a calm care dashboard.

## Current MVP

- Add plants with name, city, stage, location, sunlight, last watered, cadence, and notes.
- Fetch local 7-day weather from Open-Meteo.
- Calculate care status with deterministic rules.
- Show a visual plant dashboard with real plant imagery.
- Show a 7-day care calendar.
- Log watering history locally.
- Use Ollama with `qwen2.5:3b` for structured care plans when available.
- Fall back gracefully when Ollama is offline.
- Use MongoDB Atlas as an optional backend data layer when `MONGODB_URI` is configured.
- Persist plant profiles, watering logs, and Qwen care-plan outputs to Atlas.

## Near-Term Prize Stack

1. MongoDB Atlas
   - Store plant profiles, care logs, weather snapshots, and generated care notes.
   - Keep localStorage as offline/demo fallback.
   - Use this as GardenBuddy's long-term garden memory for future agent workflows.

2. Gemma or Qwen
   - Use an open-weight model through Ollama for structured daily and weekly care planning.
   - Keep deterministic rules as the source of truth.

3. Mastra
   - Add later as the agent orchestration layer over tools:
     `getWeather`, `getPlantHistory`, `calculateWaterNeed`, `saveCarePlan`.

4. Temporal
   - Add later for durable reminder workflows.
   - Demo mode can compress time so one day equals 20-30 seconds.

5. Entire
   - Add later in the submission/write-up by linking the agent build session.

## Demo Story

Built for a friend who loves plants but forgets watering and overcorrects after hot days. GardenBuddy gives them a clear daily care queue, weather-aware skips, and simple explanations.
