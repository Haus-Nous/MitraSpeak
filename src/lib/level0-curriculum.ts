// Level 0 Foundations (Absolute Beginner / Kids Level) Curriculum Data

export interface SVOExercise {
  id: string;
  hindiSentence: string;
  targetSentence: string;
  phoneticHindi: string;
  subject: string;
  verb: string;
  object: string;
  tokens: Array<{
    id: string;
    text: string;
    role: 'subject' | 'verb' | 'object' | 'auxiliary';
    roleHindi: string;
    color: string;
  }>;
  hintHindi: string;
  ruleExplanationHindi: string;
}

export interface AuxiliaryDrill {
  id: string;
  sentencePrompt: string; // e.g. "I ___ drinking tea."
  sentenceHindi: string;
  targetWord: 'is' | 'am' | 'are' | 'was' | 'were';
  options: Array<'is' | 'am' | 'are' | 'was' | 'were'>;
  tense: 'present' | 'past';
  subjectType: 'singular' | 'plural' | 'first_person' | 'second_person';
  explanationHindi: string;
}

export interface Level0Lesson {
  id: string;
  orderIndex: number;
  title: string;
  titleHindi: string;
  category: 'AUXILIARY_VERBS' | 'SUBJECT_VERB_AGREEMENT' | 'PAST_AUXILIARY' | 'SENTENCE_BUILDING';
  summary: string;
  summaryHindi: string;
  formula: string;
  formulaHindi: string;
  rules: Array<{
    ruleEnglish: string;
    ruleHindi: string;
    example: string;
    exampleHindi: string;
  }>;
  svoExercises?: SVOExercise[];
  auxiliaryDrills?: AuxiliaryDrill[];
}

export const SVO_CHALLENGES: SVOExercise[] = [
  {
    id: 'svo-1',
    hindiSentence: 'मैं ताज़े सेब खाता हूँ।',
    targetSentence: 'I eat fresh apples',
    phoneticHindi: 'आई ईट फ्रेश एप्पल्स',
    subject: 'I',
    verb: 'eat',
    object: 'fresh apples',
    tokens: [
      { id: 't-1', text: 'fresh apples', role: 'object', roleHindi: 'कर्म (Object)', color: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200' },
      { id: 't-2', text: 'I', role: 'subject', roleHindi: 'कर्ता (Subject)', color: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950 dark:text-sky-200' },
      { id: 't-3', text: 'eat', role: 'verb', roleHindi: 'क्रिया (Verb)', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200' },
    ],
    hintHindi: 'अंग्रेजी में सबसे पहले "I" (कौन), फिर "eat" (क्या करता है), और अंत में "fresh apples" (क्या खाता है) आएगा।',
    ruleExplanationHindi: 'नियम: Subject (I) + Verb (eat) + Object (fresh apples)',
  },
  {
    id: 'svo-2',
    hindiSentence: 'वह किताब पढ़ रही है।',
    targetSentence: 'She is reading a book',
    phoneticHindi: 'शी इज़ रीडिंग अ बुक',
    subject: 'She',
    verb: 'is reading',
    object: 'a book',
    tokens: [
      { id: 't-4', text: 'a book', role: 'object', roleHindi: 'कर्म (Object)', color: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200' },
      { id: 't-5', text: 'is reading', role: 'verb', roleHindi: 'क्रिया (Verb)', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200' },
      { id: 't-6', text: 'She', role: 'subject', roleHindi: 'कर्ता (Subject)', color: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950 dark:text-sky-200' },
    ],
    hintHindi: 'पहले कर्ता "She", फिर सहायक क्रिया + मुख्य क्रिया "is reading", फिर "a book"।',
    ruleExplanationHindi: 'नियम: Subject (She) + Verb (is reading) + Object (a book)',
  },
  {
    id: 'svo-3',
    hindiSentence: 'हम गर्म चाय पीते हैं।',
    targetSentence: 'We drink hot tea',
    phoneticHindi: 'वी ड्रिंक हॉट टी',
    subject: 'We',
    verb: 'drink',
    object: 'hot tea',
    tokens: [
      { id: 't-7', text: 'drink', role: 'verb', roleHindi: 'क्रिया (Verb)', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200' },
      { id: 't-8', text: 'We', role: 'subject', roleHindi: 'कर्ता (Subject)', color: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950 dark:text-sky-200' },
      { id: 't-9', text: 'hot tea', role: 'object', roleHindi: 'कर्म (Object)', color: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200' },
    ],
    hintHindi: 'क्रम: We -> drink -> hot tea',
    ruleExplanationHindi: 'नियम: Subject (We) + Verb (drink) + Object (hot tea)',
  },
  {
    id: 'svo-4',
    hindiSentence: 'वे क्रिकेट खेल रहे थे।',
    targetSentence: 'They were playing cricket',
    phoneticHindi: 'दे वर प्लेइंग क्रिकेट',
    subject: 'They',
    verb: 'were playing',
    object: 'cricket',
    tokens: [
      { id: 't-10', text: 'cricket', role: 'object', roleHindi: 'कर्म (Object)', color: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200' },
      { id: 't-11', text: 'were playing', role: 'verb', roleHindi: 'क्रिया (Verb)', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200' },
      { id: 't-12', text: 'They', role: 'subject', roleHindi: 'कर्ता (Subject)', color: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950 dark:text-sky-200' },
    ],
    hintHindi: 'भूतकाल में बहुवचन "They" के साथ "were playing" आएगा।',
    ruleExplanationHindi: 'नियम: Subject (They) + Past Verb (were playing) + Object (cricket)',
  },
  {
    id: 'svo-5',
    hindiSentence: 'रमेश ताज़ी सब्जियाँ खरीद रहा है।',
    targetSentence: 'Ramesh is buying fresh vegetables',
    phoneticHindi: 'रमेश इज़ बाइंग फ्रेश वेजीटेबल्स',
    subject: 'Ramesh',
    verb: 'is buying',
    object: 'fresh vegetables',
    tokens: [
      { id: 't-13', text: 'fresh vegetables', role: 'object', roleHindi: 'कर्म (Object)', color: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200' },
      { id: 't-14', text: 'Ramesh', role: 'subject', roleHindi: 'कर्ता (Subject)', color: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950 dark:text-sky-200' },
      { id: 't-15', text: 'is buying', role: 'verb', roleHindi: 'क्रिया (Verb)', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200' },
    ],
    hintHindi: 'सब्जी मंडी का वाक्य: रमेश (Subject) + खरीद रहा है (Verb) + ताज़ी सब्जियाँ (Object)',
    ruleExplanationHindi: 'नियम: Subject (Ramesh) + Verb (is buying) + Object (fresh vegetables)',
  },
];

export const AUXILIARY_DRILLS: AuxiliaryDrill[] = [
  {
    id: 'aux-1',
    sentencePrompt: 'I ___ learning English with Aarti Didi.',
    sentenceHindi: 'मैं आरती दीदी के साथ अंग्रेजी सीख रहा/रही हूँ।',
    targetWord: 'am',
    options: ['am', 'is', 'are'],
    tense: 'present',
    subjectType: 'first_person',
    explanationHindi: '"I" (मैं) के साथ हमेशा वर्तमान काल में "am" (हूँ) का प्रयोग होता है। कभी भी "I is" नहीं होता!',
  },
  {
    id: 'aux-2',
    sentencePrompt: 'She ___ my daughter.',
    sentenceHindi: 'वह मेरी बेटी है।',
    targetWord: 'is',
    options: ['is', 'are', 'am'],
    tense: 'present',
    subjectType: 'singular',
    explanationHindi: 'किसी एक व्यक्ति (He/She) के लिए हमेशा "is" (है) आता है।',
  },
  {
    id: 'aux-3',
    sentencePrompt: 'They ___ waiting at the clinic.',
    sentenceHindi: 'वे क्लिनिक में इंतज़ार कर रहे हैं।',
    targetWord: 'are',
    options: ['is', 'are', 'am'],
    tense: 'present',
    subjectType: 'plural',
    explanationHindi: 'बहुवचन "They" (वे) के साथ हमेशा "are" (हैं) आता है।',
  },
  {
    id: 'aux-4',
    sentencePrompt: 'Yesterday, he ___ feeling unwell.',
    sentenceHindi: 'कल उसकी तबीयत ठीक नहीं थी।',
    targetWord: 'was',
    options: ['was', 'were', 'is'],
    tense: 'past',
    subjectType: 'singular',
    explanationHindi: 'बीते हुए कल (Yesterday) में एकवचन "he" के साथ "was" (था) का प्रयोग होता है।',
  },
  {
    id: 'aux-5',
    sentencePrompt: 'We ___ at the sabzi mandi this morning.',
    sentenceHindi: 'हम आज सुबह सब्जी मंडी में थे।',
    targetWord: 'were',
    options: ['was', 'were', 'are'],
    tense: 'past',
    subjectType: 'plural',
    explanationHindi: 'बीती बात में बहुवचन "We" (हम) के साथ हमेशा "were" (थे) आता है।',
  },
  {
    id: 'aux-6',
    sentencePrompt: 'You ___ speaking very clearly today!',
    sentenceHindi: 'आप आज बहुत स्पष्ट बोल रहे हैं!',
    targetWord: 'are',
    options: ['are', 'is', 'am'],
    tense: 'present',
    subjectType: 'second_person',
    explanationHindi: '"You" के साथ वर्तमान में हमेशा "are" आता है, चाहे एक व्यक्ति हो या अनेक।',
  },
];

export const LEVEL_0_LESSONS: Level0Lesson[] = [
  {
    id: 'lesson-l0-aux1',
    orderIndex: 1,
    title: 'Lesson 0.1: I am & You are',
    titleHindi: 'पाठ 0.1: I am और You are (अपनी और दूसरों की बात)',
    category: 'AUXILIARY_VERBS',
    summary: 'Master the fundamental auxiliary verbs "am" and "are" for self-identity and direct address.',
    summaryHindi: '"I" के साथ "am" और "You" के साथ "are" का अचूक प्रयोग सीखें।',
    formula: 'I + am ... | You + are ...',
    formulaHindi: 'मैं + हूँ (I am) | आप + हैं (You are)',
    rules: [
      {
        ruleEnglish: 'Always pair "I" with "am" in present tense. Never say "I is".',
        ruleHindi: '"I" के साथ केवल "am" आएगा। कभी भी "I is" नहीं बोलना चाहिए।',
        example: 'I am ready. (मैं तैयार हूँ।)',
        exampleHindi: 'I am ready. • आई ऍम रेडी।',
      },
      {
        ruleEnglish: 'Always pair "You" with "are".',
        ruleHindi: '"You" के साथ हमेशा "are" आता है।',
        example: 'You are very kind. (आप बहुत दयालु हैं।)',
        exampleHindi: 'You are very kind. • यू आर वेरी काइंड।',
      },
    ],
    auxiliaryDrills: AUXILIARY_DRILLS.filter((d) => d.targetWord === 'am' || (d.targetWord === 'are' && d.subjectType === 'second_person')),
  },
  {
    id: 'lesson-l0-aux2',
    orderIndex: 2,
    title: 'Lesson 0.2: He is, She is & They are',
    titleHindi: 'पाठ 0.2: He is, She is और They are (तीसरे व्यक्ति की बात)',
    category: 'SUBJECT_VERB_AGREEMENT',
    summary: 'Learn subject-verb agreement for singular (is) versus plural (are).',
    summaryHindi: 'एकवचन (is) और बहुवचन (are) का भेद समझना।',
    formula: 'He / She / It + is ... | We / They + are ...',
    formulaHindi: 'वह (एकवचन) + is | वे / हम (बहुवचन) + are',
    rules: [
      {
        ruleEnglish: 'Use "is" with singular third-person subjects (He, She, It, Ramesh, Shanti).',
        ruleHindi: 'किसी एक व्यक्ति या वस्तु के लिए "is" का प्रयोग करें।',
        example: 'Ramesh is at home. (रमेश घर पर है।)',
        exampleHindi: 'Ramesh is at home. • रमेश इज़ एट होम।',
      },
      {
        ruleEnglish: 'Use "are" with plural subjects (We, They, The children).',
        ruleHindi: 'एक से अधिक व्यक्तियों के लिए "are" का प्रयोग करें।',
        example: 'They are happy. (वे खुश हैं।)',
        exampleHindi: 'They are happy. • दे आर हैप्पी।',
      },
    ],
    auxiliaryDrills: AUXILIARY_DRILLS.filter((d) => d.targetWord === 'is' || (d.targetWord === 'are' && d.subjectType === 'plural')),
  },
  {
    id: 'lesson-l0-past',
    orderIndex: 3,
    title: 'Lesson 0.3: Was vs Were (Talking about Yesterday)',
    titleHindi: 'पाठ 0.3: Was vs Were (बीते हुए कल की बात)',
    category: 'PAST_AUXILIARY',
    summary: 'Master past tense auxiliaries: "was" for singular and "were" for plural.',
    summaryHindi: 'भूतकाल में था/थी के लिए "was" और थे/थीं के लिए "were" का नियम।',
    formula: 'I / He / She / It + was ... | You / We / They + were ...',
    formulaHindi: 'एकवचन + was (था/थी) | बहुवचन / You + were (थे)',
    rules: [
      {
        ruleEnglish: 'Use "was" for single subjects in the past (I was, He was, She was).',
        ruleHindi: 'बीते समय में अकेले व्यक्ति के लिए "was" (था/थी) आता है।',
        example: 'I was busy yesterday. (कल मैं व्यस्त थी।)',
        exampleHindi: 'I was busy yesterday. • आई वॉज़ बिज़ी येस्टरडे।',
      },
      {
        ruleEnglish: 'Use "were" for plural subjects and "you" in the past (We were, They were, You were).',
        ruleHindi: 'बीते समय में एक से अधिक या You के लिए "were" (थे) आता है।',
        example: 'We were at the doctor. (हम डॉक्टर के यहाँ थे।)',
        exampleHindi: 'We were at the doctor. • वी वर एट द डॉक्टर।',
      },
    ],
    auxiliaryDrills: AUXILIARY_DRILLS.filter((d) => d.tense === 'past'),
  },
  {
    id: 'lesson-l0-svo',
    orderIndex: 4,
    title: 'Lesson 0.4: Sentence Building (Subject + Verb + Object)',
    titleHindi: 'पाठ 0.4: वाक्य निर्माण (Subject + Verb + Object)',
    category: 'SENTENCE_BUILDING',
    summary: 'The golden formula of English sentences: Who does it + Action + Target.',
    summaryHindi: 'अंग्रेजी वाक्य का स्वर्णिम नियम: कर्ता + क्रिया + कर्म।',
    formula: '[Subject] + [Verb] + [Object]',
    formulaHindi: '[कर्ता: कौन] + [क्रिया: क्या कर रहा है] + [कर्म: किस पर]',
    rules: [
      {
        ruleEnglish: 'Unlike Hindi where verb comes at the end, English puts the verb right after the subject.',
        ruleHindi: 'हिंदी में क्रिया अंत में आती है (उदा. "मैं चाय पीता हूँ"), लेकिन अंग्रेजी में क्रिया बीच में आती है ("I drink tea")।',
        example: 'I (Subject) + drink (Verb) + tea (Object).',
        exampleHindi: 'I drink tea. • आई ड्रिंक टी।',
      },
      {
        ruleEnglish: 'Drag or tap words in order: Subject first, Verb second, Object last.',
        ruleHindi: 'शब्दों को सही क्रम में रखें: पहले Subject, फिर Verb, फिर Object।',
        example: 'She is reading a book.',
        exampleHindi: 'She is reading a book. • शी इज़ रीडिंग अ बुक।',
      },
    ],
    svoExercises: SVO_CHALLENGES,
  },
];

export const AARTI_DIDI_AVATAR_MESSAGES = {
  welcome: {
    hindi: 'नमस्ते जी! मैं आरती दीदी। अंग्रेजी की शुरुआत बिल्कुल बुनियादी व्याकरण से करेंगे। कोई डर नहीं, हम साथ मिलकर सीखेंगे!',
    english: 'Namaste ji! I am Aarti Didi. We will start English from the absolute foundation. No fear, we will learn together step by step!',
  },
  cheering: {
    hindi: 'शाबाश! आपने बिल्कुल सही उत्तर दिया!',
    english: 'Splendid! You got it completely right!',
  },
  explaining: {
    hindi: 'कोई बात नहीं जी, थोड़ा सा ध्यान दीजिए। चलिए नियम समझते हैं।',
    english: 'No problem at all! Let us understand the rule together.',
  },
  listening: {
    hindi: 'दीदी सुन रही हैं, साफ-साफ बोलिए...',
    english: 'Didi is listening, speak clearly...',
  },
  speaking: {
    hindi: 'दीदी बोल रही हैं, ध्यान से सुनिए...',
    english: 'Didi is speaking, listen carefully...',
  },
  idle: {
    hindi: 'तैयार हैं? चलिए शुरू करते हैं!',
    english: 'Ready? Let us get started!',
  },
  svoEncouragement: {
    hindi: 'बहुत अच्छा! अंग्रेजी का स्वर्णिम नियम याद रखिए: Subject (कौन) + Verb (क्रिया) + Object (कर्म)।',
    english: 'Very good! Remember the golden rule: Subject + Verb + Object!',
  },
  successCelebration: [
    'शाबाश! आपने बिल्कुल सही वाक्य बनाया!',
    'अरे वाह! बहुत अच्छा! आपकी समझ बहुत तेज़ है!',
    'कमाल कर दिया! धीरे-धीरे आपकी अंग्रेजी बहुत मजबूत हो रही है!',
  ],
  gentleCorrection: [
    'कोई बात नहीं जी! एक बार और कोशिश करते हैं। पहले सोचिए कि काम कौन कर रहा है (Subject)?',
    'थोड़ा सा ध्यान दीजिए: हिंदी में क्रिया अंत में आती है, लेकिन अंग्रेजी में क्रिया (Verb) बीच में आएगी।',
    'चिंता मत कीजिए, गलती से ही सीखते हैं! चलिए दोबारा जमाते हैं।',
  ],
};
