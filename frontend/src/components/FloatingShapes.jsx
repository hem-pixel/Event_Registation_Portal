import React from 'react';
import { motion } from 'framer-motion';

const FloatingShapes = () => {
  const shapes = [
    {
      width: 300,
      height: 300,
      left: '10%',
      top: '20%',
      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
      duration: 20,
    },
    {
      width: 400,
      height: 400,
      left: '60%',
      top: '50%',
      background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(0, 0, 0, 0) 70%)',
      duration: 25,
      delay: 2,
    },
    {
      width: 250,
      height: 250,
      left: '80%',
      top: '10%',
      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(0, 0, 0, 0) 70%)',
      duration: 18,
      delay: 5,
    },
    {
      width: 350,
      height: 350,
      left: '20%',
      top: '70%',
      background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
      duration: 22,
      delay: 1,
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      overflow: 'hidden',
      pointerEvents: 'none'
    }}>
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          style={{
            position: 'absolute',
            width: shape.width,
            height: shape.height,
            left: shape.left,
            top: shape.top,
            background: shape.background,
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: shape.delay || 0,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingShapes;
