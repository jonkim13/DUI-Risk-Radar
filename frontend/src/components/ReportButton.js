// src/components/ReportButton.js
import React, { useState } from 'react';

const ReportButton = ({ onReport }) => {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onReport}
      style={{
        ...buttonStyle,
        backgroundColor: hover ? '#e63946' : '#FF4136',
      }}
      aria-label="Report Incident"
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      Report
    </button>
  );
};

// Inline styles for the button
const buttonStyle = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  padding: '15px 25px',
  fontSize: '18px',
  color: '#fff',
  border: 'none',
  borderRadius: '50px',
  cursor: 'pointer',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  zIndex: 1000, // Ensures the button stays on top of other elements
  transition: 'background-color 0.3s ease',
};

export default ReportButton;
