/**
 * ASCII Oracle - Status Bar Component
 * Created by Light
 * Bottom status bar showing mode, commands, and system info
 */

import React, { useState, useEffect } from 'react';

interface StatusBarProps {
  commandCount: number;
  mode: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ commandCount, mode }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <footer className="status-bar">
      <div className="status-left">
        <span className="status-item mode">
          <span className="status-icon">◆</span>
          MODE: {mode}
        </span>
        <span className="status-divider">│</span>
        <span className="status-item">
          <span className="status-icon">★</span>
          CMDS: {commandCount}
        </span>
      </div>
      
      <div className="status-center">
        <span className="status-tip">
          F1=Help │ ↑↓=History │ Tab=Complete │ Ctrl+L=Clear
        </span>
      </div>
      
      <div className="status-right">
        <span className="status-item">
          <span className="status-icon clock">◷</span>
          {formatTime(time)}
        </span>
        <span className="status-divider">│</span>
        <span className="status-item author">
          BY LIGHT
        </span>
      </div>
    </footer>
  );
};

// Inject styles
const styles = `
  .status-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 16px;
    background: #0f0f1a;
    border-top: 1px solid #3a3a5e;
    font-family: 'VT323', monospace;
    font-size: 14px;
    color: #888;
    user-select: none;
  }
  
  .status-left,
  .status-center,
  .status-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .status-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .status-item.mode {
    color: #00ff88;
  }
  
  .status-icon {
    color: #ffd700;
  }
  
  .status-icon.clock {
    animation: rotate 10s linear infinite;
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .status-divider {
    color: #3a3a5e;
  }
  
  .status-tip {
    font-size: 12px;
    color: #555;
  }
  
  .status-item.author {
    color: #b388ff;
    font-family: 'Press Start 2P', monospace;
    font-size: 8px;
  }
  
  @media (max-width: 768px) {
    .status-center {
      display: none;
    }
    
    .status-bar {
      font-size: 12px;
    }
  }
  
  @media (max-width: 480px) {
    .status-left .status-divider,
    .status-left .status-item:not(.mode) {
      display: none;
    }
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default StatusBar;
