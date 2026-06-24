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

const clientDir = '/Users/briansmith/Documents/GitHub/el-ranchito-growers';

let fixedCount = 0;
walkDir(clientDir, (filePath) => {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;
    
    content = content.replace(/custom-mother-s-day-flowers/g, 'mothers-day-flowers');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content);
        fixedCount++;
    }
});

console.log(`Fixed links in ${fixedCount} files`);
