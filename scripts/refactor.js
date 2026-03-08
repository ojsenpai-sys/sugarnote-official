const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function refactorFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  // Skip site.ts config itself
  if (filePath.includes('site.ts')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Replace all "pink-" with "primary-"
  content = content.replace(/pink-/g, 'primary-');

  // 2. Replace specific SugarNote usages
  const hasSugarNote = content.includes('SugarNote');
  
  if (hasSugarNote) {
    // Add import statement if not present
    if (!content.includes('import { siteConfig }')) {
        // Insert after first import block or at top
        const importStatement = `import { siteConfig } from "@/config/site";\n`;
        const lastImportIndex = content.lastIndexOf('import ');
        if (lastImportIndex !== -1) {
            const endOfLastImport = content.indexOf('\n', lastImportIndex);
            content = content.slice(0, endOfLastImport + 1) + importStatement + content.slice(endOfLastImport + 1);
        } else {
            content = importStatement + content;
        }
    }

    // JSX Text: >SugarNote<
    content = content.replace(/>SugarNote(.*?)</g, '>{siteConfig.name}$1<');
    
    // JSX Attributes: alt="SugarNote Logo"
    content = content.replace(/alt="SugarNote(.*?)"/g, 'alt={`${siteConfig.name}$1`}');

    // Template strings: `【SugarNote】HPより`
    content = content.replace(/`([^`]*?)SugarNote([^`]*?)`/g, '`$1${siteConfig.name}$2`');
    
    // Regular strings: "SugarNote Official" inside ts code
    content = content.replace(/"SugarNote Official"/g, '`${siteConfig.name} Official`');

    // Footer Copyright exact match
    content = content.replace(/© 2026 {siteConfig\.name}/g, '© {new Date().getFullYear()} {siteConfig.name}');
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Refactored: ${filePath}`);
  }
}

walkDir('./src', refactorFile);
console.log('Refactoring complete.');
