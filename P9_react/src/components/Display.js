import React from 'react';
import './Display.css';

function Display({ count }) {
  // Function to determine the color based on count value
  const getCountColor = () => {
    if (count > 0) return '#4CAF50'; // Green for positive
    if (count < 0) return '#f44336'; // Red for negative
    return '#2196F3'; // Blue for zero
  };

  // Function to get count status message
  const getCountStatus = () => {
    if (count > 10) return 'High!';
    if (count > 0) return 'Positive';
    if (count < -10) return 'Very Low!';
    if (count < 0) return 'Negative';
    return 'Zero';
  };

  return (
    <div className="display">
      <h4>Display Component</h4>
      
      <div className="count-display" style={{ color: getCountColor() }}>
        <span className="count-value">{count}</span>
      </div>
      
      <div className="count-info">
        <p className="count-status">Status: {getCountStatus()}</p>
        <p className="count-description">
          This Display component receives the count as a prop from the Counter component.
        </p>
      </div>

      {/* Visual representation of the count */}
      <div className="count-visual">
        {Array.from({ length: Math.abs(count) }, (_, index) => (
          <div 
            key={index} 
            className="count-dot"
            style={{ 
              backgroundColor: getCountColor(),
              opacity: count > 0 ? 1 : 0.6
            }}
          />
        ))}
        {count === 0 && (
          <div className="zero-indicator">No dots to display</div>
        )}
      </div>
    </div>
  );
}

export default Display;
