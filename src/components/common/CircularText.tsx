import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CircularTextProps {
  text: string;
  spinDuration?: number;
  className?: string;
  radius?: number;
}

const CircularText: React.FC<CircularTextProps> = ({
  text,
  spinDuration = 20,
  className = '',
  radius = 60
}) => {
  const letters = Array.from(text);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative flex items-center justify-center rounded-full origin-center ${className}`}
      animate={{ rotate: 360 }}
      transition={{ 
        duration: isHovered ? spinDuration / 4 : spinDuration, 
        repeat: Infinity, 
        ease: "linear" 
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {letters.map((letter, i) => {
        const rotationDeg = (360 / letters.length) * i;
        return (
          <span
            key={i}
            className="absolute font-syne font-black uppercase"
            style={{
              transform: `rotate(${rotationDeg}deg) translateY(-${radius}px)`,
              transformOrigin: 'center center'
            }}
          >
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
};

export default CircularText;
