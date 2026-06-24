// ===== El Ranchito — Main JS =====

// Mobile nav toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
  });
  hamburger.addEventListener('keydown', e => { if (e.key === 'Enter') navLinks.classList.toggle('open'); });
}

// Scroll: shrink nav
const nav = document.getElementById('main-nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.style.height = window.scrollY > 60 ? '60px' : '72px';
    nav.style.boxShadow = window.scrollY > 60 ? '0 2px 30px rgba(0,0,0,0.3)' : '0 2px 20px rgba(0,0,0,0.2)';
  });
}

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// Contact form — POST to CRM API
const CRM_API = 'https://injin.entelico.com/api/leads';

async function handleSubmit(e) {
  e.preventDefault();
  const btn  = document.getElementById('submit-btn');
  const form = document.getElementById('contact-form');
  const data = Object.fromEntries(new FormData(form));

  if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }

  try {
    await fetch(CRM_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (_) { /* non-blocking — CRM may not be live yet */ }

  if (btn) {
    btn.textContent = '✅ Request Sent! We\'ll call you soon.';
    btn.style.background = '#4a9455';
  }
  setTimeout(() => {
    if (form) form.reset();
    if (btn) {
      btn.textContent = 'Send Custom Order Request 🌸';
      btn.style.background = '';
      btn.disabled = false;
    }
  }, 4000);
}

// Animate sections on scroll
const animEls = document.querySelectorAll('.cat-card, .review-card, .pricing-card, .occ-card');
animEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

// Small delay so DOM is settled, then observe
setTimeout(() => {
  animEls.forEach(el => observer.observe(el));
}, 120);

// Cookie Consent Banner
document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem('cookieConsent')) {
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:var(--green-dark);color:white;padding:1rem;text-align:center;z-index:9999;box-shadow:0 -2px 10px rgba(0,0,0,0.2);font-size:0.9rem;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;';
    
    const mediaQuery = window.matchMedia("(min-width: 600px)");
    if (mediaQuery.matches) {
      banner.style.flexDirection = 'row';
    }
    
    banner.innerHTML = `
      <p style="margin:0;">We use cookies to improve your experience and analyze site traffic. By continuing to use our site, you agree to our <a href="/cookie-policy.html" style="color:var(--gold-light);text-decoration:underline;">Cookie Policy</a> and <a href="/privacy-policy.html" style="color:var(--gold-light);text-decoration:underline;">Privacy Policy</a>.</p>
      <div style="display:flex;gap:10px;">
        <button id="accept-cookies" style="background:var(--gold-dark);border:none;padding:8px 16px;border-radius:4px;color:white;font-weight:bold;cursor:pointer;transition:opacity 0.2s;">Accept All</button>
      </div>
    `;
    
    document.body.appendChild(banner);
    
    const acceptBtn = document.getElementById('accept-cookies');
    acceptBtn.addEventListener('mouseover', () => acceptBtn.style.opacity = '0.9');
    acceptBtn.addEventListener('mouseout', () => acceptBtn.style.opacity = '1');
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      banner.remove();
    });
  }
});

