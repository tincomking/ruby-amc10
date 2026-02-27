// Main Application - State Machine & UI Logic
// Handles: Practice Mode, Real Exam Mode, Progress Tab
// Step-by-step animated explanations, KaTeX rendering, keyboard shortcuts

(function() {
  // =========================================================================
  // STATE
  // =========================================================================
  var state = {
    activeTab: 'practice',   // practice | exams | progress
    screen: 'welcome',       // welcome | problem (within practice tab)
    phase: 'idle',           // idle | loading | presenting | waiting | correct | wrong | explaining
    currentProblem: null,
    selectedAnswer: null,
    isFollowUp: false,
    originalProblem: null,
    startTime: null,
    progress: null,
    // Step-by-step explanation state
    solutionSteps: [],
    currentStep: 0,
    allStepsShown: false,
    // Exam mode
    examLoaded: false,
    examActive: false,
    examReviewing: false
  };

  // =========================================================================
  // INIT
  // =========================================================================
  function init() {
    state.progress = loadProgress();
    initMametchi();
    bindEvents();
    showTab('practice');
    updateDailyStatsDisplay();
    updateProgressBars();
    updateSessionStats();

    // Pre-load exam index in background
    if (typeof ExamMode !== 'undefined') {
      ExamMode.loadExamIndex().then(function() {
        state.examLoaded = true;
      }).catch(function(e) {
        console.warn('Could not preload exam index:', e);
      });
    }
  }

  // =========================================================================
  // ELEMENT HELPERS - get by ID with null safety
  // =========================================================================
  function $(id) {
    return document.getElementById(id);
  }

  // =========================================================================
  // TAB NAVIGATION
  // =========================================================================
  function showTab(tabName) {
    state.activeTab = tabName;

    // Update tab buttons
    var tabBtns = document.querySelectorAll('.tab-btn');
    for (var i = 0; i < tabBtns.length; i++) {
      var btn = tabBtns[i];
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    }

    // Update tab panels
    var panels = document.querySelectorAll('.tab-panel');
    for (var j = 0; j < panels.length; j++) {
      var panel = panels[j];
      var isActive = panel.getAttribute('data-panel') === tabName;
      panel.classList.toggle('active', isActive);
      panel.style.display = isActive ? 'block' : 'none';
    }

    // Animate tab indicator
    updateTabIndicator(tabName);

    // Handle practice sub-screens
    if (tabName === 'practice') {
      showPracticeScreen(state.screen);
    }

    // Build exam selector when switching to exams tab
    if (tabName === 'exams' && state.examLoaded) {
      buildExamSelector();
    } else if (tabName === 'exams' && !state.examLoaded) {
      if (typeof ExamMode !== 'undefined') {
        ExamMode.loadExamIndex().then(function() {
          state.examLoaded = true;
          buildExamSelector();
        }).catch(function(e) {
          console.error('Failed to load exam data:', e);
        });
      }
    }

    // Build progress tab
    if (tabName === 'progress') {
      buildProgressTab();
    }
  }

  function updateTabIndicator(tabName) {
    var indicator = $('tabIndicator');
    var activeBtn = document.querySelector('.tab-btn[data-tab="' + tabName + '"]');
    if (indicator && activeBtn) {
      var rect = activeBtn.getBoundingClientRect();
      var navRect = activeBtn.parentElement.getBoundingClientRect();
      indicator.style.width = rect.width + 'px';
      indicator.style.left = (rect.left - navRect.left) + 'px';
    }
  }

  function showPracticeScreen(name) {
    state.screen = name;
    var welcomeEl = $('welcomeScreen');
    var problemEl = $('problemScreen');

    if (welcomeEl) {
      welcomeEl.style.display = (name === 'welcome') ? 'block' : 'none';
      welcomeEl.classList.toggle('active', name === 'welcome');
    }
    if (problemEl) {
      problemEl.style.display = (name === 'problem') ? 'block' : 'none';
      problemEl.classList.toggle('active', name === 'problem');
    }
  }

  function showExamScreen(name) {
    // name: 'select' | 'active' | 'results'
    var screens = ['examSelectScreen', 'examActiveScreen', 'examResultsScreen'];
    var map = { select: 'examSelectScreen', active: 'examActiveScreen', results: 'examResultsScreen' };
    for (var i = 0; i < screens.length; i++) {
      var el = $(screens[i]);
      if (el) {
        var show = screens[i] === map[name];
        el.style.display = show ? 'block' : 'none';
        el.classList.toggle('active', show);
      }
    }
  }

  // =========================================================================
  // EVENTS
  // =========================================================================
  function bindEvents() {
    // Tab buttons
    var tabBtns = document.querySelectorAll('.tab-btn');
    for (var i = 0; i < tabBtns.length; i++) {
      tabBtns[i].addEventListener('click', function() {
        var tab = this.getAttribute('data-tab');
        if (tab) showTab(tab);
      });
    }

    // Topic buttons
    var topicBtns = document.querySelectorAll('.topic-btn');
    for (var j = 0; j < topicBtns.length; j++) {
      topicBtns[j].addEventListener('click', function() {
        var topic = this.getAttribute('data-topic');
        startPractice(topic);
      });
    }

    // Practice buttons
    safeClick('submitBtn', submitAnswer);
    safeClick('hintBtn', showHint);
    safeClick('skipBtn', skipProblem);
    safeClick('nextBtn', nextProblem);
    safeClick('backToTopics', function() {
      showPracticeScreen('welcome');
      updateDailyStatsDisplay();
    });

    // Exam selector events
    var yearSelect = $('examYear');
    if (yearSelect) {
      yearSelect.addEventListener('change', onExamYearChange);
    }
    var variantSelect = $('examVariant');
    if (variantSelect) {
      variantSelect.addEventListener('change', onExamVariantChange);
    }
    safeClick('startExamBtn', startSelectedExam);
    safeClick('examPrevBtn', examPrev);
    safeClick('examNextBtn', examNext);
    safeClick('examSubmitAllBtn', examFinish);
    safeClick('examQuitBtn', examQuit);
    safeClick('examReviewBtn', examStartReview);
    safeClick('examRetakeBtn', function() {
      ExamMode.resetExam();
      state.examActive = false;
      state.examReviewing = false;
      showExamScreen('select');
      buildExamSelector();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeydown);

    // Re-calc tab indicator on window resize
    window.addEventListener('resize', function() {
      updateTabIndicator(state.activeTab);
    });
  }

  function safeClick(id, fn) {
    var el = $(id);
    if (el) el.addEventListener('click', fn);
  }

  // =========================================================================
  // KEYBOARD SHORTCUTS
  // =========================================================================
  function handleKeydown(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;

    // --- Practice Mode ---
    if (state.activeTab === 'practice' && state.screen === 'problem') {
      if (state.phase === 'waiting') {
        var key = e.key.toUpperCase();
        var idx = 'ABCDE'.indexOf(key);
        if (idx >= 0) { selectChoice(key); return; }
        if (e.key === 'Enter' && state.selectedAnswer) { e.preventDefault(); submitAnswer(); return; }
      }
      if (state.phase === 'explaining' && !state.allStepsShown && e.key === ' ') {
        e.preventDefault(); showNextStep(); return;
      }
      if ((state.phase === 'correct' || (state.phase === 'explaining' && state.allStepsShown)) && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault(); nextProblem(); return;
      }
    }

    // --- Exam Mode ---
    if (state.activeTab === 'exams' && state.examActive && !state.examReviewing) {
      var key2 = e.key.toUpperCase();
      var idx2 = 'ABCDE'.indexOf(key2);
      if (idx2 >= 0) { examSelectChoice(key2); return; }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); examNext(); return; }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); examPrev(); return; }
    }
  }

  // =========================================================================
  // PRACTICE MODE
  // =========================================================================
  function startPractice(requestedTopic) {
    showTab('practice');
    showPracticeScreen('problem');
    loadNextProblem(requestedTopic);
  }

  function loadNextProblem(requestedTopic) {
    state.phase = 'loading';
    state.selectedAnswer = null;
    state.isFollowUp = false;
    state.originalProblem = null;
    state.solutionSteps = [];
    state.currentStep = 0;
    state.allStepsShown = false;

    // Reset UI
    setMametchiState('problemMametchi', 'thinking');
    setDialog('Hmm, let me find a good problem for you...');
    addClass('hintCard', 'hidden');
    addClass('solutionCard', 'hidden');
    var answerSection = $('answerSection');
    if (answerSection) answerSection.style.display = 'block';
    var submitBtn = $('submitBtn');
    if (submitBtn) submitBtn.disabled = true;
    var hintBtn = $('hintBtn');
    if (hintBtn) hintBtn.disabled = false;
    var choicesEl = $('choices');
    if (choicesEl) choicesEl.innerHTML = '';

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

    var topicLabels = {
      algebra: 'Algebra', geometry: 'Geometry',
      number_theory: 'Number Theory', combinatorics: 'Combinatorics'
    };
    var diffLabels = { 1: 'Easy', 2: 'Medium', 3: 'Medium', 4: 'Hard', 5: 'Challenge' };

    setText('problemTopic', topicLabels[problem.topic] || problem.topic);
    var diffEl = $('problemDifficulty');
    if (diffEl) {
      diffEl.textContent = diffLabels[problem.difficulty] || 'Level ' + problem.difficulty;
      diffEl.setAttribute('data-level', problem.difficulty);
    }

    var todayStats = getTodayStats(state.progress);
    setText('problemCounter', '#' + (todayStats.problems + 1));

    var textEl = $('problemText');
    if (textEl) {
      textEl.textContent = problem.problem;
      renderMathIn(textEl);
    }

    renderChoices(problem.choices, 'choices');

    setMametchiState('problemMametchi', 'normal');
    typeDialog(problem.mametchiIntro || "Let's try this one!").then(function() {
      state.phase = 'waiting';
    });

    if (typeof ProblemManager !== 'undefined') {
      ProblemManager.prefetchNext(state.progress);
    }
  }

  function renderChoices(choices, containerId) {
    var container = $(containerId);
    if (!container) return;
    container.innerHTML = '';
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
      var choiceText = choices[i].replace(/^\([A-E]\)\s*/, '');
      textSpan.textContent = choiceText;

      btn.appendChild(letterSpan);
      btn.appendChild(textSpan);

      btn.addEventListener('click', (function(letter, cid) {
        return function() {
          if (cid === 'choices' && state.phase === 'waiting') {
            selectChoice(letter);
          } else if (cid === 'examChoices' && state.examActive && !state.examReviewing) {
            examSelectChoice(letter);
          }
        };
      })(letters[i], containerId));

      container.appendChild(btn);
      renderMathIn(textSpan);
    }
  }

  function selectChoice(letter) {
    state.selectedAnswer = letter;
    var submitBtn = $('submitBtn');
    if (submitBtn) submitBtn.disabled = false;

    var choicesEl = $('choices');
    if (!choicesEl) return;
    var btns = choicesEl.querySelectorAll('.choice-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('selected', btns[i].getAttribute('data-letter') === letter);
    }
  }

  function submitAnswer() {
    if (!state.selectedAnswer || state.phase !== 'waiting') return;

    var problem = state.currentProblem;
    var isCorrect = state.selectedAnswer === problem.correctAnswer;
    var timeSpent = Math.round((Date.now() - state.startTime) / 1000);

    var choicesEl = $('choices');
    if (choicesEl) {
      var btns = choicesEl.querySelectorAll('.choice-btn');
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
    }

    var submitBtn = $('submitBtn');
    if (submitBtn) submitBtn.disabled = true;
    var hintBtn = $('hintBtn');
    if (hintBtn) hintBtn.disabled = true;

    recordProblem(state.progress, problem.topic, problem.subtopic, problem.difficulty, isCorrect, timeSpent);

    if (isCorrect) {
      handleCorrect(problem);
    } else {
      handleWrong(problem);
    }

    updateSessionStats();
    updateProgressBars();
  }

  function handleCorrect(problem) {
    state.phase = 'correct';
    setMametchiState('problemMametchi', 'happy');
    typeDialog(problem.mametchiCorrect || "Amazing! You got it right!");

    removeClass('solutionCard', 'hidden');
    var header = $('solutionHeader');
    if (header) {
      header.textContent = 'Correct!';
      header.className = 'solution-header correct';
    }

    var solutionText = problem.solution || '';
    if (problem.solutions && problem.solutions.length > 0) {
      solutionText = problem.solutions[0].text || solutionText;
    }

    // Show simple text, hide steps
    var textEl = $('solutionText');
    if (textEl) {
      textEl.textContent = solutionText;
      renderMathIn(textEl);
      textEl.style.display = 'block';
    }
    var stepsEl = $('solutionSteps');
    if (stepsEl) stepsEl.style.display = 'none';

    var nextBtn = $('nextBtn');
    if (nextBtn) {
      nextBtn.textContent = 'Next Problem';
      nextBtn.style.display = 'inline-block';
    }

    var answerSection = $('answerSection');
    if (answerSection) answerSection.style.display = 'none';
  }

  function handleWrong(problem) {
    state.phase = 'wrong';
    state.originalProblem = problem;
    setMametchiState('problemMametchi', 'encourage');
    typeDialog(problem.mametchiWrong || "Don't worry! Let me explain...").then(function() {
      setTimeout(function() {
        showStepByStepExplanation(problem);
      }, 800);
    });
  }

  // =========================================================================
  // STEP-BY-STEP ANIMATED EXPLANATION
  // =========================================================================
  function showStepByStepExplanation(problem) {
    state.phase = 'explaining';
    setMametchiState('problemMametchi', 'teaching');
    setDialog("Let me walk you through this step by step!");

    var solutionText = problem.solution || '';
    if (problem.solutions && problem.solutions.length > 0) {
      solutionText = problem.solutions[0].text || solutionText;
    }

    var steps = splitIntoSteps(solutionText);
    state.solutionSteps = steps;
    state.currentStep = 0;
    state.allStepsShown = false;

    removeClass('solutionCard', 'hidden');

    var header = $('solutionHeader');
    if (header) {
      header.textContent = "Let's learn from this!";
      header.className = 'solution-header wrong';
    }

    // Hide plain text
    var textEl = $('solutionText');
    if (textEl) textEl.style.display = 'none';

    // Build steps container
    var stepsEl = $('solutionSteps');
    if (stepsEl) {
      stepsEl.innerHTML = '';
      stepsEl.style.display = 'block';

      for (var i = 0; i < steps.length; i++) {
        var stepDiv = document.createElement('div');
        stepDiv.className = 'solution-step';
        stepDiv.setAttribute('data-step', i);

        var badge = document.createElement('div');
        badge.className = 'solution-step-number';
        badge.textContent = (i + 1);

        var content = document.createElement('div');
        content.className = 'solution-step-content';
        content.textContent = steps[i];

        stepDiv.appendChild(badge);
        stepDiv.appendChild(content);
        stepsEl.appendChild(stepDiv);
      }

      // Show first step
      revealStep(0);
    }

    // Update the next button to act as "Next Step" when there are multiple steps
    var nextBtn = $('nextBtn');
    if (nextBtn) {
      if (steps.length > 1) {
        nextBtn.textContent = 'Next Step \u2192';
        nextBtn.style.display = 'inline-block';
        // Temporarily rebind to step advancement
        nextBtn._stepMode = true;
      } else {
        state.allStepsShown = true;
        nextBtn.textContent = "Got it! Let's try a similar one";
        nextBtn.style.display = 'inline-block';
        nextBtn._stepMode = false;
      }
    }

    var answerSection = $('answerSection');
    if (answerSection) answerSection.style.display = 'none';
  }

  function revealStep(index) {
    var stepsEl = $('solutionSteps');
    if (!stepsEl) return;
    var stepDiv = stepsEl.querySelector('[data-step="' + index + '"]');
    if (stepDiv) {
      setTimeout(function() {
        stepDiv.classList.add('step-visible');
        var content = stepDiv.querySelector('.solution-step-content');
        if (content) renderMathIn(content);
      }, 50);
    }
  }

  function showNextStep() {
    state.currentStep++;

    if (state.currentStep >= state.solutionSteps.length) {
      state.allStepsShown = true;
      var nextBtn = $('nextBtn');
      if (nextBtn) {
        nextBtn.textContent = "Got it! Let's try a similar one";
        nextBtn._stepMode = false;
      }
      setMametchiState('problemMametchi', 'encourage');
      setDialog("Take your time to understand each step. When you're ready, let's try a similar one!");
      return;
    }

    revealStep(state.currentStep);

    var nextBtn = $('nextBtn');
    if (nextBtn) {
      if (state.currentStep >= state.solutionSteps.length - 1) {
        nextBtn.textContent = 'Show Final Step';
      }
    }
  }

  function splitIntoSteps(solutionText) {
    if (!solutionText) return ['No solution available.'];

    // Split by double newlines, numbered lines, or "Step" markers
    var steps = solutionText.split(/\n\n+/).filter(function(s) { return s.trim().length > 0; });

    // If only 1 step and it's long, try splitting by sentence boundaries after math
    if (steps.length <= 1 && solutionText.length > 200) {
      steps = solutionText.split(/\.\s+(?=[A-Z$\\])/).filter(function(s) { return s.trim().length > 0; });
      steps = steps.map(function(s, i) {
        return i < steps.length - 1 ? s + '.' : s;
      });
    }

    // If still only 1 step and it's long, split by sentences
    if (steps.length <= 1 && solutionText.length > 300) {
      steps = solutionText.split(/\.\s+/).filter(function(s) { return s.trim().length > 0; });
      steps = steps.map(function(s, i) {
        return i < steps.length - 1 ? s + '.' : s;
      });
    }

    // Cap at 8 steps max
    if (steps.length > 8) {
      var merged = [];
      var perGroup = Math.ceil(steps.length / 6);
      for (var i = 0; i < steps.length; i += perGroup) {
        merged.push(steps.slice(i, i + perGroup).join(' '));
      }
      steps = merged;
    }

    if (steps.length === 0) steps = [solutionText];
    return steps;
  }

  // =========================================================================
  // PRACTICE HELPERS
  // =========================================================================
  function showHint() {
    if (!state.currentProblem || !state.currentProblem.hint) return;
    removeClass('hintCard', 'hidden');
    var hintText = $('hintText');
    if (hintText) {
      hintText.textContent = state.currentProblem.hint;
      renderMathIn(hintText);
    }
    var hintBtn = $('hintBtn');
    if (hintBtn) hintBtn.disabled = true;

    setMametchiState('problemMametchi', 'teaching');
    typeDialog("Here's a little nudge in the right direction!");
  }

  function skipProblem() {
    if (state.phase !== 'waiting') return;
    setDialog("No problem! Let's try something else.");
    loadNextProblem(null);
  }

  function nextProblem() {
    // If in step mode, advance step instead
    var nextBtn = $('nextBtn');
    if (nextBtn && nextBtn._stepMode && state.phase === 'explaining' && !state.allStepsShown) {
      showNextStep();
      return;
    }

    // If the previous answer was wrong, try a follow-up
    if (state.phase === 'explaining' && state.originalProblem && !state.isFollowUp) {
      loadFollowUp();
      return;
    }
    loadNextProblem(null);
  }

  function loadFollowUp() {
    state.phase = 'loading';
    state.isFollowUp = true;
    state.selectedAnswer = null;

    setMametchiState('problemMametchi', 'thinking');
    setDialog("Let me find a similar problem to make sure you've got it!");
    addClass('solutionCard', 'hidden');
    addClass('hintCard', 'hidden');
    var answerSection = $('answerSection');
    if (answerSection) answerSection.style.display = 'block';
    var submitBtn = $('submitBtn');
    if (submitBtn) submitBtn.disabled = true;
    var hintBtn = $('hintBtn');
    if (hintBtn) hintBtn.disabled = false;

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

  // =========================================================================
  // EXAM MODE
  // =========================================================================
  function buildExamSelector() {
    if (typeof ExamMode === 'undefined' || !state.examLoaded) return;

    showExamScreen('select');

    // Populate year dropdown
    var yearSelect = $('examYear');
    if (yearSelect && yearSelect.options.length <= 1) {
      var years = ExamMode.getYears();
      yearSelect.innerHTML = '<option value="">Select Year</option>';
      for (var i = 0; i < years.length; i++) {
        var opt = document.createElement('option');
        opt.value = years[i];
        opt.textContent = years[i];
        yearSelect.appendChild(opt);
      }
    }

    // Show past exam scores
    buildExamHistory();

    // Hide preview card initially
    addClass('examPreviewCard', 'hidden');
  }

  function onExamYearChange() {
    var yearSelect = $('examYear');
    var variantSelect = $('examVariant');
    if (!yearSelect || !variantSelect) return;

    var year = parseInt(yearSelect.value);
    if (!year) {
      addClass('examPreviewCard', 'hidden');
      return;
    }

    // Update variant options based on available exams for this year
    var exams = ExamMode.getExamsForYear(year);
    variantSelect.innerHTML = '<option value="">Select Test</option>';
    for (var i = 0; i < exams.length; i++) {
      var opt = document.createElement('option');
      opt.value = exams[i].key;
      opt.textContent = exams[i].test + ' (' + exams[i].count + ' problems)';
      variantSelect.appendChild(opt);
    }

    // Auto-select if only one option
    if (exams.length === 1) {
      variantSelect.value = exams[0].key;
      onExamVariantChange();
    } else {
      addClass('examPreviewCard', 'hidden');
    }
  }

  function onExamVariantChange() {
    var variantSelect = $('examVariant');
    if (!variantSelect) return;

    var examKey = variantSelect.value;
    if (!examKey) {
      addClass('examPreviewCard', 'hidden');
      return;
    }

    // Show preview card
    var title = $('examPreviewTitle');
    if (title) title.textContent = examKey;
    removeClass('examPreviewCard', 'hidden');
  }

  function startSelectedExam() {
    var variantSelect = $('examVariant');
    if (!variantSelect || !variantSelect.value) {
      alert('Please select a year and test first.');
      return;
    }
    startExam(variantSelect.value);
  }

  function startExam(examKey) {
    try {
      var info = ExamMode.startExam(examKey, 75, function(remaining) {
        updateExamTimerDisplay(remaining);
      });

      state.examActive = true;
      state.examReviewing = false;

      // Set title
      setText('examTitleBar', info.label);
      setText('examTimerText', '75:00');

      showExamScreen('active');
      showExamProblem();

    } catch (e) {
      console.error('Failed to start exam:', e);
      alert('Failed to start exam: ' + e.message);
    }
  }

  function showExamProblem() {
    var prob = ExamMode.getCurrentProblem();
    if (!prob) return;

    // Update problem number
    setText('examProblemNumber', 'Problem ' + prob.number);

    // Update progress
    var total = ExamMode.getTotalProblems();
    var answered = ExamMode.getAnswerStatus().filter(function(s) { return s.isAnswered; }).length;
    setText('examProgressText', answered + ' / ' + total);
    var fillEl = $('examProgressFill');
    if (fillEl) fillEl.style.width = (answered / total * 100) + '%';

    // Update problem text
    var textEl = $('examProblemText');
    if (textEl) {
      textEl.textContent = prob.problem;
      renderMathIn(textEl);
    }

    // Render choices
    var choicesEl = $('examChoices');
    if (choicesEl) {
      choicesEl.innerHTML = '';
      var letters = ['A', 'B', 'C', 'D', 'E'];

      for (var i = 0; i < prob.choices.length; i++) {
        var btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.setAttribute('data-letter', letters[i]);

        var letterSpan = document.createElement('span');
        letterSpan.className = 'choice-letter';
        letterSpan.textContent = letters[i];

        var textSpan = document.createElement('span');
        textSpan.className = 'choice-text';
        textSpan.textContent = prob.choices[i].replace(/^\([A-E]\)\s*/, '');

        btn.appendChild(letterSpan);
        btn.appendChild(textSpan);

        // In review mode, show correct/wrong
        if (state.examReviewing) {
          var results = ExamMode.getResults();
          if (results && results.details[prob.index]) {
            var detail = results.details[prob.index];
            if (letters[i] === prob.correctAnswer) {
              btn.classList.add('reveal-correct');
            }
            if (detail.userAnswer === letters[i] && detail.isWrong) {
              btn.classList.add('wrong');
            }
            if (detail.userAnswer === letters[i] && detail.isCorrect) {
              btn.classList.add('correct');
            }
          }
          btn.disabled = true;
        } else {
          if (prob.selectedAnswer === letters[i]) {
            btn.classList.add('selected');
          }
          btn.addEventListener('click', (function(letter) {
            return function() { examSelectChoice(letter); };
          })(letters[i]));
        }

        choicesEl.appendChild(btn);
        renderMathIn(textSpan);
      }

      // Show solution in review mode
      if (state.examReviewing) {
        var existingSol = choicesEl.parentElement.querySelector('.exam-review-solution');
        if (existingSol) existingSol.remove();

        if (prob.solutions && prob.solutions.length > 0) {
          var solDiv = document.createElement('div');
          solDiv.className = 'exam-review-solution solution-card';
          solDiv.innerHTML = '<div class="solution-header">' + escapeHtml(prob.solutions[0].title || 'Solution') + '</div>' +
            '<div class="solution-text">' + escapeHtml(prob.solutions[0].text || '') + '</div>';
          choicesEl.parentElement.appendChild(solDiv);
          renderMathIn(solDiv);
        }
      }
    }

    // Problem navigation dots
    buildExamDots();

    // Nav buttons
    var prevBtn = $('examPrevBtn');
    var nextBtn = $('examNextBtn');
    if (prevBtn) prevBtn.disabled = (prob.index === 0);
    if (nextBtn) nextBtn.disabled = (prob.index === prob.total - 1);

    // Show submit section on last problem or when most are answered
    var submitSection = $('examSubmitSection');
    if (submitSection) {
      if (prob.index === prob.total - 1 || answered >= total - 2) {
        removeClass('examSubmitSection', 'hidden');
        var unansweredEl = $('examUnanswered');
        var unanswered = total - answered;
        if (unansweredEl) {
          unansweredEl.textContent = unanswered > 0 ? '(' + unanswered + ' unanswered)' : '';
        }
      } else {
        addClass('examSubmitSection', 'hidden');
      }
    }
  }

  function buildExamDots() {
    var dotsEl = $('examProblemDots');
    if (!dotsEl) return;
    var status = ExamMode.getAnswerStatus();
    var currentIdx = ExamMode.getCurrentIndex();
    dotsEl.innerHTML = '';

    for (var i = 0; i < status.length; i++) {
      var dot = document.createElement('span');
      dot.className = 'exam-dot';
      if (status[i].isAnswered) dot.classList.add('dot-answered');
      if (i === currentIdx) dot.classList.add('dot-current');
      dot.textContent = status[i].number;
      dot.setAttribute('data-index', i);
      dot.addEventListener('click', (function(idx) {
        return function() {
          ExamMode.goToProblem(idx);
          showExamProblem();
        };
      })(i));
      dotsEl.appendChild(dot);
    }
  }

  function examSelectChoice(letter) {
    if (state.examReviewing) return;
    ExamMode.selectAnswer(letter);

    var choicesEl = $('examChoices');
    if (choicesEl) {
      var btns = choicesEl.querySelectorAll('.choice-btn');
      for (var i = 0; i < btns.length; i++) {
        btns[i].classList.toggle('selected', btns[i].getAttribute('data-letter') === letter);
      }
    }

    // Refresh dots and progress
    buildExamDots();
    var total = ExamMode.getTotalProblems();
    var answered = ExamMode.getAnswerStatus().filter(function(s) { return s.isAnswered; }).length;
    setText('examProgressText', answered + ' / ' + total);
    var fillEl = $('examProgressFill');
    if (fillEl) fillEl.style.width = (answered / total * 100) + '%';
  }

  function examNext() {
    ExamMode.nextProblem();
    showExamProblem();
  }

  function examPrev() {
    ExamMode.prevProblem();
    showExamProblem();
  }

  function examQuit() {
    if (!confirm('Are you sure you want to quit? Your progress will be lost.')) return;
    ExamMode.resetExam();
    state.examActive = false;
    state.examReviewing = false;
    showExamScreen('select');
  }

  function examFinish() {
    if (!ExamMode.isActive()) return;

    var status = ExamMode.getAnswerStatus();
    var unanswered = status.filter(function(s) { return !s.isAnswered; }).length;

    if (unanswered > 0) {
      if (!confirm('You have ' + unanswered + ' unanswered problem(s). Are you sure you want to submit?')) {
        return;
      }
    }

    var results = ExamMode.finishExam();
    ExamMode.saveExamResult(results);
    showExamResults(results);
  }

  function showExamResults(results) {
    state.examActive = false;
    state.examReviewing = false;

    showExamScreen('results');

    // Mametchi commentary
    var pct = results.percentage;
    var commentary = '';
    var mState = 'normal';
    if (pct >= 90) { commentary = "INCREDIBLE, Ruby! You absolutely crushed this exam!"; mState = 'happy'; }
    else if (pct >= 75) { commentary = "Great job, Ruby! That's a really strong score!"; mState = 'happy'; }
    else if (pct >= 60) { commentary = "Nice work, Ruby! Let's review the ones you missed."; mState = 'normal'; }
    else if (pct >= 40) { commentary = "Good effort! Every exam is a learning opportunity."; mState = 'encourage'; }
    else { commentary = "Don't worry! Let's review together and try again!"; mState = 'encourage'; }

    setMametchiState('examResultsMametchi', mState);
    setText('examResultsSubtitle', results.label);
    setText('examScoreBig', results.score.toFixed(1));
    setText('examCorrectCount', results.correct);
    setText('examWrongCount', results.wrong);
    setText('examBlankCount', results.blank);
    setText('examTimeUsed', results.timeFormatted);

    var titleEl = $('examResultsTitle');
    if (titleEl) titleEl.textContent = commentary;
  }

  function examStartReview() {
    state.examReviewing = true;
    state.examActive = true;

    showExamScreen('active');

    setText('examTimerText', 'Review');
    setText('examTitleBar', (ExamMode.getResults() ? ExamMode.getResults().label : '') + ' - Review');

    // Hide submit section
    addClass('examSubmitSection', 'hidden');

    ExamMode.goToProblem(0);
    showExamProblem();
  }

  function updateExamTimerDisplay(remaining) {
    var timerText = $('examTimerText');
    if (timerText && remaining) {
      timerText.textContent = remaining.formatted;
      var timerEl = $('examTimer');
      if (timerEl) {
        if (remaining.total < 300) timerEl.classList.add('timer-warning');
        else timerEl.classList.remove('timer-warning');
      }
      if (remaining.total <= 0 && ExamMode.isActive()) {
        var results = ExamMode.finishExam();
        ExamMode.saveExamResult(results);
        showExamResults(results);
      }
    }
  }

  function buildExamHistory() {
    var listEl = $('examHistoryList');
    if (!listEl) return;

    var pastResults = [];
    if (typeof ExamMode !== 'undefined') {
      pastResults = ExamMode.getPastResults();
    }

    if (pastResults.length === 0) {
      listEl.innerHTML = '<div class="exam-history-empty">No exams taken yet. Pick one above to start!</div>';
      return;
    }

    var html = '';
    var display = pastResults.slice(-8).reverse();
    for (var i = 0; i < display.length; i++) {
      var r = display[i];
      html += '<div class="exam-history-item">';
      html += '<span class="exam-history-label">' + escapeHtml(r.label) + '</span>';
      html += '<span class="exam-history-score">' + r.score.toFixed(1) + '/' + r.maxScore + '</span>';
      html += '<span class="exam-history-date">' + (r.date ? r.date.slice(0, 10) : '') + '</span>';
      html += '</div>';
    }
    listEl.innerHTML = html;
  }

  // =========================================================================
  // PROGRESS TAB
  // =========================================================================
  function buildProgressTab() {
    var progress = state.progress;
    var todayStats = getTodayStats(progress);

    // Overall stats
    setText('progTotalProblems', progress.student.totalProblems);
    var accuracy = progress.student.totalProblems > 0
      ? Math.round(100 * progress.student.totalCorrect / progress.student.totalProblems) + '%'
      : '--%';
    setText('progOverallAccuracy', accuracy);
    setText('progBestStreak', progress.student.bestStreak);

    // Days active
    var daysActive = Object.keys(progress.dailyStats || {}).length;
    setText('progDaysActive', daysActive);

    // Topic mastery bars
    var topics = {
      algebra: { bar: 'progAlgebra', pct: 'progAlgebraPct' },
      geometry: { bar: 'progGeometry', pct: 'progGeometryPct' },
      number_theory: { bar: 'progNumberTheory', pct: 'progNumberTheoryPct' },
      combinatorics: { bar: 'progCombinatorics', pct: 'progCombinatoricsPct' }
    };
    for (var topic in topics) {
      var mastery = getTopicMastery(progress, topic);
      var barEl = $(topics[topic].bar);
      var pctEl = $(topics[topic].pct);
      if (barEl) barEl.style.width = mastery + '%';
      if (pctEl) pctEl.textContent = mastery + '%';
    }

    // Weekly activity bars
    buildWeeklyActivity(progress);

    // Progress subtitle
    var subtitle = $('progressSubtitle');
    if (subtitle) {
      if (progress.student.totalProblems === 0) {
        subtitle.textContent = "Start practicing to see your progress here!";
      } else if (todayStats.problems > 0) {
        subtitle.textContent = "You've done " + todayStats.problems + " problem" + (todayStats.problems > 1 ? 's' : '') + " today. Keep it up!";
      } else {
        subtitle.textContent = "Welcome back, Ruby! Ready for today's practice?";
      }
    }

    // Set Mametchi
    setMametchiState('progressMametchi', progress.student.totalProblems > 0 ? 'happy' : 'normal');
  }

  function buildWeeklyActivity(progress) {
    var dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    var now = new Date();
    var today = now.getDay(); // 0=Sun

    // Get this week's data (Mon-Sun)
    for (var i = 0; i < 7; i++) {
      var dayOffset = i - ((today + 6) % 7); // offset from Monday
      var date = new Date(now);
      date.setDate(date.getDate() + dayOffset);
      var dateKey = date.toISOString().slice(0, 10);
      var dayStats = progress.dailyStats[dateKey];
      var count = dayStats ? dayStats.problems : 0;

      // Map day index to day name for data attribute
      var dayOfWeek = date.getDay();
      var dayName = dayNames[dayOfWeek];

      var barFill = document.querySelector('[data-day="' + dayName + '"]');
      if (barFill) {
        var maxHeight = 100; // percentage
        var height = Math.min(maxHeight, count * 5); // 5% per problem, max 100%
        barFill.style.height = height + '%';
        barFill.title = dateKey + ': ' + count + ' problems';
      }
    }
  }

  // =========================================================================
  // UI HELPERS
  // =========================================================================
  function addClass(id, cls) {
    var el = $(id);
    if (el) el.classList.add(cls);
  }

  function removeClass(id, cls) {
    var el = $(id);
    if (el) el.classList.remove(cls);
  }

  function setText(id, text) {
    var el = $(id);
    if (el) el.textContent = text;
  }

  function showLoading(msg) {
    var overlay = $('loadingOverlay');
    if (overlay) overlay.classList.remove('hidden');
    var text = overlay ? overlay.querySelector('.loading-text') : null;
    if (text) text.textContent = msg || 'Mametchi is thinking...';
  }

  function hideLoading() {
    var overlay = $('loadingOverlay');
    if (overlay) overlay.classList.add('hidden');
  }

  function updateDailyStatsDisplay() {
    var statsEl = $('dailyStats');
    if (!statsEl) return;
    var stats = getTodayStats(state.progress);
    statsEl.innerHTML =
      '<div class="daily-stat"><div class="daily-stat-value">' + stats.problems + '</div><div class="daily-stat-label">Problems Today</div></div>' +
      '<div class="daily-stat"><div class="daily-stat-value">' + stats.accuracy + '%</div><div class="daily-stat-label">Accuracy</div></div>' +
      '<div class="daily-stat"><div class="daily-stat-value">' + stats.streak + '</div><div class="daily-stat-label">Current Streak</div></div>' +
      '<div class="daily-stat"><div class="daily-stat-value">' + stats.goal + '</div><div class="daily-stat-label">Daily Goal</div></div>';

    // Also update header streak
    var headerStreak = $('headerStreak');
    if (headerStreak) headerStreak.textContent = stats.streak;
  }

  function updateSessionStats() {
    var stats = getTodayStats(state.progress);
    setText('statToday', 'Today: ' + stats.problems);
    setText('statAccuracy', 'Accuracy: ' + stats.accuracy + '%');
    setText('statStreak', 'Streak: ' + stats.streak);

    var headerStreak = $('headerStreak');
    if (headerStreak) headerStreak.textContent = stats.streak;
  }

  function updateProgressBars() {
    var topics = {
      algebra: ['progAlgebra', 'footProgAlgebra'],
      geometry: ['progGeometry', 'footProgGeometry'],
      number_theory: ['progNumberTheory', 'footProgNumberTheory'],
      combinatorics: ['progCombinatorics', 'footProgCombinatorics']
    };
    for (var topic in topics) {
      var mastery = getTopicMastery(state.progress, topic);
      var ids = topics[topic];
      for (var i = 0; i < ids.length; i++) {
        var el = $(ids[i]);
        if (el) el.style.width = mastery + '%';
      }
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // =========================================================================
  // KATEX RENDERING
  // =========================================================================
  window.renderMathIn = function(element) {
    if (!element || typeof katex === 'undefined') return;
    var html = element.innerHTML;

    // Render display math $$...$$
    html = html.replace(/\$\$([\s\S]*?)\$\$/g, function(match, tex) {
      try {
        return katex.renderToString(tex, { displayMode: true, throwOnError: false, trust: true });
      } catch (e) {
        return match;
      }
    });

    // Render inline math $...$
    html = html.replace(/\$([^\$]+?)\$/g, function(match, tex) {
      try {
        return katex.renderToString(tex, { displayMode: false, throwOnError: false, trust: true });
      } catch (e) {
        return match;
      }
    });

    element.innerHTML = html;
  };

  // =========================================================================
  // STARTUP
  // =========================================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for external use
  window.showTab = showTab;
  window.startPractice = startPractice;
  window.showLoading = showLoading;
  window.hideLoading = hideLoading;

})();
