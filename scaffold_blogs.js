const fs = require('fs');
const path = require('path');

const clientDir = __dirname;
const keywordsPath = path.join(clientDir, 'keywords.json');

if (!fs.existsSync(keywordsPath)) {
    console.error('keywords.json not found');
    process.exit(1);
}

const keywords = JSON.parse(fs.readFileSync(keywordsPath, 'utf-8'));
const services = keywords.services || [];
const locations = keywords.locations || [];

const blogDir = path.join(clientDir, 'blog');
if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir);
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

function generateHtml(title, h1, parentLink, parentText) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Flowers El Ranchito</title>
    <meta name="description" content="Read our complete guide to ${title.toLowerCase()}.">
</head>
<body>
    <header>
        <nav>
            <a href="/">Home</a>
            <a href="/blog/">Blog</a>
            ${parentLink ? `<a href="${parentLink}">${parentText}</a>` : ''}
        </nav>
    </header>
    <main>
        <h1>${h1}</h1>
        <!-- Content engine will hydrate this -->
    </main>
    <footer>
        <p>&copy; 2026 Flowers El Ranchito</p>
    </footer>
</body>
</html>`;
}

// Scaffold Hubs and Spokes
for (const service of services) {
    const serviceSlug = slugify(service);
    const categoryDir = path.join(blogDir, serviceSlug);
    
    if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
    }
    
    // Hub File
    const hubFile = path.join(categoryDir, 'index.html');
    const hubTitle = `The Ultimate Guide to ${service} in Los Angeles`;
    const hubH1 = `The Ultimate Guide to ${service} in Los Angeles`;
    fs.writeFileSync(hubFile, generateHtml(hubTitle, hubH1, null, null));
    console.log(`Created Hub: /blog/${serviceSlug}/`);
    
    // Spoke Files
    for (const location of locations) {
        const locSlug = slugify(location);
        const spokeDir = path.join(categoryDir, locSlug);
        
        if (!fs.existsSync(spokeDir)) {
            fs.mkdirSync(spokeDir, { recursive: true });
        }
        
        const spokeFile = path.join(spokeDir, 'index.html');
        const spokeTitle = `Best ${service} in ${location}`;
        const spokeH1 = `Best ${service} in ${location}`;
        fs.writeFileSync(spokeFile, generateHtml(spokeTitle, spokeH1, `/blog/${serviceSlug}/`, `Guide to ${service}`));
        console.log(`Created Spoke: /blog/${serviceSlug}/${locSlug}/`);
    }
}

console.log('Blog Hub & Spoke scaffolding complete.');
