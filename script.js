const app = document.getElementById('app');
const config = window.anniversaryConfig;
if (!config) throw new Error('Customer settings were not loaded. Check config.js.');
let typingTimer;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function formatDate(value) {
  if (!value) return '';
  const dateParts = value.split('-').map(Number);
  if (dateParts.length !== 3 || dateParts.some(part => !Number.isFinite(part))) {
    throw new Error(`Invalid date in config.js: ${value}`);
  }
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2])));
}

function setupMusic() {
  const audio = document.getElementById('anniversary-music');
  const button = document.getElementById('music-toggle');
  const status = document.getElementById('music-status');
  audio.src = config.music.src;
  button.setAttribute('aria-label', config.music.title);
  button.addEventListener('click', async () => {
    if (audio.paused) {
      try {
        await audio.play();
        button.textContent = '♫ Pause music';
        button.setAttribute('aria-label', 'Pause anniversary music');
        button.setAttribute('aria-pressed', 'true');
        status.textContent = '';
      } catch (error) {
        status.textContent = 'Music could not be played. Open the page through a local web server and check the music path in config.js.';
        console.error('Unable to play anniversary music.', error);
      }
    } else {
      audio.pause();
      button.textContent = '♫ Play music';
      button.setAttribute('aria-label', config.music.title);
      button.setAttribute('aria-pressed', 'false');
    }
  });
  audio.addEventListener('error', () => {
    status.textContent = 'Music could not be loaded. Open the page through a local web server and check the music path in config.js.';
  });
}

function addAmbientPetals() {
  const field = document.createElement('div');
  field.className = 'ambient-petals';
  field.setAttribute('aria-hidden', 'true');
  for (let index = 0; index < 24; index += 1) {
    const particle = document.createElement('span');
    const isHeart = index % 3 === 0;
    const size = 9 + Math.random() * 13;
    particle.className = `ambient-particle ${isHeart ? 'ambient-heart' : 'ambient-petal'}`;
    particle.textContent = isHeart ? '♥' : '';
    particle.style.setProperty('--x', `${Math.random() * 100}%`);
    particle.style.setProperty('--y', `${Math.random() * 100}%`);
    particle.style.setProperty('--drift', `${Math.round(Math.random() * 100 - 50)}px`);
    particle.style.setProperty('--backdrift', `${Math.round(Math.random() * 40 - 20)}px`);
    particle.style.setProperty('--turn', `${Math.round(Math.random() * 300 - 150)}deg`);
    particle.style.setProperty('--duration', `${12 + Math.random() * 13}s`);
    particle.style.setProperty('--delay', `${-Math.random() * 22}s`);
    particle.style.setProperty('--size', `${size}px`);
    particle.style.setProperty('--petal-height', `${size * 1.35}px`);
    field.appendChild(particle);
  }
  document.querySelector('.bg').prepend(field);
}

function celebrationBurst(target, type = 'sides') {
  const scene = target.closest('.card');
  const sceneBounds = scene.getBoundingClientRect();
  const targetBounds = target.getBoundingClientRect();
  const burst = document.createElement('div');
  burst.className = `celebration-burst celebration-burst-${type}`;
  burst.setAttribute('aria-hidden', 'true');
  burst.style.left = '0';
  burst.style.top = '0';
  const pieceCount = 32;
  for (let index = 0; index < pieceCount; index += 1) {
    const piece = document.createElement('span');
    const side = index % 2 === 0 ? -1 : 1;
    const originX = side < 0
      ? targetBounds.left - sceneBounds.left - 8
      : targetBounds.right - sceneBounds.left + 8;
    piece.className = `burst-piece ${index % 3 === 0 ? 'burst-heart' : 'burst-petal'}`;
    piece.textContent = index % 3 === 0 ? '♥' : '';
    piece.style.left = `${originX}px`;
    piece.style.top = `${targetBounds.top + targetBounds.height / 2 - sceneBounds.top}px`;
    piece.style.setProperty('--dx', `${side * (35 + Math.random() * 90)}px`);
    piece.style.setProperty('--dy', `${Math.round(Math.random() * 100 - 50)}px`);
    piece.style.setProperty('--spin', `${Math.round(Math.random() * 500 - 250)}deg`);
    piece.style.setProperty('--delay', `${Math.random() * 100}ms`);
    piece.style.setProperty('--size', `${10 + Math.random() * 11}px`);
    burst.appendChild(piece);
  }
  scene.appendChild(burst);
  window.setTimeout(() => burst.remove(), 1400);
}

function card(content, sticker = '💐', heart = '💗', classes = '') {
  app.innerHTML = `<section class="card ${classes}"><div class="seal"><img class="seal-logo" src="openwithlove-logo.png" alt="OpenWithLove"></div><div class="tape"></div><div class="sticker" aria-hidden="true">${sticker}</div><div class="heart" aria-hidden="true">${heart}</div>${content}</section>`;
}

function home() {
  const anniversaryDate = formatDate(config.anniversaryDate);
  const relationshipStartDate = formatDate(config.relationshipStartDate);
  const dates = [relationshipStartDate && `Since ${relationshipStartDate}`, anniversaryDate].filter(Boolean).join(' · ');
  card(`<div class="theater-curtains" aria-hidden="true"><div class="theater-backdrop"></div><div class="theater-valance"></div><div class="curtain-panel theater-panel-left"></div><div class="curtain-panel theater-panel-right"></div></div><button class="curtain-trigger" type="button" onclick="openCurtains(this)">Tap to reveal your surprise <span aria-hidden="true">♥</span></button><div class="reveal-content"><div class="bouquet" aria-hidden="true">💐</div><p class="eyebrow">A little moment, made just for you</p><h1>Happy Anniversary,<br>${escapeHtml(config.partnerName)}! <span aria-label="heart eyes">😍</span></h1><p class="sub">${escapeHtml(config.greeting)}</p><p class="anniversary-dates">${escapeHtml(dates)}</p><button class="btn" type="button" onclick="showEnvelope()">Continue the surprise <span aria-hidden="true">♥</span></button></div>`, '🌹', '💞', 'reveal-card');
}

function openCurtains(button) {
  const scene = button.closest('.card');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  scene.classList.add('curtains-opening');
  button.disabled = true;
  button.setAttribute('aria-label', 'Revealing your anniversary surprise');
  window.setTimeout(() => {
    const heading = scene.querySelector('.reveal-content h1');
    if (heading && heading.isConnected) celebrationBurst(heading, 'curtain');
  }, reducedMotion ? 0 : 1800);
}

function showEnvelope() {
  card(`<div class="envelope-copy"><p class="eyebrow">A little note for you</p><h2>Sealed with all my love</h2></div><button class="envelope-button" type="button" onclick="openLetter(this)" aria-label="Open your anniversary letter"><span class="envelope" aria-hidden="true"><span class="envelope-paper"><span class="paper-preview">With love</span></span><span class="envelope-flap"></span><span class="envelope-front"></span><span class="envelope-seal">♥</span></span><span class="envelope-hint">Tap to open your letter</span></button><article id="letter-sheet" class="letter-sheet" aria-hidden="true"><p class="eyebrow">Written with all my love</p><h2>To ${escapeHtml(config.partnerName)}</h2><div id="typed-letter" class="letter typed-letter" aria-live="polite"></div><button id="letter-next" class="btn hidden" type="button" onclick="showPhoto()">Keep going <span aria-hidden="true">♥</span></button></article>`, '💌', '💗', 'envelope-card');
}

function openLetter(button) {
  button.classList.add('is-opening');
  button.disabled = true;
  const scene = button.closest('.card');
  const sheet = scene.querySelector('#letter-sheet');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  scene.classList.add('letter-revealed');
  sheet.setAttribute('aria-hidden', 'false');
  window.setTimeout(() => {
    const heading = sheet.querySelector('h2');
    if (heading && heading.isConnected) celebrationBurst(heading, 'letter');
  }, reducedMotion ? 0 : 1100);
  window.setTimeout(typeLetter, reducedMotion ? 120 : 850);
}

function typeLetter() {
  const letter = `Dear ${config.partnerName},\n\n${config.letter.join('\n\n')}\n\n${config.letterSignoff},\n${config.senderName} ♥`;
  const output = document.getElementById('typed-letter');
  let index = 0;
  clearInterval(typingTimer);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    output.textContent = letter;
    document.getElementById('letter-next').classList.remove('hidden');
    return;
  }
  typingTimer = setInterval(() => {
    output.textContent += letter[index];
    index += 1;
    if (index >= letter.length) {
      clearInterval(typingTimer);
      document.getElementById('letter-next').classList.remove('hidden');
    }
  }, 34);
}

function showPhoto() {
  clearInterval(typingTimer);
  const photo = config.featuredPhoto;
  card(`<p class="eyebrow">My favorite memories have you in them</p><h2>Our little corner of forever</h2><figure class="photo-frame"><img class="photo-preview" src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.alt)}"></figure><p class="tagline">${escapeHtml(config.tagline)}</p><button class="btn" type="button" onclick="showQuestion()">One more thing… <span aria-hidden="true">♥</span></button>`, '📸', '💗', 'photo-card');
}

function showQuestion() {
  card(`<p class="eyebrow">One question, and my whole heart</p><h2 class="forever-question">${escapeHtml(config.question)}</h2><div class="forever-actions"><button class="btn" type="button" onclick="showFinal()">${escapeHtml(config.yesButton)} <span aria-hidden="true">♥</span></button><button class="btn no-btn" type="button" onclick="howDareYou()">No 😈</button></div>`, '🥰', '💗', 'question-card');
}

function howDareYou() {
  card(`<div class="how-dare-icon" aria-hidden="true">🥺</div><h2>How dare you?!</h2><p class="sub">That button must be broken… because we're obviously meant to be! 💕</p><button class="btn" type="button" onclick="showQuestion()">Let me try again <span aria-hidden="true">♥</span></button>`, '😼', '💗', 'how-dare-card');
}

function showFinal() {
  const photo = `<img class="final-photo" src="${escapeHtml(config.featuredPhoto.src)}" alt="${escapeHtml(config.featuredPhoto.alt)}">`;
  const keepsake = `<figure class="final-keepsake">${photo}<figcaption>${escapeHtml(config.photoCaption)}</figcaption></figure>`;
  const anniversaryDate = formatDate(config.anniversaryDate);
  card(`<div class="final-confetti" aria-hidden="true"><span>✦</span><span>♥</span><span>✧</span><span>♥</span><span>✦</span></div><div class="final-bouquet" aria-hidden="true">💐</div><p class="final-ribbon">A toast to us <span aria-hidden="true">♥</span></p><p class="eyebrow">My favorite story is ours</p><h1>Happy Anniversary,<br>${escapeHtml(config.partnerName)}</h1>${keepsake}<p class="anniversary-dates">${escapeHtml(anniversaryDate)}</p><p class="final-love">I love you endlessly <span aria-label="heart">♥</span></p><div class="final-promise"><span aria-hidden="true">✦</span> &nbsp; Still choosing you, today and always &nbsp; <span aria-hidden="true">✦</span></div><div class="final-sparkles" aria-hidden="true">✨ &nbsp; 💕 &nbsp; ✨</div>`, '🌷', '💞', 'final-card');
}

setupMusic();
addAmbientPetals();
home();
