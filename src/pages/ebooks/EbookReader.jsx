import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EBOOK_INFO = {
  eb1: { title: 'Mastering Quantitative Aptitude', subject: 'Quantitative Aptitude' },
  eb2: { title: 'Banking Awareness Made Simple', subject: 'Banking Awareness' },
  eb3: { title: 'NEET Biology Quick Revision', subject: 'Biology' },
  eb4: { title: 'Indian Polity Essentials', subject: 'Polity' },
  eb5: { title: 'GATE CS Algorithms Handbook', subject: 'Computer Science' },
  eb6: { title: 'IELTS Writing Mastery', subject: 'English Writing' },
  eb7: { title: 'Reasoning Shortcuts & Tricks', subject: 'Reasoning' },
  eb8: { title: 'NDA Maths Formula Companion', subject: 'Mathematics' },
  eb9: { title: 'Current Affairs Yearly Digest 2026', subject: 'Current Affairs' },
  eb10: { title: 'Pedagogy & Child Development', subject: 'Pedagogy' },
  eb11: { title: 'English Grammar Foundations', subject: 'English Grammar' },
  eb12: { title: 'Static GK Complete Guide', subject: 'General Knowledge' },
};

// TODO: replace with real ebook content fetched from storage once populated
const TOTAL_PAGES = 12;

const buildPageContent = (subject, page) => `Chapter ${Math.ceil(page / 3)} — ${subject} Fundamentals

This page covers core concepts in ${subject} relevant to your exam preparation. Focus on understanding the underlying principles before moving to practice questions.

Key points to remember:
- Concept clarity matters more than memorization
- Practice previous year questions regularly
- Revisit difficult topics every few days using spaced repetition
- Take short breaks to retain information better

(Page ${page} of ${TOTAL_PAGES} — sample placeholder content for ${subject})`;

const FONT_SIZES = ['text-sm', 'text-base', 'text-lg', 'text-xl'];

export default function EbookReader() {
  const { ebookId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [fontIdx, setFontIdx] = useState(1);

  const ebook = EBOOK_INFO[ebookId] || { title: 'Untitled Ebook', subject: 'General' };
  const progress = Math.round((page / TOTAL_PAGES) * 100);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(TOTAL_PAGES, p + 1));

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <div className="bg-[var(--color-primary, #1E3A5F)] text-white px-4 sm:px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/ebooks/my')}
          className="flex items-center gap-2 text-sm font-bold hover:text-[var(--color-accent-light, #E8C84A)] transition-all"
        >
          ✕ Exit to Library
        </button>
        <div className="text-center">
          <p className="font-display font-extrabold text-sm sm:text-base">{ebook.title}</p>
          <p className="text-xs text-[var(--color-accent-light, #E8C84A)]">{ebook.subject}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFontIdx((i) => Math.max(0, i - 1))}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 font-bold text-sm"
          >
            A-
          </button>
          <button
            onClick={() => setFontIdx((i) => Math.min(FONT_SIZES.length - 1, i + 1))}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 font-bold text-sm"
          >
            A+
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-slate-200">
        <div className="h-full bg-[var(--color-accent, #D4AF37)] transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* Page content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-md p-8 sm:p-10 min-h-[400px] whitespace-pre-line">
          <p className={`text-slate-700 leading-relaxed ${FONT_SIZES[fontIdx]}`}>
            {buildPageContent(ebook.subject, page)}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between bg-white border-t border-slate-100">
        <button
          onClick={goPrev}
          disabled={page === 1}
          className="px-5 py-2 rounded-2xl border-2 border-[var(--color-primary, #1E3A5F)] text-[var(--color-primary, #1E3A5F)] font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-primary, #1E3A5F)] hover:text-white transition-all"
        >
          ← Prev
        </button>
        <span className="text-sm font-bold text-slate-500">
          Page {page} of {TOTAL_PAGES} · {progress}%
        </span>
        <button
          onClick={goNext}
          disabled={page === TOTAL_PAGES}
          className="px-5 py-2 rounded-2xl bg-[var(--color-accent, #D4AF37)] text-[var(--color-primary, #1E3A5F)] font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-accent-light, #E8C84A)] transition-all"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
