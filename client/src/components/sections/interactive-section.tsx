import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSoundEffects } from "@/hooks/use-sound-effects";

export default function InteractiveSection() {
  const [elizabethMessage, setElizabethMessage] = useState('');
  const [elizabethResponse, setElizabethResponse] = useState('BOSS IS WEIRD');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [costumeMode, setCostumeMode] = useState('normal');
  const [elizabethMood, setElizabethMood] = useState('Unimpressed');
  const { playSound } = useSoundEffects();

  const scenarios = [
    {
      text: "You're running late for an important meeting. What do you do?",
      answers: [
        { text: "A) Arrive fashionably late with style", correct: false },
        { text: "B) Disguise yourself as someone else", correct: false },
        { text: "C) Dramatically burst through the window", correct: true }
      ]
    },
    {
      text: "The Shinsengumi are chasing you. Your move?",
      answers: [
        { text: "A) Hide behind Elizabeth", correct: false },
        { text: "B) Challenge them to a rap battle", correct: true },
        { text: "C) Surrender gracefully", correct: false }
      ]
    },
    {
      text: "You need to buy groceries but might be recognized. What's your plan?",
      answers: [
        { text: "A) Send Elizabeth instead", correct: false },
        { text: "B) Wear your most obvious disguise", correct: true },
        { text: "C) Go at 3 AM when nobody's around", correct: false }
      ]
    }
  ];

  const costumes = [
    { id: 'normal', name: 'Normal Katsura', emoji: '🧑‍🦱' },
    { id: 'zurako', name: 'Zurako', emoji: '💃' },
    { id: 'captain', name: 'Captain', emoji: '⚓' },
    { id: 'mask', name: 'Masked', emoji: '🎭' }
  ];

  const elizabethTranslateMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/elizabeth-translate', { message });
      return response.json();
    },
    onSuccess: (data) => {
      setElizabethResponse(data.translation);
      playSound('elizabeth');
    }
  });

  const translateMessage = () => {
    if (elizabethMessage.trim()) {
      elizabethTranslateMutation.mutate(elizabethMessage);
    }
  };

  const nextScenario = () => {
    setCurrentScenario((prev) => (prev + 1) % scenarios.length);
    setSelectedAnswer('');
  };

  const checkAnswer = (answer: string) => {
    const scenario = scenarios[currentScenario];
    const answerObj = scenario.answers.find(a => a.text === answer);
    setSelectedAnswer(answer);
    
    if (answerObj?.correct) {
      playSound('correct');
    } else {
      playSound('wrong');
    }
  };

  const feedElizabeth = () => {
    const moods = ['Slightly Less Unimpressed', 'Still Hungry', 'Mildly Satisfied', 'Wants More'];
    setElizabethMood(moods[Math.floor(Math.random() * moods.length)]);
    playSound('feed');
  };

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-5xl font-black gradient-text mb-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            INTERACTIVE KATSURA ZONE
          </motion.h2>
          <div className="text-xl opacity-80">Experience the chaos firsthand!</div>
        </div>

        {/* Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Elizabeth Translator */}
          <motion.div
            initial={{ opacity: 0, rotate: -5 }}
            whileInView={{ opacity: 1, rotate: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white text-black shadow-2xl tilted">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-center mb-4 text-purple-600">ELIZABETH TRANSLATOR</h3>
                <div className="space-y-4">
                  <motion.div 
                    className="text-center text-6xl"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🐧
                  </motion.div>
                  <Textarea
                    placeholder="Type your message..."
                    value={elizabethMessage}
                    onChange={(e) => setElizabethMessage(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                  <Button 
                    onClick={translateMessage}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold"
                    disabled={elizabethTranslateMutation.isPending}
                  >
                    {elizabethTranslateMutation.isPending ? 'TRANSLATING...' : 'TRANSLATE TO ELIZABETH SIGN'}
                  </Button>
                  <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <div className="font-bold mb-2">Elizabeth's Response:</div>
                    <div className="bg-white border-2 border-black p-3 rounded text-lg font-bold">
                      "{elizabethResponse}"
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* What Would Katsura Do */}
          <motion.div
            initial={{ opacity: 0, rotate: 5 }}
            whileInView={{ opacity: 1, rotate: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white text-black shadow-2xl tilted-right">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-center mb-4 text-red-600">WHAT WOULD KATSURA DO?</h3>
                <div className="space-y-4">
                  <div className="bg-red-100 p-4 rounded-lg">
                    <div className="font-bold mb-2">SCENARIO:</div>
                    <div className="text-sm">{scenarios[currentScenario].text}</div>
                  </div>
                  <div className="space-y-2">
                    {scenarios[currentScenario].answers.map((answer, index) => (
                      <Button
                        key={index}
                        onClick={() => checkAnswer(answer.text)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedAnswer === answer.text
                            ? answer.correct
                              ? 'bg-green-200 hover:bg-green-300'
                              : 'bg-red-200 hover:bg-red-300'
                            : 'bg-gray-100 hover:bg-purple-100'
                        }`}
                        variant="ghost"
                      >
                        {answer.text}
                      </Button>
                    ))}
                  </div>
                  {selectedAnswer && (
                    <div className="text-center">
                      {scenarios[currentScenario].answers.find(a => a.text === selectedAnswer)?.correct ? (
                        <div className="text-green-600 font-bold">✅ That's exactly what Katsura would do!</div>
                      ) : (
                        <div className="text-red-600 font-bold">❌ Katsura would be more dramatic!</div>
                      )}
                      <Button onClick={nextScenario} className="mt-2 bg-blue-500 hover:bg-blue-600 text-white">
                        NEXT SCENARIO
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Katsurap Karaoke */}
          <motion.div
            initial={{ opacity: 0, rotate: -3 }}
            whileInView={{ opacity: 1, rotate: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-white text-black shadow-2xl tilted">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-center mb-4 text-green-600">KATSURAP KARAOKE</h3>
                <div className="space-y-4">
                  <motion.div 
                    className="text-center text-6xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    🎤
                  </motion.div>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                    <div className="mb-2">🎵 NOW PLAYING: Revolutionary Rap</div>
                    <div className="border-l-4 border-green-400 pl-3">
                      "Yo yo, it's not Zura, it's Katsura<br />
                      Fighting for Japan with my heart so pure-a<br />
                      Elizabeth by my side, we never give up<br />
                      Revolutionary spirit, filling my cup!"
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => playSound('katsurap')}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                    >
                      🎵 PLAY
                    </Button>
                    <Button 
                      onClick={() => playSound('next')}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                    >
                      🔄 NEXT
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Mini Games Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Costume Dress-up */}
          <motion.div
            initial={{ opacity: 0, rotate: -2 }}
            whileInView={{ opacity: 1, rotate: 0 }}
            whileHover={{ rotate: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-pink-500 to-purple-600 p-8 rounded-3xl text-center"
          >
            <h3 className="text-3xl font-bold mb-6">👘 COSTUME DRESS-UP</h3>
            <div className="bg-white text-black p-6 rounded-2xl">
              <div className="text-8xl mb-4">
                {costumes.find(c => c.id === costumeMode)?.emoji}
              </div>
              <div className="text-lg font-bold mb-4">
                Current: {costumes.find(c => c.id === costumeMode)?.name}
              </div>
              <Select value={costumeMode} onValueChange={setCostumeMode}>
                <SelectTrigger className="mb-4">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {costumes.map(costume => (
                    <SelectItem key={costume.id} value={costume.id}>
                      {costume.emoji} {costume.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={() => playSound('disguise')}
                className="bg-purple-600 text-white px-6 py-2 rounded-full font-bold"
              >
                APPLY DISGUISE
              </Button>
            </div>
          </motion.div>

          {/* Elizabeth Pet Simulator */}
          <motion.div
            initial={{ opacity: 0, rotate: 2 }}
            whileInView={{ opacity: 1, rotate: 0 }}
            whileHover={{ rotate: -1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-blue-500 to-teal-600 p-8 rounded-3xl text-center"
          >
            <h3 className="text-3xl font-bold mb-6">🐧 ELIZABETH SIMULATOR</h3>
            <div className="bg-white text-black p-6 rounded-2xl">
              <motion.div 
                className="text-8xl mb-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🐧
              </motion.div>
              <div className="space-y-3">
                <div className="bg-gray-100 p-2 rounded">
                  <strong>Mood:</strong> <span className="text-blue-600">{elizabethMood}</span>
                </div>
                <div className="bg-gray-100 p-2 rounded">
                  <strong>Sign:</strong> "FEED ME"
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={feedElizabeth}
                    className="flex-1 bg-green-500 text-white"
                  >
                    🍎 Feed
                  </Button>
                  <Button 
                    onClick={() => playSound('play')}
                    className="flex-1 bg-blue-500 text-white"
                  >
                    🎵 Play
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <motion.div 
        className="absolute top-10 right-10 text-6xl opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        🎮
      </motion.div>
      <motion.div 
        className="absolute bottom-10 left-10 text-6xl opacity-20"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        🎭
      </motion.div>
    </section>
  );
}
