// Real Exam Mode Manager
// Loads past AMC10 exams from data/exams.json and manages timed exam sessions

var ExamMode = (function() {
  // --- State ---
  var examData = null;        // Full parsed exams.json
  var currentExam = null;     // The exam object currently being taken
  var currentExamKey = null;  // e.g. "2024 AMC 10A"
  var currentIndex = 0;       // Current problem index (0-based)
  var answers = [];           // Array of answers: null = blank, 'A'-'E' = answered
  var startTime = null;       // When exam started (Date.now())
  var timerInterval = null;   // setInterval ID
  var timerCallback = null;   // Function called every second with remaining time
  var examDuration = 75 * 60; // 75 minutes in seconds
  var finished = false;

  // --- Load exam index ---
  function loadExamIndex() {
    if (examData) {
      return Promise.resolve(examData);
    }
    return fetch('data/exams.json')
      .then(function(res) {
        if (!res.ok) throw new Error('Failed to load exams.json: ' + res.status);
        return res.json();
      })
      .then(function(data) {
        examData = data;
        return data;
      });
  }

  // --- Get list of available exams ---
  function getExamList() {
    if (!examData || !examData.exams) return [];
    var list = [];
    for (var key in examData.exams) {
      if (examData.exams.hasOwnProperty(key)) {
        var exam = examData.exams[key];
        list.push({
          key: key,
          label: exam.label,
          year: exam.year,
          test: exam.test,
          count: exam.count || (exam.problems ? exam.problems.length : 0)
        });
      }
    }
    // Sort by year descending, then test name
    list.sort(function(a, b) {
      if (b.year !== a.year) return b.year - a.year;
      return a.test.localeCompare(b.test);
    });
    return list;
  }

  // --- Get available years ---
  function getYears() {
    if (!examData) return [];
    if (examData.years) return examData.years.slice().sort(function(a,b){ return b - a; });
    var years = {};
    var list = getExamList();
    for (var i = 0; i < list.length; i++) {
      years[list[i].year] = true;
    }
    return Object.keys(years).map(Number).sort(function(a,b){ return b - a; });
  }

  // --- Get exams for a specific year ---
  function getExamsForYear(year) {
    var list = getExamList();
    return list.filter(function(e) { return e.year === year; });
  }

  // --- Start an exam ---
  function startExam(examKey, durationMinutes, onTick) {
    if (!examData || !examData.exams[examKey]) {
      throw new Error('Exam not found: ' + examKey);
    }

    currentExam = examData.exams[examKey];
    currentExamKey = examKey;
    currentIndex = 0;
    answers = new Array(currentExam.problems.length);
    for (var i = 0; i < answers.length; i++) {
      answers[i] = null;
    }
    finished = false;
    examDuration = (durationMinutes || 75) * 60;
    startTime = Date.now();
    timerCallback = onTick || null;

    // Start timer
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(function() {
      var remaining = getTimeRemaining();
      if (timerCallback) {
        timerCallback(remaining);
      }
      if (remaining.total <= 0) {
        finishExam();
      }
    }, 1000);

    return {
      examKey: currentExamKey,
      label: currentExam.label,
      totalProblems: currentExam.problems.length,
      duration: examDuration
    };
  }

  // --- Get time remaining ---
  function getTimeRemaining() {
    if (!startTime) return { total: 0, minutes: 0, seconds: 0 };
    var elapsed = Math.floor((Date.now() - startTime) / 1000);
    var remaining = Math.max(0, examDuration - elapsed);
    return {
      total: remaining,
      minutes: Math.floor(remaining / 60),
      seconds: remaining % 60,
      elapsed: elapsed,
      formatted: formatTime(remaining)
    };
  }

  function formatTime(totalSeconds) {
    var m = Math.floor(totalSeconds / 60);
    var s = totalSeconds % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  // --- Get current problem ---
  function getCurrentProblem() {
    if (!currentExam || !currentExam.problems) return null;
    var prob = currentExam.problems[currentIndex];
    if (!prob) return null;
    return {
      index: currentIndex,
      number: prob.number || (currentIndex + 1),
      total: currentExam.problems.length,
      problem: prob.problem,
      choices: prob.choices,
      correctAnswer: prob.correctAnswer,
      solutions: prob.solutions || [],
      id: prob.id,
      selectedAnswer: answers[currentIndex]
    };
  }

  // --- Submit answer for current problem ---
  function submitAnswer(letter) {
    if (finished) return false;
    if (!letter) {
      answers[currentIndex] = null; // blank
    } else {
      var valid = ['A', 'B', 'C', 'D', 'E'];
      if (valid.indexOf(letter.toUpperCase()) === -1) return false;
      answers[currentIndex] = letter.toUpperCase();
    }
    return true;
  }

  // --- Select answer without advancing (for toggling) ---
  function selectAnswer(letter) {
    return submitAnswer(letter);
  }

  // --- Clear answer for current problem ---
  function clearAnswer() {
    if (finished) return;
    answers[currentIndex] = null;
  }

  // --- Navigate ---
  function nextProblem() {
    if (!currentExam) return null;
    if (currentIndex < currentExam.problems.length - 1) {
      currentIndex++;
    }
    return getCurrentProblem();
  }

  function prevProblem() {
    if (!currentExam) return null;
    if (currentIndex > 0) {
      currentIndex--;
    }
    return getCurrentProblem();
  }

  function goToProblem(index) {
    if (!currentExam) return null;
    if (index >= 0 && index < currentExam.problems.length) {
      currentIndex = index;
    }
    return getCurrentProblem();
  }

  // --- Get answer status for all problems ---
  function getAnswerStatus() {
    if (!currentExam) return [];
    var status = [];
    for (var i = 0; i < currentExam.problems.length; i++) {
      status.push({
        index: i,
        number: currentExam.problems[i].number || (i + 1),
        answer: answers[i],
        isAnswered: answers[i] !== null
      });
    }
    return status;
  }

  // --- Finish exam and calculate score ---
  function finishExam() {
    if (finished) return getResults();
    finished = true;

    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    return getResults();
  }

  // --- Calculate and return results ---
  function getResults() {
    if (!currentExam) return null;

    var problems = currentExam.problems;
    var correct = 0;
    var wrong = 0;
    var blank = 0;
    var details = [];

    for (var i = 0; i < problems.length; i++) {
      var prob = problems[i];
      var userAnswer = answers[i];
      var isCorrect = userAnswer !== null && userAnswer === prob.correctAnswer;
      var isBlank = userAnswer === null;
      var isWrong = !isBlank && !isCorrect;

      if (isCorrect) correct++;
      else if (isWrong) wrong++;
      else blank++;

      details.push({
        index: i,
        number: prob.number || (i + 1),
        problem: prob.problem,
        choices: prob.choices,
        correctAnswer: prob.correctAnswer,
        userAnswer: userAnswer,
        isCorrect: isCorrect,
        isBlank: isBlank,
        isWrong: isWrong,
        solutions: prob.solutions || [],
        id: prob.id
      });
    }

    // AMC Scoring: 6 per correct, 1.5 penalty per wrong, 0 for blank
    var score = (correct * 6) + (wrong * -1.5) + (blank * 0);
    // Minimum score is 0 in practice (though AMC can technically go below)
    // Keep raw for display
    var maxScore = problems.length * 6;

    var elapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

    return {
      examKey: currentExamKey,
      label: currentExam.label,
      totalProblems: problems.length,
      correct: correct,
      wrong: wrong,
      blank: blank,
      score: score,
      maxScore: maxScore,
      percentage: Math.round((score / maxScore) * 100),
      timeElapsed: elapsed,
      timeFormatted: formatTime(elapsed),
      details: details,
      finished: finished
    };
  }

  // --- Get exam timer display data ---
  function getExamTimer() {
    return getTimeRemaining();
  }

  // --- Check if exam is active ---
  function isActive() {
    return currentExam !== null && !finished;
  }

  // --- Check if exam is finished ---
  function isFinished() {
    return finished;
  }

  // --- Reset / abandon exam ---
  function resetExam() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    currentExam = null;
    currentExamKey = null;
    currentIndex = 0;
    answers = [];
    startTime = null;
    finished = false;
    timerCallback = null;
  }

  // --- Get current index ---
  function getCurrentIndex() {
    return currentIndex;
  }

  // --- Get total problem count ---
  function getTotalProblems() {
    if (!currentExam) return 0;
    return currentExam.problems.length;
  }

  // --- Save exam result to localStorage ---
  function saveExamResult(results) {
    try {
      var key = 'ruby_amc10_exam_results';
      var stored = JSON.parse(localStorage.getItem(key) || '[]');
      stored.push({
        examKey: results.examKey,
        label: results.label,
        score: results.score,
        maxScore: results.maxScore,
        correct: results.correct,
        wrong: results.wrong,
        blank: results.blank,
        percentage: results.percentage,
        timeElapsed: results.timeElapsed,
        date: new Date().toISOString()
      });
      // Keep last 50 exam results
      if (stored.length > 50) stored = stored.slice(-50);
      localStorage.setItem(key, JSON.stringify(stored));
    } catch (e) {
      console.warn('Failed to save exam result:', e);
    }
  }

  // --- Get past exam results ---
  function getPastResults() {
    try {
      return JSON.parse(localStorage.getItem('ruby_amc10_exam_results') || '[]');
    } catch (e) {
      return [];
    }
  }

  // --- Public API ---
  return {
    loadExamIndex: loadExamIndex,
    getExamList: getExamList,
    getYears: getYears,
    getExamsForYear: getExamsForYear,
    startExam: startExam,
    getCurrentProblem: getCurrentProblem,
    submitAnswer: submitAnswer,
    selectAnswer: selectAnswer,
    clearAnswer: clearAnswer,
    nextProblem: nextProblem,
    prevProblem: prevProblem,
    goToProblem: goToProblem,
    getAnswerStatus: getAnswerStatus,
    getExamTimer: getExamTimer,
    getTimeRemaining: getTimeRemaining,
    finishExam: finishExam,
    getResults: getResults,
    resetExam: resetExam,
    isActive: isActive,
    isFinished: isFinished,
    getCurrentIndex: getCurrentIndex,
    getTotalProblems: getTotalProblems,
    saveExamResult: saveExamResult,
    getPastResults: getPastResults
  };
})();
