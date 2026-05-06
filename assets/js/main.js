// ===== El Ranchito — Main JS =====

// Mobile nav toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
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

// Contact form handler
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const form = document.getElementById('contact-form');
  if (btn) {
    btn.textContent = '✅ Request Sent! We\'ll call you soon.';
    btn.style.background = '#4a9455';
    btn.disabled = true;
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
