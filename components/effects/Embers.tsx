"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const EMBER_COUNT = 18;

function createEmbers() {
  return Array.from({ length: EMBER_COUNT }, (_, i) => ({
    id: i,
    left: `${(i * 101) % 100}%`,
    duration: 6 + (i % 5) * 0.8,
    delay: (i % 7) * 0.4,
  }));
}

export default function Embers() {
  const [embers, setEmbers] = useState(() => createEmbers());

  useEffect(() => {
    setEmbers(
      Array.from({ length: EMBER_COUNT }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        duration: 6 + Math.random() * 5,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  return (
    <>
      {embers.map((ember) => (
        <motion.span
          key={ember.id}
          className="absolute h-1 w-1 rounded-full bg-orange-400"
          style={{
            left: ember.left,
            bottom: "-10px",
          }}
          animate={{
            y: -900,
            opacity: [0, 1, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: ember.duration,
            delay: ember.delay,
          }}
        />
      ))}
    </>
  );
}
