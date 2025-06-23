// Plugin Remark per formattare automaticamente dialoghi e testo narrativo

module.exports = function dialogueFormatter() {
  return async (tree, file) => {
    // Importa visit dinamicamente
    const { visit } = await import('unist-util-visit');
    
    visit(tree, 'paragraph', (node) => {
      if (node.children && node.children.length > 0) {
        let isDialogue = false;
        
        node.children.forEach((child) => {
          if (child.type === 'text') {
            // Controlla se è un dialogo PRIMA di applicare altre formattazioni
            const trimmedText = child.value.trim();
            if (trimmedText.startsWith('- ') || trimmedText.startsWith('— ') || trimmedText.startsWith('"')) {
              isDialogue = true;
            }
            
            // Dialoghi con virgolette
            child.value = child.value.replace(
              /"([^"]+)"/g,
              (match, p1) => {
                return `«${p1}»`;
              }
            );

            // Dialoghi che iniziano con -
            if (child.value.trim().startsWith('- ')) {
              child.value = child.value.replace(/^(\s*)-\s*/, '$1— ');
              isDialogue = true;
            }

            // Pensieri in corsivo (tra asterischi singoli)
            child.value = child.value.replace(
              /\*([^*]+)\*/g,
              '_$1_'
            );

            // Scene break (*** su riga singola)
            if (child.value.trim() === '***') {
              child.value = '';
              if (!node.data) node.data = {};
              if (!node.data.hProperties) node.data.hProperties = {};
              node.data.hProperties.className = 'scene-break';
            }
          }
        });
        
        // Aggiungi classe per dialoghi
        if (isDialogue) {
          if (!node.data) node.data = {};
          if (!node.data.hProperties) node.data.hProperties = {};
          node.data.hProperties.className = 'dialogue-line';
        }
      }
    });

    // Formatta le prime lettere dei capitoli SOLO per paragrafi non-dialogo
    let firstNonDialogueParagraphFound = false;
    visit(tree, 'paragraph', (node, index, parent) => {
      // Salta se è un dialogo
      if (node.data && node.data.hProperties && node.data.hProperties.className === 'dialogue-line') {
        return;
      }
      
      // Salta se è uno scene break
      if (node.data && node.data.hProperties && node.data.hProperties.className === 'scene-break') {
        return;
      }
      
      // Applica first-paragraph solo al primo paragrafo non-dialogo
      if (!firstNonDialogueParagraphFound && parent && parent.type === 'root') {
        if (!node.data) node.data = {};
        if (!node.data.hProperties) node.data.hProperties = {};
        node.data.hProperties.className = (node.data.hProperties.className || '') + ' first-paragraph';
        firstNonDialogueParagraphFound = true;
      }
    });
  };
};