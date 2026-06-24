const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else if (dirPath.endsWith('.html')) {
            callback(dirPath);
        }
    });
}

const clientDir = '/Users/briansmith/Documents/GitHub/el-ranchito-growers/blog';

let fixedCount = 0;
walkDir(clientDir, (filePath) => {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;
    
    // The broken links are things like href="../../quinceaera-flowers-in-granada-hills/index.html"
    // They should be href="../../../quinceaera-flowers-in-granada-hills/index.html"
    
    content = content.replace(/href="\.\.\/\.\.\/quinceaera-flowers/g, 'href="../../../quinceaera-flowers');
    content = content.replace(/href="\.\.\/\.\.\/valentines-day-flowers/g, 'href="../../../valentines-day-flowers');
    content = content.replace(/href="\.\.\/\.\.\/mothers-day-flowers/g, 'href="../../../mothers-day-flowers');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content);
        fixedCount++;
    }
});

console.log(`Fixed relative paths in ${fixedCount} files`);
