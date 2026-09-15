const fs = require('fs');
const path = require('path');

const replaceInFile = (filePath, replacements) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  for (const [search, replace] of replacements) {
    if (content.includes(search)) {
      content = content.split(search).join(replace);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
};

const componentsDir = path.join(__dirname, 'src', 'components');
const modalsDir = path.join(componentsDir, 'modals');

// 1. CitizenOtpLoginForm.tsx
replaceInFile(path.join(componentsDir, 'CitizenOtpLoginForm.tsx'), [
  ["<span>Verifying OTP...</span>", "<span>{t('auth.verifyingCode', 'Verifying OTP...')}</span>"],
  ["Resend OTP", "{t('auth.resendOtp', 'Resend OTP')}"],
  ["One-Click Demo Test Profiles:", "{t('auth.demoProfiles', 'One-Click Demo Test Profiles:')}"],
  ["Default demo OTP is", "{t('auth.defaultDemoOtp', 'Default demo OTP is')}"],
  ["Change Number (+91 {phoneInput})", "{t('auth.changeNumber', 'Change Number')} (+91 {phoneInput})"],
  ["Will authenticate as:", "{t('auth.willAuthenticateAs', 'Will authenticate as:')}"],
  ["10-Digit Mobile Number", "{t('auth.mobileNumber', '10-Digit Mobile Number')}"],
  ["or", "{t('auth.or', 'or')}"] // careful with "or", maybe wait on that
]);

// 2. UserTypeSelection.tsx
replaceInFile(path.join(componentsDir, 'UserTypeSelection.tsx'), [
  ["Enter Mobile Number:", "{t('auth.enterPhoneNumber', 'Enter Mobile Number:')}"],
  ["Send OTP via SMS →", "{t('auth.sendOtp', 'Send OTP via SMS')} →"],
  ["Continue to Portal", "{t('auth.continueBtn', 'Continue to Portal')}"],
]);

// 3. CitizenAuthModal.tsx
replaceInFile(path.join(modalsDir, 'CitizenAuthModal.tsx'), [
  ["<span>Demo OTP:</span>", "<span>{t('auth.demoOtp', 'Demo OTP:')}</span>"],
  ["Enter 6-Digit Verification Code (OTP)", "{t('auth.enterOtp', 'Enter 6-Digit Verification Code (OTP)')}"],
  ["<span>Resend OTP</span>", "<span>{t('auth.resendOtp', 'Resend OTP')}</span>"],
  ["<span>Verifying Code...</span>", "<span>{t('auth.verifyingCode', 'Verifying Code...')}</span>"],
  ["<span>Verify & Access Citizen Portal</span>", "<span>{t('auth.verifyAccessCitizen', 'Verify & Access Citizen Portal')}</span>"],
  ["Citizen Phone & SMS OTP Verification", "{t('auth.citizenPhoneSms', 'Citizen Phone & SMS OTP Verification')}"],
  ["Registered Mobile Number", "{t('auth.registeredMobile', 'Registered Mobile Number')}"],
  ["Code pre-filled below.", "{t('auth.codePrefilled', 'Code pre-filled below.')}"],
  ["You may test with any registered phone number or click the demo chips below.", "{t('auth.testWithRegistered', 'You may test with any registered phone number or click the demo chips below.')}"],
  ["placeholder=\"10-digit mobile number\"", "placeholder={t('auth.mobileNumber', '10-digit mobile number')}"],
  ["'Please enter a valid 10-digit Indian mobile number.'", "t('auth.invalidPhoneNumber', 'Please enter a valid 10-digit Indian mobile number.')"],
  ["'Please enter the 6-digit OTP received via SMS.'", "t('auth.invalidOtp', 'Please enter the 6-digit OTP received via SMS.')"]
]);

// 4. OfficerParichayModal.tsx
replaceInFile(path.join(modalsDir, 'OfficerParichayModal.tsx'), [
  ["<span>Verify Government SSO Session</span>", "<span>{t('auth.verifySsoSession', 'Verify Government SSO Session')}</span>"],
  ["<span>Verifying...</span>", "<span>{t('auth.verifyingCode', 'Verifying...')}</span>"]
]);

// 5. SystemAdminAuthModal.tsx
replaceInFile(path.join(modalsDir, 'SystemAdminAuthModal.tsx'), [
  ["6-Digit Authenticator App Code (TOTP)", "{t('auth.authenticatorApp', '6-Digit Authenticator App Code (TOTP)')}"],
  ["<span>Verifying...</span>", "<span>{t('auth.verifyingCode', 'Verifying...')}</span>"],
  ["'Please enter the 6-digit TOTP code.'", "t('auth.authenticatorAppError', 'Please enter the 6-digit TOTP code.')"]
]);

// 6. AuditorAuthModal.tsx
replaceInFile(path.join(modalsDir, 'AuditorAuthModal.tsx'), [
  ["<span>Verifying Hardware PKI Handshake...</span>", "<span>{t('auth.verifyingHardware', 'Verifying Hardware PKI Handshake...')}</span>"]
]);

