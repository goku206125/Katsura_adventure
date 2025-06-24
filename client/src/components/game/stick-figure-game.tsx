import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";

interface GameState {
  player: {
    x: number;
    y: number;
    groundY: number;
    velocityY: number;
    health: number;
    score: number;
    level: number;
    isAttacking: boolean;
    attackType: 'punch' | 'kick' | 'special' | null;
    isJumping: boolean;
    isMoving: boolean;
    direction: 'left' | 'right';
    animationFrame: number;
    isBlocking: boolean;
    combo: number;
    maxCombo: number;
  };
  enemies: Array<{
    id: number;
    x: number;
    y: number;
    groundY: number;
    velocityY: number;
    health: number;
    maxHealth: number;
    type: 'shinsengumi' | 'alien' | 'boss';
    direction: 'left' | 'right';
    isStunned: boolean;
    stunTimer: number;
    animationFrame: number;
    isBeingHit: boolean;
    hitTimer: number;
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
    maxLife: number;
    type: 'explosion' | 'text' | 'music' | 'hit' | 'combo';
    text?: string;
    size?: number;
  }>;
  gameStatus: 'playing' | 'paused' | 'gameOver' | 'victory';
  currentWave: number;
  specialMoveCharge: number;
  cameraShake: number;
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
      groundY: 300,
      velocityY: 0,
      health: 3,
      score: 0,
      level: 1,
      isAttacking: false,
      attackType: null,
      isJumping: false,
      isMoving: false,
      direction: 'right',
      animationFrame: 0,
      isBlocking: false,
      combo: 0,
      maxCombo: 0
    },
    enemies: [],
    powerUps: [],
    particles: [],
    gameStatus: 'playing',
    currentWave: 1,
    specialMoveCharge: 0,
    cameraShake: 0
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
        performJump();
      } else if (e.code === 'KeyX') {
        e.preventDefault();
        performPunch();
      } else if (e.code === 'KeyZ') {
        e.preventDefault();
        performKick();
      } else if (e.code === 'KeyC') {
        e.preventDefault();
        performSpecialMove();
      } else if (e.code === 'KeyS') {
        e.preventDefault();
        setGameState(prev => ({ ...prev, player: { ...prev.player, isBlocking: true } }));
      } else if (e.code === 'KeyR') {
        performKatsurap();
      } else if (e.code === 'KeyE') {
        summonElizabeth();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code);
      
      if (e.code === 'KeyS') {
        setGameState(prev => ({ ...prev, player: { ...prev.player, isBlocking: false } }));
      }
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
    const enemyCount = Math.min(2 + Math.floor(gameState.currentWave / 2), 4); // Fewer enemies for better 1v1 combat
    
    for (let i = 0; i < enemyCount; i++) {
      const groundY = 300;
      const maxHealth = gameState.currentWave > 3 ? 3 : 2;
      newEnemies.push({
        id: Date.now() + i,
        x: 500 + i * 150,
        y: groundY,
        groundY: groundY,
        velocityY: 0,
        health: maxHealth,
        maxHealth: maxHealth,
        type: (Math.random() > 0.7 ? 'alien' : 'shinsengumi') as 'shinsengumi' | 'alien',
        direction: 'left' as 'left' | 'right',
        isStunned: false,
        stunTimer: 0,
        animationFrame: 0,
        isBeingHit: false,
        hitTimer: 0
      });
    }

    // Boss every 5 waves
    if (gameState.currentWave % 5 === 0) {
      const bossHealth = 8;
      newEnemies.push({
        id: Date.now() + 999,
        x: 600,
        y: 300,
        groundY: 300,
        velocityY: 0,
        health: bossHealth,
        maxHealth: bossHealth,
        type: 'boss',
        direction: 'left' as 'left' | 'right',
        isStunned: false,
        stunTimer: 0,
        animationFrame: 0,
        isBeingHit: false,
        hitTimer: 0
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

      // Update animation frames
      newState.player.animationFrame = (newState.player.animationFrame + 1) % 60;
      newState.enemies.forEach(enemy => {
        enemy.animationFrame = (enemy.animationFrame + 1) % 60;
        if (enemy.isBeingHit && enemy.hitTimer > 0) {
          enemy.hitTimer -= 1;
          if (enemy.hitTimer <= 0) {
            enemy.isBeingHit = false;
          }
        }
        if (enemy.isStunned && enemy.stunTimer > 0) {
          enemy.stunTimer -= 1;
          if (enemy.stunTimer <= 0) {
            enemy.isStunned = false;
          }
        }
      });

      // Camera shake
      if (newState.cameraShake > 0) {
        newState.cameraShake -= 1;
      }

      // Player movement
      newState.player.isMoving = false;
      const moveSpeed = newState.player.isBlocking ? 2 : 6;
      
      if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('KeyA')) {
        newState.player.x = Math.max(0, newState.player.x - moveSpeed);
        newState.player.direction = 'left';
        newState.player.isMoving = true;
      }
      if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('KeyD')) {
        newState.player.x = Math.min(750, newState.player.x + moveSpeed);
        newState.player.direction = 'right';
        newState.player.isMoving = true;
      }

      // Player physics (jumping and gravity)
      if (newState.player.isJumping || newState.player.y < newState.player.groundY) {
        newState.player.velocityY += 0.8; // gravity
        newState.player.y += newState.player.velocityY;
        
        if (newState.player.y >= newState.player.groundY) {
          newState.player.y = newState.player.groundY;
          newState.player.velocityY = 0;
          newState.player.isJumping = false;
        }
      }

      // Enemy AI and physics
      newState.enemies = newState.enemies.map(enemy => {
        if (!enemy.isStunned) {
          const dx = newState.player.x - enemy.x;
          const speed = enemy.type === 'boss' ? 1.5 : 2;
          const attackRange = 60;
          
          // Enemy movement towards player
          if (Math.abs(dx) > attackRange) {
            enemy.x += dx > 0 ? speed : -speed;
            enemy.direction = dx > 0 ? 'right' : 'left';
          }

          // Enemy attack player (less frequent, more strategic)
          if (Math.abs(dx) < attackRange && Math.abs(newState.player.y - enemy.y) < 40) {
            if (Math.random() < 0.008) { // Reduced attack frequency
              if (!newState.player.isBlocking) {
                newState.player.health = Math.max(0, newState.player.health - 1);
                addParticle(newState, enemy.x, enemy.y, 'hit', 'HIT!');
                newState.cameraShake = 8;
                
                // Reset combo when hit
                newState.player.combo = 0;
              } else {
                addParticle(newState, newState.player.x, newState.player.y, 'text', 'BLOCKED!');
              }
            }
          }
        }

        // Enemy physics
        if (enemy.y < enemy.groundY) {
          enemy.velocityY += 0.8;
          enemy.y += enemy.velocityY;
          
          if (enemy.y >= enemy.groundY) {
            enemy.y = enemy.groundY;
            enemy.velocityY = 0;
          }
        }

        return enemy;
      });

      // Update particles with enhanced effects
      newState.particles = newState.particles
        .map(particle => {
          const newParticle = {
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 1
          };
          
          // Add gravity to explosion particles
          if (particle.type === 'explosion' || particle.type === 'hit') {
            newParticle.vy += 0.2;
          }
          
          return newParticle;
        })
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
        
        // Update max combo record
        if (newState.player.combo > newState.player.maxCombo) {
          newState.player.maxCombo = newState.player.combo;
        }
        
        // Check for achievements
        checkAchievements(newState);
        
        setTimeout(() => spawnEnemyWave(), 2000);
      }

      return newState;
    });
  }, [spawnEnemyWave]);

  const addParticle = (state: GameState, x: number, y: number, type: 'explosion' | 'text' | 'music' | 'hit' | 'combo', text?: string) => {
    const maxLife = type === 'text' ? 60 : type === 'combo' ? 90 : 30;
    state.particles.push({
      id: Date.now() + Math.random(),
      x,
      y,
      vx: type === 'hit' ? (Math.random() - 0.5) * 8 : (Math.random() - 0.5) * 4,
      vy: type === 'hit' ? -Math.random() * 6 - 2 : (Math.random() - 0.5) * 4,
      life: maxLife,
      maxLife,
      type,
      text: text || (type === 'hit' ? 'POW!' : type === 'combo' ? `${state.player.combo}x COMBO!` : ''),
      size: type === 'combo' ? 1.5 : 1
    });
  };

  const performJump = useCallback(() => {
    setGameState(prev => {
      if (prev.player.isJumping || prev.player.y < prev.player.groundY) return prev;
      
      return {
        ...prev,
        player: {
          ...prev.player,
          isJumping: true,
          velocityY: -15, // Jump strength
        }
      };
    });
  }, []);

  const performPunch = useCallback(() => {
    setGameState(prev => {
      if (prev.player.isAttacking) return prev;
      
      const newState = { ...prev };
      newState.player.isAttacking = true;
      newState.player.attackType = 'punch';
      
      setTimeout(() => {
        setGameState(s => ({ 
          ...s, 
          player: { 
            ...s.player, 
            isAttacking: false, 
            attackType: null 
          } 
        }));
      }, 300);

      // Check for hits
      const attackRange = newState.player.isJumping ? 70 : 50;
      let hitAny = false;
      
      newState.enemies = newState.enemies.filter(enemy => {
        const distance = Math.abs(enemy.x - newState.player.x);
        const verticalDistance = Math.abs(enemy.y - newState.player.y);
        
        if (distance < attackRange && verticalDistance < 60) {
          enemy.health -= 1;
          enemy.isBeingHit = true;
          enemy.hitTimer = 15;
          enemy.isStunned = true;
          enemy.stunTimer = 30;
          
          newState.player.score += 15;
          newState.player.combo += 1;
          newState.cameraShake = 5;
          hitAny = true;
          
          addParticle(newState, enemy.x, enemy.y - 20, 'hit', 'PUNCH!');
          
          if (newState.player.combo > 1) {
            addParticle(newState, enemy.x + 30, enemy.y - 40, 'combo');
          }
          
          if (enemy.health <= 0) {
            newState.player.score += enemy.type === 'boss' ? 150 : 50;
            addParticle(newState, enemy.x, enemy.y, 'text', 'K.O.!');
            return false;
          }
        }
        return true;
      });

      if (hitAny) {
        newState.specialMoveCharge = Math.min(100, newState.specialMoveCharge + 10);
      } else {
        newState.player.combo = 0; // Reset combo on miss
      }

      return newState;
    });
  }, []);

  const performKick = useCallback(() => {
    setGameState(prev => {
      if (prev.player.isAttacking) return prev;
      
      const newState = { ...prev };
      newState.player.isAttacking = true;
      newState.player.attackType = 'kick';
      
      setTimeout(() => {
        setGameState(s => ({ 
          ...s, 
          player: { 
            ...s.player, 
            isAttacking: false, 
            attackType: null 
          } 
        }));
      }, 400);

      // Kicks are more powerful and have longer range
      const attackRange = newState.player.isJumping ? 90 : 70;
      let hitAny = false;
      
      newState.enemies = newState.enemies.filter(enemy => {
        const distance = Math.abs(enemy.x - newState.player.x);
        const verticalDistance = Math.abs(enemy.y - newState.player.y);
        
        if (distance < attackRange && verticalDistance < 60) {
          enemy.health -= 2; // Kicks do more damage
          enemy.isBeingHit = true;
          enemy.hitTimer = 20;
          enemy.isStunned = true;
          enemy.stunTimer = 45;
          
          // Kicks can launch enemies
          enemy.velocityY = -8;
          enemy.y -= 5;
          
          newState.player.score += 25;
          newState.player.combo += 1;
          newState.cameraShake = 8;
          hitAny = true;
          
          addParticle(newState, enemy.x, enemy.y - 20, 'hit', 'KICK!');
          
          if (newState.player.combo > 1) {
            addParticle(newState, enemy.x + 30, enemy.y - 40, 'combo');
          }
          
          if (enemy.health <= 0) {
            newState.player.score += enemy.type === 'boss' ? 200 : 75;
            addParticle(newState, enemy.x, enemy.y, 'text', 'CRITICAL!');
            return false;
          }
        }
        return true;
      });

      if (hitAny) {
        newState.specialMoveCharge = Math.min(100, newState.specialMoveCharge + 15);
      } else {
        newState.player.combo = 0;
      }

      return newState;
    });
  }, []);

  const performSpecialMove = useCallback(() => {
    if (gameState.specialMoveCharge < 30) return;
    
    setGameState(prev => {
      const newState = { ...prev };
      newState.player.isAttacking = true;
      newState.player.attackType = 'special';
      newState.specialMoveCharge = Math.max(0, newState.specialMoveCharge - 30);
      
      setTimeout(() => {
        setGameState(s => ({ 
          ...s, 
          player: { 
            ...s.player, 
            isAttacking: false, 
            attackType: null 
          } 
        }));
      }, 600);

      // Special move: "Zura Fury" - powerful spinning attack
      const attackRange = 120;
      let hitCount = 0;
      
      newState.enemies = newState.enemies.filter(enemy => {
        const distance = Math.abs(enemy.x - newState.player.x);
        const verticalDistance = Math.abs(enemy.y - newState.player.y);
        
        if (distance < attackRange && verticalDistance < 80) {
          enemy.health -= 3;
          enemy.isBeingHit = true;
          enemy.hitTimer = 25;
          enemy.isStunned = true;
          enemy.stunTimer = 60;
          
          // Launch enemies with special move
          enemy.velocityY = -12;
          enemy.y -= 10;
          
          newState.player.score += 40;
          newState.player.combo += 1;
          hitCount++;
          
          addParticle(newState, enemy.x, enemy.y - 30, 'hit', 'ZURA FURY!');
          addParticle(newState, enemy.x + 20, enemy.y - 20, 'explosion');
          addParticle(newState, enemy.x - 20, enemy.y - 20, 'explosion');
          
          if (enemy.health <= 0) {
            newState.player.score += enemy.type === 'boss' ? 300 : 100;
            addParticle(newState, enemy.x, enemy.y, 'text', 'DEVASTATING!');
            return false;
          }
        }
        return true;
      });

      if (hitCount > 0) {
        newState.cameraShake = 15;
        addParticle(newState, newState.player.x, newState.player.y - 40, 'combo');
      }

      return newState;
    });
  }, [gameState.specialMoveCharge]);

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

    // Camera shake effect
    const shakeX = gameState.cameraShake > 0 ? (Math.random() - 0.5) * gameState.cameraShake : 0;
    const shakeY = gameState.cameraShake > 0 ? (Math.random() - 0.5) * gameState.cameraShake : 0;
    
    ctx.save();
    ctx.translate(shakeX, shakeY);

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1e1b4b');
    gradient.addColorStop(1, '#312e81');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ground with texture
    ctx.fillStyle = '#4338ca';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    
    // Ground line details
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, canvas.height - 45);
      ctx.lineTo(i + 30, canvas.height - 45);
      ctx.stroke();
    }

    // Draw player (Enhanced Katsura with animations)
    const px = gameState.player.x;
    const py = gameState.player.y;
    
    // Animation effects based on state
    const walkCycle = Math.sin(gameState.player.animationFrame * 0.3) * (gameState.player.isMoving ? 3 : 0);
    const jumpOffset = gameState.player.isJumping ? -5 : 0;
    const attackGlow = gameState.player.isAttacking ? 3 : 0;
    
    // Player glow effect when attacking
    if (gameState.player.isAttacking) {
      ctx.shadowColor = gameState.player.attackType === 'special' ? '#f59e0b' : '#8b5cf6';
      ctx.shadowBlur = 15;
    }
    
    ctx.strokeStyle = gameState.player.isAttacking ? '#f59e0b' : gameState.player.isBlocking ? '#10b981' : '#8b5cf6';
    ctx.lineWidth = 3 + attackGlow;
    
    // Head with expression
    ctx.beginPath();
    ctx.arc(px, py - 40 + jumpOffset, 8, 0, Math.PI * 2);
    ctx.stroke();
    
    // Eyes (angry when attacking)
    ctx.fillStyle = gameState.player.isAttacking ? '#dc2626' : '#ffffff';
    ctx.fillRect(px - 3, py - 43 + jumpOffset, 2, 2);
    ctx.fillRect(px + 1, py - 43 + jumpOffset, 2, 2);
    
    // Body
    ctx.beginPath();
    ctx.moveTo(px, py - 32 + jumpOffset);
    ctx.lineTo(px, py - 10 + jumpOffset);
    ctx.stroke();
    
    // Arms with attack animations
    ctx.beginPath();
    ctx.moveTo(px, py - 25 + jumpOffset);
    
    if (gameState.player.attackType === 'punch') {
      // Punching animation
      const punchExtend = gameState.player.direction === 'right' ? 25 : -25;
      ctx.lineTo(px + punchExtend, py - 20 + jumpOffset);
    } else if (gameState.player.attackType === 'special') {
      // Spinning special move
      const spinAngle = gameState.player.animationFrame * 0.5;
      ctx.lineTo(px + Math.cos(spinAngle) * 20, py - 20 + Math.sin(spinAngle) * 5 + jumpOffset);
    } else {
      // Normal arm position
      ctx.lineTo(px + (gameState.player.direction === 'right' ? 15 : -15), py - 15 + jumpOffset);
    }
    ctx.stroke();
    
    // Legs with kick animations
    ctx.beginPath();
    ctx.moveTo(px, py - 10 + jumpOffset);
    
    if (gameState.player.attackType === 'kick') {
      // Kicking animation
      const kickExtend = gameState.player.direction === 'right' ? 20 : -20;
      ctx.lineTo(px + kickExtend, py - 5 + jumpOffset);
      ctx.moveTo(px, py - 10 + jumpOffset);
      ctx.lineTo(px - (kickExtend * 0.3), py + jumpOffset);
    } else {
      // Walking animation or normal stance
      ctx.lineTo(px + 10 + walkCycle, py + jumpOffset);
      ctx.moveTo(px, py - 10 + jumpOffset);
      ctx.lineTo(px - 10 - walkCycle, py + jumpOffset);
    }
    ctx.stroke();

    // Long hair (Katsura's signature) with movement
    ctx.strokeStyle = '#4338ca';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const hairSway = gameState.player.isMoving ? walkCycle * 0.5 : 0;
    ctx.moveTo(px - 8, py - 35 + jumpOffset);
    ctx.lineTo(px - 12 + hairSway, py - 20 + jumpOffset);
    ctx.moveTo(px + 8, py - 35 + jumpOffset);
    ctx.lineTo(px + 12 + hairSway, py - 20 + jumpOffset);
    ctx.stroke();
    
    // Blocking effect
    if (gameState.player.isBlocking) {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(px, py - 20, 25, 0, Math.PI);
      ctx.stroke();
    }

    ctx.shadowBlur = 0; // Reset shadow

    // Draw enemies with enhanced animations
    gameState.enemies.forEach(enemy => {
      const ex = enemy.x;
      const ey = enemy.y;
      
      // Enemy color and glow effects
      ctx.strokeStyle = enemy.isBeingHit ? '#ffffff' : 
                       enemy.type === 'boss' ? '#dc2626' : 
                       enemy.type === 'alien' ? '#16a34a' : '#ea580c';
      
      if (enemy.isBeingHit) {
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
      }
      
      ctx.lineWidth = enemy.type === 'boss' ? 4 : 2;
      
      // Enemy animation
      const enemyWalk = Math.sin(enemy.animationFrame * 0.2) * (enemy.isStunned ? 0 : 2);
      const hitShake = enemy.isBeingHit ? (Math.random() - 0.5) * 4 : 0;
      
      // Head
      ctx.beginPath();
      ctx.arc(ex + hitShake, ey - 30, enemy.type === 'boss' ? 12 : 6, 0, Math.PI * 2);
      ctx.stroke();
      
      // Body
      ctx.beginPath();
      ctx.moveTo(ex + hitShake, ey - (enemy.type === 'boss' ? 18 : 24));
      ctx.lineTo(ex + hitShake, ey - 5);
      ctx.stroke();
      
      // Arms and legs with animation
      ctx.beginPath();
      ctx.moveTo(ex + hitShake, ey - 15);
      ctx.lineTo(ex + (enemy.direction === 'right' ? 10 : -10) + enemyWalk + hitShake, ey - 10);
      ctx.moveTo(ex + hitShake, ey - 5);
      ctx.lineTo(ex + 8 + enemyWalk + hitShake, ey);
      ctx.moveTo(ex + hitShake, ey - 5);
      ctx.lineTo(ex - 8 - enemyWalk + hitShake, ey);
      ctx.stroke();

      // Health bar
      const healthBarWidth = 40;
      const healthPercentage = enemy.health / enemy.maxHealth;
      
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(ex - 20, ey - 60, healthBarWidth, 6);
      
      ctx.fillStyle = healthPercentage > 0.6 ? '#10b981' : healthPercentage > 0.3 ? '#f59e0b' : '#ef4444';
      ctx.fillRect(ex - 20, ey - 60, healthBarWidth * healthPercentage, 6);
      
      // Stun effect
      if (enemy.isStunned) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('★', ex - 5, ey - 65);
        ctx.fillText('★', ex + 10, ey - 70);
        ctx.fillText('★', ex - 15, ey - 70);
      }
      
      ctx.shadowBlur = 0;
    });

    // Draw enhanced particles
    gameState.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      const scale = particle.size || 1;
      
      ctx.save();
      ctx.globalAlpha = alpha;
      
      if (particle.type === 'explosion') {
        ctx.fillStyle = '#f59e0b';
        const size = 8 * scale * (1 - alpha * 0.5);
        ctx.fillRect(particle.x - size/2, particle.y - size/2, size, size);
        
        // Add spark effects
        ctx.fillStyle = '#fbbf24';
        for (let i = 0; i < 3; i++) {
          const sparkX = particle.x + (Math.random() - 0.5) * 20;
          const sparkY = particle.y + (Math.random() - 0.5) * 20;
          ctx.fillRect(sparkX, sparkY, 2, 2);
        }
      } else if (particle.type === 'hit') {
        ctx.fillStyle = '#ef4444';
        ctx.font = `bold ${16 * scale}px Arial`;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeText(particle.text || 'POW!', particle.x, particle.y);
        ctx.fillText(particle.text || 'POW!', particle.x, particle.y);
      } else if (particle.type === 'text') {
        ctx.fillStyle = '#8b5cf6';
        ctx.font = `bold ${14 * scale}px Arial`;
        ctx.fillText(particle.text || 'HIT!', particle.x, particle.y);
      } else if (particle.type === 'combo') {
        ctx.fillStyle = '#f59e0b';
        ctx.font = `bold ${20 * scale}px Arial`;
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 3;
        ctx.strokeText(particle.text || 'COMBO!', particle.x, particle.y);
        ctx.fillText(particle.text || 'COMBO!', particle.x, particle.y);
      } else if (particle.type === 'music') {
        ctx.fillStyle = '#a855f7';
        ctx.font = `bold ${18 * scale}px Arial`;
        ctx.fillText('♪', particle.x, particle.y);
      }
      
      ctx.restore();
    });

    ctx.restore(); // Restore from camera shake
  }, [gameState]);

  const restartGame = () => {
    setGameState({
      player: {
        x: 100,
        y: 300,
        groundY: 300,
        velocityY: 0,
        health: 3,
        score: 0,
        level: 1,
        isAttacking: false,
        attackType: null,
        isJumping: false,
        isMoving: false,
        direction: 'right',
        animationFrame: 0,
        isBlocking: false,
        combo: 0,
        maxCombo: 0
      },
      enemies: [],
      powerUps: [],
      particles: [],
      gameStatus: 'playing',
      currentWave: 1,
      specialMoveCharge: 0,
      cameraShake: 0
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

      {/* Enhanced Game UI Overlay */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="bg-black bg-opacity-75 text-white px-3 py-1 rounded">
          <strong>Health:</strong> {Array(gameState.player.health).fill('❤️').join('')}
        </div>
        <div className="bg-black bg-opacity-75 text-white px-3 py-1 rounded">
          <strong>Score:</strong> {gameState.player.score.toLocaleString()}
        </div>
        <div className="bg-black bg-opacity-75 text-white px-3 py-1 rounded">
          <strong>Wave:</strong> {gameState.currentWave}
        </div>
        <div className="bg-black bg-opacity-75 text-white px-3 py-1 rounded">
          <strong>Combo:</strong> {gameState.player.combo}x
        </div>
        <div className="bg-black bg-opacity-75 text-white px-3 py-1 rounded">
          <strong>Special:</strong> {gameState.specialMoveCharge}%
        </div>
        {gameState.player.maxCombo > 0 && (
          <div className="bg-yellow-600 bg-opacity-75 text-white px-3 py-1 rounded">
            <strong>Best Combo:</strong> {gameState.player.maxCombo}x
          </div>
        )}
      </div>

      {/* Combat Controls Helper */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded text-sm">
        <div className="text-center font-bold mb-2">TEKKEN-STYLE CONTROLS</div>
        <div>SPACE: Jump 🦘</div>
        <div>X: Punch 👊</div>
        <div>Z: Kick 🦵</div>
        <div>C: Special ⚡</div>
        <div>S: Block 🛡️</div>
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
