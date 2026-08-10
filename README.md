# Habib Salon — 90s Ki Yaadein

Vintage 90s Hindi music website for GitHub Pages.

## Files
- index.html — website
- style.css — vintage design/animations
- script.js — working music player + live Hindi clock
- songs.js — your song library
- salon.jpg — the original uploaded salon image
- songs/ — put your MP3 files here

## Adding songs
Edit `songs.js` and add one object for every MP3.

Example:
{
  title: "Song Name",
  artist: "Artist",
  file: "songs/song-002.mp3",
  duration: "05:12"
}

The player supports 1000+ entries, but GitHub Pages/repository storage and bandwidth limits should be considered for a very large music collection. For a large public library, use an external object/CDN storage service for audio and keep the song metadata in this repository.

## GitHub Pages
Repository → Settings → Pages → Deploy from a branch → main → / (root) → Save.
