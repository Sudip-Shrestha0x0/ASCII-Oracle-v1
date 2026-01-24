/**
 * ASCII Oracle - File Upload Modal
 * Created by Light
 * Drag-and-drop file upload with pixel styling
 */

import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

interface FileUploadModalProps {
  type: 'image' | 'video';
  onUpload: (file: File) => void;
  onClose: () => void;
}

const ACCEPTED_TYPES = {
  image: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/bmp'],
  video: ['video/mp4', 'video/webm', 'video/avi', 'video/mov'],
};

const FileUploadModal: React.FC<FileUploadModalProps> = ({ type, onUpload, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): boolean => {
    const accepted = ACCEPTED_TYPES[type];
    if (!accepted.includes(file.type)) {
      setError(`Invalid file type. Accepted: ${accepted.map(t => t.split('/')[1]).join(', ')}`);
      return false;
    }
    
    // Max 50MB for images, 100MB for videos
    const maxSize = type === 'image' ? 50 * 1024 * 1024 : 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`File too large. Max size: ${maxSize / (1024 * 1024)}MB`);
      return false;
    }
    
    setError(null);
    return true;
  }, [type]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  }, [validateFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  }, [validateFile]);

  const handleUpload = useCallback(() => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  }, [selectedFile, onUpload]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      className="upload-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="upload-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">
            {type === 'image' ? '📷' : '🎬'} Upload {type.toUpperCase()}
          </h2>
          <button 
            className="close-btn" 
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div
          className={`drop-zone ${isDragging ? 'dragging' : ''} ${selectedFile ? 'has-file' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onClick={handleBrowseClick}
          onKeyDown={(e) => e.key === 'Enter' && handleBrowseClick()}
          aria-label={`Drop ${type} here or click to browse`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES[type].join(',')}
            onChange={handleFileSelect}
            className="file-input"
            aria-hidden="true"
          />
          
          {selectedFile ? (
            <div className="file-preview">
              <span className="file-icon">
                {type === 'image' ? '🖼️' : '🎥'}
              </span>
              <span className="file-name">{selectedFile.name}</span>
              <span className="file-size">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </span>
            </div>
          ) : (
            <div className="drop-content">
              <span className="drop-icon">
                {isDragging ? '📥' : type === 'image' ? '📷' : '🎬'}
              </span>
              <span className="drop-text">
                {isDragging ? 'Drop it!' : `Drag ${type} here`}
              </span>
              <span className="drop-subtext">or click to browse</span>
            </div>
          )}
        </div>

        {error && (
          <motion.div 
            className="upload-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ⚠️ {error}
          </motion.div>
        )}

        <div className="modal-actions">
          <button 
            className="pixel-btn cancel-btn" 
            onClick={onClose}
          >
            CANCEL
          </button>
          <button 
            className="pixel-btn upload-btn"
            onClick={handleUpload}
            disabled={!selectedFile}
          >
            CONVERT TO ASCII
          </button>
        </div>

        <div className="format-hint">
          Supported: {ACCEPTED_TYPES[type].map(t => t.split('/')[1].toUpperCase()).join(', ')}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Inject styles
const styles = `
  .upload-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    padding: 20px;
  }
  
  .upload-modal {
    background: #1a1a2e;
    border: 2px solid #00ff88;
    border-radius: 8px;
    padding: 24px;
    max-width: 500px;
    width: 100%;
    box-shadow: 
      0 0 40px rgba(0, 255, 136, 0.3),
      inset 0 0 60px rgba(0, 0, 0, 0.5);
  }
  
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .modal-title {
    font-family: 'Press Start 2P', monospace;
    font-size: 12px;
    color: #00ff88;
    margin: 0;
  }
  
  .close-btn {
    background: none;
    border: none;
    color: #888;
    font-size: 20px;
    cursor: pointer;
    padding: 4px 8px;
    transition: color 0.2s;
  }
  
  .close-btn:hover {
    color: #ff6b6b;
  }
  
  .drop-zone {
    border: 2px dashed #3a3a5e;
    border-radius: 8px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    background: #0f0f1a;
  }
  
  .drop-zone:hover,
  .drop-zone.dragging {
    border-color: #00ff88;
    background: rgba(0, 255, 136, 0.05);
  }
  
  .drop-zone.has-file {
    border-color: #ffd700;
    border-style: solid;
  }
  
  .drop-zone:focus {
    outline: 2px solid #ffd700;
    outline-offset: 2px;
  }
  
  .file-input {
    display: none;
  }
  
  .drop-content,
  .file-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  
  .drop-icon,
  .file-icon {
    font-size: 48px;
    animation: float 2s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  .drop-text {
    font-family: 'Press Start 2P', monospace;
    font-size: 10px;
    color: #e0e0e0;
  }
  
  .drop-subtext {
    font-family: 'VT323', monospace;
    font-size: 16px;
    color: #888;
  }
  
  .file-name {
    font-family: 'VT323', monospace;
    font-size: 18px;
    color: #ffd700;
    word-break: break-all;
  }
  
  .file-size {
    font-family: 'VT323', monospace;
    font-size: 14px;
    color: #888;
  }
  
  .upload-error {
    margin-top: 12px;
    padding: 8px 12px;
    background: rgba(255, 107, 107, 0.1);
    border: 1px solid #ff6b6b;
    border-radius: 4px;
    font-family: 'VT323', monospace;
    font-size: 14px;
    color: #ff6b6b;
  }
  
  .modal-actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
  }
  
  .modal-actions .pixel-btn {
    flex: 1;
  }
  
  .cancel-btn:hover {
    background: #ff6b6b !important;
    border-color: #ff6b6b !important;
  }
  
  .upload-btn {
    background: #00ff88 !important;
    color: #1a1a2e !important;
    border-color: #00ff88 !important;
  }
  
  .upload-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .upload-btn:not(:disabled):hover {
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
  }
  
  .format-hint {
    margin-top: 16px;
    font-family: 'VT323', monospace;
    font-size: 12px;
    color: #555;
    text-align: center;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default FileUploadModal;
