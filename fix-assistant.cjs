const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'AIAssistant.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// We need to add the ref.
content = content.replace("const [isLoading, setIsLoading] = useState(false);", "const [isLoading, setIsLoading] = useState(false);\n  const isSendingRef = useRef(false);");

// Update handleSend
content = content.replace(
  "const handleSend = async () => {\n    if (!inputValue.trim() || isLoading) return;",
  "const handleSend = async () => {\n    if (!inputValue.trim() || isSendingRef.current || isLoading) return;\n    isSendingRef.current = true;"
);

content = content.replace(
  "setIsLoading(false);\n    }\n  };",
  "setIsLoading(false);\n      isSendingRef.current = false;\n    }\n  };"
);

fs.writeFileSync(filePath, content, 'utf8');

