# Project Card Preview Video Specs

Reference for adding/replacing the looping preview video in a Works project card
(`frontend/src/components/Works.tsx`).

## File type
- **MP4 / H.264** — universal browser support.
- Avoid shipping raw `.mov` — Safari-only, won't play in Chrome/Firefox.
- Strip the audio track (preview is muted) to save bytes.
- Provide a **poster JPG** (first frame) — paints instantly before the video loads.

## Perfect-fit size
- Card preview slot is **16:10** (`aspect-[16/10]`) with `object-cover`.
- Export at **16:10**:
  - **Minimum:** 840×525 (2× the ~420×262 CSS display size, for retina sharpness).
  - **Ideal:** 1280×800 (or 1440×900). Past ~1600×1000 is wasted bytes.
- Keep content **centered** — the card crops the left/right edges if the source is wider than 16:10.

## Encode commands (from a wide source)
```bash
# Crop to 16:10, scale to 1280x800, drop audio, web-optimized MP4
ffmpeg -y -i source.mov -vf "crop=<w>:<h>,scale=1280:800" -an \
  -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart \
  verta-preview.mp4

# Poster frame from the encoded MP4
ffmpeg -y -i verta-preview.mp4 -vframes 1 -q:v 3 verta-preview.jpg
```

## Wiring
- Add `video: '/your-preview.mp4'` (and `image: '/your-preview.jpg'` as poster) to the
  project entry in `BASE_PROJECTS`.
- The card renders `<video autoPlay muted loop playsInline preload="metadata">` when
  `video` is present; falls back to `image`, then a text placeholder.

## Reference: VERTA
- Source: 2816×1060 (2.66:1), 33.8 MB → cropped/scaled to 1280×800, 732 KB.
- Files live in `frontend/public/`: `verta-preview.mp4`, `verta-preview.jpg`.
