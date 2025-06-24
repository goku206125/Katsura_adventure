import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface QuizAnswers {
  q1: string;
  q2: string;
}

export default function QuizSection() {
  const [answers, setAnswers] = useState<QuizAnswers>({ q1: '', q2: '' });
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<string>('');
  const { toast } = useToast();

  const submitQuizMutation = useMutation({
    mutationFn: async (quizData: any) => {
      const response = await apiRequest('POST', '/api/quiz-result', quizData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Quiz Completed!",
        description: "Your patriot level has been assessed!",
      });
    }
  });

  const calculateResult = () => {
    let patriotLevel = 0;
    let resultText = '';

    // Calculate based on answers
    if (answers.q1 === 'revolution') patriotLevel += 50;
    else if (answers.q1 === 'strawberry') patriotLevel += 20;
    else patriotLevel += 10;

    if (answers.q2 === 'zurako') patriotLevel += 30;
    else if (answers.q2 === 'captain') patriotLevel += 40;
    else patriotLevel += 50;

    if (patriotLevel >= 80) {
      resultText = "TRUE JOUI PATRIOT! You have the revolutionary spirit of Katsura himself!";
    } else if (patriotLevel >= 50) {
      resultText = "PROMISING RECRUIT! You show potential for the Joui cause!";
    } else {
      resultText = "NEEDS TRAINING! Spend more time with Katsura to understand the revolution!";
    }

    setResult(resultText);
    setShowResult(true);

    // Submit to backend
    submitQuizMutation.mutate({
      answers,
      result: resultText,
      patriotLevel,
      timestamp: new Date().toISOString()
    });
  };

  const handleSubmit = () => {
    if (!answers.q1 || !answers.q2) {
      toast({
        title: "Incomplete Quiz",
        description: "Please answer all questions before submitting!",
        variant: "destructive"
      });
      return;
    }
    calculateResult();
  };

  return (
    <section className="py-16 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-8">
          <motion.h2 
            className="text-5xl font-black animate-wiggle"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            DO YOU WANT TO BE A JOUI PATRIOT?
          </motion.h2>
          
          {/* Quiz Card */}
          <motion.div
            initial={{ rotate: -5, opacity: 0 }}
            whileInView={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            whileHover={{ rotate: 1, scale: 1.02 }}
          >
            <Card className="max-w-2xl mx-auto bg-white text-black shadow-2xl">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-2xl font-bold text-purple-600">Katsura's Patriot Assessment</div>
                  
                  {!showResult ? (
                    <div className="text-left space-y-6">
                      {/* Question 1 */}
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <div className="font-bold text-lg mb-3">Question 1: What's your stance on the current government?</div>
                        <RadioGroup 
                          value={answers.q1} 
                          onValueChange={(value) => setAnswers({...answers, q1: value})}
                        >
                          <div className="flex items-center space-x-2 hover:bg-purple-100 p-2 rounded cursor-pointer">
                            <RadioGroupItem value="best" id="q1-best" />
                            <Label htmlFor="q1-best" className="cursor-pointer">They're doing their best! 😊</Label>
                          </div>
                          <div className="flex items-center space-x-2 hover:bg-purple-100 p-2 rounded cursor-pointer">
                            <RadioGroupItem value="revolution" id="q1-revolution" />
                            <Label htmlFor="q1-revolution" className="cursor-pointer">REVOLUTION IS THE ONLY WAY! ⚔️</Label>
                          </div>
                          <div className="flex items-center space-x-2 hover:bg-purple-100 p-2 rounded cursor-pointer">
                            <RadioGroupItem value="strawberry" id="q1-strawberry" />
                            <Label htmlFor="q1-strawberry" className="cursor-pointer">I just want to eat strawberry milk... 🥛</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      {/* Question 2 */}
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <div className="font-bold text-lg mb-3">Question 2: Your preferred disguise?</div>
                        <RadioGroup 
                          value={answers.q2} 
                          onValueChange={(value) => setAnswers({...answers, q2: value})}
                        >
                          <div className="flex items-center space-x-2 hover:bg-purple-100 p-2 rounded cursor-pointer">
                            <RadioGroupItem value="zurako" id="q2-zurako" />
                            <Label htmlFor="q2-zurako" className="cursor-pointer">Zurako (The Ultimate Deception) 💃</Label>
                          </div>
                          <div className="flex items-center space-x-2 hover:bg-purple-100 p-2 rounded cursor-pointer">
                            <RadioGroupItem value="captain" id="q2-captain" />
                            <Label htmlFor="q2-captain" className="cursor-pointer">Captain Katsura (Naval Commander) ⚓</Label>
                          </div>
                          <div className="flex items-center space-x-2 hover:bg-purple-100 p-2 rounded cursor-pointer">
                            <RadioGroupItem value="passion" id="q2-passion" />
                            <Label htmlFor="q2-passion" className="cursor-pointer">No disguise, just PASSION! 🔥</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <Button 
                        onClick={handleSubmit}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full font-bold text-xl transform hover:scale-105 transition-all duration-300"
                        disabled={submitQuizMutation.isPending}
                      >
                        {submitQuizMutation.isPending ? 'ASSESSING...' : 'ASSESS MY PATRIOTISM! 🎌'}
                      </Button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.6 }}
                      className="text-center space-y-4"
                    >
                      <div className="text-6xl animate-bounce">🏆</div>
                      <div className="text-xl font-bold text-purple-600">ASSESSMENT COMPLETE!</div>
                      <div className="bg-purple-100 p-4 rounded-lg">
                        <div className="text-lg font-bold">{result}</div>
                      </div>
                      <Button 
                        onClick={() => {
                          setShowResult(false);
                          setAnswers({ q1: '', q2: '' });
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-bold"
                      >
                        TAKE QUIZ AGAIN
                      </Button>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="text-9xl absolute top-10 left-10"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🏴‍☠️
        </motion.div>
        <motion.div 
          className="text-9xl absolute bottom-10 right-10"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        >
          ⚔️
        </motion.div>
      </div>
    </section>
  );
}
