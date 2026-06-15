import React, { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';

const TAG_OPTIONS = [
  'SSC CGL', 'IBPS PO', 'UPSC CSE', 'NEET UG', 'JEE Main', 'GATE',
  'IELTS', 'TOEFL', 'Railways RRB', 'State PSC', 'NDA/CDS', 'CTET/TET', 'General',
];

export default function UploadEbook() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  if (!user) return null;

  const toggleTag = (tag) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleSubmit = () => {
    if (!title.trim() || !author.trim() || tags.length === 0) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AppLayout title="Upload Ebook">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-10 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="font-display text-2xl font-extrabold text-[var(--color-primary, #1E3A5F)] mb-2">Submitted!</h2>
          <p className="text-slate-500">
            Your ebook <span className="font-bold text-slate-700">"{title}"</span> is under review.
            We'll notify you once it's live in the Ebook Store.
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Upload Ebook">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-6 sm:p-8">
        <h2 className="font-display text-2xl font-extrabold text-[var(--color-primary, #1E3A5F)] mb-1">Share Your Ebook ⬆️</h2>
        <p className="text-slate-500 mb-6">Help fellow aspirants — submit for review and reach thousands of learners.</p>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mastering Quantitative Aptitude"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[var(--color-accent, #D4AF37)] focus:ring-2 focus:ring-[var(--color-accent, #D4AF37)]/30 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[var(--color-accent, #D4AF37)] focus:ring-2 focus:ring-[var(--color-accent, #D4AF37)]/30 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Subject / Exam Tags</label>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-all ${
                    tags.includes(tag) ? 'bg-[var(--color-primary, #1E3A5F)] text-white border-[var(--color-primary, #1E3A5F)]' : 'border-slate-200 text-slate-500'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will readers learn from this ebook?"
              rows={4}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[var(--color-accent, #D4AF37)] focus:ring-2 focus:ring-[var(--color-accent, #D4AF37)]/30 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Price (₹) — set 0 for Free</label>
            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-32 px-4 py-3 rounded-2xl border border-slate-200 focus:border-[var(--color-accent, #D4AF37)] focus:ring-2 focus:ring-[var(--color-accent, #D4AF37)]/30 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Ebook File (PDF/EPUB)</label>
              <input
                type="file"
                className="w-full text-sm px-4 py-3 rounded-2xl border border-slate-200 bg-white file:mr-3 file:px-3 file:py-1.5 file:rounded-xl file:border-0 file:bg-[#FDF6E3] file:text-[#7C2D12] file:font-bold"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                className="w-full text-sm px-4 py-3 rounded-2xl border border-slate-200 bg-white file:mr-3 file:px-3 file:py-1.5 file:rounded-xl file:border-0 file:bg-[#FDF6E3] file:text-[#7C2D12] file:font-bold"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !author.trim() || tags.length === 0}
            className="w-full py-3 rounded-2xl bg-[var(--color-accent, #D4AF37)] text-[var(--color-primary, #1E3A5F)] font-bold shadow-md hover:bg-[var(--color-accent-light, #E8C84A)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit for Review
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
