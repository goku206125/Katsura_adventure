import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";

interface GameState {
  player: {
    x: number;
    y: number;
    health: number;
    score: number;
    level: number;
    isAttacking: boolean;
    direction: 'left' | 'right';
  };
  enemies: Array<{
    id: number;
    x: number;
    y: number;
    health: number;
    type: 'shinsengumi' | 'alien' | 'boss';
    direction: 'left' | 'right';
  }>;
  powerUps: Array<{
    id: number;
    x: number;
    y: number;
    type: 'disguise' | 'headband' | 'elizabeth';
  }>;
  particles: Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    type: 'explosion' | 'text' | 'music';
  }>;
  gameStatus: 'playing' | 'paused' | 'gameOver' | 'victory';
  currentWave: number;
  specialMoveCharge: number;
}

interface StickFigureGameProps {
  onClose: () => void;
}

export default function StickFigureGame({ onClose }: StickFigureGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const keysPressed = useRef<Set<string>>(new Set());
  
  const [gameState, setGameState] = useState<GameState>({
    player: {
      x: 100,
      y: 300,
      health: 3,
      score: 0,
      level: 1,
      isAttacking: false,
      direction: 'right'
    },
    enemies: [],
    powerUps: [],
    particles: [],
    gameStatus: 'playing',
    currentWave: 1,
    specialMoveCharge: 0
  });

  const [achievements, setAchievements] = useState<string[]>([]);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);

  const submitScoreMutation = useMutation({
    mutationFn: async (scoreData: any) => {
      const response = await apiRequest('POST', '/api/game-score', scoreData);
      return response.json();
    }
  });

  // Initialize game
  useEffect(() => {
    spawnEnemyWave();
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      const gameLoop = () => {
        updateGame();
        renderGame();
        animationFrameRef.current = requestAnimationFrame(gameLoop);
      };
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.gameStatus]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.code);
      
      if (e.code === 'Space') {
        e.preventDefault();
        performAttack();
      } else if (e.code === 'KeyR') {
        performKatsurap();
      } else if (e.code === 'KeyE') {
        summonElizabeth();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const spawnEnemyWave = useCallback(() => {
    const newEnemies = [];
    const enemyCount = Math.min(3 + gameState.currentWave, 8);
    
    for (let i = 0; i < enemyCount; i++) {
      newEnemies.push({
        id: Date.now() + i,
        x: 600 + i * 100,
        y: 280 + Math.random() * 40,
        health: gameState.currentWave > 3 ? 2 : 1,
        type: (Math.random() > 0.7 ? 'alien' : 'shinsengumi') as 'shinsengumi' | 'alien',
        direction: 'left' as 'left' | 'right'
      });
    }

    // Boss every 5 waves
    if (gameState.currentWave % 5 === 0) {
      newEnemies.push({
        id: Date.now() + 999,
        x: 700,
        y: 250,
        health: 5,
        type: 'boss',
        direction: 'left' as 'left' | 'right'
      });
    }

    setGameState(prev => ({
      ...prev,
      enemies: newEnemies
    }));
  }, [gameState.currentWave]);

  const updateGame = useCallback(() => {
    setGameState(prev => {
      const newState = { ...prev };

      // Player movement
      if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('KeyA')) {
        newState.player.x = Math.max(0, newState.player.x - 5);
        newState.player.direction = 'left';
      }
      if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('KeyD')) {
        newState.player.x = Math.min(750, newState.player.x + 5);
        newState.player.direction = 'right';
      }

      // Enemy movement and AI
      newState.enemies = newState.enemies.map(enemy => {
        const dx = newState.player.x - enemy.x;
        const speed = enemy.type === 'boss' ? 1 : 2;
        
        if (Math.abs(dx) > 30) {
          enemy.x += dx > 0 ? speed : -speed;
          enemy.direction = dx > 0 ? 'right' : 'left';
        }

        // Enemy attack player
        if (Math.abs(dx) < 50 && Math.abs(newState.player.y - enemy.y) < 30) {
          if (Math.random() < 0.02) { // 2% chance per frame
            newState.player.health = Math.max(0, newState.player.health - 1);
            addParticle(newState, enemy.x, enemy.y, 'text', 'HIT!');
          }
        }

        return enemy;
      });

      // Update particles
      newState.particles = newState.particles
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 1
        }))
        .filter(particle => particle.life > 0);

      // Check for game over
      if (newState.player.health <= 0) {
        newState.gameStatus = 'gameOver';
      }

      // Check for wave completion
      if (newState.enemies.length === 0 && newState.gameStatus === 'playing') {
        newState.currentWave += 1;
        newState.player.score += 100 * newState.currentWave;
        newState.specialMoveCharge = Math.min(100, newState.specialMoveCharge + 25);
        
        // Check for achievements
        checkAchievements(newState);
        
        setTimeout(() => spawnEnemyWave(), 2000);
      }

      return newState;
    });
  }, [spawnEnemyWave]);

  const addParticle = (state: GameState, x: number, y: number, type: 'explosion' | 'text' | 'music', text?: string) => {
    state.particles.push({
      id: Date.now() + Math.random(),
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: type === 'text' ? 60 : 30,
      type
    });
  };

  const performAttack = useCallback(() => {
    setGameState(prev => {
      const newState = { ...prev };
      newState.player.isAttacking = true;
      
      setTimeout(() => {
        setGameState(s => ({ ...s, player: { ...s.player, isAttacking: false } }));
      }, 200);

      // Check for hits
      const attackRange = 60;
      newState.enemies = newState.enemies.filter(enemy => {
        const distance = Math.abs(enemy.x - newState.player.x);
        if (distance < attackRange) {
          enemy.health -= 1;
          newState.player.score += 10;
          addParticle(newState, enemy.x, enemy.y, 'explosion');
          
          if (enemy.health <= 0) {
            newState.player.score += enemy.type === 'boss' ? 100 : 25;
            addParticle(newState, enemy.x, enemy.y, 'text', 'KO!');
            return false;
          }
        }
        return true;
      });

      return newState;
    });
  }, []);

  const performKatsurap = useCallback(() => {
    if (gameState.specialMoveCharge < 50) return;

    setGameState(prev => {
      const newState = { ...prev };
      newState.specialMoveCharge = Math.max(0, newState.specialMoveCharge - 50);
      
      // Area damage
      newState.enemies = newState.enemies.filter(enemy => {
        const distance = Math.abs(enemy.x - newState.player.x);
        if (distance < 150) {
          enemy.health -= 2;
          newState.player.score += 20;
          addParticle(newState, enemy.x, enemy.y, 'music');
          
          if (enemy.health <= 0) {
            newState.player.score += enemy.type === 'boss' ? 100 : 25;
            addParticle(newState, enemy.x, enemy.y, 'text', 'KATSURAP!');
            return false;
          }
        }
        return true;
      });

      return newState;
    });
  }, [gameState.specialMoveCharge]);

  const summonElizabeth = useCallback(() => {
    if (gameState.specialMoveCharge < 75) return;

    setGameState(prev => {
      const newState = { ...prev };
      newState.specialMoveCharge = Math.max(0, newState.specialMoveCharge - 75);
      
      // Elizabeth clears screen
      newState.enemies = newState.enemies.filter(enemy => {
        newState.player.score += enemy.type === 'boss' ? 100 : 25;
        addParticle(newState, enemy.x, enemy.y, 'text', 'ELIZABETH!');
        return false;
      });

      return newState;
    });
  }, [gameState.specialMoveCharge]);

  const checkAchievements = (state: GameState) => {
    const newAchievements = [];
    
    if (state.currentWave >= 5 && !achievements.includes('True Joui Patriot')) {
      newAchievements.push('True Joui Patriot');
    }
    if (state.player.score >= 1000 && !achievements.includes('Rap Master')) {
      newAchievements.push('Rap Master');
    }
    if (state.currentWave >= 10 && !achievements.includes('Revolutionary Hero')) {
      newAchievements.push('Revolutionary Hero');
    }

    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      setShowAchievement(newAchievements[0]);
      setTimeout(() => setShowAchievement(null), 3000);
    }
  };

  const renderGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background elements
    ctx.fillStyle = '#312e81';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50); // Ground

    // Draw player (Katsura stick figure)
    ctx.strokeStyle = gameState.player.isAttacking ? '#f59e0b' : '#8b5cf6';
    ctx.lineWidth = 3;
    
    const px = gameState.player.x;
    const py = gameState.player.y;
    
    // Head
    ctx.beginPath();
    ctx.arc(px, py - 40, 8, 0, Math.PI * 2);
    ctx.stroke();
    
    // Body
    ctx.beginPath();
    ctx.moveTo(px, py - 32);
    ctx.lineTo(px, py - 10);
    ctx.stroke();
    
    // Arms
    ctx.beginPath();
    ctx.moveTo(px, py - 25);
    ctx.lineTo(px + (gameState.player.direction === 'right' ? 15 : -15), py - 15);
    ctx.stroke();
    
    // Legs
    ctx.beginPath();
    ctx.moveTo(px, py - 10);
    ctx.lineTo(px + 10, py);
    ctx.moveTo(px, py - 10);
    ctx.lineTo(px - 10, py);
    ctx.stroke();

    // Long hair (Katsura's signature)
    ctx.strokeStyle = '#4338ca';
    ctx.beginPath();
    ctx.moveTo(px - 8, py - 35);
    ctx.lineTo(px - 12, py - 20);
    ctx.moveTo(px + 8, py - 35);
    ctx.lineTo(px + 12, py - 20);
    ctx.stroke();

    // Draw enemies
    gameState.enemies.forEach(enemy => {
      ctx.strokeStyle = enemy.type === 'boss' ? '#dc2626' : enemy.type === 'alien' ? '#16a34a' : '#ea580c';
      ctx.lineWidth = enemy.type === 'boss' ? 4 : 2;
      
      const ex = enemy.x;
      const ey = enemy.y;
      
      // Head
      ctx.beginPath();
      ctx.arc(ex, ey - 30, enemy.type === 'boss' ? 12 : 6, 0, Math.PI * 2);
      ctx.stroke();
      
      // Body
      ctx.beginPath();
      ctx.moveTo(ex, ey - (enemy.type === 'boss' ? 18 : 24));
      ctx.lineTo(ex, ey - 5);
      ctx.stroke();
      
      // Arms and legs
      ctx.beginPath();
      ctx.moveTo(ex, ey - 15);
      ctx.lineTo(ex + (enemy.direction === 'right' ? 10 : -10), ey - 10);
      ctx.moveTo(ex, ey - 5);
      ctx.lineTo(ex + 8, ey);
      ctx.moveTo(ex, ey - 5);
      ctx.lineTo(ex - 8, ey);
      ctx.stroke();

      // Health indicator
      ctx.fillStyle = '#ef4444';
      for (let i = 0; i < enemy.health; i++) {
        ctx.fillRect(ex - 10 + i * 6, ey - 50, 4, 4);
      }
    });

    // Draw particles
    gameState.particles.forEach(particle => {
      const alpha = particle.life / 60;
      
      if (particle.type === 'explosion') {
        ctx.fillStyle = `rgba(245, 158, 11, ${alpha})`;
        ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
      } else if (particle.type === 'text') {
        ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`;
        ctx.font = 'bold 16px Arial';
        ctx.fillText('POW!', particle.x, particle.y);
      } else if (particle.type === 'music') {
        ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`;
        ctx.font = 'bold 14px Arial';
        ctx.fillText('♪', particle.x, particle.y);
      }
    });

  }, [gameState]);

  const restartGame = () => {
    setGameState({
      player: {
        x: 100,
        y: 300,
        health: 3,
        score: 0,
        level: 1,
        isAttacking: false,
        direction: 'right'
      },
      enemies: [],
      powerUps: [],
      particles: [],
      gameStatus: 'playing',
      currentWave: 1,
      specialMoveCharge: 0
    });
    spawnEnemyWave();
  };

  const handleGameOver = () => {
    submitScoreMutation.mutate({
      playerName: 'Joui Patriot',
      score: gameState.player.score,
      level: gameState.currentWave,
      achievements,
      timestamp: new Date().toISOString()
    });
  };

  useEffect(() => {
    if (gameState.gameStatus === 'gameOver') {
      handleGameOver();
    }
  }, [gameState.gameStatus]);

  return (
    <div className="relative">
      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="border-4 border-purple-600 rounded-lg bg-gradient-to-br from-blue-900 to-purple-900"
      />

      {/* Game UI Overlay */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="bg-black bg-opacity-75 text-white px-3 py-1 rounded">
          <strong>Health:</strong> {Array(gameState.player.health).fill('❤️').join('')}
        </div>
        <div className="bg-black bg-opacity-75 text-white px-3 py-1 rounded">
          <strong>Score:</strong> {gameState.player.score}
        </div>
        <div className="bg-black bg-opacity-75 text-white px-3 py-1 rounded">
          <strong>Wave:</strong> {gameState.currentWave}
        </div>
        <div className="bg-black bg-opacity-75 text-white px-3 py-1 rounded">
          <strong>Special:</strong> {gameState.specialMoveCharge}%
        </div>
      </div>

      {/* Achievement Notification */}
      {showAchievement && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-black p-4 rounded-lg shadow-lg"
        >
          <div className="text-center">
            <div className="text-2xl font-bold">🏆 ACHIEVEMENT UNLOCKED!</div>
            <div className="text-lg">{showAchievement}</div>
          </div>
        </motion.div>
      )}

      {/* Game Over Screen */}
      {gameState.gameStatus === 'gameOver' && (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="text-center text-white space-y-4">
            <div className="text-4xl font-bold">GAME OVER</div>
            <div className="text-xl">Final Score: {gameState.player.score}</div>
            <div className="text-lg">Waves Survived: {gameState.currentWave}</div>
            <div className="space-x-4">
              <Button onClick={restartGame} className="bg-purple-600 hover:bg-purple-700">
                TRY AGAIN
              </Button>
              <Button onClick={onClose} variant="outline">
                EXIT
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Controls Help */}
      <div className="mt-4 grid grid-cols-4 gap-2 text-center text-sm">
        <div className="bg-gray-800 text-white p-2 rounded">
          <div>←→ / WASD</div>
          <div>Move</div>
        </div>
        <div className="bg-gray-800 text-white p-2 rounded">
          <div>SPACE</div>
          <div>Zura Kick</div>
        </div>
        <div className="bg-gray-800 text-white p-2 rounded">
          <div>R</div>
          <div>Katsurap (50%)</div>
        </div>
        <div className="bg-gray-800 text-white p-2 rounded">
          <div>E</div>
          <div>Elizabeth (75%)</div>
        </div>
      </div>
    </div>
  );
}
