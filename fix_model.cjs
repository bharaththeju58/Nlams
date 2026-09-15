const fs = require('fs');
let content = fs.readFileSync('server/rag.ts', 'utf8');
content = content.replace("model: 'gemini-1.5-flash-8b',", "model: 'gemini-3.6-flash',");
fs.writeFileSync('server/rag.ts', content);
