import React, { useState, useEffect } from 'react';

export default function ThemeSwitcher() {
  const [bookTheme, setBookTheme] = useState('default');
  
  useEffect(() => {
    const saved = localStorage.getItem('bookTheme') || 'default';
    setBookTheme(saved);
    document.documentElement.setAttribute('data-book-theme', saved);
  }, []);
  
  const changeTheme = (theme) => {
    setBookTheme(theme);
    localStorage.setItem('bookTheme', theme);
    document.documentElement.setAttribute('data-book-theme', theme);
  };
  
  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      background: 'var(--ifm-background-surface-color)',
      border: '1px solid var(--ifm-color-emphasis-300)',
      borderRadius: '8px',
      padding: '0.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      zIndex: 100
    }}>
      <label style={{ 
        fontSize: '0.85rem', 
        fontWeight: 'bold', 
        display: 'block', 
        marginBottom: '0.5rem' 
      }}>
        🎨 Tema:
      </label>
      <select 
        value={bookTheme} 
        onChange={(e) => changeTheme(e.target.value)}
        style={{
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          border: '1px solid var(--ifm-color-emphasis-300)',
          background: 'var(--ifm-background-color)',
          color: 'var(--ifm-font-color-base)',
          cursor: 'pointer',
          fontSize: '0.9rem'
        }}
      >
        <option value="default">Default</option>
        <option value="sepia">📜 Seppia</option>
        <option value="book">📖 Libro</option>
        <option value="night">🌙 Notte</option>
      </select>
    </div>
  );
}