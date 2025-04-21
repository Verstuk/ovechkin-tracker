"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

// Используем фотографии Овечкина, включая новые
const photos = [
  {
    id: 1,
    thumbnail:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/i%20%281%29-KWKNZak8uddRZKpeBuLbfkJ1WsyU7V.webp",
    fullSize: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/i%20%281%29-KWKNZak8uddRZKpeBuLbfkJ1WsyU7V.webp",
    caption: "Овечкин в белой форме Вашингтон Кэпиталз",
    year: "2023",
  },
  {
    id: 2,
    thumbnail:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2_1c8e67f8.jpg-fuUAiVeLRGa6rAweQ51STnUM2QoUEh.jpeg",
    fullSize:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2_1c8e67f8.jpg-fuUAiVeLRGa6rAweQ51STnUM2QoUEh.jpeg",
    caption: "Овечкин в форме сборной России",
    year: "2016",
  },
  {
    id: 3,
    thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/scale_1200-4eeyfANQsKH77O0767aZH7TL4xQ3xs.jpeg",
    fullSize: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/scale_1200-4eeyfANQsKH77O0767aZH7TL4xQ3xs.jpeg",
    caption: "Овечкин в белой форме с номером 8",
    year: "2022",
  },
  {
    id: 4,
    thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/15-3.jpg-4iE3OrwzP35AtejksNy7CJ60dU7VKz.jpeg",
    fullSize: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/15-3.jpg-4iE3OrwzP35AtejksNy7CJ60dU7VKz.jpeg",
    caption: "Овечкин ведет шайбу в красной форме",
    year: "2023",
  },
  {
    id: 5,
    thumbnail:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0768dadcb42f3802d6eddfbcc582d-ZzdzinnvuMbj5VMeqh0xYtmTHmFb4k.jpeg",
    fullSize:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0768dadcb42f3802d6eddfbcc582d-ZzdzinnvuMbj5VMeqh0xYtmTHmFb4k.jpeg",
    caption: "Овечкин делает бросок в красной форме",
    year: "2022",
  },
  {
    id: 6,
    thumbnail:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ethfpdayzlspztzjgxkw.jpg-PYI6lddWWreqCO2LRJL5AmrLW0Ahkv.jpeg",
    fullSize:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ethfpdayzlspztzjgxkw.jpg-PYI6lddWWreqCO2LRJL5AmrLW0Ahkv.jpeg",
    caption: "Овечкин празднует гол в красной форме",
    year: "2023",
  },
  {
    id: 7,
    thumbnail:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1646653872061581_fDSYGgah.jpg-uAH6ESx7LFPUcNbEfS1Bwtea1trqth.jpeg",
    fullSize:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1646653872061581_fDSYGgah.jpg-uAH6ESx7LFPUcNbEfS1Bwtea1trqth.jpeg",
    caption: "Alexander Ovechkin в красной форме Кэпиталз",
    year: "2023",
  },
  {
    id: 8,
    thumbnail:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/063_1385605622.jpg-6FUuYOQcunRcQwbuBv6orltTeML1yv.jpeg",
    fullSize:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/063_1385605622.jpg-6FUuYOQcunRcQwbuBv6orltTeML1yv.jpeg",
    caption: "Овечкин празднует с поднятой рукой",
    year: "2022",
  },
  {
    id: 9,
    thumbnail:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c6bbc492973eb01f9ba3cbdf5d4e647761cff80134a1e557279380.jpg-qbggZA6IGjDeXqh415GqfpPgYIvcmx.jpeg",
    fullSize:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c6bbc492973eb01f9ba3cbdf5d4e647761cff80134a1e557279380.jpg-qbggZA6IGjDeXqh415GqfpPgYIvcmx.jpeg",
    caption: "Овечкин празднует с партнерами по команде",
    year: "2022",
  },
  {
    id: 10,
    thumbnail:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/scale_1200%20%281%29-6LOuXucq0gXaVu9mJ2BVEB1nil6LHd.jpeg",
    fullSize:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/scale_1200%20%281%29-6LOuXucq0gXaVu9mJ2BVEB1nil6LHd.jpeg",
    caption: "Овечкин празднует гол с эмоциями",
    year: "2021",
  },
  {
    id: 11,
    thumbnail:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/41d00afb-b65f-5af6-88a9-1a1c6490748b-DyjJF1e4karGZLTQlc4QG5pjL759H5.jpeg",
    fullSize:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/41d00afb-b65f-5af6-88a9-1a1c6490748b-DyjJF1e4karGZLTQlc4QG5pjL759H5.jpeg",
    caption: "Овечкин в белой форме Кэпиталз",
    year: "2023",
  },
  {
    id: 12,
    thumbnail:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1994112131_0_0_2800_1575_1920x1080_80_0_0_8399915f9b2b4b6bb1b867a97f53ee68.jpg-Z82sQn7VqMeqdgRwsGIMIlo0dfJJ2N.jpeg",
    fullSize:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1994112131_0_0_2800_1575_1920x1080_80_0_0_8399915f9b2b4b6bb1b867a97f53ee68.jpg-Z82sQn7VqMeqdgRwsGIMIlo0dfJJ2N.jpeg",
    caption: "Овечкин празднует с ударом ногой",
    year: "2022",
  },
]

export default function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof photos)[0] | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            className="relative overflow-hidden rounded-xl cursor-pointer group h-60 bg-navy-800 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              zIndex: 10,
            }}
            onClick={() => setSelectedPhoto(photo)}
          >
            {/* Diagonal decorative element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-red/10 rotate-12 transform"></div>

            <img
              src={photo.thumbnail || "/placeholder.svg"}
              alt={photo.caption}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <p className="text-white font-medium font-squada">{photo.caption}</p>
              <p className="text-gray-300 text-sm font-alegreya">{photo.year}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              className="relative max-w-4xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                className="absolute -top-12 right-0 text-white p-2 rounded-full hover:bg-white/10"
                onClick={() => setSelectedPhoto(null)}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>

              <motion.img
                src={selectedPhoto.fullSize}
                alt={selectedPhoto.caption}
                className="w-full rounded-lg shadow-2xl"
              />

              <div className="mt-4 bg-navy-800/80 p-4 rounded-lg">
                <h3 className="text-xl font-squada text-white">{selectedPhoto.caption}</h3>
                <p className="text-gray-300 font-alegreya">{selectedPhoto.year}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
