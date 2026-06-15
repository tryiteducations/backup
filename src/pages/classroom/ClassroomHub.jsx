import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';

const HUB_CARDS = [
  { id: 'planner', title: 'Study Planner', desc: 'Plan your week, track sessions, build consistency.', emoji: '🗓️', color: 'from-[var(--color-primary, #1E3A5F)] to-[var(--color-primary-dark, #0F2140)]', path: '/classroom/planner' },
  { id: 'pdf', title: 'PDF Library', desc: 'Notes, previous papers, and study material — all in one place.', emoji: '📚', color: 'from-[#064E3B] to-[#0B6B53]', path: '/classroom/pdf' },
  { id: 'ebooks', title: 'Ebook Store', desc: 'Browse, read, and collect ebooks for every exam.', emoji: '📖', color: 'from-[#7C2D12] to-[#9A3F1F]', path: '/ebooks' },
];

export default function ClassroomHub() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [todaysPlan, setTodaysPlan] = useState([]);

  useEffect(() => {
    if (!user) return;
    try {
      const stored = JSON.parse(localStorage.getItem(`studyBlocks_${user.email}`) || '[]');
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = days[new Date().getDay()];
      setTodaysPlan(stored.filter((b) => b.day === today).slice(0, 3));
    } catch {
      setTodaysPlan([]);
    }
  }, [user]);

  if (!user) return null;

  return (
    <AppLayout title="Classroom">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-extrabold text-[var(--color-primary, #1E3A5F)] mb-1">Your Classroom 🎓</h2>
        <p className="text-slate-500">Plan, study, and read — everything you need to prep.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {HUB_CARDS.map((c) => (
          <div
            key={c.id}
            onClick={() => navigate(c.path)}
            className={`bg-gradient-to-br ${c.color} rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all text-white`}
          >
            <div className="text-4xl mb-3">{c.emoji}</div>
            <h3 className="font-display font-extrabold text-lg mb-1">{c.title}</h3>
            <p className="text-sm text-white/80">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-extrabold text-[var(--color-primary, #1E3A5F)]">Today's Plan</h3>
          <button onClick={() => navigate('/classroom/planner')} className="text-sm font-bold text-[var(--color-primary, #1E3A5F)] hover:text-[var(--color-accent, #D4AF37)]">
            Open Planner →
          </button>
        </div>

        {todaysPlan.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-2">🗓️</div>
            <p className="text-slate-500 mb-4">No study blocks for today — plan your day!</p>
            <button onClick={() => navigate('/classroom/planner')} className="px-5 py-2 rounded-2xl bg-[var(--color-accent, #D4AF37)] text-[var(--color-primary, #1E3A5F)] font-bold">
              + Add Study Block
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {todaysPlan.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAFC]">
                <div>
                  <p className="font-bold text-slate-700">{b.subject}</p>
                  <p className="text-xs text-slate-400">{b.time} · {b.duration} min</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${b.done ? 'bg-emerald-100 text-emerald-700' : 'bg-[#FDF6E3] text-[#7C2D12]'}`}>
                  {b.done ? 'Done ✓' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
