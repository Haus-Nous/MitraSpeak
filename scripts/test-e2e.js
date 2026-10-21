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

    // 9.3 Verify perfect attempt
    const verifyPerfectRes = await makeRequest('/api/translate-coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${learnerToken}`,
      },
      body: {
        action: 'verify',
        hindiText: 'मुझे कल सुबह जल्दी उठना है क्योंकि बच्चों का स्कूल है',
        targetEnglish: transRes.body.translation.idealEnglish,
        userAttempt: transRes.body.translation.idealEnglish,
      },
    });
    assert(verifyPerfectRes.status === 200, 'Verify perfect sentence returns 200 OK');
    assert(verifyPerfectRes.body.verification.score >= 95, 'Perfect sentence achieves high fluency score >= 95');
    assert(verifyPerfectRes.body.verification.mistakes.length === 0, 'Zero mistakes flagged on perfect sentence');

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
