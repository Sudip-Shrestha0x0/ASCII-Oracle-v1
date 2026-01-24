/**
 * ASCII Oracle - Power Up Notification
 * Created by Light
 * Mario-inspired power-up animations for successful commands
 */

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface PowerUpNotificationProps {
  type: string;
  message: string;
  onComplete: () => void;
}

const POWER_UP_ICONS: Record<string, string> = {
  coin: '🪙',
  star: '⭐',
  mushroom: '🍄',
  flower: '🌸',
  heart: '❤️',
  bolt: '⚡',
  gem: '💎',
  trophy: '🏆',
  rocket: '🚀',
  magic: '✨',
};

const POWER_UP_COLORS: Record<string, string> = {
  coin: '#ffd700',
  star: '#ffeb3b',
  mushroom: '#ff5722',
  flower: '#e91e63',
  heart: '#f44336',
  bolt: '#00bcd4',
  gem: '#9c27b0',
  trophy: '#ffc107',
  rocket: '#3f51b5',
  magic: '#00ff88',
};

const PowerUpNotification: React.FC<PowerUpNotificationProps> = ({ 
  type, 
  message, 
  onComplete 
}) => {
  const icon = POWER_UP_ICONS[type] || POWER_UP_ICONS.coin;
  const color = POWER_UP_COLORS[type] || POWER_UP_COLORS.coin;

  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="power-up-container"
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.5, y: -100 }}
      transition={{ 
        type: 'spring',
        stiffness: 400,
        damping: 25 
      }}
    >
      <motion.div
        className="power-up-icon"
        style={{ color }}
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{ 
          duration: 0.5,
          repeat: Infinity,
          repeatType: 'loop'
        }}
      >
        {icon}
      </motion.div>
      
      <motion.div
        className="power-up-message"
        style={{ color }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        {message}
      </motion.div>

      {/* Particle effects */}
      <div className="particles" aria-hidden="true">
        {[...Array(8)].map((_, i) => (
          <motion.span
            key={i}
            className="particle"
            style={{ 
              background: color,
              left: '50%',
              top: '50%',
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [1, 0.8, 0],
              x: Math.cos((i / 8) * Math.PI * 2) * 60,
              y: Math.sin((i / 8) * Math.PI * 2) * 60,
            }}
            transition={{
              duration: 0.6,
              delay: i * 0.05,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Score popup */}
      <motion.div
        className="score-popup"
        style={{ color }}
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: [0, 1, 1, 0], y: -40 }}
        transition={{ duration: 1.5, times: [0, 0.1, 0.7, 1] }}
      >
        +100
      </motion.div>
    </motion.div>
  );
};

// Inject styles
const styles = `
  .power-up-container {
    position: fixed;
    bottom: 80px;
    right: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    background: rgba(26, 26, 46, 0.95);
    border: 2px solid currentColor;
    border-radius: 8px;
    box-shadow: 
      0 0 30px currentColor,
      inset 0 0 20px rgba(0, 0, 0, 0.5);
    z-index: 100;
  }
  
  .power-up-icon {
    font-size: 32px;
    filter: drop-shadow(0 0 10px currentColor);
  }
  
  .power-up-message {
    font-family: 'Press Start 2P', monospace;
    font-size: 10px;
    text-shadow: 0 0 10px currentColor;
    white-space: nowrap;
  }
  
  .particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: visible;
  }
  
  .particle {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    transform-origin: center;
  }
  
  .score-popup {
    position: absolute;
    top: 0;
    right: 50%;
    font-family: 'Press Start 2P', monospace;
    font-size: 12px;
    text-shadow: 0 0 10px currentColor;
    pointer-events: none;
  }
  
  @media (max-width: 480px) {
    .power-up-container {
      bottom: 60px;
      right: 12px;
      left: 12px;
      justify-content: center;
    }
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default PowerUpNotification;
