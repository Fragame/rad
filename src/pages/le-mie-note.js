import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function MyNotes() {
  const [notes, setNotes] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('chapterNotes') || '{}');
    setNotes(savedNotes);
  }, []);
  
  // Filtra note vuote e applica ricerca
  const filteredNotes = Object.entries(notes)
    .filter(([path, note]) => note && note.trim())
    .filter(([path, note]) => 
      !searchTerm || 
      note.toLowerCase().includes(searchTerm.toLowerCase()) ||
      path.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  const deleteNote = (path) => {
    if (confirm('Eliminare questa nota?')) {
      const updatedNotes = { ...notes };
      delete updatedNotes[path];
      localStorage.setItem('chapterNotes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    }
  };
  
  return (
    <Layout title="Le Mie Note" description="Tutte le note sui capitoli">
      <main style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1>📝 Le Mie Note</h1>
          
          <div style={{ marginBottom: '2rem' }}>
            <input
              type="text"
              placeholder="Cerca nelle note..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: '1px solid var(--ifm-color-emphasis-300)',
                borderRadius: '8px',
                background: 'var(--ifm-background-color)',
                color: 'var(--ifm-font-color-base)'
              }}
            />
          </div>
          
          {filteredNotes.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--ifm-color-emphasis-600)'
            }}>
              {searchTerm ? 'Nessuna nota trovata' : 'Non hai ancora scritto note'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredNotes.map(([path, note]) => (
                <div
                  key={path}
                  style={{
                    background: 'var(--ifm-color-emphasis-100)',
                    border: '1px solid var(--ifm-color-emphasis-200)',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem'
                  }}>
                    <Link
                      to={path}
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        textDecoration: 'none'
                      }}
                    >
                      📖 {path.replace(/\//g, ' › ').substring(1)}
                    </Link>
                    
                    <button
                      onClick={() => deleteNote(path)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--ifm-color-danger)',
                        cursor: 'pointer',
                        fontSize: '1.2rem'
                      }}
                      title="Elimina nota"
                    >
                      🗑️
                    </button>
                  </div>
                  
                  <div style={{
                    whiteSpace: 'pre-wrap',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    color: 'var(--ifm-font-color-base)'
                  }}>
                    {note}
                  </div>
                  
                  <div style={{
                    marginTop: '1rem',
                    fontSize: '0.85rem',
                    color: 'var(--ifm-color-emphasis-600)'
                  }}>
                    {note.split(' ').length} parole • {note.length} caratteri
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div style={{
            marginTop: '3rem',
            padding: '2rem',
            background: 'var(--ifm-color-emphasis-100)',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3>💡 Suggerimenti</h3>
            <p>
              • Usa <kbd>Alt</kbd> + <kbd>R</kbd> per avviare/fermare la lettura audio<br/>
              • Le note sono salvate localmente nel tuo browser<br/>
              • Esporta regolarmente le tue note per backup
            </p>
          </div>
        </div>
      </main>
    </Layout>
  );
}