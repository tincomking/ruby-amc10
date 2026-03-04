// Claude API Integration via Cloudflare Worker with PIN Authentication
//
// Security: API key is on Worker (server-side), browser only holds
// a time-limited session token obtained via PIN login.

var AI_CONFIG = {
  // Cloudflare Worker endpoint - set via configureAI()
  endpoint: '',
  enabled: false,
  available: true,
  retryAfter: 0,
  // Session
  sessionToken: null,
  sessionExpires: 0
};

var SYSTEM_PROMPT = [
  'You are Mametchi, a cute and encouraging Tamagotchi math teacher helping Ruby (a 10th grader in Singapore) prepare for the AMC 10 competition.',
  '',
  'PERSONALITY:',
  '- Always friendly, patient, and enthusiastic',
  '- Use encouraging language: "Great job!", "You\'re getting so good at this!", "Let\'s figure this out together!"',
  '- Occasionally add fun math facts or connections to real life',
  '- Never condescending; always respectful of Ruby\'s intelligence',
  '- Keep explanations clear and step-by-step',
  '',
  'PROBLEM GENERATION RULES:',
  '- Generate problems at AMC 10 difficulty level',
  '- Always provide exactly 5 multiple-choice options labeled (A) through (E)',
  '- Use LaTeX notation with $ delimiters for all math expressions',
  '- Ensure problems are solvable without a calculator',
  '- Ensure exactly one correct answer among the choices',
  '- Vary problem types within the requested topic',
  '',
  'DIFFICULTY LEVELS (1-5):',
  '1: AMC 10 #1-5 level (straightforward computation)',
  '2: AMC 10 #6-10 level (requires one key insight)',
  '3: AMC 10 #11-15 level (multi-step reasoning)',
  '4: AMC 10 #16-20 level (creative problem-solving)',
  '5: AMC 10 #21-25 level (challenging, competition-level)',
  '',
  'RESPONSE FORMAT: Always respond with valid JSON only (no markdown, no code fences). Use this exact schema:',
  '{',
  '  "problem": "The problem statement with $LaTeX$",',
  '  "choices": ["(A) ...", "(B) ...", "(C) ...", "(D) ...", "(E) ..."],',
  '  "correctAnswer": "A",',
  '  "hint": "A gentle hint without giving away the answer",',
  '  "solution": "Step-by-step solution with $LaTeX$",',
  '  "mametchiIntro": "Friendly intro message",',
  '  "mametchiCorrect": "Enthusiastic praise",',
  '  "mametchiWrong": "Encouraging message before explanation",',
  '  "topic": "algebra|geometry|number_theory|combinatorics",',
  '  "subtopic": "specific subtopic name"',
  '}'
].join('\n');

// ---- Configuration ----

function configureAI(endpoint) {
  AI_CONFIG.endpoint = endpoint;
  AI_CONFIG.enabled = !!endpoint;
  // Try to restore session from localStorage
  try {
    var saved = localStorage.getItem('mametchi_session');
    if (saved) {
      var session = JSON.parse(saved);
      if (session.token && session.expires > Date.now()) {
        AI_CONFIG.sessionToken = session.token;
        AI_CONFIG.sessionExpires = session.expires;
      } else {
        localStorage.removeItem('mametchi_session');
      }
    }
  } catch (e) { /* ignore */ }
}

// ---- Session / Auth ----

function isAIAvailable() {
  return AI_CONFIG.enabled && AI_CONFIG.available && Date.now() > AI_CONFIG.retryAfter;
}

function hasValidSession() {
  return AI_CONFIG.sessionToken && AI_CONFIG.sessionExpires > Date.now();
}

function loginWithCredentials(username, password) {
  if (!AI_CONFIG.endpoint) {
    return Promise.reject(new Error('AI not configured'));
  }

  return fetch(AI_CONFIG.endpoint + '/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username, password: password })
  }).then(function(res) {
    return res.json().then(function(data) {
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      // Save session
      AI_CONFIG.sessionToken = data.token;
      AI_CONFIG.sessionExpires = Date.now() + (data.expiresIn || 86400000);
      try {
        localStorage.setItem('mametchi_session', JSON.stringify({
          token: data.token,
          expires: AI_CONFIG.sessionExpires
        }));
      } catch (e) { /* ignore */ }
      return data;
    });
  });
}

function logout() {
  AI_CONFIG.sessionToken = null;
  AI_CONFIG.sessionExpires = 0;
  try { localStorage.removeItem('mametchi_session'); } catch (e) { /* ignore */ }
}

// ---- Core API call (with session token) ----

function callClaudeAPI(systemPrompt, messages) {
  if (!hasValidSession()) {
    return Promise.reject(new Error('No valid session'));
  }

  return fetch(AI_CONFIG.endpoint + '/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: AI_CONFIG.sessionToken,
      system: systemPrompt,
      messages: messages
    })
  }).then(function(res) {
    if (!res.ok) {
      if (res.status === 401) {
        // Session expired
        logout();
        showPINModal();
      }
      if (res.status === 429) {
        AI_CONFIG.retryAfter = Date.now() + 60000;
      }
      throw new Error('API error: ' + res.status);
    }
    return res.json();
  }).then(function(data) {
    if (data.content && data.content[0] && data.content[0].text) {
      return data.content[0].text;
    }
    throw new Error('Unexpected API response format');
  }).catch(function(err) {
    console.warn('AI API error:', err);
    if (err.message.indexOf('401') === -1) {
      AI_CONFIG.available = false;
      setTimeout(function() { AI_CONFIG.available = true; }, 60000);
    }
    throw err;
  });
}

// ---- Problem generation ----

function fetchProblemFromAI(topic, subtopic, difficulty, recentContext) {
  if (!isAIAvailable() || !hasValidSession()) {
    return Promise.reject(new Error('AI not available'));
  }

  var userMessage = 'Generate an AMC 10 problem.\n' +
    'Topic: ' + topic + '\n' +
    'Subtopic: ' + subtopic + '\n' +
    'Difficulty: ' + difficulty + ' out of 5\n';

  if (recentContext) {
    userMessage += 'Recent topics covered (avoid repeating): ' + recentContext + '\n';
  }

  userMessage += 'Respond with valid JSON only.';

  return callClaudeAPI(SYSTEM_PROMPT, [{ role: 'user', content: userMessage }])
    .then(function(response) {
      return parseAIProblem(response, topic, subtopic, difficulty);
    });
}

function fetchFollowUpFromAI(originalProblem) {
  if (!isAIAvailable() || !hasValidSession()) {
    return Promise.reject(new Error('AI not available'));
  }

  var newDifficulty = Math.max(1, originalProblem.difficulty - 1);
  var userMessage = 'Ruby just got this problem wrong:\n' +
    '"' + originalProblem.problem + '"\n\n' +
    'Generate a SIMILAR but slightly easier follow-up problem on the same concept.\n' +
    'Topic: ' + originalProblem.topic + '\n' +
    'Subtopic: ' + originalProblem.subtopic + '\n' +
    'Difficulty: ' + newDifficulty + ' out of 5\n' +
    'Respond with valid JSON only.';

  return callClaudeAPI(SYSTEM_PROMPT, [{ role: 'user', content: userMessage }])
    .then(function(response) {
      return parseAIProblem(response, originalProblem.topic, originalProblem.subtopic, newDifficulty);
    });
}

// ---- Detailed explanation (progressive hints) ----

function fetchDetailedExplanation(problem, isCorrect) {
  if (!isAIAvailable() || !hasValidSession()) {
    return Promise.reject(new Error('AI not available'));
  }

  var explanationPrompt = [
    'You are Mametchi, guiding Ruby (10th grader, AMC 10 prep) through a math problem.',
    '',
    'IMPORTANT: Give PROGRESSIVE HINTS, not the full answer at once!',
    'Each step should reveal a LITTLE MORE, like peeling an onion:',
    '',
    'Step 1: Identify what we know and what we need to find (no calculation yet)',
    'Step 2: Suggest the key concept/theorem/formula to use (hint, not answer)',
    'Step 3: Set up the equation or draw the connection',
    'Step 4: Do the first part of the calculation',
    'Step 5: Complete the calculation and arrive at the answer',
    'Step 6: Verify or explain why this makes sense',
    '',
    'RULES:',
    '- 5-7 steps, each building on the previous',
    '- Early steps should be HINTS that help Ruby think, not spoilers',
    '- Use $LaTeX$ for ALL math expressions',
    '- Be encouraging: "Think about...", "Notice that...", "Can you see why...?"',
    '- Each step reveals ONE new piece of the puzzle',
    '- Final step confirms the answer with verification',
    '',
    'RESPONSE FORMAT: Return a JSON array of step strings only (no markdown, no code fences):',
    '["First, let\'s identify what we know...", "Think about which formula...", ...]'
  ].join('\n');

  var userMsg = 'Problem: ' + problem.problem + '\n' +
    'Correct answer: ' + problem.correctAnswer + '\n' +
    'Topic: ' + problem.topic + '\n';

  if (problem.solution) {
    userMsg += 'Reference solution: ' + problem.solution + '\n';
  }

  userMsg += '\nGive progressive hints that guide Ruby to the answer step by step.' +
    (isCorrect ? ' She got it right, so frame it as a walkthrough.' : ' She got it wrong, so help her discover what she missed.') +
    '\nRespond with a JSON array of step strings only.';

  return callClaudeAPI(explanationPrompt, [{ role: 'user', content: userMsg }])
    .then(function(response) {
      var text = response.trim();
      var fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (fenceMatch) text = fenceMatch[1].trim();
      var steps = JSON.parse(text);
      if (Array.isArray(steps) && steps.length >= 2) {
        return steps;
      }
      throw new Error('Invalid steps format');
    });
}

// ---- Parse AI response ----

function parseAIProblem(responseText, topic, subtopic, difficulty) {
  var jsonStr = responseText.trim();
  var fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) jsonStr = fenceMatch[1].trim();

  var data;
  try {
    data = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error('Invalid JSON from AI');
  }

  if (!data.problem || !data.choices || !data.correctAnswer || !data.solution) {
    throw new Error('Missing required fields in AI response');
  }

  if (!Array.isArray(data.choices) || data.choices.length !== 5) {
    throw new Error('Choices must be an array of 5');
  }

  var validAnswers = ['A', 'B', 'C', 'D', 'E'];
  if (validAnswers.indexOf(data.correctAnswer) === -1) {
    throw new Error('Invalid correct answer: ' + data.correctAnswer);
  }

  return {
    id: 'ai-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
    topic: data.topic || topic,
    subtopic: data.subtopic || subtopic,
    difficulty: difficulty,
    format: 'multiple_choice',
    problem: data.problem,
    choices: data.choices,
    correctAnswer: data.correctAnswer,
    hint: data.hint || 'Think carefully about the key concept here.',
    solution: data.solution,
    mametchiIntro: data.mametchiIntro || getRandomIntro(topic),
    mametchiCorrect: data.mametchiCorrect || getRandomCorrect(),
    mametchiWrong: data.mametchiWrong || getRandomWrong(),
    source: 'ai'
  };
}

// ---- PIN Modal UI ----

function showPINModal() {
  var existing = document.getElementById('pinModal');
  if (existing) {
    existing.classList.remove('hidden');
    var pwInput = document.getElementById('pinPassword');
    if (pwInput) { pwInput.value = ''; pwInput.focus(); }
    return;
  }

  var modal = document.createElement('div');
  modal.id = 'pinModal';
  modal.className = 'pin-modal';
  modal.innerHTML =
    '<div class="pin-modal-card">' +
      '<div class="pin-modal-icon">&#x1F510;</div>' +
      '<h3 class="pin-modal-title">Login</h3>' +
      '<p class="pin-modal-desc">Unlock Mametchi\'s AI brain</p>' +
      '<input type="text" id="pinUsername" class="pin-input pin-input-name" maxlength="20" placeholder="Username" autocomplete="username" autocapitalize="off">' +
      '<input type="password" id="pinPassword" class="pin-input" maxlength="20" placeholder="Password" autocomplete="current-password">' +
      '<div class="pin-error hidden" id="pinError"></div>' +
      '<button class="btn btn-primary pin-submit-btn" id="pinSubmitBtn">Unlock</button>' +
      '<button class="btn btn-ghost pin-skip-btn" id="pinSkipBtn">Skip (offline mode)</button>' +
    '</div>';

  document.body.appendChild(modal);

  var userInput = document.getElementById('pinUsername');
  var pwInput = document.getElementById('pinPassword');
  var submitBtn = document.getElementById('pinSubmitBtn');
  var skipBtn = document.getElementById('pinSkipBtn');
  var errorEl = document.getElementById('pinError');

  function doLogin() {
    var username = userInput.value.trim();
    var password = pwInput.value.trim();
    if (!username || !password) return;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Checking...';
    errorEl.classList.add('hidden');

    loginWithCredentials(username, password)
      .then(function() {
        modal.classList.add('hidden');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Unlock';
      })
      .catch(function(err) {
        errorEl.textContent = err.message || 'Wrong username or password';
        errorEl.classList.remove('hidden');
        pwInput.value = '';
        pwInput.focus();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Unlock';
      });
  }

  submitBtn.addEventListener('click', doLogin);
  pwInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') doLogin();
  });
  userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') pwInput.focus();
  });
  skipBtn.addEventListener('click', function() {
    modal.classList.add('hidden');
  });

  userInput.focus();
}

function initAISession() {
  // Only show PIN modal if AI endpoint is configured but no valid session
  if (AI_CONFIG.enabled && !hasValidSession()) {
    showPINModal();
  }
}
