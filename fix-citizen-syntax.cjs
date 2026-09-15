const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'src', 'components', 'CitizenOtpLoginForm.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The original line was:
// setErrorMessage(t('citizen.enterPhone', 'Please enter a valid 10-digit Indian mobile number (e.g. 9876541022)'));
// But it became:
// setErrorMessage(t('auth.enterPhoneNumber', 'Enter Phone Number')'));
// I'll just fix any "))');" to "));" or something.

content = content.replace("t('auth.enterPhoneNumber', 'Enter Phone Number')'));", "t('auth.invalidPhoneNumber', 'Invalid phone number'));");
content = content.replace("t('auth.enterPhoneNumber', 'Enter Phone Number')');", "t('auth.enterPhoneNumber', 'Enter Phone Number');"); // wait, let me just replace based on the actual broken strings

fs.writeFileSync(filePath, content, 'utf8');

