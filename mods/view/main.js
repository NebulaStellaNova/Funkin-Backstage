var thumbnails = [];
var curThumbnail = 0;
var activeSlot = 'a';

function isVideo(url) {
    return /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url);
}

function setSlot(slotId, url) {
    const slot = document.getElementById(slotId);
    if (isVideo(url)) {
        slot.innerHTML = `<video src="${url}" loop muted playsinline style="width:100%;height:100%;object-fit:contain;"></video>`;
        const vid = slot.querySelector('video');
        vid.volume = 0.5;
        vid.play().catch(() => { });
    } else {
        slot.innerHTML = `<img src="${url}" style="width:100%;height:100%;object-fit:contain;">`;
    }
}

function fmtNum(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(n);
}

async function populateData() {
    const meta = await fetch(`${API}/submissions/${modId}/meta.json`).then(r => r.json());
    const user = await fetch(`${API}/users/${meta.submitter}`).then(r => r.json());
    document.title = "Funkin' Backstage | " + meta.title;
    document.getElementById('title-text').textContent = meta.title;
    document.getElementById('author-text').textContent = `• ${user.username}`;
    document.getElementById('mod-description').innerHTML = meta.description.replace(/\n/g, "<br>");
    setSlot('thumbnail-a', meta.thumbnails[0]);

    thumbnails = meta.thumbnails;
    for (const thumb of thumbnails)
        if (!isVideo(thumb)) { const i = new Image(); i.src = thumb; }
    updateVideoControls();

    for (const dlData of meta.dls) {
        console.log(dlData);
        document.getElementById("downloads-box").innerHTML += `<div style="display: flex; gap: 0.5vw; align-items: center;">
						<img class="download-button" style="width: 5vh; height: 5vh" src="https://funkinbackstage.com/mods/view/icon-download.png" onclick="window.open('${dlData.url}', '_blank')"/>
						<a style="font-size: 6vh">v${dlData.version}</a>
					</div>`;
    }

    const token = localStorage.getItem('token');
    let isLiked = false;
    if (token) {
        const meRes = await fetch(`${API}/me`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({})
        });
        if (meRes.ok) {
            const me = await meRes.json();
            isLiked = (me.likedSubmissions ?? []).includes(modId);
        }
    }
    const likeIcon = isLiked ? BASE + 'icon-like-filled.png' : BASE + 'icon-like-empty.png';
    document.getElementById('like-box').innerHTML = `<div style="display: flex; gap: 0.5vw; align-items: center;">
					<img draggable="false" id="like-icon" style="width: 5vh; height: 5vh" src="${likeIcon}"/>
					<a id="like-count" style="font-size: 6vh">${fmtNum(meta.likes ?? 0)}</a>
				</div>`;

    document.getElementById('category-text').textContent = "Category";
    document.getElementById('engine-text').textContent = `${meta.parent.replace('-', ' ')} - ${meta.child.replace('-', ' ')}`;
}
populateData();

async function toggleLike() {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/login'; return; }
    const res = await fetch(`${API}/submissions/${modId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return;
    const data = await res.json();
    document.getElementById('like-icon').src = data.liked ? BASE + 'icon-like-filled.png' : BASE + 'icon-like-empty.png';
    document.getElementById('like-count').textContent = fmtNum(data.likes);
}

function getActiveVideo() {
    return document.querySelector('#thumbnail-' + activeSlot + ' video');
}

const BASE = 'https://funkinbackstage.com/mods/view/';

function updateVideoControls() {
    const isVid = thumbnails.length > 0 && isVideo(thumbnails[curThumbnail]);
    const ctrl = document.getElementById('video-controls');
    ctrl.style.display = isVid ? 'flex' : 'none';
    if (isVid) {
        document.getElementById('btn-play').src = BASE + 'icon-playing.png';
        document.getElementById('btn-mute').src = BASE + 'icon-muted.png';
    }
}

function toggleVideoPlay() {
    const v = getActiveVideo();
    if (!v) return;
    if (v.paused) { v.play(); document.getElementById('btn-play').src = BASE + 'icon-playing.png'; }
    else { v.pause(); document.getElementById('btn-play').src = BASE + 'icon-paused.png'; }
}

function toggleVideoMute() {
    const v = getActiveVideo();
    if (!v) return;
    v.muted = !v.muted;
    document.getElementById('btn-mute').src = BASE + (v.muted ? 'icon-muted.png' : 'icon-ummuted.png');
}

function scrollThumbnail(amt) {
    curThumbnail += amt;
    if (curThumbnail < 0) curThumbnail = thumbnails.length - 1;
    else if (curThumbnail > thumbnails.length - 1) curThumbnail = 0;

    const incoming = activeSlot === 'a' ? 'b' : 'a';
    const outgoing = activeSlot;

    const outgoingVideo = document.querySelector('#thumbnail-' + outgoing + ' video');
    if (outgoingVideo) { outgoingVideo.pause(); outgoingVideo.muted = true; }

    setSlot('thumbnail-' + incoming, thumbnails[curThumbnail]);
    document.getElementById('thumbnail-' + incoming).style.opacity = '1';
    document.getElementById('thumbnail-' + outgoing).style.opacity = '0';
    activeSlot = incoming;
    updateVideoControls();
}