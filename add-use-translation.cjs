const fs = require('fs');
const path = require('path');

const addTranslation = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('useTranslation')) return;
  
  // Add import
  content = content.replace("import React", "import React from 'react';\nimport { useTranslation } from 'react-i18next';\n//");
  // Some files might have import React, { useState } from 'react';
  content = content.replace(/import React, {([^}]+)} from 'react';/, "import React, {$1} from 'react';\nimport { useTranslation } from 'react-i18next';");

  // Add hook inside component
  content = content.replace(/(export const \w+[^=]*=\s*(?:<[^>]+>)?\s*\([^)]*\)\s*=>\s*\{)/, "$1\n  const { t } = useTranslation();");
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Added useTranslation to ${filePath}`);
};

const componentsDir = path.join(__dirname, 'src', 'components');
const modalsDir = path.join(componentsDir, 'modals');

['CitizenAuthModal.tsx', 'OfficerParichayModal.tsx', 'SystemAdminAuthModal.tsx', 'AuditorAuthModal.tsx'].forEach(file => {
  addTranslation(path.join(modalsDir, file));
});

