import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdventuresSection() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['/api/activities/today'],
  });

  if (isLoading) {
    return (
      <section id="adventures" className="py-16 bg-gradient-to-br from-yellow-100 to-orange-100 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black text-purple-600 mb-4">TODAY'S KATSURA ADVENTURES</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-3xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const disguiseActivity = activities?.find((a: any) => a.type === 'disguise');
  const missionActivity = activities?.find((a: any) => a.type === 'mission');
  const elizabethActivity = activities?.find((a: any) => a.type === 'elizabeth_message');

  return (
    <section id="adventures" className="py-16 bg-gradient-to-br from-yellow-100 to-orange-100 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-5xl font-black text-purple-600 mb-4 transform -rotate-1"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            TODAY'S KATSURA ADVENTURES
          </motion.h2>
          <div className="comic-bubble inline-block text-lg">
            Follow Katsura's daily chaos and revolutionary activities!
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Today's Disguise */}
          <motion.div
            initial={{ rotate: -5, opacity: 0 }}
            whileInView={{ rotate: 1, opacity: 1 }}
            whileHover={{ rotate: -1, scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white shadow-xl border-4 border-purple-500 hover-tilt">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-purple-700 mb-4 text-center">TODAY'S DISGUISE</h3>
                <div className="text-center space-y-4">
                  <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-yellow-500 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                    <div className="text-6xl">🧑‍🦱</div>
                  </div>
                  <div className="comic-bubble">
                    <div className="font-bold text-xl text-purple-600">{disguiseActivity?.title || "ZURAKO MODE"}</div>
                    <div className="text-sm mt-2">{disguiseActivity?.description || "Nobody will recognize me in this perfect disguise!"}</div>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <div><strong>Effectiveness:</strong> {disguiseActivity?.data?.effectiveness || 2}/10 🤦‍♀️</div>
                    <div><strong>Confidence:</strong> {disguiseActivity?.data?.confidence || 11}/10 💪</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Today's Mission */}
          <motion.div
            initial={{ rotate: 5, opacity: 0 }}
            whileInView={{ rotate: -1, opacity: 1 }}
            whileHover={{ rotate: 1, scale: 1.05 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white shadow-xl border-4 border-red-500 hover-tilt">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-red-600 mb-4 text-center">TODAY'S MISSION</h3>
                <div className="space-y-4">
                  <div className="bg-red-100 p-4 rounded-lg border-l-4 border-red-500">
                    <div className="font-bold text-lg">{missionActivity?.title || "OPERATION: STRAWBERRY LIBERATION"}</div>
                    <div className="text-sm mt-2">{missionActivity?.description || "Infiltrate the convenience store and secure strawberry milk supplies!"}</div>
                  </div>
                  
                  <div className="space-y-2">
                    {missionActivity?.data?.objectives?.map((obj: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">🎯 {obj.text}</span>
                        <span className={obj.completed ? "text-green-500" : "text-red-500"}>
                          {obj.completed ? "✅" : "❌"}
                        </span>
                      </div>
                    )) || (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">🎯 Enter store undetected</span>
                          <span className="text-green-500">✅</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">🥛 Acquire strawberry milk</span>
                          <span className="text-green-500">✅</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">🏃 Escape before recognition</span>
                          <span className="text-red-500">❌</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-600 italic">
                    *Mission failed due to loudly declaring "ZURA JANAI, KATSURA DA!" at checkout
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Elizabeth's Message Board */}
          <motion.div
            initial={{ rotate: -3, opacity: 0 }}
            whileInView={{ rotate: 2, opacity: 1 }}
            whileHover={{ rotate: -2, scale: 1.05 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-white shadow-xl border-4 border-blue-500 hover-tilt">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-blue-600 mb-4 text-center">ELIZABETH'S MESSAGE</h3>
                <div className="text-center space-y-4">
                  <motion.div 
                    className="text-6xl"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🐧
                  </motion.div>
                  <div className="bg-white border-4 border-black p-4 rounded-lg transform rotate-1">
                    <div className="font-bold text-xl mb-2">{elizabethActivity?.title || "TODAY'S SIGN"}:</div>
                    <div className="text-2xl font-black">{elizabethActivity?.description || "BOSS IS BROKE AGAIN"}</div>
                    <div className="text-sm mt-2 text-gray-600">*Elizabeth refuses to elaborate further</div>
                  </div>
                  
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <div className="font-bold">Elizabeth's Mood:</div>
                    <div className="flex justify-center space-x-2 mt-2">
                      <span className="text-2xl">😐</span>
                      <span className="text-xs">{elizabethActivity?.data?.mood || "Perpetually Unimpressed"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Weather Effects */}
      <motion.div 
        className="absolute top-10 left-10 text-6xl opacity-30"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        ☁️
      </motion.div>
      <motion.div 
        className="absolute bottom-10 right-10 text-6xl opacity-30"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
      >
        ⭐
      </motion.div>
    </section>
  );
}
