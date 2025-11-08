import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import type { Feature, FeatureCollection, Geometry } from "geojson";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  windChill: number;
  precipitation: number;
}

export interface AirQualityData {
  pm25: number | null;
  pm10: number | null;
  no2: number | null;
  station: string | null;
  distance: number | null;
}

export interface RiskIndices {
  hsi: number;
  csi: number;
  aqri: number;
  riskScore: number;
}

export interface RiskData extends RiskIndices {
  raw: {
    weather: WeatherData;
    airQuality: AirQualityData;
  };
  confidence: number;
  date: string;
}

export interface NeighborhoodProperties {
  name: string;
  population: number;
  seniorPercent: number;
  vulnerabilityScore: number;
  riskData?: RiskData;
}

export type NeighborhoodFeature = Feature<Geometry, NeighborhoodProperties>;
export type NeighborhoodsGeoJSON = FeatureCollection<Geometry, NeighborhoodProperties>;

export interface CommunitySubmission {
  id: string;
  location: string;
  message: string;
  timestamp: string;
}

export const insertCommunitySubmissionSchema = z.object({
  location: z.string().min(1, "Location is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type InsertCommunitySubmission = z.infer<typeof insertCommunitySubmissionSchema>;

export interface Alert {
  id: string;
  type: "heat" | "cold" | "air_quality";
  severity: "low" | "moderate" | "high" | "extreme";
  neighborhoods: string[];
  message: string;
  timestamp: string;
}

export interface RiskConfig {
  weights: {
    heat: number;
    cold: number;
    air: number;
  };
  thresholds: {
    hsi: number;
    csi: number;
    aqri: number;
  };
}
