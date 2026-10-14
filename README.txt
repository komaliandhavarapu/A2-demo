OpenWithLove B6 — Anniversary Edition

Main entry: index.html
Brand logo: openwithlove-logo.png

Surprise flow:
1. Tap once to part the theater curtains and reveal the anniversary greeting;
   a confetti burst appears on both sides of the message once the reveal ends.
2. Tap the envelope to lift the letter out of it; the letter types in cursive
   without an abrupt page change. A second confetti burst frames both sides of
   the letter as it emerges.
3. See the customer photo selected in config.js in the memory page and final
   greeting. Visitors cannot change the displayed photo.
4. Answer “Will you be with me forever?”; “No” opens a playful retry page.
5. A celebratory keepsake-style anniversary wish with a bouquet and “I love you.”

Customize customer-specific names, dates, letter text, photo, music, and other
copy in config.js. To change the displayed photo, update `featuredPhoto.src`
and `featuredPhoto.alt` there; visitors have no photo picker or upload control.
The supplied photos are in assets/photos. The supplied music can be started or
paused with the music button. To ensure browsers allow music playback, open the
page through a local web server (for example, run `python -m http.server` from
this folder and visit `http://localhost:8000`). Floating red rose petals and
hearts decorate the background. The page adapts to small screens and honors the
device's reduced-motion setting.
