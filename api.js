const API = 'https://api.funkinbackstage.com';

const FOOTER_LEFT = '© 2026 NebulaStellaNova — Fan-made, not affiliated with Newgrounds or The Funkin\' Crew, Inc.';
const FOOTER_RIGHT = '<a href="https://discord.gg/VNuGRjnqwP">Discord</a> • <a href="https://ko-fi.com/nebulastellanova">Donate</a>';

const FOOTER_LEFT_MOBILE = '© 2026 NebulaStellaNova';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.footer-left').forEach(el => {
    el.innerHTML = `<span class="footer-desktop">${FOOTER_LEFT}</span><span class="footer-mobile">${FOOTER_LEFT_MOBILE}</span>`;
  });
  document.querySelectorAll('.footer-right').forEach(el => el.innerHTML = FOOTER_RIGHT);
});
