import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';

const SAMPLE_HALLS = [
  { id: 'hall-ssc-warriors', name: 'SSC Warriors', emoji: '⚔️', members: 1284, examFocus: 'SSC CGL' },
  { id: 'hall-bank-aspirants', name: 'Bank Aspirants Hub', emoji: '🏦', members: 956, examFocus: 'IBPS PO' },
  { id: 'hall-upsc-circle', name: 'UPSC Inner Circle', emoji: '🦅', members: 2103, examFocus: 'UPSC CSE' },
  { id: 'hall-neet-ninjas', name: 'NEET Ninjas', emoji: '🩺', members: 1740, examFocus: 'NEET UG' },
  { id: 'hall-gate-gurus', name: 'GATE Gurus', emoji: '⚙️', members: 612, examFocus: 'GATE CSE' },
  { id: 'hall-ielts-explorers', name: 'IELTS Explorers', emoji: '🌍', members: 438, examFocus: 'IELTS' },
];

export default function HallHub() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <AppLayout title="The Hall">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-[var(--color-primary, #1E3A5F)]">Find Your Tribe 🏛️</h2>
          <p className="text-slate-500 mt-1">Join a Hall, study together, and battle for glory.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/hall/leaderboard')}
            className="px-4 py-2 rounded-2xl border-2 border-[var(--color-primary, #1E3A5F)] text-[var(--color-primary, #1E3A5F)] font-bold hover:bg-[var(--color-primary, #1E3A5F)] hover:text-white transition-all"
          >
            🏆 Global Leaderboard
          </button>
          <button
            onClick={() => navigate('/hall/create')}
            className="px-4 py-2 rounded-2xl bg-[var(--color-accent, #D4AF37)] text-[var(--color-primary, #1E3A5F)] font-bold shadow-md hover:bg-[var(--color-accent-light, #E8C84A)] transition-all"
          >
            + Create a Hall
          </button>
        </div>
      </div>

      {SAMPLE_HALLS.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-10 text-center">
          <div className="text-5xl mb-3">🏛️</div>
          <p className="text-slate-600 mb-4">No Halls yet — be the first to start one!</p>
          <button
            onClick={() => navigate('/hall/create')}
            className="px-5 py-2 rounded-2xl bg-[var(--color-primary, #1E3A5F)] text-white font-bold"
          >
            Create a Hall →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SAMPLE_HALLS.map((hall) => (
            <div
              key={hall.id}
              onClick={() => navigate(`/hall/${hall.id}`)}
              className="bg-white rounded-2xl shadow-md p-5 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-4xl">{hall.emoji}</div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FDF6E3] text-[#7C2D12]">
                  {hall.examFocus}
                </span>
              </div>
              <h3 className="font-display font-extrabold text-lg text-[var(--color-primary, #1E3A5F)]">{hall.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{hall.members.toLocaleString()} members</p>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
