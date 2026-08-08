import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=80',
    caption: 'Enterprise infrastructure, verified end to end',
  },
  {
    url: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1600&q=80',
    caption: 'Distributed ledgers for distributed teams',
  },
  {
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    caption: 'Audit trails anchored to Solana',
  },
  {
    url: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=1600&q=80',
    caption: 'Institutional-grade compliance tooling',
  },
]

export default function HeroCarousel({ interval = 4500 }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % IMAGES.length)
    }, interval)
    return () => clearInterval(t)
  }, [interval])

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl">
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={IMAGES[index].url}
            alt={IMAGES[index].caption}
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base-950/90 via-base-950/20 to-transparent" />
          <p className="absolute bottom-5 left-6 right-6 font-medium text-white/90 text-sm">
            {IMAGES[index].caption}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-5 right-6 z-10 flex gap-1.5">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
