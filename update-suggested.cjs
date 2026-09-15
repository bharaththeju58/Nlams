const fs = require('fs');
const path = require('path');

const translations = {
  en: {
    suggest: {
      q1: "What is the compensation status for LP-001?",
      q2: "Has compensation been paid for LP-002?",
      q3: "What is the verification status of LP-003?",
      q4: "Has possession been completed for LP-004?",
      q5: "What is the rehabilitation status of LP-005?",
      q6: "What is the acquisition status of LP-006?",
      q7: "Are there any pending actions for LP-007?"
    }
  },
  ta: {
    suggest: {
      q1: "LP-001 இன் இழப்பீட்டு நிலை என்ன?",
      q2: "LP-002 க்கு இழப்பீடு வழங்கப்பட்டுள்ளதா?",
      q3: "LP-003 இன் சரிபார்ப்பு நிலை என்ன?",
      q4: "LP-004 க்கான நிலம் கையகப்படுத்துதல் முடிந்துவிட்டதா?",
      q5: "LP-005 இன் மறுவாழ்வு நிலை என்ன?",
      q6: "LP-006 இன் கையகப்படுத்தும் நிலை என்ன?",
      q7: "LP-007 இல் நிலுவையில் உள்ள நடவடிக்கைகள் ஏதேனும் உள்ளதா?"
    }
  },
  hi: {
    suggest: {
      q1: "LP-001 के लिए मुआवजे की स्थिति क्या है?",
      q2: "क्या LP-002 के लिए मुआवजे का भुगतान किया गया है?",
      q3: "LP-003 की सत्यापन स्थिति क्या है?",
      q4: "क्या LP-004 के लिए कब्जा पूरा हो गया है?",
      q5: "LP-005 की पुनर्वास स्थिति क्या है?",
      q6: "LP-006 की अधिग्रहण स्थिति क्या है?",
      q7: "क्या LP-007 के लिए कोई लंबित कार्य हैं?"
    }
  },
  te: {
    suggest: {
      q1: "LP-001 కు నష్టపరిహారం స్థితి ఏమిటి?",
      q2: "LP-002 కు నష్టపరిహారం చెల్లించబడిందా?",
      q3: "LP-003 యొక్క ధృవీకరణ స్థితి ఏమిటి?",
      q4: "LP-004 కోసం స్వాధీనం పూర్తయిందా?",
      q5: "LP-005 యొక్క పునరావాసం స్థితి ఏమిటి?",
      q6: "LP-006 యొక్క భూసేకరణ స్థితి ఏమిటి?",
      q7: "LP-007 కోసం పెండింగ్‌లో ఉన్న చర్యలు ఏమైనా ఉన్నాయా?"
    }
  },
  kn: {
    suggest: {
      q1: "LP-001 ಗೆ ಪರಿಹಾರದ ಸ್ಥಿತಿ ಏನು?",
      q2: "LP-002 ಗೆ ಪರಿಹಾರವನ್ನು ಪಾವತಿಸಲಾಗಿದೆಯೇ?",
      q3: "LP-003 ರ ಪರಿಶೀಲನೆ ಸ್ಥಿತಿ ಏನು?",
      q4: "LP-004 ಗಾಗಿ ಸ್ವಾಧೀನವು ಪೂರ್ಣಗೊಂಡಿದೆಯೇ?",
      q5: "LP-005 ರ ಪುನರ್ವಸತಿ ಸ್ಥಿತಿ ಏನು?",
      q6: "LP-006 ರ ಭೂಸ್ವಾಧೀನದ ಸ್ಥಿತಿ ಏನು?",
      q7: "LP-007 ಗಾಗಿ ಯಾವುದೇ ಬಾಕಿ ಉಳಿದಿರುವ ಕ್ರಿಯೆಗಳಿವೆಯೇ?"
    }
  },
  ml: {
    suggest: {
      q1: "LP-001-ന്റെ നഷ്ടപരിഹാര നില എന്താണ്?",
      q2: "LP-002-ന് നഷ്ടപരിഹാരം നൽകിയിട്ടുണ്ടോ?",
      q3: "LP-003-ന്റെ സ്ഥിരീകരണ നില എന്താണ്?",
      q4: "LP-004-ന്റെ കൈവശപ്പെടുത്തൽ പൂർത്തിയായോ?",
      q5: "LP-005-ന്റെ പുനരധിവാസ നില എന്താണ്?",
      q6: "LP-006-ന്റെ ഏറ്റെടുക്കൽ നില എന്താണ്?",
      q7: "LP-007-ന് നിലവിലുള്ള എന്തെങ്കിലും നടപടികൾ ഉണ്ടോ?"
    }
  }
};

const localesDir = path.join(__dirname, 'src', 'i18n', 'locales');

for (const lang of Object.keys(translations)) {
  const filePath = path.join(localesDir, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!data.ai) data.ai = {};
    // Replace all existing suggestions with the new ones
    data.ai.suggest = translations[lang].suggest;
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${lang}.json`);
  }
}
