'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookMarked,
  Volume2,
  Plus,
  Trash2,
  Sparkles,
  Search,
  CheckCircle,
  Tag,
  ArrowLeft,
  X,
  MessageCircle,
} from 'lucide-react';
import SpeechPlayer from '@/components/SpeechPlayer';
import { useAccessibility } from '@/components/ui/AccessibilityProvider';

interface VocabItem {
  id: string;
  word: string;
  hindiMeaning: string;
  phonetic?: string | null;
  exampleSentence?: string | null;
  category: string;
  createdAt: string;
}

const DEFAULT_VOCABULARY: VocabItem[] = [
  {
    id: 'vocab-1',
    word: 'Coriander',
    hindiMeaning: 'धनिया (hara dhaniya)',
    phonetic: 'koh-ree-AN-der',
    exampleSentence: 'Bhaiya, please put some fresh coriander in the bag.',
    category: 'Market',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vocab-2',
    word: 'Dizziness',
    hindiMeaning: 'चक्कर आना (chakkar aana)',
    phonetic: 'DIZ-ee-nis',
    exampleSentence: 'I am feeling some dizziness since this morning.',
    category: 'Health',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vocab-3',
    word: 'Heartiest Congratulations',
    hindiMeaning: 'हार्दिक बधाई एवं शुभकामनाएँ',
    phonetic: 'HAHR-tee-ist kahn-graj-oo-LAY-shunz',
    exampleSentence: 'Heartiest congratulations to the newlywed couple!',
    category: 'Polite',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vocab-4',
    word: 'Boarding Gate',
    hindiMeaning: 'विमान में चढ़ने का द्वार',
    phonetic: 'BOHR-ding gayt',
    exampleSentence: 'Excuse me, could you tell me where gate number 14 is?',
    category: 'Everyday',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vocab-5',
    word: 'Bedtime Story',
    hindiMeaning: 'सोते समय की कहानी',
    phonetic: 'BED-tym STOR-ee',
    exampleSentence: 'Dadi will tell you a wonderful bedtime story tonight.',
    category: 'Family',
    createdAt: new Date().toISOString(),
  },
];

export default function VocabularyPage() {
  const { highContrast, soundSpeed } = useAccessibility();
  const [items, setItems] = useState<VocabItem[]>(DEFAULT_VOCABULARY);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Word Form modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newPhonetic, setNewPhonetic] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newCategory, setNewCategory] = useState('Everyday');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchVocabulary = async () => {
    try {
      const res = await fetch('/api/vocabulary');
      if (res.ok) {
        const data = await res.json();
        if (data.vocabulary && data.vocabulary.length > 0) {
          setItems(data.vocabulary);
        }
      }
    } catch (err) {
      console.warn('Using local fallback vocabulary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVocabulary();
  }, []);

  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newMeaning.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/vocabulary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: newWord.trim(),
          hindiMeaning: newMeaning.trim(),
          phonetic: newPhonetic.trim() || undefined,
          exampleSentence: newExample.trim() || undefined,
          category: newCategory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.item) {
          setItems((prev) => [data.item, ...prev]);
        }
        setShowAddModal(false);
        setNewWord('');
        setNewMeaning('');
        setNewPhonetic('');
        setNewExample('');
      } else {
        alert('Failed to save word. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving word.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this word? • क्या आप इस शब्द को हटाना चाहते हैं?')) {
      return;
    }

    try {
      const res = await fetch(`/api/vocabulary?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
      // Fallback UI delete
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Filter categories
  const categories = ['All', 'Everyday', 'Market', 'Health', 'Family', 'Polite'];

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hindiMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.exampleSentence && item.exampleSentence.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Top Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border-2 transition-all ${
          highContrast
            ? 'bg-slate-900 border-emerald-400 text-white'
            : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold bg-emerald-600 text-white">
              <BookMarked className="w-4 h-4" />
              <span>व्यक्तिगत शब्दकोश • Personal Word Bank</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              My Vocabulary • मेरा शब्दकोश
            </h1>
            <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 font-medium">
              बातचीत से सहेजे गए महत्वपूर्ण शब्द और वाक्य। जब चाहें ऑडियो सुनें और दोहराएँ।
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className={`px-6 py-3.5 rounded-2xl font-black text-lg min-h-[52px] flex items-center justify-center gap-2 transition-all shadow-md focus:outline-none focus:ring-4 ${
              highContrast
                ? 'bg-emerald-400 text-black hover:bg-emerald-300 border-2 border-white'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-300'
            }`}
          >
            <Plus className="w-6 h-6" />
            <span>Add Word • नया शब्द</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-base font-bold whitespace-nowrap transition-all border min-h-[44px] ${
                  isActive
                    ? highContrast
                      ? 'bg-emerald-400 text-black border-white'
                      : 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : highContrast
                    ? 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[260px]">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search word or meaning... खोजें"
            className={`w-full pl-11 pr-4 py-2.5 rounded-xl border-2 text-base font-medium focus:outline-none focus:ring-4 ${
              highContrast
                ? 'bg-black text-white border-white focus:ring-emerald-400'
                : 'bg-white text-slate-900 border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
            }`}
          />
        </div>
      </div>

      {/* Vocabulary List */}
      {filteredItems.length === 0 ? (
        <div
          className={`text-center py-16 px-4 rounded-3xl border-2 border-dashed ${
            highContrast ? 'border-slate-700 bg-slate-950' : 'border-slate-300 bg-slate-50'
          }`}
        >
          <BookMarked className="w-16 h-16 mx-auto text-slate-400 mb-4" />
          <h3 className="text-2xl font-black">No Words Found • कोई शब्द नहीं मिला</h3>
          <p className="text-slate-500 text-lg mt-2 max-w-md mx-auto">
            बातचीत के दौरान सुझाव कार्ड से किसी भी शब्द को सहेजें या &apos;Add Word&apos; बटन से जोड़ें।
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-6 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-6 rounded-2xl border-2 flex flex-col justify-between transition-all hover:shadow-md ${
                highContrast
                  ? 'bg-black border-slate-700 text-white hover:border-emerald-400'
                  : 'bg-white border-slate-200 hover:border-emerald-300 shadow-sm'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                      {item.word}
                    </h3>
                    <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                      {item.hindiMeaning}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shrink-0 ${
                      highContrast
                        ? 'bg-slate-800 text-emerald-300'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {item.category}
                  </span>
                </div>

                {item.phonetic && (
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Phonetic: <span className="font-mono text-emerald-600 dark:text-emerald-400">{item.phonetic}</span>
                  </p>
                )}

                {item.exampleSentence && (
                  <div
                    className={`p-3 rounded-xl border text-sm font-medium ${
                      highContrast
                        ? 'bg-slate-900 border-slate-700 text-slate-200'
                        : 'bg-slate-50 border-slate-100 text-slate-700'
                    }`}
                  >
                    &ldquo;{item.exampleSentence}&rdquo;
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                <SpeechPlayer
                  text={item.exampleSentence ? `${item.word}. ${item.exampleSentence}` : item.word}
                  label="Listen • सुनें"
                  className="py-1.5 px-3.5 text-sm"
                />

                <button
                  onClick={() => handleDelete(item.id)}
                  aria-label={`Remove ${item.word}`}
                  className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Word Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 border-2 shadow-2xl relative ${
              highContrast
                ? 'bg-black border-emerald-400 text-white'
                : 'bg-white border-emerald-200 text-slate-900'
            }`}
          >
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-1 mb-6">
              <h2 className="text-2xl font-black">Add New Word • नया शब्द जोड़ें</h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                अपनी पसंद का कोई भी शब्द या वाक्य सहेजें
              </p>
            </div>

            <form onSubmit={handleAddWord} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">
                  English Word or Phrase <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="e.g. Can you please repeat?"
                  className={`w-full px-4 py-3 rounded-xl border-2 text-base font-medium focus:outline-none focus:ring-4 ${
                    highContrast
                      ? 'bg-slate-950 border-white text-white focus:ring-emerald-400'
                      : 'bg-slate-50 border-slate-200 focus:border-emerald-600 focus:ring-emerald-100'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">
                  Hindi Meaning • हिंदी अर्थ <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  placeholder="उदा. क्या आप दोबारा बोल सकते हैं?"
                  className={`w-full px-4 py-3 rounded-xl border-2 text-base font-medium focus:outline-none focus:ring-4 ${
                    highContrast
                      ? 'bg-slate-950 border-white text-white focus:ring-emerald-400'
                      : 'bg-slate-50 border-slate-200 focus:border-emerald-600 focus:ring-emerald-100'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Category • वर्ग</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 text-base font-medium focus:outline-none focus:ring-4 ${
                      highContrast
                        ? 'bg-slate-950 border-white text-white'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="Everyday">Everyday (रोज़मर्रा)</option>
                    <option value="Market">Market (खरीदारी)</option>
                    <option value="Health">Health (स्वास्थ्य)</option>
                    <option value="Family">Family (परिवार)</option>
                    <option value="Polite">Polite (शिष्टाचार)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Phonetic (उचारण)</label>
                  <input
                    type="text"
                    value={newPhonetic}
                    onChange={(e) => setNewPhonetic(e.target.value)}
                    placeholder="e.g. kæn juː pliːz"
                    className={`w-full px-4 py-3 rounded-xl border-2 text-base font-medium focus:outline-none focus:ring-4 ${
                      highContrast
                        ? 'bg-slate-950 border-white text-white'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                  </input>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">
                  Example Sentence • उदाहरण वाक्य (वैकल्पिक)
                </label>
                <textarea
                  rows={2}
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  placeholder="e.g. Could you please repeat that more slowly?"
                  className={`w-full px-4 py-2.5 rounded-xl border-2 text-base font-medium focus:outline-none focus:ring-4 ${
                    highContrast
                      ? 'bg-slate-950 border-white text-white'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-3 rounded-xl font-bold border text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-xl font-black text-base flex items-center gap-2 ${
                    highContrast
                      ? 'bg-emerald-400 text-black hover:bg-emerald-300'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {isSubmitting ? 'Saving...' : 'Save Word • सहेजें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
