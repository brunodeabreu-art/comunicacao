const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  // Parse URL
  let filePath = '.' + req.url;
  
  // Default to index.html if accessing root
  if (filePath === './') {
    filePath = './comunicacao/organograma.html';
  }
  
  // If no extension, try adding .html
  if (path.extname(filePath) === '') {
    filePath += '.html';
  }

  // Get file extension
  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeType = mimeTypes[extname] || 'application/octet-stream';

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Read and serve file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <head><title>404 - Not Found</title></head>
            <body>
              <h1>404 - Arquivo não encontrado</h1>
              <p>Tente acessar:</p>
              <ul>
                <li><a href="/comunicacao/organograma.html">Organograma</a></li>
                <li><a href="/comunicacao/partner-hub.html">Partner Hub</a></li>
                <li><a href="/comunicacao/analise-riscos-ishikawa.html">Análise de Riscos</a></li>
              </ul>
            </body>
          </html>
        `, 'utf-8');
      } else {
        // Server error
        res.writeHead(500);
        res.end('Erro interno do servidor: ' + error.code + ' ..\n');
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📋 Organograma: http://localhost:${PORT}/comunicacao/organograma.html`);
  console.log(`🤝 Partner Hub: http://localhost:${PORT}/comunicacao/partner-hub.html`);
  console.log(`📊 Análise Riscos: http://localhost:${PORT}/comunicacao/analise-riscos-ishikawa.html`);
}); 