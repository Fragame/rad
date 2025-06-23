const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Avvio Docusaurus Editor...\n');

// Avvia l'API server
const api = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'api'),
  stdio: 'inherit',
  shell: true
});

// Attendi che l'API sia pronta (3 secondi)
setTimeout(() => {
  console.log('\n📚 Avvio Docusaurus...\n');
  
  // Avvia Docusaurus
  const docusaurus = spawn('npm', ['start'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  // Gestione chiusura
  process.on('SIGINT', () => {
    console.log('\n🛑 Chiusura server...');
    api.kill();
    docusaurus.kill();
    process.exit();
  });

}, 3000);