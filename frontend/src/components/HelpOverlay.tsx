/**
 * ASCII Oracle - Help Overlay
 * Created by Light
 * Quick reference for all commands and keyboard shortcuts
 */

import { motion } from 'framer-motion';
import React from 'react';

interface HelpOverlayProps {
  onClose: () => void;
}

const COMMANDS = [
  { cmd: 'help', desc: 'Show all commands', example: 'help' },
  { cmd: 'draw', desc: 'Draw ASCII art', example: 'draw cat' },
  { cmd: 'draw --list', desc: 'List all available art', example: 'draw --list' },
  { cmd: 'upload', desc: 'Convert image to ASCII', example: 'upload image' },
  { cmd: 'hologram', desc: 'Enter 3D hologram mode', example: 'hologram cube' },
  { cmd: 'solve', desc: 'Solve math equations', example: 'solve sqrt(144)' },
  { cmd: 'physics', desc: 'Physics calculations', example: 'physics force 10 5' },
  { cmd: 'chemistry', desc: 'Chemistry tools', example: 'chemistry element Fe' },
  { cmd: 'clear', desc: 'Clear terminal', example: 'clear' },
  { cmd: 'exit', desc: 'Exit 3D mode', example: 'exit' },
];

const SHORTCUTS = [
  { key: '↑ / ↓', action: 'Command history' },
  { key: 'Tab', action: 'Autocomplete' },
  { key: 'Ctrl+C', action: 'Cancel' },
  { key: 'Ctrl+L', action: 'Clear screen' },
  { key: 'Ctrl+U', action: 'Clear line' },
  { key: 'F1', action: 'Toggle help' },
  { key: 'Esc', action: 'Close modal / Exit 3D' },
];

const HelpOverlay: React.FC<HelpOverlayProps> = ({ onClose }) => {
  return (
    <motion.div
      className="help-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="help-modal"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="help-header">
          <h2>📖 QUICK REFERENCE</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="help-content">
          <section className="help-section">
            <h3>⌨️ COMMANDS</h3>
            <div className="command-list">
              {COMMANDS.map(({ cmd, desc, example }) => (
                <div key={cmd} className="command-item">
                  <code className="cmd-name">{cmd}</code>
                  <span className="cmd-desc">{desc}</span>
                  <code className="cmd-example">{example}</code>
                </div>
              ))}
            </div>
          </section>

          <section className="help-section">
            <h3>🎮 SHORTCUTS</h3>
            <div className="shortcut-grid">
              {SHORTCUTS.map(({ key, action }) => (
                <div key={key} className="shortcut-item">
                  <kbd>{key}</kbd>
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="help-section tips">
            <h3>💡 PRO TIPS</h3>
            <ul>
              <li>
                Use <code>--animate</code> flag for animations
              </li>
              <li>
                Use <code>--width 80</code> to control size
              </li>
              <li>
                Use <code>--colored</code> for color output
              </li>
              <li>
                Chain commands with <code>&&</code>
              </li>
            </ul>
          </section>
        </div>

        <div className="help-footer">
          <span>Press ESC or click outside to close</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Inject styles
const styles = `
  .help-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 300;
    padding: 20px;
    overflow: hidden;
  }
  
  .help-modal {
    background: #1a1a2e;
    border: 1px solid rgba(0, 212, 255, 0.5);
    border-radius: 6px;
    max-width: 650px;
    width: 100%;
    max-height: 85vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 30px rgba(0, 212, 255, 0.15);
  }
  
  .help-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    border-bottom: 1px solid #3a3a5e;
    flex-shrink: 0;
    background: #1a1a2e;
  }
  
  .help-header h2 {
    font-family: 'Press Start 2P', monospace;
    font-size: 11px;
    color: #00d4ff;
    margin: 0;
    text-shadow: 0 0 8px rgba(0,212,255,0.3);
  }
  
  .close-btn {
    background: none;
    border: 1px solid #ff4444;
    color: #ff4444;
    width: 28px;
    height: 28px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  
  .close-btn:hover {
    background: rgba(255,68,68,0.2);
  }
  
  .help-content {
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
    flex: 1;
    min-height: 0;
  }
  
  .help-content::-webkit-scrollbar {
    width: 5px;
  }
  
  .help-content::-webkit-scrollbar-track {
    background: rgba(0,212,255,0.05);
  }
  
  .help-content::-webkit-scrollbar-thumb {
    background: rgba(0,212,255,0.3);
    border-radius: 3px;
  }
  
  .help-section h3 {
    font-family: 'Press Start 2P', monospace;
    font-size: 9px;
    color: #ffd700;
    margin: 0 0 10px 0;
    text-shadow: 0 0 5px rgba(255,215,0,0.2);
  }
  
  .command-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  
  .command-item {
    display: grid;
    grid-template-columns: 90px 1fr auto;
    gap: 10px;
    padding: 6px 10px;
    background: #0f0f1a;
    border-radius: 3px;
    align-items: center;
  }
  
  .cmd-name {
    font-family: 'VT323', monospace;
    font-size: 16px;
    color: #00ff88;
  }
  
  .cmd-desc {
    font-family: 'VT323', monospace;
    font-size: 14px;
    color: #888;
  }
  
  .cmd-example {
    font-family: 'VT323', monospace;
    font-size: 12px;
    color: #555;
    background: #252542;
    padding: 2px 6px;
    border-radius: 2px;
  }
  
  .shortcut-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 6px;
  }
  
  .shortcut-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 10px;
    background: #0f0f1a;
    border-radius: 3px;
  }
  
  .shortcut-item kbd {
    font-family: 'Press Start 2P', monospace;
    font-size: 7px;
    color: #b388ff;
    background: #252542;
    padding: 3px 6px;
    border-radius: 2px;
    border: 1px solid #3a3a5e;
  }
  
  .shortcut-item span {
    font-family: 'VT323', monospace;
    font-size: 14px;
    color: #888;
  }
  
  .help-section.tips ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  
  .help-section.tips li {
    font-family: 'VT323', monospace;
    font-size: 14px;
    color: #888;
    padding-left: 18px;
    position: relative;
  }
  
  .help-section.tips li::before {
    content: '★';
    position: absolute;
    left: 0;
    color: #ffd700;
  }
  
  .help-section.tips code {
    color: #00ff88;
    background: #252542;
    padding: 1px 5px;
    border-radius: 2px;
  }
  
  .help-footer {
    padding: 10px 18px;
    border-top: 1px solid #3a3a5e;
    text-align: center;
    font-family: 'VT323', monospace;
    font-size: 12px;
    color: #555;
    flex-shrink: 0;
    background: #1a1a2e;
  }
  
  @media (max-width: 600px) {
    .help-modal {
      max-height: 90vh;
    }
    
    .command-item {
      grid-template-columns: 1fr;
      gap: 3px;
    }
    
    .cmd-example {
      display: none;
    }
    
    .shortcut-grid {
      grid-template-columns: 1fr;
    }
    
    .help-header h2 {
      font-size: 9px;
    }
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default HelpOverlay;
