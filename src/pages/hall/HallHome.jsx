import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';

const HALL_NAMES = {
  'hall-ssc-warriors': { name: 'SSC Warriors', emoji: '⚔️', examFocus: 'SSC CGL' },
  'hall-bank-aspirants': { name: 'Bank Aspirants Hub', emoji: '🏦', examFocus: 'IBPS PO' },
  'hall-upsc-circle': { name: 'UPSC Inner Circle', emoji: '🦅', examFocus: 'UPSC CSE' },
  'hall-neet-ninjas': { name: 'NEET Ninjas', emoji: '🩺', examFocus: 'NEET UG' },
  'hall-gate-gurus': { name: 'GATE Gurus', emoji: '⚙️', examFocus: 'GATE CSE' },
  'hall-ielts-explorers': { name: 'IELTS Explorers', emoji: '🌍', examFocus: 'IELTS' },
};

const SAMPLE_MEMBERS = [
  { name: 'Aarav Sharma', initials: 'AS', level: 8, levelTitle: 'The Gold King', emoji: '🏆', coinsThisWeek: 1240 },
  { name: 'Priya Nair', initials: 'PN', level: 7, levelTitle: 'Thalavan', emoji: '👑', coinsThisWeek: 980 },
  { name: 'Rohan Mehta', initials: 'RM', level: 6, levelTitle: 'Baahuveer', emoji: '🦁', coinsThisWeek: 845 },
  { name: 'Sneha Iyer', initials: 'SI', level: 5, levelTitle: 'The Grinder', emoji: '💪', coinsThisWeek: 712 },
  { name: 'Karthik Raj', initials: 'KR', level: 5, levelTitle: 'The Grinder', emoji: '💪', coinsThisWeek: 690 },
  { name: 'Divya Pillai', initials: 'DP', level: 4, levelTitle: 'The Gold Miner', emoji: '⛏️', coinsThisWeek: 540 },
  { name: 'Arjun Verma', initials: 'AV', level: 3, levelTitle: 'The Riser', emoji: '📈', coinsThisWeek: 410 },
];

const SAMPLE_ACTIVITY = [
  { who: 'Aarav Sharma', what: 'completed a Mock Test scoring 92%', time: '2h ago', emoji: '📝' },
  { who: 'Priya Nair', what: 'won a Hall Battle 🔥', time: '4h ago', emoji: '⚔️' },
  { who: 'Sneha Iyer', what: 'reached Level 5 — The Grinder 💪', time: '6h ago', emoji: '🎉' },
  { who: 'Karthik Raj', what: 'answered 3 questions in Guru Hub', time: '1d ago', emoji: '🙋' },
  { who: 'Rohan Mehta', what: 'maintained a 15-day streak 🔥', time: '1d ago', emoji: '🔥' },
];

export default function HallHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { hallId } = useParams();
  if (!user) return null;

  const hall = HALL_NAMES[hallId] || { name: 'Unknown Hall', emoji: '🏛️', examFocus: 'General' };
  const ranked = [...SAMPLE_MEMBERS].sort((a, b) => b.coinsThisWeek - a.coinsThisWeek);

  return (
    <AppLayout title={hall.name}>
      <div className="bg-gradient-to-r from-[var(--color-primary, #1E3A5F)] to-[var(--color-primary-dark, #0F2140)] rounded-2xl shadow-md p-6 mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{hall.emoji}</div>
          <div>
            <h2 className="font-display text-2xl font-extrabold text-white">{hall.name}</h2>
            <p className="text-[var(--color-accent-light, #E8C84A)] text-sm mt-1">Focus: {hall.examFocus} · {SAMPLE_MEMBERS.length} members</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/hall/${hallId}/battle`)}
          className="px-6 py-3 rounded-2xl bg-[var(--color-accent, #D4AF37)] text-[var(--color-primary, #1E3A5F)] font-bold shadow-md hover:bg-[var(--color-accent-light, #E8C84A)] transition-all"
        >
          ⚔️ Start Battle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Members */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-5">
          <h3 className="font-display font-extrabold text-[var(--color-primary, #1E3A5F)] mb-4">Members</h3>
          <div className="space-y-3">
            {SAMPLE_MEMBERS.map((m) => (
              <div key={m.name} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary, #1E3A5F)] text-white flex items-center justify-center font-bold text-sm">
                  {m.initials}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-slate-700">{m.name}</p>
                  <p className="text-xs text-slate-400">{m.emoji} {m.levelTitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-5">
          <h3 className="font-display font-extrabold text-[var(--color-primary, #1E3A5F)] mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {SAMPLE_ACTIVITY.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className="text-2xl">{a.emoji}</div>
                <div>
                  <p className="text-sm text-slate-700">
                    <span className="font-bold">{a.who}</span> {a.what}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hall Leaderboard */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-5">
          <h3 className="font-display font-extrabold text-[var(--color-primary, #1E3A5F)] mb-4">Hall Leaderboard (This Week)</h3>
          <div className="space-y-2">
            {ranked.map((m, i) => (
              <div key={m.name} className={`flex items-center justify-between p-2 rounded-xl ${i === 0 ? 'bg-[#FDF6E3]' : ''}`}>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[var(--color-primary, #1E3A5F)] w-6">{i + 1}</span>
                  <span className="text-sm font-bold text-slate-700">{m.name}</span>
                </div>
                <span className="text-sm font-bold text-[var(--color-accent, #D4AF37)]">{m.coinsThisWeek} 🪙</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
