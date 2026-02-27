// Problem Manager - handles fetching, caching, and serving problems

var ProblemManager = (function() {
  var nextProblemPromise = null;
  var nextProblemTopic = null;
  var sessionProblemCount = 0;

  // Get a problem (tries AI first, falls back to local bank)
  function getProblem(topic, subtopic, difficulty) {
    // If we have a prefetched problem for the right topic, use it
    if (nextProblemPromise && (!topic || topic === 'auto' || nextProblemTopic === topic)) {
      var cached = nextProblemPromise;
      nextProblemPromise = null;
      nextProblemTopic = null;
      return cached;
    }

    sessionProblemCount++;

    // Build recent context to avoid repetition
    var progress = loadProgress();
    var recent = progress.recentProblems.slice(-5).map(function(p) {
      return p.topic + '/' + p.subtopic;
    }).join(', ');

    // Try AI first
    if (isAIAvailable()) {
      return fetchProblemFromAI(topic, subtopic, difficulty, recent)
        .catch(function() {
          // Fallback to local
          return getLocalProblem(topic, subtopic, difficulty);
        });
    }

    // Use local bank
    return Promise.resolve(getLocalProblem(topic, subtopic, difficulty));
  }

  // Prefetch the next problem while user works on current one
  function prefetchNext(progress) {
    var selection = selectNextTopic(progress, null);
    var difficulty = getDifficulty(progress, selection.topic, selection.subtopic);
    nextProblemTopic = selection.topic;

    var recent = progress.recentProblems.slice(-5).map(function(p) {
      return p.topic + '/' + p.subtopic;
    }).join(', ');

    if (isAIAvailable()) {
      nextProblemPromise = fetchProblemFromAI(selection.topic, selection.subtopic, difficulty, recent)
        .catch(function() {
          return getLocalProblem(selection.topic, selection.subtopic, difficulty);
        });
    } else {
      nextProblemPromise = Promise.resolve(getLocalProblem(selection.topic, selection.subtopic, difficulty));
    }
  }

  // Get a follow-up problem (for wrong answers)
  function getFollowUp(originalProblem) {
    if (isAIAvailable()) {
      return fetchFollowUpFromAI(originalProblem)
        .catch(function() {
          var newDiff = Math.max(1, originalProblem.difficulty - 1);
          return getLocalProblem(originalProblem.topic, originalProblem.subtopic, newDiff);
        });
    }
    var newDiff = Math.max(1, originalProblem.difficulty - 1);
    return Promise.resolve(getLocalProblem(originalProblem.topic, originalProblem.subtopic, newDiff));
  }

  function getSessionCount() {
    return sessionProblemCount;
  }

  return {
    getProblem: getProblem,
    prefetchNext: prefetchNext,
    getFollowUp: getFollowUp,
    getSessionCount: getSessionCount
  };
})();
