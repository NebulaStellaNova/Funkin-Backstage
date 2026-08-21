
var sortMethod = "activity";
var engineFilter = "any";
var categoryFilter = "any";

var featuredFilter = false;
var likedFilter = false;
var filterCount = 0;

function toggleLikedFilter() {
    likedFilter = !likedFilter;
    reloadModList();
    if (likedFilter) filterCount ++;
    else filterCount --;
    document.getElementById("filter-text").textContent = 'FILTERS - ' + filterCount;
}

function toggleFeaturedFilter() {
    featuredFilter = !featuredFilter;
    reloadModList();
    if (featuredFilter) filterCount ++;
    else filterCount --;
    document.getElementById("filter-text").textContent = 'FILTERS - ' + filterCount;
}

function changeSort(element) {
    sortMethod = `${element.textContent}`.toLowerCase();
    document.getElementById("sort-text").textContent = " SORT - " + sortMethod;
    reloadModList();
    toggleBox(document.getElementById('sort-arrow'), 'mod-box-sort');
}

function changeEngineFilter(element) {
    engineFilter = `${element.textContent}`.toLowerCase();
    document.getElementById("engine-text").textContent = "ENGINE - " + engineFilter;
    engineFilter = engineFilter.replace(' ', '-');
    reloadModList();
    toggleBox(document.getElementById('engine-arrow'), 'mod-box-2');
}

function changeCategoryFilter(element) {
    categoryFilter = `${element.textContent}`.toLowerCase();
    document.getElementById("category-text").textContent = "CATEGORY - " + categoryFilter;
    categoryFilter = categoryFilter.replace(' ', '-');
    reloadModList();
    toggleBox(document.getElementById('category-arrow'), 'mod-box-1');
}

function fmtNum(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(n);
}

function relTime(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 3600) return Math.max(1, Math.floor(s / 60)) + 'm';
    if (s < 86400) return Math.floor(s / 3600) + 'h';
    if (s < 2592000) return Math.floor(s / 86400) + 'd';
    if (s < 31536000) return Math.floor(s / 2592000) + 'mo';
    return Math.floor(s / 31536000) + 'y';
}

async function toggleLike(id, pieceEl) {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '../login'; return; }
    const res = await fetch(`${API}/submissions/${id}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return;
    const data = await res.json();
    pieceEl.querySelector('img').src = data.liked ? 'assets/icon-heart-filled.png' : 'assets/icon-heart.png';
    pieceEl.querySelector('h1').textContent = fmtNum(data.likes);
}

async function reloadModList() {
    const token = localStorage.getItem('token');
    let likedSubmissions = [];
    if (token) {
        const meRes = await fetch(`${API}/me`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({})
        });
        if (meRes.ok) likedSubmissions = (await meRes.json()).likedSubmissions ?? [];
    }

    const files = await fetch(`${API}/submissions`).then(r => r.json()).catch(() => []);
    if (!files.length) return;
    var filesArray = Array.from(files);
    var modDatas = [];
    for (const id of files) {
        const meta = await fetch(`${API}/submissions/${id}/meta.json`).then(r => r.json());
        if (!meta.live) continue;
        meta.storageID = id;
        modDatas.push(meta);
    }

    if (engineFilter != "any") {
        modDatas = modDatas.filter(_ => { return _.parent == engineFilter });
    }
    if (categoryFilter != "any") {
        modDatas = modDatas.filter(_ => { return _.child == categoryFilter });
    }

    switch (sortMethod) {
        case "activity":
            modDatas.sort((a, b) => {
                const aDate = new Date(a.updateDate || a.uploadDate);
                const bDate = new Date(b.updateDate || b.uploadDate);
                return bDate - aDate;
            });
            break;
        case "downloads":
            modDatas.sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0));
            break;
        case "likes":
            modDatas.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
            break;
        case "views":
            modDatas.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
            break;
        case "date added":
            modDatas.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
            break;
    }

    var htmlOut = "";
    const parentElement = document.getElementById("mod-grid");

    for (const meta of modDatas) {
        if (featuredFilter && meta.stars == 0) continue;
        const id = meta.storageID;
        const isLiked = likedSubmissions.includes(id);
        if (likedFilter && !isLiked) continue;
        const heartIcon = isLiked ? 'assets/icon-heart-filled.png' : 'assets/icon-heart.png';
        htmlOut += `
            <div class="mod-card">
                <img draggable="false" src="${meta.thumbnails[0]}" class="mod-thumbnail">
                <img draggable="false" src="${API}/avatars/${meta.submitter}.png" class="mod-topleft">
                <img draggable="false" src="assets/mod capsule.png" class="mod-capsule">
                <div class="mod-label">
                    <h1 style="font-size: 3vh;">${meta.title}</h1>
                    <h1 style="font-size: 2vh; color: #C7C7C7;">${meta.blurb}</h1>
                </div>
                <div class="mod-footer">
                    <div class="mod-footer-left">
                        <div class="footer-piece">
                            <img draggable="false" src="assets/icon-download.png" style="height: 1.8vh;">
                            <h1 style="font-size: 2vh;">${fmtNum(meta.downloads ?? 0)}</h1>
                        </div>
                        <div class="footer-piece" style="cursor: ${token ? 'pointer' : 'default'};" onclick="toggleLike('${id}', this)">
                            <img draggable="false" src="${heartIcon}" style="height: 1.8vh;">
                            <h1 style="font-size: 2vh;">${fmtNum(meta.likes ?? 0)}</h1>
                        </div>
                        <div class="footer-piece">
                            <img draggable="false" src="assets/icon-views.png" style="height: 1.8vh;">
                            <h1 style="font-size: 2vh;">${fmtNum(meta.views ?? 0)}</h1>
                        </div>
                    </div>
                    <div class="mod-footer-right">
                        ${meta.stars > 0 ? `
                        <div class="footer-piece">
                            <img draggable="false" src="assets/icon-featured.png" style="height: 1.8vh;">
                            <h1 style="font-size: 2vh;">FEATURED</h1>
                        </div>` : ``}
                        ${meta.updateDate == "" ? `
                        <div class="footer-piece">
                            <img draggable="false" src="assets/icon-plus.png" style="height: 1.8vh;">
                            <h1 style="font-size: 2vh;">${relTime(meta.uploadDate)}</h1>
                        </div>` : `
                        <div class="footer-piece">
                            <img draggable="false" src="assets/icon-updated.png" style="height: 1.8vh;">
                            <h1 style="font-size: 2vh;">${relTime(meta.updateDate)}</h1>
                        </div>`}
                    </div>
                </div>
            </div>
        `;
    }
    parentElement.innerHTML = htmlOut;
}
reloadModList();


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