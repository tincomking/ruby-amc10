// Mametchi Character - 5 states with inline SVG
// States: normal, happy, thinking, teaching, encourage

const MametchiSVGs = {
  normal: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <!-- Body -->
    <ellipse cx="60" cy="72" rx="32" ry="28" fill="#FFE4B5"/>
    <ellipse cx="60" cy="72" rx="30" ry="26" fill="#FFFACD"/>
    <!-- Head -->
    <circle cx="60" cy="40" r="28" fill="#FFE4B5"/>
    <circle cx="60" cy="40" r="26" fill="#FFFACD"/>
    <!-- Ears/Hat -->
    <ellipse cx="38" cy="22" rx="10" ry="8" fill="#4A90D9" transform="rotate(-15 38 22)"/>
    <ellipse cx="82" cy="22" rx="10" ry="8" fill="#4A90D9" transform="rotate(15 82 22)"/>
    <ellipse cx="60" cy="16" rx="16" ry="6" fill="#4A90D9"/>
    <!-- Eyes -->
    <ellipse cx="48" cy="38" rx="5" ry="6" fill="#2D3436"/>
    <ellipse cx="72" cy="38" rx="5" ry="6" fill="#2D3436"/>
    <ellipse cx="49" cy="36" rx="2" ry="2.5" fill="white"/>
    <ellipse cx="73" cy="36" rx="2" ry="2.5" fill="white"/>
    <!-- Mouth - smile -->
    <path d="M52 50 Q60 56 68 50" stroke="#2D3436" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- Cheeks -->
    <ellipse cx="40" cy="48" rx="5" ry="3" fill="#FFB6C1" opacity="0.5"/>
    <ellipse cx="80" cy="48" rx="5" ry="3" fill="#FFB6C1" opacity="0.5"/>
    <!-- Arms -->
    <path d="M30 68 Q22 72 24 80" stroke="#FFE4B5" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M90 68 Q98 72 96 80" stroke="#FFE4B5" stroke-width="6" fill="none" stroke-linecap="round"/>
    <!-- Feet -->
    <ellipse cx="48" cy="96" rx="10" ry="5" fill="#4A90D9"/>
    <ellipse cx="72" cy="96" rx="10" ry="5" fill="#4A90D9"/>
  </svg>`,

  happy: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <!-- Stars -->
    <text x="10" y="20" font-size="14" class="star-anim">⭐</text>
    <text x="100" y="15" font-size="12" class="star-anim" style="animation-delay:0.2s">✨</text>
    <text x="15" y="85" font-size="10" class="star-anim" style="animation-delay:0.4s">⭐</text>
    <text x="105" y="80" font-size="11" class="star-anim" style="animation-delay:0.3s">✨</text>
    <!-- Body -->
    <ellipse cx="60" cy="72" rx="32" ry="28" fill="#FFE4B5"/>
    <ellipse cx="60" cy="72" rx="30" ry="26" fill="#FFFACD"/>
    <!-- Head -->
    <circle cx="60" cy="40" r="28" fill="#FFE4B5"/>
    <circle cx="60" cy="40" r="26" fill="#FFFACD"/>
    <!-- Ears/Hat -->
    <ellipse cx="38" cy="22" rx="10" ry="8" fill="#4A90D9" transform="rotate(-15 38 22)"/>
    <ellipse cx="82" cy="22" rx="10" ry="8" fill="#4A90D9" transform="rotate(15 82 22)"/>
    <ellipse cx="60" cy="16" rx="16" ry="6" fill="#4A90D9"/>
    <!-- Eyes - happy squint -->
    <path d="M43 37 Q48 32 53 37" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M67 37 Q72 32 77 37" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Mouth - big smile -->
    <path d="M48 48 Q60 60 72 48" stroke="#2D3436" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- Cheeks - extra rosy -->
    <ellipse cx="40" cy="46" rx="6" ry="4" fill="#FFB6C1" opacity="0.6"/>
    <ellipse cx="80" cy="46" rx="6" ry="4" fill="#FFB6C1" opacity="0.6"/>
    <!-- Arms - raised up! -->
    <path d="M30 65 Q18 50 22 40" stroke="#FFE4B5" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M90 65 Q102 50 98 40" stroke="#FFE4B5" stroke-width="6" fill="none" stroke-linecap="round"/>
    <!-- Hands/Paws waving -->
    <circle cx="22" cy="38" r="5" fill="#FFFACD"/>
    <circle cx="98" cy="38" r="5" fill="#FFFACD"/>
    <!-- Feet -->
    <ellipse cx="48" cy="96" rx="10" ry="5" fill="#4A90D9"/>
    <ellipse cx="72" cy="96" rx="10" ry="5" fill="#4A90D9"/>
    <style>
      .star-anim { animation: twinkle 0.6s ease-in-out infinite alternate; }
      @keyframes twinkle { from { opacity: 0.3; } to { opacity: 1; } }
    </style>
  </svg>`,

  thinking: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <!-- Thought bubbles -->
    <circle cx="95" cy="15" r="4" fill="#DDD" opacity="0.6"/>
    <circle cx="100" cy="25" r="3" fill="#DDD" opacity="0.4"/>
    <circle cx="90" cy="8" r="6" fill="#DDD" opacity="0.5"/>
    <text x="86" y="12" font-size="10" fill="#999">?</text>
    <!-- Body -->
    <ellipse cx="60" cy="72" rx="32" ry="28" fill="#FFE4B5"/>
    <ellipse cx="60" cy="72" rx="30" ry="26" fill="#FFFACD"/>
    <!-- Head - slightly tilted -->
    <g transform="rotate(-5 60 40)">
      <circle cx="60" cy="40" r="28" fill="#FFE4B5"/>
      <circle cx="60" cy="40" r="26" fill="#FFFACD"/>
      <!-- Ears/Hat -->
      <ellipse cx="38" cy="22" rx="10" ry="8" fill="#4A90D9" transform="rotate(-15 38 22)"/>
      <ellipse cx="82" cy="22" rx="10" ry="8" fill="#4A90D9" transform="rotate(15 82 22)"/>
      <ellipse cx="60" cy="16" rx="16" ry="6" fill="#4A90D9"/>
      <!-- Eyes - looking up/thinking -->
      <ellipse cx="48" cy="36" rx="5" ry="6" fill="#2D3436"/>
      <ellipse cx="72" cy="36" rx="5" ry="6" fill="#2D3436"/>
      <ellipse cx="50" cy="34" rx="2" ry="2.5" fill="white"/>
      <ellipse cx="74" cy="34" rx="2" ry="2.5" fill="white"/>
      <!-- Mouth - small ponder -->
      <circle cx="60" cy="52" r="3" fill="#2D3436" opacity="0.3"/>
      <!-- Cheeks -->
      <ellipse cx="40" cy="48" rx="5" ry="3" fill="#FFB6C1" opacity="0.4"/>
      <ellipse cx="80" cy="48" rx="5" ry="3" fill="#FFB6C1" opacity="0.4"/>
    </g>
    <!-- Arm - chin rest (thinking pose) -->
    <path d="M30 68 Q22 60 30 52" stroke="#FFE4B5" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M90 68 Q98 72 96 80" stroke="#FFE4B5" stroke-width="6" fill="none" stroke-linecap="round"/>
    <!-- Feet -->
    <ellipse cx="48" cy="96" rx="10" ry="5" fill="#4A90D9"/>
    <ellipse cx="72" cy="96" rx="10" ry="5" fill="#4A90D9"/>
  </svg>`,

  teaching: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <!-- Mini blackboard -->
    <rect x="78" y="10" width="36" height="28" rx="3" fill="#2D5016"/>
    <rect x="80" y="12" width="32" height="24" rx="2" fill="#3D7A1C"/>
    <text x="88" y="28" font-size="12" fill="white" font-weight="bold">E=mc²</text>
    <!-- Body -->
    <ellipse cx="55" cy="72" rx="32" ry="28" fill="#FFE4B5"/>
    <ellipse cx="55" cy="72" rx="30" ry="26" fill="#FFFACD"/>
    <!-- Head -->
    <circle cx="55" cy="40" r="28" fill="#FFE4B5"/>
    <circle cx="55" cy="40" r="26" fill="#FFFACD"/>
    <!-- Ears/Hat -->
    <ellipse cx="33" cy="22" rx="10" ry="8" fill="#4A90D9" transform="rotate(-15 33 22)"/>
    <ellipse cx="77" cy="22" rx="10" ry="8" fill="#4A90D9" transform="rotate(15 77 22)"/>
    <ellipse cx="55" cy="16" rx="16" ry="6" fill="#4A90D9"/>
    <!-- Eyes - focused/determined -->
    <ellipse cx="43" cy="38" rx="5" ry="6" fill="#2D3436"/>
    <ellipse cx="67" cy="38" rx="5" ry="6" fill="#2D3436"/>
    <ellipse cx="44" cy="36" rx="2" ry="2.5" fill="white"/>
    <ellipse cx="68" cy="36" rx="2" ry="2.5" fill="white"/>
    <!-- Mouth - explaining -->
    <ellipse cx="55" cy="52" rx="5" ry="3" fill="#FF9999"/>
    <!-- Cheeks -->
    <ellipse cx="35" cy="48" rx="5" ry="3" fill="#FFB6C1" opacity="0.5"/>
    <ellipse cx="75" cy="48" rx="5" ry="3" fill="#FFB6C1" opacity="0.5"/>
    <!-- Left arm down -->
    <path d="M25 68 Q17 72 19 80" stroke="#FFE4B5" stroke-width="6" fill="none" stroke-linecap="round"/>
    <!-- Right arm - pointing to board -->
    <path d="M85 65 Q92 45 90 35" stroke="#FFE4B5" stroke-width="6" fill="none" stroke-linecap="round"/>
    <circle cx="90" cy="33" r="4" fill="#FFFACD"/>
    <!-- Feet -->
    <ellipse cx="43" cy="96" rx="10" ry="5" fill="#4A90D9"/>
    <ellipse cx="67" cy="96" rx="10" ry="5" fill="#4A90D9"/>
  </svg>`,

  encourage: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <!-- Heart -->
    <text x="85" y="25" font-size="16" opacity="0.7">💖</text>
    <!-- Body -->
    <ellipse cx="60" cy="72" rx="32" ry="28" fill="#FFE4B5"/>
    <ellipse cx="60" cy="72" rx="30" ry="26" fill="#FFFACD"/>
    <!-- Head -->
    <circle cx="60" cy="40" r="28" fill="#FFE4B5"/>
    <circle cx="60" cy="40" r="26" fill="#FFFACD"/>
    <!-- Ears/Hat -->
    <ellipse cx="38" cy="22" rx="10" ry="8" fill="#4A90D9" transform="rotate(-15 38 22)"/>
    <ellipse cx="82" cy="22" rx="10" ry="8" fill="#4A90D9" transform="rotate(15 82 22)"/>
    <ellipse cx="60" cy="16" rx="16" ry="6" fill="#4A90D9"/>
    <!-- Eyes - gentle, caring -->
    <path d="M43 38 Q48 34 53 38" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M67 38 Q72 34 77 38" stroke="#2D3436" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Mouth - gentle smile -->
    <path d="M52 50 Q60 54 68 50" stroke="#2D3436" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- Cheeks - warm -->
    <ellipse cx="40" cy="46" rx="6" ry="4" fill="#FFB6C1" opacity="0.6"/>
    <ellipse cx="80" cy="46" rx="6" ry="4" fill="#FFB6C1" opacity="0.6"/>
    <!-- Arms - reaching out / hugging pose -->
    <path d="M30 65 Q15 68 18 78" stroke="#FFE4B5" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M90 65 Q105 68 102 78" stroke="#FFE4B5" stroke-width="6" fill="none" stroke-linecap="round"/>
    <circle cx="18" cy="80" r="5" fill="#FFFACD"/>
    <circle cx="102" cy="80" r="5" fill="#FFFACD"/>
    <!-- Feet -->
    <ellipse cx="48" cy="96" rx="10" ry="5" fill="#4A90D9"/>
    <ellipse cx="72" cy="96" rx="10" ry="5" fill="#4A90D9"/>
  </svg>`
};

// Set Mametchi state in a container
function setMametchiState(containerId, state) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const svg = MametchiSVGs[state] || MametchiSVGs.normal;
  container.innerHTML = svg;
  container.className = 'mametchi-container mametchi-' + state;
}

// Typewriter effect for dialog
function typeDialog(text, speed) {
  speed = speed || 25;
  return new Promise(function(resolve) {
    var el = document.getElementById('dialogText');
    if (!el) { resolve(); return; }
    el.innerHTML = '';
    var i = 0;
    var cursor = document.createElement('span');
    cursor.className = 'typing-cursor';

    function type() {
      if (i < text.length) {
        el.textContent = text.substring(0, i + 1);
        el.appendChild(cursor);
        i++;
        setTimeout(type, speed);
      } else {
        cursor.remove();
        // Render any KaTeX in the dialog
        renderMathIn(el);
        resolve();
      }
    }
    type();
  });
}

// Instant dialog (no animation)
function setDialog(text) {
  var el = document.getElementById('dialogText');
  if (!el) return;
  el.textContent = text;
  renderMathIn(el);
}

// Initialize Mametchi on welcome screen
function initMametchi() {
  setMametchiState('welcomeMametchi', 'normal');
  setMametchiState('problemMametchi', 'normal');
}
