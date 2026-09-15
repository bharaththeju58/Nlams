const fs = require('fs');
const path = require('path');

const dict = {
  en: {
    phoneNumber: "Phone Number", mobileNumber: "Mobile Number", enterPhoneNumber: "Enter Phone Number",
    enterOtp: "Enter OTP", otp: "OTP", sendOtp: "Send OTP", verifyOtp: "Verify OTP",
    verify: "Verify", resendOtp: "Resend OTP", continueBtn: "Continue", backBtn: "Back",
    loginBtn: "Login", verification: "Verification", invalidOtp: "Invalid OTP",
    invalidPhoneNumber: "Invalid phone number", otpSentSuccess: "OTP sent successfully",
    verifyingCode: "Verifying Code...", verifyingHardware: "Verifying Hardware PKI Handshake...",
    verifySsoSession: "Verify Government SSO Session", demoOtp: "Demo OTP:",
    citizenPhoneSms: "Citizen Phone & SMS OTP Verification", registeredMobile: "Registered Mobile Number",
    verifyAccessCitizen: "Verify & Access Citizen Portal", authenticatorApp: "6-Digit Authenticator App Code (TOTP)",
    authenticatorAppError: "Please enter the 6-digit TOTP code."
  },
  hi: {
    phoneNumber: "फ़ोन नंबर", mobileNumber: "मोबाइल नंबर", enterPhoneNumber: "फ़ोन नंबर दर्ज करें",
    enterOtp: "OTP दर्ज करें", otp: "OTP", sendOtp: "OTP भेजें", verifyOtp: "OTP सत्यापित करें",
    verify: "सत्यापित करें", resendOtp: "OTP फिर से भेजें", continueBtn: "जारी रखें", backBtn: "वापस",
    loginBtn: "लॉग इन", verification: "सत्यापन", invalidOtp: "अमान्य OTP",
    invalidPhoneNumber: "अमान्य फ़ोन नंबर", otpSentSuccess: "OTP सफलतापूर्वक भेजा गया",
    verifyingCode: "कोड सत्यापित किया जा रहा है...", verifyingHardware: "हार्डवेयर PKI हैंडशेक सत्यापित किया जा रहा है...",
    verifySsoSession: "सरकारी SSO सत्र सत्यापित करें", demoOtp: "डेमो OTP:",
    citizenPhoneSms: "नागरिक फ़ोन और SMS OTP सत्यापन", registeredMobile: "पंजीकृत मोबाइल नंबर",
    verifyAccessCitizen: "नागरिक पोर्टल को सत्यापित करें और एक्सेस करें", authenticatorApp: "6-अंकीय प्रमाणक ऐप कोड (TOTP)",
    authenticatorAppError: "कृपया 6-अंकीय TOTP कोड दर्ज करें।"
  },
  ta: {
    phoneNumber: "தொலைபேசி எண்", mobileNumber: "கைபேசி எண்", enterPhoneNumber: "தொலைபேசி எண்ணை உள்ளிடவும்",
    enterOtp: "OTP உள்ளிடவும்", otp: "OTP", sendOtp: "OTP ஐ அனுப்பவும்", verifyOtp: "OTP ஐ சரிபார்க்கவும்",
    verify: "சரிபார்க்கவும்", resendOtp: "OTP ஐ மீண்டும் அனுப்பவும்", continueBtn: "தொடரவும்", backBtn: "திரும்ப",
    loginBtn: "உள்நுழைய", verification: "சரிபார்ப்பு", invalidOtp: "தவறான OTP",
    invalidPhoneNumber: "தவறான தொலைபேசி எண்", otpSentSuccess: "OTP வெற்றிகரமாக அனுப்பப்பட்டது",
    verifyingCode: "குறியீட்டை சரிபார்க்கிறது...", verifyingHardware: "வன்பொருள் PKI ஹேண்ட்ஷேக்கை சரிபார்க்கிறது...",
    verifySsoSession: "அரசு SSO அமர்வை சரிபார்க்கவும்", demoOtp: "டெமோ OTP:",
    citizenPhoneSms: "குடிமக்கள் தொலைபேசி & SMS OTP சரிபார்ப்பு", registeredMobile: "பதிவு செய்யப்பட்ட மொபைல் எண்",
    verifyAccessCitizen: "குடிமக்கள் போர்ட்டலை சரிபார்த்து அணுகவும்", authenticatorApp: "6 இலக்க அங்கீகார பயன்பாட்டு குறியீடு (TOTP)",
    authenticatorAppError: "6 இலக்க TOTP குறியீட்டை உள்ளிடவும்."
  },
  te: {
    phoneNumber: "ఫోన్ నంబర్", mobileNumber: "మొబైల్ నంబర్", enterPhoneNumber: "ఫోన్ నంబర్ నమోదు చేయండి",
    enterOtp: "OTP నమోదు చేయండి", otp: "OTP", sendOtp: "OTP పంపండి", verifyOtp: "OTP ధృవీకరించండి",
    verify: "ధృవీకరించండి", resendOtp: "OTP మళ్లీ పంపండి", continueBtn: "కొనసాగించండి", backBtn: "వెనుకకు",
    loginBtn: "లాగిన్", verification: "ధృవీకరణ", invalidOtp: "చెల్లని OTP",
    invalidPhoneNumber: "చెల్లని ఫోన్ నంబర్", otpSentSuccess: "OTP విజయవంతంగా పంపబడింది",
    verifyingCode: "కోడ్ ధృవీకరించబడుతోంది...", verifyingHardware: "హార్డ్‌వేర్ PKI హ్యాండ్‌షేక్ ధృవీకరించబడుతోంది...",
    verifySsoSession: "ప్రభుత్వ SSO సెషన్‌ను ధృవీకరించండి", demoOtp: "డెమో OTP:",
    citizenPhoneSms: "పౌరుల ఫోన్ & SMS OTP ధృవీకరణ", registeredMobile: "నమోదిత మొబైల్ నంబర్",
    verifyAccessCitizen: "పౌర పోర్టల్‌ను ధృవీకరించండి మరియు యాక్సెస్ చేయండి", authenticatorApp: "6-అంకెల అథెంటికేటర్ యాప్ కోడ్ (TOTP)",
    authenticatorAppError: "దయచేసి 6-అంకెల TOTP కోడ్‌ని నమోదు చేయండి."
  },
  kn: {
    phoneNumber: "ದೂರವಾಣಿ ಸಂಖ್ಯೆ", mobileNumber: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ", enterPhoneNumber: "ದೂರವಾಣಿ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ",
    enterOtp: "OTP ನಮೂದಿಸಿ", otp: "OTP", sendOtp: "OTP ಕಳುಹಿಸಿ", verifyOtp: "OTP ಪರಿಶೀಲಿಸಿ",
    verify: "ಪರಿಶೀಲಿಸಿ", resendOtp: "OTP ಮರುಕಳುಹಿಸಿ", continueBtn: "ಮುಂದುವರಿಸಿ", backBtn: "ಹಿಂದೆ",
    loginBtn: "ಲಾಗಿನ್", verification: "ಪರಿಶೀಲನೆ", invalidOtp: "ಅಮಾನ್ಯ OTP",
    invalidPhoneNumber: "ಅಮಾನ್ಯ ದೂರವಾಣಿ ಸಂಖ್ಯೆ", otpSentSuccess: "OTP ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ",
    verifyingCode: "ಕೋಡ್ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...", verifyingHardware: "ಹಾರ್ಡ್‌ವೇರ್ PKI ಹ್ಯಾಂಡ್‌ಶೇಕ್ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
    verifySsoSession: "ಸರ್ಕಾರಿ SSO ಸೆಷನ್ ಪರಿಶೀಲಿಸಿ", demoOtp: "ಡೆಮೊ OTP:",
    citizenPhoneSms: "ನಾಗರಿಕ ಫೋನ್ ಮತ್ತು SMS OTP ಪರಿಶೀಲನೆ", registeredMobile: "ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    verifyAccessCitizen: "ನಾಗರಿಕ ಪೋರ್ಟಲ್ ಅನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಪ್ರವೇಶಿಸಿ", authenticatorApp: "6-ಅಂಕಿಯ ಅಥೆಂಟಿಕೇಟರ್ ಅಪ್ಲಿಕೇಶನ್ ಕೋಡ್ (TOTP)",
    authenticatorAppError: "ದಯವಿಟ್ಟು 6-ಅಂಕಿಯ TOTP ಕೋಡ್ ನಮೂದಿಸಿ."
  },
  ml: {
    phoneNumber: "ഫോൺ നമ്പർ", mobileNumber: "മൊബൈൽ നമ്പർ", enterPhoneNumber: "ഫോൺ നമ്പർ നൽകുക",
    enterOtp: "OTP നൽകുക", otp: "OTP", sendOtp: "OTP അയയ്ക്കുക", verifyOtp: "OTP പരിശോധിക്കുക",
    verify: "പരിശോധിക്കുക", resendOtp: "OTP വീണ്ടും അയയ്ക്കുക", continueBtn: "തുടരുക", backBtn: "തിരികെ",
    loginBtn: "ലോഗിൻ", verification: "പരിശോധന", invalidOtp: "അസാധുവായ OTP",
    invalidPhoneNumber: "അസാധുവായ ഫോൺ നമ്പർ", otpSentSuccess: "OTP വിജയകരമായി അയച്ചു",
    verifyingCode: "കോഡ് പരിശോധിക്കുന്നു...", verifyingHardware: "ഹാർഡ്‌വെയർ PKI ഹാൻഡ്‌ഷേക്ക് പരിശോധിക്കുന്നു...",
    verifySsoSession: "സർക്കാർ SSO സെഷൻ പരിശോധിക്കുക", demoOtp: "ഡെമോ OTP:",
    citizenPhoneSms: "പൗരന്മാരുടെ ഫോൺ & SMS OTP പരിശോധന", registeredMobile: "രജിസ്റ്റർ ചെയ്ത മൊബൈൽ നമ്പർ",
    verifyAccessCitizen: "സിറ്റിസൺ പോർട്ടൽ പരിശോധിച്ചുറപ്പാക്കി ആക്‌സസ്സ് നേടുക", authenticatorApp: "6-അക്ക ഓതന്റിക്കേറ്റർ ആപ്പ് കോഡ് (TOTP)",
    authenticatorAppError: "ദയവായി 6-അക്ക TOTP കോഡ് നൽകുക."
  }
};

const localesDir = path.join(__dirname, 'src', 'i18n', 'locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const lang = file.replace('.json', '');
  const filePath = path.join(localesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.auth) {
    data.auth = {};
  }
  
  Object.assign(data.auth, dict[lang] || dict['en']);
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
});
