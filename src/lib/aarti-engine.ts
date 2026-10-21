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
  daam: { en: 'price', hi: 'दाम / भाव' },
  bohot: { en: 'very / a lot', hi: 'बहुत' },
  jyada: { en: 'much / more', hi: 'ज्यादा' },
  dard: { en: 'ache / pain', hi: 'दर्द / तकलीफ' },
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
  mirchi: { en: 'chilies', hi: 'हरी मिर्च' },
  dhaniya: { en: 'coriander', hi: 'हरा धनिया' },
  thaili: { en: 'bag', hi: 'थैली / झोला' },
  beta: { en: 'child / son', hi: 'बेटा' },
  beti: { en: 'daughter', hi: 'बेटी' },
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
 * Intelligent Aarti Didi dialogue generator with Indian English cadence, warmth, and supportive Hindi coaching
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

  // Scenario 1: Sabzi Mandi (Buying Vegetables with Ramesh Bhaiya)
  if (scenarioSlug === 'sabzi-mandi') {
    if (norm.includes('tamatar') || norm.includes('tomato')) {
      return {
        reply: "Namaste ji! Fresh red tomatoes are forty rupees per kilo today from the mandi. Very sweet and firm quality, shall I weigh one kilo for you?",
        hindiTranslation: "नमस्ते जी! आज मंडी से एकदम ताज़े लाल टमाटर चालीस रुपये किलो हैं। बहुत बढ़िया क्वालिटी है, क्या आपके लिए एक किलो तौल दूँ?",
        correction: "Bhaiya, please give me one kilo of tomatoes. How much do they cost?",
        explanationHindi: "अरे वाह! आपने बहुत अच्छी शुरुआत की। 'Tamatar' को अंग्रेजी में 'Tomatoes' कहते हैं। जब दाम पूछना हो, तो 'How much do they cost?' या 'What is the price?' कहना सबसे स्वाभाविक और सभ्य लगता है।",
        clarityScore: 88,
        detectedHinglishWords: detectedHinglish,
      };
    } else if (norm.includes('coriander') || norm.includes('dhaniya') || norm.includes('mirchi') || norm.includes('chili')) {
      return {
        reply: "Arrey, absolutely madam! I will put fresh coriander and two green chilies in your bag for free. No problem at all! Anything else for cooking today?",
        hindiTranslation: "अरे बिल्कुल मैडम! मैं आपके थैले में ताज़ा हरा धनिया और दो हरी मिर्चें मुफ्त डाल देता हूँ। कोई बात नहीं! आज पकाने के लिए और कुछ चाहिए?",
        correction: "Could you please add some fresh coriander and green chilies as well?",
        explanationHindi: "सब्जीवाले भैया से धनिया-मिर्ची माँगते समय 'Could you please add...' कहना बहुत विनम्र और अपनापन भरा लगता है।",
        clarityScore: 92,
        detectedHinglishWords: detectedHinglish,
      };
    } else if (norm.includes('upi') || norm.includes('online') || norm.includes('cash') || norm.includes('pay') || norm.includes('gpay')) {
      return {
        reply: "Yes, yes! You can pay by Google Pay, PhonePe, or cash, madam. The shop QR code is right here on the counter. Thank you very much ji!",
        hindiTranslation: "हाँ-हाँ! आप Google Pay, PhonePe या नकद दे सकती हैं, मैडम। दुकान का QR कोड यहीं काउंटर पर लगा है। बहुत-बहुत धन्यवाद जी!",
        correction: "Can I pay using UPI or cash, please?",
        explanationHindi: "ऑनलाइन या नकद भुगतान पूछते समय 'Can I pay using UPI, please?' बोलना एकदम सरल और सही है।",
        clarityScore: 94,
        detectedHinglishWords: detectedHinglish,
      };
    } else {
      return {
        reply: `Certainly madam ji! I have packed these fresh vegetables for you. Would you like some green peas or fresh spinach also today?`,
        hindiTranslation: "बिल्कुल मैडम जी! मैंने आपके लिए ये ताज़ी सब्जियाँ पैक कर दी हैं। क्या आज आप थोड़ी हरी मटर या ताज़ा पालक भी लेना चाहेंगी?",
        correction: "Please give me these fresh vegetables, thank you.",
        explanationHindi: "दुकानदार से कोई भी चीज माँगते समय 'Please give me...' बोलने से आपकी बात अंग्रेजी में बहुत सलीके से प्रस्तुत होती है।",
        clarityScore: 85,
        detectedHinglishWords: detectedHinglish,
      };
    }
  }

  // Scenario 2: Clinic Visit & Talking to Dr. Neha Sharma
  if (scenarioSlug === 'clinic-visit') {
    if (norm.includes('knee') || norm.includes('ghutna') || norm.includes('dard') || norm.includes('ache') || norm.includes('pain') || norm.includes('shoulder')) {
      return {
        reply: "Namaste Shanti ji. Please sit down comfortably. Knee and joint aches can be uncomfortable, but do not worry, we will treat it properly. From how many days has this pain been troubling you?",
        hindiTranslation: "नमस्ते शांति जी। आराम से बैठिए। घुटने और जोड़ों का दर्द परेशान करता है, लेकिन बिल्कुल चिंता न करें, हम इसका सही इलाज करेंगे। यह दर्द आपको कितने दिनों से हो रहा है?",
        correction: "Doctor, I have had a continuous ache in my knee for the past three days.",
        explanationHindi: "डॉक्टर को अपनी तकलीफ बताते समय 'dard' की जगह 'ache' या 'pain' कहें। जब बताना हो कि कितने समय से है, तो 'for the past three days' कहना सबसे स्वाभाविक है।",
        clarityScore: 90,
        detectedHinglishWords: detectedHinglish,
      };
    } else if (norm.includes('medicine') || norm.includes('dawa') || norm.includes('food') || norm.includes('khana') || norm.includes('after')) {
      return {
        reply: "Take this tablet once in the morning after breakfast, and the evening capsule after dinner with warm water, okay? Also avoid heavy household chores for a few days.",
        hindiTranslation: "यह गोली सुबह नाश्ते के बाद एक बार लीजिए, और शाम वाली कैप्सूल रात के खाने के बाद गुनगुने पानी से लीजिए, ठीक है? कुछ दिनों तक भारी घरेलू काम न करें।",
        correction: "Should I take this medicine after food, Doctor?",
        explanationHindi: "दवाई खाने के बाद लेनी है या पहले, यह पूछने के लिए 'Should I take this medicine after food, Doctor?' सबसे सरल और सटीक वाक्य है।",
        clarityScore: 93,
        detectedHinglishWords: detectedHinglish,
      };
    } else {
      return {
        reply: "Thank you for explaining clearly, Shanti ji. Let me check your pulse and blood pressure now. Take a gentle breath and relax.",
        hindiTranslation: "साफ-साफ बताने के लिए धन्यवाद, शांति जी। अब मैं आपकी नब्ज़ और ब्लड प्रेशर नाप लेती हूँ। आराम से गहरी सांस लीजिए।",
        correction: "I have been feeling a little weak and tired lately.",
        explanationHindi: "शरीर में थकान या कमजोरी लगने पर अंग्रेजी में कहें: 'I have been feeling a little weak and tired'.",
        clarityScore: 86,
        detectedHinglishWords: detectedHinglish,
      };
    }
  }

  // Scenario 3: Polite WhatsApp Message to Relatives
  if (scenarioSlug === 'whatsapp-relatives') {
    return {
      reply: "Arrey waah! That is such a heartfelt, loving thought! Your family will be overjoyed reading your message in the group. Here is how we can phrase it gracefully in Indian English:",
      hindiTranslation: "अरे वाह! यह कितना प्यारा और स्नेह भरा विचार है! आपके परिवार वाले ग्रुप में आपका यह संदेश पढ़कर बेहद खुश होंगे। आइए इसे बहुत सुंदर अंग्रेजी में लिखें:",
      correction: "Heartiest congratulations on your wonderful new job, Priya beti! We are all so proud of you. Stay blessed always.",
      explanationHindi: "रिश्तेदारों को बधाई देते समय 'Heartiest congratulations' (हार्दिक बधाई) और अंत में 'Stay blessed always' (सदा सुखी रहो / आशीर्वाद) लिखना बहुत आदरपूर्ण प्रभाव छोड़ता है।",
      clarityScore: 95,
      detectedHinglishWords: detectedHinglish,
    };
  }

  // Scenario 4: Ordering at Café or Airport
  if (scenarioSlug === 'cafe-airport') {
    return {
      reply: "Namaste! Coming right up for you! One hot ginger tea with less sugar and two fresh vegetable samosas. Please take this token number, we will serve you in five minutes.",
      hindiTranslation: "नमस्ते! आपके लिए अभी तैयार करते हैं! एक कम चीनी वाली गरमा-गरम अदरक की चाय और दो ताज़े वेज समोसे। यह टोकन नंबर रखिए, पाँच मिनट में तैयार हो जाएगा।",
      correction: "Could I please have one hot ginger tea with less sugar?",
      explanationHindi: "कैफे में चाय या कॉफी माँगते समय 'I want tea' कहने के बजाय 'Could I please have a hot ginger tea...' कहना बहुत सभ्य लगता है। कम चीनी के लिए 'with less sugar' बोलें।",
      clarityScore: 92,
      detectedHinglishWords: detectedHinglish,
    };
  }

  // Scenario 5: Casual Family Chat with Grandchildren (Aarav)
  if (scenarioSlug === 'family-chat') {
    return {
      reply: "Yay Dadi! Your hot snacks and warm milk are the best in the whole world! School was very fun today, our art teacher taught us water color painting.",
      hindiTranslation: "वाह दादी! आपके हाथ का नाश्ता और दूध पूरी दुनिया में सबसे बढ़िया है! आज स्कूल में बहुत मज़ा आया, हमारी आर्ट टीचर ने हमें वॉटर कलर पेंटिंग सिखाई।",
      correction: "Come wash your hands first, beta. I made delicious hot pakoras and warm milk for you.",
      explanationHindi: "बच्चों से बात करते समय प्यार से कहें: 'Come wash your hands first, beta'. 'Delicious' का अर्थ होता है बहुत ही स्वादिष्ट खाना।",
      clarityScore: 94,
      detectedHinglishWords: detectedHinglish,
    };
  }

  // General fallback
  return {
    reply: `Namaste ji! You spoke so well. I understood your meaning clearly. Let us practice speaking step by step together without any worry!`,
    hindiTranslation: "नमस्ते जी! आपने बहुत अच्छा बोला। मैं आपकी बात पूरी तरह समझ गई। बिना किसी चिंता के आइए मिलकर आगे अभ्यास जारी रखें!",
    correction: userText,
    explanationHindi: "शाबाश! आप बहुत अच्छा प्रयास कर रही हैं। रोज़ आरती दीदी के साथ 5 मिनट बोलने से आपकी अंग्रेजी बिल्कुल सहज हो जाएगी।",
    clarityScore: 88,
    detectedHinglishWords: detectedHinglish,
  };
}
