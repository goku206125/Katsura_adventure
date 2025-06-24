import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSoundEffects } from "@/hooks/use-sound-effects";

export default function Header() {
  const { playSound } = useSoundEffects();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-800 to-purple-900 text-white">
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="3" fill="%23FFFFFF"/></svg>')`
        }} />
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center space-y-8">
          {/* Main Title */}
          <motion.h1 
            className="text-6xl md:text-8xl font-black gradient-text animate-glitch"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            KATSURA KOTARO
          </motion.h1>
          
          {/* Catchphrase Bubble */}
          <motion.div 
            className="flex justify-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="comic-bubble text-black text-2xl font-bold animate-bounce-slow max-w-md">
              "Zura janai, Katsura da!"
              <div className="text-sm mt-2 text-gray-600">*Translation: It's not Zura, it's Katsura!</div>
            </div>
          </motion.div>

          {/* Navigation Chaos */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <Button
              onClick={() => {
                playSound('adventures');
                scrollToSection('adventures');
              }}
              className="tilted bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-full font-bold hover-tilt transform transition-all duration-300 hover:shadow-lg hover:animate-shake"
            >
              🎭 Adventures
            </Button>
            <Button
              onClick={() => {
                playSound('quotes');
                scrollToSection('quotes');
              }}
              className="tilted-right bg-red-500 hover:bg-red-400 text-white px-6 py-3 rounded-full font-bold hover-tilt transform transition-all duration-300 hover:shadow-lg"
            >
              💬 Quotes
            </Button>
            <Button
              onClick={() => {
                playSound('games');
                scrollToSection('games');
              }}
              className="tilted bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-full font-bold hover-tilt transform transition-all duration-300 hover:shadow-lg"
            >
              🎮 Games
            </Button>
            <Button
              onClick={() => {
                playSound('videos');
                scrollToSection('videos');
              }}
              className="tilted-right bg-green-500 hover:bg-green-400 text-white px-6 py-3 rounded-full font-bold hover-tilt transform transition-all duration-300 hover:shadow-lg"
            >
              📺 Videos
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <motion.div 
        className="absolute -top-10 -right-10 text-9xl opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        ⚔️
      </motion.div>
      <motion.div 
        className="absolute -bottom-10 -left-10 text-9xl opacity-20"
        animate={{ rotate: -360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        🌸
      </motion.div>
    </header>
  );
}
