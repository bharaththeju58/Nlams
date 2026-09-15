const fs = require('fs');
const path = require('path');

const modalsDir = path.join(__dirname, 'src', 'components', 'modals');

['CitizenAuthModal.tsx', 'OfficerParichayModal.tsx', 'SystemAdminAuthModal.tsx', 'AuditorAuthModal.tsx'].forEach(file => {
  const filePath = path.join(modalsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the broken import
  content = content.replace("import React from 'react';\nimport { useTranslation } from 'react-i18next';\n//, {", "import React, {");
  content = content.replace("import React from 'react';\nimport { useTranslation } from 'react-i18next';\n//", "import React, { useState, useEffect } from 'react';\nimport { useTranslation } from 'react-i18next';\n");
  
  // Wait, let's just do a blanket fix for the specific broken pattern:
  // "import React from 'react';\nimport { useTranslation } from 'react-i18next';\n//, { useState, useEffect } from 'react';"
  content = content.replace(/import React from 'react';\nimport \{ useTranslation \} from 'react-i18next';\n\/\/, \{ ([^}]+) \} from 'react';/g, "import React, { $1 } from 'react';\nimport { useTranslation } from 'react-i18next';");

  fs.writeFileSync(filePath, content, 'utf8');
});

