import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// TODO: replace with Supabase questions table query once populated
const SAMPLE_QUESTIONS = [
  { id: 'q1', question: 'Which article of the Indian Constitution abolishes untouchability?', options: ['Article 14', 'Article 17', 'Article 21', 'Article 32'], correct_answer: 'Article 17' },
  { id: 'q2', question: 'What is the value of 15% of 240?', options: ['32', '36', '40', '24'], correct_answer: '36' },
  { id: 'q3', question: 'The "Quit India" movement was launched in which year?', options: ['1940', '1942', '1945', '1939'], correct_answer: '1942' },
  { id: 'q4', question: 'Synonym of "Benevolent" is:', options: ['Cruel', 'Kind', 'Selfish', 'Lazy'], correct_answer: 'Kind' },
  { id: 'q5', question: "Which gas is most abundant in Earth's atmosphere?", options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'], correct_answer: 'Nitrogen' },
];

const OPPONENT = { name: 'Karthik R.', initials: 'KR', emoji: '🦁' };

export default function BattleArena() {
  const { user, addCoins } = useAuth();
  const navigate = useNavigate();
  const { hallId } = useParams();

  const [currentQ, setCurrentQ] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const [oppAnswered, setOppAnswered] = useState(false);

  const total = SAMPLE_QUESTIONS.length;
  const q = SAMPLE_QUESTIONS[currentQ];

  useEffect(() => {
    setSelected(null);
    setAnswered(false);
    setOppAnswered(false);
    // Simulate opponent answering
    const t = setTimeout(() => {
      const oppCorrect = Math.random() < 0.6;
      if (oppCorrect) setOppScore((s) => s + 1);
      setOppAnswered(true);
    }, 1200 + Math.random() * 800);
    return () => clearTimeout(t);
  }, [currentQ]);

  if (!user) return null;

  const handleAnswer = (opt) => {
    if (answered) return;
    setSelected(opt);
    setAnswered(true);
    if (opt === q.correct_answer) setMyScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentQ + 1 < total) {
      setCurrentQ((c) => c + 1);
    } else {
      const won = myScore >= oppScore;
      const coins = won ? 60 + Math.floor(Math.random() * 41) : 20 + Math.floor(Math.random() * 21);
      if (typeof addCoins === 'function') addCoins(coins);
      setFinished(true);
    }
  };

  if (finished) {
    const won = myScore >= oppScore;
    const coins = won ? 60 : 30;
    return (
      <div className="min-h-screen bg-[var(--color-primary-dark, #0F2140)] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">{won ? '🏆' : '😤'}</div>
          <h2 className="font-display text-3xl font-extrabold text-[var(--color-primary, #1E3A5F)] mb-2">
            {won ? 'Victory!' : 'So Close!'}
          </h2>
          <p className="text-slate-500 mb-6">
            You scored {myScore}/{total} · {OPPONENT.name} scored {oppScore}/{total}
          </p>
          <div className="bg-[#FDF6E3] rounded-2xl p-4 mb-6">
            <p className="text-sm text-slate-600">Coins Earned</p>
            <p className="text-3xl font-extrabold text-[var(--color-accent, #D4AF37)]">+{coins} 🪙</p>
          </div>
          <button
            onClick={() => navigate(`/hall/${hallId}`)}
            className="w-full py-3 rounded-2xl bg-[var(--color-primary, #1E3A5F)] text-white font-bold hover:bg-[var(--color-primary-dark, #0F2140)] transition-all"
          >
            ⬅ Back to Hall
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-primary-dark, #0F2140)] p-4 sm:p-8 flex flex-col">
      {/* Top scoreboard */}
      <div className="flex items-center justify-between max-w-3xl w-full mx-auto mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[var(--color-accent, #D4AF37)] text-[var(--color-primary, #1E3A5F)] flex items-center justify-center font-extrabold">
            {user.initials || 'YOU'}
          </div>
          <div>
            <p className="text-white font-bold">You</p>
            <p className="text-[var(--color-accent-light, #E8C84A)] text-sm">{myScore} pts</p>
          </div>
        </div>
        <div className="text-white font-display font-extrabold text-xl">VS</div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-white font-bold">{OPPONENT.name}</p>
            <p className="text-[var(--color-accent-light, #E8C84A)] text-sm">{oppScore} pts</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#7C2D12] text-white flex items-center justify-center font-extrabold">
            {OPPONENT.initials}
          </div>
        </div>
      </div>

      {/* Score bars */}
      <div className="max-w-3xl w-full mx-auto mb-8 space-y-2">
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-[var(--color-accent, #D4AF37)] transition-all duration-500" style={{ width: `${(myScore / total) * 100}%` }} />
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-[#7C2D12] transition-all duration-500" style={{ width: `${(oppScore / total) * 100}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="max-w-3xl w-full mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex-1">
        <p className="text-xs font-bold text-[var(--color-accent, #D4AF37)] mb-2">Question {currentQ + 1} of {total}</p>
        <h3 className="font-display text-xl font-extrabold text-[var(--color-primary, #1E3A5F)] mb-6">{q.question}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {q.options.map((opt) => {
            let style = 'border-slate-200 hover:border-[var(--color-accent, #D4AF37)]';
            if (answered) {
              if (opt === q.correct_answer) style = 'border-emerald-500 bg-emerald-50';
              else if (opt === selected) style = 'border-red-400 bg-red-50';
              else style = 'border-slate-200 opacity-60';
            }
            return (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                className={`text-left px-4 py-3 rounded-2xl border-2 font-semibold text-slate-700 transition-all ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {oppAnswered ? `${OPPONENT.name} has answered.` : `${OPPONENT.name} is thinking...`}
            </p>
            <button
              onClick={handleNext}
              className="px-6 py-2 rounded-2xl bg-[var(--color-primary, #1E3A5F)] text-white font-bold hover:bg-[var(--color-primary-dark, #0F2140)] transition-all"
            >
              {currentQ + 1 < total ? 'Next →' : 'Finish 🏁'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
