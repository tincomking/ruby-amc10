// Claude API Integration via Cloudflare Worker Proxy

var AI_CONFIG = {
  // Cloudflare Worker endpoint - update after deploying the worker
  endpoint: '',
  authToken: '',
  enabled: false,
  available: true,
  retryAfter: 0
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

// Configure AI (call once with your worker URL and token)
function configureAI(endpoint, authToken) {
  AI_CONFIG.endpoint = endpoint;
  AI_CONFIG.authToken = authToken;
  AI_CONFIG.enabled = !!(endpoint && authToken);
}

// Check if AI is available
function isAIAvailable() {
  return AI_CONFIG.enabled && AI_CONFIG.available && Date.now() > AI_CONFIG.retryAfter;
}

// Fetch a problem from AI
function fetchProblemFromAI(topic, subtopic, difficulty, recentContext) {
  if (!isAIAvailable()) {
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

// Fetch a follow-up problem after wrong answer
function fetchFollowUpFromAI(originalProblem) {
  if (!isAIAvailable()) {
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

// Core API call
function callClaudeAPI(systemPrompt, messages) {
  return fetch(AI_CONFIG.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': AI_CONFIG.authToken
    },
    body: JSON.stringify({
      system: systemPrompt,
      messages: messages
    })
  }).then(function(res) {
    if (!res.ok) {
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
    AI_CONFIG.available = false;
    setTimeout(function() { AI_CONFIG.available = true; }, 60000);
    throw err;
  });
}

// Fetch detailed step-by-step explanation from AI
// Returns an array of hint-like progressive steps
function fetchDetailedExplanation(problem, isCorrect) {
  if (!isAIAvailable()) {
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

// Parse and validate AI response
function parseAIProblem(responseText, topic, subtopic, difficulty) {
  // Try to extract JSON from response (handle code fences)
  var jsonStr = responseText.trim();
  var fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) jsonStr = fenceMatch[1].trim();

  var data;
  try {
    data = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error('Invalid JSON from AI');
  }

  // Validate required fields
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
