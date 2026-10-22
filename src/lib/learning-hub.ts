export interface IdiomPhrase {
  id: string;
  phrase: string;
  phoneticHindi: string;
  meaningHindi: string;
  meaningEnglish: string;
  exampleEnglish: string;
  exampleHindi: string;
  category: 'Everyday' | 'Emotions' | 'Work & School' | 'Polite' | 'Health';
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface GrammarTopic {
  id: string;
  title: string;
  titleHindi: string;
  ruleSummaryHindi: string;
  simpleFormula: string;
  wrongExample: string;
  correctExample: string;
  explanationHindi: string;
  practicalTipHindi: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  quiz: {
    questionHindi: string;
    options: string[];
    correctIndex: number;
    explanationHindi: string;
  };
}

export interface ConversationTemplate {
  id: string;
  situation: string;
  situationHindi: string;
  icon: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  phrases: Array<{
    english: string;
    hindi: string;
    phoneticHindi: string;
    tipHindi?: string;
  }>;
}

export interface RepeatDrill {
  id: string;
  categoryHindi: string;
  targetEnglish: string;
  hindiMeaning: string;
  phoneticHindi: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  level: 'beginner' | 'intermediate' | 'advanced';
}

// 1. Curated Idioms & Phrases
export const IDIOMS_AND_PHRASES: IdiomPhrase[] = [
  {
    id: 'idm-piece-of-cake',
    phrase: 'A piece of cake',
    phoneticHindi: 'अ पीस ऑफ केक',
    meaningHindi: 'बहुत ही आसान काम / बच्चों का खेल',
    meaningEnglish: 'Something that is very easy to do',
    exampleEnglish: 'Don’t worry, speaking everyday English with Aarti Didi is a piece of cake!',
    exampleHindi: 'चिंता मत कीजिए, आरती दीदी के साथ रोज़मर्रा की अंग्रेजी बोलना बहुत ही आसान है!',
    category: 'Everyday',
    level: 'beginner',
  },
  {
    id: 'idm-under-the-weather',
    phrase: 'Under the weather',
    phoneticHindi: 'अंडर द वेदर',
    meaningHindi: 'तबीयत थोड़ी नासाज होना / सुस्ती महसूस होना',
    meaningEnglish: 'Feeling slightly ill or unwell',
    exampleEnglish: 'Doctor, I have been feeling a bit under the weather since yesterday.',
    exampleHindi: 'डॉक्टर साहब, कल से मेरी तबीयत थोड़ी नासाज लग रही है।',
    category: 'Health',
    level: 'intermediate',
  },
  {
    id: 'idm-break-the-ice',
    phrase: 'Break the ice',
    phoneticHindi: 'ब्रेक द आइस',
    meaningHindi: 'झिझक मिटाना / बातचीत की शुरुआत करना',
    meaningEnglish: 'To start a conversation in an awkward or unfamiliar situation',
    exampleEnglish: 'A warm smile and a polite "Namaste" helped me break the ice with my new neighbors.',
    exampleHindi: 'एक प्यारी मुस्कान और "नमस्ते" ने नए पड़ोसियों से बातचीत शुरू करने में मेरी मदद की।',
    category: 'Polite',
    level: 'intermediate',
  },
  {
    id: 'idm-better-late-than-never',
    phrase: 'Better late than never',
    phoneticHindi: 'बेटर लेट दैन नेवर',
    meaningHindi: 'देर आए दुरुस्त आए / न करने से देर से करना बेहतर',
    meaningEnglish: 'It is better to do something late than never do it at all',
    exampleEnglish: 'Starting to practice English at age 50 is truly better late than never.',
    exampleHindi: '50 की उम्र में अंग्रेजी सीखना शुरू करना बिल्कुल "देर आए दुरुस्त आए" जैसा है।',
    category: 'Everyday',
    level: 'beginner',
  },
  {
    id: 'idm-once-in-a-blue-moon',
    phrase: 'Once in a blue moon',
    phoneticHindi: 'वन्स इन अ ब्लू मून',
    meaningHindi: 'कभी-कभार / ईद का चाँद होना',
    meaningEnglish: 'Happens very rarely',
    exampleEnglish: 'My son is so busy at the office that he visits us once in a blue moon.',
    exampleHindi: 'मेरा बेटा ऑफिस में इतना व्यस्त रहता है कि वह घर कभी-कभार ही आ पाता है।',
    category: 'Everyday',
    level: 'advanced',
  },
  {
    id: 'idm-cost-arm-leg',
    phrase: 'Cost an arm and a leg',
    phoneticHindi: 'कॉस्ट एन आर्म एंड अ लेग',
    meaningHindi: 'बहुत अधिक महंगा होना',
    meaningEnglish: 'Extremely expensive',
    exampleEnglish: 'Imported apples at the supermarket cost an arm and a leg!',
    exampleHindi: 'सुपरमार्केट में विदेशी सेब बहुत ही ज्यादा महंगे मिलते हैं!',
    category: 'Everyday',
    level: 'advanced',
  },
  {
    id: 'idm-hit-nail-on-head',
    phrase: 'Hit the nail on the head',
    phoneticHindi: 'हिट द नेल ऑन द हेड',
    meaningHindi: 'बिल्कुल सटीक बात कहना / सही निष्कर्ष पर पहुँचना',
    meaningEnglish: 'To say something that is exactly right or accurate',
    exampleEnglish: 'Aarti Didi hit the nail on the head when she explained that mistake.',
    exampleHindi: 'आरती दीदी ने उस गलती को समझाते हुए बिल्कुल सटीक बात कही।',
    category: 'Work & School',
    level: 'intermediate',
  },
  {
    id: 'idm-call-it-a-day',
    phrase: 'Call it a day',
    phoneticHindi: 'कॉल इट अ डे',
    meaningHindi: 'आज का काम समाप्त करना / छुट्टी करना',
    meaningEnglish: 'To stop working on something for the rest of the day',
    exampleEnglish: 'We have practiced five English dialogues today, let us call it a day now.',
    exampleHindi: 'हमने आज पाँच अंग्रेजी संवाद सीख लिए हैं, चलिए आज का अभ्यास यहीं समाप्त करते हैं।',
    category: 'Everyday',
    level: 'beginner',
  },
  {
    id: 'idm-bite-the-bullet',
    phrase: 'Bite the bullet',
    phoneticHindi: 'बाइट द बुलेट',
    meaningHindi: 'डर छोड़कर मुश्किल काम का हिम्मत से सामना करना',
    meaningEnglish: 'To face a difficult or unpleasant situation with courage',
    exampleEnglish: 'I bit the bullet and spoke English directly to the school principal.',
    exampleHindi: 'मैंने अपनी झिझक छोड़ी और हिम्मत करके स्कूल प्रिंसिपल से सीधे अंग्रेजी में बात की।',
    category: 'Emotions',
    level: 'advanced',
  },
  {
    id: 'idm-blessing-in-disguise',
    phrase: 'A blessing in disguise',
    phoneticHindi: 'अ ब्लेसिंग इन डिस्गाइज़',
    meaningHindi: 'छुपा हुआ वरदान / पहले बुरा लगना पर बाद में फायदेमंद साबित होना',
    meaningEnglish: 'An apparent misfortune that eventually has good results',
    exampleEnglish: 'Missing that crowded bus was a blessing in disguise because it started raining heavily.',
    exampleHindi: 'उस भीड़ वाली बस का छूटना एक तरह से वरदान ही रहा क्योंकि कुछ देर में मूसलाधार बारिश शुरू हो गई।',
    category: 'Emotions',
    level: 'advanced',
  },
];

// 2. Practical Grammar Topics for Indian Adults
export const GRAMMAR_TOPICS: GrammarTopic[] = [
  {
    id: 'grm-is-am-are',
    title: 'Is / Am / Are Usage',
    titleHindi: 'Is, Am, Are का सही प्रयोग (वर्तमान समय)',
    ruleSummaryHindi: 'I के साथ Am, एकवचन (He/She/It/एक नाम) के साथ Is, और बहुवचन (You/We/They/एक से ज्यादा) के साथ Are आता है।',
    simpleFormula: 'I + am | He/She/It + is | You/We/They + are',
    wrongExample: 'My sons is studying in school.',
    correctExample: 'My sons are studying in school.',
    explanationHindi: 'क्योंकि "sons" एक से अधिक हैं (बहुवचन), इसलिए "is" की जगह "are" का प्रयोग होगा।',
    practicalTipHindi: 'भारतीय आदर नियम: हिंदी में हम पिता या सास-ससुर के लिए "हैं" बोलते हैं (जैसे: पिताजी आए हैं), लेकिन अंग्रेजी में यदि व्यक्ति एक है तो हमेशा "is" ही आएगा (Father is resting).',
    level: 'beginner',
    quiz: {
      questionHindi: 'खाली जगह भरें: "My daughter ___ going to college tomorrow."',
      options: ['is', 'are', 'am', 'were'],
      correctIndex: 0,
      explanationHindi: '"My daughter" एक अकेली व्यक्ति है (एकवचन), इसलिए "is" बिल्कुल सही है।',
    },
  },
  {
    id: 'grm-has-vs-have',
    title: 'Has vs Have',
    titleHindi: 'Has vs Have का सीधा नियम (पास होना या काम पूरा होना)',
    ruleSummaryHindi: 'He, She, It या किसी एक व्यक्ति के नाम के साथ Has आता है। I, You, We, They के साथ Have आता है।',
    simpleFormula: 'He / She / It + Has | I / You / We / They + Have',
    wrongExample: 'She have two children.',
    correctExample: 'She has two children.',
    explanationHindi: '"She" एकवचन है, इसलिए उसके साथ हमेशा "has" का प्रयोग होता है।',
    practicalTipHindi: 'याद रखने का सीधा मंत्र: जब भी "I" (मैं) या "You" (आप) बोलें, तो हमेशा "have" लगाएं (उदा. I have a question, You have a lovely home).',
    level: 'beginner',
    quiz: {
      questionHindi: 'खाली जगह भरें: "We ___ already ordered hot tea."',
      options: ['has', 'have', 'is', 'was'],
      correctIndex: 1,
      explanationHindi: '"We" (हम) बहुवचन है, इसलिए इसके साथ "have" आता है।',
    },
  },
  {
    id: 'grm-since-vs-for',
    title: 'Since vs For',
    titleHindi: 'Since vs For (समय की शुरुआत बनाम कुल अवधि)',
    ruleSummaryHindi: 'जब काम शुरू होने का निश्चित समय (सोमवार, सुबह, 2020, 2 बजे) बताएं तो Since आता है। जब कुल समय (2 घंटे, 3 दिन, 5 साल) बताएं तो For आता है।',
    simpleFormula: 'Since + शुरुआत का नाम (Since Monday) | For + कुल संख्या (For 3 days)',
    wrongExample: 'I have a headache since two days.',
    correctExample: 'I have had a headache for two days.',
    explanationHindi: '"Two days" दिनों की कुल संख्या है, इसलिए इसके साथ "for" आएगा (Since नहीं)।',
    practicalTipHindi: 'सरल पहचान: यदि आप कैलेंडर या घड़ी में उंगली रखकर वह समय दिखा सकें (जैसे Monday, 4 o\'clock, 2021) तो Since बोलें; यदि संख्या गिन रहे हों (2 days, 4 hours) तो For बोलें।',
    level: 'advanced',
    quiz: {
      questionHindi: 'खाली जगह भरें: "I have been waiting for the bus ___ 9 AM."',
      options: ['for', 'since', 'in', 'at'],
      correctIndex: 1,
      explanationHindi: '"9 AM" घड़ी का निश्चित समय है, इसलिए "since" सही उत्तर है।',
    },
  },
  {
    id: 'grm-polite-requests',
    title: 'Polite Requests (Could vs Want)',
    titleHindi: 'Could You Please (आदरपूर्वक बात करने का शिष्टाचार)',
    ruleSummaryHindi: 'दुकानदार, डॉक्टर या किसी भी अजनबी से बात करते समय "I want..." कहना कठोर लगता है। उसकी जगह "Could you please..." या "May I have..." कहना बहुत सभ्य माना जाता है।',
    simpleFormula: 'Could you please + काम (उदा. Could you please speak slowly?)',
    wrongExample: 'I want tea with less sugar.',
    correctExample: 'Could I please have tea with less sugar?',
    explanationHindi: '"Could I please have..." अंग्रेजी में विनम्रता और सुरुचिपूर्ण संस्कार दर्शाता है।',
    practicalTipHindi: 'कैफे, बैंक, एयरपोर्ट या रिश्तेदारी में कुछ भी माँगने से पहले "Could you please..." बोलना आपकी अंग्रेजी को तुरंत प्रभावी बना देता है।',
    level: 'intermediate',
    quiz: {
      questionHindi: 'दुकानदार से पानी माँगने का सबसे आदरपूर्ण तरीका क्या है?',
      options: [
        'Give me water.',
        'I want water right now.',
        'Could I please have a glass of water?',
        'Water give please.',
      ],
      correctIndex: 2,
      explanationHindi: '"Could I please have a glass of water?" सबसे शालीन और सम्मानजनक तरीका है।',
    },
  },
  {
    id: 'grm-prepositions-in-on-at',
    title: 'Prepositions: In, On, At',
    titleHindi: 'In, On, At (समय और जगह का सही संतुलन)',
    ruleSummaryHindi: 'समय के लिए: घड़ी के समय के साथ At (At 5 PM), दिन/तारीख के साथ On (On Monday), और महीने/साल के साथ In (In May, In 2026) आता है।',
    simpleFormula: 'At 4 o\'clock | On Sunday | In December | At the bus stop | In Delhi',
    wrongExample: 'The doctor will see you in Monday at 10 AM.',
    correctExample: 'The doctor will see you on Monday at 10 AM.',
    explanationHindi: 'सप्ताह के दिनों (Monday, Tuesday) के आगे हमेशा "on" लगता है, "in" नहीं।',
    practicalTipHindi: 'स्थान के लिए: यदि सतह के ऊपर हो तो "On" (On the table), किसी चारदीवारी या शहर के अंदर हो तो "In" (In the kitchen, In Delhi), और किसी खास बिंदु पर हो तो "At" (At the gate).',
    level: 'intermediate',
    quiz: {
      questionHindi: 'खाली जगह भरें: "Our flight departs ___ 6 o\'clock in the morning."',
      options: ['on', 'in', 'at', 'with'],
      correctIndex: 2,
      explanationHindi: 'घड़ी के सटीक समय के आगे हमेशा "at" आता है (At 6 o\'clock).',
    },
  },
  {
    id: 'grm-do-does-did',
    title: 'Do vs Does vs Did',
    titleHindi: 'Do vs Does vs Did (सवाल पूछना और मना करना)',
    ruleSummaryHindi: 'वर्तमान में: He/She/It के साथ Does आता है, I/You/We/They के साथ Do आता है। बीते हुए समय (Past) में सभी के साथ Did आता है।',
    simpleFormula: 'Do you...? | Does he...? | Did you...? (कल की बात)',
    wrongExample: 'He do not drink coffee.',
    correctExample: 'He does not drink coffee.',
    explanationHindi: '"He" एकवचन है, इसलिए उसके साथ "does not" का प्रयोग होगा।',
    practicalTipHindi: 'याद रखें: एक बार "did" या "does" आ जाए, तो उसके बाद मुख्य क्रिया हमेशा अपने पहले रूप (1st form) में रहती है (उदा. Did you go?, Did you went नहीं).',
    level: 'advanced',
    quiz: {
      questionHindi: 'खाली जगह भरें: "___ you finish cooking lunch yesterday?"',
      options: ['Do', 'Does', 'Did', 'Are'],
      correctIndex: 2,
      explanationHindi: 'क्योंकि सवाल कल (बीते हुए समय) के बारे में है, इसलिए "Did" सही है।',
    },
  },
];

// 3. Ready-to-Use Conversation Starters
export const CONVERSATION_TEMPLATES: ConversationTemplate[] = [
  {
    id: 'tmpl-school-ptm',
    situation: 'School & Teacher Meeting',
    situationHindi: 'बच्चों का स्कूल और पीटीएम (Parent-Teacher Meeting)',
    icon: 'GraduationCap',
    level: 'advanced',
    phrases: [
      {
        english: 'Good morning ma\'am, how is my daughter doing in class?',
        hindi: 'नमस्ते मैम, मेरी बेटी कक्षा में कैसा प्रदर्शन कर रही है?',
        phoneticHindi: 'गुड मॉर्निंग मैम, हाउ इज़ माय डॉटर डुइंग इन क्लास?',
        tipHindi: 'शिक्षक से मिलते ही शिष्टाचार से मुस्कुराकर पूछें।',
      },
      {
        english: 'She studies hard at home, but gets a little nervous in mathematics exams.',
        hindi: 'वह घर पर खूब पढ़ाई करती है, लेकिन गणित की परीक्षा में थोड़ी घबरा जाती है।',
        phoneticHindi: 'शी स्टडीज़ हार्ड एट होम, बट गेट्स अ लिटिल नर्वस इन मैथमेटिक्स एग्ज़ाम्स।',
      },
      {
        english: 'Please let us know how we can support her studies at home.',
        hindi: 'कृपया बताइए कि हम घर पर उसकी पढ़ाई में और क्या मदद कर सकते हैं।',
        phoneticHindi: 'प्लीज लेट अस नो हाउ वी कैन सपोर्ट हर स्टडीज़ एट होम।',
      },
    ],
  },
  {
    id: 'tmpl-doctor-clinic',
    situation: 'Doctor & Pharmacy',
    situationHindi: 'क्लीनिक और दवाई दुकान पर बातचीत',
    icon: 'HeartPulse',
    level: 'intermediate',
    phrases: [
      {
        english: 'Doctor, should this medicine be taken before meals or after meals?',
        hindi: 'डॉक्टर साहब, यह दवाई खाने से पहले लेनी है या खाने के बाद?',
        phoneticHindi: 'डॉक्टर, शुड दिस मेडिसिन बी टेकन बिफोर मील्स ऑर आफ्टर मील्स?',
      },
      {
        english: 'Are there any side effects like dizziness or drowsiness with these tablets?',
        hindi: 'क्या इन गोलियों से चक्कर आना या नींद आने जैसी कोई समस्या हो सकती है?',
        phoneticHindi: 'आर देयर एनी साइड इफेक्ट्स लाइक डिज़िनेस ऑर ड्राउज़िनेस विद दीज़ टैबलेट्स?',
      },
      {
        english: 'How many days should I continue taking this antibiotic course?',
        hindi: 'मुझे यह एंटीबायोटिक कितने दिनों तक जारी रखनी होगी?',
        phoneticHindi: 'हाउ मेनी डेज़ शुड आई कंटिन्यू टेकिंग दिस एंटीबायोटिक कोर्स?',
      },
    ],
  },
  {
    id: 'tmpl-shopping-market',
    situation: 'Shopping & Market',
    situationHindi: 'दुकान और बाज़ार में खरीदारी',
    icon: 'ShoppingBag',
    level: 'beginner',
    phrases: [
      {
        english: 'Could you please show me a slightly larger size in this color?',
        hindi: 'क्या आप इस रंग में थोड़ा बड़ा साइज़ दिखा सकते हैं?',
        phoneticHindi: 'कुड यू प्लीज शो मी अ स्लाइटली लार्जर साइज़ इन दिस कलर?',
      },
      {
        english: 'Is there any ongoing seasonal discount if I pay via UPI?',
        hindi: 'यदि मैं यूपीआई से भुगतान करूँ तो क्या कोई छूट मिलेगी?',
        phoneticHindi: 'इज़ देयर एनी ऑनगोइंग सीज़नल डिस्काउंट इफ आई पे वाया यूपीआई?',
      },
      {
        english: 'Could you please pack this carefully and give me a bill?',
        hindi: 'कृपया इसे ध्यान से पैक कर दीजिए और बिल भी दे दीजिए।',
        phoneticHindi: 'कुड यू प्लीज पैक दिस केयरफुली एंड गिव मी अ बिल?',
      },
    ],
  },
  {
    id: 'tmpl-phone-calls',
    situation: 'Phone Calls & Verification',
    situationHindi: 'फोन कॉल और ज़रूरी बातचीत',
    icon: 'PhoneCall',
    level: 'intermediate',
    phrases: [
      {
        english: 'Hello, am I speaking with the customer support representative?',
        hindi: 'नमस्ते, क्या मैं कस्टमर सपोर्ट प्रतिनिधि से बात कर रही हूँ?',
        phoneticHindi: 'हेलो, एम आई स्पीकिंग विद द कस्टमर सपोर्ट रिप्रेजेंटेटिव?',
      },
      {
        english: 'Could you please speak a little louder? Your voice is breaking slightly.',
        hindi: 'कृपया क्या आप थोड़ा तेज बोल सकते हैं? आपकी आवाज़ थोड़ी कट रही है।',
        phoneticHindi: 'कुड यू प्लीज स्पीक अ लिटिल लाउडर? योर वॉइस इज़ ब्रेकिंग स्लाइटली।',
      },
      {
        english: 'Thank you for your assistance. Have a wonderful day ahead!',
        hindi: 'आपकी सहायता के लिए बहुत-बहुत धन्यवाद। आपका दिन शुभ हो!',
        phoneticHindi: 'थैंक यू फॉर योर असिस्टेंस। हैव अ वंडरफुल डे अहेड!',
      },
    ],
  },
  {
    id: 'tmpl-guests-social',
    situation: 'Welcoming Guests at Home',
    situationHindi: 'घर आए मेहमानों का स्वागत व सत्कार',
    icon: 'Users',
    level: 'beginner',
    phrases: [
      {
        english: 'Welcome home! Please make yourself comfortable. Would you like some tea or water?',
        hindi: 'घर में स्वागत है! कृपया आराम से बैठिए। आप चाय लेंगे या ठंडा पानी?',
        phoneticHindi: 'वेलकम होम! प्लीज मेक योरसेल्फ कम्फर्टेबल। वुड यू लाइक सम टी ऑर वॉटर?',
      },
      {
        english: 'It is so lovely to meet you after such a long time!',
        hindi: 'इतने लंबे समय के बाद आपसे मिलकर बहुत खुशी हुई!',
        phoneticHindi: 'इट इज़ सो लवली टू मीट यू आफ्टर सच अ लॉन्ग टाइम!',
      },
      {
        english: 'Thank you so much for visiting us today. Please do visit us again soon.',
        hindi: 'आज हमारे घर आने के लिए आपका बहुत धन्यवाद। जल्दी ही दोबारा आइएगा।',
        phoneticHindi: 'थैंक यू सो मच फॉर विजिटिंग अस टुडे। प्लीज डू विजिट अस अगेन सून।',
      },
    ],
  },
];

// 4. Listen & Repeat Drills (Coach Speaks -> Learner Repeats)
export const REPEAT_DRILLS: RepeatDrill[] = [
  {
    id: 'rep-slowly',
    categoryHindi: 'विनम्र बातचीत',
    targetEnglish: 'Could you please speak a little more slowly?',
    hindiMeaning: 'कृपया क्या आप थोड़ा धीरे बोल सकते हैं?',
    phoneticHindi: 'कुड यू प्लीज स्पीक अ लिटिल मोर स्लोली?',
    difficulty: 'Easy',
    level: 'beginner',
  },
  {
    id: 'rep-tomatoes',
    categoryHindi: 'सब्जी मंडी',
    targetEnglish: 'Bhaiya, how much are these fresh tomatoes per kilo?',
    hindiMeaning: 'भैया, ताज़ा टमाटर क्या भाव दिया?',
    phoneticHindi: 'भैया, हाउ मच आर दीज़ फ्रेश टोमैटोज़ पर किलो?',
    difficulty: 'Easy',
    level: 'beginner',
  },
  {
    id: 'rep-tea',
    categoryHindi: 'कैफे और चाय',
    targetEnglish: 'Could I please have a hot ginger tea with less sugar?',
    hindiMeaning: 'कृपया क्या मुझे कम चीनी वाली एक गरम अदरक की चाय मिल सकती है?',
    phoneticHindi: 'कुड आई प्लीज हैव अ हॉट जिंजर टी विद लेस शुगर?',
    difficulty: 'Easy',
    level: 'beginner',
  },
  {
    id: 'rep-headache',
    categoryHindi: 'डॉक्टर और स्वास्थ्य',
    targetEnglish: 'Doctor, I have had a bad headache for the past two days.',
    hindiMeaning: 'डॉक्टर साहब, मेरे सिर में दो दिन से तेज दर्द हो रहा है।',
    phoneticHindi: 'डॉक्टर, आई हैव हैड अ बैड हेडेक फॉर द पास्ट टू डेज़।',
    difficulty: 'Medium',
    level: 'intermediate',
  },
  {
    id: 'rep-congrats',
    categoryHindi: 'व्हाट्सएप और बधाई',
    targetEnglish: 'Heartiest congratulations to you on your wonderful new job!',
    hindiMeaning: 'आपकी नई नौकरी पर आपको और पूरे परिवार को हार्दिक बधाई।',
    phoneticHindi: 'हार्तिएस्ट कांग्रैचुलेशन्स टू यू ऑन योर वंडरफुल न्यू जॉब!',
    difficulty: 'Medium',
    level: 'intermediate',
  },
  {
    id: 'rep-family',
    categoryHindi: 'परिवार और बच्चे',
    targetEnglish: 'Come wash your hands first, beta, I made delicious hot snacks for you.',
    hindiMeaning: 'हाथ धोकर आओ बेटा, तुम्हारे लिए गरमा-गरम नाश्ता बनाया है।',
    phoneticHindi: 'कम वॉश योर हैंड्स फर्स्ट, बेटा, आई मेड डेलिशस हॉट स्नैक्स फॉर यू।',
    difficulty: 'Medium',
    level: 'intermediate',
  },
  {
    id: 'rep-airport',
    categoryHindi: 'एयरपोर्ट और रास्ता',
    targetEnglish: 'Excuse me, could you please guide me to boarding gate number 12?',
    hindiMeaning: 'माफ कीजिएगा, बोर्डिंग गेट नंबर 12 किस तरफ है?',
    phoneticHindi: 'एक्सक्यूज़ मी, कुड यू प्लीज गाइड मी टू बोर्डिंग गेट नंबर ट्वेल्व?',
    difficulty: 'Medium',
    level: 'advanced',
  },
  {
    id: 'rep-school',
    categoryHindi: 'सुबह का नियम',
    targetEnglish: 'I need to wake up early tomorrow because the kids have school.',
    hindiMeaning: 'मुझे कल सुबह जल्दी उठना है क्योंकि बच्चों का स्कूल है।',
    phoneticHindi: 'आई नीड टू वेक अप अर्ली टुमॉरो बिकॉज़ द किड्स हैव स्कूल।',
    difficulty: 'Advanced',
    level: 'advanced',
  },
];

// Pronunciation and Repeat accuracy evaluator
export function evaluateRepeatAttempt(targetEnglish: string, userSpoken: string) {
  const cleanTarget = targetEnglish.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const cleanUser = userSpoken.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

  const targetWords = cleanTarget.split(/\s+/).filter(Boolean);
  const userWords = cleanUser.split(/\s+/).filter(Boolean);

  let matchCount = 0;
  const wordStatus = targetWords.map((word) => {
    const isMatched = userWords.includes(word);
    if (isMatched) matchCount++;
    return { word, matched: isMatched };
  });

  const accuracy = targetWords.length > 0 ? Math.round((matchCount / targetWords.length) * 100) : 0;

  let feedbackHindi = '';
  if (accuracy >= 90) {
    feedbackHindi = 'अद्भुत! आपने बिल्कुल सही और स्पष्ट उच्चारण के साथ दोहराया है। शाबाश!';
  } else if (accuracy >= 70) {
    feedbackHindi = 'बहुत बढ़िया! आपकी आवाज़ साफ है। जो 1-2 शब्द छूट गए हैं, उन्हें एक बार और दोहराएं।';
  } else {
    feedbackHindi = 'अच्छा प्रयास! आरती दीदी की आवाज़ दोबारा ध्यान से सुनें और एक बार फिर बोलें।';
  }

  return {
    accuracy,
    isSuccess: accuracy >= 70,
    wordStatus,
    feedbackHindi,
    matchedCount: matchCount,
    totalWords: targetWords.length,
  };
}
