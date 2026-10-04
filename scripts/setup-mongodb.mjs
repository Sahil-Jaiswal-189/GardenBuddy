import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { MongoClient } from "mongodb";

async function loadEnv() {
  try {
    const envText = await readFile(join(process.cwd(), ".env"), "utf8");
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
    // .env is optional for hosted environments, but this setup script needs it locally.
  }
}

await loadEnv();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "gardenbuddy";

if (!uri) {
  console.error("Missing MONGODB_URI. Create .env from .env.example and paste your Atlas connection string.");
  process.exit(1);
}

const client = new MongoClient(uri);
await client.connect();
const db = client.db(dbName);

await db.collection("gardens").createIndex({ gardenId: 1 }, { unique: true });
await db.collection("careLogs").createIndex({ gardenId: 1, plantId: 1, createdAt: -1 });
await db.collection("aiPlans").createIndex({ gardenId: 1, plantId: 1, createdAt: -1 });
await db.collection("plantMemories").createIndex({ gardenId: 1, plantId: 1, createdAt: -1 });
await db.collection("plantMemories").createIndex({ gardenId: 1, plantId: 1, memoryText: "text", tags: "text" });

await db.collection("gardens").updateOne(
  { gardenId: process.env.GARDEN_ID || "demo-garden" },
  {
    $setOnInsert: {
      gardenId: process.env.GARDEN_ID || "demo-garden",
      plants: [],
      createdAt: new Date().toISOString()
    },
    $set: {
      updatedAt: new Date().toISOString()
    }
  },
  { upsert: true }
);

console.log(`MongoDB Atlas ready: database "${dbName}"`);
console.log("Collections: gardens, careLogs, aiPlans, plantMemories");

await client.close();
