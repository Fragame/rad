import React, { useState, useEffect } from 'react';

export default function ReadingMode() {
  const [isReading, setIsReading] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [theme, setTheme] = useState('default');
  
  useEffect(() => {
    if (isReading) {
      document.body.classList.add('reading-mode');
      document.documentElement.style.setProperty('--reading-font-size', `${fontSize}%`);
      document.documentElement.setAttribute('data-reading-theme', theme);
    } else {
      document.body.classList.remove('reading-mode');
    }
    
    return () => {
      document.body.classList.remove('reading-mode');
    };
  }, [isReading, fontSize, theme]);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'var(--ifm-background-surface-color)',
      border: '1px solid var(--ifm-color-emphasis-300)',
      borderRadius: '8px',
      padding: '1rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 999
    }}>
      {!isReading ? (
        <button
          onClick={() => setIsReading(true)}
          style={{
            background: 'var(--ifm-color-primary)',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          📖 Modalità Lettura
        </button>
      ) : (
        <div>
          <h4 style={{ margin: '0 0 1rem' }}>📖 Modalità Lettura</h4>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Dimensione testo: {fontSize}%
            </label>
            <input
              type="range"
              min="80"
              max="150"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Tema:</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              style={{
                width: '100%',
                padding: '0.25rem',
                borderRadius: '4px'
              }}
            >
              <option value="default">Default</option>
              <option value="sepia">Seppia</option>
              <option value="night">Notte</option>
              <option value="high-contrast">Alto Contrasto</option>
            </select>
          </div>
          
          <button
            onClick={() => setIsReading(false)}
            style={{
              background: 'var(--ifm-color-emphasis-300)',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            ✖ Chiudi
          </button>
        </div>
      )}
    </div>
  );
}