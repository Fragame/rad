import React, { useState, useEffect } from 'react';
import OriginalDocItem from '@theme-original/DocItem';
import { useLocation } from '@docusaurus/router';
import ChapterNotes from '@site/src/components/ChapterNotes';
import AudioReader from '@site/src/components/AudioReader';
import ReadingMode from '@site/src/components/ReadingMode';
import ThemeSwitcher from '@site/src/components/ThemeSwitcher';

function DocItemWrapper(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const location = useLocation();
  
  const isAuthenticated = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Estrai il nome del file dal percorso
  const getFileName = () => {
    const path = location.pathname;
    if (path === '/') return 'intro.md';
    return path.substring(1) + '.md';
  };

  const loadContent = async () => {
    const token = localStorage.getItem('authToken');
    const filename = getFileName();
    
    try {
      const response = await fetch(`http://localhost:3001/api/chapters/${filename}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setContent(data.content);
        setOriginalContent(data.content);
      }
    } catch (error) {
      console.error('Errore caricamento contenuto:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const token = localStorage.getItem('authToken');
    const filename = getFileName();
    
    try {
      const response = await fetch(`http://localhost:3001/api/chapters/${filename}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });

      if (response.ok) {
        alert('Capitolo salvato con successo! La pagina verrà ricaricata.');
        window.location.reload();
      } else {
        const error = await response.json();
        alert('Errore nel salvataggio: ' + error.error);
      }
    } catch (error) {
      alert('Errore di connessione: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <>
      <OriginalDocItem {...props} />
      
      {isAuthenticated && user.role === 'editor' && (
        <div style={{
          marginTop: '3rem',
          padding: '1.5rem',
          background: 'var(--ifm-color-emphasis-100)',
          borderRadius: '8px',
          border: '1px solid var(--ifm-color-emphasis-200)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: isEditing ? '1rem' : 0
          }}>
            <div>
              {!isEditing ? (
                <button
                  onClick={() => {
                    loadContent();
                    setIsEditing(true);
                  }}
                  style={{
                    background: 'var(--ifm-color-primary)',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '1rem'
                  }}
                >
                  ✏️ Modifica Capitolo
                </button>
              ) : (
                <h3 style={{ margin: 0 }}>Editor Capitolo</h3>
              )}
            </div>
            
            <div style={{ fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)' }}>
              👤 {user.username} | 
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--ifm-color-primary)',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  marginLeft: '0.5rem'
                }}
              >
                Logout
              </button>
            </div>
          </div>

          {isEditing && (
            <>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '500px',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  padding: '1rem',
                  border: '1px solid var(--ifm-color-emphasis-200)',
                  borderRadius: '4px',
                  background: 'var(--ifm-background-color)',
                  color: 'var(--ifm-font-color-base)',
                  resize: 'vertical'
                }}
              />
              
              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  style={{
                    background: 'var(--ifm-color-success)',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '4px',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    opacity: isSaving ? 0.6 : 1
                  }}
                >
                  {isSaving ? '⏳ Salvando...' : '💾 Salva'}
                </button>
                
                <button
                  onClick={() => {
                    if (content !== originalContent) {
                      if (!confirm('Hai modifiche non salvate. Vuoi davvero annullare?')) {
                        return;
                      }
                    }
                    setIsEditing(false);
                    setContent('');
                  }}
                  style={{
                    background: 'var(--ifm-color-danger)',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ❌ Annulla
                </button>
                
                <button
                  onClick={() => setContent(originalContent)}
                  disabled={content === originalContent}
                  style={{
                    background: 'var(--ifm-color-emphasis-200)',
                    color: 'var(--ifm-font-color-base)',
                    border: 'none',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '4px',
                    cursor: content === originalContent ? 'not-allowed' : 'pointer',
                    opacity: content === originalContent ? 0.5 : 1
                  }}
                >
                  ↩️ Ripristina
                </button>
              </div>
              
              <div style={{ 
                marginTop: '1rem', 
                fontSize: '0.85rem', 
                color: 'var(--ifm-color-emphasis-600)' 
              }}>
                💡 Suggerimento: Usa Ctrl+S per salvare rapidamente (non implementato in questo esempio)
              </div>
            </>
          )}
        </div>
      )}
      
      {/* Componenti Note e Audio sempre visibili */}
      <ChapterNotes />
      <AudioReader />
      <ThemeSwitcher />
      <ReadingMode />
    </>
  );
}

export default DocItemWrapper;