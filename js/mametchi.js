// Mametchi Character - 5 states with inline SVG
// Accurate Mametchi from Tamagotchi:
//   - Yellow (#FFE566) body, square-ish with rounded corners
//   - Dark navy (#1B2A4A) ear protrusions on top (rounded Tamagotchi shape)
//   - Big round dark navy eyes with white highlight dots
//   - Simple curved smile
//   - Pink/rosy (#FFB5B5) circular cheeks
//   - Small stubby yellow arms and legs
//   - Dark navy outline on body (2px stroke)
//
// States: normal, happy, thinking, teaching, encourage

var MametchiSVGs = {
  normal: [
    '<svg viewBox="0 0 140 150" xmlns="http://www.w3.org/2000/svg">',
    '  <!-- Left ear -->',
    '  <ellipse cx="38" cy="18" rx="14" ry="20" fill="#1B2A4A" transform="rotate(-10 38 18)"/>',
    '  <!-- Right ear -->',
    '  <ellipse cx="102" cy="18" rx="14" ry="20" fill="#1B2A4A" transform="rotate(10 102 18)"/>',
    '  <!-- Head -->',
    '  <rect x="25" y="20" width="90" height="70" rx="28" ry="28" fill="#FFE566" stroke="#1B2A4A" stroke-width="2"/>',
    '  <!-- Eyes -->',
    '  <ellipse cx="52" cy="52" rx="7" ry="8" fill="#1B2A4A"/>',
    '  <ellipse cx="88" cy="52" rx="7" ry="8" fill="#1B2A4A"/>',
    '  <!-- Eye highlights -->',
    '  <ellipse cx="54" cy="49" rx="2.5" ry="3" fill="white"/>',
    '  <ellipse cx="90" cy="49" rx="2.5" ry="3" fill="white"/>',
    '  <!-- Cheeks -->',
    '  <circle cx="38" cy="65" r="7" fill="#FFB5B5" opacity="0.6"/>',
    '  <circle cx="102" cy="65" r="7" fill="#FFB5B5" opacity="0.6"/>',
    '  <!-- Mouth - smile -->',
    '  <path d="M60 70 Q70 78 80 70" stroke="#1B2A4A" stroke-width="2" fill="none" stroke-linecap="round"/>',
    '  <!-- Body -->',
    '  <rect x="35" y="88" width="70" height="35" rx="18" ry="16" fill="#FFE566" stroke="#1B2A4A" stroke-width="2"/>',
    '  <!-- Left arm -->',
    '  <path d="M38 95 Q26 100 24 110" stroke="#1B2A4A" stroke-width="2" fill="none" stroke-linecap="round"/>',
    '  <path d="M38 95 Q28 99 26 108" stroke="#FFE566" stroke-width="4" fill="none" stroke-linecap="round"/>',
    '  <circle cx="24" cy="111" r="5" fill="#FFE566" stroke="#1B2A4A" stroke-width="1.5"/>',
    '  <!-- Right arm -->',
    '  <path d="M102 95 Q114 100 116 110" stroke="#1B2A4A" stroke-width="2" fill="none" stroke-linecap="round"/>',
    '  <path d="M102 95 Q112 99 114 108" stroke="#FFE566" stroke-width="4" fill="none" stroke-linecap="round"/>',
    '  <circle cx="116" cy="111" r="5" fill="#FFE566" stroke="#1B2A4A" stroke-width="1.5"/>',
    '  <!-- Left foot -->',
    '  <ellipse cx="55" cy="126" rx="12" ry="7" fill="#1B2A4A"/>',
    '  <!-- Right foot -->',
    '  <ellipse cx="85" cy="126" rx="12" ry="7" fill="#1B2A4A"/>',
    '</svg>'
  ].join('\n'),

  happy: [
    '<svg viewBox="0 0 140 150" xmlns="http://www.w3.org/2000/svg">',
    '  <style>',
    '    .m-star { animation: m-twinkle 0.6s ease-in-out infinite alternate; }',
    '    @keyframes m-twinkle { from { opacity: 0.3; transform: scale(0.8); } to { opacity: 1; transform: scale(1.1); } }',
    '  </style>',
    '  <!-- Stars -->',
    '  <g class="m-star"><polygon points="12,10 14,16 20,16 15,20 17,26 12,22 7,26 9,20 4,16 10,16" fill="#FFD700"/></g>',
    '  <g class="m-star" style="animation-delay:0.2s"><polygon points="128,8 130,14 136,14 131,18 133,24 128,20 123,24 125,18 120,14 126,14" fill="#FFD700"/></g>',
    '  <g class="m-star" style="animation-delay:0.4s"><polygon points="8,80 10,84 14,84 11,87 12,91 8,88 4,91 5,87 2,84 6,84" fill="#FFD700" transform="scale(0.8)"/></g>',
    '  <g class="m-star" style="animation-delay:0.3s"><polygon points="132,75 134,79 138,79 135,82 136,86 132,83 128,86 129,82 126,79 130,79" fill="#FFD700" transform="scale(0.8)"/></g>',
    '  <!-- Left ear -->',
    '  <ellipse cx="38" cy="18" rx="14" ry="20" fill="#1B2A4A" transform="rotate(-10 38 18)"/>',
    '  <!-- Right ear -->',
    '  <ellipse cx="102" cy="18" rx="14" ry="20" fill="#1B2A4A" transform="rotate(10 102 18)"/>',
    '  <!-- Head -->',
    '  <rect x="25" y="20" width="90" height="70" rx="28" ry="28" fill="#FFE566" stroke="#1B2A4A" stroke-width="2"/>',
    '  <!-- Eyes - happy squint ^ ^ -->',
    '  <path d="M44 52 Q52 44 60 52" stroke="#1B2A4A" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
    '  <path d="M80 52 Q88 44 96 52" stroke="#1B2A4A" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
    '  <!-- Cheeks - extra rosy -->',
    '  <circle cx="38" cy="63" r="8" fill="#FFB5B5" opacity="0.7"/>',
    '  <circle cx="102" cy="63" r="8" fill="#FFB5B5" opacity="0.7"/>',
    '  <!-- Mouth - big smile -->',
    '  <path d="M55 68 Q70 82 85 68" stroke="#1B2A4A" stroke-width="2" fill="none" stroke-linecap="round"/>',
    '  <!-- Body -->',
    '  <rect x="35" y="88" width="70" height="35" rx="18" ry="16" fill="#FFE566" stroke="#1B2A4A" stroke-width="2"/>',
    '  <!-- Left arm - raised up -->',
    '  <path d="M38 95 Q20 75 18 60" stroke="#1B2A4A" stroke-width="2" fill="none" stroke-linecap="round"/>',
    '  <path d="M38 95 Q22 77 20 62" stroke="#FFE566" stroke-width="4" fill="none" stroke-linecap="round"/>',
    '  <circle cx="18" cy="58" r="5" fill="#FFE566" stroke="#1B2A4A" stroke-width="1.5"/>',
    '  <!-- Right arm - raised up -->',
    '  <path d="M102 95 Q120 75 122 60" stroke="#1B2A4A" stroke-width="2" fill="none" stroke-linecap="round"/>',
    '  <path d="M102 95 Q118 77 120 62" stroke="#FFE566" stroke-width="4" fill="none" stroke-linecap="round"/>',
    '  <circle cx="122" cy="58" r="5" fill="#FFE566" stroke="#1B2A4A" stroke-width="1.5"/>',
    '  <!-- Left foot -->',
    '  <ellipse cx="55" cy="126" rx="12" ry="7" fill="#1B2A4A"/>',
    '  <!-- Right foot -->',
    '  <ellipse cx="85" cy="126" rx="12" ry="7" fill="#1B2A4A"/>',
    '</svg>'
  ].join('\n'),

  thinking: [
    '<svg viewBox="0 0 140 150" xmlns="http://www.w3.org/2000/svg">',
    '  <!-- Question mark bubble -->',
    '  <circle cx="115" cy="12" r="10" fill="#E8F4FD" stroke="#B0D4E8" stroke-width="1.5"/>',
    '  <text x="115" y="17" font-size="14" font-weight="bold" fill="#1B2A4A" text-anchor="middle" font-family="Nunito, sans-serif">?</text>',
    '  <circle cx="105" cy="26" r="4" fill="#E8F4FD" stroke="#B0D4E8" stroke-width="1"/>',
    '  <circle cx="100" cy="32" r="2.5" fill="#E8F4FD" stroke="#B0D4E8" stroke-width="1"/>',
    '  <!-- Left ear -->',
    '  <ellipse cx="38" cy="18" rx="14" ry="20" fill="#1B2A4A" transform="rotate(-10 38 18)"/>',
    '  <!-- Right ear -->',
    '  <ellipse cx="102" cy="18" rx="14" ry="20" fill="#1B2A4A" transform="rotate(10 102 18)"/>',
    '  <!-- Head - slightly tilted -->',
    '  <g transform="rotate(-5 70 55)">',
    '    <rect x="25" y="20" width="90" height="70" rx="28" ry="28" fill="#FFE566" stroke="#1B2A4A" stroke-width="2"/>',
    '    <!-- Eyes - looking up -->',
    '    <ellipse cx="52" cy="50" rx="7" ry="8" fill="#1B2A4A"/>',
    '    <ellipse cx="88" cy="50" rx="7" ry="8" fill="#1B2A4A"/>',
    '    <ellipse cx="55" cy="47" rx="2.5" ry="3" fill="white"/>',
    '    <ellipse cx="91" cy="47" rx="2.5" ry="3" fill="white"/>',
    '    <!-- Cheeks -->',
    '    <circle cx="38" cy="63" r="7" fill="#FFB5B5" opacity="0.5"/>',
    '    <circle cx="102" cy="63" r="7" fill="#FFB5B5" opacity="0.5"/>',
    '    <!-- Mouth - small pondering O -->',
    '    <ellipse cx="70" cy="72" rx="4" ry="3.5" fill="#1B2A4A" opacity="0.4"/>',
    '  </g>',
    '  <!-- Body -->',
    '  <rect x="35" y="88" width="70" height="35" rx="18" ry="16" fill="#FFE566" stroke="#1B2A4A" stroke-width="2"/>',
    '  <!-- Left arm - chin rest thinking pose -->',
    '  <path d="M38 95 Q22 85 28 70" stroke="#1B2A4A" stroke-width="2" fill="none" stroke-linecap="round"/>',
    '  <path d="M38 95 Q24 87 30 72" stroke="#FFE566" stroke-width="4" fill="none" stroke-linecap="round"/>',
    '  <circle cx="28" cy="68" r="5" fill="#FFE566" stroke="#1B2A4A" stroke-width="1.5"/>',
    '  <!-- Right arm - resting -->',
    '  <path d="M102 95 Q114 100 116 110" stroke="#1B2A4A" stroke-width="2" fill="none" stroke-linecap="round"/>',
    '  <path d="M102 95 Q112 99 114 108" stroke="#FFE566" stroke-width="4" fill="none" stroke-linecap="round"/>',
    '  <circle cx="116" cy="111" r="5" fill="#FFE566" stroke="#1B2A4A" stroke-width="1.5"/>',
    '  <!-- Left foot -->',
    '  <ellipse cx="55" cy="126" rx="12" ry="7" fill="#1B2A4A"/>',
    '  <!-- Right foot -->',
    '  <ellipse cx="85" cy="126" rx="12" ry="7" fill="#1B2A4A"/>',
    '</svg>'
  ].join('\n'),

  teaching: [
    '<svg viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">',
    '  <!-- Mini whiteboard -->',
    '  <rect x="100" y="5" width="42" height="32" rx="3" fill="#FFFFFF" stroke="#1B2A4A" stroke-width="2"/>',
    '  <rect x="103" y="8" width="36" height="26" rx="2" fill="#F0F8FF"/>',
    '  <text x="121" y="22" font-size="9" fill="#1B2A4A" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="bold">a\u00B2+b\u00B2</text>',
    '  <text x="121" y="31" font-size="8" fill="#1B2A4A" text-anchor="middle" font-family="Nunito, sans-serif">=c\u00B2</text>',
    '  <!-- Left ear -->',
    '  <ellipse cx="32" cy="23" rx="14" ry="20" fill="#1B2A4A" transform="rotate(-10 32 23)"/>',
    '  <!-- Right ear -->',
    '  <ellipse cx="96" cy="23" rx="14" ry="20" fill="#1B2A4A" transform="rotate(10 96 23)"/>',
    '  <!-- Head -->',
    '  <rect x="19" y="25" width="90" height="70" rx="28" ry="28" fill="#FFE566" stroke="#1B2A4A" stroke-width="2"/>',
    '  <!-- Eyes - focused/determined -->',
    '  <ellipse cx="46" cy="57" rx="7" ry="8" fill="#1B2A4A"/>',
    '  <ellipse cx="82" cy="57" rx="7" ry="8" fill="#1B2A4A"/>',
    '  <ellipse cx="48" cy="54" rx="2.5" ry="3" fill="white"/>',
    '  <ellipse cx="84" cy="54" rx="2.5" ry="3" fill="white"/>',
    '  <!-- Cheeks -->',
    '  <circle cx="32" cy="70" r="7" fill="#FFB5B5" opacity="0.5"/>',
    '  <circle cx="96" cy="70" r="7" fill="#FFB5B5" opacity="0.5"/>',
    '  <!-- Mouth - explaining/talking -->',
    '  <ellipse cx="64" cy="77" rx="6" ry="4" fill="#FF9999" stroke="#1B2A4A" stroke-width="1"/>',
    '  <!-- Body -->',
    '  <rect x="29" y="93" width="70" height="35" rx="18" ry="16" fill="#FFE566" stroke="#1B2A4A" stroke-width="2"/>',
    '  <!-- Left arm - down -->',
    '  <path d="M32 100 Q20 105 18 115" stroke="#1B2A4A" stroke-width="2" fill="none" stroke-linecap="round"/>',
    '  <path d="M32 100 Q22 104 20 113" stroke="#FFE566" stroke-width="4" fill="none" stroke-linecap="round"/>',
    '  <circle cx="18" cy="116" r="5" fill="#FFE566" stroke="#1B2A4A" stroke-width="1.5"/>',
    '  <!-- Right arm - pointing to board -->',
    '  <path d="M96 95 Q115 70 112 45" stroke="#1B2A4A" stroke-width="2" fill="none" stroke-linecap="round"/>',
    '  <path d="M96 95 Q113 72 110 47" stroke="#FFE566" stroke-width="4" fill="none" stroke-linecap="round"/>',
    '  <circle cx="112" cy="43" r="5" fill="#FFE566" stroke="#1B2A4A" stroke-width="1.5"/>',
    '  <!-- Left foot -->',
    '  <ellipse cx="49" cy="131" rx="12" ry="7" fill="#1B2A4A"/>',
    '  <!-- Right foot -->',
    '  <ellipse cx="79" cy="131" rx="12" ry="7" fill="#1B2A4A"/>',
    '</svg>'
  ].join('\n'),

  encourage: [
    '<svg viewBox="0 0 140 150" xmlns="http://www.w3.org/2000/svg">',
    '  <style>',
    '    .m-heart { animation: m-float 1.2s ease-in-out infinite alternate; }',
    '    @keyframes m-float { from { transform: translateY(0); } to { transform: translateY(-4px); } }',
    '  </style>',
    '  <!-- Heart -->',
    '  <g class="m-heart">',
    '    <path d="M108 18 C108 12 102 8 97 12 C92 8 86 12 86 18 C86 26 97 34 97 34 C97 34 108 26 108 18Z" fill="#FF6B8A" opacity="0.8"/>',
    '  </g>',
    '  <!-- Left ear -->',
    '  <ellipse cx="38" cy="18" rx="14" ry="20" fill="#1B2A4A" transform="rotate(-10 38 18)"/>',
    '  <!-- Right ear -->',
    '  <ellipse cx="102" cy="18" rx="14" ry="20" fill="#1B2A4A" transform="rotate(10 102 18)"/>',
    '  <!-- Head -->',
    '  <rect x="25" y="20" width="90" height="70" rx="28" ry="28" fill="#FFE566" stroke="#1B2A4A" stroke-width="2"/>',
    '  <!-- Eyes - gentle caring arcs (softer than happy) -->',
    '  <path d="M44 54 Q52 47 60 54" stroke="#1B2A4A" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
    '  <path d="M80 54 Q88 47 96 54" stroke="#1B2A4A" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
    '  <!-- Cheeks - warm -->',
    '  <circle cx="38" cy="65" r="8" fill="#FFB5B5" opacity="0.65"/>',
    '  <circle cx="102" cy="65" r="8" fill="#FFB5B5" opacity="0.65"/>',
    '  <!-- Mouth - gentle smile -->',
    '  <path d="M58 70 Q70 77 82 70" stroke="#1B2A4A" stroke-width="2" fill="none" stroke-linecap="round"/>',
    '  <!-- Body -->',
    '  <rect x="35" y="88" width="70" height="35" rx="18" ry="16" fill="#FFE566" stroke="#1B2A4A" stroke-width="2"/>',
    '  <!-- Left arm - reaching out / hugging -->',
    '  <path d="M38 95 Q14 92 12 102" stroke="#1B2A4A" stroke-width="2" fill="none" stroke-linecap="round"/>',
    '  <path d="M38 95 Q16 93 14 101" stroke="#FFE566" stroke-width="4" fill="none" stroke-linecap="round"/>',
    '  <circle cx="12" cy="104" r="5" fill="#FFE566" stroke="#1B2A4A" stroke-width="1.5"/>',
    '  <!-- Right arm - reaching out / hugging -->',
    '  <path d="M102 95 Q126 92 128 102" stroke="#1B2A4A" stroke-width="2" fill="none" stroke-linecap="round"/>',
    '  <path d="M102 95 Q124 93 126 101" stroke="#FFE566" stroke-width="4" fill="none" stroke-linecap="round"/>',
    '  <circle cx="128" cy="104" r="5" fill="#FFE566" stroke="#1B2A4A" stroke-width="1.5"/>',
    '  <!-- Left foot -->',
    '  <ellipse cx="55" cy="126" rx="12" ry="7" fill="#1B2A4A"/>',
    '  <!-- Right foot -->',
    '  <ellipse cx="85" cy="126" rx="12" ry="7" fill="#1B2A4A"/>',
    '</svg>'
  ].join('\n')
};

// Set Mametchi state in a container
function setMametchiState(containerId, stateName) {
  var container = document.getElementById(containerId);
  if (!container) return;
  var svg = MametchiSVGs[stateName] || MametchiSVGs.normal;
  container.innerHTML = svg;
  container.className = 'mametchi-container mametchi-' + stateName;
}

// Typewriter effect for dialog - returns Promise
function typeDialog(text, speed) {
  speed = speed || 25;
  return new Promise(function(resolve) {
    var el = document.getElementById('dialogText');
    if (!el) { resolve(); return; }

    // Cancel any ongoing typing
    if (window._mametchiTypingTimer) {
      clearTimeout(window._mametchiTypingTimer);
      window._mametchiTypingTimer = null;
    }

    el.innerHTML = '';
    var i = 0;
    var cursor = document.createElement('span');
    cursor.className = 'typing-cursor';

    function doType() {
      if (i < text.length) {
        el.textContent = text.substring(0, i + 1);
        el.appendChild(cursor);
        i++;
        window._mametchiTypingTimer = setTimeout(doType, speed);
      } else {
        cursor.remove();
        window._mametchiTypingTimer = null;
        // Render any KaTeX in the dialog
        if (typeof renderMathIn === 'function') {
          renderMathIn(el);
        }
        resolve();
      }
    }
    doType();
  });
}

// Instant dialog (no animation)
function setDialog(text) {
  var el = document.getElementById('dialogText');
  if (!el) return;
  el.textContent = text;
  if (typeof renderMathIn === 'function') {
    renderMathIn(el);
  }
}

// Initialize Mametchi on page load
function initMametchi() {
  var welcomeEl = document.getElementById('welcomeMametchi');
  if (welcomeEl) {
    setMametchiState('welcomeMametchi', 'normal');
  }
  var problemEl = document.getElementById('problemMametchi');
  if (problemEl) {
    setMametchiState('problemMametchi', 'normal');
  }
}
