const API = 'https://api.funkinbackstage.com';

const FOOTER_LEFT = '© 2026 Backstage Crew — Fan-made, not affiliated with Newgrounds or The Funkin\' Crew, Inc.';
const FOOTER_RIGHT = '<a href="https://discord.gg/VNuGRjnqwP">Discord</a> • <a href="https://ko-fi.com/nebulastellanova">Donate</a>';

const FOOTER_LEFT_MOBILE = '© 2026 Backstage Crew';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.footer-left').forEach(el => {
    el.innerHTML = `<span class="footer-desktop">${FOOTER_LEFT}</span><span class="footer-mobile">${FOOTER_LEFT_MOBILE}</span>`;
  });
  document.querySelectorAll('.footer-right').forEach(el => el.innerHTML = FOOTER_RIGHT);

  const path = window.location.pathname;
  const isRoot = path === '/' || path === '/index.html';
  if (!isRoot) {
    const depth = path.split('/').filter(Boolean).length;
    const prefix = depth > 0 ? '../'.repeat(depth) : '';
    const btn = document.createElement('a');
    btn.href = '/';
    btn.id = 'home-btn';
    btn.style.cssText = 'position:fixed;right:0;top:50%;transform:translateY(-50%);z-index:9999;display:block;opacity:0.25;transition:opacity 0.2s,transform 0.2s;';
    const img = document.createElement('img');
    img.draggable = false;
    img.src = `https://files.funkinbackstage.com/home_button.png`;
    img.alt = 'Home';
    img.draggable = false;
    img.style.cssText = 'height:10rem;display:block;';
    if (window.innerWidth <= 768) img.style.height = '5rem';
    btn.appendChild(img);
    btn.style.transformOrigin = 'right center';
    btn.addEventListener('mouseenter', () => { btn.style.opacity = '1'; btn.style.transform = 'translateY(-50%) scale(1.08)'; });
    btn.addEventListener('mouseleave', () => { btn.style.opacity = '0.25'; btn.style.transform = 'translateY(-50%)'; });
    document.body.appendChild(btn);
  }
});
