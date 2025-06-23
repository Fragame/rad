import React, { useState } from 'react';
import { useHistory } from '@docusaurus/router';

export default function ChapterEditor({ initialContent, filePath }) {
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const history = useHistory();

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Questa è una chiamata API esempio - dovrai implementare il tuo backend
      const response = await fetch('/api/save-chapter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          filePath,
          content
        })
      });

      if (response.ok) {
        alert('Capitolo salvato con successo!');
        setIsEditing(false);
        // Ricarica la pagina per vedere le modifiche
        window.location.reload();
      } else {
        alert('Errore nel salvataggio');
      }
    } catch (error) {
      alert('Errore: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Mostra il pulsante modifica solo se l'utente è autenticato
  const isAuthenticated = localStorage.getItem('authToken');
  
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
      {!isEditing ? (
        <button 
          onClick={() => setIsEditing(true)}
          style={{
            background: '#25c2a0',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ✏️ Modifica capitolo
        </button>
      ) : (
        <div>
          <h3>Editor Capitolo</h3>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: '100%',
              minHeight: '400px',
              fontFamily: 'monospace',
              fontSize: '14px',
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                background: '#25c2a0',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.6 : 1
              }}
            >
              {isSaving ? 'Salvando...' : '💾 Salva'}
            </button>
            <button
              onClick={() => {
                setContent(initialContent);
                setIsEditing(false);
              }}
              style={{
                background: '#ff4444',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ❌ Annulla
            </button>
          </div>
        </div>
      )}
    </div>
  );
}