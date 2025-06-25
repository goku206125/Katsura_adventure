import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const galleryImages = [
  {
    id: 1,
    title: "SERIOUS LEADER MODE",
    caption: "Planning the revolution...",
    imageUrl: "/attached_assets/serious-leader.jpg",
    emoji: "🧑‍🦱",
    bgColor: "from-purple-200 to-blue-200"
  },
  {
    id: 2,
    title: "SHOCKED KATSURA",
    caption: "Zura janai!",
    imageUrl: "/attached_assets/shocked-katsura.jpg",
    emoji: "😱",
    bgColor: "from-yellow-200 to-orange-200"
  },
  {
    id: 3,
    title: "COMEDY GOLD",
    caption: "Epic fail moment",
    imageUrl: "/attached_assets/comedy-gold.jpg",
    emoji: "🤪",
    bgColor: "from-green-200 to-teal-200"
  },
  {
    id: 4,
    title: "WITH ELIZABETH",
    caption: "Dynamic duo",
    imageUrl: "/attached_assets/with-elizabeth.jpg",
    emoji: "🧑‍🦱🐧",
    bgColor: "from-pink-200 to-purple-200"
  },
  {
    id: 5,
    title: "DISGUISE MASTER",
    caption: "100% unrecognizable",
    imageUrl: "/attached_assets/disguise-master.jpg",
    emoji: "🥸",
    bgColor: "from-red-200 to-pink-200"
  },
  {
    id: 6,
    title: "DRAMATIC POSE",
    caption: "For the revolution!",
    imageUrl: "/attached_assets/ai6b9_pa2h_VWL.webp",
    emoji: "⚔️",
    bgColor: "from-indigo-200 to-purple-200"
  }
];

export default function GallerySection() {
  return (
    <section className="py-16 bg-gradient-to-br from-pink-100 to-purple-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-5xl font-black text-purple-600 mb-4 transform -rotate-1"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            KATSURA'S PHOTO GALLERY
          </motion.h2>
          <div className="comic-bubble inline-block">
            Witness the many faces of our glorious leader!
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              className="group"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.1, rotate: 0 }}
            >
              <Card className={`bg-white shadow-lg transform ${index % 2 === 0 ? 'tilted' : 'tilted-right'} hover:rotate-0 transition-all duration-500 hover-tilt cursor-pointer`}>
                <CardContent className="p-3">
                  <div className={`w-full h-48 bg-gradient-to-br ${image.bgColor} rounded-lg mb-2 flex items-center justify-center`}>
                    {image.imageUrl ? (
                      <img
                        src={image.imageUrl}
                        alt={image.title}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    ) : (
                      <span className="text-6xl">{image.emoji}</span>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-sm">{image.title}</div>
                    <div className="text-xs text-gray-600">"{image.caption}"</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Gallery Navigation */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="comic-bubble inline-block bg-purple-100">
            <div className="font-bold text-purple-600">More photos coming soon!</div>
            <div className="text-sm text-gray-600 mt-1">Katsura is too busy with the revolution to pose properly</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
