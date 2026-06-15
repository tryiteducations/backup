import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

// Small seed bank — 3 questions per category, picked based on the
// user's weakest subject. TODO: replace with Supabase questions
// table query (filtered by topic_id + difficulty L1) once populated.
const QUESTION_BANK = {
  Quant: [
    {
      question: 'A train covers 60 km in 1.5 hours. What is its speed?',
      options: ['30 km/h', '40 km/h', '45 km/h', '50 km/h'],
      correct: 1,
    },
    {
      question: 'What is 15% of 200?',
      options: ['20', '25', '30', '35'],
      correct: 2,
    },
    {
      question: 'Find the next number: 2, 4, 8, 16, ?',
      options: ['18', '24', '30', '32'],
      correct: 3,
    },
  ],
  Reasoning: [
    {
      question: "Find the odd one out: Apple, Mango, Carrot, Banana",
      options: ['Apple', 'Mango', 'Carrot', 'Banana'],
      correct: 2,
    },
    {
      question:
        "If 'Pen' is called 'Book' and 'Book' is called 'Table', what do you write on?",
      options: ['Pen', 'Book', 'Table', 'Notebook'],
      correct: 2,
    },
    {
      question: 'Complete the series: A, C, E, G, ?',
      options: ['H', 'I', 'J', 'K'],
      correct: 1,
    },
  ],
  English: [
    {
      question: 'Choose the correctly spelled word.',
      options: ['Recieve', 'Receive', 'Receeve', 'Receve'],
      correct: 1,
    },
    {
      question: "Pick the synonym of 'Happy'.",
      options: ['Sad', 'Joyful', 'Angry', 'Tired'],
      correct: 1,
    },
    {
      question: "Pick the antonym of 'Brave'.",
      options: ['Bold', 'Courageous', 'Cowardly', 'Fearless'],
      correct: 2,
    },
  ],
  GK: [
    {
      question: 'Who is known as the Father of the Nation in India?',
      options: ['Jawaharlal Nehru', 'Mahatma Gandhi', 'Sardar Patel', 'Bhagat Singh'],
      correct: 1,
    },
    {
      question: 'What is the capital of India?',
      options: ['Mumbai', 'Kolkata', 'New Delhi', 'Chennai'],
      correct: 2,
    },
    {
      question: 'Which planet is known as the Red Planet?',
      options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
      correct: 1,
    },
  ],
};

// Map a subject name to one of the four seed categories above.
function detectCategory(subjectName = '') {
  const name = subjectName.toLowerCase();
  if (
    name.includes('quant') ||
    name.includes('math') ||
    name.includes('arithmetic') ||
    name.includes('numerical')
  ) {
    return 'Quant';
  }
  if (name.includes('reason') || name.includes('logic') || name.includes('aptitude')) {
    return 'Reasoning';
  }
  if (
    name.includes('english') ||
    name.includes('verbal') ||
    name.includes('grammar') ||
    name.includes('vocab')
  ) {
    return 'English';
  }
  return 'GK';
}

const STORAGE_PREFIX = 'tryit_weaktopic_lastshown_';

export default function WeakTopicCard() {
  const { user, updateUser, addCoins } = useAuth();

  const [visible, setVisible] = useState(false);
  const [lockedSubject, setLockedSubject] = useState(null);
  const [stage, setStage] = useState('intro'); // intro | quiz | success | retry
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);

  const timeoutRef = useRef(null);

  // Decide once per day, per user, whether the weak-topic nudge should show.
  useEffect(() => {
    if (!user || !Array.isArray(user.subjects) || user.subjects.length === 0) return;

    const weakest = user.subjects.reduce(
      (min, s) => (s.accuracy < min.accuracy ? s : min),
      user.subjects[0]
    );
    if (weakest.accuracy >= 75) return;

    const key = `${STORAGE_PREFIX}${user.id}`;
    const today = new Date().toDateString();
    if (localStorage.getItem(key) === today) return;

    localStorage.setItem(key, today);
    setLockedSubject({ ...weakest });
    setVisible(true);
  }, [user]);

  // Clean up any pending "next question" timer on unmount.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!user || !Array.isArray(user.subjects) || user.subjects.length === 0) return null;
  if (!visible || !lockedSubject) return null;

  const category = detectCategory(lockedSubject.name);
  const questions = QUESTION_BANK[category];
  const currentQuestion = questions[step];
  const bumpedAccuracy = Math.min(100, Math.round(lockedSubject.accuracy) + 6);

  const handleAnswer = (optionIndex) => {
    if (selected !== null) return;

    setSelected(optionIndex);
    const isCorrect = optionIndex === currentQuestion.correct;
    const updatedCorrectCount = correctCount + (isCorrect ? 1 : 0);
    setCorrectCount(updatedCorrectCount);

    timeoutRef.current = setTimeout(() => {
      if (step < questions.length - 1) {
        setStep(step + 1);
        setSelected(null);
        return;
      }

      if (updatedCorrectCount === questions.length) {
        const updatedSubjects = user.subjects.map((s) =>
          s.name === lockedSubject.name
            ? { ...s, accuracy: Math.min(100, s.accuracy + 6) }
            : s
        );
        updateUser({ subjects: updatedSubjects });
        if (typeof addCoins === 'function') addCoins(10);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['var(--color-accent, #D4AF37)', 'var(--color-accent-light, #E8C84A)', 'var(--color-primary, #1E3A5F)'],
        });
        setStage('success');
      } else {
        setStage('retry');
      }
    }, 700);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100 p-6 mb-6">
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{
          background:
            'linear-gradient(90deg, var(--color-navy, #1E3A5F), var(--color-gold, #D4AF37))',
        }}
      />

      {stage === 'intro' && (
        <div>
          <div className="flex items-start gap-3 mb-4">
            <span className="text-3xl leading-none">{lockedSubject.emoji || '🎯'}</span>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">
                Your gap, found
              </p>
              <h3
                className="text-lg font-bold leading-tight"
                style={{ color: 'var(--color-navy, #1E3A5F)' }}
              >
                {lockedSubject.name}
              </h3>
            </div>
            <button
              onClick={() => setVisible(false)}
              aria-label="Dismiss"
              className="text-gray-300 hover:text-gray-500 text-xl leading-none px-1"
            >
              ×
            </button>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Current accuracy</span>
              <span className="font-semibold" style={{ color: 'var(--color-navy, #1E3A5F)' }}>
                {Math.round(lockedSubject.accuracy)}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.max(4, Math.round(lockedSubject.accuracy))}%`,
                  backgroundColor: 'var(--color-gold, #D4AF37)',
                }}
              />
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-5">
            Three quick questions could nudge {lockedSubject.name} up to{' '}
            <span className="font-semibold" style={{ color: 'var(--color-navy, #1E3A5F)' }}>
              {bumpedAccuracy}%
            </span>
            . Ready for a quick win?
          </p>

          <button
            onClick={() => setStage('quiz')}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-navy, #1E3A5F)',
              color: 'var(--color-gold, #D4AF37)',
            }}
          >
            Take the quick win quiz →
          </button>
        </div>
      )}

      {stage === 'quiz' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Quick win · {lockedSubject.name}
            </p>
            <p className="text-xs font-semibold text-gray-400">
              {step + 1} / {questions.length}
            </p>
          </div>

          <p
            className="text-base font-semibold mb-4 leading-snug"
            style={{ color: 'var(--color-navy, #1E3A5F)' }}
          >
            {currentQuestion.question}
          </p>

          <div className="space-y-2">
            {currentQuestion.options.map((option, i) => {
              let optionClasses =
                'w-full text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors';

              if (selected === null) {
                optionClasses += ' border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50';
              } else if (i === currentQuestion.correct) {
                optionClasses += ' border-green-400 bg-green-50 text-green-700';
              } else if (i === selected) {
                optionClasses += ' border-red-300 bg-red-50 text-red-600';
              } else {
                optionClasses += ' border-gray-200 text-gray-400';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  className={optionClasses}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {stage === 'success' && (
        <div className="text-center py-2">
          <p className="text-4xl mb-2">🎉</p>
          <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--color-navy, #1E3A5F)' }}>
            3/3 — quick win!
          </h3>
          <p className="text-sm text-gray-600 mb-5">
            {lockedSubject.name} accuracy is up to{' '}
            <span className="font-semibold" style={{ color: 'var(--color-gold, #D4AF37)' }}>
              {bumpedAccuracy}%
            </span>
            . +10 coins added to your balance.
          </p>
          <button
            onClick={() => setVisible(false)}
            className="px-5 py-2 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-gold, #D4AF37)',
              color: 'var(--color-navy, #1E3A5F)',
            }}
          >
            Nice 🙌
          </button>
        </div>
      )}

      {stage === 'retry' && (
        <div className="text-center py-2">
          <p className="text-4xl mb-2">💪</p>
          <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--color-navy, #1E3A5F)' }}>
            So close!
          </h3>
          <p className="text-sm text-gray-600 mb-5">
            You got {correctCount}/{questions.length} on {lockedSubject.name}. Come back tomorrow for
            another quick win.
          </p>
          <button
            onClick={() => setVisible(false)}
            className="px-5 py-2 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Got it
          </button>
        </div>
      )}
    </div>
  );
}
