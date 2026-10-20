const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting MitraSpeak English Learning Database Seeding ---');

  // Clear existing records safely
  await prisma.auditLog.deleteMany();
  await prisma.quizResult.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleaned old records.');

  // Create Users
  const passwordHashAdmin = await bcrypt.hash('AdminPass123!', 10);
  const passwordHashLearner = await bcrypt.hash('LearnerPass123!', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@mitraspeak.com',
      passwordHash: passwordHashAdmin,
      name: 'Eleanor Vance (Admin)',
      role: 'ADMIN',
      accessibilityPreferences: JSON.stringify({
        fontSize: 'large',
        highContrast: false,
        soundSpeed: '1.0',
      }),
      streakCount: 14,
      totalPoints: 1250,
      lastActiveDate: new Date(),
    },
  });

  const learner = await prisma.user.create({
    data: {
      email: 'learner@mitraspeak.com',
      passwordHash: passwordHashLearner,
      name: 'Arthur Pendelton',
      role: 'LEARNER',
      accessibilityPreferences: JSON.stringify({
        fontSize: 'senior-base',
        highContrast: false,
        soundSpeed: '0.85',
      }),
      streakCount: 5,
      totalPoints: 480,
      lastActiveDate: new Date(),
    },
  });

  console.log('Seeded users: admin@mitraspeak.com & learner@mitraspeak.com');

  // ==========================================
  // Module 1: Everyday Greetings & Courtesies
  // ==========================================
  const modGreetings = await prisma.module.create({
    data: {
      title: 'Everyday Greetings & Courtesies',
      slug: 'everyday-greetings',
      description: 'Master warm, respectful everyday English greetings, polite requests, and gentle clarification phrases tailored for daily social confidence.',
      category: 'ENGLISH_CORE',
      level: 'BEGINNER',
      orderIndex: 1,
      icon: 'Smile',
    },
  });

  const lessonGreetings1 = await prisma.lesson.create({
    data: {
      moduleId: modGreetings.id,
      title: 'Polite Morning & Evening Greetings',
      description: 'Learn how to greet neighbors, acquaintances, and friends politely at different times of day.',
      orderIndex: 1,
      durationMinutes: 8,
      pointsReward: 50,
      contentJson: JSON.stringify({
        summary: 'Greeting people properly creates an immediate friendly atmosphere.',
        tips: [
          'Say "Good morning" before noon (12:00 PM).',
          'Say "Good afternoon" from 12:00 PM until sunset (around 5:00 PM).',
          'Say "Good evening" after 5:00 PM.',
          'Always add a warm smile!',
        ],
        vocabulary: [
          { word: 'Good morning', pronunciation: '/ɡʊd ˈmɔː.nɪŋ/', meaning: 'Polite greeting used before 12:00 PM' },
          { word: 'Pleased to meet you', pronunciation: '/pliːzd tuː miːt juː/', meaning: 'A courteous way to introduce yourself to someone new' },
          { word: 'Could you please repeat that?', pronunciation: '/kʊd juː pliːz rɪˈpiːt ðæt/', meaning: 'Polite request when you did not hear clearly' },
        ],
      }),
    },
  });

  await prisma.exercise.createMany({
    data: [
      {
        lessonId: lessonGreetings1.id,
        type: 'FLASHCARD',
        prompt: 'Good morning',
        optionsJson: JSON.stringify({
          phonetic: '/ɡʊd ˈmɔː.nɪŋ/',
          definition: 'A polite morning greeting used from sunrise until 12:00 PM noon.',
          example: '"Good morning, Mr. Wilson! How are you feeling today?"',
        }),
        correctResponse: 'Good morning',
        explanation: 'Use this warm greeting before 12:00 PM noon.',
        orderIndex: 1,
      },
      {
        lessonId: lessonGreetings1.id,
        type: 'FILL_BLANK',
        prompt: 'Could you _____ repeat that slowly, please?',
        optionsJson: JSON.stringify(['please', 'now', 'never', 'run']),
        correctResponse: 'please',
        explanation: '"Please" is the magic word in English that makes requests courteous and kind.',
        orderIndex: 2,
      },
      {
        lessonId: lessonGreetings1.id,
        type: 'MATCHING',
        prompt: 'Match the greeting with the appropriate time or situation:',
        optionsJson: JSON.stringify([
          { item: 'Good morning', match: '9:00 AM in the breakfast room' },
          { item: 'Good evening', match: '7:30 PM at the dinner table' },
          { item: 'Pleased to meet you', match: 'First time meeting your new neighbor' },
        ]),
        correctResponse: JSON.stringify({
          'Good morning': '9:00 AM in the breakfast room',
          'Good evening': '7:30 PM at the dinner table',
          'Pleased to meet you': 'First time meeting your new neighbor',
        }),
        explanation: 'Matching temporal greetings helps build natural conversation instincts.',
        orderIndex: 3,
      },
      {
        lessonId: lessonGreetings1.id,
        type: 'SENTENCE_BUILD',
        prompt: 'Assemble the polite sentence:',
        optionsJson: JSON.stringify(['Pleased', 'to', 'meet', 'you,', 'neighbor.']),
        correctResponse: 'Pleased to meet you, neighbor.',
        explanation: 'Correct sentence order reinforces proper English grammatical flow.',
        orderIndex: 4,
      },
      {
        lessonId: lessonGreetings1.id,
        type: 'ROLEPLAY',
        prompt: 'Scenario: You are meeting your building manager, Mrs. Gable, in the lobby at 10:00 AM. Greet her politely and ask how her day is going.',
        optionsJson: JSON.stringify({
          scenarioTitle: 'Morning Lobby Encounter',
          character: 'Mrs. Gable (Building Manager)',
          initialGreeting: 'Good morning Arthur! Nice to see you downstairs today.',
          expectedKeywords: ['morning', 'good', 'how are you', 'thank you', 'day'],
        }),
        correctResponse: 'Good morning Mrs. Gable! I am doing well, thank you. How is your day going?',
        explanation: 'Respond with a warm greeting and return the courteous inquiry.',
        orderIndex: 5,
      },
    ],
  });

  // ==========================================
  // Module 2: At the Supermarket & Grocery Store
  // ==========================================
  const modShopping = await prisma.module.create({
    data: {
      title: 'At the Supermarket & Local Markets',
      slug: 'supermarket-and-shopping',
      description: 'Navigate retail stores, understand price tags, ask clerks for assistance, and request printed receipts with confidence.',
      category: 'ENGLISH_CORE',
      level: 'BEGINNER',
      orderIndex: 2,
      icon: 'ShoppingBag',
    },
  });

  const lessonShopping1 = await prisma.lesson.create({
    data: {
      moduleId: modShopping.id,
      title: 'Asking for Items and Prices',
      description: 'Learn how to ask store clerks where grocery items are located and understand total prices at checkout.',
      orderIndex: 1,
      durationMinutes: 10,
      pointsReward: 50,
      contentJson: JSON.stringify({
        summary: 'Finding everyday essentials with confidence in grocery aisles.',
        tips: [
          'Say "Excuse me, where can I find the fresh produce?"',
          'Look for Aisle numbers above the shelves.',
          'Always ask for a printed receipt: "May I have a receipt, please?"',
        ],
        vocabulary: [
          { word: 'Aisle', pronunciation: '/aɪl/', meaning: 'A walkway between rows of shelves in a supermarket' },
          { word: 'Receipt', pronunciation: '/rɪˈsiːt/', meaning: 'A paper slip confirming purchase and payment' },
          { word: 'Cashier', pronunciation: '/kæˈʃɪər/', meaning: 'The store worker who scans items and collects payment' },
        ],
      }),
    },
  });

  await prisma.exercise.createMany({
    data: [
      {
        lessonId: lessonShopping1.id,
        type: 'FLASHCARD',
        prompt: 'Receipt',
        optionsJson: JSON.stringify({
          phonetic: '/rɪˈsiːt/ (the "p" is silent)',
          definition: 'A written or printed slip acknowledging payment and items received.',
          example: '"The cashier handed me the receipt after scanning my groceries."',
        }),
        correctResponse: 'Receipt',
        explanation: 'Remember that the "p" in receipt is silent: pronounce it "re-SEET".',
        orderIndex: 1,
      },
      {
        lessonId: lessonShopping1.id,
        type: 'FILL_BLANK',
        prompt: 'Excuse me, which _____ are the herbal teas located in?',
        optionsJson: JSON.stringify(['aisle', 'island', 'sky', 'plate']),
        correctResponse: 'aisle',
        explanation: 'An "aisle" is the passage between rows of shelves in a grocery store.',
        orderIndex: 2,
      },
      {
        lessonId: lessonShopping1.id,
        type: 'ROLEPLAY',
        prompt: 'Scenario: You are at the checkout counter. The cashier says: "That will be twenty-two dollars, please. Would you like to pay with card or cash?"',
        optionsJson: JSON.stringify({
          scenarioTitle: 'Paying the Cashier',
          character: 'Sarah (Supermarket Cashier)',
          initialGreeting: 'Hello there! Your total is $22.50. Will you be paying by card or cash today?',
          expectedKeywords: ['card', 'cash', 'please', 'receipt', 'here you go'],
        }),
        correctResponse: 'I will pay by card, please. Could I also have a printed receipt?',
        explanation: 'State your payment choice clearly and politely ask for your receipt.',
        orderIndex: 3,
      },
    ],
  });

  // ==========================================
  // Module 3: Visiting the Doctor & Describing Health
  // ==========================================
  const modHealth = await prisma.module.create({
    data: {
      title: "Visiting the Doctor & Describing Health",
      slug: 'visiting-the-doctor',
      description: 'Communicate clearly with doctors, nurses, and pharmacists. Describe symptoms, understand dosage instructions, and ask about side effects.',
      category: 'ENGLISH_CORE',
      level: 'BEGINNER',
      orderIndex: 3,
      icon: 'HeartPulse',
    },
  });

  const lessonHealth1 = await prisma.lesson.create({
    data: {
      moduleId: modHealth.id,
      title: 'Describing Common Symptoms & Pain Levels',
      description: 'Learn clear vocabulary for describing pain, aches, and duration of symptoms to healthcare providers.',
      orderIndex: 1,
      durationMinutes: 12,
      pointsReward: 60,
      contentJson: JSON.stringify({
        summary: 'Communicating health symptoms accurately ensures safe and effective care.',
        tips: [
          'State when the pain started: "I have had this ache for three days."',
          'Use the 1 to 10 pain scale: "The pain is about a 4 out of 10."',
          'Mention if you take any daily medications.',
        ],
        vocabulary: [
          { word: 'Symptom', pronunciation: '/ˈsɪmp.təm/', meaning: 'A physical sign indicating an illness or condition' },
          { word: 'Prescription', pronunciation: '/prɪˈskrɪp.ʃən/', meaning: 'An official note from a doctor directing medicine' },
          { word: 'Dizziness', pronunciation: '/ˈdɪz.i.nəs/', meaning: 'A feeling of lightheadedness or losing balance' },
        ],
      }),
    },
  });

  await prisma.exercise.createMany({
    data: [
      {
        lessonId: lessonHealth1.id,
        type: 'FLASHCARD',
        prompt: 'Prescription',
        optionsJson: JSON.stringify({
          phonetic: '/prɪˈskrɪp.ʃən/',
          definition: 'A formal note written by a medical doctor authorizing medicine from a pharmacy.',
          example: '"The doctor gave me a prescription for blood pressure medication."',
        }),
        correctResponse: 'Prescription',
        explanation: 'A prescription is necessary for obtaining regulated medication.',
        orderIndex: 1,
      },
      {
        lessonId: lessonHealth1.id,
        type: 'MATCHING',
        prompt: 'Match the health symptom with its plain English description:',
        optionsJson: JSON.stringify([
          { item: 'Dizziness', match: 'Feeling unsteady or lightheaded when standing' },
          { item: 'Fever', match: 'High body temperature above 98.6 degrees' },
          { item: 'Sprain', match: 'An injury to a joint caused by sudden twisting' },
        ]),
        correctResponse: JSON.stringify({
          'Dizziness': 'Feeling unsteady or lightheaded when standing',
          'Fever': 'High body temperature above 98.6 degrees',
          'Sprain': 'An injury to a joint caused by sudden twisting',
        }),
        explanation: 'Accurate symptom vocabulary helps medical professionals diagnose quickly.',
        orderIndex: 2,
      },
      {
        lessonId: lessonHealth1.id,
        type: 'FILL_BLANK',
        prompt: 'I have had a mild _____ in my shoulder for the past two days.',
        optionsJson: JSON.stringify(['ache', 'cake', 'song', 'flight']),
        correctResponse: 'ache',
        explanation: 'An "ache" is a continuous or prolonged dull pain.',
        orderIndex: 3,
      },
      {
        lessonId: lessonHealth1.id,
        type: 'ROLEPLAY',
        prompt: 'Scenario: Dr. Adams asks you: "Hello Arthur, what brings you into the clinic today?" Explain that you have felt dizzy in the morning for two days.',
        optionsJson: JSON.stringify({
          scenarioTitle: 'Doctor Consultation',
          character: 'Dr. Adams (Physician)',
          initialGreeting: 'Good morning Arthur! Please take a seat. What symptoms have you been experiencing recently?',
          expectedKeywords: ['dizzy', 'morning', 'two days', 'ache', 'headache', 'feeling'],
        }),
        correctResponse: 'Good morning Doctor. I have been feeling dizzy in the morning for the last two days.',
        explanation: 'State your symptom and the duration clearly to help the doctor evaluate you.',
        orderIndex: 4,
      },
    ],
  });

  // ==========================================
  // Module 4: Dining Out & Ordering at a Restaurant
  // ==========================================
  const modDining = await prisma.module.create({
    data: {
      title: 'Dining Out & Ordering at a Restaurant',
      slug: 'dining-out-and-restaurants',
      description: 'Reserve tables, ask about menu ingredients, communicate dietary preferences, and ask for the bill politely.',
      category: 'ENGLISH_CORE',
      level: 'BEGINNER',
      orderIndex: 4,
      icon: 'UtensilsCrossed',
    },
  });

  const lessonDining1 = await prisma.lesson.create({
    data: {
      moduleId: modDining.id,
      title: 'Ordering Food & Requesting the Bill',
      description: 'Practice ordering meals gracefully, asking for water, and requesting the bill at the end of the meal.',
      orderIndex: 1,
      durationMinutes: 10,
      pointsReward: 50,
      contentJson: JSON.stringify({
        summary: 'Enjoy dining out with effortless conversational English.',
        tips: [
          'Say "I would like the vegetable soup, please."',
          'To request water: "Could we please have a glass of water?"',
          'When finished, say: "Could we have the bill/check, please?"',
        ],
        vocabulary: [
          { word: 'Menu', pronunciation: '/ˈmen.juː/', meaning: 'The list of food and beverages available' },
          { word: 'Appetizer', pronunciation: '/ˈæp.ə.taɪ.zər/', meaning: 'A small dish eaten before the main course' },
          { word: 'Bill / Check', pronunciation: '/bɪl/', meaning: 'The slip showing total charges for your dining' },
        ],
      }),
    },
  });

  await prisma.exercise.createMany({
    data: [
      {
        lessonId: lessonDining1.id,
        type: 'FLASHCARD',
        prompt: 'Appetizer',
        optionsJson: JSON.stringify({
          phonetic: '/ˈæp.ə.taɪ.zər/',
          definition: 'A small introductory portion of food or drink served before the main meal.',
          example: '"We ordered a warm bruschetta as an appetizer while waiting for our main courses."',
        }),
        correctResponse: 'Appetizer',
        explanation: 'Appetizers stimulate the appetite before dinner.',
        orderIndex: 1,
      },
      {
        lessonId: lessonDining1.id,
        type: 'SENTENCE_BUILD',
        prompt: 'Assemble the polite restaurant request:',
        optionsJson: JSON.stringify(['Could', 'we', 'please', 'have', 'the', 'bill?']),
        correctResponse: 'Could we please have the bill?',
        explanation: '"Could we please have..." is the most natural and courteous way to request the check.',
        orderIndex: 2,
      },
      {
        lessonId: lessonDining1.id,
        type: 'ROLEPLAY',
        prompt: 'Scenario: Your server Marco says: "Are you ready to order, or do you need a few more minutes?" Ask for the grilled salmon with vegetables, please.',
        optionsJson: JSON.stringify({
          scenarioTitle: 'Restaurant Ordering',
          character: 'Marco (Restaurant Server)',
          initialGreeting: 'Welcome! Are you ready to order your dinner, or would you like another moment?',
          expectedKeywords: ['like', 'order', 'salmon', 'vegetables', 'please', 'ready'],
        }),
        correctResponse: 'We are ready to order, thank you. I would like the grilled salmon with vegetables, please.',
        explanation: 'Begin with polite acknowledgment, then clearly specify your meal choice.',
        orderIndex: 3,
      },
    ],
  });

  // Seed UserProgress for learner
  await prisma.userProgress.create({
    data: {
      userId: learner.id,
      lessonId: lessonGreetings1.id,
      completed: true,
      score: 95,
      attempts: 1,
      completedAt: new Date(),
    },
  });

  await prisma.userProgress.create({
    data: {
      userId: learner.id,
      lessonId: lessonShopping1.id,
      completed: false,
      score: 60,
      attempts: 1,
      lastAttemptAt: new Date(),
    },
  });

  // Seed sample Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        userId: admin.id,
        action: 'ADMIN_SYSTEM_INITIALIZE',
        resource: 'system',
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (Admin Setup Tool)',
        details: JSON.stringify({ event: 'MitraSpeak curriculum seeded with 4 core English modules and 15 exercises' }),
      },
      {
        userId: learner.id,
        action: 'USER_LOGIN',
        resource: 'auth',
        ipAddress: '192.168.1.45',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        details: JSON.stringify({ method: 'JWT_BEARER', status: 'SUCCESS' }),
      },
      {
        userId: learner.id,
        action: 'LESSON_COMPLETED',
        resource: 'lessons',
        ipAddress: '192.168.1.45',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        details: JSON.stringify({ lessonTitle: 'Polite Morning & Evening Greetings', score: 95 }),
      },
    ],
  });

  console.log('--- MitraSpeak Database Seeding Finished Successfully! ---');
}

main()
  .catch((e) => {
    console.error('Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
