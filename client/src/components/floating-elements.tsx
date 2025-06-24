import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function FloatingElements() {
  const [elizabethMessages, setElizabethMessages] = useState<{ id: number; message: string; show: boolean }[]>([]);

  const messages = [
    "BOSS IS LATE",
    "HUNGRY", 
    "NO MONEY",
    "REVOLUTION FAILED",
    "NEED STRAWBERRY MILK",
    "ZURA IS WEIRD"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      const newMessage = {
        id: Date.now(),
        message: randomMessage,
        show: true
      };
      
      setElizabethMessages(prev => [...prev, newMessage]);
      
      // Remove message after 4 seconds
      setTimeout(() => {
        setElizabethMessages(prev => 
          prev.map(msg => msg.id === newMessage.id ? { ...msg, show: false } : msg)
        );
      }, 3000);
      
      // Clean up after animation
      setTimeout(() => {
        setElizabethMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
      }, 4000);
    }, Math.random() * 5000 + 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Cherry Blossoms */}
      {[0, 2, 4].map((delay) => (
        <motion.div
          key={delay}
          className="floating-element text-2xl"
          style={{ 
            top: `${20 + Math.random() * 60}%`, 
            left: '-50px'
          }}
          animate={{
            x: ['0px', `${window.innerWidth + 100}px`],
            y: [0, -20, 0, -10, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: delay,
            ease: "linear"
          }}
        >
          🌸
        </motion.div>
      ))}

      {/* Static Elizabeth Signs */}
      <motion.div
        className="floating-element"
        style={{ top: '10%', right: '20px' }}
        animate={{
          y: [0, -10, 0],
          rotate: [12, 8, 12]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 1
        }}
      >
        <div className="bg-white p-2 rounded-lg border-2 border-gray-800 text-xs font-bold rotate-12">
          📝 ZURA JANAI!
        </div>
      </motion.div>

      <motion.div
        className="floating-element"
        style={{ top: '70%', left: '20px' }}
        animate={{
          y: [0, -10, 0],
          rotate: [-12, -8, -12]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 3
        }}
      >
        <div className="bg-white p-2 rounded-lg border-2 border-gray-800 text-xs font-bold -rotate-12">
          📝 KATSURA DA!
        </div>
      </motion.div>

      {/* Random Elizabeth Appearances */}
      {elizabethMessages.map((msg) => (
        <motion.div
          key={msg.id}
          className="fixed bottom-5 right-0 z-50"
          initial={{ x: 300 }}
          animate={{ x: msg.show ? 20 : 300 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white p-4 rounded-lg border-2 border-black shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🐧</div>
              <div className="font-bold">{msg.message}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
}
