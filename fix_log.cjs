const fs = require('fs');
let content = fs.readFileSync('server/rag.ts', 'utf8');
content = content.replace(
  "console.error('[NLAMS AI ERROR] stage: Gemini API, message:', error.message || String(error));",
  "require('fs').appendFileSync('error.log', error.message + '\\n' + String(error.stack) + '\\n'); console.error('[NLAMS AI ERROR] stage: Gemini API, message:', error.message || String(error));"
);
fs.writeFileSync('server/rag.ts', content);
