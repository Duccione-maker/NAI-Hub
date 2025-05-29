import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-container">
        <div className="loading-mountain">
          <div className="loading-indicator"></div>
        </div>
        <p className="loading-text">Caricamento della piattaforma in corso...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;