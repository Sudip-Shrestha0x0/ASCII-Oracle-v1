/**
 * ASCII Oracle - Header Component
 * Created by Light
 * Pixel-styled header with title and controls
 */

import React from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onHelpClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHelpClick }) => {
  return (
    <header className="oracle-header">
      <div className="header-left">
        <motion.div 
          className="logo-container"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <span className="logo-icon">◈</span>
        </motion.div>
        <div className="title-container">
          <h1 className="title">ASCII ORACLE</h1>
          <span className="subtitle">PIXEL CLI v1.0</span>
        </div>
      </div>
      
      <div className="header-right">
        <motion.button
          className="header-btn"
          onClick={onHelpClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Help"
        >
          <span className="btn-icon">?</span>
          <span className="btn-text">HELP</span>
        </motion.button>
        
        <div className="status-lights">
          <span className="light green" title="System OK" />
          <span className="light yellow" title="Network" />
          <span className="light red" title="Errors: 0" />
        </div>
      </div>
    </header>
  );
};

// Inject styles
const styles = `
  .oracle-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    background: linear-gradient(180deg, #252542 0%, #1a1a2e 100%);
    border-bottom: 2px solid #3a3a5e;
    user-select: none;
    flex-shrink: 0;
  }
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }
  
  .logo-container {
    width: 36px;
    height: 36px;
    min-width: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%);
    border-radius: 4px;
    box-shadow: 0 0 12px rgba(0, 255, 136, 0.2);
  }
  
  .logo-icon {
    font-size: 20px;
    color: #1a1a2e;
    animation: float 3s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
  }
  
  .title-container {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  
  .title {
    font-family: 'Press Start 2P', monospace;
    font-size: 12px;
    color: #00ff88;
    text-shadow: 0 0 6px rgba(0, 255, 136, 0.3);
    margin: 0;
    letter-spacing: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .subtitle {
    font-family: 'VT323', monospace;
    font-size: 12px;
    color: #666;
    letter-spacing: 1px;
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }
  
  .header-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 10px;
    background: #252542;
    border: 1px solid #3a3a5e;
    color: #e0e0e0;
    font-family: 'Press Start 2P', monospace;
    font-size: 7px;
    cursor: pointer;
    transition: all 0.1s ease;
    border-radius: 3px;
  }
  
  .header-btn:hover {
    background: #00ff88;
    color: #1a1a2e;
    border-color: #00ff88;
  }
  
  .header-btn:focus {
    outline: 1px solid #ffd700;
    outline-offset: 2px;
  }
  
  .btn-icon {
    font-size: 10px;
  }
  
  .status-lights {
    display: flex;
    gap: 5px;
  }
  
  .light {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }
  
  .light.green {
    background: #00ff88;
    box-shadow: 0 0 4px rgba(0,255,136,0.5);
  }
  
  .light.yellow {
    background: #ffd700;
    box-shadow: 0 0 4px rgba(255,215,0,0.5);
    animation-delay: 0.3s;
  }
  
  .light.red {
    background: #ff6b6b;
    box-shadow: 0 0 4px rgba(255,107,107,0.5);
    animation-delay: 0.6s;
    opacity: 0.3;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @media (max-width: 600px) {
    .oracle-header {
      padding: 6px 10px;
    }
    
    .logo-container {
      width: 30px;
      height: 30px;
      min-width: 30px;
    }
    
    .logo-icon {
      font-size: 16px;
    }
    
    .header-left {
      gap: 8px;
    }
    
    .title {
      font-size: 9px;
      letter-spacing: 0;
    }
    
    .btn-text {
      display: none;
    }
    
    .subtitle {
      display: none;
    }
    
    .header-right {
      gap: 8px;
    }
    
    .header-btn {
      padding: 4px 8px;
    }
  }
  
  @media (max-width: 400px) {
    .title {
      font-size: 7px;
    }
    
    .logo-container {
      width: 26px;
      height: 26px;
      min-width: 26px;
    }
    
    .logo-icon {
      font-size: 14px;
    }
    
    .light {
      width: 5px;
      height: 5px;
    }
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default Header;
