# GardenBuddy MVP Spec

## Goal

GardenBuddy helps plant owners keep plants healthy by combining plant profile, local weather, watering history, and simple AI-assisted explanations into a calm care dashboard.

## Current MVP

- Add plants with name, city, stage, location, sunlight, last watered, cadence, and notes.
- Fetch local 7-day weather from Open-Meteo.
- Calculate care status with deterministic rules.
- Show a visual plant dashboard with real plant imagery.
- Show a 7-day care calendar.
- Log watering history locally.
- Use optional local AI for structured care plans and plant questions when available.
- Fall back gracefully when local AI is offline.
- Use MongoDB as an optional backend data layer when `MONGODB_URI` is configured.
- Persist plant profiles, watering logs, care-plan outputs, and plant-specific memory.

## Demo Story

GardenBuddy is for people who love plants but forget watering, overcorrect after hot days, or miss repeated warning signs. It gives them a clear daily care queue, weather-aware skips, and simple explanations grounded in each plant's own history.
