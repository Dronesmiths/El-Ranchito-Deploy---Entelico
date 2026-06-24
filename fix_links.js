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
    
    // Fix quinceañera links
    content = content.replace(/custom-quincea-era-flowers/g, 'quinceaera-flowers');
    // Fix valentine's day links
    content = content.replace(/custom-valentine-s-day-flowers/g, 'valentines-day-flowers');
    
    // Also, the Href in the files might have ../../custom-..., so just replace custom-
    
    if (content !== original) {
        fs.writeFileSync(filePath, content);
        fixedCount++;
    }
});

console.log(`Fixed links in ${fixedCount} files`);
