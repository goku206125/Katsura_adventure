import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  id: number;
  scenario: string;
  options: {
    text: string;
    isKatsuraChoice: boolean;
    explanation: string;
    points: number;
  }[];
  difficulty: 'easy' | 'medium' | 'hard';
}

interface GameState {
  currentQuestion: number;
  score: number;
  patriotLevel: number;
  streak: number;
  maxStreak: number;
  answeredQuestions: number[];
  gameStatus: 'playing' | 'completed' | 'paused';
  showExplanation: boolean;
  selectedAnswer: number | null;
  timeLeft: number;
}

interface KatsuraMCQGameProps {
  onClose: () => void;
}

const questions: Question[] = [
  {
    id: 1,
    scenario: "The Shinsengumi are chasing you through Edo. What do you do?",
    options: [
      { text: "Fight them head-on with your sword", isKatsuraChoice: false, explanation: "Too direct for Katsura's style", points: 1 },
      { text: "Put on a ridiculous disguise and pretend to be a street vendor", isKatsuraChoice: true, explanation: "Classic Katsura! He loves absurd disguises", points: 3 },
      { text: "Hide in a barrel", isKatsuraChoice: false, explanation: "Not dramatic enough for Katsura", points: 1 },
      { text: "Call for Elizabeth to help", isKatsuraChoice: false, explanation: "Katsura would handle it himself first", points: 2 }
    ],
    difficulty: 'easy'
  },
  {
    id: 2,
    scenario: "You see Gintoki eating parfait instead of fighting for the revolution. Your reaction?",
    options: [
      { text: "Angrily lecture him about the importance of the Joui cause", isKatsuraChoice: true, explanation: "Katsura always tries to recruit Gintoki back to the cause!", points: 3 },
      { text: "Join him for parfait", isKatsuraChoice: false, explanation: "Katsura is too serious about the revolution", points: 1 },
      { text: "Ignore him completely", isKatsuraChoice: false, explanation: "Katsura can't ignore his old friend", points: 1 },
      { text: "Challenge him to a duel", isKatsuraChoice: false, explanation: "They're friends despite disagreements", points: 2 }
    ],
    difficulty: 'medium'
  },
  {
    id: 3,
    scenario: "Elizabeth brings you a sign that says something confusing. What do you do?",
    options: [
      { text: "Ask Elizabeth to explain", isKatsuraChoice: false, explanation: "Elizabeth rarely speaks", points: 1 },
      { text: "Pretend you understand perfectly and respond dramatically", isKatsuraChoice: true, explanation: "Katsura always acts like he understands Elizabeth!", points: 3 },
      { text: "Ignore the sign", isKatsuraChoice: false, explanation: "Katsura always pays attention to Elizabeth", points: 1 },
      { text: "Get frustrated and yell", isKatsuraChoice: false, explanation: "Katsura is patient with Elizabeth", points: 1 }
    ],
    difficulty: 'easy'
  },
  {
    id: 4,
    scenario: "Someone calls you 'Zura'. How do you respond?",
    options: [
      { text: "Zura janai, Katsura da!", isKatsuraChoice: true, explanation: "THE classic Katsura response! Never fails!", points: 3 },
      { text: "Just ignore it", isKatsuraChoice: false, explanation: "Katsura ALWAYS corrects this", points: 1 },
      { text: "Get violent", isKatsuraChoice: false, explanation: "Katsura corrects but doesn't get violent over it", points: 1 },
      { text: "Ask them to call you Captain", isKatsuraChoice: false, explanation: "He specifically wants to be called Katsura", points: 2 }
    ],
    difficulty: 'easy'
  },
  {
    id: 5,
    scenario: "You need to infiltrate a fancy party. What's your plan?",
    options: [
      { text: "Sneak in through the back", isKatsuraChoice: false, explanation: "Too simple for Katsura's dramatic flair", points: 1 },
      { text: "Dress as a flamboyant foreign dignitary with an outrageous accent", isKatsuraChoice: true, explanation: "Perfect! Katsura loves over-the-top disguises!", points: 3 },
      { text: "Go in your normal clothes", isKatsuraChoice: false, explanation: "Katsura always disguises himself", points: 1 },
      { text: "Send Elizabeth instead", isKatsuraChoice: false, explanation: "Katsura likes doing the infiltrating himself", points: 2 }
    ],
    difficulty: 'medium'
  },
  {
    id: 6,
    scenario: "The revolution needs funding. What's your fundraising strategy?",
    options: [
      { text: "Rob a bank", isKatsuraChoice: false, explanation: "Too criminal for Katsura's honor code", points: 1 },
      { text: "Start a bizarre business venture that somehow relates to overthrowing the government", isKatsuraChoice: true, explanation: "Classic Katsura! Always mixing business with revolution!", points: 3 },
      { text: "Ask friends for donations", isKatsuraChoice: false, explanation: "Katsura prefers grand schemes", points: 2 },
      { text: "Sell Elizabeth's services", isKatsuraChoice: false, explanation: "He wouldn't exploit Elizabeth like that", points: 1 }
    ],
    difficulty: 'hard'
  },
  {
    id: 7,
    scenario: "Kagura challenges you to an eating contest. Your response?",
    options: [
      { text: "Decline politely", isKatsuraChoice: false, explanation: "Katsura doesn't back down from challenges", points: 1 },
      { text: "Accept but make it about revolutionary spirit and the will to never give up", isKatsuraChoice: true, explanation: "Katsura turns everything into a lesson about the revolution!", points: 3 },
      { text: "Accept and just focus on eating", isKatsuraChoice: false, explanation: "Katsura always adds deeper meaning", points: 2 },
      { text: "Suggest Elizabeth compete instead", isKatsuraChoice: false, explanation: "Katsura faces challenges himself", points: 1 }
    ],
    difficulty: 'medium'
  },
  {
    id: 8,
    scenario: "You discover a new alien conspiracy. What's your first move?",
    options: [
      { text: "Immediately attack the aliens", isKatsuraChoice: false, explanation: "Katsura plans before acting", points: 1 },
      { text: "Research the conspiracy thoroughly while making dramatic speeches about protecting Earth", isKatsuraChoice: true, explanation: "Perfect! Katsura combines serious planning with dramatic flair!", points: 3 },
      { text: "Tell the authorities", isKatsuraChoice: false, explanation: "Katsura doesn't trust the government", points: 1 },
      { text: "Try to negotiate with the aliens", isKatsuraChoice: false, explanation: "Katsura sees them as enemies to defeat", points: 2 }
    ],
    difficulty: 'hard'
  },
  {
    id: 9,
    scenario: "You're invited to a hot pot party. How do you participate?",
    options: [
      { text: "Eat normally and enjoy the company", isKatsuraChoice: false, explanation: "Katsura always adds his unique flair", points: 1 },
      { text: "Turn it into a bonding experience about fighting for your beliefs together", isKatsuraChoice: true, explanation: "Katsura makes everything meaningful and revolutionary!", points: 3 },
      { text: "Bring Elizabeth and let her eat everything", isKatsuraChoice: false, explanation: "Katsura would participate himself", points: 2 },
      { text: "Leave early", isKatsuraChoice: false, explanation: "Katsura values friendship despite his seriousness", points: 1 }
    ],
    difficulty: 'medium'
  },
  {
    id: 10,
    scenario: "Someone insults your hair. How do you handle it?",
    options: [
      { text: "Get into a physical fight", isKatsuraChoice: false, explanation: "Katsura is more dignified than that", points: 1 },
      { text: "Give a passionate speech about how your hair represents your dedication to the revolution", isKatsuraChoice: true, explanation: "Katsura makes everything about the revolution, even his hair!", points: 3 },
      { text: "Ignore the insult", isKatsuraChoice: false, explanation: "Katsura takes pride in his appearance", points: 1 },
      { text: "Make fun of their hair back", isKatsuraChoice: false, explanation: "Not Katsura's mature style", points: 2 }
    ],
    difficulty: 'easy'
  }
];

export default function KatsuraMCQGame({ onClose }: KatsuraMCQGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    score: 0,
    patriotLevel: 0,
    streak: 0,
    maxStreak: 0,
    answeredQuestions: [],
    gameStatus: 'playing',
    showExplanation: false,
    selectedAnswer: null,
    timeLeft: 30
  });

  // Timer effect
  useEffect(() => {
    if (gameState.gameStatus !== 'playing' || gameState.showExplanation) return;
    
    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          // Time's up, force answer
          return {
            ...prev,
            selectedAnswer: -1,
            showExplanation: true,
            streak: 0,
            timeLeft: 0
          };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.gameStatus, gameState.showExplanation, gameState.currentQuestion]);

  const selectAnswer = useCallback((answerIndex: number) => {
    if (gameState.selectedAnswer !== null) return;

    const currentQ = questions[gameState.currentQuestion];
    const selectedOption = currentQ.options[answerIndex];
    const newScore = gameState.score + selectedOption.points;
    const newStreak = selectedOption.isKatsuraChoice ? gameState.streak + 1 : 0;
    const newMaxStreak = Math.max(gameState.maxStreak, newStreak);

    setGameState(prev => ({
      ...prev,
      selectedAnswer: answerIndex,
      showExplanation: true,
      score: newScore,
      streak: newStreak,
      maxStreak: newMaxStreak,
      patriotLevel: Math.floor(newScore / 10)
    }));
  }, [gameState]);

  const nextQuestion = useCallback(() => {
    const nextIndex = gameState.currentQuestion + 1;
    
    if (nextIndex >= questions.length) {
      setGameState(prev => ({ ...prev, gameStatus: 'completed' }));
    } else {
      setGameState(prev => ({
        ...prev,
        currentQuestion: nextIndex,
        showExplanation: false,
        selectedAnswer: null,
        timeLeft: 30,
        answeredQuestions: [...prev.answeredQuestions, prev.currentQuestion]
      }));
    }
  }, [gameState.currentQuestion]);

  const resetGame = () => {
    setGameState({
      currentQuestion: 0,
      score: 0,
      patriotLevel: 0,
      streak: 0,
      maxStreak: 0,
      answeredQuestions: [],
      gameStatus: 'playing',
      showExplanation: false,
      selectedAnswer: null,
      timeLeft: 30
    });
  };

  const getPatriotTitle = (level: number) => {
    if (level >= 3) return "True Joui Patriot";
    if (level >= 2) return "Dedicated Revolutionary";
    if (level >= 1) return "Aspiring Patriot";
    return "Civilian";
  };

  const currentQuestion = questions[gameState.currentQuestion];

  if (gameState.gameStatus === 'completed') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-purple-900 to-blue-900 p-8 rounded-xl max-w-2xl w-full mx-4 text-white text-center"
        >
          <div className="text-6xl mb-4">🎌</div>
          <h2 className="text-3xl font-bold mb-4">Game Complete!</h2>
          
          <div className="space-y-4 mb-6">
            <div className="text-xl">Final Score: <span className="font-bold text-yellow-400">{gameState.score}</span></div>
            <div className="text-lg">Patriot Level: <span className="font-bold text-purple-400">{gameState.patriotLevel}</span></div>
            <div className="text-lg">Title: <span className="font-bold text-gold-400">{getPatriotTitle(gameState.patriotLevel)}</span></div>
            <div className="text-lg">Best Streak: <span className="font-bold text-green-400">{gameState.maxStreak}</span></div>
          </div>

          <div className="bg-purple-800 p-4 rounded-lg mb-6">
            <h3 className="font-bold mb-2">Katsura's Judgment:</h3>
            <p className="text-sm">
              {gameState.patriotLevel >= 3 ? 
                "Excellent! You truly understand the way of the revolutionary! Together we shall overthrow the corrupt government!" :
                gameState.patriotLevel >= 2 ?
                "Good work! You show promise as a revolutionary. Keep studying my methods!" :
                gameState.patriotLevel >= 1 ?
                "Not bad, but you still have much to learn about the revolutionary spirit!" :
                "Zura janai, disappointed da! You need to study the way of the patriot more carefully!"
              }
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-bold"
            >
              Play Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-bold"
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-purple-900 to-blue-900 p-6 rounded-xl max-w-4xl w-full mx-4 text-white"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="text-2xl">🎌</div>
            <div>
              <h2 className="text-2xl font-bold">What Would Katsura Do?</h2>
              <p className="text-sm opacity-75">Question {gameState.currentQuestion + 1} of {questions.length}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-red-400 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Stats Bar */}
        <div className="flex justify-between items-center mb-6 bg-black bg-opacity-30 p-4 rounded-lg">
          <div className="text-center">
            <div className="text-sm opacity-75">Score</div>
            <div className="font-bold text-yellow-400">{gameState.score}</div>
          </div>
          <div className="text-center">
            <div className="text-sm opacity-75">Streak</div>
            <div className="font-bold text-green-400">{gameState.streak}</div>
          </div>
          <div className="text-center">
            <div className="text-sm opacity-75">Patriot Level</div>
            <div className="font-bold text-purple-400">{gameState.patriotLevel}</div>
          </div>
          <div className="text-center">
            <div className="text-sm opacity-75">Time</div>
            <div className={`font-bold ${gameState.timeLeft <= 10 ? 'text-red-400' : 'text-blue-400'}`}>
              {gameState.timeLeft}s
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <motion.div
            key={gameState.currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black bg-opacity-30 p-6 rounded-lg"
          >
            <h3 className="text-xl font-bold mb-4">{currentQuestion.scenario}</h3>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: gameState.selectedAnswer === null ? 1.02 : 1 }}
                  whileTap={{ scale: gameState.selectedAnswer === null ? 0.98 : 1 }}
                  onClick={() => selectAnswer(index)}
                  disabled={gameState.selectedAnswer !== null}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    gameState.selectedAnswer === null
                      ? 'bg-gray-700 hover:bg-gray-600 cursor-pointer'
                      : gameState.selectedAnswer === index
                      ? option.isKatsuraChoice
                        ? 'bg-green-600 border-2 border-green-400'
                        : 'bg-red-600 border-2 border-red-400'
                      : option.isKatsuraChoice && gameState.showExplanation
                      ? 'bg-green-800 border border-green-600'
                      : 'bg-gray-800 opacity-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{option.text}</span>
                    {gameState.showExplanation && (
                      <div className="flex items-center gap-2">
                        {option.isKatsuraChoice && <span className="text-green-400">✓</span>}
                        <span className="text-sm opacity-75">+{option.points}</span>
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {gameState.showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="bg-yellow-900 bg-opacity-50 p-4 rounded-lg">
                <h4 className="font-bold mb-2">
                  {gameState.selectedAnswer === -1 ? "Time's Up!" : 
                   gameState.selectedAnswer !== null && currentQuestion.options[gameState.selectedAnswer].isKatsuraChoice ? 
                   "Correct! That's so Katsura!" : "Not quite right..."}
                </h4>
                <p className="text-sm mb-4">
                  {gameState.selectedAnswer === -1 ? 
                    "A true revolutionary acts decisively! The correct answer was highlighted." :
                    gameState.selectedAnswer !== null ? 
                    currentQuestion.options[gameState.selectedAnswer].explanation :
                    ""
                  }
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextQuestion}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-bold"
                >
                  {gameState.currentQuestion === questions.length - 1 ? 'See Results' : 'Next Question'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}