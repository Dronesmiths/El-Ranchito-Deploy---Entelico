const fs = require('fs');
const path = require('path');

function capitalizeWords(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

async function run() {
    const files = fs.readdirSync(__dirname, { withFileTypes: true });
    let patchedCount = 0;

    // 1. Mobile Sticky CSS
    const cssInject = `
<style>
  .mobile-sticky-cta { display: none; }
  @media (max-width: 768px) {
    .mobile-sticky-cta {
      display: flex;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: var(--green-900, #1a3d1f);
      color: #fff;
      padding: 15px 20px;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      box-shadow: 0 -4px 15px rgba(0,0,0,0.1);
      text-decoration: none;
      font-weight: 600;
      font-size: 1.1rem;
      letter-spacing: 0.5px;
    }
    .mobile-sticky-cta svg { margin-right: 10px; }
  }
</style>
`;

    const stickyCTA = `
<a href="tel:+18186127515" class="mobile-sticky-cta">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.74a16 16 0 0 0 6.35 6.35l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
  Call Now: (818) 612-7515
</a>
`;

    // 3. Trust Badges HTML
    const trustBadges = `
<div class="trust-badges" style="display: flex; flex-wrap: wrap; gap: 15px; margin: 25px 0; padding: 20px; background: #f8fcf9; border: 1px solid #e2f0e6; border-radius: 8px; justify-content: space-around;">
  <div style="display: flex; align-items: center; gap: 8px; color: var(--green-900); font-weight: 600; font-size: 0.95rem;"><span style="font-size: 1.3rem;">🛡️</span> 100% Satisfaction</div>
  <div style="display: flex; align-items: center; gap: 8px; color: var(--green-900); font-weight: 600; font-size: 0.95rem;"><span style="font-size: 1.3rem;">🚚</span> Same-Day Delivery</div>
  <div style="display: flex; align-items: center; gap: 8px; color: var(--green-900); font-weight: 600; font-size: 0.95rem;"><span style="font-size: 1.3rem;">🌿</span> Fresh Cut Daily</div>
</div>
`;

    // 4. Author Bio HTML
    const authorBio = `
<div class="author-bio" style="margin-top: 40px; padding: 30px; background: #fdfdfd; border-top: 3px solid var(--gold, #d4af37); border-radius: 0 0 12px 12px; display: flex; align-items: center; gap: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
  <img src="/assets/img/logo-color.webp" alt="Diego - Flowers El Ranchito" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid var(--gold-light, #f2e2a9);">
  <div>
    <h3 style="margin: 0 0 8px; font-size: 1.2rem; color: var(--green-900);">Diego at Flowers El Ranchito</h3>
    <p style="margin: 0; font-size: 0.95rem; line-height: 1.5; color: #555;">Diego has been hand-crafting premium floral arrangements for the San Fernando Valley for years, ensuring every bouquet brings joy and beauty to any occasion.</p>
  </div>
</div>
`;

    for (const file of files) {
        if (file.isDirectory() && file.name.includes('-in-')) {
            const indexPath = path.join(__dirname, file.name, 'index.html');
            if (fs.existsSync(indexPath)) {
                let content = fs.readFileSync(indexPath, 'utf-8');
                let modified = false;

                // Extract location from directory name
                const parts = file.name.split('-in-');
                const locSlug = parts[1]; // e.g. 'burbank'
                const locName = capitalizeWords(locSlug.replace(/-/g, ' '));

                // 1. Inject Trust Badges after the first <p> in article-content (or just after the <h2>)
                if (!content.includes('trust-badges')) {
                    const h2Match = content.match(/<h2[^>]*>.*?<\/h2>/);
                    if (h2Match) {
                        content = content.replace(h2Match[0], `${h2Match[0]}\n${trustBadges}`);
                        modified = true;
                    }
                }

                // 2. Inject Author Bio right before </main>
                if (!content.includes('author-bio')) {
                    content = content.replace('</main>', `${authorBio}\n</main>`);
                    modified = true;
                }

                // 3. Inject Google Map right after </main> </div> </section> but before the reviews
                if (!content.includes('local-map-section')) {
                    const mapHtml = `
<section class="local-map-section" style="padding: 40px 20px; background: #fff;">
  <div class="container" style="max-width: 1000px; margin: 0 auto; text-align: center;">
    <h2 style="color: var(--green-900); font-size: 1.8rem; margin-bottom: 25px;">Proudly Serving ${locName}, CA</h2>
    <iframe 
      title="Map of ${locName}" 
      src="https://maps.google.com/maps?q=${encodeURIComponent(locName + ', CA')}&t=m&z=13&output=embed&iwloc=near"
      width="100%" 
      height="400" 
      style="border:0; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08);"
      allowfullscreen="" 
      loading="lazy">
    </iframe>
  </div>
</section>
`;
                    // We inject map right before the Reviews section
                    if (content.includes('<section class="reviews-section"')) {
                        content = content.replace('<section class="reviews-section"', `${mapHtml}\n<section class="reviews-section"`);
                        modified = true;
                    } else {
                        // fallback if reviews aren't there
                        content = content.replace('</main>\n  </div>\n</section>', `</main>\n  </div>\n</section>\n${mapHtml}`);
                        modified = true;
                    }
                }

                // 4. Inject Sticky CTA and CSS before </body>
                if (!content.includes('mobile-sticky-cta')) {
                    content = content.replace('</body>', `${cssInject}\n${stickyCTA}\n</body>`);
                    modified = true;
                }

                if (modified) {
                    fs.writeFileSync(indexPath, content);
                    patchedCount++;
                }
            }
        }
    }

    console.log(`Successfully injected UI enhancements into ${patchedCount} localized pages.`);
}

run();
