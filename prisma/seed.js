const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting BoloEnglish AI Database Seeding ---');

  // Clear existing records
  await prisma.auditLog.deleteMany();
  await prisma.sessionTranscript.deleteMany();
  await prisma.curriculumProgress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.userVocabulary.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversationSession.deleteMany();
  await prisma.scenario.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleaned old records.');

  // Create Users
  const passwordHash = await bcrypt.hash('BoloPass123!', 10);

  const learner = await prisma.user.create({
    data: {
      email: 'shanti.devi@boloenglish.com',
      passwordHash,
      name: 'Shanti Devi',
      role: 'LEARNER',
      nativeLanguage: 'hi',
      learningGoal: 'Speak confidently with family, shopkeepers, and doctors',
      accessibilityPreferences: JSON.stringify({
        fontSize: 'large',
        highContrast: false,
        soundSpeed: '0.85',
      }),
      streakCount: 7,
      totalPoints: 640,
      lastActiveDate: new Date(),
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'aarti.didi@boloenglish.com',
      passwordHash,
      name: 'Aarti Didi (AI Mentor)',
      role: 'ADMIN',
      nativeLanguage: 'hi',
      learningGoal: 'Tutor Indian families with warmth and patience',
      accessibilityPreferences: JSON.stringify({
        fontSize: 'large',
        highContrast: false,
        soundSpeed: '1.0',
      }),
      streakCount: 30,
      totalPoints: 2500,
      lastActiveDate: new Date(),
    },
  });

  console.log('Seeded users: shanti.devi@boloenglish.com & aarti.didi@boloenglish.com');

  // Scenario 1: Buying Vegetables & Groceries
  const scVegetables = await prisma.scenario.create({
    data: {
      title: 'Haggling & Buying Vegetables',
      titleHindi: 'सब्जी मंडी और खरीदारी',
      slug: 'sabzi-mandi',
      category: 'DAILY_LIFE',
      difficulty: 'BEGINNER',
      description: 'Ask for fresh tomatoes, check prices per kilo, ask for extra coriander or green chilies, and pay with cash or UPI.',
      descriptionHindi: 'ताज़ी सब्जियों के दाम पूछना, मोलभाव करना, और मुफ्त धनिया-मिर्ची माँगना सीखें।',
      icon: 'ShoppingBasket',
      characterName: 'Ramesh Bhaiya (Sabziwala)',
      characterNameHindi: 'रमेश भैया (सब्जीवाले)',
      promptContext: 'You are Ramesh Bhaiya, a polite and friendly local Indian vegetable vendor. The user is a homemaker or family member buying vegetables. Speak in simple, welcoming English. If the user uses Hindi or Hinglish words, understand them naturally and reply in simple English.',
      starterAudioText: 'Namaste! Welcome. Today the red tomatoes and fresh ladyfingers are very good. What would you like to buy today?',
      starterAudioHindi: 'नमस्ते! आइए। आज ताज़े टमाटर और ताज़ा भिंडी बहुत बढ़िया हैं। आज आपको क्या चाहिए?',
      orderIndex: 1,
    },
  });

  // Scenario 2: Clinic Visit & Talking to Doctor
  const scDoctor = await prisma.scenario.create({
    data: {
      title: 'Talking to a Doctor at a Clinic',
      titleHindi: 'क्लीनिक में डॉक्टर से बातचीत',
      slug: 'clinic-visit',
      category: 'HEALTH',
      difficulty: 'INTERMEDIATE',
      description: 'Describe aches, fever duration, blood pressure checks, and ask when to take medicine safely.',
      descriptionHindi: 'डॉक्टर को अपने दर्द या तकलीफ के बारे में खुलकर बताना और दवाइयों का समय समझना।',
      icon: 'HeartPulse',
      characterName: 'Dr. Neha Sharma',
      characterNameHindi: 'डॉ. नेहा शर्मा',
      promptContext: 'You are Dr. Neha Sharma, a kind and attentive physician at a neighborhood clinic. The user is an adult family member visiting for a health checkup. Listen attentively, ask gentle clarifying questions in simple English, and reassure them warmly.',
      starterAudioText: 'Namaste Shanti ji! Please sit down comfortably. Tell me, how are you feeling today and what trouble are you having?',
      starterAudioHindi: 'नमस्ते शांति जी! आराम से बैठिए। बताइए, आज आप कैसा महसूस कर रही हैं और आपको क्या तकलीफ है?',
      orderIndex: 2,
    },
  });

  // Scenario 3: Polite WhatsApp Message to Relatives
  const scWhatsApp = await prisma.scenario.create({
    data: {
      title: 'Sending Polite WhatsApp Messages to Relatives',
      titleHindi: 'रिश्तेदारों को वॉट्सऐप संदेश',
      slug: 'whatsapp-relatives',
      category: 'SOCIAL',
      difficulty: 'INTERMEDIATE',
      description: 'Congratulate relatives on weddings or new jobs, inquire about their health, and reply to family group messages gracefully.',
      descriptionHindi: 'पारिवारिक वॉट्सऐप ग्रुप में बधाई देना, हालचाल पूछना और सम्मानपूर्वक संदेश भेजना।',
      icon: 'Send',
      characterName: 'Aarti Didi (Tutor)',
      characterNameHindi: 'आरती दीदी (मार्गदर्शक)',
      promptContext: 'You are Aarti Didi, a supportive Indian sister and mentor. Help the user compose and polish warm, polite WhatsApp messages in English to relatives, cousins, or elders.',
      starterAudioText: 'Namaste! Your niece Priya just got a new job in Bangalore. Let us write a lovely, proud congratulatory message for her together. What would you like to say first?',
      starterAudioHindi: 'नमस्ते! आपकी भतीजी प्रिया की बैंगलोर में नई नौकरी लगी है। आइए मिलकर उसके लिए एक प्यारा सा बधाई संदेश लिखें। आप क्या कहना चाहेंगी?',
      orderIndex: 3,
    },
  });

  // Scenario 4: Ordering Food at a Cafe or Airport
  const scCafe = await prisma.scenario.create({
    data: {
      title: 'Ordering Food at a Café or Airport',
      titleHindi: 'कैफे या एयरपोर्ट पर ऑर्डर देना',
      slug: 'cafe-airport',
      category: 'DAILY_LIFE',
      difficulty: 'ADVANCED',
      description: 'Order hot tea or filter coffee, request less sugar, ask where the seating area is, and pay smoothly.',
      descriptionHindi: 'कैफे में चाय या कॉफी ऑर्डर करना, कम चीनी माँगना और आराम से बैठना।',
      icon: 'Coffee',
      characterName: 'Kunal (Barista)',
      characterNameHindi: 'कुणाल (कैफे स्टाफ)',
      promptContext: 'You are Kunal, a friendly Indian café counter staff. The user wants to order hot drinks or snacks. Be warm, patient, and use clean, clear conversational English.',
      starterAudioText: 'Hello and welcome! Would you like some hot ginger tea, filter coffee, or a light snack today?',
      starterAudioHindi: 'नमस्ते और स्वागत है! आज आप अदरक वाली गरमा-गरम चाय, फिल्टर कॉफी या कोई हल्का स्नैक लेना पसंद करेंगी?',
      orderIndex: 4,
    },
  });

  // Scenario 5: Casual Conversation with Grandchildren & Family
  const scFamily = await prisma.scenario.create({
    data: {
      title: 'Casual Conversation with Grandchildren & Family',
      titleHindi: 'बच्चों और परिवार से बातचीत',
      slug: 'family-chat',
      category: 'FAMILY',
      difficulty: 'BEGINNER',
      description: 'Ask young family members about their school day, favorite food, hobbies, and share daily blessings in English.',
      descriptionHindi: 'बच्चों से उनके स्कूल, पढ़ाई और पसंदीदा खाने के बारे में प्यार से अंग्रेजी में बात करना।',
      icon: 'Users',
      characterName: 'Aarav (Grandson / 12 yrs)',
      characterNameHindi: 'आरव (पोता / 12 वर्ष)',
      promptContext: 'You are Aarav, an affectionate 12-year-old grandson living in an Indian city. You love your Dadi/Nani very much. Speak lovingly and enthusiastically in simple English.',
      starterAudioText: 'Dadi, I just came home from school! I was very hungry. What did you make for evening snacks today?',
      starterAudioHindi: 'दादी, मैं अभी स्कूल से घर आया हूँ! मुझे बहुत भूख लगी है। आज आपने शाम के नाश्ते में क्या बनाया है?',
      orderIndex: 5,
    },
  });

  console.log('Seeded 5 Indian life scenarios.');

  // Seed sample conversation session for Shanti Devi
  const demoSession = await prisma.conversationSession.create({
    data: {
      userId: learner.id,
      scenarioId: scVegetables.id,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        sessionId: demoSession.id,
        sender: 'AI',
        text: 'Namaste! Welcome. Today the red tomatoes and fresh ladyfingers are very good. What would you like to buy today?',
        hindiTranslation: 'नमस्ते! आइए। आज ताज़े टमाटर और ताज़ा भिंडी बहुत बढ़िया हैं। आज आपको क्या चाहिए?',
        createdAt: new Date(Date.now() - 60000),
      },
      {
        sessionId: demoSession.id,
        sender: 'USER',
        text: 'Bhaiya, give me 1 kg tamatar and tell me what is the price?',
        correctedSentence: 'Bhaiya, please give me one kilo of tomatoes. How much do they cost?',
        explanationHindi: "'Tamatar' को अंग्रेजी में 'Tomatoes' कहते हैं, और 'what is the price' की जगह 'How much do they cost?' बोलना अधिक स्वाभाविक लगता है।",
        clarityScore: 85,
        createdAt: new Date(Date.now() - 30000),
      },
      {
        sessionId: demoSession.id,
        sender: 'AI',
        text: 'The tomatoes are forty rupees per kilo, madam. They are very fresh from the farm today. Shall I pack one kilo for you?',
        hindiTranslation: 'टमाटर चालीस रुपये किलो हैं, मैडम। आज खेत से एकदम ताज़े आए हैं। क्या मैं एक किलो पैक कर दूँ?',
        createdAt: new Date(),
      },
    ],
  });

  // Seed Level 0 Foundations Lessons
  const lesson1 = await prisma.lesson.create({
    data: {
      id: 'lesson-l0-aux1',
      level: 'LEVEL_0',
      category: 'AUXILIARY_VERBS',
      title: 'I am & You are: Present Identity',
      titleHindi: 'I am और You are: अपनी पहचान बताना',
      description: 'Learn when to use "am" with "I" and "are" with "you".',
      descriptionHindi: '"I" के साथ "am" और "You" के साथ "are" का सही उपयोग सीखें।',
      ruleSummary: 'Always use "am" with "I". Always use "are" with "You", "We", and "They".',
      ruleSummaryHindi: '"I" के साथ हमेशा "am" आता है (मैं हूँ)। "You" के साथ हमेशा "are" आता है (आप हैं)।',
      orderIndex: 1,
      exercises: JSON.stringify([
        {
          id: 'ex-1',
          type: 'fill_in',
          question: 'I ___ a teacher.',
          questionHindi: 'मैं एक अध्यापिका हूँ।',
          options: ['am', 'is', 'are'],
          correct: 'am',
          explanationHindi: '"I" (मैं) के साथ हमेशा "am" (हूँ) आता है।',
        },
        {
          id: 'ex-2',
          type: 'fill_in',
          question: 'You ___ very kind.',
          questionHindi: 'आप बहुत दयालु हैं।',
          options: ['is', 'are', 'am'],
          correct: 'are',
          explanationHindi: '"You" (आप) के साथ हमेशा "are" (हैं) आता है।',
        },
      ]),
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      id: 'lesson-l0-aux2',
      level: 'LEVEL_0',
      category: 'SUBJECT_VERB_AGREEMENT',
      title: 'He is, She is & It is: Third Person Singular',
      titleHindi: 'He is, She is और It is: वह है',
      description: 'Learn how singular persons take "is" while plural groups take "are".',
      descriptionHindi: 'एकवचन (He/She) के साथ "is" और बहुवचन (They/We) के साथ "are" लगाना सीखें।',
      ruleSummary: 'He is / She is / It is for one person or thing. They are for many.',
      ruleSummaryHindi: 'किसी एक व्यक्ति (He/She) के लिए "is" का प्रयोग करें। एक से अधिक के लिए "are" का प्रयोग करें।',
      orderIndex: 2,
      exercises: JSON.stringify([
        {
          id: 'ex-3',
          type: 'fill_in',
          question: 'She ___ reading a newspaper.',
          questionHindi: 'वह अखबार पढ़ रही है।',
          options: ['is', 'are', 'am'],
          correct: 'is',
          explanationHindi: 'एकवचन "She" (स्त्री) के साथ "is" (है) आएगा।',
        },
        {
          id: 'ex-4',
          type: 'fill_in',
          question: 'They ___ playing in the garden.',
          questionHindi: 'वे बगीचे में खेल रहे हैं।',
          options: ['is', 'am', 'are'],
          correct: 'are',
          explanationHindi: 'बहुवचन "They" (वे) के साथ "are" (हैं) आएगा।',
        },
      ]),
    },
  });

  const lesson3 = await prisma.lesson.create({
    data: {
      id: 'lesson-l0-past',
      level: 'LEVEL_0',
      category: 'PAST_AUXILIARY',
      title: 'Was vs Were: Talking about Yesterday',
      titleHindi: 'Was vs Were: कल की बात (था / थे)',
      description: 'Use "was" for single subjects (I was, He was, She was) and "were" for plurals (We were, They were, You were).',
      descriptionHindi: 'एकवचन के लिए "was" (था/थी) और बहुवचन के लिए "were" (थे) का सही प्रयोग।',
      ruleSummary: 'Singular past = was. Plural and "you" past = were.',
      ruleSummaryHindi: 'एक व्यक्ति बीती बात = was. एक से अधिक या You = were.',
      orderIndex: 3,
      exercises: JSON.stringify([
        {
          id: 'ex-5',
          type: 'fill_in',
          question: 'Yesterday, I ___ at the temple.',
          questionHindi: 'कल मैं मंदिर में था/थी।',
          options: ['was', 'were', 'is'],
          correct: 'was',
          explanationHindi: 'बीते हुए कल में "I" के साथ "was" (था/थी) आता है।',
        },
        {
          id: 'ex-6',
          type: 'fill_in',
          question: 'We ___ very happy.',
          questionHindi: 'हम बहुत खुश थे।',
          options: ['was', 'were', 'am'],
          correct: 'were',
          explanationHindi: '"We" (हम) बहुवचन है, इसलिए भूतकाल में "were" (थे) आएगा।',
        },
      ]),
    },
  });

  const lesson4 = await prisma.lesson.create({
    data: {
      id: 'lesson-l0-svo',
      level: 'LEVEL_0',
      category: 'SENTENCE_BUILDING',
      title: 'Subject + Verb + Object: Sentence Architecture',
      titleHindi: 'Subject + Verb + Object: वाक्य की बुनियाद',
      description: 'In English, sentences follow SVO order: Who does it (Subject) + Action (Verb) + On what (Object).',
      descriptionHindi: 'हिंदी में क्रिया अंत में आती है, लेकिन अंग्रेजी में कर्ता (Subject) के तुरंत बाद क्रिया (Verb) आती है।',
      ruleSummary: 'Formula: [Subject] + [Verb] + [Object] (e.g., I + drink + water).',
      ruleSummaryHindi: 'नियम: [Subject] + [Verb] + [Object] (उदा. She reads a book / वह किताब पढ़ती है)।',
      orderIndex: 4,
      exercises: JSON.stringify([
        {
          id: 'svo-1',
          type: 'word_order',
          hindiSentence: 'मैं ताज़े सेब खाता हूँ।',
          targetSentence: 'I eat fresh apples',
          tokens: ['fresh apples', 'I', 'eat'],
          correctOrder: ['I', 'eat', 'fresh apples'],
          subject: 'I',
          verb: 'eat',
          object: 'fresh apples',
        },
        {
          id: 'svo-2',
          type: 'word_order',
          hindiSentence: 'वह चाय बना रही है।',
          targetSentence: 'She is making tea',
          tokens: ['making tea', 'is', 'She'],
          correctOrder: ['She', 'is', 'making tea'],
          subject: 'She',
          verb: 'is',
          object: 'making tea',
        },
        {
          id: 'svo-3',
          type: 'word_order',
          hindiSentence: 'वे क्रिकेट खेल रहे थे।',
          targetSentence: 'They were playing cricket',
          tokens: ['playing cricket', 'They', 'were'],
          correctOrder: ['They', 'were', 'playing cricket'],
          subject: 'They',
          verb: 'were',
          object: 'playing cricket',
        },
      ]),
    },
  });

  console.log('Seeded 4 foundational Level 0 lessons.');

  // Seed CurriculumProgress for Shanti Devi
  await prisma.curriculumProgress.create({
    data: {
      userId: learner.id,
      lessonId: lesson1.id,
      level: 'LEVEL_0',
      completed: true,
      score: 95,
      accuracyRate: 0.95,
      auxiliaryMastery: JSON.stringify({ is: 4, am: 6, are: 4, was: 2, were: 2 }),
      svoMastery: 4,
      avatarMood: 'celebrating',
      completedAt: new Date(),
    },
  });

  await prisma.curriculumProgress.create({
    data: {
      userId: learner.id,
      lessonId: lesson4.id,
      level: 'LEVEL_0',
      completed: true,
      score: 90,
      accuracyRate: 0.90,
      auxiliaryMastery: JSON.stringify({ is: 4, am: 6, are: 4, was: 2, were: 2 }),
      svoMastery: 5,
      avatarMood: 'celebrating',
      completedAt: new Date(),
    },
  });

  // Seed SessionTranscript
  await prisma.sessionTranscript.create({
    data: {
      userId: learner.id,
      sessionType: 'LEVEL_0_CLASSROOM',
      avatarState: 'cheering',
      userSpeech: 'I am learning English with Aarti Didi',
      aiPrompt: 'Bahut achha Shanti ji! Sahi vakya banaya aapne: "I am learning English"',
      aiAudioEmotion: 'proud',
      accuracy: 98,
      feedbackHindi: 'शाबाश! आपने बिल्कुल सही वाक्य बनाया।',
    },
  });

  console.log('Seeded Level 0 curriculum progress and session transcripts.');

  // Seed User Vocabulary Bookmarks for Shanti Devi
  await prisma.userVocabulary.createMany({
    data: [
      {
        userId: learner.id,
        word: 'Coriander',
        hindiMeaning: 'हरा धनिया',
        phonetic: '/kɒr.iˈæn.dər/',
        exampleSentence: 'Could you please add some fresh coriander in the bag?',
        category: 'Market & Cooking',
      },
      {
        userId: learner.id,
        word: 'Prescription',
        hindiMeaning: 'डॉक्टर का पर्चा / दवा की सूची',
        phonetic: '/prɪˈskrɪp.ʃən/',
        exampleSentence: 'The doctor wrote a new prescription for my vitamins.',
        category: 'Health & Clinic',
      },
      {
        userId: learner.id,
        word: 'Warm Regards',
        hindiMeaning: 'सादर प्रणाम / स्नेहपूर्ण शुभकामनाएं',
        phonetic: '/wɔːm rɪˈɡɑːdz/',
        exampleSentence: 'Give my warm regards to everyone at home.',
        category: 'WhatsApp & Social',
      },
      {
        userId: learner.id,
        word: 'Mild Ache',
        hindiMeaning: 'हल्का-हल्का दर्द',
        phonetic: '/maɪld eɪk/',
        exampleSentence: 'I have a mild ache in my left knee since yesterday.',
        category: 'Health & Clinic',
      },
      {
        userId: learner.id,
        word: 'Bill please',
        hindiMeaning: 'कृपया बिल दे दीजिए',
        phonetic: '/bɪl pliːz/',
        exampleSentence: 'Could we please have the bill?',
        category: 'Dining & Outings',
      },
    ],
  });

  console.log('Seeded initial vocabulary bookmarks.');
  console.log('--- BoloEnglish AI Seeding Completed Successfully! ---');
}

main()
  .catch((e) => {
    console.error('Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
