const fs = require('fs');
const path = require('path');

const rootDir = '/Users/briansmith/Documents/GitHub/el-ranchito-growers';

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (!dirFile.includes('.git') && !dirFile.includes('node_modules')) {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (dirFile.endsWith('.html')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
}

const files = walkSync(rootDir);
let count = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Fix privacy link in location pages
  content = content.replace(/href="\.\.\/privacy\.html"/g, 'href="/privacy-policy.html"');
  
  // Fix nested blog post links
  content = content.replace(/href="blog\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\.html"/g, 'href="/blog/$1/$2.html"');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    count++;
  }
});

console.log(`Fixed remaining relative links in ${count} files.`);
