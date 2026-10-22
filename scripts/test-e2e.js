const http = require('http');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      method: options.method || 'GET',
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: options.headers || {},
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: parsed,
        });
      });
    });

    req.on('error', (err) => reject(err));

    if (options.body) {
      const bodyStr = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
      req.write(bodyStr);
    }
    req.end();
  });
}

let passed = 0;
let failed = 0;

function assert(cond, name) {
  if (cond) {
    console.log(`  ✔ PASS: ${name}`);
    passed++;
  } else {
    console.error(`  ✖ FAIL: ${name}`);
    failed++;
  }
}

async function runTests() {
  console.log('--- Starting BoloEnglish AI Platform E2E Integration Tests ---\n');

  try {
    // Test Suite 1: Scenarios API
    console.log('[Test Suite 1: 5 Indian Life Scenarios Delivery]');
    const scRes = await makeRequest('/api/scenarios');
    assert(scRes.status === 200, 'GET /api/scenarios returns 200 OK');
    assert(scRes.body.success === true, 'Payload contains success: true');
    assert(Array.isArray(scRes.body.scenarios) && scRes.body.scenarios.length === 5, 'Returns exactly 5 everyday Indian life scenarios');
    
    const scTitles = scRes.body.scenarios.map((s) => s.slug);
    assert(scTitles.includes('sabzi-mandi'), 'Contains "Haggling & Buying Vegetables" (sabzi-mandi)');
    assert(scTitles.includes('clinic-visit'), 'Contains "Talking to a Doctor at a Clinic" (clinic-visit)');
    assert(scTitles.includes('whatsapp-relatives'), 'Contains "Polite WhatsApp to Relatives" (whatsapp-relatives)');
    assert(scTitles.includes('cafe-airport'), 'Contains "Ordering at Cafe & Airport Gate" (cafe-airport)');
    assert(scTitles.includes('family-chat'), 'Contains "Casual Conversation with Grandchildren" (family-chat)');

    // Test Suite 2: Specific Scenario Detail & Session Initialization
    console.log('\n[Test Suite 2: Scenario Detail & Session Initiation]');
    const singleScRes = await makeRequest('/api/scenarios/sabzi-mandi');
    assert(singleScRes.status === 200, 'GET /api/scenarios/sabzi-mandi returns 200 OK');
    assert(singleScRes.body.scenario.slug === 'sabzi-mandi', 'Scenario slug matches requested route');
    assert(singleScRes.body.scenario.titleHindi.length > 0, 'Scenario has prominent Hindi title');
    assert(singleScRes.body.scenario.characterName.includes('Ramesh'), 'Character name is Ramesh');
    const sessionId = singleScRes.body.sessionId || singleScRes.body.session?.id;
    assert(sessionId && sessionId.length > 0, 'Active conversation session created or retrieved');

    // Test Suite 3: Learner Authentication
    console.log('\n[Test Suite 3: Indian Family Learner Authentication]');
    const loginRes = await makeRequest('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email: 'shanti.devi@boloenglish.com', password: 'BoloPass123!' },
    });
    assert(loginRes.status === 200, 'POST /api/auth/login returns 200 OK');
    assert(loginRes.body.token && loginRes.body.user.name === 'Shanti Devi', 'Token issued and user is Shanti Devi');
    const learnerToken = loginRes.body.token;

    // Test Suite 4: Protected Profile Check
    const meRes = await makeRequest('/api/auth/me', {
      headers: { Authorization: `Bearer ${learnerToken}` },
    });
    assert(meRes.status === 200, 'GET /api/auth/me returns 200 OK');
    assert(meRes.body.user.nativeLanguage === 'hi', 'Learner native language is Hindi (hi)');

    // Test Suite 5: Aarti Didi Conversational AI Engine & Hinglish Code-Switching
    console.log('\n[Test Suite 5: Aarti Didi AI Engine & Hinglish Chat Evaluation]');
    const chatRes = await makeRequest('/api/chat/respond', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${learnerToken}`,
      },
      body: {
        sessionId,
        scenarioId: singleScRes.body.scenario.id,
        userMessage: 'Bhaiya, how much per kilo for fresh tamatar? Aur extra mirchi dena.',
      },
    });

    assert(chatRes.status === 200, 'POST /api/chat/respond returns 200 OK');
    assert(chatRes.body.success === true, 'Response payload has success: true');
    assert(chatRes.body.reply && chatRes.body.reply.length > 0, 'AI response generated');
    assert(chatRes.body.hindiTranslation && chatRes.body.hindiTranslation.length > 0, 'AI response includes Hindi translation for tap-to-translate');
    assert(chatRes.body.correction !== null, 'Hinglish input generates gentle grammar suggestion');
    assert(chatRes.body.correction.explanationHindi.length > 0, 'Grammar explanation provided gently in Hindi');
    assert(chatRes.body.clarityScore >= 50, 'Clarity score computed');

    // Test Suite 6: Vocabulary Bookmarking ("शब्दकोश")
    console.log('\n[Test Suite 6: Vocabulary Bookmarking & CRUD]');
    // Fetch initial vocabulary
    const getVocabRes = await makeRequest('/api/vocabulary', {
      headers: { Authorization: `Bearer ${learnerToken}` },
    });
    assert(getVocabRes.status === 200, 'GET /api/vocabulary returns 200 OK');
    assert(Array.isArray(getVocabRes.body.vocabulary), 'Vocabulary list returned');

    // Add a new word
    const addVocabRes = await makeRequest('/api/vocabulary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${learnerToken}`,
      },
      body: {
        word: 'Coriander leaves',
        hindiMeaning: 'धनिया की पत्तियां',
        phonetic: 'koh-ree-AN-der leevz',
        exampleSentence: 'Could you please add some fresh coriander leaves?',
        category: 'Market',
      },
    });
    assert(addVocabRes.status === 200, 'POST /api/vocabulary successfully creates bookmark');
    assert(addVocabRes.body.item.word === 'Coriander leaves', 'Created bookmark matches submitted word');
    const createdVocabId = addVocabRes.body.item.id;

    // Delete the word
    const delVocabRes = await makeRequest(`/api/vocabulary?id=${createdVocabId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${learnerToken}` },
    });
    assert(delVocabRes.status === 200, 'DELETE /api/vocabulary removes bookmarked word');

    // Test Suite 7: Learner Progress & Streaks
    console.log('\n[Test Suite 7: Progress Metrics & Daily Streak]');
    const progRes = await makeRequest('/api/progress', {
      headers: { Authorization: `Bearer ${learnerToken}` },
    });
    assert(progRes.status === 200, 'GET /api/progress returns 200 OK');
    assert(progRes.body.stats.streakCount >= 7, 'Shanti Devi has 7-day practice streak');
    assert(progRes.body.stats.totalPoints >= 640, 'Points balance reflects learning activities');
    assert(progRes.body.stats.level >= 4, 'Learner level is 4 or higher');

    // Test Suite 8: Route Guard & Admin Privileges
    console.log('\n[Test Suite 8: Role-Based Access Control]');
    const unauthAdminRes = await makeRequest('/api/admin/analytics');
    assert(unauthAdminRes.status === 401 || unauthAdminRes.status === 403, 'GET /api/admin/analytics rejects unauthenticated requests');

    const learnerAdminRes = await makeRequest('/api/admin/analytics', {
      headers: { Authorization: `Bearer ${learnerToken}` },
    });
    assert(learnerAdminRes.status === 403, 'GET /api/admin/analytics rejects LEARNER role (403 Forbidden)');

    // Admin login with Aarti Didi
    const adminLoginRes = await makeRequest('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email: 'aarti.didi@boloenglish.com', password: 'BoloPass123!' },
    });
    assert(adminLoginRes.status === 200, 'Admin login returns 200 OK');
    const adminToken = adminLoginRes.body.token;

    const authAdminRes = await makeRequest('/api/admin/analytics', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(authAdminRes.status === 200, 'Admin gets 200 OK on /api/admin/analytics');
    assert(authAdminRes.body.analytics.totalUsers >= 2, 'Admin telemetry reports at least 2 users');

    // Test Suite 9: Hindi to English Translation & Mistake Checker
    console.log('\n[Test Suite 9: Hindi to English Translation & Mistake Checker]');
    // 9.1 Translate Hindi sentence
    const transRes = await makeRequest('/api/translate-coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        action: 'translate',
        hindiText: 'मुझे कल सुबह जल्दी उठना है क्योंकि बच्चों का स्कूल है',
      },
    });
    assert(transRes.status === 200, 'POST /api/translate-coach (translate) returns 200 OK');
    assert(transRes.body.success === true, 'Translation response has success: true');
    assert(transRes.body.translation.idealEnglish.includes('wake up early'), 'Translation contains ideal English sentence');
    assert(transRes.body.translation.phoneticHindi.length > 0, 'Phonetic pronunciation guide in Hindi provided');
    assert(Array.isArray(transRes.body.translation.vocabulary) && transRes.body.translation.vocabulary.length > 0, 'Vocabulary keywords provided');

    // 9.2 Verify user attempt with intentional mistakes
    const verifyMistakeRes = await makeRequest('/api/translate-coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${learnerToken}`,
      },
      body: {
        action: 'verify',
        hindiText: 'मुझे कल सुबह जल्दी उठना है क्योंकि बच्चों का स्कूल है',
        targetEnglish: transRes.body.translation.idealEnglish,
        userAttempt: 'I want wake early morning because children school',
      },
    });
    assert(verifyMistakeRes.status === 200, 'POST /api/translate-coach (verify) returns 200 OK');
    assert(verifyMistakeRes.body.success === true, 'Verification returns success: true');
    assert(verifyMistakeRes.body.verification.score >= 35 && verifyMistakeRes.body.verification.score <= 100, 'Computed fluency score for user attempt');
    assert(Array.isArray(verifyMistakeRes.body.verification.mistakes) && verifyMistakeRes.body.verification.mistakes.length > 0, 'Diagnosed specific grammatical/omission mistakes');
    assert(verifyMistakeRes.body.verification.encouragingMessageHindi.length > 0, 'Provided encouraging mentor advice in Hindi');
    assert(verifyMistakeRes.body.pointsAwarded === 20, 'Awarded 20 fluency points for practice');

    // 9.4 Oral Challenge Retrieval & Verification
    console.log('\n[Test Suite 10: Aarti Didi Oral Hindi-to-English Challenges]');
    const challengesRes = await makeRequest('/api/translate-coach', { method: 'GET' });
    assert(challengesRes.status === 200, 'GET /api/translate-coach returns 200 OK');
    assert(challengesRes.body.success === true, 'Oral challenges response has success: true');
    assert(Array.isArray(challengesRes.body.challenges) && challengesRes.body.challenges.length === 8, 'Returns exactly 8 curated Indian oral challenges');
    const firstChallenge = challengesRes.body.challenges[0];
    assert(firstChallenge.didiSpeechHindi.includes('आरती दीदी') || firstChallenge.didiSpeechHindi.includes('सुनिए'), 'Challenge contains Aarti Didi oral Hindi prompt speech');
    assert(firstChallenge.idealEnglish.length > 0, 'Challenge provides ideal English sentence');
    assert(firstChallenge.phoneticHindi.length > 0, 'Challenge provides Devanagari phonetics');

    // Verify converting the oral challenge
    const challengeVerifyRes = await makeRequest('/api/translate-coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${learnerToken}`,
      },
      body: {
        action: 'verify',
        hindiText: firstChallenge.hindiPrompt,
        targetEnglish: firstChallenge.idealEnglish,
        userAttempt: firstChallenge.idealEnglish,
      },
    });
    assert(challengeVerifyRes.status === 200, 'Converting oral challenge attempt returns 200 OK');
    assert(challengeVerifyRes.body.verification.score >= 95, 'Accurate oral conversion receives high score');
    // Test Suite 11: Conversation Learning Hub (Idioms, Grammar, Conversation, Repeat Drills)
    console.log('\n[Test Suite 11: Learning Hub & Listen & Repeat Drills]');
    const learnRes = await makeRequest('/api/learn');
    assert(learnRes.status === 200, 'GET /api/learn returns 200 OK');
    assert(learnRes.body.success === true, 'GET /api/learn returns success: true');
    assert(Array.isArray(learnRes.body.idioms) && learnRes.body.idioms.length >= 10, 'Returns at least 10 idioms and phrases');
    assert(Array.isArray(learnRes.body.grammar) && learnRes.body.grammar.length >= 6, 'Returns 6 practical grammar rules');
    assert(Array.isArray(learnRes.body.templates) && learnRes.body.templates.length >= 5, 'Returns 5 conversation templates');
    assert(Array.isArray(learnRes.body.drills) && learnRes.body.drills.length >= 8, 'Returns at least 8 listen & repeat drills');

    // 11.1 Test Listen & Repeat evaluation
    const repeatEvalRes = await makeRequest('/api/learn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${learnerToken}`,
      },
      body: {
        action: 'evaluate_repeat',
        drillId: 'rep-slowly',
        userAttempt: 'Could you please speak a little more slowly?',
      },
    });
    assert(repeatEvalRes.status === 200, 'POST /api/learn evaluate_repeat returns 200 OK');
    assert(repeatEvalRes.body.success === true, 'Repeat evaluation succeeds');
    assert(repeatEvalRes.body.evaluation.accuracyPercentage === 100, 'Exact speech match gives 100% accuracy');
    assert(repeatEvalRes.body.pointsAwarded === 15, 'Awards 15 fluency points for repeating drill');

    // 11.2 Test Grammar Quiz submission
    const quizSubRes = await makeRequest('/api/learn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${learnerToken}`,
      },
      body: {
        action: 'submit_quiz',
        topicId: 'grm-is-am-are',
        selectedOptionIndex: 0,
      },
    });
    assert(quizSubRes.status === 200, 'POST /api/learn submit_quiz returns 200 OK');
    assert(quizSubRes.body.isCorrect === true, 'Grammar quiz answer is validated');
    assert(quizSubRes.body.pointsAwarded === 10, 'Awards 10 points for correct quiz answer');

    // ========================================================
    // SUITE 12: Level Curation & Proficiency Tier Filtering
    // ========================================================
    console.log('\n--- SUITE 12: Level-by-Level Proficiency Curation ---');

    // 12.1 Filter Scenarios by Beginner Difficulty
    const begScenRes = await makeRequest('/api/scenarios?difficulty=beginner');
    assert(begScenRes.status === 200, 'GET /api/scenarios?difficulty=beginner returns 200');
    assert(Array.isArray(begScenRes.body.scenarios) && begScenRes.body.scenarios.length > 0, 'Returns beginner scenarios');
    assert(begScenRes.body.scenarios.every((s) => s.difficulty === 'BEGINNER'), 'All filtered scenarios are BEGINNER level');

    // 12.2 Filter Learn Hub by Beginner Level
    const begLearnRes = await makeRequest('/api/learn?level=beginner');
    assert(begLearnRes.status === 200, 'GET /api/learn?level=beginner returns 200');
    assert(begLearnRes.body.idioms.every((i) => i.level === 'beginner'), 'All returned idioms are beginner tier');
    assert(begLearnRes.body.grammar.every((g) => g.level === 'beginner'), 'All returned grammar topics are beginner tier');
    assert(begLearnRes.body.drills.every((d) => d.level === 'beginner'), 'All returned repeat drills are beginner tier');

    // 12.3 Filter Learn Hub by Advanced Level
    const advLearnRes = await makeRequest('/api/learn?level=advanced');
    assert(advLearnRes.status === 200, 'GET /api/learn?level=advanced returns 200');
    assert(advLearnRes.body.idioms.every((i) => i.level === 'advanced'), 'All returned idioms are advanced tier');
    assert(advLearnRes.body.grammar.every((g) => g.level === 'advanced'), 'All returned grammar topics are advanced tier');

    // 12.4 Filter Translate Oral Challenges by Beginner Level
    const begChallengeRes = await makeRequest('/api/translate-coach?level=beginner');
    assert(begChallengeRes.status === 200, 'GET /api/translate-coach?level=beginner returns 200');
    assert(begChallengeRes.body.challenges.every((c) => c.level === 'beginner'), 'All returned oral challenges are beginner tier');

    // 12.5 Filter Vocabulary by Difficulty
    const begVocabRes = await makeRequest('/api/vocabulary?difficulty=beginner', {
      headers: { Authorization: `Bearer ${learnerToken}` },
    });
    assert(begVocabRes.status === 200, 'GET /api/vocabulary?difficulty=beginner returns 200');
    assert(Array.isArray(begVocabRes.body.vocabulary), 'Vocabulary list returned');
    assert(begVocabRes.body.vocabulary.every((v) => v.difficulty.toUpperCase() === 'BEGINNER'), 'All returned vocab items are BEGINNER difficulty');

    // ========================================================
    // SUITE 13: Level 0 Foundations & Aarti Didi Avatar Evaluation
    // ========================================================
    console.log('\n--- SUITE 13: Level 0 Foundations & Aarti Didi Avatar Evaluation ---');

    // 13.1 GET Level 0 Curriculum & Drills
    const l0Res = await makeRequest('/api/grammar/evaluate');
    assert(l0Res.status === 200, 'GET /api/grammar/evaluate returns 200 OK');
    assert(Array.isArray(l0Res.body.svoChallenges) && l0Res.body.svoChallenges.length >= 5, 'Returns at least 5 SVO sentence challenges');
    assert(Array.isArray(l0Res.body.auxiliaryDrills) && l0Res.body.auxiliaryDrills.length >= 6, 'Returns at least 6 auxiliary verb drills');
    assert(Array.isArray(l0Res.body.lessons) && l0Res.body.lessons.length >= 4, 'Returns Level 0 structured grammar lessons');
    assert(l0Res.body.avatarMessages && l0Res.body.avatarMessages.cheering, 'Contains Aarti Didi avatar feedback messages');

    // 13.2 Evaluate Correct SVO Sentence Assembly
    const svoCorrectRes = await makeRequest('/api/grammar/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${learnerToken}`,
      },
      body: {
        action: 'evaluate_svo',
        exerciseId: 'svo-1',
        arrangedTokens: ['I', 'eat', 'an apple.'],
      },
    });
    assert(svoCorrectRes.status === 200, 'POST /api/grammar/evaluate evaluate_svo returns 200 OK');
    assert(svoCorrectRes.body.isCorrect === true, 'SVO sentence arrangement correctly validated as true');
    assert(svoCorrectRes.body.avatarMood === 'cheering', 'Aarti Didi mood transitions to cheering on success');
    assert(svoCorrectRes.body.pointsAwarded === 20, 'Awards 20 points for correct SVO sentence builder');

    // 13.3 Evaluate Incorrect SVO Sentence Assembly
    const svoIncorrectRes = await makeRequest('/api/grammar/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${learnerToken}`,
      },
      body: {
        action: 'evaluate_svo',
        exerciseId: 'svo-1',
        arrangedTokens: ['eat', 'I', 'an apple.'],
      },
    });
    assert(svoIncorrectRes.status === 200, 'POST /api/grammar/evaluate returns 200 for incorrect SVO');
    assert(svoIncorrectRes.body.isCorrect === false, 'Incorrect SVO order flagged as false');
    assert(svoIncorrectRes.body.avatarMood === 'explaining', 'Aarti Didi mood transitions to explaining on error');
    assert(svoIncorrectRes.body.hindiFeedback && svoIncorrectRes.body.hindiFeedback.length > 0, 'Gentle Hindi explanation provided for mistake');

    // 13.4 Evaluate Auxiliary Verb Drill (is/am/are)
    const auxCorrectRes = await makeRequest('/api/grammar/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${learnerToken}`,
      },
      body: {
        action: 'evaluate_auxiliary',
        drillId: 'aux-1',
        selectedVerb: 'am',
      },
    });
    assert(auxCorrectRes.status === 200, 'POST /api/grammar/evaluate evaluate_auxiliary returns 200 OK');
    assert(auxCorrectRes.body.isCorrect === true, 'Auxiliary verb "I -> am" validated as correct');
    assert(auxCorrectRes.body.avatarMood === 'cheering', 'Aarti Didi avatar cheers for correct auxiliary verb');
    assert(auxCorrectRes.body.pointsAwarded === 10, 'Awards 10 points for correct auxiliary verb selection');

    // 13.5 Evaluate Voice Repetition with Aarti Didi
    const voiceRes = await makeRequest('/api/grammar/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${learnerToken}`,
      },
      body: {
        action: 'evaluate_voice',
        targetSentence: 'I eat an apple.',
        spokenText: 'I eat an apple',
      },
    });
    assert(voiceRes.status === 200, 'POST /api/grammar/evaluate evaluate_voice returns 200 OK');
    assert(voiceRes.body.isMatch === true, 'Voice repetition matches target SVO sentence');
    assert(voiceRes.body.accuracy >= 90, 'Voice repetition accuracy exceeds 90%');
    assert(voiceRes.body.pointsAwarded === 15, 'Awards 15 points for spoken repetition');

    // 13.6 Verify Learner Progress Reflects Curriculum Mastery
    const updatedProgressRes = await makeRequest('/api/progress', {
      headers: { Authorization: `Bearer ${learnerToken}` },
    });
    assert(updatedProgressRes.status === 200, 'GET /api/progress returns 200 OK');
    assert(Array.isArray(updatedProgressRes.body.stats.curriculumProgress), 'Progress payload includes curriculumProgress relation');

    // --- SUITE 14: 22 Golden Rules Master Grammar & Rapidex/Wren-Martin Engine ---
    console.log(`\n--- SUITE 14: 22 Golden Rules Master Grammar & Rapidex/Wren-Martin Engine ---`);

    // 14.1 Fetch All 22 Golden Rules
    const goldenRulesRes = await makeRequest('/api/grammar/rules');
    assert(goldenRulesRes.status === 200, 'GET /api/grammar/rules returns 200 OK');
    assert(goldenRulesRes.body.success === true, 'GET /api/grammar/rules success is true');
    assert(goldenRulesRes.body.totalRules === 22, 'Returns exactly 22 Golden Rules');
    assert(Array.isArray(goldenRulesRes.body.stages) && goldenRulesRes.body.stages.length === 6, 'Organized across exactly 6 stages');

    // 14.2 Verify Stage 1: Wren & Martin Articles Sound Rule
    const rule3 = goldenRulesRes.body.rules.find((r) => r.id === 'rule-3');
    assert(rule3 !== undefined, 'Contains Rule #3 for Articles (A vs An)');
    assert(rule3.referenceBook === 'Wren & Martin', 'Rule 3 references Wren & Martin');
    assert(rule3.explanationHindi.includes('स्वर'), 'Rule 3 explains vowel sound rule in Hindi');
    assert(rule3.visualFormula.includes('Vowel Sound'), 'Rule 3 has visual formula with sound rule');

    // 14.3 Verify Stage 3: Subject-Verb Agreement (s/es rule)
    const rule8 = goldenRulesRes.body.rules.find((r) => r.id === 'rule-8');
    assert(rule8 !== undefined, 'Contains Rule #8 for Subject-Verb Agreement');
    assert(rule8.wrongExample.includes('He walk'), 'Identifies classic Indian trap "He walk"');
    assert(rule8.correctExample.includes('He walks'), 'Provides correct "He walks"');

    // 14.4 Verify Stage 4: Tenses Master Cycle
    const rule12 = goldenRulesRes.body.rules.find((r) => r.id === 'rule-12');
    const rule13 = goldenRulesRes.body.rules.find((r) => r.id === 'rule-13');
    assert(rule12 !== undefined && rule12.visualFormula.includes('V2'), 'Rule 12 teaches Simple Past using V2');
    assert(rule13 !== undefined && rule13.visualFormula.includes('Did'), 'Rule 13 teaches the "Did brings back V1" trap');

    // 14.5 Evaluate MCQ Practice Answer
    const mcqPracticeRes = await makeRequest('/api/grammar/rules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${learnerToken}`,
      },
      body: {
        action: 'evaluate_practice',
        ruleId: 'rule-3',
        questionId: 'q3-1',
        selectedAnswer: 'an',
      },
    });
    assert(mcqPracticeRes.status === 200, 'POST /api/grammar/rules evaluate_practice returns 200 OK');
    assert(mcqPracticeRes.body.isCorrect === true, 'MCQ answer "an hour" correctly validated');
    assert(mcqPracticeRes.body.pointsAwarded === 25, 'Awards 25 fluency points for correct rule practice');

    // 14.6 Evaluate Spoken Audio Practice Answer
    const speechPracticeRes = await makeRequest('/api/grammar/rules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${learnerToken}`,
      },
      body: {
        action: 'evaluate_practice',
        ruleId: 'rule-1',
        questionId: 'q1-2',
        spokenTranscript: 'this is a book',
      },
    });
    assert(speechPracticeRes.status === 200, 'POST /api/grammar/rules evaluates speech transcript');
    assert(speechPracticeRes.body.isCorrect === true, 'Spoken practice "this is a book" matched target');
    assert(speechPracticeRes.body.score >= 85, 'Spoken speech achieves high accuracy score');

    // 14.7 Verify Conversational Benefit & Dialogue Snippet
    assert(rule8.conversationalBenefit !== undefined, 'Rule 8 contains Conversational Benefit structure');
    assert(rule8.conversationalBenefit.dialogueSnippet.length >= 2, 'Contains realistic dialogue turns');
    assert(rule8.conversationalBenefit.dialogueSnippet[0].phoneticHindi.length > 0, 'Dialogue includes Devanagari phonetics');

    console.log(`\n===========================================`);
    console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
    console.log(`===========================================\n`);

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
