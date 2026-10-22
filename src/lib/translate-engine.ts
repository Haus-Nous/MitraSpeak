export interface TranslationResult {
  hindiText: string;
  idealEnglish: string;
  phoneticHindi: string;
  alternatives?: string[];
  vocabulary: {
    word: string;
    hindiMeaning: string;
    phonetic?: string;
  }[];
  culturalTipHindi?: string;
}

export interface MistakeDetail {
  id: string;
  type: 'grammar' | 'preposition' | 'vocabulary' | 'tense' | 'omission';
  userPart: string;
  suggestedPart: string;
  explanationHindi: string;
}

export interface VerificationResult {
  score: number; // 0 - 100
  isAccurate: boolean;
  userAttempt: string;
  targetEnglish: string;
  mistakes: MistakeDetail[];
  encouragingMessageHindi: string;
  correctSentence: string;
}

// Built-in Knowledge Base for Common Indian Daily Situations
const TRANSLATION_PATTERNS: Array<{
  keywords: string[];
  idealEnglish: string;
  phoneticHindi: string;
  alternatives: string[];
  vocabulary: { word: string; hindiMeaning: string; phonetic?: string }[];
  culturalTipHindi: string;
}> = [
  {
    keywords: ['जल्दी उठना', 'बच्चों का स्कूल', 'सुबह जल्दी', 'wake up early', 'school'],
    idealEnglish: 'I need to wake up early tomorrow because the kids have school.',
    phoneticHindi: 'आई नीड टू वेक अप अर्ली टुमॉरो बिकॉज़ द किड्स हैव स्कूल।',
    alternatives: [
      'I have to get up early in the morning for the children’s school.',
      'I must wake up early tomorrow as my children have school.',
    ],
    vocabulary: [
      { word: 'Wake up early', hindiMeaning: 'जल्दी उठना / सोकर जागना', phonetic: 'वेक अप अर्ली' },
      { word: 'Tomorrow morning', hindiMeaning: 'कल सुबह', phonetic: 'टुमॉरो मॉर्निंग' },
      { word: 'Because', hindiMeaning: 'क्योंकि / इस कारण से', phonetic: 'बिकॉज़' },
    ],
    culturalTipHindi: "अंग्रेजी में 'wake up' सोकर जागने के लिए और 'get up' बिस्तर से उठने के लिए प्रयोग किया जाता है। दोनों बिल्कुल स्वाभाविक हैं।",
  },
  {
    keywords: ['धीरे बोल', 'धीरे बोलिए', 'धीमे बोलिए', 'speak slowly', 'slow'],
    idealEnglish: 'Could you please speak a little more slowly?',
    phoneticHindi: 'कुड यू प्लीज स्पीक अ लिटिल मोर स्लोली?',
    alternatives: [
      'Please speak a bit slowly, I am still learning.',
      'Can you say that again more slowly, please?',
    ],
    vocabulary: [
      { word: 'Could you please', hindiMeaning: 'क्या आप कृपया (अत्यंत विनम्र तरीका)', phonetic: 'कुड यू प्लीज' },
      { word: 'A little more', hindiMeaning: 'थोड़ा और', phonetic: 'अ लिटिल मोर' },
      { word: 'Slowly', hindiMeaning: 'धीमी गति से', phonetic: 'स्लोली' },
    ],
    culturalTipHindi: "'Can you' की तुलना में 'Could you please' बोलना अंग्रेजी में बहुत आदरपूर्ण और सभ्य माना जाता है।",
  },
  {
    keywords: ['सिर में दर्द', 'सिरदर्द', 'डॉक्टर', 'दो दिन', 'headache', 'pain'],
    idealEnglish: 'Doctor, I have had a bad headache for the past two days.',
    phoneticHindi: 'डॉक्टर, आई हैव हैड अ बैड हेडेक फॉर द पास्ट टू डेज़।',
    alternatives: [
      'I have been suffering from a severe headache since yesterday.',
      'I have a continuous pain in my head for two days.',
    ],
    vocabulary: [
      { word: 'Headache', hindiMeaning: 'सिरदर्द', phonetic: 'हेडेक' },
      { word: 'Severe / Bad', hindiMeaning: 'तेज / गंभीर', phonetic: 'सिवियर / बैड' },
      { word: 'Past two days', hindiMeaning: 'पिछले दो दिनों से', phonetic: 'पास्ट टू डेज़' },
    ],
    culturalTipHindi: "डॉक्टर को जब समय बताना हो तो 'for two days' या 'since yesterday' का उपयोग करें।",
  },
  {
    keywords: ['टमाटर', 'दाम', 'भाव', 'ताज़ा', 'tamatar', 'price', 'tomato'],
    idealEnglish: 'Bhaiya, how much are these fresh tomatoes per kilo?',
    phoneticHindi: 'भैया, हाउ मच आर दीज़ फ्रेश टोमैटोज़ पर किलो?',
    alternatives: [
      'What is the price of fresh tomatoes per kilogram?',
      'How much do the tomatoes cost today?',
    ],
    vocabulary: [
      { word: 'Per kilo', hindiMeaning: 'प्रति किलोग्राम', phonetic: 'पर किलो' },
      { word: 'Fresh tomatoes', hindiMeaning: 'ताज़े टमाटर', phonetic: 'फ्रेश टोमैटोज़' },
      { word: 'How much', hindiMeaning: 'कितने का है / क्या दाम है', phonetic: 'हाउ मच' },
    ],
    culturalTipHindi: "सब्जी मंडी या सुपरमार्केट में 'How much are these...?' पूछना सबसे आसान और सटीक है।",
  },
  {
    keywords: ['बधाई', 'नौकरी', 'शादी', 'मुबारक', 'congratulations', 'job', 'wedding'],
    idealEnglish: 'Heartiest congratulations to you on your wonderful achievement!',
    phoneticHindi: 'हार्तिएस्ट कांग्रैचुलेशन्स टू यू ऑन योर वंडरफुल अचीवमेंट!',
    alternatives: [
      'Congratulations on your new job, we are so proud of you!',
      'Warm wishes and heartiest congratulations to the entire family!',
    ],
    vocabulary: [
      { word: 'Heartiest congratulations', hindiMeaning: 'हार्दिक बधाई एवं शुभकामनाएँ', phonetic: 'हार्तिएस्ट कांग्रैचुलेशन्स' },
      { word: 'Proud of you', hindiMeaning: 'आप पर गर्व है', phonetic: 'प्राउड ऑफ यू' },
      { word: 'Achievement', hindiMeaning: 'सफलता / उपलब्धि', phonetic: 'अचीवमेंट' },
    ],
    culturalTipHindi: "व्हाट्सएप पर रिश्तेदारों को बधाई देते समय 'Heartiest congratulations' लिखना बहुत गरिमापूर्ण लगता है।",
  },
  {
    keywords: ['चाय', 'कॉफी', 'चीनी कम', 'कम चीनी', 'tea', 'coffee', 'less sugar'],
    idealEnglish: 'Could I please have a hot ginger tea with less sugar?',
    phoneticHindi: 'कुड आई प्लीज हैव अ हॉट जिंजर टी विद लेस शुगर?',
    alternatives: [
      'One masala chai with very little sugar, please.',
      'Please give me a cup of hot tea with minimal sugar.',
    ],
    vocabulary: [
      { word: 'Ginger tea', hindiMeaning: 'अदरक वाली चाय', phonetic: 'जिंजर टी' },
      { word: 'Less sugar', hindiMeaning: 'कम चीनी', phonetic: 'लेस शुगर' },
      { word: 'Could I please have', hindiMeaning: 'क्या मुझे मिल सकती है', phonetic: 'कुड आई प्लीज हैव' },
    ],
    culturalTipHindi: "कैफे में आर्डर देते समय 'I want tea' कहने के बजाय 'Could I please have a tea' बोलना ज्यादा शालीन है।",
  },
  {
    keywords: ['गेट', 'एयरपोर्ट', 'बोर्डिंग', 'फ्लाइट', 'airport', 'gate', 'boarding'],
    idealEnglish: 'Excuse me, could you please guide me to boarding gate number 12?',
    phoneticHindi: 'एक्सक्यूज़ मी, कुड यू प्लीज गाइड मी टू बोर्डिंग गेट नंबर ट्वेल्व?',
    alternatives: [
      'Where is boarding gate 12, please?',
      'Could you tell me how to reach gate number 12?',
    ],
    vocabulary: [
      { word: 'Excuse me', hindiMeaning: 'माफ कीजिएगा / सुनिए', phonetic: 'एक्सक्यूज़ मी' },
      { word: 'Boarding gate', hindiMeaning: 'विमान में चढ़ने का द्वार', phonetic: 'बोर्डिंग गेट' },
      { word: 'Guide me', hindiMeaning: 'मार्गदर्शन करें / रास्ता बताएँ', phonetic: 'गाइड मी' },
    ],
    culturalTipHindi: "एयरपोर्ट पर किसी कर्मचारी से बात शुरू करने से पहले हमेशा 'Excuse me' बोलें।",
  },
  {
    keywords: ['नाश्ता', 'भूख', 'खाना', 'school', 'hungry', 'food', 'snack'],
    idealEnglish: 'What delicious evening snacks have you prepared today?',
    phoneticHindi: 'व्हाट डेलिशस ईवनिंग स्नैक्स हैव यू प्रिपेयर्ड टुडे?',
    alternatives: [
      'Are you hungry? What would you like to eat right now?',
      'I have made your favorite hot snacks for evening tea.',
    ],
    vocabulary: [
      { word: 'Delicious', hindiMeaning: 'स्वादिष्ट / लजीज', phonetic: 'डेलिशस' },
      { word: 'Evening snacks', hindiMeaning: 'शाम का हल्का नाश्ता', phonetic: 'ईवनिंग स्नैक्स' },
      { word: 'Prepared', hindiMeaning: 'तैयार किया / बनाया', phonetic: 'प्रिपेयर्ड' },
    ],
    culturalTipHindi: "बच्चों से बात करते समय 'delicious' (स्वादिष्ट) शब्द का प्रयोग उनके उत्साह को बढ़ाता है।",
  },
];

// Helper to translate arbitrary sentences based on keywords or fallback dictionary
export function translateHindiToEnglish(hindiInput: string): TranslationResult {
  const norm = hindiInput.toLowerCase().trim();

  // 1. Search for matching curated Indian pattern
  for (const item of TRANSLATION_PATTERNS) {
    if (item.keywords.some((k) => norm.includes(k.toLowerCase()))) {
      return {
        hindiText: hindiInput,
        idealEnglish: item.idealEnglish,
        phoneticHindi: item.phoneticHindi,
        alternatives: item.alternatives,
        vocabulary: item.vocabulary,
        culturalTipHindi: item.culturalTipHindi,
      };
    }
  }

  // 2. Intelligent Dynamic Construction for other common phrases
  if (norm.includes('मदद') || norm.includes('help') || norm.includes('सहायता')) {
    return {
      hindiText: hindiInput,
      idealEnglish: 'Excuse me, could you please help me with this?',
      phoneticHindi: 'एक्सक्यूज़ मी, कुड यू प्लीज हेल्प मी विद दिस?',
      alternatives: [
        'Can someone please assist me here?',
        'I need some assistance, please.',
      ],
      vocabulary: [
        { word: 'Help / Assistance', hindiMeaning: 'मदद / सहायता', phonetic: 'हेल्प / असिस्टेंस' },
        { word: 'Excuse me', hindiMeaning: 'माफ कीजिए / सुनिए', phonetic: 'एक्सक्यूज़ मी' },
      ],
      culturalTipHindi: "मदद माँगते समय 'Excuse me, could you help me?' सबसे सुरक्षित और विनम्र वाक्य है।",
    };
  }

  if (norm.includes('पता') || norm.includes('कहाँ') || norm.includes('रास्ता') || norm.includes('where')) {
    return {
      hindiText: hindiInput,
      idealEnglish: 'Could you please tell me how to get to this address?',
      phoneticHindi: 'कुड यू प्लीज टेल मी हाउ टू गेट टू दिस एड्रेस?',
      alternatives: [
        'Where is this place located, please?',
        'Excuse me, which way should I go for this location?',
      ],
      vocabulary: [
        { word: 'Address', hindiMeaning: 'पता / स्थान', phonetic: 'एड्रेस' },
        { word: 'How to get to', hindiMeaning: 'यहाँ कैसे पहुँचें', phonetic: 'हाउ टू गेट टू' },
      ],
      culturalTipHindi: "रास्ता पूछते समय फोन में पता दिखाते हुए 'How to get to this address?' बोलें।",
    };
  }

  // Fallback natural conversational template
  return {
    hindiText: hindiInput,
    idealEnglish: 'Please tell me how I can express this thought naturally in English.',
    phoneticHindi: 'प्लीज टेल मी हाउ आई कैन एक्सप्रेस दिस थॉट नेचुरली इन इंग्लिश।',
    alternatives: [
      'Could you help me say this politely in English?',
      'How should I say this in simple everyday English?',
    ],
    vocabulary: [
      { word: 'Express', hindiMeaning: 'व्यक्त करना / कहना', phonetic: 'एक्सप्रेस' },
      { word: 'Naturally', hindiMeaning: 'सहज और स्वाभाविक रूप से', phonetic: 'नेचुरली' },
      { word: 'Thought', hindiMeaning: 'विचार / बात', phonetic: 'थॉट' },
    ],
    culturalTipHindi: "आरती दीदी का सुझाव: अपनी बात को छोटे और सीधे वाक्यों में बोलें, इससे गलतियों की संभावना कम हो जाती है।",
  };
}

/**
 * Detailed Mistake Checker & Comparator
 * Compares the user's spoken or typed English attempt with the target English translation,
 * diagnosing missing words, prepositions, tenses, and grammatical slips.
 */
export function analyzeEnglishMistakes({
  hindiText,
  targetEnglish,
  userAttempt,
}: {
  hindiText: string;
  targetEnglish: string;
  userAttempt: string;
}): VerificationResult {
  const normTarget = targetEnglish.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '').trim();
  const normUser = userAttempt.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '').trim();

  const targetWords = normTarget.split(/\s+/).filter(Boolean);
  const userWords = normUser.split(/\s+/).filter(Boolean);

  const mistakes: MistakeDetail[] = [];

  // 1. Check for specific common Indian ESL slips

  // Error: "want wake" or "need wake" (Missing infinitive 'to')
  if (normUser.includes('want wake') || normUser.includes('need wake') || normUser.includes('have wake')) {
    mistakes.push({
      id: 'm-infinitive-to',
      type: 'grammar',
      userPart: 'want/need wake',
      suggestedPart: 'need to wake up (या want to wake up)',
      explanationHindi: "अंग्रेजी में 'want' या 'need' के बाद हमेशा 'to' आता है। जैसे: 'I need TO wake up' (मुझे उठना है)।",
    });
  }

  // Error: "tomorrow morning school" vs "because the kids have school"
  if (normTarget.includes('school') && !normUser.includes('because') && !normUser.includes('as')) {
    mistakes.push({
      id: 'm-missing-because',
      type: 'omission',
      userPart: 'छुटा हुआ कारण (Missing connector)',
      suggestedPart: 'because the kids have school',
      explanationHindi: "जब आप कोई कारण बता रही हों (क्योंकि...), तो वाक्य में 'because' शब्द का प्रयोग जरूर करें।",
    });
  }

  // Error: "how much price" instead of "how much are" or "what is the price"
  if (normUser.includes('how much price')) {
    mistakes.push({
      id: 'm-how-much-price',
      type: 'grammar',
      userPart: 'how much price',
      suggestedPart: 'how much are / what is the price',
      explanationHindi: "'How much' और 'Price' दोनों का मतलब दाम ही होता है। इसलिए या तो बोलिए 'How much are these?' या 'What is the price?' — दोनों एक साथ न बोलें।",
    });
  }

  // Error: "give me please" vs "could you please give me"
  if (normUser.includes('give me') && !normUser.includes('could') && !normUser.includes('please')) {
    mistakes.push({
      id: 'm-politeness',
      type: 'preposition',
      userPart: 'give me',
      suggestedPart: 'could you please give me / please give me',
      explanationHindi: "दुकानदार या किसी भी व्यक्ति से कुछ माँगते समय 'give me' की जगह 'please give me' या 'could you give me' बोलना ज्यादा सम्मानजनक होता है।",
    });
  }

  // Error: "two day" instead of "two days" (Singular vs Plural)
  if (normUser.includes('two day') && !normUser.includes('two days')) {
    mistakes.push({
      id: 'm-plural-days',
      type: 'grammar',
      userPart: 'two day',
      suggestedPart: 'two days',
      explanationHindi: "एक से अधिक दिन होने पर 'day' में 's' जोड़कर 'two days' बोलना चाहिए।",
    });
  }

  // Error: Missing articles 'the' or 'a'
  if (targetWords.includes('the') && !userWords.includes('the')) {
    mistakes.push({
      id: 'm-missing-article-the',
      type: 'omission',
      userPart: "'the' का न होना",
      suggestedPart: "the (उदा. 'the kids' या 'the tomatoes')",
      explanationHindi: "निश्चित चीजों या लोगों के बारे में बात करते समय उनके आगे 'the' लगाना स्वाभाविक अंग्रेजी मानी जाती है।",
    });
  }

  // Error: Missing prepositions 'to', 'for', 'with', 'at'
  const keyPrepositions = ['to', 'for', 'with', 'at', 'in'];
  for (const prep of keyPrepositions) {
    if (targetWords.includes(prep) && !userWords.includes(prep)) {
      if (!mistakes.some((m) => m.suggestedPart.includes(prep))) {
        mistakes.push({
          id: `m-prep-${prep}`,
          type: 'preposition',
          userPart: `छूटा हुआ शब्द '${prep}'`,
          suggestedPart: prep,
          explanationHindi: `वाक्य को सही ढंग से जोड़ने के लिए '${prep}' शब्द का प्रयोग आवश्यक है।`,
        });
      }
    }
  }

  // 2. Compute similarity / fluency match score
  let matchCount = 0;
  for (const w of userWords) {
    if (targetWords.includes(w)) {
      matchCount++;
    }
  }

  const baseRatio = targetWords.length > 0 ? matchCount / targetWords.length : 0.5;
  let calculatedScore = Math.round(baseRatio * 85) + 15;

  // Subtract penalty for severe grammatical slips
  calculatedScore = Math.max(40, Math.min(100, calculatedScore - mistakes.length * 8));

  // If user attempt matches almost perfectly
  if (normUser === normTarget || (mistakes.length === 0 && calculatedScore >= 90)) {
    calculatedScore = 98;
    return {
      score: 98,
      isAccurate: true,
      userAttempt,
      targetEnglish,
      mistakes: [],
      encouragingMessageHindi: "अद्भुत! आपने बहुत ही सुंदर और स्वाभाविक अंग्रेजी बोली है। आरती दीदी को आप पर पूरा गर्व है!",
      correctSentence: targetEnglish,
    };
  }

  // Construct warm encouragement based on mistakes found
  let encouragement = '';
  if (mistakes.length === 0) {
    encouragement = "बहुत बढ़िया प्रयास! आपकी बात पूरी तरह समझ में आ रही है। बस हल्का सा दोहराकर आत्मविश्वास बढ़ाएँ।";
  } else if (mistakes.length <= 2) {
    encouragement = "शाबाश! आपका प्रयास बहुत अच्छा था। बस ऊपर दी गई 1-2 छोटी बातों पर ध्यान दें, आपकी अंग्रेजी और भी निखर जाएगी।";
  } else {
    encouragement = "घबराइए बिल्कुल नहीं! आपने बोलने की हिम्मत की, यही सबसे बड़ी बात है। आरती दीदी के साथ इन गलतियों को समझकर दोबारा बोलिए।";
  }

  return {
    score: calculatedScore,
    isAccurate: calculatedScore >= 70,
    userAttempt,
    targetEnglish,
    mistakes,
    encouragingMessageHindi: encouragement,
    correctSentence: targetEnglish,
  };
}

export interface OralChallenge {
  id: string;
  category: string;
  categoryHindi: string;
  icon: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  levelHindi: string;
  hindiPrompt: string; // The sentence in Hindi to convert
  didiSpeechHindi: string; // Aarti Didi's female voice oral question in Hindi
  idealEnglish: string; // The correct target English
  phoneticHindi: string; // Hindi phonetic pronunciation guide
  hints: Array<{ word: string; hindiMeaning: string; phonetic?: string }>;
  culturalTipHindi: string;
}

export const ORAL_CHALLENGES: OralChallenge[] = [
  {
    id: 'oc-sabzi-mandi',
    category: 'Market & Bargaining',
    categoryHindi: 'सब्जी मंडी और खरीदारी',
    icon: 'ShoppingBasket',
    level: 'beginner',
    levelHindi: 'शुरुआती स्तर',
    hindiPrompt: 'भैया, ताज़ा टमाटर क्या भाव दिया?',
    didiSpeechHindi: 'शाबाश! पहला सवाल ध्यान से सुनिए: भैया, ताज़ा टमाटर क्या भाव दिया? चलिए, अब इसे अंग्रेजी में बोलिए!',
    idealEnglish: 'Bhaiya, how much are these fresh tomatoes per kilo?',
    phoneticHindi: 'भैया, हाउ मच आर दीज़ फ्रेश टोमैटोज़ पर किलो?',
    hints: [
      { word: 'How much are', hindiMeaning: 'कितने का है / क्या दाम है', phonetic: 'हाउ मच आर' },
      { word: 'Fresh tomatoes', hindiMeaning: 'ताज़े टमाटर', phonetic: 'फ्रेश टोमैटोज़' },
    ],
    culturalTipHindi: "सब्जी वाले से दाम पूछते समय 'How much are these...?' सबसे सटीक तरीका है।",
  },
  {
    id: 'oc-family-grandkids',
    category: 'Family & Love',
    categoryHindi: 'परिवार और बच्चे',
    icon: 'Users',
    level: 'beginner',
    levelHindi: 'शुरुआती स्तर',
    hindiPrompt: 'हाथ धोकर आओ बेटा, तुम्हारे लिए गरमा-गरम नाश्ता बनाया है।',
    didiSpeechHindi: 'अरे वाह! यह प्यारा वाक्य सुनिए: हाथ धोकर आओ बेटा, तुम्हारे लिए गरमा-गरम नाश्ता बनाया है। बच्चों से अंग्रेजी में कैसे कहेंगे?',
    idealEnglish: 'Come wash your hands first, beta, I made delicious hot snacks for you.',
    phoneticHindi: 'कम वॉश योर हैंड्स फर्स्ट, बेटा, आई मेड डेलिशस हॉट स्नैक्स फॉर यू।',
    hints: [
      { word: 'Wash your hands', hindiMeaning: 'हाथ धोना', phonetic: 'वॉश योर हैंड्स' },
      { word: 'Delicious', hindiMeaning: 'स्वादिष्ट / लजीज', phonetic: 'डेलिशस' },
    ],
    culturalTipHindi: "भारतीय परिवारों में बच्चों को अंग्रेजी में भी प्यार से 'beta' कहकर बुलाना बहुत स्वाभाविक और आत्मीय लगता है।",
  },
  {
    id: 'oc-cafe-tea',
    category: 'Cafe & Drinks',
    categoryHindi: 'चाय और कैफे',
    icon: 'Coffee',
    level: 'beginner',
    levelHindi: 'शुरुआती स्तर',
    hindiPrompt: 'कृपया क्या मुझे कम चीनी वाली एक गरम अदरक की चाय मिल सकती है?',
    didiSpeechHindi: 'सुनिए जी: कृपया क्या मुझे कम चीनी वाली एक गरम अदरक की चाय मिल सकती है? चलिए, कैफे वाले से अंग्रेजी में माँगकर दिखाइए!',
    idealEnglish: 'Could I please have a hot ginger tea with less sugar?',
    phoneticHindi: 'कुड आई प्लीज हैव अ हॉट जिंजर टी विद लेस शुगर?',
    hints: [
      { word: 'Could I please have', hindiMeaning: 'क्या मुझे मिल सकती है (विनम्र)', phonetic: 'कुड आई प्लीज हैव' },
      { word: 'With less sugar', hindiMeaning: 'कम चीनी वाली', phonetic: 'विद लेस शुगर' },
    ],
    culturalTipHindi: "कैफे में 'I want' कहने के बजाय 'Could I please have...' कहना ज्यादा शिष्ट माना जाता है।",
  },
  {
    id: 'oc-doctor-clinic',
    category: 'Health & Clinic',
    categoryHindi: 'डॉक्टर और स्वास्थ्य',
    icon: 'HeartPulse',
    level: 'intermediate',
    levelHindi: 'मध्यम स्तर',
    hindiPrompt: 'डॉक्टर साहब, मेरे सिर में दो दिन से तेज दर्द हो रहा है।',
    didiSpeechHindi: 'अरे वाह! अब यह वाक्य देखिए: डॉक्टर साहब, मेरे सिर में दो दिन से तेज दर्द हो रहा है। डॉक्टर को अंग्रेजी में कैसे बताएंगे?',
    idealEnglish: 'Doctor, I have had a bad headache for the past two days.',
    phoneticHindi: 'डॉक्टर, आई हैव हैड अ बैड हेडेक फॉर द पास्ट टू डेज़।',
    hints: [
      { word: 'Severe headache', hindiMeaning: 'तेज सिरदर्द', phonetic: 'सिवियर हेडेक' },
      { word: 'Past two days', hindiMeaning: 'पिछले दो दिनों से', phonetic: 'पास्ट टू डेज़' },
    ],
    culturalTipHindi: "डॉक्टर को जब समय की अवधि बतानी हो तो 'for two days' का प्रयोग करें।",
  },
  {
    id: 'oc-polite-request',
    category: 'Polite Conversation',
    categoryHindi: 'विनम्र बातचीत',
    icon: 'Volume2',
    level: 'intermediate',
    levelHindi: 'मध्यम स्तर',
    hindiPrompt: 'कृपया क्या आप थोड़ा धीरे बोल सकते हैं?',
    didiSpeechHindi: 'बहुत अच्छे! अब यह सवाल सुनिए: कृपया क्या आप थोड़ा धीरे बोल सकते हैं? चलिए, इसे आदरपूर्वक अंग्रेजी में बोलिए!',
    idealEnglish: 'Could you please speak a little more slowly?',
    phoneticHindi: 'कुड यू प्लीज स्पीक अ लिटिल मोर स्लोली?',
    hints: [
      { word: 'Could you please', hindiMeaning: 'क्या आप कृपया', phonetic: 'कुड यू प्लीज' },
      { word: 'Slowly', hindiMeaning: 'धीमी गति से', phonetic: 'स्लोली' },
    ],
    culturalTipHindi: "जब कोई तेजी से अंग्रेजी बोल रहा हो, तो हिचकिचाएं नहीं, प्यार से 'Could you please speak slowly?' बोलें।",
  },
  {
    id: 'oc-whatsapp-congrats',
    category: 'WhatsApp Message',
    categoryHindi: 'व्हाट्सएप और बधाई',
    icon: 'Send',
    level: 'intermediate',
    levelHindi: 'मध्यम स्तर',
    hindiPrompt: 'आपकी नई नौकरी पर आपको और पूरे परिवार को हार्दिक बधाई।',
    didiSpeechHindi: 'सुनिए जी: आपकी नई नौकरी पर आपको और पूरे परिवार को हार्दिक बधाई। इसे अंग्रेजी में बोलकर दिखाइए!',
    idealEnglish: 'Heartiest congratulations to you on your wonderful new job!',
    phoneticHindi: 'हार्तिएस्ट कांग्रैचुलेशन्स टू यू ऑन योर वंडरफुल न्यू जॉब!',
    hints: [
      { word: 'Heartiest congratulations', hindiMeaning: 'हार्दिक बधाई', phonetic: 'हार्तिएस्ट कांग्रैचुलेशन्स' },
      { word: 'Wonderful', hindiMeaning: 'शानदार / सुखद', phonetic: 'वंडरफुल' },
    ],
    culturalTipHindi: "व्हाट्सएप पर शुभकामना देते समय 'Heartiest congratulations' लिखना बहुत गरिमापूर्ण लगता है।",
  },
  {
    id: 'oc-school-morning',
    category: 'Daily Routine',
    categoryHindi: 'सुबह का नियम और स्कूल',
    icon: 'Sun',
    level: 'advanced',
    levelHindi: 'उन्नत स्तर',
    hindiPrompt: 'मुझे कल सुबह जल्दी उठना है क्योंकि बच्चों का स्कूल है।',
    didiSpeechHindi: 'नमस्ते जी! अगला सवाल सुनिए: मुझे कल सुबह जल्दी उठना है क्योंकि बच्चों का स्कूल है। अब आप इसे अंग्रेजी में बोलकर दिखाइए!',
    idealEnglish: 'I need to wake up early tomorrow because the kids have school.',
    phoneticHindi: 'आई नीड टू वेक अप अर्ली टुमॉरो बिकॉज़ द किड्स हैव स्कूल।',
    hints: [
      { word: 'Wake up early', hindiMeaning: 'जल्दी उठना', phonetic: 'वेक अप अर्ली' },
      { word: 'Because', hindiMeaning: 'क्योंकि / इस कारण से', phonetic: 'बिकॉज़' },
    ],
    culturalTipHindi: "अंग्रेजी में कारण बताते समय 'because' का प्रयोग करना बिल्कुल स्वाभाविक है।",
  },
  {
    id: 'oc-airport-gate',
    category: 'Travel & Help',
    categoryHindi: 'एयरपोर्ट और रास्ता पूछना',
    icon: 'Compass',
    level: 'advanced',
    levelHindi: 'उन्नत स्तर',
    hindiPrompt: 'माफ कीजिएगा, बोर्डिंग गेट नंबर 12 किस तरफ है?',
    didiSpeechHindi: 'ध्यान से सुनिए: माफ कीजिएगा, बोर्डिंग गेट नंबर 12 किस तरफ है? अब आप इसे पूरे आत्मविश्वास से अंग्रेजी में बोलिए!',
    idealEnglish: 'Excuse me, could you please guide me to boarding gate number 12?',
    phoneticHindi: 'एक्सक्यूज़ मी, कुड यू प्लीज गाइड मी टू बोर्डिंग गेट नंबर ट्वेल्व?',
    hints: [
      { word: 'Excuse me', hindiMeaning: 'माफ कीजिएगा / सुनिए', phonetic: 'एक्सक्यूज़ मी' },
      { word: 'Boarding gate', hindiMeaning: 'विमान चढ़ने का द्वार', phonetic: 'बोर्डिंग गेट' },
    ],
    culturalTipHindi: "अजनबी या अधिकारी से बात शुरू करने से पहले 'Excuse me' बोलना जरूरी है।",
  },
];

export function getOralChallenges(): OralChallenge[] {
  return ORAL_CHALLENGES;
}

export function getOralChallengeById(id: string): OralChallenge | undefined {
  return ORAL_CHALLENGES.find((c) => c.id === id);
}

