const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://elranchitogrowers.com';
const BUILD_DIR = __dirname; // Root directory since this is a static HTML site
const SITEMAP_PATH = path.join(BUILD_DIR, 'sitemap.xml');

// Find all HTML files recursively
function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    // Ignore node_modules, .git, .github, assets, and scratch folders
    if (
      fs.statSync(filePath).isDirectory() &&
      !['node_modules', '.git', '.github', 'assets', 'scratch', 'llm'].includes(file)
    ) {
      getHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function generateSitemap() {
  const files = getHtmlFiles(BUILD_DIR);
  const urls = [];

  for (const file of files) {
    const relativePath = path.relative(BUILD_DIR, file).replace(/\\/g, '/');
    let urlPath = relativePath;

    // Convert index.html to trailing slash
    if (urlPath === 'index.html') {
      urlPath = '';
    } else if (urlPath.endsWith('/index.html')) {
      urlPath = urlPath.replace('/index.html', '/');
    }

    urls.push(`${DOMAIN}/${urlPath}`);
  }

  // Create XML
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
  </url>`
  )
  .join('\n')}
</urlset>`;

  fs.writeFileSync(SITEMAP_PATH, sitemapContent);
  console.log(`✅ Generated sitemap.xml with ${urls.length} pages`);
}

generateSitemap();
