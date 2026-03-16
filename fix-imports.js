const fs = require('fs');
const path = require('path');

// 1. Rewrite index.js to remove any BOM
function cleanBOM(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
      console.log('Removed BOM from', filePath);
    }
    fs.writeFileSync(filePath, content, 'utf8');
  } else {
    console.log('File not found:', filePath);
  }
}

cleanBOM(path.join(__dirname, 'src/components/atoms/index.js'));
cleanBOM(path.join(__dirname, 'src/components/molecules/index.js'));

// 2. Fix imports in pages
const pagesDir = path.join(__dirname, 'src/pages');

function fixImportsInDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixImportsInDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      const moleculeComponents = [
        'AlertMessage', 'AppointmentCard', 'BloodTypeSelector', 'Breadcrumb',
        'DonorCard', 'FileUpload', 'HospitalCard', 'Navbar', 'NotificationItem',
        'Pagination', 'RatingStars', 'RequestCard', 'SearchBar', 'Sidebar',
        'SocialShare', 'StatsCard', 'Tabs', 'UrgencyBadge'
      ];

      const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
      
      content = content.replace(importRegex, (match, importsStr, modulePath) => {
        if (!modulePath.includes('components/atoms') && !modulePath.includes('components/molecules')) {
          return match;
        }
        
        // Handle multiline imports and clean them up
        let imports = importsStr.split(',').map(s => s.trim()).filter(Boolean);
        let atomImports = [];
        let moleculeImports = [];
        
        imports.forEach(imp => {
          let name = imp.split(/\s+as\s+/)[0].trim();
          if (moleculeComponents.includes(name)) {
            moleculeImports.push(imp);
          } else {
            atomImports.push(imp);
          }
        });
        
        if (modulePath.includes('components/atoms') && moleculeImports.length > 0) {
          changed = true;
          let newImports = [];
          if (atomImports.length > 0) {
            newImports.push(`import { ${atomImports.join(', ')} } from '${modulePath}';`);
          }
          let molPath = modulePath.replace('components/atoms', 'components/molecules');
          newImports.push(`import { ${moleculeImports.join(', ')} } from '${molPath}';`);
          return newImports.join('\n');
        } else if (modulePath.includes('components/molecules') && atomImports.length > 0) {
          changed = true;
          let newImports = [];
          if (moleculeImports.length > 0) {
            newImports.push(`import { ${moleculeImports.join(', ')} } from '${modulePath}';`);
          }
          let atomPath = modulePath.replace('components/molecules', 'components/atoms');
          newImports.push(`import { ${atomImports.join(', ')} } from '${atomPath}';`);
          return newImports.join('\n');
        }
        
        return match;
      });

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed imports in', fullPath);
      }
    }
  }
}

fixImportsInDir(pagesDir);
