function extractVideoId(block) {
  const PATTERN = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  for (const a of block.querySelectorAll('a')) {
    const m = (a.href || '').match(PATTERN);
    if (m) return m[1];
  }
  const m = (block.textContent || '').match(PATTERN);
  return m ? m[1] : '';
}

function extractImgSrc(block, videoId) {
  const firstRow = block.firstElementChild;
  if (firstRow) {
    const cells = [...firstRow.children];
    for (let i = 1; i < cells.length; i += 1) {
      const src = cells[i].querySelector('img')?.src;
      if (src) return src;
    }
  }
  for (let r = 1; r < block.children.length; r += 1) {
    const src = block.children[r].querySelector('img')?.src;
    if (src) return src;
  }
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
}

export default function decorate(block) {
  const videoId = extractVideoId(block);
  const textCell = block.firstElementChild?.firstElementChild;
  const imgSrc = extractImgSrc(block, videoId);

  // Background image on the whole block
  if (imgSrc) block.style.backgroundImage = `url("${imgSrc}")`;

  // Dark overlay over background
  const overlay = document.createElement('div');
  overlay.className = 'video-overlay';

  // Text content (left side)
  const textWrapper = document.createElement('div');
  textWrapper.className = 'video-text';
  if (textCell) {
    [...textCell.children].forEach((child) => textWrapper.append(child));
  }

  // Play area (right side)
  const playArea = document.createElement('div');
  playArea.className = 'video-play-area';

  const playBtn = document.createElement('button');
  playBtn.className = 'video-play-btn';
  playBtn.type = 'button';
  playBtn.setAttribute('aria-label', 'Reproducir vídeo');
  playBtn.innerHTML = '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    + '<circle cx="40" cy="40" r="40" fill="white" opacity="0.92"/>'
    + '<polygon points="31,21 31,59 63,40" fill="#0079c8"/>'
    + '</svg>';
  playArea.append(playBtn);

  block.replaceChildren(overlay, textWrapper, playArea);

  if (videoId) {
    const launch = () => {
      // Freeze block height before replacing content
      block.style.height = `${block.offsetHeight}px`;
      block.style.backgroundImage = '';

      const iframe = document.createElement('iframe');
      iframe.className = 'video-iframe';
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
      iframe.title = 'Vídeo YouTube';
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.setAttribute('allowfullscreen', '');

      block.replaceChildren(iframe);
    };

    playBtn.addEventListener('click', launch);
    overlay.addEventListener('click', launch);
  }
}
