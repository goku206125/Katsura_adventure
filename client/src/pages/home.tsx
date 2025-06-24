import { motion } from "framer-motion";
import Header from "@/components/sections/header";
import QuizSection from "@/components/sections/quiz-section";
import AdventuresSection from "@/components/sections/adventures-section";
import QuotesSection from "@/components/sections/quotes-section";
import GallerySection from "@/components/sections/gallery-section";
import InteractiveSection from "@/components/sections/interactive-section";
import VideoSection from "@/components/sections/video-section";
import GameSection from "@/components/sections/game-section";
import FloatingElements from "@/components/floating-elements";

export default function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-white relative"
    >
      <FloatingElements />
      
      <Header />
      <QuizSection />
      <AdventuresSection />
      <QuotesSection />
      <GallerySection />
      <InteractiveSection />
      <VideoSection />
      <GameSection />
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <div className="text-4xl font-bold gradient-text">
              REMEMBER: ZURA JANAI, KATSURA DA!
            </div>
            
            <div className="flex justify-center space-x-8 text-2xl">
              <span className="animate-float">🌸</span>
              <span className="animate-float" style={{ animationDelay: '0.5s' }}>⚔️</span>
              <span className="animate-float" style={{ animationDelay: '1s' }}>🐧</span>
              <span className="animate-float" style={{ animationDelay: '1.5s' }}>🎭</span>
              <span className="animate-float" style={{ animationDelay: '2s' }}>🌸</span>
            </div>

            <div className="text-gray-400 text-sm max-w-2xl mx-auto">
              This fan site is created with love for the legendary Katsura Kotaro from Gintama. 
              All content is for entertainment purposes only. Remember to support the official series!
            </div>

            <div className="text-xs text-gray-600">
              © 2024 Katsura Kotaro Ultimate Fan Experience - A Joui Production
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
