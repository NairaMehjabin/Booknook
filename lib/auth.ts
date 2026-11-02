import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// Ensure your MONGO_URI is defined in your frontend .env.local file
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/booknook";
const client = new MongoClient(uri);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || "super-secret-booknook-key-2026",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});