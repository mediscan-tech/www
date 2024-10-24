import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ParticleProps {
  id: number;
  x: number;
  y: number;
  size: number;
}

const ParticleSwarmLoader = () => {
  const [particles, setParticles] = useState<ParticleProps[]>([]);
  const particleCount = 50;

  useEffect(() => {
    setParticles(
      Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 400 - 200,
        y: Math.random() * 400 - 200,
        size: Math.random() * 6 + 3,
      }))
    );
  }, []);

  return (
    <div className="h-40 w-40 overflow-hidden rounded-full bg-transparent">
      <svg width="100%" height="100%" viewBox="-100 -100 200 200">
        {particles.map((particle) => (
          <motion.circle
            key={particle.id}
            cx={particle.x}
            cy={particle.y}
            r={particle.size}
            fill="#14616e"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              cx: [particle.x, 0, particle.x],
              cy: [particle.y, 0, particle.y],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default ParticleSwarmLoader;
