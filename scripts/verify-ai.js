const { evaluateExercise } = require('../src/lib/ai-engine.ts');

console.log('=== Running MitraSpeak Core English Verification Tests ===');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✔ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ✖ FAIL: ${message}`);
    testsFailed++;
  }
}

// Test 1: Fill-in-the-blank evaluation
{
  const resExact = evaluateExercise({
    type: 'FILL_BLANK',
    userResponse: 'please',
    correctResponse: 'please',
    explanation: 'Polite word',
  });
  assert(resExact.isCorrect === true && resExact.score === 100, 'Fill-in-the-blank exact match scores 100%');

  const resWrong = evaluateExercise({
    type: 'FILL_BLANK',
    userResponse: 'never',
    correctResponse: 'please',
    explanation: 'Polite word',
  });
  assert(resWrong.isCorrect === false && resWrong.score === 30, 'Fill-in-the-blank incorrect match handled supportively');
}

// Test 2: Sentence building evaluation
{
  const resSentence = evaluateExercise({
    type: 'SENTENCE_BUILD',
    userResponse: 'Pleased to meet you, neighbor.',
    correctResponse: 'Pleased to meet you, neighbor.',
  });
  assert(resSentence.isCorrect === true && resSentence.score === 100, 'Sentence builder exact match scores 100%');
}

// Test 3: Matching evaluation (Health Symptoms)
{
  const correctMatches = JSON.stringify({
    Dizziness: 'Feeling unsteady or lightheaded',
    Fever: 'High body temperature above normal',
  });
  const userMatches = JSON.stringify({
    Dizziness: 'Feeling unsteady or lightheaded',
    Fever: 'High body temperature above normal',
  });
  const resMatch = evaluateExercise({
    type: 'MATCHING',
    userResponse: userMatches,
    correctResponse: correctMatches,
  });
  assert(resMatch.isCorrect === true && resMatch.score === 100, 'Matching vocabulary terms and definitions evaluated accurately');
}

// Test 4: Conversational English Roleplay (Doctor's Consultation)
{
  const roleplayResult = evaluateExercise({
    type: 'ROLEPLAY',
    userResponse: 'Good morning Doctor. I have been feeling dizzy in the morning for the last two days.',
    correctResponse: 'Good morning Doctor. I have been feeling dizzy in the morning.',
    optionsJson: JSON.stringify({
      scenarioTitle: 'Doctor Consultation',
      expectedKeywords: ['dizzy', 'morning', 'two days', 'doctor', 'feeling'],
    }),
  });
  assert(
    roleplayResult.isCorrect === true &&
    roleplayResult.score >= 90 &&
    roleplayResult.supportiveFeedback.includes('Splendid'),
    'Doctor consultation roleplay evaluated with affirmative feedback and high score'
  );
}

console.log(`\nResults: ${testsPassed} passed, ${testsFailed} failed.`);
if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('=== All Core Business Logic Tests Passed Successfully! ===\n');
}
