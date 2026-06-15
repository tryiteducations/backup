import React, { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';

const SAMPLE_TOURNAMENTS = [
  { id: 't1', name: 'SSC CGL Mega Mock Marathon', exam: 'SSC CGL', prize: 'Top 100 get exclusive "Champion" badge 🏅', start: '2026-06-20', end: '2026-06-25', participants: 4820, status: 'upcoming' },
  { id: 't2', name: 'Banking Awareness Sprint', exam: 'IBPS PO', prize: 'Top 50 featured on Global Leaderboard', start: '2026-06-15', end: '2026-06-18', participants: 2150, status: 'live' },
  { id: 't3', name: 'NEET Biology Blitz', exam: 'NEET UG', prize: 'Top 200 get "Bio Champion" badge 🧬', start: '2026-06-10', end: '2026-06-13', participants: 6310, status: 'live' },
  { id: 't4', name: 'UPSC Prelims Power Hour', exam: 'UPSC CSE', prize: 'Top 100 get exclusive badge + certificate', start: '2026-07-01', end: '2026-07-05', participants: 1980, status: 'upcoming' },
  { id: 't5', name: 'GATE Quant Quest', exam: 'GATE', prize: 'Top 50 get "Quant Master" badge', start: '2026-05-20', end: '2026-05-25', participants: 1240, status: 'past' },
  { id: 't6', name: 'IELTS Vocabulary Vault', exam: 'IELTS', prize: 'Top 100 featured profile spotlight', start: '2026-05-01', end: '2026-05-10', participants: 870, status: 'past' },
];

const TABS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'live', label: 'Live' },
  { id: 'past', label: 'Past' },
];

export default function Tournaments() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('live');
  const [joined, setJoined] = useState({});

  if (!user) return null;

  const filtered = SAMPLE_TOURNAMENTS.filter((t) => t.status === activeTab);

  const toggleJoin = (id) => {
    setJoined((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  return (
    <AppLayout title="Tournaments">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-extrabold text-[var(--color-primary, #1E3A5F)] mb-1">🏆 Tournaments</h2>
        <p className="text-slate-500">Compete, climb the ranks, and earn exclusive badges — entry is always free.</p>
      </div>

      <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1 shadow-md w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id ? 'bg-[var(--color-primary, #1E3A5F)] text-white' : 'text-slate-500 hover:text-[var(--color-primary, #1E3A5F)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-10 text-center">
          <div className="text-5xl mb-3">🗓️</div>
          <p className="text-slate-500">No {activeTab} tournaments right now — check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filtered.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl shadow-md p-5 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FDF6E3] text-[#7C2D12]">{t.exam}</span>
                {t.status === 'live' && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> LIVE
                  </span>
                )}
              </div>
              <h3 className="font-display font-extrabold text-lg text-[var(--color-primary, #1E3A5F)] mb-1">{t.name}</h3>
              <p className="text-sm text-slate-500 mb-3">🎁 {t.prize}</p>
              <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                <span>📅 {formatDate(t.start)} – {formatDate(t.end)}</span>
                <span>👥 {t.participants.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600">Entry: Free 🎉</span>
                {t.status !== 'past' ? (
                  <button
                    onClick={() => toggleJoin(t.id)}
                    className={`px-4 py-2 rounded-2xl font-bold text-sm transition-all ${
                      joined[t.id]
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-[var(--color-accent, #D4AF37)] text-[var(--color-primary, #1E3A5F)] hover:bg-[var(--color-accent-light, #E8C84A)]'
                    }`}
                  >
                    {joined[t.id] ? 'Joined ✓' : 'Join'}
                  </button>
                ) : (
                  <span className="text-xs font-bold text-slate-400 px-4 py-2 rounded-2xl bg-slate-50">Ended</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
