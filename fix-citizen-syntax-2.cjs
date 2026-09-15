const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'src', 'components', 'CitizenOtpLoginForm.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace("t('auth.enterOtp', 'Enter 6-Digit OTP')')", "t('auth.enterOtp', 'Enter 6-Digit OTP')");

fs.writeFileSync(filePath, content, 'utf8');
