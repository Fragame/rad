import React, { useState, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';

export default function ChapterNotes() {
  const location = useLocation();
  const [notes, setNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  
  const chapterKey = `notes_${location.pathname}`;
  
  // Carica le note salvate all'avvio
  useEffect(() => {
    const allNotes = JSON.parse(localStorage.getItem('chapterNotes') || '{}');
    setSavedNotes(allNotes);
    setNotes(allNotes[chapterKey] || '');
  }, [chapterKey]);
  
  // Salva le note
  const saveNotes = () => {
    const allNotes = JSON.parse(localStorage.getItem('chapterNotes') || '{}');
    allNotes[chapterKey] = notes;
    localStorage.setItem('chapterNotes', JSON.stringify(allNotes));
    setSavedNotes(allNotes);
    setLastSaved(new Date());
    
    // Mostra conferma per 3 secondi
    setTimeout(() => setLastSaved(null), 3000);
  };
  
  // Conta le note totali
  const totalNotes = Object.values(savedNotes).filter(note => note.trim()).length;
  
  // Esporta tutte le note
  const exportNotes = () => {
    const dataStr = JSON.stringify(savedNotes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `note-libro-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  // Importa note
  const importNotes = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedNotes = JSON.parse(e.target.result);
        if (confirm('Questo sovrascriverà tutte le tue note attuali. Continuare?')) {
          localStorage.setItem('chapterNotes', JSON.stringify(importedNotes));
          setSavedNotes(importedNotes);
          setNotes(importedNotes[chapterKey] || '');
          alert('Note importate con successo!');
        }
      } catch (error) {
        alert('Errore nell\'importazione del file');
      }
    };
    reader.readAsText(file);
  };
  
  return (
    <>
      {/* Bottone flottante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--ifm-color-primary)',
          color: 'white',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s',
          transform: isOpen ? 'rotate(45deg)' : 'none'
        }}
        title="Note personali"
      >
        {isOpen ? '✕' : '📝'}
      </button>
      
      {/* Pannello note */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '150px',
          right: '20px',
          width: '350px',
          maxHeight: '500px',
          background: 'var(--ifm-background-surface-color)',
          border: '1px solid var(--ifm-color-emphasis-300)',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          zIndex: 99,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '1rem',
            borderBottom: '1px solid var(--ifm-color-emphasis-200)',
            background: 'var(--ifm-color-emphasis-100)'
          }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
              📝 Note Personali
            </h3>
            <div style={{ 
              fontSize: '0.85rem', 
              color: 'var(--ifm-color-emphasis-600)',
              marginTop: '0.25rem'
            }}>
              {location.pathname} • {totalNotes} note totali
            </div>
          </div>
          
          {/* Textarea */}
          <div style={{ flex: 1, padding: '1rem' }}>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Scrivi qui le tue note, riflessioni, citazioni preferite..."
              style={{
                width: '100%',
                height: '250px',
                padding: '0.75rem',
                border: '1px solid var(--ifm-color-emphasis-200)',
                borderRadius: '4px',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                resize: 'vertical',
                background: 'var(--ifm-background-color)',
                color: 'var(--ifm-font-color-base)'
              }}
            />
            
            {lastSaved && (
              <div style={{
                marginTop: '0.5rem',
                fontSize: '0.85rem',
                color: 'var(--ifm-color-success)'
              }}>
                ✓ Salvato alle {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </div>
          
          {/* Azioni */}
          <div style={{
            padding: '1rem',
            borderTop: '1px solid var(--ifm-color-emphasis-200)',
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={saveNotes}
              style={{
                flex: 1,
                padding: '0.5rem',
                background: 'var(--ifm-color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              💾 Salva
            </button>
            
            <button
              onClick={exportNotes}
              style={{
                padding: '0.5rem 1rem',
                background: 'var(--ifm-color-emphasis-200)',
                color: 'var(--ifm-font-color-base)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
              title="Esporta tutte le note"
            >
              📤
            </button>
            
            <label style={{
              padding: '0.5rem 1rem',
              background: 'var(--ifm-color-emphasis-200)',
              color: 'var(--ifm-font-color-base)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}>
              📥
              <input
                type="file"
                accept=".json"
                onChange={importNotes}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      )}
    </>
  );
}