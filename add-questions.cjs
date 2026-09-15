const fs = require('fs');
const path = require('path');

const translations = {
  en: {
    suggestedHeading: "Suggested Questions",
    suggest: {
      q1: "What is the land acquisition process?",
      q2: "What does compensation status mean?",
      q3: "What documents are required for land acquisition?",
      q4: "What are the stages of compensation?",
      q5: "What is rehabilitation and resettlement?",
      q6: "How can I check my land acquisition status?"
    }
  },
  ta: {
    suggestedHeading: "பரிந்துரைக்கப்பட்ட கேள்விகள்",
    suggest: {
      q1: "நிலம் கையகப்படுத்தும் செயல்முறை என்ன?",
      q2: "இழப்பீட்டு நிலை என்றால் என்ன?",
      q3: "நிலம் கையகப்படுத்த என்ன ஆவணங்கள் தேவை?",
      q4: "இழப்பீட்டின் நிலைகள் யாவை?",
      q5: "மறுவாழ்வு மற்றும் மறுகுடியமர்வு என்றால் என்ன?",
      q6: "எனது நிலம் கையகப்படுத்தும் நிலையை எவ்வாறு சரிபார்க்கலாம்?"
    }
  },
  hi: {
    suggestedHeading: "सुझाए गए प्रश्न",
    suggest: {
      q1: "भूमि अधिग्रहण प्रक्रिया क्या है?",
      q2: "मुआवजे की स्थिति का क्या अर्थ है?",
      q3: "भूमि अधिग्रहण के लिए कौन से दस्तावेजों की आवश्यकता है?",
      q4: "मुआवजे के चरण क्या हैं?",
      q5: "पुनर्वास और पुनर्स्थापन क्या है?",
      q6: "मैं अपने भूमि अधिग्रहण की स्थिति कैसे जांच सकता हूं?"
    }
  },
  te: {
    suggestedHeading: "సూచించబడిన ప్రశ్నలు",
    suggest: {
      q1: "భూసేకరణ ప్రక్రియ ఏమిటి?",
      q2: "నష్టపరిహారం స్థితి అంటే ఏమిటి?",
      q3: "భూసేకరణకు ఏ పత్రాలు అవసరం?",
      q4: "నష్టపరిహారం దశలు ఏమిటి?",
      q5: "పునరావాసం మరియు పునరావాసం అంటే ఏమిటి?",
      q6: "నా భూసేకరణ స్థితిని నేను ఎలా తనిఖీ చేయగలను?"
    }
  },
  kn: {
    suggestedHeading: "ಸೂಚಿಸಲಾದ ಪ್ರಶ್ನೆಗಳು",
    suggest: {
      q1: "ಭೂಸ್ವಾಧೀನ ಪ್ರಕ್ರಿಯೆ ಏನು?",
      q2: "ಪರಿಹಾರದ ಸ್ಥಿತಿ ಎಂದರೇನು?",
      q3: "ಭೂಸ್ವಾಧೀನಕ್ಕೆ ಯಾವ ದಾಖಲೆಗಳು ಬೇಕಾಗುತ್ತವೆ?",
      q4: "ಪರಿಹಾರದ ಹಂತಗಳು ಯಾವುವು?",
      q5: "ಪುನರ್ವಸತಿ ಮತ್ತು ಪುನರ್ವಸತಿ ಎಂದರೇನು?",
      q6: "ನನ್ನ ಭೂಸ್ವಾಧೀನದ ಸ್ಥಿತಿಯನ್ನು ನಾನು ಹೇಗೆ ಪರಿಶೀಲಿಸಬಹುದು?"
    }
  },
  ml: {
    suggestedHeading: "നിർദ്ദേശിച്ച ചോദ്യങ്ങൾ",
    suggest: {
      q1: "ഭൂമി ഏറ്റെടുക്കൽ പ്രക്രിയ എന്താണ്?",
      q2: "നഷ്ടപരിഹാര നില എന്താണ് അർത്ഥമാക്കുന്നത്?",
      q3: "ഭൂമി ഏറ്റെടുക്കുന്നതിന് ആവശ്യമായ രേഖകൾ എന്തൊക്കെയാണ്?",
      q4: "നഷ്ടപരിഹാരത്തിന്റെ ഘട്ടങ്ങൾ എന്തൊക്കെയാണ്?",
      q5: "പുനരധിവാസവും പുനരധിവാസവും എന്താണ്?",
      q6: "എന്റെ ഭൂമി ഏറ്റെടുക്കൽ നില എങ്ങനെ പരിശോധിക്കാം?"
    }
  }
};

const localesDir = path.join(__dirname, 'src', 'i18n', 'locales');

for (const lang of Object.keys(translations)) {
  const filePath = path.join(localesDir, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!data.ai) data.ai = {};
    if (!data.ai.suggest) data.ai.suggest = {};
    
    data.ai.suggestedHeading = translations[lang].suggestedHeading;
    data.ai.suggest = { ...data.ai.suggest, ...translations[lang].suggest };
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${lang}.json`);
  }
}
