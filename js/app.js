// Main Application - State Machine & UI Logic

(function() {
  // --- State ---
  var state = {
    screen: 'welcome',    // welcome | problem
    phase: 'idle',        // idle | loading | presenting | waiting | correct | wrong | explaining | followup
    currentProblem: null,
    selectedAnswer: null,
    isFollowUp: false,
    originalProblem: null, // for follow-up context
    startTime: null,       // when problem was presented
    progress: null
  };

  // --- DOM refs ---
  var screens = {};
  var els = {};

  // --- Init ---
  function init() {
    state.progress = loadProgress();

    // Cache DOM elements
    screens = {
      welcome: document.getElementById('welcomeScreen'),
      problem: document.getElementById('problemScreen')
    };
    els = {
      dialogBubble: document.getElementById('dialogBubble'),
      dialogText: document.getElementById('dialogText'),
      problemCard: document.getElementById('problemCard'),
      problemText: document.getElementById('problemText'),
      problemTopic: document.getElementById('problemTopic'),
      problemDifficulty: document.getElementById('problemDifficulty'),
      problemCounter: document.getElementById('problemCounter'),
      choices: document.getElementById('choices'),
      answerSection: document.getElementById('answerSection'),
      submitBtn: document.getElementById('submitBtn'),
      hintBtn: document.getElementById('hintBtn'),
      skipBtn: document.getElementById('skipBtn'),
      nextBtn: document.getElementById('nextBtn'),
      hintCard: document.getElementById('hintCard'),
      hintText: document.getElementById('hintText'),
      solutionCard: document.getElementById('solutionCard'),
      solutionHeader: document.getElementById('solutionHeader'),
      solutionText: document.getElementById('solutionText'),
      loadingOverlay: document.getElementById('loadingOverlay'),
      dailyStats: document.getElementById('dailyStats')
    };

    // Init Mametchi
    initMametchi();

    // Bind events
    bindEvents();

    // Show welcome screen
    showScreen('welcome');
    updateDailyStatsDisplay();
    updateProgressBars();
  }

  // --- Events ---
  function bindEvents() {
    // Topic buttons
    var topicBtns = document.querySelectorAll('.topic-btn');
    for (var i = 0; i < topicBtns.length; i++) {
      topicBtns[i].addEventListener('click', function() {
        var topic = this.getAttribute('data-topic');
        startPractice(topic);
      });
    }

    // Submit answer
    els.submitBtn.addEventListener('click', submitAnswer);

    // Hint
    els.hintBtn.addEventListener('click', showHint);

    // Skip
    els.skipBtn.addEventListener('click', skipProblem);

    // Next problem
    els.nextBtn.addEventListener('click', nextProblem);

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      if (state.screen !== 'problem') return;

      // A-E to select choices
      if (state.phase === 'waiting') {
        var key = e.key.toUpperCase();
        var idx = 'ABCDE'.indexOf(key);
        if (idx >= 0) {
          selectChoice(key);
          return;
        }
        // Enter to submit
        if (e.key === 'Enter' && state.selectedAnswer) {
          submitAnswer();
          return;
        }
      }
      // Enter or Space for next problem
      if ((state.phase === 'correct' || state.phase === 'explaining') && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        nextProblem();
      }
    });
  }

  // --- Screen Management ---
  function showScreen(name) {
    state.screen = name;
    for (var s in screens) {
      if (screens[s]) {
        screens[s].classList.toggle('active', s === name);
      }
    }
  }

  // --- Practice Flow ---
  function startPractice(requestedTopic) {
    showScreen('problem');
    loadNextProblem(requestedTopic);
  }

  function loadNextProblem(requestedTopic) {
    state.phase = 'loading';
    state.selectedAnswer = null;
    state.isFollowUp = false;
    state.originalProblem = null;

    // Show loading state
    setMametchiState('problemMametchi', 'thinking');
    setDialog('Hmm, let me find a good problem for you...');
    els.hintCard.classList.add('hidden');
    els.solutionCard.classList.add('hidden');
    els.answerSection.style.display = 'block';
    els.submitBtn.disabled = true;
    els.choices.innerHTML = '';

    // Determine topic and difficulty
    var selection = selectNextTopic(state.progress, requestedTopic);
    var difficulty = getDifficulty(state.progress, selection.topic, selection.subtopic);

    ProblemManager.getProblem(selection.topic, selection.subtopic, difficulty)
      .then(function(problem) {
        if (!problem) {
          setDialog("Oops, I couldn't find a problem right now. Let's try again!");
          setMametchiState('problemMametchi', 'encourage');
          return;
        }
        presentProblem(problem);
      })
      .catch(function(err) {
        console.error('Error loading problem:', err);
        // Try local fallback
        var problem = getLocalProblem(selection.topic, selection.subtopic, difficulty);
        if (problem) {
          presentProblem(problem);
        } else {
          setDialog("Something went wrong! Let's try again.");
          setMametchiState('problemMametchi', 'encourage');
        }
      });
  }

  function presentProblem(problem) {
    state.currentProblem = problem;
    state.phase = 'presenting';
    state.startTime = Date.now();

    // Update meta
    var topicLabels = {
      algebra: 'Algebra', geometry: 'Geometry',
      number_theory: 'Number Theory', combinatorics: 'Combinatorics'
    };
    var diffLabels = { 1: 'Easy', 2: 'Medium', 3: 'Medium', 4: 'Hard', 5: 'Challenge' };

    els.problemTopic.textContent = topicLabels[problem.topic] || problem.topic;
    els.problemDifficulty.textContent = diffLabels[problem.difficulty] || 'Level ' + problem.difficulty;
    els.problemDifficulty.setAttribute('data-level', problem.difficulty);

    var todayStats = getTodayStats(state.progress);
    els.problemCounter.textContent = '#' + (todayStats.problems + 1);

    // Render problem text
    els.problemText.textContent = problem.problem;
    renderMathIn(els.problemText);

    // Render choices
    renderChoices(problem.choices);

    // Mametchi intro
    setMametchiState('problemMametchi', 'normal');
    typeDialog(problem.mametchiIntro || "Let's try this one!").then(function() {
      state.phase = 'waiting';
    });

    // Prefetch next problem in background
    ProblemManager.prefetchNext(state.progress);
  }

  function renderChoices(choices) {
    els.choices.innerHTML = '';
    var letters = ['A', 'B', 'C', 'D', 'E'];

    for (var i = 0; i < choices.length; i++) {
      var btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.setAttribute('data-letter', letters[i]);

      var letterSpan = document.createElement('span');
      letterSpan.className = 'choice-letter';
      letterSpan.textContent = letters[i];

      var textSpan = document.createElement('span');
      textSpan.className = 'choice-text';
      // Remove leading (A), (B) etc. from choice text if present
      var choiceText = choices[i].replace(/^\([A-E]\)\s*/, '');
      textSpan.textContent = choiceText;

      btn.appendChild(letterSpan);
      btn.appendChild(textSpan);

      btn.addEventListener('click', (function(letter) {
        return function() {
          if (state.phase === 'waiting') {
            selectChoice(letter);
          }
        };
      })(letters[i]));

      els.choices.appendChild(btn);

      // Render math in choice
      renderMathIn(textSpan);
    }
  }

  function selectChoice(letter) {
    state.selectedAnswer = letter;
    els.submitBtn.disabled = false;

    // Update visual state
    var btns = els.choices.querySelectorAll('.choice-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('selected', btns[i].getAttribute('data-letter') === letter);
    }
  }

  function submitAnswer() {
    if (!state.selectedAnswer || state.phase !== 'waiting') return;

    var problem = state.currentProblem;
    var isCorrect = state.selectedAnswer === problem.correctAnswer;
    var timeSpent = Math.round((Date.now() - state.startTime) / 1000);

    // Disable choices
    var btns = els.choices.querySelectorAll('.choice-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].disabled = true;
      var letter = btns[i].getAttribute('data-letter');
      if (letter === problem.correctAnswer) {
        btns[i].classList.add(isCorrect ? 'correct' : 'reveal-correct');
      }
      if (letter === state.selectedAnswer && !isCorrect) {
        btns[i].classList.add('wrong');
      }
    }

    els.submitBtn.disabled = true;
    els.hintBtn.disabled = true;

    // Record result
    recordProblem(state.progress, problem.topic, problem.subtopic, problem.difficulty, isCorrect, timeSpent);

    if (isCorrect) {
      handleCorrect(problem);
    } else {
      handleWrong(problem);
    }

    // Update UI stats
    updateStatsDisplay();
    updateProgressBars();
  }

  function handleCorrect(problem) {
    state.phase = 'correct';
    setMametchiState('problemMametchi', 'happy');
    typeDialog(problem.mametchiCorrect || "Amazing! You got it right!");

    // Show solution briefly
    els.solutionCard.classList.remove('hidden');
    els.solutionHeader.textContent = 'Correct!';
    els.solutionHeader.className = 'solution-header correct';
    els.solutionText.textContent = problem.solution;
    renderMathIn(els.solutionText);
    els.nextBtn.textContent = 'Next Problem';
    els.answerSection.style.display = 'none';
  }

  function handleWrong(problem) {
    state.phase = 'wrong';
    state.originalProblem = problem;
    setMametchiState('problemMametchi', 'encourage');
    typeDialog(problem.mametchiWrong || "Don't worry! Let me explain...").then(function() {
      // Show explanation after a brief pause
      setTimeout(function() {
        showExplanation(problem);
      }, 800);
    });
  }

  function showExplanation(problem) {
    state.phase = 'explaining';
    setMametchiState('problemMametchi', 'teaching');
    setDialog("Let me walk you through this step by step!");

    els.solutionCard.classList.remove('hidden');
    els.solutionHeader.textContent = "Let's learn from this!";
    els.solutionHeader.className = 'solution-header wrong';
    els.solutionText.textContent = problem.solution;
    renderMathIn(els.solutionText);
    els.nextBtn.textContent = "Got it! Let's try a similar one";
    els.answerSection.style.display = 'none';
  }

  function showHint() {
    if (!state.currentProblem || !state.currentProblem.hint) return;
    els.hintCard.classList.remove('hidden');
    els.hintText.textContent = state.currentProblem.hint;
    renderMathIn(els.hintText);
    els.hintBtn.disabled = true;

    setMametchiState('problemMametchi', 'teaching');
    typeDialog("Here's a little nudge in the right direction!");
  }

  function skipProblem() {
    if (state.phase !== 'waiting') return;
    setDialog("No problem! Let's try something else.");
    loadNextProblem(null);
  }

  function nextProblem() {
    // If the previous answer was wrong, try a follow-up
    if (state.phase === 'explaining' && state.originalProblem && !state.isFollowUp) {
      loadFollowUp();
      return;
    }
    // Otherwise load a new problem
    loadNextProblem(null);
  }

  function loadFollowUp() {
    state.phase = 'loading';
    state.isFollowUp = true;
    state.selectedAnswer = null;

    setMametchiState('problemMametchi', 'thinking');
    setDialog("Let me find a similar problem to make sure you've got it!");
    els.solutionCard.classList.add('hidden');
    els.hintCard.classList.add('hidden');
    els.answerSection.style.display = 'block';
    els.submitBtn.disabled = true;
    els.hintBtn.disabled = false;

    ProblemManager.getFollowUp(state.originalProblem)
      .then(function(problem) {
        if (problem) {
          problem.mametchiIntro = "Here's a similar one - I know you can get this!";
          presentProblem(problem);
        } else {
          loadNextProblem(null);
        }
      })
      .catch(function() {
        loadNextProblem(null);
      });
  }

  // --- UI Updates ---
  function updateDailyStatsDisplay() {
    var stats = getTodayStats(state.progress);
    els.dailyStats.innerHTML =
      '<div class="daily-stat"><div class="daily-stat-value">' + stats.problems + '</div><div class="daily-stat-label">Problems Today</div></div>' +
      '<div class="daily-stat"><div class="daily-stat-value">' + stats.accuracy + '%</div><div class="daily-stat-label">Accuracy</div></div>' +
      '<div class="daily-stat"><div class="daily-stat-value">' + stats.streak + '</div><div class="daily-stat-label">Current Streak</div></div>' +
      '<div class="daily-stat"><div class="daily-stat-value">' + stats.goal + '</div><div class="daily-stat-label">Daily Goal</div></div>';
  }

  function updateStatsDisplay() {
    var stats = getTodayStats(state.progress);
    document.getElementById('statToday').textContent = 'Today: ' + stats.problems;
    document.getElementById('statAccuracy').textContent = 'Accuracy: ' + stats.accuracy + '%';
    document.getElementById('statStreak').textContent = 'Streak: ' + stats.streak + ' 🔥';
  }

  function updateProgressBars() {
    var topics = { algebra: 'progAlgebra', geometry: 'progGeometry', number_theory: 'progNumberTheory', combinatorics: 'progCombinatorics' };
    for (var topic in topics) {
      var mastery = getTopicMastery(state.progress, topic);
      var el = document.getElementById(topics[topic]);
      if (el) el.style.width = mastery + '%';
    }
  }

  // --- KaTeX Rendering ---
  window.renderMathIn = function(element) {
    if (!element || typeof katex === 'undefined') return;
    var html = element.innerHTML;

    // Render display math $$...$$
    html = html.replace(/\$\$([\s\S]*?)\$\$/g, function(match, tex) {
      try {
        return katex.renderToString(tex, { displayMode: true, throwOnError: false });
      } catch (e) {
        return match;
      }
    });

    // Render inline math $...$
    html = html.replace(/\$([^\$]+?)\$/g, function(match, tex) {
      try {
        return katex.renderToString(tex, { displayMode: false, throwOnError: false });
      } catch (e) {
        return match;
      }
    });

    element.innerHTML = html;
  };

  // --- Startup ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
