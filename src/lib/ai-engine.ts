export interface EvaluationResult {
  isCorrect: boolean;
  score: number; // 0 - 100
  supportiveFeedback: string;
  grammarTip?: string;
  suggestedAnswer?: string;
}

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Evaluates an exercise response using deterministic semantic heuristics and NLP pattern matching
 */
export function evaluateExercise({
  type,
  userResponse,
  correctResponse,
  optionsJson,
  explanation,
}: {
  type: string;
  userResponse: string;
  correctResponse: string;
  optionsJson?: string | null;
  explanation?: string | null;
}): EvaluationResult {
  const normUser = normalizeText(userResponse);
  const normCorrect = normalizeText(correctResponse);

  // 1. Direct Fill-in-the-blank or Flashcard check
  if (type === 'FILL_BLANK' || type === 'FLASHCARD') {
    const isExact = normUser === normCorrect;
    const isPartial = normUser.includes(normCorrect) || normCorrect.includes(normUser);

    if (isExact) {
      return {
        isCorrect: true,
        score: 100,
        supportiveFeedback: 'Outstanding! Your answer is spot on and clearly expressed.',
        suggestedAnswer: correctResponse,
      };
    } else if (isPartial && normUser.length > 2) {
      return {
        isCorrect: true,
        score: 85,
        supportiveFeedback: 'Very close! You grasped the key vocabulary accurately.',
        grammarTip: explanation || 'Notice the exact spelling for maximum conversational clarity.',
        suggestedAnswer: correctResponse,
      };
    } else {
      return {
        isCorrect: false,
        score: 30,
        supportiveFeedback: 'Good try! Review the helpful tip below to reinforce your memory.',
        grammarTip: explanation || `The expected word was: "${correctResponse}".`,
        suggestedAnswer: correctResponse,
      };
    }
  }

  // 2. Sentence building check
  if (type === 'SENTENCE_BUILD') {
    const isMatch = normUser === normCorrect;
    return {
      isCorrect: isMatch,
      score: isMatch ? 100 : 40,
      supportiveFeedback: isMatch
        ? 'Excellent grammatical flow! You ordered every word perfectly.'
        : 'Nice effort. English sentence structure often follows Subject + Verb + Polite phrases.',
      suggestedAnswer: correctResponse,
      grammarTip: explanation || undefined,
    };
  }

  // 3. Matching exercises check
  if (type === 'MATCHING') {
    try {
      const userObj = JSON.parse(userResponse);
      const correctObj = JSON.parse(correctResponse);
      let matches = 0;
      let total = Object.keys(correctObj).length;

      for (const [k, v] of Object.entries(correctObj)) {
        if (userObj[k] === v) matches++;
      }

      const score = Math.round((matches / (total || 1)) * 100);
      const isCorrect = score >= 75;

      return {
        isCorrect,
        score,
        supportiveFeedback: isCorrect
          ? `Superb work! You paired ${matches} of ${total} terms accurately.`
          : `You matched ${matches} of ${total} correctly. Take another quick look at the definitions.`,
        grammarTip: explanation || undefined,
      };
    } catch {
      return {
        isCorrect: false,
        score: 0,
        supportiveFeedback: 'Unable to parse matching selections. Please try again.',
      };
    }
  }

  // 4. Conversational Roleplay Evaluation
  if (type === 'ROLEPLAY') {
    let options: { expectedKeywords?: string[]; scenarioTitle?: string } = {};
    try {
      if (optionsJson) options = JSON.parse(optionsJson);
    } catch {
      // ignore
    }

    const keywords = options.expectedKeywords || [];
    let matchedKeywords = 0;
    for (const kw of keywords) {
      if (normUser.includes(kw.toLowerCase())) {
        matchedKeywords++;
      }
    }

    const keywordRatio = keywords.length > 0 ? matchedKeywords / keywords.length : 1;
    let baseScore = Math.round(50 + keywordRatio * 50);

    const isPassed = baseScore >= 65;

    return {
      isCorrect: isPassed,
      score: baseScore,
      supportiveFeedback: isPassed
        ? 'Splendid roleplay response! You communicated clearly, politely, and handled the exchange naturally.'
        : 'Good attempt. Adding a polite greeting or clearer statement makes your conversation sound even more natural.',
      grammarTip: explanation || 'Remember: Warm greetings, clear intentions, and steady pacing build conversational fluency.',
      suggestedAnswer: correctResponse,
    };
  }

  return {
    isCorrect: normUser === normCorrect,
    score: normUser === normCorrect ? 100 : 50,
    supportiveFeedback: normUser === normCorrect ? 'Great job!' : 'Review the suggested phrasing below.',
    suggestedAnswer: correctResponse,
  };
}
