import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, 'src', 'i18n', 'locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

const translations = {
  en: {
    powered: "Powered by RAG & Gemini",
    welcome: "Ask me anything about NLAMS policies, workflows, or compensation.",
    sources: "Sources",
    thinking: "Searching documents...",
    placeholder: "Ask a question about NLAMS...",
    error: "Sorry, I encountered an error while trying to process your request."
  },
  ta: {
    powered: "RAG மற்றும் Gemini மூலம் இயங்குகிறது",
    welcome: "NLAMS கொள்கைகள், பணிப்பாய்வுகள் அல்லது இழப்பீடு பற்றி என்னிடம் ஏதேனும் கேளுங்கள்.",
    sources: "ஆதாரங்கள்",
    thinking: "ஆவணங்களைத் தேடுகிறது...",
    placeholder: "NLAMS பற்றி ஒரு கேள்வி கேட்கவும்...",
    error: "மன்னிக்கவும், உங்கள் கோரிக்கையைச் செயல்படுத்தும் போது பிழை ஏற்பட்டது."
  },
  hi: {
    powered: "RAG और Gemini द्वारा संचालित",
    welcome: "मुझसे NLAMS नीतियों, वर्कफ़्लो या मुआवजे के बारे में कुछ भी पूछें।",
    sources: "स्रोत",
    thinking: "दस्तावेज़ खोज रहा है...",
    placeholder: "NLAMS के बारे में एक प्रश्न पूछें...",
    error: "क्षमा करें, आपके अनुरोध को संसाधित करते समय एक त्रुटि हुई।"
  },
  te: {
    powered: "RAG మరియు Gemini ద్వారా ఆధారితం",
    welcome: "NLAMS విధానాలు, వర్క్‌ఫ్లోలు లేదా పరిహారం గురించి నన్ను ఏదైనా అడగండి.",
    sources: "మూలాలు",
    thinking: "పత్రాలను వెతుకుతోంది...",
    placeholder: "NLAMS గురించి ఒక ప్రశ్న అడగండి...",
    error: "క్షమించండి, మీ అభ్యర్థనను ప్రాసెస్ చేస్తున్నప్పుడు లోపం ఏర్పడింది."
  },
  kn: {
    powered: "RAG ಮತ್ತು Gemini ಯಿಂದ ನಿಯಂತ್ರಿಸಲ್ಪಡುತ್ತದೆ",
    welcome: "NLAMS ನೀತಿಗಳು, ಕೆಲಸದ ಹರಿವುಗಳು ಅಥವಾ ಪರಿಹಾರದ ಕುರಿತು ನನ್ನನ್ನು ಯಾವುದನ್ನಾದರೂ ಕೇಳಿ.",
    sources: "ಮೂಲಗಳು",
    thinking: "ದಾಖಲೆಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...",
    placeholder: "NLAMS ಬಗ್ಗೆ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ...",
    error: "ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸುವಾಗ ದೋಷ ಸಂಭವಿಸಿದೆ."
  },
  ml: {
    powered: "RAG, Gemini എന്നിവ അധികാരപ്പെടുത്തിയത്",
    welcome: "NLAMS നയങ്ങൾ, വർക്ക്ഫ്ലോകൾ അല്ലെങ്കിൽ നഷ്ടപരിഹാരം എന്നിവയെക്കുറിച്ച് എന്നോട് എന്തെങ്കിലും ചോദിക്കുക.",
    sources: "ഉറവിടങ്ങൾ",
    thinking: "രേഖകൾ തിരയുന്നു...",
    placeholder: "NLAMS നെക്കുറിച്ച് ഒരു ചോദ്യം ചോദിക്കുക...",
    error: "ക്ഷമിക്കണം, നിങ്ങളുടെ അഭ്യർത്ഥന പ്രോസസ്സ് ചെയ്യുന്നതിനിടയിൽ ഒരു പിശക് സംഭവിച്ചു."
  }
};

files.forEach(file => {
  const lang = file.split('.')[0];
  const filePath = path.join(localesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.ai) {
    data.ai = {};
  }
  
  const trans = translations[lang] || translations['en'];
  
  Object.assign(data.ai, trans);
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
});

console.log('Translations added successfully.');
