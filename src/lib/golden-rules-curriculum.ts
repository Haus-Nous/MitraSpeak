// Comprehensive Step-by-Step English Grammar & Golden Rules (Rapidex & Wren & Martin Method)
// Designed for a 5-year-old child or absolute beginner learning conversational English.

export interface DialogueTurn {
  speaker: string;
  speakerHindi: string;
  text: string;
  hindi: string;
  phoneticHindi: string;
}

export interface RulePracticeQuestion {
  id: string;
  questionPrompt: string;
  questionHindi: string;
  type: 'mcq' | 'speech_translation' | 'fill_in_the_blank';
  targetEnglish: string;
  options: string[];
  correctAnswer: string;
  hintHindi: string;
  explanationHindi: string;
}

export interface ConversationalBenefit {
  situationTitle: string;
  situationTitleHindi: string;
  whyItMattersHindi: string;
  dialogueSnippet: DialogueTurn[];
  practicalTipHindi: string;
}

export interface GoldenRule {
  id: string;
  number: number;
  stageNumber: number;
  stageName: string;
  stageNameHindi: string;
  titleEnglish: string;
  titleHindi: string;
  referenceBook: string;
  explanationHindi: string;
  childAnalogyHindi: string;
  visualFormula: string;
  visualFormulaHindi: string;
  aartiDidiAudioSpeech: string;
  wrongExample: string;
  correctExample: string;
  whyWrongHindi: string;
  practiceQuestions: RulePracticeQuestion[];
  conversationalBenefit: ConversationalBenefit;
}

export interface GrammarStage {
  stageNumber: number;
  titleEnglish: string;
  titleHindi: string;
  descriptionHindi: string;
  colorScheme: string;
  ruleIds: string[];
}

export const GRAMMAR_STAGES: GrammarStage[] = [
  {
    stageNumber: 1,
    titleEnglish: 'The Magic Building Blocks',
    titleHindi: 'शुरुआती ईंटें: नाम, सर्वनाम और आर्टिकल्स',
    descriptionHindi: 'जैसे घर बनाने के लिए ईंटें चाहिए, वैसे ही अंग्रेजी बोलने के लिए शब्द चाहिए।',
    colorScheme: 'from-amber-500 to-orange-600',
    ruleIds: ['rule-1', 'rule-2', 'rule-3', 'rule-4'],
  },
  {
    stageNumber: 2,
    titleEnglish: 'Verbs & Helping Friends',
    titleHindi: 'क्रिया और मददगार दोस्त (is/am/are/was/were/has/have)',
    descriptionHindi: 'बिना क्रिया के कोई बात नहीं बन सकती। जानिए कब किसका इस्तेमाल करना है।',
    colorScheme: 'from-emerald-500 to-teal-600',
    ruleIds: ['rule-5', 'rule-6', 'rule-7'],
  },
  {
    stageNumber: 3,
    titleEnglish: 'The #1 Golden Rule of English',
    titleHindi: 'अंग्रेजी का सबसे बड़ा नियम: एकवचन-बहुवचन का तालमेल',
    descriptionHindi: 'Wren & Martin का सबसे महत्वपूर्ण नियम: अकेला कर्ता क्रिया में s/es माँगता है!',
    colorScheme: 'from-blue-500 to-indigo-600',
    ruleIds: ['rule-8'],
  },
  {
    stageNumber: 4,
    titleEnglish: 'The 12 Tenses Master Cycle',
    titleHindi: 'काल का संपूर्ण चक्र (Rapidex का जादुई फॉर्मूला)',
    descriptionHindi: 'कब क्या हुआ, क्या हो रहा है, और क्या होगा — ता है, रहा है, चुका है, था, गा का रहस्य।',
    colorScheme: 'from-purple-500 to-pink-600',
    ruleIds: ['rule-9', 'rule-10', 'rule-11', 'rule-12', 'rule-13', 'rule-14', 'rule-15'],
  },
  {
    stageNumber: 5,
    titleEnglish: 'Modals of Polite Conversation',
    titleHindi: 'विनम्र बातचीत और महाशक्तियाँ (Can, May, Should, Could, Would)',
    descriptionHindi: 'दुनिया में प्यार और सम्मान पाने के लिए अंग्रेजी के जादुई विनम्र शब्द।',
    colorScheme: 'from-rose-500 to-red-600',
    ruleIds: ['rule-16', 'rule-17', 'rule-18'],
  },
  {
    stageNumber: 6,
    titleEnglish: 'Sentence Mastery & Daily Flow',
    titleHindi: 'वाक्य निर्माण और सवालों की कला (SVO, Not, Questions, Prepositions)',
    descriptionHindi: 'शब्दों को सही क्रम में सजाकर धाराप्रवाह बोलना और बेझिझक सवाल पूछना।',
    colorScheme: 'from-teal-500 to-cyan-600',
    ruleIds: ['rule-19', 'rule-20', 'rule-21', 'rule-22'],
  },
];

export const GOLDEN_RULES: GoldenRule[] = [
  // STAGE 1: The Magic Building Blocks
  {
    id: 'rule-1',
    number: 1,
    stageNumber: 1,
    stageName: 'The Magic Building Blocks',
    stageNameHindi: 'शुरुआती ईंटें',
    titleEnglish: 'Nouns: Everything in the World has a Name',
    titleHindi: 'संज्ञा (Noun): दुनिया में हर चीज़ का एक प्यारा नाम है',
    referenceBook: 'Wren & Martin',
    explanationHindi:
      'Wren & Martin का पहला नियम: जिसे भी आप अपनी आँखों से देख सकते हैं, छू सकते हैं या महसूस कर सकते हैं — चाहे वह इंसान हो (Ramesh), जगह हो (Delhi), जानवर हो (Cow) या चीज़ हो (Chair) — वह Noun है।',
    childAnalogyHindi:
      'जैसे आपके घर में हर खिलौने, कमरे और परिवार के सदस्य का नाम होता है — बस उसी नाम को अंग्रेजी में "Noun" कहते हैं!',
    visualFormula: 'Noun = Person (इंसान) + Place (जगह) + Animal (जानवर) + Thing (चीज़)',
    visualFormulaHindi: 'नाम = व्यक्ति + स्थान + पशु + वस्तु',
    aartiDidiAudioSpeech:
      'नमस्ते प्यारे बच्चों और दोस्तों! पहला नियम बहुत सरल है: दुनिया में हर चीज़ का नाम Noun है। जैसे Shanti, Mumbai, Apple, और Table।',
    wrongExample: 'I saw a very big run yesterday.',
    correctExample: 'I saw a very big elephant yesterday.',
    whyWrongHindi: '"run" तो क्रिया (दौड़ना) है। हाथी (elephant) एक जानवर का नाम है, इसलिए यहाँ Noun चाहिए।',
    practiceQuestions: [
      {
        id: 'q1-1',
        questionPrompt: 'Identify the Noun: "Aarti Didi drinks milk every morning."',
        questionHindi: 'इस वाक्य में कौन सा शब्द Noun (चीज़/इंसान का नाम) है?',
        type: 'mcq',
        targetEnglish: 'milk',
        options: ['drinks', 'milk', 'every'],
        correctAnswer: 'milk',
        hintHindi: 'दूध एक चीज़ का नाम है जिसे हम पीते हैं।',
        explanationHindi: '"milk" और "Aarti Didi" दोनों नाम (Noun) हैं!',
      },
      {
        id: 'q1-2',
        questionPrompt: 'Translate by speaking: "यह एक किताब है।"',
        questionHindi: 'माइक दबाकर बोलिए: "यह एक किताब है।"',
        type: 'speech_translation',
        targetEnglish: 'This is a book',
        options: ['This is a book', 'This is a run', 'Book this is'],
        correctAnswer: 'This is a book',
        hintHindi: 'बोलिए: This is a book',
        explanationHindi: 'Book (किताब) एक वस्तु (Noun) है। शाबाश!',
      },
    ],
    conversationalBenefit: {
      situationTitle: 'At the Market / Sabzi Mandi',
      situationTitleHindi: 'सब्ज़ी मंडी में सही चीज़ माँगना',
      whyItMattersHindi:
        'जब आपको फल-सब्ज़ियों (Apple, Potato, Onion) का सही नाम पता होगा, तो आप बिना किसी झिझक के सीधे बोल सकेंगे: "Please give me 1 kg potatoes."',
      dialogueSnippet: [
        {
          speaker: 'You',
          speakerHindi: 'आप',
          text: 'Bhaiya, do you have fresh tomatoes?',
          hindi: 'भैया, क्या आपके पास ताज़े टमाटर हैं?',
          phoneticHindi: 'भैया, डू यू हैव फ्रेश टमेटोज़?',
        },
        {
          speaker: 'Vendor',
          speakerHindi: 'सब्ज़ीवाला',
          text: 'Yes madam, very fresh tomatoes from the farm.',
          hindi: 'हाँ मैडम, खेत के बिल्कुल ताज़े टमाटर हैं।',
          phoneticHindi: 'यस मैडम, वेरी फ्रेश टमेटोज़ फ्रॉम द फार्म।',
        },
      ],
      practicalTipHindi: 'रोज़ाना अपने घर की 5 चीज़ों के नाम अंग्रेजी में याद करके बोलिए (जैसे: Spoon, Fan, Plate)।',
    },
  },

  {
    id: 'rule-2',
    number: 2,
    stageNumber: 1,
    stageName: 'The Magic Building Blocks',
    stageNameHindi: 'शुरुआती ईंटें',
    titleEnglish: 'Pronouns: The Friendly Helpers of Nouns',
    titleHindi: 'सर्वनाम (Pronoun): बार-बार नाम न दोहराने का जादू',
    referenceBook: 'Rapidex & Wren & Martin',
    explanationHindi:
      'Rapidex का नियम: अगर हम बार-बार कहें "रमेश अच्छा लड़का है, रमेश सुबह उठता है, रमेश स्कूल जाता है", तो अजीब लगता है। इसलिए हम रमेश की जगह "वह" (He) बोलते हैं। यही Pronoun है।',
    childAnalogyHindi:
      'खुद के लिए "I" (मैं), सामने वाले के लिए "You" (आप/तुम), लड़के के लिए "He" (वह), लड़की के लिए "She" (वह), चीज़ या जानवर के लिए "It" (यह), और जब हम सब साथ हों तो "We" (हम)।',
    visualFormula: 'I (मैं) | You (आप) | He (वह-लड़का) | She (वह-लड़की) | It (यह) | We (हम) | They (वे)',
    visualFormulaHindi: 'Pronoun = नाम की जगह आने वाला छोटा शब्द',
    aartiDidiAudioSpeech:
      'दूसरा नियम: बार-बार नाम नहीं लेते! लड़के के लिए He, लड़की के लिए She, और जब आप खुद की बात करें तो बोलिए I।',
    wrongExample: 'Radha is my sister. Radha is very smart.',
    correctExample: 'Radha is my sister. She is very smart.',
    whyWrongHindi: 'बार-बार Radha बोलने की जगह हमें प्यार से "She" का उपयोग करना चाहिए।',
    practiceQuestions: [
      {
        id: 'q2-1',
        questionPrompt: 'Fill in the blank: "Rohan is sleeping because ___ is tired."',
        questionHindi: 'रोहन के लिए सही शब्द चुनिए:',
        type: 'mcq',
        targetEnglish: 'He',
        options: ['He', 'She', 'It'],
        correctAnswer: 'He',
        hintHindi: 'रोहन एक लड़का है, इसलिए क्या आएगा?',
        explanationHindi: 'लड़के के लिए हमेशा "He" का इस्तेमाल होता है!',
      },
      {
        id: 'q2-2',
        questionPrompt: 'Translate by speaking: "हम खुश हैं।"',
        questionHindi: 'माइक दबाकर बोलिए: "हम खुश हैं।"',
        type: 'speech_translation',
        targetEnglish: 'We are happy',
        options: ['We are happy', 'They are happy', 'I am happy'],
        correctAnswer: 'We are happy',
        hintHindi: 'बोलिए: We are happy',
        explanationHindi: '"हम" के लिए Pronoun है "We"। बहुत बढ़िया!',
      },
    ],
    conversationalBenefit: {
      situationTitle: 'Talking to Relatives or Teachers',
      situationTitleHindi: 'रिश्तेदारों या शिक्षकों से बच्चों के बारे में बात करना',
      whyItMattersHindi:
        'शिक्षक से बात करते समय बार-बार बच्चे का नाम लेने के बजाय जब आप "He does his homework on time" या "She loves drawing" कहते हैं, तो आपकी भाषा बहुत स्वाभाविक लगती है।',
      dialogueSnippet: [
        {
          speaker: 'Teacher',
          speakerHindi: 'शिक्षिका',
          text: 'How is Aarav studying at home?',
          hindi: 'आरव घर पर कैसी पढ़ाई कर रहा है?',
          phoneticHindi: 'हाउ इज़ आरव स्टडीइंग एट होम?',
        },
        {
          speaker: 'Parent',
          speakerHindi: 'अभिभावक',
          text: 'He reads every evening, and he loves maths.',
          hindi: 'वह हर शाम पढ़ता है, और उसे गणित बहुत पसंद है।',
          phoneticHindi: 'ही रीड्स एव्री इवनिंग, एंड ही लव्स मैथ्स।',
        },
      ],
      practicalTipHindi: 'लड़के के लिए He, लड़की के लिए She, और निर्जीव चीज़ या बच्चे/जानवर के लिए It याद रखें।',
    },
  },

  {
    id: 'rule-3',
    number: 3,
    stageNumber: 1,
    stageName: 'The Magic Building Blocks',
    stageNameHindi: 'शुरुआती ईंटें',
    titleEnglish: 'Articles (A vs An): The Sound Secret of Wren & Martin',
    titleHindi: 'आर्टिकल्स (A vs An): अक्षर नहीं, आवाज़ का जादुई नियम!',
    referenceBook: 'Wren & Martin',
    explanationHindi:
      'Wren & Martin का सबसे मशहूर सुनहरा नियम: "A" या "An" का चुनाव अंग्रेजी के अक्षर (Letter) से नहीं, बल्कि गले से निकलने वाली आवाज़ (Sound) से होता है! अगर शब्द की शुरुआत हिंदी के स्वर (अ, आ, इ, ई, उ, ऊ, ए, ऐ, ओ, औ) की आवाज़ से हो, तो "An" आएगा।',
    childAnalogyHindi:
      'जैसे "Honest" (ऑनेस्ट) में H शांत रहता है और आवाज़ "ओ" से निकलती है, इसलिए "An honest man"। वहीं "University" (यूनिवर्सिटी) में आवाज़ "य" (व्यंजन) की है, इसलिए "A university"!',
    visualFormula: 'स्वर की आवाज़ (Vowel Sound: अ, आ, इ, ई, उ, ए, ओ) = An | व्यंजन की आवाज़ (Consonant Sound: क, ख, ग, य, व) = A',
    visualFormulaHindi: 'आवाज़ स्वर की तो An, आवाज़ व्यंजन की तो A',
    aartiDidiAudioSpeech:
      'तीसरा नियम बहुत ध्यान से सुनिए! केवल A-E-I-O-U देखकर An मत लगाइए। शब्द को बोलकर देखिए — अगर गले से स्वर की आवाज़ आए, तभी An लगेगा। जैसे An apple, An hour!',
    wrongExample: 'He is a honest shopkeeper.',
    correctExample: 'He is an honest shopkeeper.',
    whyWrongHindi: '"Honest" का उच्चारण "ऑनेस्ट" (अ-स्वर) होता है, H की आवाज़ नहीं आती। इसलिए "An" आएगा।',
    practiceQuestions: [
      {
        id: 'q3-1',
        questionPrompt: 'Choose correct: "I will meet you in ___ hour."',
        questionHindi: 'Hour (आवर) के पहले क्या लगेगा?',
        type: 'mcq',
        targetEnglish: 'an',
        options: ['a', 'an', 'the'],
        correctAnswer: 'an',
        hintHindi: 'Hour को बोलते हैं "आवर" — आवाज़ "आ" (स्वर) की है।',
        explanationHindi: 'शाबाश! स्वर की आवाज़ होने के कारण "an hour" सही है!',
      },
      {
        id: 'q3-2',
        questionPrompt: 'Translate by speaking: "यह एक छाता है।"',
        questionHindi: 'माइक दबाकर बोलिए: "यह एक छाता है।"',
        type: 'speech_translation',
        targetEnglish: 'This is an umbrella',
        options: ['This is an umbrella', 'This is a umbrella', 'This umbrella is'],
        correctAnswer: 'This is an umbrella',
        hintHindi: 'Umbrella (अम्ब्रेला) अ से शुरू होता है: This is an umbrella',
        explanationHindi: '"Umbrella" की शुरुआत "अ" की आवाज़ से होती है, इसलिए "An umbrella"!',
      },
    ],
    conversationalBenefit: {
      situationTitle: 'At the Clinic / Doctor Appointment',
      situationTitleHindi: 'डॉक्टर के क्लिनिक में समय बताना',
      whyItMattersHindi:
        'जब आप डॉक्टर या रिसेप्शनिस्ट से कहते हैं: "Doctor, please wait for an hour" या "I had an apple", तो सुनने वाले को तुरंत लगता है कि आपकी अंग्रेजी की बुनियाद पक्की है।',
      dialogueSnippet: [
        {
          speaker: 'Receptionist',
          speakerHindi: 'रिसेप्शनिस्ट',
          text: 'When did your headache start?',
          hindi: 'आपका सिरदर्द कब शुरू हुआ?',
          phoneticHindi: 'व्हेन डिड योर हेडेक स्टार्ट?',
        },
        {
          speaker: 'You',
          speakerHindi: 'आप',
          text: 'It started an hour ago, after taking tea.',
          hindi: 'यह एक घंटे पहले शुरू हुआ, चाय पीने के बाद।',
          phoneticHindi: 'इट स्टार्टेड एन आवर अगो, आफ्टर टेकिंग टी।',
        },
      ],
      practicalTipHindi: 'याद रखें: An apple, An egg, An umbrella, An honest man, An hour — लेकिन A university, A pen!',
    },
  },

  {
    id: 'rule-4',
    number: 4,
    stageNumber: 1,
    stageName: 'The Magic Building Blocks',
    stageNameHindi: 'शुरुआती ईंटें',
    titleEnglish: 'The Article "The": The Royal Crown for Specific Things',
    titleHindi: 'आर्टिकल "The": किसी खास या दुनिया में इकलौती चीज़ का ताज',
    referenceBook: 'Wren & Martin',
    explanationHindi:
      'Wren & Martin का नियम: जब आप किसी ऐसी चीज़ की बात करते हैं जो दुनिया में केवल एक है (The Sun, The Moon, The Earth, The Taj Mahal) या किसी ऐसी चीज़ की बात करते हैं जिसके बारे में पहले बात हो चुकी है, तो "The" का उपयोग होता है।',
    childAnalogyHindi:
      'जैसे कोई भी सेब हो तो "An apple", लेकिन वही सेब जो आपकी मेज पर रखा है तो "The apple on the table"। खास चीज़ को ताज पहनाने के लिए "The" लगाते हैं!',
    visualFormula: 'दुनिया में एक ही चीज़ (The Sun, The Moon) OR पहले से जानी-पहचानी चीज़ = The',
    visualFormulaHindi: 'The = कोई खास या निश्चित वस्तु',
    aartiDidiAudioSpeech:
      'चौथा नियम: जब बात किसी खास चीज़ की हो, या सूरज, चाँद, गंगा जैसी इकलौती चीज़ों की, तो हमेशा The लगाइए। The sun rises in the east!',
    wrongExample: 'Sun gives us light and warmth.',
    correctExample: 'The sun gives us light and warmth.',
    whyWrongHindi: 'सूरज (Sun) दुनिया में इकलौता और अद्वितीय है, इसलिए "The Sun" कहना अनिवार्य है।',
    practiceQuestions: [
      {
        id: 'q4-1',
        questionPrompt: 'Fill in the blank: "___ moon shines brightly at night."',
        questionHindi: 'Moon (चाँद) के पहले क्या लगेगा?',
        type: 'mcq',
        targetEnglish: 'The',
        options: ['A', 'An', 'The'],
        correctAnswer: 'The',
        hintHindi: 'चाँद दुनिया में सिर्फ एक ही है।',
        explanationHindi: 'अद्वितीय खगोलीय पिंडों के पहले हमेशा "The" आता है!',
      },
      {
        id: 'q4-2',
        questionPrompt: 'Translate by speaking: "गंगा एक पवित्र नदी है।"',
        questionHindi: 'माइक दबाकर बोलिए: "द गंगा इज़ अ होली रिवर।"',
        type: 'speech_translation',
        targetEnglish: 'The Ganga is a holy river',
        options: ['The Ganga is a holy river', 'Ganga is a holy river', 'A Ganga is holy river'],
        correctAnswer: 'The Ganga is a holy river',
        hintHindi: 'बोलिए: The Ganga is a holy river',
        explanationHindi: 'नदियों के पावन नामों के पहले "The" लगता है। बहुत खूब!',
      },
    ],
    conversationalBenefit: {
      situationTitle: 'Giving Directions or Hotel Travel',
      situationTitleHindi: 'रास्ता बताते समय या होटल में बात करते समय',
      whyItMattersHindi:
        'जब आप कहते हैं: "Please take the keys from the table" या "Meet me near the main gate", तो सामने वाला बिना भटके समझ जाता है कि आप किस खास गेट या चाबी की बात कर रहे हैं।',
      dialogueSnippet: [
        {
          speaker: 'Hotel Receptionist',
          speakerHindi: 'होटल रिसेप्शनिस्ट',
          text: 'Where are my room keys?',
          hindi: 'मेरे कमरे की चाबियाँ कहाँ हैं?',
          phoneticHindi: 'व्हेयर आर माय रूम कीज़?',
        },
        {
          speaker: 'Staff',
          speakerHindi: 'स्टाफ',
          text: 'The keys are kept on the reception desk, sir.',
          hindi: 'चाबियाँ रिसेप्शन डेस्क पर रखी हुई हैं, सर।',
          phoneticHindi: 'द कीज़ आर केप्ट ऑन द रिसेप्शन डेस्क, सर।',
        },
      ],
      practicalTipHindi: 'किसी भी खास, निश्चित वस्तु के लिए "The" बोलें: The doctor, The book, The principal!',
    },
  },

  // STAGE 2: Verbs & Helping Friends
  {
    id: 'rule-5',
    number: 5,
    stageNumber: 2,
    stageName: 'Verbs & Helping Friends',
    stageNameHindi: 'क्रिया और मददगार दोस्त',
    titleEnglish: 'Helping Verbs (is, am, are, was, were): Who Takes What?',
    titleHindi: 'सहायक क्रियाएँ: किसका कौन सा पक्का दोस्त है?',
    referenceBook: 'Rapidex',
    explanationHindi:
      'Rapidex का आधारभूत नियम: वर्तमान में I के साथ केवल "am" आता है। He / She / It और एकवचन के साथ "is" आता है। You / We / They और बहुवचन के साथ "are" आता है। भूतकाल (Past) में अकेला हो तो "was", एक से ज्यादा हों तो "were"।',
    childAnalogyHindi:
      'I का सबसे पक्का दोस्त सिर्फ am है (I am)। जब कोई अकेला खड़ा हो तो is (He is, She is)। जब एक से ज्यादा लोग हों तो are (They are, We are)।',
    visualFormula: 'I + am | He/She/It + is | You/We/They + are || Past: Singular + was | Plural/You + were',
    visualFormulaHindi: 'वर्तमान: am (मैं), is (वह), are (हम/वे) | भूतकाल: was (था), were (थे)',
    aartiDidiAudioSpeech:
      'पाँचवाँ नियम अंग्रेजी बोलने की रीढ़ की हड्डी है! कभी I is मत बोलिए, बोलिए I am। जब वे बहुत सारे हों तो They are!',
    wrongExample: 'I is a good teacher and they was playing.',
    correctExample: 'I am a good teacher and they were playing.',
    whyWrongHindi: 'I के साथ हमेशा "am" आता है, और बहुवचन "they" के साथ भूतकाल में "were" आता है।',
    practiceQuestions: [
      {
        id: 'q5-1',
        questionPrompt: 'Fill in the blank: "My daughter ___ very hardworking."',
        questionHindi: '"मेरी बेटी" (एकवचन) के साथ क्या आएगा?',
        type: 'mcq',
        targetEnglish: 'is',
        options: ['is', 'are', 'am'],
        correctAnswer: 'is',
        hintHindi: 'बेटी अकेली (Singular) है।',
        explanationHindi: 'एकवचन कर्ता के साथ हमेशा "is" आता है!',
      },
      {
        id: 'q5-2',
        questionPrompt: 'Translate by speaking: "हम कल बाज़ार में थे।"',
        questionHindi: 'माइक दबाकर बोलिए: "हम कल बाज़ार में थे।"',
        type: 'speech_translation',
        targetEnglish: 'We were in the market yesterday',
        options: ['We were in the market yesterday', 'We was in the market yesterday', 'We are in the market yesterday'],
        correctAnswer: 'We were in the market yesterday',
        hintHindi: 'बोलिए: We were in the market yesterday',
        explanationHindi: '"We" (हम) बहुवचन है और कल की बात है, इसलिए "were" आएगा। उत्तम!',
      },
    ],
    conversationalBenefit: {
      situationTitle: 'Introducing Family to Neighbors',
      situationTitleHindi: 'पड़ोसियों से अपने परिवार का परिचय कराना',
      whyItMattersHindi:
        'जब आप सही सहायक क्रिया बोलते हैं ("I am Shanti", "This is my son, he is an engineer", "We are new here"), तो आपकी बातचीत में गजब का आत्मविश्वास झलकता है।',
      dialogueSnippet: [
        {
          speaker: 'Neighbor',
          speakerHindi: 'पड़ोसी',
          text: 'Hello, are you the new family in flat 402?',
          hindi: 'नमस्ते, क्या आप फ्लैट 402 में नया परिवार हैं?',
          phoneticHindi: 'हेलो, आर यू द न्यू फैमिली इन फ्लैट फोर-ज़ीरो-टू?',
        },
        {
          speaker: 'You',
          speakerHindi: 'आप',
          text: 'Yes, I am Shanti and we are very glad to meet you.',
          hindi: 'हाँ, मैं शांति हूँ और हम आपसे मिलकर बहुत खुश हैं।',
          phoneticHindi: 'यस, आई एम शांति एंड वी आर वेरी ग्लैड टू मीट यू।',
        },
      ],
      practicalTipHindi: 'हमेशा याद रखें: I am | He is | She is | We are | They are | You are!',
    },
  },

  {
    id: 'rule-6',
    number: 6,
    stageNumber: 2,
    stageName: 'Verbs & Helping Friends',
    stageNameHindi: 'क्रिया और मददगार दोस्त',
    titleEnglish: 'Possessions (has / have / had): "मेरे पास है"',
    titleHindi: 'कब्ज़ा और अधिकार (has/have/had): "मेरे पास है" का सही रहस्य',
    referenceBook: 'Rapidex & Wren & Martin',
    explanationHindi:
      'Rapidex की सबसे बड़ी चेतावनी: कई भारतीय "I am having two sons" या "I am having a car" बोल देते हैं, जो व्याकरण की दृष्टि से गलत है! अपने पास कोई चीज़ होने के लिए "have" या "has" का प्रयोग होता है। I / We / You / They के साथ "have", और He / She / It के साथ "has"।',
    childAnalogyHindi:
      'जब भी आपके पास कोई गुड़िया, किताब या चाबी हो — तो बोलिए: "I have a book", "She has a doll"। कभी "having" मत बोलिए जब तक आप खाना नहीं खा रहे हों!',
    visualFormula: 'I / You / We / They + have (वर्तमान) | He / She / It + has (वर्तमान) | सबके साथ had (भूतकाल)',
    visualFormulaHindi: 'मेरे पास है = I have | उसके पास है = He/She has | पास था = had',
    aartiDidiAudioSpeech:
      'छठा नियम: सावधान रहिए! कभी "I am having a car" मत कहिए। हमेशा कहिए "I have a car", और अगर उसके पास है तो "She has a pen"!',
    wrongExample: 'I am having a headache and he have a fever.',
    correctExample: 'I have a headache and he has a fever.',
    whyWrongHindi: 'पास होने या बीमारी के लिए "I have" बोलते हैं, और He के साथ "has" आता है।',
    practiceQuestions: [
      {
        id: 'q6-1',
        questionPrompt: 'Choose correct: "She ___ two beautiful daughters."',
        questionHindi: 'She के साथ क्या आएगा?',
        type: 'mcq',
        targetEnglish: 'has',
        options: ['has', 'have', 'is having'],
        correctAnswer: 'has',
        hintHindi: 'She एकवचन है: He/She/It के साथ "has" लगता है।',
        explanationHindi: 'बिल्कुल सही! She has two beautiful daughters.',
      },
      {
        id: 'q6-2',
        questionPrompt: 'Translate by speaking: "मेरे पास एक ज़रूरी काम है।"',
        questionHindi: 'माइक दबाकर बोलिए: "I have an important work."',
        type: 'speech_translation',
        targetEnglish: 'I have an important work',
        options: ['I have an important work', 'I am having important work', 'I has important work'],
        correctAnswer: 'I have an important work',
        hintHindi: 'बोलिए: I have an important work',
        explanationHindi: '"मेरे पास है" के लिए "I have"। बहुत सुंदर!',
      },
    ],
    conversationalBenefit: {
      situationTitle: 'At the Bank or Government Office',
      situationTitleHindi: 'बैंक या सरकारी दफ्तर में दस्तावेज़ बताना',
      whyItMattersHindi:
        'बैंक में जब आप कहते हैं: "Sir, I have my Aadhaar card and PAN card with me", तो अधिकारी तुरंत आपकी बात समझकर काम तेजी से करता है।',
      dialogueSnippet: [
        {
          speaker: 'Bank Officer',
          speakerHindi: 'बैंक अधिकारी',
          text: 'Do you have your passbook and identity proof?',
          hindi: 'क्या आपके पास आपकी पासबुक और पहचान पत्र है?',
          phoneticHindi: 'डू यू हैव योर पासबुक एंड आइडेंटिटी प्रूफ?',
        },
        {
          speaker: 'You',
          speakerHindi: 'आप',
          text: 'Yes sir, I have all the original documents right here.',
          hindi: 'हाँ सर, मेरे पास यहीं सारे मूल दस्तावेज़ हैं।',
          phoneticHindi: 'यस सर, आई हैव ऑल द ओरिजिनल डॉक्यूमेंट्स राइट हियर।',
        },
      ],
      practicalTipHindi: 'खाना खाने के लिए "I am having lunch" ठीक है, लेकिन चीज़ पास होने के लिए सिर्फ "I have" बोलें!',
    },
  },

  {
    id: 'rule-7',
    number: 7,
    stageNumber: 2,
    stageName: 'Verbs & Helping Friends',
    stageNameHindi: 'क्रिया और मददगार दोस्त',
    titleEnglish: 'Action Verbs & The Three Magic Forms (V1, V2, V3)',
    titleHindi: 'मुख्य क्रियाएँ: क्रिया के 3 जादुई रूप (V1, V2, V3)',
    referenceBook: 'Rapidex',
    explanationHindi:
      'Rapidex का क्रिया रूप चार्ट: हर काम के 3 रूप होते हैं। V1 (Present/मूल रूप): Go (जाना), V2 (Past/कल हुआ): Went (गया), V3 (Past Participle/काम खत्म): Gone (जा चुका), और V-ing (लगातार काम): Going (जा रहा)।',
    childAnalogyHindi:
      'जैसे पानी के तीन रूप होते हैं — बर्फ, पानी, और भाप — वैसे ही क्रिया भी समय के साथ अपना रूप बदलती है: Eat (खाता हूँ) → Ate (खाया) → Eaten (खा चुका)।',
    visualFormula: 'V1 (मूल): Eat / Drink / Go | V2 (कल हुआ): Ate / Drank / Went | V3 (खत्म): Eaten / Drunk / Gone',
    visualFormulaHindi: 'V1 = आज | V2 = बीता हुआ कल | V3 = पूरा हो चुका काम',
    aartiDidiAudioSpeech:
      'सातवाँ नियम: अंग्रेजी में काम का रूप समय तय करता है। आज के लिए Go, बीते हुए कल के लिए Went, और काम पूरा होने पर Gone!',
    wrongExample: 'Yesterday I go to the temple.',
    correctExample: 'Yesterday I went to the temple.',
    whyWrongHindi: 'Yesterday (बीते हुए कल) के लिए हमेशा V2 (Went) का प्रयोग होता है, Go का नहीं।',
    practiceQuestions: [
      {
        id: 'q7-1',
        questionPrompt: 'What is the past form (V2) of "Drink"?',
        questionHindi: '"Drink" (पीना) का बीता हुआ कल रूप (V2) क्या है?',
        type: 'mcq',
        targetEnglish: 'drank',
        options: ['drinked', 'drank', 'drunk'],
        correctAnswer: 'drank',
        hintHindi: 'Drink -> Drank -> Drunk',
        explanationHindi: 'Drink का V2 रूप Drank होता है!',
      },
      {
        id: 'q7-2',
        questionPrompt: 'Translate by speaking: "उसने मुझे एक पत्र लिखा।"',
        questionHindi: 'माइक दबाकर बोलिए: "She wrote me a letter."',
        type: 'speech_translation',
        targetEnglish: 'She wrote me a letter',
        options: ['She wrote me a letter', 'She writed me a letter', 'She write me a letter'],
        correctAnswer: 'She wrote me a letter',
        hintHindi: 'Write का V2 रूप Wrote है: She wrote me a letter',
        explanationHindi: 'Write का V2 "Wrote" होता है। अति उत्तम!',
      },
    ],
    conversationalBenefit: {
      situationTitle: 'Reporting Daily Activities / Storytelling',
      situationTitleHindi: 'दिनभर की बात या किस्सा सुनाना',
      whyItMattersHindi:
        'जब आप बच्चों या परिवार को बताते हैं: "Yesterday we visited our cousins, ate delicious sweets, and saw a movie", तो V2 का सही उपयोग आपकी बात को स्पष्ट और प्रामाणिक बनाता है।',
      dialogueSnippet: [
        {
          speaker: 'Grandchild',
          speakerHindi: 'पोता/पोती',
          text: 'Dadi, did you bring sweet mangoes from the village?',
          hindi: 'दादी, क्या आप गाँव से मीठे आम लाईं?',
          phoneticHindi: 'दादी, डिड यू ब्रिंग स्वीट मैंगोज़ फ्रॉम द विलेज?',
        },
        {
          speaker: 'You',
          speakerHindi: 'आप',
          text: 'Yes dear, I bought fresh mangoes and kept them in the kitchen.',
          hindi: 'हाँ बेटा, मैंने ताज़े आम खरीदे और रसोई में रखे हैं।',
          phoneticHindi: 'यस डियर, आई बॉट फ्रेश मैंगोज़ एंड केप्ट देम इन द किचन।',
        },
      ],
      practicalTipHindi: '10 आम क्रियाओं के V1, V2, V3 याद कर लें: Go-Went-Gone, Eat-Ate-Eaten, See-Saw-Seen!',
    },
  },

  // STAGE 3: The #1 Golden Rule of English
  {
    id: 'rule-8',
    number: 8,
    stageNumber: 3,
    stageName: 'The #1 Golden Rule of English',
    stageNameHindi: 'अंग्रेजी का सबसे बड़ा नियम',
    titleEnglish: 'Subject-Verb Agreement: The "s / es" Magic Secret',
    titleHindi: 'एकवचन कर्ता के साथ क्रिया में "s/es" का जादुई नियम (Wren & Martin #1 Rule)',
    referenceBook: 'Wren & Martin & Rapidex',
    explanationHindi:
      'Wren & Martin का सबसे महत्वपूर्ण नियम: जब कर्ता अकेला (Singular: He, She, It, Ramesh) हो और बात वर्तमान (Simple Present) की हो, तो मुख्य क्रिया में "s" या "es" जुड़ता है! लेकिन जब कर्ता बहुवचन (They, We) हो या I / You हो, तो क्रिया बिना किसी बदलाव के सीधी (V1) रहती है।',
    childAnalogyHindi:
      'अकेला इंसान अकेले डरता है, इसलिए उसे सुरक्षा के लिए एक छोटा "s" दोस्त चाहिए (He runs, She sleeps)। लेकिन जब बहुत सारे लोग हों (They run, We sleep), तो वे बिना "s" के ही खुश रहते हैं!',
    visualFormula: 'He / She / It / Name (अकेला) + Verb + s/es | I / You / We / They (अनेक/I) + Verb (सादा)',
    visualFormulaHindi: 'एकवचन = Verb में s/es | बहुवचन / I / You = सादी Verb',
    aartiDidiAudioSpeech:
      'आठवाँ नियम अंग्रेजी की सबसे बड़ी कुंजी है! कभी "He go to office" मत बोलिए। बोलिए "He goes to office"। अकेला कर्ता हमेशा क्रिया में s या es लेता है!',
    wrongExample: 'He walk every morning and my son play cricket.',
    correctExample: 'He walks every morning and my son plays cricket.',
    whyWrongHindi: '"He" और "my son" दोनों अकेले (Singular) हैं, इसलिए क्रिया में "s" लगकर walks और plays होगा।',
    practiceQuestions: [
      {
        id: 'q8-1',
        questionPrompt: 'Choose correct: "My husband ___ delicious tea."',
        questionHindi: 'पति (अकेला कर्ता) के लिए कौन सा शब्द सही है?',
        type: 'mcq',
        targetEnglish: 'makes',
        options: ['make', 'makes', 'making'],
        correctAnswer: 'makes',
        hintHindi: 'कर्ता एकवचन है: क्रिया में "s" जुड़ेगा।',
        explanationHindi: 'शाबाश! एकवचन कर्ता के साथ "makes" बिल्कुल सही है!',
      },
      {
        id: 'q8-2',
        questionPrompt: 'Translate by speaking: "वह बहुत मीठा गाती है।"',
        questionHindi: 'माइक दबाकर बोलिए: "She sings very sweetly."',
        type: 'speech_translation',
        targetEnglish: 'She sings very sweetly',
        options: ['She sings very sweetly', 'She sing very sweetly', 'She singing very sweetly'],
        correctAnswer: 'She sings very sweetly',
        hintHindi: 'She के साथ sing में s लगेगा: She sings very sweetly',
        explanationHindi: 'अकेली लड़की (She) के साथ sing में s लगकर sings बनता है। कमाल!',
      },
    ],
    conversationalBenefit: {
      situationTitle: 'Parent-Teacher Meeting (PTM) at School',
      situationTitleHindi: 'स्कूल में शिक्षक से बात करना (पीटीएम)',
      whyItMattersHindi:
        'अक्सर माता-पिता गलती से बोल देते हैं: "My child study hard"। जब आप इसके बजाय सही नियम से बोलते हैं: "My child studies hard every day", तो शिक्षक आपके अंग्रेजी स्तर से बहुत प्रभावित होते हैं।',
      dialogueSnippet: [
        {
          speaker: 'Class Teacher',
          speakerHindi: 'कक्षा अध्यापिका',
          text: 'Does Rohan revise his lessons at home?',
          hindi: 'क्या रोहन घर पर पाठ दोहराता है?',
          phoneticHindi: 'डज़ रोहन रिवाइज़ हिज़ लेसन्स एट होम?',
        },
        {
          speaker: 'You',
          speakerHindi: 'आप',
          text: 'Yes ma’am, he revises every evening and he reads English newspapers.',
          hindi: 'हाँ मैम, वह हर शाम दोहराता है और अंग्रेजी अखबार पढ़ता है।',
          phoneticHindi: 'यस मैम, ही रिवाइज़ेस एव्री इवनिंग एंड ही रीड्स इंग्लिश न्यूज़पेपर्स।',
        },
      ],
      practicalTipHindi: 'हमेशा याद रखें: He drinks, She reads, Sun shines — लेकिन I drink, We read, Birds fly!',
    },
  },

  // STAGE 4: The 12 Tenses Master Cycle
  {
    id: 'rule-9',
    number: 9,
    stageNumber: 4,
    stageName: 'The 12 Tenses Master Cycle',
    stageNameHindi: 'काल का संपूर्ण चक्र',
    titleEnglish: 'Simple Present Tense: Habits & Daily Truths (ता है, ती है, ते हैं)',
    titleHindi: 'साधारण वर्तमान काल: रोज़ की आदतें और सच (ता है, ती है, ते हैं)',
    referenceBook: 'Rapidex',
    explanationHindi:
      'Rapidex का पहचान सूत्र: जिस हिंदी वाक्य के अंत में "ता है", "ती है", "ते हैं", या "ता हूँ" आए, वह Simple Present Tense होता है। इसका उपयोग रोज़ की आदतों, दिनचर्या और शाश्वत सत्य (सूरज पूर्व से उगता है) के लिए होता है।',
    childAnalogyHindi:
      'जो काम आप रोज़ नियम से करते हैं — जैसे ब्रश करना, चाय पीना, स्कूल जाना — उसे Simple Present में बोलते हैं: "I wake up at 6 AM", "I drink milk"।',
    visualFormula: 'Subject + V1 (या V1+s/es) + Object',
    visualFormulaHindi: 'कर्ता + क्रिया का पहला रूप (s/es सहित) + कर्म',
    aartiDidiAudioSpeech:
      'नवाँ नियम: अपनी रोज़ की आदतें बताने के लिए Simple Present Tense का इस्तेमाल कीजिए। I take tea, We go for a walk!',
    wrongExample: 'I am taking bath daily at 7 AM.',
    correctExample: 'I take a bath daily at 7 AM.',
    whyWrongHindi: 'रोज़ की आदत के लिए "am taking" नहीं, बल्कि साधारण वर्तमान "I take" का प्रयोग होता है।',
    practiceQuestions: [
      {
        id: 'q9-1',
        questionPrompt: 'Choose correct: "The sun ___ in the east."',
        questionHindi: 'सूरज पूर्व में उगता है (शाश्वत सत्य):',
        type: 'mcq',
        targetEnglish: 'rises',
        options: ['rise', 'rises', 'is rising'],
        correctAnswer: 'rises',
        hintHindi: 'सूरज अकेला है और यह रोज़ का सच है: V1 + s/es आएगा।',
        explanationHindi: 'The sun rises in the east बिल्कुल सही है!',
      },
      {
        id: 'q9-2',
        questionPrompt: 'Translate by speaking: "मैं हर सुबह योग करता हूँ।"',
        questionHindi: 'माइक दबाकर बोलिए: "I do yoga every morning."',
        type: 'speech_translation',
        targetEnglish: 'I do yoga every morning',
        options: ['I do yoga every morning', 'I am doing yoga every morning', 'I does yoga every morning'],
        correctAnswer: 'I do yoga every morning',
        hintHindi: 'बोलिए: I do yoga every morning',
        explanationHindi: '"ता हूँ" के लिए Simple Present: I do yoga every morning.',
      },
    ],
    conversationalBenefit: {
      situationTitle: 'Doctor Consultation on Health Routine',
      situationTitleHindi: 'डॉक्टर को अपनी दिनचर्या और आदतें बताना',
      whyItMattersHindi:
        'डॉक्टर जब आपकी दिनचर्या पूछते हैं, तो Simple Present में स्पष्ट जवाब देना: "I sleep at 10 PM and I walk 3 kilometers daily" सटीक इलाज में मदद करता है।',
      dialogueSnippet: [
        {
          speaker: 'Doctor',
          speakerHindi: 'डॉक्टर',
          text: 'Do you take your blood pressure medicine regularly?',
          hindi: 'क्या आप अपनी बीपी की दवाई नियमित रूप से लेते हैं?',
          phoneticHindi: 'डू यू टेक योर ब्लड प्रेशर मेडिसिन रेगुलरली?',
        },
        {
          speaker: 'You',
          speakerHindi: 'आप',
          text: 'Yes doctor, I take it every morning right after breakfast.',
          hindi: 'हाँ डॉक्टर साहब, मैं इसे हर सुबह नाश्ते के तुरंत बाद लेता हूँ।',
          phoneticHindi: 'यस डॉक्टर, आई टेक इट एव्री मॉर्निंग राइट आफ्टर ब्रेकफास्ट।',
        },
      ],
      practicalTipHindi: 'आदतों और दिनचर्या के लिए कभी is/am/are + ing मत लगाइए, सीधा V1 बोलिए!',
    },
  },

  {
    id: 'rule-10',
    number: 10,
    stageNumber: 4,
    stageName: 'The 12 Tenses Master Cycle',
    stageNameHindi: 'काल का संपूर्ण चक्र',
    titleEnglish: 'Present Continuous Tense: Happening Right Now (रहा है, रही है, रहे हैं)',
    titleHindi: 'अपूर्ण वर्तमान काल: जो काम इस वक्त आँखों के सामने चल रहा है',
    referenceBook: 'Rapidex',
    explanationHindi:
      'Rapidex का सूत्र: जब कोई काम बोलते वक्त जारी हो (रहा है, रही है, रहे हैं), तो Subject के साथ is / am / are + क्रिया में "-ing" (V-ing) जोड़ते हैं।',
    childAnalogyHindi:
      'अभी इस पल आप क्या कर रहे हैं? "I am learning English"। आरती दीदी क्या कर रही हैं? "Aarti Didi is teaching"। पंखा क्या कर रहा है? "The fan is moving"!',
    visualFormula: 'Subject + is / am / are + Verb-ing + Object',
    visualFormulaHindi: 'कर्ता + is/am/are + क्रिया में -ing + कर्म',
    aartiDidiAudioSpeech:
      'दसवाँ नियम: जब काम अभी चल रहा हो, तो ing लगाना मत भूलिए! I am speaking, You are listening, She is cooking!',
    wrongExample: 'Please do not disturb, I read.',
    correctExample: 'Please do not disturb, I am reading.',
    whyWrongHindi: 'क्योंकि आप अभी इस वक्त पढ़ रहे हैं, इसलिए "am reading" आएगा।',
    practiceQuestions: [
      {
        id: 'q10-1',
        questionPrompt: 'Fill in the blank: "Listen! The birds ___ sweetly."',
        questionHindi: 'पक्षी (बहुवचन) अभी गा रहे हैं:',
        type: 'mcq',
        targetEnglish: 'are singing',
        options: ['sing', 'are singing', 'is singing'],
        correctAnswer: 'are singing',
        hintHindi: 'पक्षी बहुत सारे हैं और काम अभी चल रहा है: are + ing',
        explanationHindi: 'The birds are singing sweetly.',
      },
      {
        id: 'q10-2',
        questionPrompt: 'Translate by speaking: "माताजी रसोई में खाना बना रही हैं।"',
        questionHindi: 'माइक दबाकर बोलिए: "Mother is cooking food in the kitchen."',
        type: 'speech_translation',
        targetEnglish: 'Mother is cooking food in the kitchen',
        options: ['Mother is cooking food in the kitchen', 'Mother cooks food in kitchen', 'Mother are cooking food'],
        correctAnswer: 'Mother is cooking food in the kitchen',
        hintHindi: 'बोलिए: Mother is cooking food in the kitchen',
        explanationHindi: '"रही हैं" के लिए is cooking। अति उत्तम!',
      },
    ],
    conversationalBenefit: {
      situationTitle: 'On a Phone Call with Relatives',
      situationTitleHindi: 'रिश्तेदारों से फोन पर बातचीत',
      whyItMattersHindi:
        'जब कोई फोन पर पूछे "What are you doing right now?", तो धाराप्रवाह बोलना: "I am having tea with family" बातचीत को जीवंत बना देता है।',
      dialogueSnippet: [
        {
          speaker: 'Caller',
          speakerHindi: 'फोन करने वाला',
          text: 'Hello Bhabhi ji, are you busy right now?',
          hindi: 'नमस्ते भाभी जी, क्या आप अभी व्यस्त हैं?',
          phoneticHindi: 'हेलो भाभी जी, आर यू बिज़ी राइट नाउ?',
        },
        {
          speaker: 'You',
          speakerHindi: 'आप',
          text: 'Not at all, I am just watering the plants in the balcony.',
          hindi: 'बिल्कुल नहीं, मैं बस बालकनी में पौधों को पानी दे रही हूँ।',
          phoneticHindi: 'नॉट एट ऑल, आई एम जस्ट वाटरिंग द प्लांट्स इन द बालकनी।',
        },
      ],
      practicalTipHindi: 'चलते हुए काम के लिए हमेशा ing: Walking, Cooking, Talking, Driving!',
    },
  },

  {
    id: 'rule-11',
    number: 11,
    stageNumber: 4,
    stageName: 'The 12 Tenses Master Cycle',
    stageNameHindi: 'काल का संपूर्ण चक्र',
    titleEnglish: 'Present Perfect Tense: Just Finished (चुका है, लिया है, दिया है)',
    titleHindi: 'पूर्ण वर्तमान काल: काम अभी-अभी पूरा हुआ है (चुका है, लिया है)',
    referenceBook: 'Rapidex',
    explanationHindi:
      'Rapidex का सूत्र: जब कोई काम हाल ही में खत्म हुआ हो और उसका असर अभी बाकी हो (खा लिया है, पहुँच चुका है), तो Subject + has/have + V3 (क्रिया का तीसरा रूप) लगाते हैं।',
    childAnalogyHindi:
      'जब आपने अपना नाश्ता पूरा खत्म कर लिया हो, तो आप कहेंगे: "I have eaten my breakfast" (मैंने नाश्ता कर लिया है)। काम पूरा हो गया!',
    visualFormula: 'Subject + has / have + V3 (तीसरा रूप) + Object',
    visualFormulaHindi: 'कर्ता + has/have + क्रिया का 3rd रूप + कर्म',
    aartiDidiAudioSpeech:
      'ग्यारहवाँ नियम: जब काम अभी-अभी पूरा हुआ हो, तो has या have के साथ V3 लगाइए। I have finished my work!',
    wrongExample: 'I have took the medicine.',
    correctExample: 'I have taken the medicine.',
    whyWrongHindi: 'has/have के बाद हमेशा V3 (Taken) आता है, V2 (Took) नहीं।',
    practiceQuestions: [
      {
        id: 'q11-1',
        questionPrompt: 'Choose correct: "The train ___ already arrived at platform 1."',
        questionHindi: 'ट्रेन (एकवचन) पहुँच चुकी है:',
        type: 'mcq',
        targetEnglish: 'has',
        options: ['has', 'have', 'is'],
        correctAnswer: 'has',
        hintHindi: 'ट्रेन एकवचन है: has + V3 (arrived)',
        explanationHindi: 'The train has already arrived.',
      },
      {
        id: 'q11-2',
        questionPrompt: 'Translate by speaking: "मैंने अपना गृहकार्य पूरा कर लिया है।"',
        questionHindi: 'माइक दबाकर बोलिए: "I have completed my homework."',
        type: 'speech_translation',
        targetEnglish: 'I have completed my homework',
        options: ['I have completed my homework', 'I have complete my homework', 'I did complete homework'],
        correctAnswer: 'I have completed my homework',
        hintHindi: 'बोलिए: I have completed my homework',
        explanationHindi: 'काम पूरा हो गया है: I have completed my homework.',
      },
    ],
    conversationalBenefit: {
      situationTitle: 'At the Airport or Railway Station',
      situationTitleHindi: 'हवाई अड्डे या रेलवे स्टेशन पर स्टेटस बताना',
      whyItMattersHindi:
        'जब आप कहते हैं: "We have checked in our bags" या "The flight has landed", तो यात्रा के दौरान आप बिल्कुल शांत और आत्मविश्वासी रहते हैं।',
      dialogueSnippet: [
        {
          speaker: 'Relative',
          speakerHindi: 'रिश्तेदार',
          text: 'Have you reached Delhi safely?',
          hindi: 'क्या आप सुरक्षित दिल्ली पहुँच चुके हैं?',
          phoneticHindi: 'हैव यू रीच्ड दिल्ली सेफली?',
        },
        {
          speaker: 'You',
          speakerHindi: 'आप',
          text: 'Yes, we have reached and collected our luggage.',
          hindi: 'हाँ, हम पहुँच चुके हैं और अपना सामान भी ले लिया है।',
          phoneticHindi: 'यस, वी हैव रीच्ड एंड कलेक्टेड आवर लगेज।',
        },
      ],
      practicalTipHindi: 'जब भी काम "हो गया है" बोलना हो: has/have + V3 याद रखें!',
    },
  },

  {
    id: 'rule-12',
    number: 12,
    stageNumber: 4,
    stageName: 'The 12 Tenses Master Cycle',
    stageNameHindi: 'काल का संपूर्ण चक्र',
    titleEnglish: 'Simple Past Tense: The ONLY Tense Using V2 (आ, ई, ए, गया, देखा)',
    titleHindi: 'साधारण भूतकाल: अंग्रेजी का इकलौता काल जिसमें V2 लगता है!',
    referenceBook: 'Rapidex & Wren & Martin',
    explanationHindi:
      'Wren & Martin का महत्वपूर्ण नियम: बीते हुए समय की सीधी घटना बताने के लिए Simple Past Tense का इस्तेमाल होता है (मैं कल गया, मैंने चाय पी, वह आई)। पूरी अंग्रेजी भाषा में V2 (क्रिया का दूसरा रूप) सिर्फ और सिर्फ इसी एक काल के सकारात्मक वाक्यों में लगता है!',
    childAnalogyHindi:
      'कल जो बीत गया, उसके लिए क्रिया का दूसरा रूप लगेगा: "I saw a monkey yesterday", "We went to Jaipur", "She cooked tasty kheer"!',
    visualFormula: 'Subject + V2 (क्रिया का दूसरा रूप) + Object + Past Time (yesterday, last year)',
    visualFormulaHindi: 'कर्ता + V2 + कर्म + बीता हुआ समय',
    aartiDidiAudioSpeech:
      'बारहवाँ नियम याद रखिए! कल की बात बताने के लिए V2 का उपयोग होता है। I went, I saw, I ate, I slept!',
    wrongExample: 'Yesterday I see an old friend in market.',
    correctExample: 'Yesterday I saw an old friend in the market.',
    whyWrongHindi: 'Yesterday (कल) के लिए See का V2 रूप Saw लगेगा।',
    practiceQuestions: [
      {
        id: 'q12-1',
        questionPrompt: 'Choose correct: "Last night, we ___ dinner at an Indian restaurant."',
        questionHindi: 'कल रात हमने डिनर किया:',
        type: 'mcq',
        targetEnglish: 'had',
        options: ['have', 'had', 'has'],
        correctAnswer: 'had',
        hintHindi: 'कल रात (Past) के लिए have का V2 रूप क्या है?',
        explanationHindi: 'Have का V2 "had" होता है: We had dinner.',
      },
      {
        id: 'q12-2',
        questionPrompt: 'Translate by speaking: "उसने कल मुझे फोन किया।"',
        questionHindi: 'माइक दबाकर बोलिए: "He called me yesterday."',
        type: 'speech_translation',
        targetEnglish: 'He called me yesterday',
        options: ['He called me yesterday', 'He call me yesterday', 'He is calling yesterday'],
        correctAnswer: 'He called me yesterday',
        hintHindi: 'Call का V2 रूप Called है: He called me yesterday',
        explanationHindi: 'V2 का सही प्रयोग: He called me yesterday. बहुत खूब!',
      },
    ],
    conversationalBenefit: {
      situationTitle: 'Talking to Grandchildren about Childhood Stories',
      situationTitleHindi: 'पोते-पोतियों को अपने बचपन के किस्से सुनाना',
      whyItMattersHindi:
        'जब आप बच्चों को अपनी पुरानी कहानियाँ सुनाते हैं: "When I was young, we lived in a village and walked two miles to school", तो बच्चे मंत्रमुग्ध होकर सुनते हैं।',
      dialogueSnippet: [
        {
          speaker: 'Grandchild',
          speakerHindi: 'पोता',
          text: 'Dadi, how did you spend Sundays in your childhood?',
          hindi: 'दादी, आप अपने बचपन में रविवार कैसे बिताती थीं?',
          phoneticHindi: 'दादी, हाउ डिड यू स्पेंड संडेज़ इन योर चाइल्डहुड?',
        },
        {
          speaker: 'You',
          speakerHindi: 'आप',
          text: 'We played outdoor games all day and listened to radio in the evening.',
          hindi: 'हम दिनभर बाहर खेल खेलते थे और शाम को रेडियो सुनते थे।',
          phoneticHindi: 'वी प्लेड आउटडोर गेम्स ऑल डे एंड लिसन्ड टू रेडियो इन द इवनिंग।',
        },
      ],
      practicalTipHindi: 'कल की बात के लिए: Went, Ate, Came, Bought, Saw का प्रयोग करें!',
    },
  },

  {
    id: 'rule-13',
    number: 13,
    stageNumber: 4,
    stageName: 'The 12 Tenses Master Cycle',
    stageNameHindi: 'काल का संपूर्ण चक्र',
    titleEnglish: 'The "Did" Trap in Past Tense: Did brings back V1!',
    titleHindi: 'भूतकाल में "Did" का जादुई नियम: Did आते ही Verb फिर से V1 बन जाती है!',
    referenceBook: 'Rapidex',
    explanationHindi:
      'Rapidex की सबसे प्रसिद्ध चेतावनी: भूतकाल के नकारात्मक (Negative) और प्रश्नवाचक (Interrogative) वाक्यों में जब "did" या "didn’t" आ जाता है, तो मुख्य क्रिया V2 से बदलकर वापस V1 (मूल रूप) बन जाती है! क्योंकि "did" पहले से ही भूतकाल का रूप है।',
    childAnalogyHindi:
      'जब घर में बड़े भैया (Did) आ गए, तो छोटे भाई को मेहनत करने की ज़रूरत नहीं! वह आराम से V1 बनकर बैठता है: ❌ "I didn’t went" → ✅ "I didn’t go"!',
    visualFormula: 'Did / Didn’t + V1 (हमेशा मूल रूप) — कभी V2 नहीं!',
    visualFormulaHindi: 'Did + V1 (सादी क्रिया)',
    aartiDidiAudioSpeech:
      'तेरहवाँ नियम सबसे बड़ी गलती से बचाता है! कभी "I did not went" मत कहिए। Did के साथ हमेशा V1 आता है: "I did not go"!',
    wrongExample: 'I did not went to the market yesterday.',
    correctExample: 'I did not go to the market yesterday.',
    whyWrongHindi: 'Did आ जाने के बाद Went नहीं, बल्कि V1 (Go) आएगा।',
    practiceQuestions: [
      {
        id: 'q13-1',
        questionPrompt: 'Choose correct: "Did you ___ the medicine on time?"',
        questionHindi: 'Did के साथ कौन सा रूप आएगा?',
        type: 'mcq',
        targetEnglish: 'take',
        options: ['take', 'took', 'taken'],
        correctAnswer: 'take',
        hintHindi: 'Did आ चुका है, इसलिए V1 रूप आएगा।',
        explanationHindi: 'Did you take the medicine बिल्कुल सही है!',
      },
      {
        id: 'q13-2',
        questionPrompt: 'Translate by speaking: "मैंने उसे नहीं देखा।"',
        questionHindi: 'माइक दबाकर बोलिए: "I did not see him."',
        type: 'speech_translation',
        targetEnglish: 'I did not see him',
        options: ['I did not see him', 'I did not saw him', 'I not saw him'],
        correctAnswer: 'I did not see him',
        hintHindi: 'बोलिए: I did not see him (did के साथ see)',
        explanationHindi: 'Didn’t see him — V1 का सही उपयोग!',
      },
    ],
    conversationalBenefit: {
      situationTitle: 'Clarifying Customer Service or Delivery Issues',
      situationTitleHindi: 'डिलीवरी या कस्टमर केयर पर समस्या स्पष्ट करना',
      whyItMattersHindi:
        'जब पार्सल समय पर न आए, तो कहना: "I didn’t receive the OTP" या "The delivery agent didn’t call me" आपको एक जागरूक और स्पष्ट वक्ता बनाता है।',
      dialogueSnippet: [
        {
          speaker: 'Customer Support',
          speakerHindi: 'सपोर्ट एग्जीक्यूटिव',
          text: 'Did you get the confirmation SMS, ma’am?',
          hindi: 'क्या आपको पुष्टि का एसएमएस मिला, मैम?',
          phoneticHindi: 'डिड यू गेट द कन्फर्मेशन एसएमएस, मैम?',
        },
        {
          speaker: 'You',
          speakerHindi: 'आप',
          text: 'No, I didn’t get any message, so please check my order.',
          hindi: 'नहीं, मुझे कोई संदेश नहीं मिला, इसलिए कृपया मेरा ऑर्डर चेक करें।',
          phoneticHindi: 'नो, आई डिडन्ट गेट एनी मैसेज, सो प्लीज चेक माय ऑर्डर।',
        },
      ],
      practicalTipHindi: 'मंत्र याद कर लीजिए: Did + V1, Did + V1, Did + V1!',
    },
  },

  {
    id: 'rule-14',
    number: 14,
    stageNumber: 4,
    stageName: 'The 12 Tenses Master Cycle',
    stageNameHindi: 'काल का संपूर्ण चक्र',
    titleEnglish: 'Past Continuous Tense: Was / Were + ing (रहा था, रही थी, रहे थे)',
    titleHindi: 'अपूर्ण भूतकाल: जो काम बीते समय में चल रहा था (रहा था, रही थी)',
    referenceBook: 'Rapidex',
    explanationHindi:
      'Rapidex का सूत्र: जब बीते हुए समय में कोई काम चल रहा था (कल शाम बारिश हो रही थी, हम टीवी देख रहे थे), तो Singular के साथ "was" और Plural / You के साथ "were" + क्रिया में "-ing" लगाते हैं।',
    childAnalogyHindi:
      'कल जब फोन बजा, तब आप क्या कर रहे थे? "I was sleeping" (मैं सो रहा था), "We were cooking" (हम खाना बना रहे थे)।',
    visualFormula: 'Singular (I/He/She/It) + was + V-ing | Plural (We/They/You) + were + V-ing',
    visualFormulaHindi: 'एकवचन + was + ing | बहुवचन + were + ing',
    aartiDidiAudioSpeech:
      'चौदहवाँ नियम: कल जो काम चल रहा था, उसके लिए was और were के साथ ing लगाइए। I was reading, We were talking!',
    wrongExample: 'Yesterday at 5 PM they was watching cricket.',
    correctExample: 'Yesterday at 5 PM they were watching cricket.',
    whyWrongHindi: 'They बहुवचन है, इसलिए was नहीं बल्कि "were" आएगा।',
    practiceQuestions: [
      {
        id: 'q14-1',
        questionPrompt: 'Choose correct: "When it started raining, I ___ tea on the terrace."',
        questionHindi: 'I के साथ भूतकाल में क्या आएगा?',
        type: 'mcq',
        targetEnglish: 'was drinking',
        options: ['was drinking', 'were drinking', 'am drinking'],
        correctAnswer: 'was drinking',
        hintHindi: 'I अकेला है और बात बीते हुए समय की है: was + ing',
        explanationHindi: 'I was drinking tea on the terrace.',
      },
      {
        id: 'q14-2',
        questionPrompt: 'Translate by speaking: "हम आपका इंतज़ार कर रहे थे।"',
        questionHindi: 'माइक दबाकर बोलिए: "We were waiting for you."',
        type: 'speech_translation',
        targetEnglish: 'We were waiting for you',
        options: ['We were waiting for you', 'We was waiting for you', 'We are waiting for you'],
        correctAnswer: 'We were waiting for you',
        hintHindi: 'बोलिए: We were waiting for you',
        explanationHindi: 'We के साथ were waiting। बहुत सुंदर!',
      },
    ],
    conversationalBenefit: {
      situationTitle: 'Explaining What Happened in an Incident or Meeting',
      situationTitleHindi: 'किसी घटना या बैठक का ब्योरा देना',
      whyItMattersHindi:
        'जब कोई पूछे कि जब बिजली गई तब क्या हो रहा था, तो कहना: "We were having dinner when the lights went out" सटीक और स्वाभाविक लगता है।',
      dialogueSnippet: [
        {
          speaker: 'Friend',
          speakerHindi: 'सहेली',
          text: 'Why didn’t you pick up my call at 4 PM?',
          hindi: 'आपने शाम 4 बजे मेरा फोन क्यों नहीं उठाया?',
          phoneticHindi: 'व्हाई डिडन्ट यू पिक अप माय कॉल एट फोर पीएम?',
        },
        {
          speaker: 'You',
          speakerHindi: 'आप',
          text: 'Sorry dear, I was resting because I had a mild headache.',
          hindi: 'माफ करना सखी, मैं आराम कर रही थी क्योंकि थोड़ा सिरदर्द था।',
          phoneticHindi: 'सॉरी डियर, आई वॉज़ रेस्टिंग बिकॉज़ आई हैड अ माइल्ड हेडेक।',
        },
      ],
      practicalTipHindi: 'I was, He was, She was — लेकिन We were, They were, You were!',
    },
  },

  {
    id: 'rule-15',
    number: 15,
    stageNumber: 4,
    stageName: 'The 12 Tenses Master Cycle',
    stageNameHindi: 'काल का संपूर्ण चक्र',
    titleEnglish: 'Simple Future Tense: Tomorrow’s Plans (गा, गी, गे - Will + V1)',
    titleHindi: 'साधारण भविष्य काल: आने वाले कल की योजनाएँ (गा, गी, गे)',
    referenceBook: 'Rapidex',
    explanationHindi:
      'Rapidex का सूत्र: आने वाले कल (Tomorrow, Next week) के किसी भी काम के लिए आधुनिक अंग्रेजी में सभी कर्ताओं (I, You, He, She, We, They) के साथ "will" + V1 (मूल रूप) लगाया जाता है।',
    childAnalogyHindi:
      'कल आप क्या करेंगे? "I will buy new shoes", "We will go to the temple", "Aarti Didi will teach a new lesson"!',
    visualFormula: 'Subject + will + V1 (सादी क्रिया) + Object + Tomorrow/Next week',
    visualFormulaHindi: 'कर्ता + will + क्रिया का 1st रूप + आने वाला समय',
    aartiDidiAudioSpeech:
      'पंद्रहवाँ नियम सबसे आसान है! भविष्य की हर बात के लिए will लगाइए और क्रिया का पहला रूप। I will call you tomorrow!',
    wrongExample: 'Tomorrow I will going to Delhi.',
    correctExample: 'Tomorrow I will go to Delhi.',
    whyWrongHindi: 'Will के साथ हमेशा सादी क्रिया V1 (go) आती है, ing वाला रूप नहीं।',
    practiceQuestions: [
      {
        id: 'q15-1',
        questionPrompt: 'Choose correct: "Do not worry, the doctor ___ you soon."',
        questionHindi: 'डॉक्टर जल्द ही आपको देखेंगे (भविष्य):',
        type: 'mcq',
        targetEnglish: 'will examine',
        options: ['will examine', 'will examining', 'examined'],
        correctAnswer: 'will examine',
        hintHindi: 'Will के साथ हमेशा क्रिया का पहला रूप (V1) आता है।',
        explanationHindi: 'The doctor will examine you soon.',
      },
      {
        id: 'q15-2',
        questionPrompt: 'Translate by speaking: "मैं कल आपको फोन करूँगा।"',
        questionHindi: 'माइक दबाकर बोलिए: "I will call you tomorrow."',
        type: 'speech_translation',
        targetEnglish: 'I will call you tomorrow',
        options: ['I will call you tomorrow', 'I will calling tomorrow', 'I called you tomorrow'],
        correctAnswer: 'I will call you tomorrow',
        hintHindi: 'बोलिए: I will call you tomorrow',
        explanationHindi: 'Will + V1: I will call you tomorrow. शाबाश!',
      },
    ],
    conversationalBenefit: {
      situationTitle: 'Making Commitments & Promises',
      situationTitleHindi: 'वादे और भविष्य की योजनाएँ बनाना',
      whyItMattersHindi:
        'दुकानदार या सेवा प्रदाता से बात करते समय: "I will pay the bill online tomorrow" या "We will visit your shop on Sunday" आपके वादे को स्पष्ट बनाता है।',
      dialogueSnippet: [
        {
          speaker: 'Electrician',
          speakerHindi: 'इलेक्ट्रीशियन',
          text: 'Madam, when should I come to fix the geyser?',
          hindi: 'मैडम, मैं गीज़र ठीक करने कब आऊँ?',
          phoneticHindi: 'मैडम, व्हेन शुड आई कम टू फिक्स द गीज़र?',
        },
        {
          speaker: 'You',
          speakerHindi: 'आप',
          text: 'Please come at 11 AM tomorrow, I will be at home.',
          hindi: 'कृपया कल सुबह 11 बजे आइए, मैं घर पर रहूँगी।',
          phoneticHindi: 'प्लीज कम एट इलेवन एएम टुमॉरो, आई विल बी एट होम।',
        },
      ],
      practicalTipHindi: 'भविष्य में हर किसी के साथ "will + V1" बेझिझक बोलें!',
    },
  },

  // STAGE 5: Modals of Polite Conversation
  {
    id: 'rule-16',
    number: 16,
    stageNumber: 5,
    stageName: 'Modals of Polite Conversation',
    stageNameHindi: 'विनम्र बातचीत और महाशक्तियाँ',
    titleEnglish: 'Can vs May: Ability vs Polite Permission',
    titleHindi: 'Can बनाम May: क्षमता (कर सकता हूँ) और आदरपूर्वक अनुमति (क्या मैं...?)',
    referenceBook: 'Wren & Martin',
    explanationHindi:
      'Wren & Martin का क्लासिक नियम: "Can" आपकी शारीरिक या मानसिक ताकत/क्षमता (Ability) दिखाता है (I can lift this box / I can speak English)। लेकिन जब किसी बड़े या अजनबी से आदर के साथ अनुमति माँगनी हो, तो हमेशा "May" का इस्तेमाल होता है (May I come in? / May I sit here?)।',
    childAnalogyHindi:
      'जब आपको अपनी सुपरपावर दिखानी हो तो बोलिए "I can do this!"। लेकिन जब स्कूल में शिक्षक से अंदर आने की आज्ञा माँगनी हो तो बोलिए "May I come in, teacher?"!',
    visualFormula: 'Can = शारीरिक/मानसिक क्षमता (Ability) | May = शिष्टाचार और अनुमति (Polite Permission)',
    visualFormulaHindi: 'Can = मैं कर सकता हूँ | May = क्या मुझे आपकी अनुमति है?',
    aartiDidiAudioSpeech:
      'सोलहवाँ नियम अच्छे संस्कार और शिष्टाचार का है! ऑफिस या क्लास में "Can I come in" नहीं, हमेशा "May I come in" बोलिए!',
    wrongExample: 'Can I come in, sir? (to an elder/boss)',
    correctExample: 'May I come in, sir?',
    whyWrongHindi: 'आदरणीय व्यक्ति से अनुमति माँगने के लिए "May" सबसे सभ्य और औपचारिक शब्द है।',
    practiceQuestions: [
      {
        id: 'q16-1',
        questionPrompt: 'Choose correct for polite permission: "___ I ask a question, doctor?"',
        questionHindi: 'डॉक्टर से विनम्रतापूर्वक प्रश्न पूछने के लिए क्या कहेंगे?',
        type: 'mcq',
        targetEnglish: 'May',
        options: ['May', 'Can', 'Will'],
        correctAnswer: 'May',
        hintHindi: 'आदर और अनुमति के लिए "May" का उपयोग होता है।',
        explanationHindi: 'May I ask a question, doctor? बहुत आदरपूर्ण वाक्य है!',
      },
      {
        id: 'q16-2',
        questionPrompt: 'Translate by speaking: "मैं अंग्रेजी बोल सकता हूँ।"',
        questionHindi: 'माइक दबाकर बोलिए: "I can speak English."',
        type: 'speech_translation',
        targetEnglish: 'I can speak English',
        options: ['I can speak English', 'I may speak English', 'I am speak English'],
        correctAnswer: 'I can speak English',
        hintHindi: 'क्षमता के लिए Can: I can speak English',
        explanationHindi: 'I can speak English — आत्मविश्वास से भरपूर!',
      },
    ],
    conversationalBenefit: {
      situationTitle: 'At the Bank Manager’s Cabin or Visa Office',
      situationTitleHindi: 'बैंक मैनेजर के केबिन या वीज़ा ऑफिस में प्रवेश',
      whyItMattersHindi:
        'जब आप दरवाज़े पर खड़े होकर मुस्कुराते हुए कहते हैं: "Good morning sir, may I come in and sit down?", तो अधिकारी तुरंत आपका स्वागत सम्मान के साथ करता है।',
      dialogueSnippet: [
        {
          speaker: 'You',
          speakerHindi: 'आप',
          text: 'Excuse me sir, may I speak with you for two minutes?',
          hindi: 'माफ कीजिए सर, क्या मैं आपसे दो मिनट बात कर सकती हूँ?',
          phoneticHindi: 'एक्सक्यूज़ मी सर, मे आई स्पीक विथ यू फॉर टू मिनट्स?',
        },
        {
          speaker: 'Manager',
          speakerHindi: 'प्रबंधक',
          text: 'Certainly ma’am, please have a seat. How can I help you?',
          hindi: 'अवश्य मैम, कृपया बैठिए। मैं आपकी क्या मदद कर सकता हूँ?',
          phoneticHindi: 'सर्टेनली मैम, प्लीज हैव अ सीट। हाउ कैन आई हेल्प यू?',
        },
      ],
      practicalTipHindi: 'अनुमति माँगते समय "May I...?" और अपनी ताकत बताते समय "I can...!" याद रखें।',
    },
  },

  {
    id: 'rule-17',
    number: 17,
    stageNumber: 5,
    stageName: 'Modals of Polite Conversation',
    stageNameHindi: 'विनम्र बातचीत और महाशक्तियाँ',
    titleEnglish: 'Should vs Must: Friendly Advice vs Compulsory Duty',
    titleHindi: 'Should बनाम Must: दोस्ताना सलाह और ज़रूरी कर्तव्य',
    referenceBook: 'Rapidex',
    explanationHindi:
      'Rapidex का नियम: जब आप किसी को अच्छी सलाह या मशविरा देते हैं (तुम्हें फल खाने चाहिए, आराम करना चाहिए), तो "Should" लगाते हैं। लेकिन जब कोई काम कानूनी रूप से या जीवन के लिए बेहद ज़रूरी हो (हेलमेट पहनना ज़रूरी है, दवा समय पर लेना ज़रूरी है), तो "Must" लगाते हैं।',
    childAnalogyHindi:
      'मम्मी कहती हैं: "You should read books" (अच्छी सलाह है)। लेकिन ट्रैफिक पुलिस कहती है: "You must stop at red light" (यह ज़रूरी नियम है, तोड़ नहीं सकते)!',
    visualFormula: 'Should = सलाह (Friendly Advice) | Must = अनिवार्य नियम / पक्का कर्तव्य (Compulsion)',
    visualFormulaHindi: 'Should = करना चाहिए | Must = ज़रूर करना ही होगा',
    aartiDidiAudioSpeech:
      'सत्रहवाँ नियम: जब किसी को सलाह दें तो कहिए You should drink water। जब कोई काम बेहद ज़रूरी हो तो कहिए We must wear seatbelts!',
    wrongExample: 'You should stop when traffic signal is red. (too weak for safety)',
    correctExample: 'You must stop when the traffic signal is red.',
    whyWrongHindi: 'ट्रैफिक सिग्नल पर रुकना केवल सलाह नहीं, अनिवार्य नियम है। इसलिए Must आएगा।',
    practiceQuestions: [
      {
        id: 'q17-1',
        questionPrompt: 'Choose correct: "You look exhausted, you ___ take rest."',
        questionHindi: 'दोस्ताना सलाह के लिए क्या चुनेंगे?',
        type: 'mcq',
        targetEnglish: 'should',
        options: ['should', 'must', 'can'],
        correctAnswer: 'should',
        hintHindi: 'यह एक प्यार भरी सलाह है: You should take rest.',
        explanationHindi: 'You should take rest बिल्कुल सही सलाह है।',
      },
      {
        id: 'q17-2',
        questionPrompt: 'Translate by speaking: "हमें समय पर दवाई लेनी चाहिए।"',
        questionHindi: 'माइक दबाकर बोलिए: "We must take medicine on time."',
        type: 'speech_translation',
        targetEnglish: 'We must take medicine on time',
        options: ['We must take medicine on time', 'We can take medicine on time', 'We would take medicine'],
        correctAnswer: 'We must take medicine on time',
        hintHindi: 'स्वास्थ्य के लिए अनिवार्य: We must take medicine on time',
        explanationHindi: 'Must का सही उपयोग। बहुत बढ़िया!',
      },
    ],
    conversationalBenefit: {
      situationTitle: 'Giving Caring Advice to Family Members',
      situationTitleHindi: 'परिवार के सदस्यों को प्यार भरी सलाह देना',
      whyItMattersHindi:
        'जब आप बच्चों या बुजुर्गों से कहते हैं: "You should drink plenty of water in this hot weather", तो यह आपकी ममता और परवाह को अंग्रेजी में खूबसूरती से बयां करता है।',
      dialogueSnippet: [
        {
          speaker: 'You',
          speakerHindi: 'आप',
          text: 'Beta, you should not watch phone in the dark, it strains your eyes.',
          hindi: 'बेटा, तुम्हें अंधेरे में फोन नहीं देखना चाहिए, इससे आँखों पर ज़ोर पड़ता है।',
          phoneticHindi: 'बेटा, यू शुड नॉट वॉच फोन इन द डार्क, इट स्ट्रेन्स योर आइज़।',
        },
        {
          speaker: 'Child',
          speakerHindi: 'बच्चा',
          text: 'Okay mummy, I will switch on the room light right away.',
          hindi: 'ठीक है मम्मी, मैं अभी कमरे की लाइट जलाता हूँ।',
          phoneticHindi: 'ओके मम्मी, आई विल स्विच ऑन द रूम लाइट राइट अवे।',
        },
      ],
      practicalTipHindi: 'सलाह के लिए Should, और कड़े नियम के लिए Must का प्रयोग करें!',
    },
  },

  {
    id: 'rule-18',
    number: 18,
    stageNumber: 5,
    stageName: 'Modals of Polite Conversation',
    stageNameHindi: 'विनम्र बातचीत और महाशक्तियाँ',
    titleEnglish: 'Could & Would: The Golden Keys to Ultra-Polite English',
    titleHindi: 'Could & Would: दिलों को जीतने वाले सबसे विनम्र जादुई शब्द',
    referenceBook: 'Wren & Martin',
    explanationHindi:
      'Wren & Martin का शिष्टाचार नियम: जब आप किसी से कोई काम करने का निवेदन करें, तो "Give me water" या "Help me" बोलना रूखा (Blunt) लगता है। इसके बजाय जब आप "Could you please help me?" या "Would you like some tea?" कहते हैं, तो सामने वाला खुशी-खुशी आपकी मदद करता है।',
    childAnalogyHindi:
      'जैसे हम हिंदी में "कृपया क्या आप मेरी मदद करेंगे?" बोलते हैं — अंग्रेजी में उसी मिठास को घोलने के लिए "Could you please..." और "Would you..." का इस्तेमाल होता है!',
    visualFormula: 'Could you please + V1 ...? | Would you like + Noun/to V1 ...?',
    visualFormulaHindi: 'Could you please = क्या आप कृपया... करेंगे? | Would you like = क्या आप... पसंद करेंगे?',
    aartiDidiAudioSpeech:
      'अठारहवाँ नियम दिल जीतने की चाबी है! कभी किसी को आदेश मत दीजिए। बोलिए: Could you please help me? और Would you like some tea?',
    wrongExample: 'Give me your phone right now.',
    correctExample: 'Could you please give me your phone for a minute?',
    whyWrongHindi: '"Give me" आदेश जैसा लगता है। "Could you please" शिष्ट और आदरपूर्ण निवेदन है।',
    practiceQuestions: [
      {
        id: 'q18-1',
        questionPrompt: 'Choose the most polite offer: "___ you like a cup of hot masala tea?"',
        questionHindi: 'अतिथि को चाय पेश करने का सबसे सभ्य तरीका क्या है?',
        type: 'mcq',
        targetEnglish: 'Would',
        options: ['Would', 'Do', 'Are'],
        correctAnswer: 'Would',
        hintHindi: 'अतिथि से विनम्रतापूर्वक पूछने के लिए "Would you like..." का प्रयोग होता है।',
        explanationHindi: 'Would you like a cup of hot tea? सबसे सुंदर वाक्य है!',
      },
      {
        id: 'q18-2',
        questionPrompt: 'Translate by speaking: "क्या आप कृपया दरवाजा बंद कर सकते हैं?"',
        questionHindi: 'माइक दबाकर बोलिए: "Could you please close the door?"',
        type: 'speech_translation',
        targetEnglish: 'Could you please close the door',
        options: ['Could you please close the door', 'Close the door please', 'You will close door'],
        correctAnswer: 'Could you please close the door',
        hintHindi: 'बोलिए: Could you please close the door?',
        explanationHindi: 'Could you please... — अत्यंत विनम्र और आदरपूर्ण!',
      },
    ],
    conversationalBenefit: {
      situationTitle: 'At a Restaurant, Airplane, or Hotel',
      situationTitleHindi: 'रेस्तरां, होटल या हवाई यात्रा में विनम्र अनुरोध',
      whyItMattersHindi:
        'जब आप वेटर या फ्लाइट अटेंडेंट से कहते हैं: "Could you please bring a glass of warm water?", तो वे तुरंत आपके शिष्टाचार का सम्मान करते हुए सर्वोत्तम सेवा देते हैं।',
      dialogueSnippet: [
        {
          speaker: 'You',
          speakerHindi: 'आप',
          text: 'Excuse me, could you please pass the salt and pepper?',
          hindi: 'माफ कीजिए, क्या आप कृपया नमक और काली मिर्च आगे बढ़ा देंगे?',
          phoneticHindi: 'एक्सक्यूज़ मी, कुड यू प्लीज पास द सॉल्ट एंड पेपर?',
        },
        {
          speaker: 'Diner',
          speakerHindi: 'साथी ग्राहक',
          text: 'Of course! Here you go, ma’am.',
          hindi: 'बिल्कुल! यह लीजिए, मैम।',
          phoneticHindi: 'ऑफ कोर्स! हियर यू गो, मैम।',
        },
      ],
      practicalTipHindi: 'किसी भी अनुरोध में "Could you please..." जोड़ दीजिए, काम तुरंत बन जाएगा!',
    },
  },

  // STAGE 6: Sentence Formations & Conversational Mastery
  {
    id: 'rule-19',
    number: 19,
    stageNumber: 6,
    stageName: 'Sentence Mastery & Daily Flow',
    stageNameHindi: 'वाक्य निर्माण और सवालों की कला',
    titleEnglish: 'The SVO Sentence Order: Why English is Different from Hindi',
    titleHindi: 'SVO का नियम: हिंदी और अंग्रेजी के वाक्यों का सबसे बड़ा फर्क',
    referenceBook: 'Rapidex',
    explanationHindi:
      'Rapidex का बुनियादी तुलनात्मक नियम: हिंदी में हम बोलते हैं "मैं (Subject) + सेब (Object) + खाता हूँ (Verb)" — यानी SOV क्रम। लेकिन अंग्रेजी में क्रम बदल जाता है: "Subject + Verb + Object" (SVO)! यानी क्रिया बीच में आ जाती है: "I (Subject) + eat (Verb) + apples (Object)"।',
    childAnalogyHindi:
      'सोचिए तीन डिब्बे हैं: डिब्बा 1 = कौन (Subject), डिब्बा 2 = क्या करता है (Verb), डिब्बा 3 = किस चीज़ के साथ (Object)। अंग्रेजी में हमेशा काम (Verb) बीच में रहता है!',
    visualFormula: 'Subject (कर्ता) + Verb (क्रिया) + Object (कर्म)',
    visualFormulaHindi: 'अंग्रेजी = Subject + Verb + Object | हिंदी = Subject + Object + Verb',
    aartiDidiAudioSpeech:
      'उन्नीसवाँ नियम हिंदी से अंग्रेजी अनुवाद की चाबी है! कभी "I tea drink" मत बोलिए। पहले I, फिर drink, फिर tea — I drink tea!',
    wrongExample: 'She Hindi speaks very well.',
    correctExample: 'She speaks Hindi very well.',
    whyWrongHindi: 'हिंदी में क्रिया अंत में आती है, लेकिन अंग्रेजी में क्रिया (speaks) कर्ता (She) के तुरंत बाद आती है।',
    practiceQuestions: [
      {
        id: 'q19-1',
        questionPrompt: 'Rearrange in SVO order: "apples / eats / Rohan"',
        questionHindi: 'सही SVO क्रम क्या होगा?',
        type: 'mcq',
        targetEnglish: 'Rohan eats apples',
        options: ['Rohan eats apples', 'Rohan apples eats', 'Eats apples Rohan'],
        correctAnswer: 'Rohan eats apples',
        hintHindi: 'Subject (Rohan) + Verb (eats) + Object (apples)',
        explanationHindi: 'Rohan eats apples बिल्कुल सही क्रम है!',
      },
      {
        id: 'q19-2',
        questionPrompt: 'Translate by speaking: "हम ताज़ा दूध पीते हैं।"',
        questionHindi: 'माइक दबाकर बोलिए: "We drink fresh milk."',
        type: 'speech_translation',
        targetEnglish: 'We drink fresh milk',
        options: ['We drink fresh milk', 'We fresh milk drink', 'We are drink milk'],
        correctAnswer: 'We drink fresh milk',
        hintHindi: 'We + drink + fresh milk: We drink fresh milk',
        explanationHindi: 'SVO क्रम में सही वाक्य: We drink fresh milk.',
      },
    ],
    conversationalBenefit: {
      situationTitle: 'Ordering Food at a Cafe or Restaurant',
      situationTitleHindi: 'कैफे या रेस्तरां में खाना ऑर्डर करना',
      whyItMattersHindi:
        'सीधा SVO वाक्य बोलना: "I want a cup of ginger tea" या "We need extra spoons" आपको तुरंत और स्पष्ट सेवा दिलवाता है बिना किसी गलतफहमी के।',
      dialogueSnippet: [
        {
          speaker: 'Waiter',
          speakerHindi: 'वेटर',
          text: 'Good afternoon, what would you like to order today?',
          hindi: 'शुभ दोपहर, आज आप क्या ऑर्डर करना पसंद करेंगे?',
          phoneticHindi: 'गुड आफ्टरनून, व्हॉट वुड यू लाइक टू ऑर्डर टुडे?',
        },
        {
          speaker: 'You',
          speakerHindi: 'आप',
          text: 'We want two plates of idli and one hot filter coffee.',
          hindi: 'हमें दो प्लेट इडली और एक गरम फिल्टर कॉफी चाहिए।',
          phoneticHindi: 'वी वॉन्ट टू प्लेट्स ऑफ इडली एंड वन हॉट फिल्टर कॉफी।',
        },
      ],
      practicalTipHindi: 'हमेशा याद रखें: पहले कर्ता, फिर क्रिया, फिर बाकी सब!',
    },
  },

  {
    id: 'rule-20',
    number: 20,
    stageNumber: 6,
    stageName: 'Sentence Mastery & Daily Flow',
    stageNameHindi: 'वाक्य निर्माण और सवालों की कला',
    titleEnglish: 'Negative Sentences: The Magic of "Do Not", "Does Not" & "Did Not"',
    titleHindi: 'नकारात्मक वाक्य: "नहीं" कहने की सही और खूबसूरत कला',
    referenceBook: 'Rapidex & Wren & Martin',
    explanationHindi:
      'Rapidex का नियम: साधारण वर्तमान में क्रिया के साथ सीधा "not" नहीं लगता (❌ "I not go" / ❌ "He not eats")। बल्कि Plural/I/You के साथ "do not (don’t)", और He/She/It के साथ "does not (doesn’t)" लगता है। और Does not आते ही क्रिया का s/es हट जाता है! भूतकाल में "did not (didn’t)" लगता है।',
    childAnalogyHindi:
      'जैसे ताले के साथ चाबी लगती है, वैसे ही "Not" अकेला नहीं आता — वह अपने साथ Do, Does या Did को लेकर आता है: "I do not eat sugar", "She does not drink cold water"!',
    visualFormula: 'I / You / We / They + do not + V1 | He / She / It + does not + V1 (s/es हट जाएगा!)',
    visualFormulaHindi: 'Don’t + V1 | Doesn’t + V1 (सादी क्रिया)',
    aartiDidiAudioSpeech:
      'बीसवाँ नियम: कभी "I not like" या "He not goes" मत कहिए। हमेशा कहिए: I don’t like, और He doesn’t like!',
    wrongExample: 'He does not likes spicy food.',
    correctExample: 'He does not like spicy food.',
    whyWrongHindi: 'जब "does" आ गया, तो likes में से "s" हटकर मूल रूप (like) हो जाता है।',
    practiceQuestions: [
      {
        id: 'q20-1',
        questionPrompt: 'Choose correct: "My sister ___ drink cold drinks."',
        questionHindi: 'बहन (एकवचन) के लिए नकारात्मक वाक्य क्या होगा?',
        type: 'mcq',
        targetEnglish: 'does not',
        options: ['does not', 'do not', 'is not'],
        correctAnswer: 'does not',
        hintHindi: 'एकवचन कर्ता के साथ "does not" आता है।',
        explanationHindi: 'My sister does not drink cold drinks बिल्कुल सही है!',
      },
      {
        id: 'q20-2',
        questionPrompt: 'Translate by speaking: "मैं चीनी नहीं खाता हूँ।"',
        questionHindi: 'माइक दबाकर बोलिए: "I do not eat sugar."',
        type: 'speech_translation',
        targetEnglish: 'I do not eat sugar',
        options: ['I do not eat sugar', 'I not eat sugar', 'I does not eat sugar'],
        correctAnswer: 'I do not eat sugar',
        hintHindi: 'बोलिए: I do not eat sugar (या I don’t eat sugar)',
        explanationHindi: 'I do not eat sugar — शानदार उच्चारण!',
      },
    ],
    conversationalBenefit: {
      situationTitle: 'Declining Dietary Items or Sales Calls Politely',
      situationTitleHindi: 'खान-पान में परहेज़ या सेल्स कॉल पर विनम्रता से मना करना',
      whyItMattersHindi:
        'शादियों में या डॉक्टर के पास जब आप कहते हैं: "I don’t eat spicy food because of acidity" या "We don’t need a loan, thank you", तो आपकी बात स्पष्ट और दृढ़ होती है।',
      dialogueSnippet: [
        {
          speaker: 'Host',
          speakerHindi: 'मेज़बान',
          text: 'Bhabhi ji, please have some more sweets!',
          hindi: 'भाभी जी, कृपया थोड़ी और मिठाई लीजिए!',
          phoneticHindi: 'भाभी जी, प्लीज हैव सम मोर स्वीट्स!',
        },
        {
          speaker: 'You',
          speakerHindi: 'आप',
          text: 'Thank you so much, but I do not eat sweets due to high blood sugar.',
          hindi: 'बहुत-बहुत धन्यवाद, लेकिन मैं शुगर के कारण मीठा नहीं खाती।',
          phoneticHindi: 'थैंक यू सो मच, बट आई डू नॉट ईट स्वीट्स ड्यू टू हाई ब्लड शुगर।',
        },
      ],
      practicalTipHindi: 'Don’t like, Don’t know, Doesn’t matter — इन तीनों को रोज़मर्रा में इस्तेमाल करें!',
    },
  },

  {
    id: 'rule-21',
    number: 21,
    stageNumber: 6,
    stageName: 'Sentence Mastery & Daily Flow',
    stageNameHindi: 'वाक्य निर्माण और सवालों की कला',
    titleEnglish: 'Asking Questions (Interrogatives): Swapping the Helping Verb to Front',
    titleHindi: 'सवाल पूछने की कला: सहायक क्रिया को आगे लाकर सवाल बनाना',
    referenceBook: 'Rapidex & Wren & Martin',
    explanationHindi:
      'Wren & Martin का प्रश्न निर्माण नियम: हाँ/ना वाले सवालों में सहायक क्रिया (Are, Is, Do, Did, Can) को कर्ता से पहले सबसे आगे रख दिया जाता है (You are happy → Are you happy?). और जब विस्तार से जानकारी चाहिए हो, तो WH-शब्द (What, Where, When, Why, How) को सबसे पहले लगाते हैं (Where is the hospital?).',
    childAnalogyHindi:
      'जादू की छड़ी घुमाइए! बस "Is" या "Do" को उछालकर सबसे आगे बिठा दीजिए — वाक्य अपने आप एक प्यारा सवाल बन जाएगा: "You are ready" बन गया "Are you ready?"!',
    visualFormula: 'Helping Verb (Is / Are / Do / Can) + Subject + Verb ...? OR WH-Word + Helping Verb + Subject ...?',
    visualFormulaHindi: 'सहायक क्रिया पहले = क्या आप...? | WH-शब्द पहले = कहाँ, कब, क्यों, कैसे...?',
    aartiDidiAudioSpeech:
      'इक्कीसवाँ नियम आपको सवाल पूछने का राजा बना देगा! Are you ready? Do you know English? Where is the doctor?',
    wrongExample: 'Where you are going? (common Indian trap)',
    correctExample: 'Where are you going?',
    whyWrongHindi: 'सवाल में सहायक क्रिया (are) हमेशा कर्ता (you) से पहले आती है।',
    practiceQuestions: [
      {
        id: 'q21-1',
        questionPrompt: 'Form a question: "you / live / do / where"',
        questionHindi: 'आप कहाँ रहते हैं? इसका सही सवाल क्या होगा?',
        type: 'mcq',
        targetEnglish: 'Where do you live?',
        options: ['Where do you live?', 'Where you do live?', 'Do where you live?'],
        correctAnswer: 'Where do you live?',
        hintHindi: 'WH-शब्द (Where) + Helping verb (do) + Subject (you) + Verb (live)?',
        explanationHindi: 'Where do you live? बिल्कुल सटीक सवाल है!',
      },
      {
        id: 'q21-2',
        questionPrompt: 'Translate by speaking: "क्या आप तैयार हैं?"',
        questionHindi: 'माइक दबाकर बोलिए: "Are you ready?"',
        type: 'speech_translation',
        targetEnglish: 'Are you ready',
        options: ['Are you ready', 'You are ready', 'Is you ready'],
        correctAnswer: 'Are you ready',
        hintHindi: 'बोलिए: Are you ready?',
        explanationHindi: 'Are you ready? — शानदार सवाल!',
      },
    ],
    conversationalBenefit: {
      situationTitle: 'Asking for Help or Inquiring at Metro / Railway Station',
      situationTitleHindi: 'मेट्रो या रेलवे स्टेशन पर पूछताछ करना',
      whyItMattersHindi:
        'अपरिचित शहर में जब आप आत्मविश्वास से पूछते हैं: "Excuse me, where is the ticket counter?" या "Does this train go to Connaught Place?", तो लोग तुरंत मुस्कुराकर सही रास्ता बताते हैं।',
      dialogueSnippet: [
        {
          speaker: 'You',
          speakerHindi: 'आप',
          text: 'Excuse me guard bhaiya, where is platform number 3?',
          hindi: 'माफ कीजिए गार्ड भैया, प्लेटफॉर्म नंबर 3 कहाँ है?',
          phoneticHindi: 'एक्सक्यूज़ मी गार्ड भैया, व्हेयर इज़ प्लेटफॉर्म नंबर थ्री?',
        },
        {
          speaker: 'Guard',
          speakerHindi: 'गार्ड',
          text: 'Go straight and take the stairs on your left, ma’am.',
          hindi: 'सीधे जाइए और अपनी बाईं ओर की सीढ़ियाँ ले लीजिए, मैम।',
          phoneticHindi: 'गो स्ट्रेट एंड टेक द स्टेयर्स ऑन योर लेफ्ट, मैम।',
        },
      ],
      practicalTipHindi: 'सवाल पूछने में कभी झिझकें नहीं: Do you know?, Where is...?, How much is...?',
    },
  },

  {
    id: 'rule-22',
    number: 22,
    stageNumber: 6,
    stageName: 'Sentence Mastery & Daily Flow',
    stageNameHindi: 'वाक्य निर्माण और सवालों की कला',
    titleEnglish: 'Prepositions: Exact Positions in Life (In, On, At, Under, Between)',
    titleHindi: 'संबंधबोधक (Prepositions): चीज़ कहाँ रखी है — In, On, At, Under का राज',
    referenceBook: 'Wren & Martin',
    explanationHindi:
      'Wren & Martin का स्थान निर्धारण नियम: किसी बंद जगह या कमरे के अंदर होने पर "In" (in the room, in the bag)। किसी सतह के ऊपर होने पर "On" (on the table, on the roof)। किसी निश्चित पते या बिंदु पर होने पर "At" (at home, at the bus stop, at 5 PM)। नीचे होने पर "Under" (under the bed)। दो चीज़ों के बीच में "Between" (between two trees)।',
    childAnalogyHindi:
      'चिड़िया पिंजरे के अंदर है तो "In the cage"। बिल्ली मेज के ऊपर बैठी है तो "On the table"। चप्पल पलंग के नीचे है तो "Under the bed"!',
    visualFormula: 'In = अंदर | On = ऊपर (सतह पर) | At = निश्चित स्थान या समय पर | Under = नीचे | Between = दो के बीच',
    visualFormulaHindi: 'स्थान और समय बताने वाले छोटे मददगार शब्द',
    aartiDidiAudioSpeech:
      'बाईसवाँ नियम सब कुछ सही जगह पर रखता है! चाबियाँ मेज पर हैं तो On the table। आप घर पर हैं तो At home। सामान थैले में है तो In the bag!',
    wrongExample: 'The keys are kept in the table.',
    correctExample: 'The keys are kept on the table.',
    whyWrongHindi: 'चाबियाँ मेज की सतह के ऊपर रखी होती हैं, इसलिए "On" आएगा। मेज के अंदर दराज हो तो "in the drawer" कहते।',
    practiceQuestions: [
      {
        id: 'q22-1',
        questionPrompt: 'Choose correct: "I am waiting for you ___ the bus stop."',
        questionHindi: 'बस स्टॉप (निश्चित स्थान) के लिए क्या आएगा?',
        type: 'mcq',
        targetEnglish: 'at',
        options: ['at', 'in', 'on'],
        correctAnswer: 'at',
        hintHindi: 'निश्चित बिंदु या पते के लिए "at" लगता है।',
        explanationHindi: 'At the bus stop बिल्कुल सही है!',
      },
      {
        id: 'q22-2',
        questionPrompt: 'Translate by speaking: "बिल्ली मेज के नीचे सो रही है।"',
        questionHindi: 'माइक दबाकर बोलिए: "The cat is sleeping under the table."',
        type: 'speech_translation',
        targetEnglish: 'The cat is sleeping under the table',
        options: ['The cat is sleeping under the table', 'The cat sleeps on table', 'The cat is in table'],
        correctAnswer: 'The cat is sleeping under the table',
        hintHindi: 'बोलिए: The cat is sleeping under the table',
        explanationHindi: 'Under (नीचे): The cat is sleeping under the table. शाबाश!',
      },
    ],
    conversationalBenefit: {
      situationTitle: 'Asking for Lost Items at Home or Hotel',
      situationTitleHindi: 'घर में या होटल में सामान ढूँढ़ना',
      whyItMattersHindi:
        'जब परिवार में कोई पूछे कि चश्मा या पर्स कहाँ है, तो कहना: "Your glasses are on the bedside table and your charger is in the drawer" परिवार में सबको सुकून देता है।',
      dialogueSnippet: [
        {
          speaker: 'Husband',
          speakerHindi: 'पति',
          text: 'Have you seen my car keys anywhere?',
          hindi: 'क्या तुमने कहीं मेरी गाड़ी की चाबियाँ देखी हैं?',
          phoneticHindi: 'हैव यू सीन माय कार कीज़ एनीव्हेयर?',
        },
        {
          speaker: 'You',
          speakerHindi: 'आप',
          text: 'Yes, they are on the dining table, right next to the fruit bowl.',
          hindi: 'हाँ, वे डाइनिंग टेबल पर हैं, फलों के कटोरे के ठीक बगल में।',
          phoneticHindi: 'यस, दे आर ऑन द डाइनिंग टेबल, राइट नेक्स्ट टू द फ्रूट बाउल।',
        },
      ],
      practicalTipHindi: 'On the table, In the bag, At the door, Under the chair — इन्हें दिनभर घर में बोलें!',
    },
  },
];
