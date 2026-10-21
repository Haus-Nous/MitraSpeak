export interface AartiResponse {
  reply: string;
  hindiTranslation: string;
  correction?: string;
  explanationHindi?: string;
  clarityScore: number;
  detectedHinglishWords?: string[];
}

const HINGLISH_DICTIONARY: Record<string, { en: string; hi: string }> = {
  tamatar: { en: 'tomatoes', hi: 'टमाटर' },
  bhaiya: { en: 'brother / vendor', hi: 'भैया' },
  kitna: { en: 'how much', hi: 'कितना' },
  daam: { en: 'price', hi: 'दाम / मूल्य' },
  bohot: { en: 'very / a lot', hi: 'बहुत' },
  jyada: { en: 'much / more', hi: 'ज्यादा' },
  dard: { en: 'ache / pain', hi: 'दर्द' },
  dawa: { en: 'medicine', hi: 'दवाई' },
  khana: { en: 'food / meal', hi: 'खाना' },
  subah: { en: 'morning', hi: 'सुबह' },
  shaam: { en: 'evening', hi: 'शाम' },
  kal: { en: 'yesterday / tomorrow', hi: 'कल' },
  theek: { en: 'fine / well', hi: 'ठीक' },
  accha: { en: 'good / nice', hi: 'अच्छा' },
  dhanyawad: { en: 'thank you', hi: 'धन्यवाद' },
  namaste: { en: 'greetings / hello', hi: 'नमस्ते' },
  paani: { en: 'water', hi: 'पानी' },
  chai: { en: 'tea', hi: 'चाय' },
  cheeni: { en: 'sugar', hi: 'चीनी' },
  kam: { en: 'less', hi: 'कम' },
  doodh: { en: 'milk', hi: 'दूध' },
  bacche: { en: 'children / kids', hi: 'बच्चे' },
  ghar: { en: 'home', hi: 'घर' },
  bhool: { en: 'forgot', hi: 'भूल' },
  samajh: { en: 'understand', hi: 'समझ' },
};

export function detectHinglish(text: string): string[] {
  const words = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '').split(/\s+/);
  const detected: string[] = [];
  for (const w of words) {
    if (HINGLISH_DICTIONARY[w] && !detected.includes(w)) {
      detected.push(w);
    }
  }
  return detected;
}

/**
 * Intelligent Aarti Didi dialogue generator with Hinglish comprehension and gentle Hindi coaching
 */
export function generateAartiCoaching({
  scenarioSlug,
  characterName,
  userText,
}: {
  scenarioSlug: string;
  characterName: string;
  userText: string;
}): AartiResponse {
  const norm = userText.toLowerCase().trim();
  const detectedHinglish = detectHinglish(userText);

  // Scenario 1: Sabzi Mandi (Buying Vegetables)
  if (scenarioSlug === 'sabzi-mandi') {
    if (norm.includes('tamatar') || norm.includes('tomato')) {
      return {
        reply: "The fresh tomatoes are forty rupees per kilo today, madam. They arrived fresh from the farm this morning. How many kilos should I weigh for you?",
        hindiTranslation: "आज ताज़े टमाटर चालीस रुपये किलो हैं, मैडम। सुबह ही खेत से एकदम ताज़े आए हैं। आपके लिए कितने किलो तौल दूँ?",
        correction: "Bhaiya, please give me one kilo of tomatoes. How much do they cost?",
        explanationHindi: "'Tamatar' को अंग्रेजी में 'Tomatoes' कहते हैं। जब दाम पूछना हो, तो 'How much do they cost?' या 'What is the price?' कहना सबसे सरल और स्वाभाविक है।",
        clarityScore: 88,
        detectedHinglishWords: detectedHinglish,
      };
    } else if (norm.includes('coriander') || norm.includes('dhaniya') || norm.includes('mirchi') || norm.includes('chili')) {
      return {
        reply: "Yes, absolutely! I will happily add some fresh green coriander and two green chilies into your bag for free. Anything else you need today?",
        hindiTranslation: "हाँ, बिल्कुल! मैं खुशी से आपके थैले में हरा धनिया और दो हरी मिर्चें मुफ्त डाल देता हूँ। आज आपको और कुछ चाहिए?",
        correction: "Could you please add some fresh coriander and green chilies as well?",
        explanationHindi: "मुफ्त धनिया-मिर्ची माँगते समय 'Could you please add...' कहना बहुत विनम्र और सम्मानजनक लगता है।",
        clarityScore: 92,
        detectedHinglishWords: detectedHinglish,
      };
    } else if (norm.includes('upi') || norm.includes('online') || norm.includes('cash') || norm.includes('pay') || norm.includes('gpay')) {
      return {
        reply: "You can pay with Google Pay or cash, madam. Here is my shop QR code on the counter. Thank you very much!",
        hindiTranslation: "आप Google Pay या नकद दे सकती हैं, मैडम। काउंटर पर मेरी दुकान का QR कोड है। बहुत-बहुत धन्यवाद!",
        correction: "Can I pay using UPI or cash, please?",
        explanationHindi: "भुगतान का तरीका पूछते समय 'Can I pay using UPI, please?' कहना एकदम सही है।",
        clarityScore: 94,
        detectedHinglishWords: detectedHinglish,
      };
    } else {
      return {
        reply: `Certainly, madam! I have packed that for you fresh. Would you like some sweet peas or fresh spinach as well today?`,
        hindiTranslation: "बिल्कुल मैडम! मैंने आपके लिए एकदम ताज़ा पैक कर दिया है। क्या आज आप थोड़ी मीठी मटर या ताज़ा पालक भी लेना चाहेंगी?",
        correction: "Please give me these fresh vegetables, thank you.",
        explanationHindi: "'Bhaiya' के बाद 'Please give me...' बोलने से आपकी बात अंग्रेजी में बहुत आत्मविश्वास से भरी लगेगी।",
        clarityScore: 85,
        detectedHinglishWords: detectedHinglish,
      };
    }
  }

  // Scenario 2: Clinic Visit & Doctor
  if (scenarioSlug === 'clinic-visit') {
    if (norm.includes('knee') || norm.includes('ghutna') || norm.includes('dard') || norm.includes('ache') || norm.includes('pain') || norm.includes('shoulder')) {
      return {
        reply: "I understand. Joint and knee aches are very common, but we will take good care of you. How many days has this pain been troubling you, and is it worse in the morning?",
        hindiTranslation: "मैं समझ सकती हूँ। जोड़ों और घुटनों का दर्द बहुत आम है, हम आपका पूरा ध्यान रखेंगे। यह दर्द आपको कितने दिनों से परेशान कर रहा है, और क्या सुबह यह ज्यादा होता है?",
        correction: "Doctor, I have had a continuous ache in my knee for the past three days.",
        explanationHindi: "'Dard' के लिए 'ache' या 'pain' बोलें। जब बताना हो कि कितने दिन से है, तो 'for the past three days' बोलना बहुत प्राकृतिक लगता है।",
        clarityScore: 90,
        detectedHinglishWords: detectedHinglish,
      };
    } else if (norm.includes('medicine') || norm.includes('dawa') || norm.includes('food') || norm.includes('khana') || norm.includes('after')) {
      return {
        reply: "Please take this tablet once in the morning after breakfast, and the evening capsule after dinner with warm water. Avoid heavy physical strain for a few days.",
        hindiTranslation: "कृपया यह गोली सुबह नाश्ते के बाद एक बार लें, और शाम की कैप्सूल रात के खाने के बाद गुनगुने पानी से लें। कुछ दिनों तक भारी काम न करें।",
        correction: "Should I take this medicine after food, Doctor?",
        explanationHindi: "दवाई खाने के बाद लेनी है या पहले, यह पूछने के लिए 'Should I take this medicine after food?' सबसे सरल वाक्य है।",
        clarityScore: 93,
        detectedHinglishWords: detectedHinglish,
      };
    } else {
      return {
        reply: "Thank you for sharing that with me. Let me check your pulse and blood pressure now. Take a deep, gentle breath and relax.",
        hindiTranslation: "मुझे यह बताने के लिए धन्यवाद। अब मैं आपकी नब्ज़ और ब्लड प्रेशर देख लेती हूँ। गहरी और शांत सांस लीजिए।",
        correction: "I have been feeling a little weak and tired lately.",
        explanationHindi: "कमजोरी महसूस होने पर अंग्रेजी में कहें: 'I have been feeling weak and tired'.",
        clarityScore: 86,
        detectedHinglishWords: detectedHinglish,
      };
    }
  }

  // Scenario 3: WhatsApp Message to Relatives
  if (scenarioSlug === 'whatsapp-relatives') {
    return {
      reply: "That is such a heartwarming message! Your family will be overjoyed to read your sweet words. Here is how we can polish it into graceful English for the family WhatsApp group.",
      hindiTranslation: "यह बहुत ही प्यारा और दिल छू लेने वाला संदेश है! आपके परिवार वाले आपके इन प्यारे शब्दों को पढ़कर बहुत खुश होंगे।",
      correction: "Heartiest congratulations on your wonderful new job, Priya beti! We are all so proud of you. Stay blessed always.",
      explanationHindi: "बधाई देते समय 'Heartiest congratulations' (हार्दिक बधाई) और अंत में 'Stay blessed always' (सदा सुखी रहो) लिखना बहुत सुंदर प्रभाव छोड़ता है।",
      clarityScore: 95,
      detectedHinglishWords: detectedHinglish,
    };
  }

  // Scenario 4: Ordering at Café or Airport
  if (scenarioSlug === 'cafe-airport') {
    return {
      reply: "Coming right up! One hot ginger tea with less sugar and two steamed vegetable samosas. Please take this token number; we will call your number in five minutes.",
      hindiTranslation: "बस अभी आया! एक कम चीनी वाली अदरक की गरमा-गरम चाय और दो वेज समोसे। कृपया यह टोकन नंबर लीजिए; पाँच मिनट में आपका नंबर बुलाएंगे।",
      correction: "Could I please have one hot ginger tea with less sugar?",
      explanationHindi: "कैफे में ऑर्डर करते समय 'Could I please have...' कहना बहुत विनम्र लगता है। कम चीनी के लिए 'with less sugar' बोलें।",
      clarityScore: 92,
      detectedHinglishWords: detectedHinglish,
    };
  }

  // Scenario 5: Casual Family Chat with Grandchildren
  if (scenarioSlug === 'family-chat') {
    return {
      reply: "Yay Dadi! Your hot snacks and milk are my favorite in the whole world! School was good today, we had art class and drawing competition.",
      hindiTranslation: "वाह दादी! आपके हाथ का नाश्ता और दूध मुझे पूरी दुनिया में सबसे ज्यादा पसंद है! आज स्कूल बहुत अच्छा था, हमारा ड्राइंग का मुकाबला था।",
      correction: "Come wash your hands first, beta. I made delicious hot pakoras and warm milk for you.",
      explanationHindi: "बच्चों को प्यार से बुलाते हुए कहें: 'Come wash your hands first'. 'Delicious' का मतलब होता है बहुत स्वादिष्ट।",
      clarityScore: 94,
      detectedHinglishWords: detectedHinglish,
    };
  }

  // General fallback
  return {
    reply: `You expressed yourself very well! I understood your meaning clearly. Let us continue practicing together.`,
    hindiTranslation: "आपने अपनी बात बहुत अच्छे से कही! मैं आपकी बात पूरी तरह समझ गई। आइए मिलकर आगे अभ्यास जारी रखें।",
    correction: userText,
    explanationHindi: "आप बहुत अच्छा प्रयास कर रही हैं! रोज़ थोड़ा-थोड़ा बोलने से झिझक पूरी तरह दूर हो जाएगी।",
    clarityScore: 88,
    detectedHinglishWords: detectedHinglish,
  };
}
