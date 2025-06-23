import React, { useState, useEffect, useRef } from 'react';

export default function AudioReader() {
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voices, setVoices] = useState([]);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const utteranceRef = useRef(null);
  
  // Carica le voci disponibili
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const italianVoices = availableVoices.filter(voice => 
        voice.lang.startsWith('it') || voice.lang.startsWith('en')
      );
      setVoices(italianVoices.length > 0 ? italianVoices : availableVoices);
      
      // Seleziona la prima voce italiana o la prima disponibile
      const defaultVoice = italianVoices.find(v => v.lang.startsWith('it')) || italianVoices[0];
      setSelectedVoice(defaultVoice);
    };
    
    // Carica voci iniziali
    loadVoices();
    
    // Ricarica quando le voci sono pronte
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);
  
  // Estrai il testo dall'articolo
  const getArticleText = () => {
    const article = document.querySelector('article');
    if (!article) return '';
    
    // Clona l'articolo per modificarlo senza alterare il DOM
    const clone = article.cloneNode(true);
    
    // Rimuovi elementi non testuali
    const elementsToRemove = clone.querySelectorAll(
      'pre, code, .tabs, button, .theme-admonition, nav, .margin-note'
    );
    elementsToRemove.forEach(el => el.remove());
    
    // Estrai solo il testo
    return clone.textContent || clone.innerText || '';
  };
  
  const startReading = () => {
    const text = getArticleText();
    if (!text || !selectedVoice) return;
    
    // Cancella eventuali letture precedenti
    window.speechSynthesis.cancel();
    
    // Crea nuova utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = selectedVoice.lang;
    
    // Eventi
    utterance.onstart = () => {
      setIsReading(true);
      setIsPaused(false);
    };
    
    utterance.onend = () => {
      setIsReading(false);
      setIsPaused(false);
      setCurrentWord('');
    };
    
    utterance.onerror = (event) => {
      console.error('Errore sintesi vocale:', event);
      setIsReading(false);
      setIsPaused(false);
    };
    
    // Evidenzia parola corrente (se supportato)
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const word = text.substr(event.charIndex, event.charLength);
        setCurrentWord(word);
      }
    };
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };
  
  const pauseReading = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };
  
  const resumeReading = () => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  };
  
  const stopReading = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
    setCurrentWord('');
  };
  
  // Scorciatoia da tastiera
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Alt + R per avviare/fermare la lettura
      if (e.altKey && e.key === 'r') {
        e.preventDefault();
        if (isReading) {
          stopReading();
        } else {
          startReading();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isReading]);
  
  return (
    <>
      {/* Bottone principale */}
      <button
        onClick={() => {
          if (!isReading && !showControls) {
            setShowControls(true);
          } else if (isReading) {
            stopReading();
          }
        }}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: isReading ? 'var(--ifm-color-danger)' : 'var(--ifm-color-primary)',
          color: 'white',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s'
        }}
        title={isReading ? 'Ferma lettura' : 'Avvia lettura audio (Alt+R)'}
      >
        {isReading ? '⏹' : '🔊'}
      </button>
      
      {/* Pannello controlli */}
      {showControls && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '320px',
          background: 'var(--ifm-background-surface-color)',
          border: '1px solid var(--ifm-color-emphasis-300)',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          zIndex: 99
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>🔊 Lettura Audio</h3>
            <button
              onClick={() => setShowControls(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.2rem',
                cursor: 'pointer',
                color: 'var(--ifm-color-emphasis-600)'
              }}
            >
              ✕
            </button>
          </div>
          
          {/* Selezione voce */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Voce:
            </label>
            <select
              value={selectedVoice?.name || ''}
              onChange={(e) => {
                const voice = voices.find(v => v.name === e.target.value);
                setSelectedVoice(voice);
              }}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid var(--ifm-color-emphasis-200)',
                background: 'var(--ifm-background-color)',
                color: 'var(--ifm-font-color-base)'
              }}
            >
              {voices.map(voice => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>
          
          {/* Velocità */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Velocità: {rate}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          
          {/* Tono */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Tono: {pitch}
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          
          {/* Controlli playback */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {!isReading ? (
              <button
                onClick={startReading}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: 'var(--ifm-color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                ▶️ Avvia Lettura
              </button>
            ) : (
              <>
                {!isPaused ? (
                  <button
                    onClick={pauseReading}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'var(--ifm-color-warning)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    ⏸ Pausa
                  </button>
                ) : (
                  <button
                    onClick={resumeReading}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'var(--ifm-color-success)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    ▶️ Riprendi
                  </button>
                )}
                <button
                  onClick={stopReading}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'var(--ifm-color-danger)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ⏹ Stop
                </button>
              </>
            )}
          </div>
          
          {/* Parola corrente */}
          {currentWord && (
            <div style={{
              marginTop: '1rem',
              padding: '0.5rem',
              background: 'var(--ifm-color-emphasis-100)',
              borderRadius: '4px',
              fontSize: '0.85rem',
              textAlign: 'center',
              color: 'var(--ifm-color-primary)'
            }}>
              🗣 {currentWord}
            </div>
          )}
          
          <div style={{
            marginTop: '1rem',
            fontSize: '0.75rem',
            color: 'var(--ifm-color-emphasis-600)',
            textAlign: 'center'
          }}>
            Scorciatoia: Alt + R
          </div>
        </div>
      )}
    </>
  );
}