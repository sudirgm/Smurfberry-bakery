import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface Snowflake {
  id: number;
  x: number; // percentage
  size: number; // px
  duration: number; // seconds
  delay: number; // seconds
  opacity: number;
}

export default function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // Generate 42 random snowflakes to flow gracefully
    const list: Snowflake[] = Array.from({ length: 42 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 5 + 3,
      duration: Math.random() * 14 + 10,
      delay: Math.random() * -15, // Negative delay so some start midway
      opacity: Math.random() * 0.7 + 0.3,
    }));
    setSnowflakes(list);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10" id="snowfall-container">
      {snowflakes.map((snow) => (
        <motion.div
          key={snow.id}
          className="absolute rounded-full bg-white filter blur-[0.6px]"
          style={{
            left: `${snow.x}%`,
            width: snow.size,
            height: snow.size,
            opacity: snow.opacity,
            top: -10,
            boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [`${snow.x}%`, `${snow.x + (Math.random() * 10 - 5)}%`],
          }}
          transition={{
            duration: snow.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: snow.delay,
          }}
        />
      ))}
    </div>
  );
}
