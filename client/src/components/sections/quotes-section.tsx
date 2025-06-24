import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Quote } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { useSoundEffects } from "@/hooks/use-sound-effects";

export default function QuotesSection() {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const { playSound } = useSoundEffects();

  const { data: quotes, isLoading } = useQuery({
    queryKey: ['/api/quotes'],
  });

  const generateRandomQuote = () => {
    if (quotes && quotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
      playSound('quote');
    }
  };

  // Set initial quote when quotes load
  if (quotes && quotes.length > 0 && !currentQuote) {
    setCurrentQuote(quotes[0]);
  }

  const shareQuote = (platform: string) => {
    if (!currentQuote) return;
    
    const message = `"${currentQuote.text}" - Katsura Kotaro`;
    const url = window.location.href;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`);
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`);
    }
  };

  const quoteCategories = [
    { name: 'REVOLUTIONARY', color: 'from-red-600 to-red-800', icon: '🔥', category: 'revolutionary' },
    { name: 'DISGUISE MASTER', color: 'from-green-600 to-green-800', icon: '🎭', category: 'disguise' },
    { name: 'KATSURAP', color: 'from-purple-600 to-purple-800', icon: '🎵', category: 'katsurap' }
  ];

  if (isLoading) {
    return (
      <section id="quotes" className="py-16 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-4 gradient-text">LEGENDARY QUOTES</h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-48 rounded-3xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="quotes" className="py-16 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-5xl font-black mb-4 gradient-text transform rotate-1"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            LEGENDARY QUOTES
          </motion.h2>
          <div className="text-xl opacity-80">Words of wisdom from the man himself</div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <Button 
              onClick={generateRandomQuote}
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-full font-bold text-xl hover:animate-shake transform hover:scale-105 transition-all duration-300"
            >
              🎲 GENERATE RANDOM QUOTE
            </Button>
          </div>

          {/* Quote Display */}
          <motion.div
            key={currentQuote?.id}
            initial={{ scale: 0, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
          >
            <Card className="bg-white text-black shadow-2xl hover:rotate-0 transition-all duration-500">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="text-6xl">💬</div>
                  <motion.div 
                    className="text-3xl font-bold text-purple-600"
                    key={currentQuote?.text}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    "{currentQuote?.text || 'Zura janai, Katsura da!'}"
                  </motion.div>
                  <div className="text-lg text-gray-600">- Katsura Kotaro, every single episode</div>
                  
                  <div className="flex justify-center space-x-4 mt-6">
                    <Button 
                      onClick={() => shareQuote('twitter')}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center space-x-2"
                    >
                      <i className="fab fa-twitter"></i>
                      <span>Tweet This</span>
                    </Button>
                    <Button 
                      onClick={() => shareQuote('whatsapp')}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full flex items-center space-x-2"
                    >
                      <i className="fab fa-whatsapp"></i>
                      <span>Share</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quote Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quoteCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className={`bg-gradient-to-br ${category.color} p-6 rounded-2xl transform ${index % 2 === 0 ? 'tilted' : 'tilted-right'} cursor-pointer`}
                onClick={() => {
                  const categoryQuotes = quotes?.filter((q: Quote) => q.category === category.category);
                  if (categoryQuotes && categoryQuotes.length > 0) {
                    const randomQuote = categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
                    setCurrentQuote(randomQuote);
                    playSound('category');
                  }
                }}
              >
                <h4 className="font-bold text-xl mb-3">{category.icon} {category.name}</h4>
                <div className="text-sm opacity-80">
                  Click to see {category.name.toLowerCase()} quotes
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="text-9xl absolute top-1/4 left-1/4"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🎤
        </motion.div>
        <motion.div 
          className="text-9xl absolute bottom-1/4 right-1/4"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
        >
          💭
        </motion.div>
      </div>
    </section>
  );
}
