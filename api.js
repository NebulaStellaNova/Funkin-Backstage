const API = 'https://api.funkinbackstage.com';

const FOOTER_LEFT = '© 2026 NebulaStellaNova — Fan-made, not affiliated with Newgrounds or The Funkin\' Crew, Inc.';
const FOOTER_RIGHT = '<a href="https://discord.gg/VNuGRjnqwP">Discord</a> • <a href="https://ko-fi.com/nebulastellanova">Donate</a>';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.footer-left').forEach(el => el.innerHTML = FOOTER_LEFT);
  document.querySelectorAll('.footer-right').forEach(el => el.innerHTML = FOOTER_RIGHT);
});
