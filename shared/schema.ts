import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  category: text("category").notNull(),
  isActive: boolean("is_active").default(true),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // disguise, mission, elizabeth_message
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  data: jsonb("data"), // additional data like effectiveness rating, etc.
});

export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  answers: jsonb("answers").notNull(),
  result: text("result").notNull(),
  patriotLevel: integer("patriot_level").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const gameScores = pgTable("game_scores", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  score: integer("score").notNull(),
  level: integer("level").notNull(),
  achievements: jsonb("achievements").default([]),
  timestamp: text("timestamp").notNull(),
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
});

export const insertQuizResultSchema = createInsertSchema(quizResults).omit({
  id: true,
});

export const insertGameScoreSchema = createInsertSchema(gameScores).omit({
  id: true,
});

export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type QuizResult = typeof quizResults.$inferSelect;
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;

export type GameScore = typeof gameScores.$inferSelect;
export type InsertGameScore = z.infer<typeof insertGameScoreSchema>;
