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

  // Replace common relative hrefs with root-relative hrefs
  content = content.replace(/href="our-work\.html"/g, 'href="/our-work.html"');
  content = content.replace(/href="pricing\.html"/g, 'href="/pricing.html"');
  content = content.replace(/href="blog\/"/g, 'href="/blog/"');
  content = content.replace(/href="locations\//g, 'href="/locations/');
  content = content.replace(/href="assets\//g, 'href="/assets/');
  content = content.replace(/href="index\.html#reviews"/g, 'href="/#reviews"');
  content = content.replace(/href="index\.html#faq"/g, 'href="/#faq"');
  content = content.replace(/href="index\.html#contact"/g, 'href="/#contact"');
  
  // Also fix blog category links that might be relative
  content = content.replace(/href="blog\/([a-zA-Z0-9-]+)\/"/g, 'href="/blog/$1/"');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    count++;
  }
});

console.log(`Fixed relative links in ${count} files.`);
