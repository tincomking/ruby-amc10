// Progress Tracking + Spaced Repetition (SM-2 variant)

var STORAGE_KEY = 'ruby_amc10_progress';

var DEFAULT_PROGRESS = {
  version: 1,
  student: {
    name: 'Ruby',
    startDate: new Date().toISOString().slice(0, 10),
    totalProblems: 0,
    totalCorrect: 0,
    currentStreak: 0,
    bestStreak: 0,
    lastActiveDate: null
  },
  topics: {
    algebra: {
      label: 'Algebra',
      subtopics: {
        polynomials: { label: 'Polynomials', level: 3, correct: 0, total: 0, lastSeen: null },
        equations: { label: 'Equations', level: 3, correct: 0, total: 0, lastSeen: null },
        inequalities: { label: 'Inequalities', level: 3, correct: 0, total: 0, lastSeen: null },
        sequences: { label: 'Sequences', level: 3, correct: 0, total: 0, lastSeen: null },
        functions: { label: 'Functions', level: 3, correct: 0, total: 0, lastSeen: null }
      }
    },
    geometry: {
      label: 'Geometry',
      subtopics: {
        triangles: { label: 'Triangles', level: 3, correct: 0, total: 0, lastSeen: null },
        circles: { label: 'Circles', level: 3, correct: 0, total: 0, lastSeen: null },
        coordinate: { label: 'Coordinate Geometry', level: 3, correct: 0, total: 0, lastSeen: null },
        area_volume: { label: 'Area & Volume', level: 3, correct: 0, total: 0, lastSeen: null },
        similarity: { label: 'Similarity & Congruence', level: 3, correct: 0, total: 0, lastSeen: null }
      }
    },
    number_theory: {
      label: 'Number Theory',
      subtopics: {
        divisibility: { label: 'Divisibility', level: 3, correct: 0, total: 0, lastSeen: null },
        primes: { label: 'Primes', level: 3, correct: 0, total: 0, lastSeen: null },
        modular: { label: 'Modular Arithmetic', level: 3, correct: 0, total: 0, lastSeen: null },
        gcd_lcm: { label: 'GCD & LCM', level: 3, correct: 0, total: 0, lastSeen: null },
        digits: { label: 'Digit Problems', level: 3, correct: 0, total: 0, lastSeen: null }
      }
    },
    combinatorics: {
      label: 'Combinatorics',
      subtopics: {
        counting: { label: 'Counting Principles', level: 3, correct: 0, total: 0, lastSeen: null },
        probability: { label: 'Probability', level: 3, correct: 0, total: 0, lastSeen: null },
        permutations: { label: 'Permutations & Combinations', level: 3, correct: 0, total: 0, lastSeen: null },
        pigeonhole: { label: 'Pigeonhole Principle', level: 3, correct: 0, total: 0, lastSeen: null },
        inclusion_exclusion: { label: 'Inclusion-Exclusion', level: 3, correct: 0, total: 0, lastSeen: null }
      }
    }
  },
  reviewQueue: [],
  recentProblems: [],
  dailyStats: {},
  settings: {
    dailyGoal: 20,
    soundEffects: true,
    showHints: true
  }
};

// Load progress from localStorage
function loadProgress() {
  try {
    var data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      var parsed = JSON.parse(data);
      // Merge with defaults for any new fields
      return mergeDeep(JSON.parse(JSON.stringify(DEFAULT_PROGRESS)), parsed);
    }
  } catch (e) {
    console.warn('Failed to load progress:', e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_PROGRESS));
}

// Save progress
function saveProgress(progress) {
  try {
    // Clean up old data (keep last 90 days of recentProblems)
    var cutoff = Date.now() - 90 * 86400000;
    progress.recentProblems = (progress.recentProblems || []).filter(function(p) {
      return p.timestamp > cutoff;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed to save progress:', e);
  }
}

// Deep merge helper
function mergeDeep(target, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key] || typeof target[key] !== 'object') target[key] = {};
        mergeDeep(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}

// Record a problem result
function recordProblem(progress, topic, subtopic, difficulty, wasCorrect, timeSpent) {
  var today = new Date().toISOString().slice(0, 10);

  // Update student stats
  progress.student.totalProblems++;
  if (wasCorrect) {
    progress.student.totalCorrect++;
    progress.student.currentStreak++;
    if (progress.student.currentStreak > progress.student.bestStreak) {
      progress.student.bestStreak = progress.student.currentStreak;
    }
  } else {
    progress.student.currentStreak = 0;
  }
  progress.student.lastActiveDate = today;

  // Update subtopic stats
  var st = progress.topics[topic] && progress.topics[topic].subtopics[subtopic];
  if (st) {
    st.total++;
    if (wasCorrect) st.correct++;
    st.lastSeen = today;
  }

  // Update daily stats
  if (!progress.dailyStats[today]) {
    progress.dailyStats[today] = { problems: 0, correct: 0, timeSpent: 0, topics: {} };
  }
  progress.dailyStats[today].problems++;
  if (wasCorrect) progress.dailyStats[today].correct++;
  progress.dailyStats[today].timeSpent += (timeSpent || 0);
  progress.dailyStats[today].topics[topic] = (progress.dailyStats[today].topics[topic] || 0) + 1;

  // Add to recent problems
  progress.recentProblems.push({
    topic: topic,
    subtopic: subtopic,
    difficulty: difficulty,
    correct: wasCorrect,
    timestamp: Date.now(),
    timeSpent: timeSpent || 0
  });

  // Update spaced repetition
  updateReviewSchedule(progress, topic + '.' + subtopic, wasCorrect);

  // Update adaptive difficulty
  updateDifficulty(progress, topic, subtopic);

  saveProgress(progress);
}

// SM-2 Spaced Repetition
function updateReviewSchedule(progress, subtopicKey, wasCorrect) {
  var queue = progress.reviewQueue;
  var idx = -1;
  for (var i = 0; i < queue.length; i++) {
    if (queue[i].subtopic === subtopicKey) { idx = i; break; }
  }

  var item;
  if (idx >= 0) {
    item = queue[idx];
  } else {
    item = { subtopic: subtopicKey, interval: 1, ease: 2.5, repetitions: 0, dueDate: null };
    queue.push(item);
    idx = queue.length - 1;
  }

  if (wasCorrect) {
    item.repetitions++;
    if (item.repetitions === 1) item.interval = 1;
    else if (item.repetitions === 2) item.interval = 3;
    else item.interval = Math.round(item.interval * item.ease);
    item.ease = Math.min(3.0, item.ease + 0.1);
  } else {
    item.repetitions = 0;
    item.interval = 1;
    item.ease = Math.max(1.3, item.ease - 0.2);
  }

  var due = new Date();
  due.setDate(due.getDate() + item.interval);
  item.dueDate = due.toISOString().slice(0, 10);
  queue[idx] = item;
}

// Adaptive difficulty
function updateDifficulty(progress, topic, subtopic) {
  var st = progress.topics[topic] && progress.topics[topic].subtopics[subtopic];
  if (!st) return;

  // Look at last 5 problems for this subtopic
  var recent = progress.recentProblems.filter(function(p) {
    return p.topic === topic && p.subtopic === subtopic;
  }).slice(-5);

  if (recent.length < 3) return; // Not enough data

  var correctCount = recent.filter(function(p) { return p.correct; }).length;
  var accuracy = correctCount / recent.length;

  if (accuracy > 0.8 && st.level < 5) {
    st.level++;
  } else if (accuracy < 0.4 && st.level > 1) {
    st.level--;
  }
}

// Select next topic based on spaced repetition + weakness weighting
function selectNextTopic(progress, requestedTopic) {
  if (requestedTopic && requestedTopic !== 'auto') {
    // User picked a specific topic, select weakest subtopic
    var subtopics = progress.topics[requestedTopic].subtopics;
    var weakest = null;
    var lowestAccuracy = 2;
    for (var sub in subtopics) {
      var s = subtopics[sub];
      var acc = s.total > 0 ? s.correct / s.total : 0.5;
      if (acc < lowestAccuracy) {
        lowestAccuracy = acc;
        weakest = sub;
      }
    }
    return { topic: requestedTopic, subtopic: weakest || Object.keys(subtopics)[0] };
  }

  // Auto mode: check spaced repetition queue first
  var today = new Date().toISOString().slice(0, 10);
  var dueItems = progress.reviewQueue.filter(function(r) {
    return r.dueDate && r.dueDate <= today;
  }).sort(function(a, b) { return a.ease - b.ease; });

  if (dueItems.length > 0) {
    var parts = dueItems[0].subtopic.split('.');
    return { topic: parts[0], subtopic: parts[1] };
  }

  // Weighted random based on AMC10 distribution + weakness
  var baseWeights = { algebra: 42, geometry: 16, number_theory: 22, combinatorics: 20 };
  var totalWeight = 0;
  var weighted = [];

  for (var topic in baseWeights) {
    var topicData = progress.topics[topic];
    var topicTotal = 0, topicCorrect = 0;
    for (var st in topicData.subtopics) {
      topicTotal += topicData.subtopics[st].total;
      topicCorrect += topicData.subtopics[st].correct;
    }
    var accuracy = topicTotal > 0 ? topicCorrect / topicTotal : 0.5;
    // Lower accuracy = higher weight (needs more practice)
    var weight = baseWeights[topic] * (1.5 - accuracy);
    weighted.push({ topic: topic, weight: weight });
    totalWeight += weight;
  }

  // Random selection
  var rand = Math.random() * totalWeight;
  var cumulative = 0;
  var selectedTopic = weighted[0].topic;
  for (var i = 0; i < weighted.length; i++) {
    cumulative += weighted[i].weight;
    if (rand <= cumulative) {
      selectedTopic = weighted[i].topic;
      break;
    }
  }

  // Pick random subtopic within selected topic
  var subs = Object.keys(progress.topics[selectedTopic].subtopics);
  var selectedSub = subs[Math.floor(Math.random() * subs.length)];

  return { topic: selectedTopic, subtopic: selectedSub };
}

// Get difficulty for a subtopic
function getDifficulty(progress, topic, subtopic) {
  var st = progress.topics[topic] && progress.topics[topic].subtopics[subtopic];
  return st ? st.level : 3;
}

// Get today's stats
function getTodayStats(progress) {
  var today = new Date().toISOString().slice(0, 10);
  var stats = progress.dailyStats[today] || { problems: 0, correct: 0 };
  return {
    problems: stats.problems,
    correct: stats.correct,
    accuracy: stats.problems > 0 ? Math.round(100 * stats.correct / stats.problems) : 0,
    streak: progress.student.currentStreak,
    goal: progress.settings.dailyGoal
  };
}

// Get topic mastery percentage (0-100)
function getTopicMastery(progress, topic) {
  var topicData = progress.topics[topic];
  if (!topicData) return 0;
  var totalLevel = 0, count = 0;
  for (var sub in topicData.subtopics) {
    totalLevel += topicData.subtopics[sub].level;
    count++;
  }
  // Level 1-5 maps to 0-100%
  return count > 0 ? Math.round(((totalLevel / count) - 1) / 4 * 100) : 0;
}
