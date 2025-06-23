import React from 'react';

// Componente per note a margine
export function MarginNote({ children }) {
  return <span className="margin-note">{children}</span>;
}

// Componente per epigrafe/citazione iniziale
export function Epigraph({ text, author }) {
  return (
    <div style={{
      fontStyle: 'italic',
      textAlign: 'right',
      margin: '2rem 0 3rem',
      paddingLeft: '30%',
      color: 'var(--ifm-color-emphasis-600)'
    }}>
      <p style={{ marginBottom: '0.5rem' }}>"{text}"</p>
      {author && <p style={{ fontSize: '0.9rem' }}>— {author}</p>}
    </div>
  );
}

// Componente per dialoghi formattati
export function Dialogue({ speaker, children }) {
  return (
    <div className="dialogue-line">
      {speaker && <strong>{speaker}: </strong>}
      {children}
    </div>
  );
}

// Componente per pensieri/monologhi interiori
export function Thought({ children }) {
  return (
    <p style={{
      fontStyle: 'italic',
      color: 'var(--ifm-color-emphasis-700)',
      borderLeft: '2px solid var(--ifm-color-emphasis-300)',
      paddingLeft: '1rem',
      marginLeft: '1rem'
    }}>
      {children}
    </p>
  );
}

// Scene break con stile
export function SceneBreak() {
  return <div className="scene-break" />;
}

// Numero di pagina simulato
export function PageNumber({ number }) {
  return <div className="page-number">— {number} —</div>;
}

// Annotazione con tooltip
export function Annotation({ note, children }) {
  return (
    <span className="annotation" data-note={note}>
      {children}
    </span>
  );
}

// Capolettera personalizzato
export function DropCap({ children }) {
  // Gestisci children che potrebbero essere array o oggetti React
  let text = '';
  
  if (typeof children === 'string') {
    text = children;
  } else if (Array.isArray(children)) {
    text = children.map(child => 
      typeof child === 'string' ? child : child.props?.children || ''
    ).join('');
  } else if (children?.props?.children) {
    text = children.props.children;
  }
  
  if (!text) return <p>{children}</p>;
  
  const firstLetter = text.charAt(0);
  const rest = text.slice(1);
  
  return (
    <p style={{ textIndent: 0 }}>
      <span style={{
        float: 'left',
        fontSize: '3em',
        lineHeight: '0.85',
        paddingRight: '0.1em',
        marginRight: '0.05em',
        marginTop: '-0.05em',
        fontWeight: 700,
        color: 'var(--book-accent-color)',
        fontFamily: 'var(--book-font-serif)'
      }}>
        {firstLetter}
      </span>
      <span>{rest}</span>
    </p>
  );
}

// Lettera/documento inserito nel testo
export function Letter({ date, from, to, children }) {
  return (
    <div style={{
      background: 'var(--ifm-color-emphasis-100)',
      border: '1px solid var(--ifm-color-emphasis-300)',
      borderRadius: '8px',
      padding: '1.5rem',
      margin: '2rem 0',
      fontFamily: 'cursive',
      fontSize: '0.95rem'
    }}>
      {date && <p style={{ textAlign: 'right', marginBottom: '1rem' }}>{date}</p>}
      {to && <p>Cara/o {to},</p>}
      <div style={{ margin: '1rem 0' }}>{children}</div>
      {from && <p style={{ textAlign: 'right', marginTop: '1rem' }}>— {from}</p>}
    </div>
  );
}

// Componente per note dell'autore
export function AuthorNote({ children }) {
  return (
    <details style={{
      background: 'var(--ifm-color-warning-contrast-background)',
      border: '1px solid var(--ifm-color-warning-dark)',
      borderRadius: '8px',
      padding: '1rem',
      margin: '2rem 0'
    }}>
      <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
        📝 Nota dell'autore
      </summary>
      <div style={{ marginTop: '1rem' }}>{children}</div>
    </details>
  );
}