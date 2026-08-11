const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const songList = document.getElementById("songList");
const songCount = document.getElementById("songCount");
const search = document.getElementById("search");
const emptyState = document.getElementById("emptyState");
const enterBtn = document.getElementById("enterBtn");

let currentIndex = 0;
let filteredIndexes = [];
let isSeeking = false;

/* =========================
   LIVE CLOCK
========================= */

const months = [
  "जनवरी",
  "फ़रवरी",
  "मार्च",
  "अप्रैल",
  "मई",
  "जून",
  "जुलाई",
  "अगस्त",
  "सितंबर",
  "अक्टूबर",
  "नवंबर",
  "दिसंबर"
];

const days = [
  "रविवार",
  "सोमवार",
  "मंगलवार",
  "बुधवार",
  "गुरुवार",
  "शुक्रवार",
  "शनिवार"
];

function updateClock() {
  const now = new Date();

  document.getElementById("liveDate").textContent =
    `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;

  let hours = now.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  document.getElementById("liveTime").textContent =
    `${String(hours).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")} ${ampm}`;

  document.getElementById("liveYear").textContent =
    now.getFullYear();
}

updateClock();
setInterval(updateClock, 1000);


/* =========================
   TIME FORMAT
========================= */

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "00:00";

  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);

  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}


/* =========================
   SONG LIST
========================= */

function renderList(query = "") {

  const q = query.trim().toLowerCase();

  filteredIndexes = songs
    .map((song, i) => ({ song, i }))
    .filter(({ song }) =>
      `${song.title} ${song.artist}`
        .toLowerCase()
        .includes(q)
    )
    .map(({ i }) => i);

  songList.innerHTML = "";

  emptyState.hidden = filteredIndexes.length !== 0;

  songCount.textContent = `${songs.length} गाने`;

  filteredIndexes.forEach((index, position) => {

    const song = songs[index];

    const item = document.createElement("div");

    item.className =
      `song-item ${index === currentIndex ? "active" : ""}`;

    item.dataset.index = index;

    item.innerHTML = `
      <div class="song-number">${position + 1}</div>

      <div>
        <div class="song-name">
          ${escapeHtml(song.title)}
        </div>

        <div class="song-artist">
          ${escapeHtml(song.artist || "Unknown Artist")}
        </div>
      </div>

      <div class="song-duration">
        ${song.duration || "--:--"}
      </div>
    `;

    item.addEventListener("click", () => {
      loadSong(index, true);
    });

    songList.appendChild(item);
  });
}


/* =========================
   SECURITY / TEXT
========================= */

function escapeHtml(text) {

  return String(text).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[c]));

}


/* =========================
   LOAD SONG
========================= */

function loadSong(index, autoplay = false) {

  if (!songs.length) return;

  currentIndex =
    (index + songs.length) % songs.length;

  const song = songs[currentIndex];

  audio.src =
    "./" +
    song.file
      .split("/")
      .map(encodeURIComponent)
      .join("/");

  audio.load();

  songTitle.textContent = song.title;

  songArtist.textContent =
    song.artist || "Unknown Artist";

  progress.value = 0;

  currentTimeEl.textContent = "00:00";

  durationEl.textContent =
    song.duration || "00:00";

  renderList(search.value);

  if (autoplay) {

    audio.play()
      .then(updatePlayUI)
      .catch(() => updatePlayUI());

  } else {

    updatePlayUI();

  }
}


/* =========================
   PLAY UI
========================= */

function updatePlayUI() {

  const playing = !audio.paused;

  playBtn.textContent =
    playing ? "❚❚" : "▶";

  playBtn.title =
    playing ? "Pause" : "Play";
}


/* =========================
   PLAY / PAUSE
========================= */

playBtn.addEventListener("click", () => {

  if (!audio.src) {
    loadSong(currentIndex, false);
  }

  if (audio.paused) {

    audio.play()
      .catch(error => {
        console.log("Audio play error:", error);
      });

  } else {

    audio.pause();

  }

  updatePlayUI();

});


/* =========================
   PREVIOUS
========================= */

prevBtn.addEventListener("click", () => {

  loadSong(currentIndex - 1, true);

});


/* =========================
   NEXT
========================= */

nextBtn.addEventListener("click", () => {

  loadSong(currentIndex + 1, true);

});


/* =========================
   AUDIO EVENTS
========================= */

audio.addEventListener("play", updatePlayUI);

audio.addEventListener("pause", updatePlayUI);

audio.addEventListener("loadedmetadata", () => {

  durationEl.textContent =
    formatTime(audio.duration);

});

audio.addEventListener("timeupdate", () => {

  if (
    !isSeeking &&
    Number.isFinite(audio.duration) &&
    audio.duration > 0
  ) {

    progress.value =
      (audio.currentTime / audio.duration) * 100;

  }

  currentTimeEl.textContent =
    formatTime(audio.currentTime);

});


/* =========================
   AUTO NEXT SONG
========================= */

audio.addEventListener("ended", () => {

  loadSong(currentIndex + 1, true);

});


/* =========================
   PROGRESS BAR
========================= */

progress.addEventListener("input", () => {

  isSeeking = true;

  if (Number.isFinite(audio.duration)) {

    audio.currentTime =
      (Number(progress.value) / 100) *
      audio.duration;

  }

});

progress.addEventListener("change", () => {

  isSeeking = false;

});


/* =========================
   VOLUME
========================= */

volume.addEventListener("input", () => {

  audio.volume =
    Number(volume.value);

});

audio.volume =
  Number(volume.value);


/* =========================
   SEARCH
========================= */

search.addEventListener("input", () => {

  renderList(search.value);

});


/* =========================
   ENTER BUTTON
========================= */

enterBtn.addEventListener("click", () => {

  document
    .getElementById("music")
    .scrollIntoView({
      behavior: "smooth"
    });

});


/* =========================
   START
========================= */

renderList();

if (songs.length) {
  loadSong(0, false);
}
