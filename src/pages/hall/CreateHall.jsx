import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';

const EXAM_FOCUS_OPTIONS = [
  'SSC CGL', 'IBPS PO', 'UPSC CSE', 'NEET UG', 'JEE Main', 'GATE',
  'IELTS', 'TOEFL', 'Railways RRB', 'State PSC', 'Defence (NDA/CDS)', 'General Prep',
];

const EMOJI_OPTIONS = ['🏛️', '⚔️', '🦅', '🩺', '⚙️', '🌍', '🏦', '📚', '🎯', '🚀', '🦁', '👑'];

export default function CreateHall() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [examFocus, setExamFocus] = useState(EXAM_FOCUS_OPTIONS[0]);
  const [privacy, setPrivacy] = useState('public');
  const [emoji, setEmoji] = useState(EMOJI_OPTIONS[0]);

  if (!user) return null;

  const handleCreate = () => {
    if (!name.trim()) return;
    const newHallId = 'hall-' + Date.now();
    navigate(`/hall/${newHallId}`);
  };

  return (
    <AppLayout title="Create a Hall">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-6 sm:p-8">
        <h2 className="font-display text-2xl font-extrabold text-[var(--color-primary, #1E3A5F)] mb-1">Start Your Own Hall 🏛️</h2>
        <p className="text-slate-500 mb-6">Build a community around your exam goal.</p>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Hall Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. CGL Champions Tamil Nadu"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[var(--color-accent, #D4AF37)] focus:ring-2 focus:ring-[var(--color-accent, #D4AF37)]/30 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this Hall about? Who should join?"
              rows={3}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[var(--color-accent, #D4AF37)] focus:ring-2 focus:ring-[var(--color-accent, #D4AF37)]/30 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Primary Exam Focus</label>
            <select
              value={examFocus}
              onChange={(e) => setExamFocus(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[var(--color-accent, #D4AF37)] focus:ring-2 focus:ring-[var(--color-accent, #D4AF37)]/30 outline-none bg-white"
            >
              {EXAM_FOCUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Privacy</label>
            <div className="flex gap-3">
              <button
                onClick={() => setPrivacy('public')}
                className={`flex-1 py-3 rounded-2xl font-bold border-2 transition-all ${
                  privacy === 'public' ? 'bg-[var(--color-primary, #1E3A5F)] text-white border-[var(--color-primary, #1E3A5F)]' : 'border-slate-200 text-slate-500'
                }`}
              >
                🌐 Public
              </button>
              <button
                onClick={() => setPrivacy('invite')}
                className={`flex-1 py-3 rounded-2xl font-bold border-2 transition-all ${
                  privacy === 'invite' ? 'bg-[var(--color-primary, #1E3A5F)] text-white border-[var(--color-primary, #1E3A5F)]' : 'border-slate-200 text-slate-500'
                }`}
              >
                🔒 Invite-only
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Hall Icon</label>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`text-2xl p-2 rounded-2xl border-2 transition-all ${
                    emoji === e ? 'border-[var(--color-accent, #D4AF37)] bg-[#FDF6E3]' : 'border-slate-200'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="w-full py-3 rounded-2xl bg-[var(--color-accent, #D4AF37)] text-[var(--color-primary, #1E3A5F)] font-bold shadow-md hover:bg-[var(--color-accent-light, #E8C84A)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🏛️ Create Hall
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
