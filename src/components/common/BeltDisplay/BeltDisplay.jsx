import React from 'react';
import './BeltDisplay.css';

const BeltDisplay = ({ level, progress }) => {
  const beltColors = [
    { level: 0, color: 'white', name: 'Cintura Bianca' },
    { level: 1, color: 'yellow', name: 'Cintura Gialla' },
    { level: 2, color: 'orange', name: 'Cintura Arancione' },
    { level: 3, color: 'green', name: 'Cintura Verde' },
    { level: 4, color: 'blue', name: 'Cintura Blu' },
    { level: 5, color: 'brown', name: 'Cintura Marrone' },
    { level: 6, color: 'black', name: 'Cintura Nera' }
  ];
  
  const currentBelt = beltColors.find(belt => belt.level === level) || beltColors[0];
  const nextBelt = beltColors.find(belt => belt.level === level + 1) || currentBelt;
  
  return (
    <div className="belt-display">
      <div className="current-belt">
        <div className={`belt-image belt-${currentBelt.color}`}></div>
        <div className="belt-info">
          <h3>{currentBelt.name}</h3>
          <div className="belt-progress">
            <div 
              className="belt-progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p>
            {progress}% verso {nextBelt.name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BeltDisplay;