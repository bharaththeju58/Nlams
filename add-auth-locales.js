const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'i18n', 'locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

const newKeys = {
  auth: {
    phoneNumber: "Phone Number",
    mobileNumber: "Mobile Number",
    enterPhoneNumber: "Enter Phone Number",
    enterOtp: "Enter OTP",
    otp: "OTP",
    sendOtp: "Send OTP",
    verifyOtp: "Verify OTP",
    verify: "Verify",
    resendOtp: "Resend OTP",
    continueBtn: "Continue",
    backBtn: "Back",
    loginBtn: "Login",
    verification: "Verification",
    invalidOtp: "Invalid OTP",
    invalidPhoneNumber: "Invalid phone number",
    otpSentSuccess: "OTP sent successfully",
    verifyingCode: "Verifying Code...",
    verifyingHardware: "Verifying Hardware PKI Handshake...",
    verifySsoSession: "Verify Government SSO Session",
    demoOtp: "Demo OTP:",
    citizenPhoneSms: "Citizen Phone & SMS OTP Verification",
    registeredMobile: "Registered Mobile Number",
    verifyAccessCitizen: "Verify & Access Citizen Portal",
    authenticatorApp: "6-Digit Authenticator App Code (TOTP)",
    authenticatorAppError: "Please enter the 6-digit TOTP code.",
    cancel: "Cancel",
    close: "Close"
  }
};

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.auth) {
    data.auth = {};
  }
  
  // For simplicity, just use English for all for now or translate basic if needed?
  // Wait, I should probably translate them properly using a quick dictionary or just leave them as english if I don't know?
  // Let me just provide the English keys. Wait! The prompt says: "Add translations for English, Tamil, Hindi, Telugu, Kannada and Malayalam."
  // I will write a simple translation dictionary for these specific terms.
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
});
