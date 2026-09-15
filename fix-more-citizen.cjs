const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'CitizenOtpLoginForm.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/t\('citizen\.verifyOtp',[^)]*\)/g, "t('auth.verifyOtp', 'Verify OTP')");
content = content.replace(/t\('citizen\.sendOtp',[^)]*\)/g, "t('auth.sendOtp', 'Send OTP')");
content = content.replace(/t\('citizen\.enterPhone',[^)]*\)/g, "t('auth.enterPhoneNumber', 'Enter Phone Number')");
content = content.replace(/t\('citizen\.enterOtp',[^)]*\)/g, "t('auth.enterOtp', 'Enter 6-Digit OTP')");
content = content.replace(/t\('common\.cancel',[^)]*\)/g, "t('auth.backBtn', 'Back')");

fs.writeFileSync(filePath, content, 'utf8');

