const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'CitizenOtpLoginForm.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.split("{t('auth.or', 'or')}").join("or");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Reverted or replacement');
