const fs = require('fs');
const path = require('path');

const GMB_DATA_URL = 'https://injin.entelico.com/gmb_data_elranchitogrowers.com.json';

async function run() {
    try {
        console.log('Fetching Google Reviews...');
        const res = await fetch(GMB_DATA_URL);
        const data = await res.json();
        
        const fiveStarReviews = data.recent_reviews.filter(r => r.starRating === 'FIVE' && r.comment && r.comment.length > 20).slice(0, 3);
        if (fiveStarReviews.length === 0) {
            console.log('No suitable 5-star reviews found.');
            return;
        }

        let reviewsHtml = `\n<section class="reviews-section" style="padding: 60px 20px; background: var(--bg-light); text-align: center;">\n  <div class="container" style="max-width: 1000px; margin: 0 auto;">\n    <h2 style="color: var(--green-900); font-size: 2rem; margin-bottom: 40px;">What Our Community Says</h2>\n    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px;">\n`;

        for (const review of fiveStarReviews) {
            reviewsHtml += `      <div style="background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); text-align: left;">\n        <div style="color: #fbbc04; font-size: 1.2rem; margin-bottom: 15px;">★★★★★</div>\n        <p style="font-size: 0.95rem; line-height: 1.6; color: #444; margin-bottom: 20px; font-style: italic;">"${review.comment}"</p>\n        <div style="font-weight: 600; color: var(--green-900);">— ${review.reviewer}</div>\n      </div>\n`;
        }

        reviewsHtml += `    </div>\n  </div>\n</section>\n`;

        const files = fs.readdirSync(__dirname, { withFileTypes: true });
        let patchedCount = 0;

        for (const file of files) {
            if (file.isDirectory() && file.name.includes('-in-')) {
                const indexPath = path.join(__dirname, file.name, 'index.html');
                if (fs.existsSync(indexPath)) {
                    let content = fs.readFileSync(indexPath, 'utf-8');
                    if (!content.includes('What Our Community Says')) {
                        content = content.replace('</main>\n  </div>\n</section>', `</main>\n  </div>\n</section>\n${reviewsHtml}`);
                        fs.writeFileSync(indexPath, content);
                        patchedCount++;
                    }
                }
            }
        }

        console.log(`Successfully injected reviews into ${patchedCount} localized pages.`);
    } catch (e) {
        console.error(e);
    }
}

run();
