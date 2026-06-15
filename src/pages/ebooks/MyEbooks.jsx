import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';

// Sample saved ebooks — set to [] to preview the empty-state
const SAMPLE_MY_EBOOKS = [
  { id: 'eb1', title: 'Mastering Quantitative Aptitude', author: 'Dr. R. Krishnan', tag: 'SSC CGL', emoji: '📘', progress: 62 },
  { id: 'eb3', title: 'NEET Biology Quick Revision', author: 'Dr. S. Pillai', tag: 'NEET UG', emoji: '📕', progress: 28 },
  { id: 'eb9', title: 'Current Affairs Yearly Digest 2026', author: 'TryIT Editorial', tag: 'General', emoji: '📘', progress: 90 },
];

export default function MyEbooks() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <AppLayout title="My Ebooks">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-extrabold text-[var(--color-primary, #1E3A5F)] mb-1">My Ebooks 📚</h2>
        <p className="text-slate-500">Pick up right where you left off.</p>
      </div>

      {SAMPLE_MY_EBOOKS.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-10 text-center">
          <div className="text-5xl mb-3">📖</div>
          <p className="text-slate-600 mb-4">No ebooks yet — browse the store to find your next read!</p>
          <button
            onClick={() => navigate('/ebooks')}
            className="px-5 py-2 rounded-2xl bg-[var(--color-primary, #1E3A5F)] text-white font-bold"
          >
            Browse Store →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SAMPLE_MY_EBOOKS.map((eb) => (
            <div
              key={eb.id}
              onClick={() => navigate(`/ebooks/${eb.id}`)}
              className="bg-white rounded-2xl shadow-md p-5 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-100"
            >
              <div className="flex gap-4">
                <div className="w-16 h-20 rounded-xl bg-gradient-to-br from-[var(--color-primary, #1E3A5F)] to-[var(--color-primary-dark, #0F2140)] flex items-center justify-center text-3xl flex-shrink-0">
                  {eb.emoji}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FDF6E3] text-[#7C2D12]">{eb.tag}</span>
                  <h3 className="font-display font-extrabold text-sm text-[var(--color-primary, #1E3A5F)] mt-1">{eb.title}</h3>
                  <p className="text-xs text-slate-400">{eb.author}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Progress</span>
                  <span className="font-bold text-[var(--color-accent, #D4AF37)]">{eb.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--color-accent, #D4AF37)] rounded-full" style={{ width: `${eb.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
