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
  console.log('--- Starting MitraSpeak English Platform Integration Tests ---\n');

  try {
    // Test 1: Fetch Modules
    console.log('[Test Suite 1: English Modules Delivery]');
    const modRes = await makeRequest('/api/modules');
    assert(modRes.status === 200, 'GET /api/modules returns 200 OK');
    assert(modRes.body.success === true, 'Response payload contains success: true');
    assert(Array.isArray(modRes.body.modules) && modRes.body.modules.length >= 4, 'Returns 4 core English curriculum modules');
    const firstLessonId = modRes.body.modules[0]?.lessons[0]?.id;

    // Test 2: Fetch Single Lesson
    console.log('\n[Test Suite 2: Lesson Detail & Exercises]');
    const lessonRes = await makeRequest(`/api/lessons/${firstLessonId}`);
    assert(lessonRes.status === 200, `GET /api/lessons/${firstLessonId} returns 200 OK`);
    assert(lessonRes.body.lesson.title.length > 0, 'Lesson has valid title');
    assert(Array.isArray(lessonRes.body.lesson.exercises) && lessonRes.body.lesson.exercises.length > 0, 'Lesson contains structured exercises');
    const firstExercise = lessonRes.body.lesson.exercises[0];

    // Test 3: Authenticate Learner
    console.log('\n[Test Suite 3: Learner Authentication & Session Management]');
    const loginRes = await makeRequest('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email: 'learner@mitraspeak.com', password: 'LearnerPass123!' },
    });
    assert(loginRes.status === 200, 'POST /api/auth/login returns 200 OK');
    assert(loginRes.body.token && loginRes.body.user.role === 'LEARNER', 'JWT token issued and learner role verified');
    const learnerToken = loginRes.body.token;

    // Test 4: Protected Profile Check
    const meRes = await makeRequest('/api/auth/me', {
      headers: { Authorization: `Bearer ${learnerToken}` },
    });
    assert(meRes.status === 200, 'GET /api/auth/me returns 200 OK for authenticated bearer');
    assert(meRes.body.user.email === 'learner@mitraspeak.com', 'Returns profile data for Arthur Pendelton');

    // Test 5: Exercise Evaluation
    console.log('\n[Test Suite 4: AI Exercise Evaluation Engine]');
    const evalRes = await makeRequest('/api/exercises/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${learnerToken}`,
      },
      body: {
        exerciseId: firstExercise.id,
        userResponse: firstExercise.prompt,
        latencyMs: 1400,
      },
    });
    assert(evalRes.status === 200, 'POST /api/exercises/evaluate returns 200 OK');
    assert(evalRes.body.evaluation.isCorrect === true, 'AI evaluator validates correct vocabulary answer');
    assert(evalRes.body.evaluation.score >= 80, 'Score awarded >= 80');

    // Test 6: Conversational Roleplay
    console.log('\n[Test Suite 5: Conversational Speech & Dialogue AI]');
    const roleplayRes = await makeRequest('/api/roleplay/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        scenarioId: 'doctor_consultation',
        character: 'Dr. Adams',
        message: 'Good morning Doctor. I have been feeling dizzy in the morning for two days.',
      },
    });
    assert(roleplayRes.status === 200, 'POST /api/roleplay/chat returns 200 OK');
    assert(roleplayRes.body.speechClarityScore >= 90, 'Dialogue achieves high speech clarity score');
    assert(roleplayRes.body.reply.includes('Thank you') || roleplayRes.body.supportiveCoaching.includes('Excellent'), 'AI doctor gives supportive medical conversational feedback');

    // Test 7: Progress Metrics
    console.log('\n[Test Suite 6: Learner Progress & Streaks]');
    const progRes = await makeRequest('/api/progress', {
      headers: { Authorization: `Bearer ${learnerToken}` },
    });
    assert(progRes.status === 200, 'GET /api/progress returns 200 OK');
    assert(progRes.body.stats.streakCount >= 5, 'Progress statistics reflect active streak');

    // Test 8: Admin Security Route Guard
    console.log('\n[Test Suite 7: Role-Based Access Control]');
    const unauthAdminRes = await makeRequest('/api/admin/analytics');
    assert(unauthAdminRes.status === 401 || unauthAdminRes.status === 403, 'GET /api/admin/analytics rejects unauthorized request (401/403)');

    const learnerAdminRes = await makeRequest('/api/admin/analytics', {
      headers: { Authorization: `Bearer ${learnerToken}` },
    });
    assert(learnerAdminRes.status === 403, 'GET /api/admin/analytics rejects non-admin LEARNER role (403 Forbidden)');

    // Login as Admin
    const adminLoginRes = await makeRequest('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { email: 'admin@mitraspeak.com', password: 'AdminPass123!' },
    });
    const adminToken = adminLoginRes.body.token;

    const authorizedAdminRes = await makeRequest('/api/admin/analytics', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(authorizedAdminRes.status === 200, 'GET /api/admin/analytics grants access to ADMIN role (200 OK)');
    assert(authorizedAdminRes.body.analytics.totalUsers >= 2, 'Admin telemetry reports accurate database user counts');

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
