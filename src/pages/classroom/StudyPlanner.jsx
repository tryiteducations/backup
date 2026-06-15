import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const SAMPLE_BLOCKS = [
  { id: 'b1', day: 'Mon', subject: 'Quantitative Aptitude', time: '6:00 AM', duration: 60, done: false },
  { id: 'b2', day: 'Mon', subject: 'English Comprehension', time: '8:00 PM', duration: 45, done: true },
  { id: 'b3', day: 'Tue', subject: 'General Awareness', time: '7:00 AM', duration: 30, done: false },
  { id: 'b4', day: 'Wed', subject: 'Reasoning', time: '6:30 AM', duration: 60, done: false },
  { id: 'b5', day: 'Thu', subject: 'Current Affairs', time: '8:00 PM', duration: 30, done: true },
  { id: 'b6', day: 'Fri', subject: 'Mock Test', time: '5:00 PM', duration: 120, done: false },
  { id: 'b7', day: 'Sat', subject: 'Revision', time: '9:00 AM', duration: 90, done: false },
];

export default function StudyPlanner() {
  const { user } = useAuth();
  const [blocks, setBlocks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: '', day: 'Mon', time: '', duration: 30 });

  const storageKey = user ? `studyBlocks_${user.email}` : null;

  useEffect(() => {
    if (!storageKey) return;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setBlocks(JSON.parse(stored));
    } else {
      setBlocks(SAMPLE_BLOCKS);
      localStorage.setItem(storageKey, JSON.stringify(SAMPLE_BLOCKS));
    }
  }, [storageKey]);

  if (!user) return null;

  const persist = (next) => {
    setBlocks(next);
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const toggleDone = (id) => {
    persist(blocks.map((b) => (b.id === id ? { ...b, done: !b.done } : b)));
  };

  const handleAdd = () => {
    if (!form.subject.trim() || !form.time.trim()) return;
    const newBlock = { id: 'b' + Date.now(), ...form, done: false };
    persist([...blocks, newBlock]);
    setForm({ subject: '', day: 'Mon', time: '', duration: 30 });
    setShowForm(false);
  };

  return (
    <AppLayout title="Study Planner">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-[var(--color-primary, #1E3A5F)] mb-1">Weekly Study Plan 🗓️</h2>
          <p className="text-slate-500">Build a consistent routine — small steps, big results.</p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="px-4 py-2 rounded-2xl bg-[var(--color-accent, #D4AF37)] text-[var(--color-primary, #1E3A5F)] font-bold shadow-md hover:bg-[var(--color-accent-light, #E8C84A)] transition-all"
        >
          + Add Study Block
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <h3 className="font-display font-extrabold text-[var(--color-primary, #1E3A5F)] mb-4">New Study Block</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="px-4 py-2 rounded-2xl border border-slate-200 focus:border-[var(--color-accent, #D4AF37)] outline-none sm:col-span-2"
            />
            <select
              value={form.day}
              onChange={(e) => setForm({ ...form, day: e.target.value })}
              className="px-4 py-2 rounded-2xl border border-slate-200 focus:border-[var(--color-accent, #D4AF37)] outline-none bg-white"
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="e.g. 6:00 AM"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="px-4 py-2 rounded-2xl border border-slate-200 focus:border-[var(--color-accent, #D4AF37)] outline-none"
            />
          </div>
          <div className="flex items-center gap-3 mt-3">
            <label className="text-sm font-bold text-slate-600">Duration (min)</label>
            <input
              type="number"
              min="10"
              step="5"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
              className="w-24 px-3 py-2 rounded-2xl border border-slate-200 focus:border-[var(--color-accent, #D4AF37)] outline-none"
            />
            <button
              onClick={handleAdd}
              className="ml-auto px-5 py-2 rounded-2xl bg-[var(--color-primary, #1E3A5F)] text-white font-bold hover:bg-[var(--color-primary-dark, #0F2140)] transition-all"
            >
              Add Block
            </button>
          </div>
        </div>
      )}

      {/* Weekly grid */}
      <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
        {DAYS.map((day) => {
          const dayBlocks = blocks.filter((b) => b.day === day);
          return (
            <div key={day} className="bg-white rounded-2xl shadow-md p-3 min-h-[160px]">
              <h4 className="font-display font-extrabold text-[var(--color-primary, #1E3A5F)] text-sm mb-3 text-center">{day}</h4>
              {dayBlocks.length === 0 ? (
                <p className="text-xs text-slate-400 text-center mt-6">No sessions</p>
              ) : (
                <div className="space-y-2">
                  {dayBlocks.map((b) => (
                    <div
                      key={b.id}
                      className={`rounded-xl p-2 text-xs ${b.done ? 'bg-emerald-50 text-emerald-700' : 'bg-[#FDF6E3] text-[#7C2D12]'}`}
                    >
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={b.done}
                          onChange={() => toggleDone(b.id)}
                          className="mt-0.5 accent-[var(--color-accent, #D4AF37)]"
                        />
                        <div>
                          <p className="font-bold">{b.subject}</p>
                          <p className="opacity-70">{b.time} · {b.duration}m</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
