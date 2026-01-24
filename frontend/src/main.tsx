/**
 * ASCII Oracle - Main Entry Point
 * Created by Light
 * Bootstraps the React application with pixel-perfect rendering
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

// Remove loading screen once app mounts
const removeLoader = () => {
  const loader = document.querySelector('.loading-screen');
  if (loader) {
    loader.classList.add('fade-out');
    setTimeout(() => loader.remove(), 300);
  }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App onReady={removeLoader} />
  </React.StrictMode>
);
