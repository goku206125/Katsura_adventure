import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const videos = [
  {
    id: 1,
    title: "Katsura and jackie chan",
    description: "Every single time Katsura corrects someone",
    duration: "5:32",
    views: "2.3M",
    thumbnail: "▶️",
    youtubeUrl: "https://www.youtube.com/watch?v=KcH-9SNR9sA"
  },
  {
    id: 2,
    title: "Katsurap Battle",
    description: "When Katsura discovered hip-hop",
    duration: "8:15",
    views: "1.8M",
    thumbnail: "🎤",
    youtubeUrl: "https://www.youtube.com/watch?v=DvS_2K5MVzU"
  },
  {
    id: 3,
    title: "Katsura become GUNDUM",
    description: "The dynamic duo's best scenes",
    duration: "12:04",
    views: "3.1M",
    thumbnail: "🐧",
    youtubeUrl: "https://www.youtube.com/watch?v=yEm1xzDmGXs"
  },
  {
    id: 4,
    title: "Disguise Master Fails",
    description: "katsura as santa clause",
    duration: "6:47",
    views: "2.7M",
    thumbnail: "🎭",
    youtubeUrl: "https://www.youtube.com/watch?v=0qqmXJHg0c0"
  },
  {
    id: 5,
    title: "Revolutionary Speeches",
    description: "Katsura's most passionate moments at fourth ninja war",
    duration: "9:23",
    views: "1.5M",
    thumbnail: "⚔️",
    youtubeUrl: "https://www.youtube.com/watch?v=LcJ6toaXGJM"
  },
  {
    id: 6,
    title: "Katsura bring revolutoin",
    description: "The funniest Katsura moments",
    duration: "15:18",
    views: "4.2M",
    thumbnail: "😂",
    youtubeUrl: "https://www.youtube.com/watch?v=p29cdN0mYaA"
  }
];

function getYoutubeId(url: string) {
  return url.split('v=')[1]?.split('&')[0] || '';
}

export default function VideoSection() {
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(videos[0]);

  const openVideo = (video: typeof videos[0]) => {
    setSelectedVideo(video);
    setIsTheaterMode(true);
  };

  return (
    <section id="videos" className="py-16 bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-5xl font-black gradient-text mb-4 transform rotate-1"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            ZURA'S GREATEST HITS
          </motion.h2>
          <div className="comic-bubble inline-block text-black">
            The most legendary moments in video form!
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className={`bg-gray-800 rounded-2xl overflow-hidden shadow-2xl transform ${index % 2 === 0 ? 'tilted' : 'tilted-right'} cursor-pointer`}>
                <div 
                  className="aspect-video bg-gray-700 relative group"
                  onClick={() => openVideo(video)}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={`https://img.youtube.com/vi/${getYoutubeId(video.youtubeUrl)}/hqdefault.jpg`}
                      alt={video.title}
                      className="object-cover w-full h-full rounded-lg"
                    />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                </div>
                <CardContent className="p-4">
                  <h4 className="font-bold text-lg mb-2 text-white">{video.title}</h4>
                  <p className="text-gray-400 text-sm mb-2">{video.description}</p>
                  <div className="text-xs text-gray-500">👁️ {video.views} views</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Theater Mode Button */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button 
            onClick={() => setIsTheaterMode(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-xl transform hover:scale-105 transition-all duration-300"
          >
            📺 OPEN THEATER MODE
          </Button>
        </motion.div>
      </div>

      {/* Theater Mode Dialog */}
      <Dialog open={isTheaterMode} onOpenChange={setIsTheaterMode}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-purple-600">
              {selectedVideo.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${getYoutubeId(selectedVideo.youtubeUrl)}`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="text-gray-600">
              {selectedVideo.description}
            </div>
            <div className="flex space-x-4">
              <Button className="bg-blue-500 hover:bg-blue-600">
                👍 Like
              </Button>
              <Button className="bg-green-500 hover:bg-green-600">
                📤 Share
              </Button>
              <Button variant="outline">
                💾 Save to Playlist
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
