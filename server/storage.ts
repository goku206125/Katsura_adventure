import { 
  quotes, activities, quizResults, gameScores,
  type Quote, type InsertQuote,
  type Activity, type InsertActivity,
  type QuizResult, type InsertQuizResult,
  type GameScore, type InsertGameScore
} from "@shared/schema";

export interface IStorage {
  // Quotes
  getQuotes(): Promise<Quote[]>;
  getQuotesByCategory(category: string): Promise<Quote[]>;
  createQuote(quote: InsertQuote): Promise<Quote>;
  
  // Activities
  getActivities(): Promise<Activity[]>;
  getActivitiesByType(type: string): Promise<Activity[]>;
  getTodaysActivities(): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Quiz Results
  createQuizResult(result: InsertQuizResult): Promise<QuizResult>;
  getQuizResults(): Promise<QuizResult[]>;
  
  // Game Scores
  createGameScore(score: InsertGameScore): Promise<GameScore>;
  getTopScores(limit?: number): Promise<GameScore[]>;
  getPlayerScores(playerName: string): Promise<GameScore[]>;
}

export class MemStorage implements IStorage {
  private quotes: Map<number, Quote>;
  private activities: Map<number, Activity>;
  private quizResults: Map<number, QuizResult>;
  private gameScores: Map<number, GameScore>;
  private currentQuoteId: number;
  private currentActivityId: number;
  private currentQuizResultId: number;
  private currentGameScoreId: number;

  constructor() {
    this.quotes = new Map();
    this.activities = new Map();
    this.quizResults = new Map();
    this.gameScores = new Map();
    this.currentQuoteId = 1;
    this.currentActivityId = 1;
    this.currentQuizResultId = 1;
    this.currentGameScoreId = 1;
    
    this.seedInitialData();
  }

  private seedInitialData() {
    // Seed quotes
    const initialQuotes = [
      { text: "Zura janai, Katsura da!", category: "catchphrase", isActive: true },
      { text: "It's not rap, it's Katsurap!", category: "katsurap", isActive: true },
      { text: "The country? I'll change it with my own hands!", category: "revolutionary", isActive: true },
      { text: "This is what it means to be a patriot!", category: "revolutionary", isActive: true },
      { text: "Nobody will recognize me in this disguise!", category: "disguise", isActive: true },
      { text: "Elizabeth, we have work to do!", category: "elizabeth", isActive: true },
    ];

    initialQuotes.forEach((quote) => {
      const id = this.currentQuoteId++;
      this.quotes.set(id, { id, ...quote });
    });

    // Seed activities
    const today = new Date().toISOString().split('T')[0];
    const initialActivities = [
      {
        type: "disguise",
        title: "ZURAKO MODE",
        description: "Nobody will recognize me in this perfect disguise!",
        date: today,
        data: { effectiveness: 2, confidence: 11 }
      },
      {
        type: "mission",
        title: "OPERATION: STRAWBERRY LIBERATION",
        description: "Infiltrate the convenience store and secure strawberry milk supplies for the revolution!",
        date: today,
        data: { objectives: [
          { text: "Enter store undetected", completed: true },
          { text: "Acquire strawberry milk", completed: true },
          { text: "Escape before recognition", completed: false }
        ]}
      },
      {
        type: "elizabeth_message",
        title: "TODAY'S SIGN",
        description: "BOSS IS BROKE AGAIN",
        date: today,
        data: { mood: "Perpetually Unimpressed" }
      }
    ];

    initialActivities.forEach((activity) => {
      const id = this.currentActivityId++;
      this.activities.set(id, { id, ...activity });
    });
  }

  // Quotes
  async getQuotes(): Promise<Quote[]> {
    return Array.from(this.quotes.values()).filter(q => q.isActive);
  }

  async getQuotesByCategory(category: string): Promise<Quote[]> {
    return Array.from(this.quotes.values()).filter(q => q.category === category && q.isActive);
  }

  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const id = this.currentQuoteId++;
    const quote: Quote = { id, ...insertQuote };
    this.quotes.set(id, quote);
    return quote;
  }

  // Activities
  async getActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }

  async getActivitiesByType(type: string): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(a => a.type === type);
  }

  async getTodaysActivities(): Promise<Activity[]> {
    const today = new Date().toISOString().split('T')[0];
    return Array.from(this.activities.values()).filter(a => a.date === today);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const activity: Activity = { id, ...insertActivity };
    this.activities.set(id, activity);
    return activity;
  }

  // Quiz Results
  async createQuizResult(insertQuizResult: InsertQuizResult): Promise<QuizResult> {
    const id = this.currentQuizResultId++;
    const result: QuizResult = { id, ...insertQuizResult };
    this.quizResults.set(id, result);
    return result;
  }

  async getQuizResults(): Promise<QuizResult[]> {
    return Array.from(this.quizResults.values());
  }

  // Game Scores
  async createGameScore(insertGameScore: InsertGameScore): Promise<GameScore> {
    const id = this.currentGameScoreId++;
    const score: GameScore = { id, ...insertGameScore };
    this.gameScores.set(id, score);
    return score;
  }

  async getTopScores(limit: number = 10): Promise<GameScore[]> {
    return Array.from(this.gameScores.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async getPlayerScores(playerName: string): Promise<GameScore[]> {
    return Array.from(this.gameScores.values())
      .filter(s => s.playerName === playerName)
      .sort((a, b) => b.score - a.score);
  }
}

export const storage = new MemStorage();
