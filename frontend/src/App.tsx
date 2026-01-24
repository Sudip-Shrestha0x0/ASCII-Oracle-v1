/**
 * ASCII Oracle - Main Application
 * Created by Light
 * Orchestrates the retro CLI experience with terminal, 3D, and sound effects
 */

import React, { useEffect, useState, useCallback, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Terminal from './components/Terminal';
import Header from './components/Header';
import StatusBar from './components/StatusBar';
import PowerUpNotification from './components/PowerUpNotification';
import FileUploadModal from './components/FileUploadModal';
import HelpOverlay from './components/HelpOverlay';
import { useAppStore } from './hooks/useAppStore';
import { useSoundEffects } from './hooks/useSoundEffects';

// Lazy load the 3D hologram viewer for performance
const HologramViewer = lazy(() => import('./components/HologramViewer'));

interface AppProps {
  onReady?: () => void;
}

const App: React.FC<AppProps> = ({ onReady }) => {
  const [showHelp, setShowHelp] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadType, setUploadType] = useState<'image' | 'video'>('image');
  
  const { 
    hologramMode, 
    hologramData,
    powerUp, 
    clearPowerUp,
    addOutput,
    commandHistory,
  } = useAppStore();
  
  const { playSound } = useSoundEffects();

  // Signal app is ready
  useEffect(() => {
    onReady?.();
    playSound('startup');
  }, [onReady, playSound]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F1 for help
      if (e.key === 'F1') {
        e.preventDefault();
        setShowHelp(true);
        playSound('click');
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        setShowHelp(false);
        setShowUpload(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playSound]);

  // Handle file upload trigger from terminal
  const handleUploadTrigger = useCallback((type: 'image' | 'video') => {
    setUploadType(type);
    setShowUpload(true);
    playSound('click');
  }, [playSound]);

  // Handle successful file upload
  const handleFileUpload = useCallback(async (file: File) => {
    setShowUpload(false);
    playSound('powerup');
    addOutput(`Processing ${file.name}...`);
    
    try {
      const formData = new FormData();
      formData.append(uploadType === 'image' ? 'image' : 'video', file);
      formData.append('width', '80');
      formData.append('charset', 'standard');
      
      const endpoint = uploadType === 'image' 
        ? '/api/image/to-ascii' 
        : '/api/video/to-ascii';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.ascii) {
          addOutput('\n' + data.ascii);
          playSound('powerup');
        } else if (data.frames) {
          addOutput(`Converted ${data.frames.length} frames`);
          addOutput(data.frames[0] || 'No frames generated');
        }
      } else {
        addOutput('Error: Failed to convert file');
        playSound('error');
      }
    } catch (err) {
      addOutput('Error: Could not connect to server');
      playSound('error');
    }
  }, [playSound, addOutput, uploadType]);

  return (
    <div className="app-container">
      {/* Scanline effect overlay */}
      <div className="scanline-overlay" aria-hidden="true" />

      {/* Header with title and controls */}
      <Header onHelpClick={() => setShowHelp(true)} />
      
      {/* Main content area */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          {hologramMode && hologramData ? (
            <Suspense fallback={<div className="loading-3d">Loading 3D...</div>}>
              <motion.div
                key="hologram"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="hologram-container"
              >
                <HologramViewer 
                  type={hologramData.type}
                  text={hologramData.text}
                  onClose={() => useAppStore.getState().setHologramMode(false)}
                />
              </motion.div>
            </Suspense>
          ) : (
            <motion.div
              key="terminal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="terminal-container"
            >
              <Terminal 
                onUploadRequest={handleUploadTrigger}
                onSound={playSound}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Status bar at bottom */}
      <StatusBar 
        commandCount={commandHistory.length}
        mode={hologramMode ? '3D' : 'CLI'}
      />
      
      {/* Power-up notification popup */}
      <AnimatePresence>
        {powerUp && (
          <PowerUpNotification 
            type={powerUp.type}
            message={powerUp.message}
            onComplete={clearPowerUp}
          />
        )}
      </AnimatePresence>
      
      {/* Help overlay */}
      <AnimatePresence>
        {showHelp && (
          <HelpOverlay onClose={() => setShowHelp(false)} />
        )}
      </AnimatePresence>
      
      {/* File upload modal */}
      <AnimatePresence>
        {showUpload && (
          <FileUploadModal
            type={uploadType}
            onUpload={handleFileUpload}
            onClose={() => setShowUpload(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
