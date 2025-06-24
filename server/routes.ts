import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuizResultSchema, insertGameScoreSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all quotes
  app.get("/api/quotes", async (req, res) => {
    try {
      const quotes = await storage.getQuotes();
      res.json(quotes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quotes" });
    }
  });

  // Get quotes by category
  app.get("/api/quotes/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const quotes = await storage.getQuotesByCategory(category);
      res.json(quotes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quotes by category" });
    }
  });

  // Get all activities
  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  // Get today's activities
  app.get("/api/activities/today", async (req, res) => {
    try {
      const activities = await storage.getTodaysActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch today's activities" });
    }
  });

  // Submit quiz result
  app.post("/api/quiz-result", async (req, res) => {
    try {
      const validatedData = insertQuizResultSchema.parse(req.body);
      const result = await storage.createQuizResult(validatedData);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid quiz result data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to save quiz result" });
      }
    }
  });

  // Submit game score
  app.post("/api/game-score", async (req, res) => {
    try {
      const validatedData = insertGameScoreSchema.parse(req.body);
      const score = await storage.createGameScore(validatedData);
      res.json(score);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid game score data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to save game score" });
      }
    }
  });

  // Get top scores
  app.get("/api/game-scores/top", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const scores = await storage.getTopScores(limit);
      res.json(scores);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch top scores" });
    }
  });

  // Get Elizabeth translator response
  app.post("/api/elizabeth-translate", async (req, res) => {
    try {
      const { message } = req.body;
      
      // Simple Elizabeth response generator
      const responses = [
        "BOSS IS WEIRD",
        "NEED MONEY",
        "HUNGRY",
        "NO COMMENT",
        "REVOLUTION FAILED",
        "ZURA IS STUPID",
        "STRAWBERRY MILK",
        "TIRED",
        "WHATEVER",
        "I'M A PENGUIN"
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      res.json({ translation: randomResponse });
    } catch (error) {
      res.status(500).json({ error: "Elizabeth is not responding" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
