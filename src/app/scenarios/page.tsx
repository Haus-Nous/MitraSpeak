'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  ShoppingBasket,
  HeartPulse,
  Send,
  Coffee,
  Users,
  Sparkles,
  ArrowRight,
  User,
  Volume2,
  CheckCircle,
} from 'lucide-react';
import SpeechPlayer from '@/components/SpeechPlayer';
import { useAccessibility } from '@/components/ui/AccessibilityProvider';

const ICON_MAP: Record<string, any> = {
  ShoppingBasket,
  HeartPulse,
  Send,
  Coffee,
  Users,
  MessageCircle,
};

const FALLBACK_SCENARIOS = [
  {
    id: 'sc-sabzi-mandi',
    slug: 'sabzi-mandi',
    title: 'Haggling & Buying Vegetables',
    titleHindi: 'सब्जी मंडी और खरीदारी',
    category: 'DAILY_LIFE',
    description: 'Ask for fresh tomatoes, check prices per kilo, ask for extra coriander or green chilies, and pay with cash or UPI.',
    descriptionHindi: 'ताज़ी सब्जियों के दाम पूछना, मोलभाव करना, और मुफ्त धनिया-मिर्ची माँगना सीखें।',
    icon: 'ShoppingBasket',
    characterName: 'Ramesh Bhai (Vegetable Vendor)',
    characterNameHindi: 'रमेश भाई (सब्जी विक्रेता)',
    starterAudioText: 'Namaste Mataji! Fresh tomatoes and cauliflower just arrived today. How many kilos do you need?',
    starterAudioHindi: 'नमस्ते माताजी! ताज़े टमाटर और गोभी अभी आए हैं। आपको कितने किलो चाहिए?',
  },
  {
    id: 'sc-doctor-clinic',
    slug: 'clinic-visit',
    title: 'Talking to a Doctor at a Clinic',
    titleHindi: 'क्लीनिक में डॉक्टर से बातचीत',
    category: 'HEALTH',
    description: 'Explain symptoms like headache, stomach ache, fever duration, blood pressure, and ask about dosage timings calmly.',
    descriptionHindi: 'डॉक्टर को सिरदर्द, पेट में दर्द, बुखार और बीपी की दवा के बारे में स्पष्ट अंग्रेजी में बताना।',
    icon: 'HeartPulse',
    characterName: 'Dr. Sharma (Physician)',
    characterNameHindi: 'डॉ. शर्मा (पारिवारिक चिकित्सक)',
    starterAudioText: 'Good evening. Please have a seat. How have you been feeling since yesterday?',
    starterAudioHindi: 'नमस्ते। कृपया बैठिए। कल से आपकी तबीयत कैसी लग रही है?',
  },
  {
    id: 'sc-whatsapp-relatives',
    slug: 'whatsapp-relatives',
    title: 'Polite WhatsApp to Relatives',
    titleHindi: 'रिश्तेदारों को व्हाट्सएप संदेश',
    category: 'SOCIAL',
    description: 'Draft warm, polite messages for weddings, birthdays, congratulations, and family WhatsApp groups with perfect etiquette.',
    descriptionHindi: 'शादी, जन्मदिन या त्यौहारों पर अंग्रेजी में आदरपूर्वक और स्नेह से शुभकामना संदेश भेजना।',
    icon: 'Send',
    characterName: 'Sunita Aunty (Cousin)',
    characterNameHindi: 'सुनीता चाची (पारिवारिक सदस्य)',
    starterAudioText: 'Hello Didi! Are you attending Priya’s wedding reception this Sunday in Delhi?',
    starterAudioHindi: 'नमस्ते दीदी! क्या आप इस रविवार दिल्ली में प्रिया की शादी में आ रही हैं?',
  },
  {
    id: 'sc-cafe-airport',
    slug: 'cafe-airport',
    title: 'Ordering at Cafe & Airport Gate',
    titleHindi: 'कैफे और एयरपोर्ट सहायता',
    category: 'DAILY_LIFE',
    description: 'Order hot ginger tea or cappuccino with less sugar, ask for washroom directions, and confirm flight gate at Delhi/Mumbai airport.',
    descriptionHindi: 'कैफे में चाय-कॉफ़ी ऑर्डर करना और एयरपोर्ट पर बोर्डिंग गेट व पानी पूछना।',
    icon: 'Coffee',
    characterName: 'Rohan (Barista & Staff)',
    characterNameHindi: 'रोहन (कैफे बरिस्ता)',
    starterAudioText: 'Welcome! What would you like to have today? We have masala tea and mild filter coffee.',
    starterAudioHindi: 'स्वागत है! आप क्या लेना पसंद करेंगे? हमारे पास मसाला चाय और फ़िल्टर कॉफ़ी है।',
  },
  {
    id: 'sc-family-grandchildren',
    slug: 'family-chat',
    title: 'Casual Conversation with Grandchildren & Family',
    titleHindi: 'बच्चों और परिवार से बातचीत',
    category: 'FAMILY',
    description: 'Bond with English-speaking grandkids about school exams, cartoon characters, favourite dinner dishes, and bedtime stories.',
    descriptionHindi: 'स्कूल, होमवर्क, गेम्स और पसंदीदा खाने के बारे में बच्चों से प्यार भरी बातचीत करना।',
    icon: 'Users',
    characterName: 'Aarav (Grandson, 9 yrs)',
    characterNameHindi: 'आरव (नाती / पोता, 9 वर्ष)',
    starterAudioText: 'Dadi! Look what drawing I made today in school! Can you see what animal this is?',
    starterAudioHindi: 'दादी! देखिए मैंने आज स्कूल में क्या ड्राइंग बनाई! क्या आप पहचान सकती हैं यह कौन सा जानवर है?',
  },
];

export default function ScenariosPage() {
  const { highContrast } = useAccessibility();
  const [scenarios, setScenarios] = useState<any[]>(FALLBACK_SCENARIOS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/scenarios')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load scenarios');
        return res.json();
      })
      .then((data) => {
        if (data.scenarios && data.scenarios.length > 0) {
          setScenarios(data.scenarios);
        }
      })
      .catch((err) => {
        console.warn('Using fallback scenarios:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-10 py-6 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Header Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border-2 transition-all ${
          highContrast
            ? 'bg-slate-900 border-emerald-400 text-white'
            : 'bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border-emerald-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold bg-emerald-600 text-white">
              <Sparkles className="w-4 h-4" />
              <span>दैनिक जीवन की 5 बातचीत • 5 Everyday Situations</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Speaking Scenarios • बोलचाल के विषय
            </h1>
            <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 font-medium max-w-2xl">
              बिना किसी डर या झिझक के अपनी गति से अंग्रेजी बोलिए। आरती दीदी हर कदम पर आपका मार्गदर्शन करेंगी।
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-600/10 dark:bg-emerald-400/10 text-emerald-800 dark:text-emerald-300 px-4 py-3 rounded-2xl border border-emerald-300 font-bold text-base">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>100% सुरक्षित और दोस्ताना माहौल</span>
          </div>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {scenarios.map((sc, index) => {
          const IconComp = ICON_MAP[sc.icon] || MessageCircle;
          const targetUrl = `/scenarios/${sc.slug || sc.id}`;

          return (
            <div
              key={sc.id || sc.slug}
              className={`rounded-3xl border-2 p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 hover:shadow-lg ${
                highContrast
                  ? 'bg-black border-white text-white hover:border-emerald-400'
                  : 'bg-white border-emerald-100 hover:border-emerald-300 shadow-sm text-slate-900'
              }`}
            >
              <div className="space-y-4">
                {/* Header with Icon and Sequence Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                      highContrast
                        ? 'bg-emerald-400 text-black'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    <IconComp className="w-8 h-8" />
                  </div>
                  <span
                    className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full ${
                      highContrast
                        ? 'bg-slate-800 text-white border border-white'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    Scenario {index + 1}
                  </span>
                </div>

                {/* Scenario Titles */}
                <div>
                  <h2 className="text-2xl font-black leading-snug">{sc.title}</h2>
                  <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                    {sc.titleHindi}
                  </p>
                </div>

                {/* Character Badge */}
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold ${
                    highContrast
                      ? 'bg-slate-900 text-emerald-300 border border-emerald-400'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>
                    Partner: <strong>{sc.characterName}</strong> ({sc.characterNameHindi})
                  </span>
                </div>

                {/* Scenario Descriptions */}
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {sc.description}
                </p>
                <p className="text-base text-slate-500 dark:text-slate-400 font-normal italic">
                  &ldquo;{sc.descriptionHindi}&rdquo;
                </p>

                {/* Starter Audio Preview */}
                {sc.starterAudioText && (
                  <div
                    className={`p-4 rounded-2xl border text-sm space-y-2 ${
                      highContrast
                        ? 'bg-slate-950 border-emerald-500/40 text-emerald-200'
                        : 'bg-emerald-50/70 border-emerald-100 text-emerald-950'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold flex items-center gap-1.5 text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                        <Volume2 className="w-4 h-4" />
                        Starter Question • शुरुआत
                      </span>
                      <SpeechPlayer
                        text={sc.starterAudioText}
                        label="Play Audio"
                        className="py-1 px-3 text-xs min-h-[36px]"
                      />
                    </div>
                    <p className="font-medium">&ldquo;{sc.starterAudioText}&rdquo;</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {sc.starterAudioHindi}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href={targetUrl}
                  className={`w-full py-4 px-6 rounded-2xl font-black text-lg min-h-[56px] flex items-center justify-center gap-3 transition-all focus:outline-none focus:ring-4 ${
                    highContrast
                      ? 'bg-emerald-400 text-black hover:bg-emerald-300 focus:ring-white border-2 border-white'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 focus:ring-emerald-300'
                  }`}
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>Start Conversation • बातचीत शुरू करें</span>
                  <ArrowRight className="w-5 h-5 ml-auto" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
