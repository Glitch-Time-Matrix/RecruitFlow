const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/AURA/g, 'RECRUITFLOW');
    content = content.replace(/Aura Staffing Agency/g, 'RecruitFlow');
    content = content.replace(/Aura Executive Staffing/g, 'RecruitFlow');
    content = content.replace(/Aura Staffing/g, 'RecruitFlow');
    content = content.replace(/Aura/g, 'RecruitFlow');
    content = content.replace(/aura/g, 'recruitflow');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
