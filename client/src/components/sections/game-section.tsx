import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StickFigureGame from "@/components/game/stick-figure-game";

export default function GameSection() {
  const [isGameActive, setIsGameActive] = useState(false);

  const gameFeatures = [
    {
      icon: "⚔️",
      title: "Multiple Enemies",
      description: "Fight Shinsengumi & aliens"
    },
    {
      icon: "🎭",
      title: "Special Moves",
      description: "Zura Kick & Katsurap Attack"
    },
    {
      icon: "🏆",
      title: "Achievements",
      description: "Unlock \"True Joui Patriot\""
    }
  ];

  const gameControls = [
    { keys: "⬅️➡️", action: "A/D: Move" },
    { keys: "🦘", action: "SPACE: Jump" },
    { keys: "👊", action: "X: Punch" },
    { keys: "🦵", action: "Z: Kick" },
    { keys: "⚡", action: "C: Special Move" },
    { keys: "🛡️", action: "S: Block" },
    { keys: "🎵", action: "R: Katsurap" },
    { keys: "🐧", action: "E: Elizabeth" }
  ];

  return (
    <section id="games" className="py-16 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-5xl font-black mb-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            🎮 KATSURA'S JOUI ADVENTURE
          </motion.h2>
          <div className="text-xl">The ultimate stress-relief stick figure game!</div>
        </div>

        {/* Game Preview */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-black rounded-3xl shadow-2xl">
              <CardContent className="p-8">
                {/* Game Canvas Preview */}
                <div className="aspect-video bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl relative overflow-hidden mb-6">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <motion.div 
                        className="text-6xl"
                        animate={{ x: [0, 20, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        🏃‍♂️
                      </motion.div>
                      <div className="text-2xl font-bold">KATSURA'S ADVENTURE</div>
                      <div className="text-lg">Press SPACE to start the revolution!</div>
                    </div>
                  </div>
                  
                  {/* Game UI Elements */}
                  <div className="absolute top-4 left-4 space-y-2">
                    <div className="bg-black bg-opacity-50 px-3 py-1 rounded text-sm">
                      <strong>Health:</strong> ❤️❤️❤️
                    </div>
                    <div className="bg-black bg-opacity-50 px-3 py-1 rounded text-sm">
                      <strong>Score:</strong> 1337
                    </div>
                    <div className="bg-black bg-opacity-50 px-3 py-1 rounded text-sm">
                      <strong>Level:</strong> Joui Trainee
                    </div>
                  </div>

                  {/* Animated Sound Effects */}
                  <motion.div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-red-500"
                    animate={{ 
                      scale: [0, 1.2, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ fontFamily: 'Creepster, cursive' }}
                  >
                    POW!
                  </motion.div>
                </div>

                {/* Enhanced Game Controls */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {gameControls.map((control, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-gray-800 to-gray-900 p-3 rounded-lg text-center border border-purple-500 hover:border-yellow-400 transition-colors"
                    >
                      <div className="text-xl mb-1">{control.keys}</div>
                      <div className="text-xs font-bold">{control.action}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Combat System Highlights */}
                <div className="bg-gradient-to-r from-red-900 to-purple-900 p-4 rounded-lg mb-6">
                  <h4 className="font-bold text-lg mb-3 text-center">🥊 TEKKEN-STYLE COMBAT SYSTEM</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl mb-1">👊</div>
                      <div className="font-bold">Combo System</div>
                      <div>Chain attacks for higher scores</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-1">🦘</div>
                      <div className="font-bold">Advanced Movement</div>
                      <div>Jump, dodge, and aerial attacks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-1">⚡</div>
                      <div className="font-bold">Special Moves</div>
                      <div>"Zura Fury" devastating attacks</div>
                    </div>
                  </div>
                </div>

                {/* Game Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {gameFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="text-center"
                    >
                      <div className="text-4xl mb-2">{feature.icon}</div>
                      <div className="font-bold">{feature.title}</div>
                      <div className="text-sm opacity-80">{feature.description}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Play Button */}
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      onClick={() => setIsGameActive(true)}
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-12 py-6 rounded-full font-black text-2xl"
                    >
                      🚀 START REVOLUTION
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Background Game Elements */}
      <motion.div 
        className="absolute top-10 left-10 text-6xl opacity-20"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        🎮
      </motion.div>
      <motion.div 
        className="absolute bottom-10 right-10 text-6xl opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        ⚔️
      </motion.div>
      <motion.div 
        className="absolute top-1/2 right-10 text-4xl opacity-20"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        💥
      </motion.div>

      {/* Game Dialog */}
      <Dialog open={isGameActive} onOpenChange={setIsGameActive}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              🎮 KATSURA'S JOUI ADVENTURE
            </DialogTitle>
          </DialogHeader>
          <StickFigureGame onClose={() => setIsGameActive(false)} />
        </DialogContent>
      </Dialog>
    </section>
  );
}
