import React, { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';

// TODO: replace with Supabase study_materials table query once populated
const SAMPLE_MATERIALS = [
  { id: 'm1', title: 'SSC CGL Maths Shortcuts', subject: 'Quantitative Aptitude', exam: 'SSC CGL', size: '4.2 MB', tier: 'Free' },
  { id: 'm2', title: 'IBPS PO Previous Year Papers (2020-25)', subject: 'General', exam: 'IBPS PO', size: '12.8 MB', tier: 'Premium' },
  { id: 'm3', title: 'NEET Biology NCERT Summary', subject: 'Biology', exam: 'NEET UG', size: '6.5 MB', tier: 'Free' },
  { id: 'm4', title: 'UPSC Prelims Polity Notes', subject: 'Polity', exam: 'UPSC CSE', size: '9.1 MB', tier: 'Premium' },
  { id: 'm5', title: 'GATE CSE Algorithms Crash Course', subject: 'Computer Science', exam: 'GATE', size: '7.4 MB', tier: 'Free' },
  { id: 'm6', title: 'IELTS Writing Task 2 Templates', subject: 'English', exam: 'IELTS', size: '2.1 MB', tier: 'Free' },
  { id: 'm7', title: 'Railways RRB Reasoning Practice Set', subject: 'Reasoning', exam: 'Railways RRB', size: '5.3 MB', tier: 'Premium' },
  { id: 'm8', title: 'Defence NDA Maths Formula Book', subject: 'Mathematics', exam: 'NDA/CDS', size: '3.6 MB', tier: 'Free' },
  { id: 'm9', title: 'State PSC Current Affairs Digest', subject: 'General Awareness', exam: 'State PSC', size: '8.0 MB', tier: 'Premium' },
  { id: 'm10', title: 'Teaching Exams Pedagogy Notes', subject: 'Pedagogy', exam: 'CTET/TET', size: '4.9 MB', tier: 'Free' },
];

export default function PDFLibrary() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [examFilter, setExamFilter] = useState('All Exams');

  if (!user) return null;

  const examOptions = ['All Exams', ...new Set(SAMPLE_MATERIALS.map((m) => m.exam))];

  const filtered = SAMPLE_MATERIALS.filter((m) => {
    const searchMatch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase());
    const examMatch = examFilter === 'All Exams' || m.exam === examFilter;
    return searchMatch && examMatch;
  });

  return (
    <AppLayout title="PDF Library">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-[var(--color-primary, #1E3A5F)] mb-1">PDF Library 📚</h2>
          <p className="text-slate-500">Notes, previous papers, and study material — free or premium.</p>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search materials..."
            className="px-4 py-2 rounded-2xl border border-slate-200 focus:border-[var(--color-accent, #D4AF37)] outline-none w-48"
          />
          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value)}
            className="px-3 py-2 rounded-2xl border border-slate-200 text-sm bg-white focus:border-[var(--color-accent, #D4AF37)] outline-none"
          >
            {examOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-10 text-center">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-slate-500">No materials found — try a different search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl shadow-md p-5 border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">📄</span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    m.tier === 'Premium' ? 'bg-[#3B2A6B]/10 text-[#3B2A6B]' : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {m.tier === 'Premium' ? '⭐ Premium' : '🎉 Free'}
                </span>
              </div>
              <h3 className="font-display font-extrabold text-[var(--color-primary, #1E3A5F)] mb-1">{m.title}</h3>
              <p className="text-sm text-slate-500 mb-3">{m.subject} · {m.exam}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{m.size}</span>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-2xl border-2 border-[var(--color-primary, #1E3A5F)] text-[var(--color-primary, #1E3A5F)] text-sm font-bold hover:bg-[var(--color-primary, #1E3A5F)] hover:text-white transition-all">
                    View
                  </button>
                  <button className="px-3 py-1.5 rounded-2xl bg-[var(--color-accent, #D4AF37)] text-[var(--color-primary, #1E3A5F)] text-sm font-bold hover:bg-[var(--color-accent-light, #E8C84A)] transition-all">
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
