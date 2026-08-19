function toggleTick(img) {
    img.classList.toggle('selected');
    img.src = img.classList.contains('selected') ? 'assets/checkbox-filled.png' : 'assets/checkbox-empty.png';
}

function toggleBox(btn, boxId) {
    const box = document.getElementById(boxId);
    const isExpanding = !box.classList.contains('expanded');

    document.querySelectorAll('.mod-box.expanded').forEach(b => {
        b.classList.remove('expanded');
        b.style.height = '';
        b.querySelector('.dropdown-arrow').classList.remove('flipped');
    });

    if (isExpanding) {
        box.style.height = box.scrollHeight + 'px';
        box.classList.add('expanded');
        btn.classList.add('flipped');
    }
}