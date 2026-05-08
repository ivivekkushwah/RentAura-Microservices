// components/AnimatedImage.tsx
'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface AnimatedImageProps {
  src: string
  alt: string
  width: number
  height: number
}

export default function AnimatedImage({ src, alt, width, height }: AnimatedImageProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Image src={src} alt={alt} width={width} height={height} className="w-full h-96 object-cover rounded-xl" />
    </motion.div>
  )
}
