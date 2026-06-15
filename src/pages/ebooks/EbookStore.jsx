import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';

const SAMPLE_EBOOKS = [
  { id: 'eb1', title: 'Mastering Quantitative Aptitude', author: 'Dr. R. Krishnan', tag: 'SSC CGL', price: 'Free', rating: 4.5, emoji: '📘' },
  { id: 'eb2', title: 'Banking Awareness Made Simple', author: 'Anjali Mehra', tag: 'IBPS PO', price: '₹99', rating: 4.2, emoji: '📗' },
  { id: 'eb3', title: 'NEET Biology Quick Revision', author: 'Dr. S. Pillai', tag: 'NEET UG', price: 'Free', rating: 4.7, emoji: '📕' },
  { id: 'eb4', title: 'Indian Polity Essentials', author: 'M. Lakshmanan', tag: 'UPSC CSE', price: '₹149', rating: 4.6, emoji: '📙' },
  { id: 'eb5', title: 'GATE CS Algorithms Handbook', author: 'Prof. A. Verma', tag: 'GATE', price: 'Free', rating: 4.3, emoji: '📘' },
  { id: 'eb6', title: 'IELTS Writing Mastery', author: 'Sarah Thompson', tag: 'IELTS', price: '₹199', rating: 4.4, emoji: '📗' },
  { id: 'eb7', title: 'Reasoning Shortcuts & Tricks', author: 'Karthik Raj', tag: 'Railways RRB', price: 'Free', rating: 4.1, emoji: '📕' },
  { id: 'eb8', title: 'NDA Maths Formula Companion', author: 'Col. R. Singh (Retd.)', tag: 'NDA/CDS', price: 'Free', rating: 4.5, emoji: '📙' },
  { id: 'eb9', title: 'Current Affairs Yearly Digest 2026', author: 'TryIT Editorial', tag: 'General', price: 'Free', rating: 4.8, emoji: '📘' },
  { id: 'eb10', title: 'Pedagogy & Child Development', author: 'Dr. Meena Iyer', tag: 'CTET/TET', price: '₹79', rating: 4.3, emoji: '📗' },
  { id: 'eb11', title: 'English Grammar Foundations', author: 'James Wilson', tag: 'General', price: 'Free', rating: 4.0, emoji: '📕' },
  { id: 'eb12', title: 'Static GK Complete Guide', author: 'TryIT Editorial', tag: 'State PSC', price: '₹49', rating: 4.2, emoji: '📙' },
];

export default function EbookStore() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <AppLayout title="Ebook Store">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-[var(--color-primary, #1E3A5F)] mb-1">Ebook Store 📖</h2>
          <p className="text-slate-500">Read, learn, and collect ebooks for every exam.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/ebooks/my')}
            className="px-4 py-2 rounded-2xl border-2 border-[var(--color-primary, #1E3A5F)] text-[var(--color-primary, #1E3A5F)] font-bold hover:bg-[var(--color-primary, #1E3A5F)] hover:text-white transition-all"
          >
            📚 My Ebooks
          </button>
          {(user.role === 'mentor' || user.role === 'institution') && (
            <button
              onClick={() => navigate('/ebooks/upload')}
              className="px-4 py-2 rounded-2xl bg-[var(--color-accent, #D4AF37)] text-[var(--color-primary, #1E3A5F)] font-bold shadow-md hover:bg-[var(--color-accent-light, #E8C84A)] transition-all"
            >
              ⬆️ Upload
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {SAMPLE_EBOOKS.map((eb) => (
          <div
            key={eb.id}
            onClick={() => navigate(`/ebooks/${eb.id}`)}
            className="bg-white rounded-2xl shadow-md p-4 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-100"
          >
            <div className="w-full h-32 rounded-xl bg-gradient-to-br from-[var(--color-primary, #1E3A5F)] to-[var(--color-primary-dark, #0F2140)] flex items-center justify-center text-5xl mb-3">
              {eb.emoji}
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FDF6E3] text-[#7C2D12]">{eb.tag}</span>
            <h3 className="font-display font-extrabold text-sm text-[var(--color-primary, #1E3A5F)] mt-2 line-clamp-2">{eb.title}</h3>
            <p className="text-xs text-slate-400 mt-1">{eb.author}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-[var(--color-accent, #D4AF37)] font-bold">{'★'.repeat(Math.round(eb.rating))} {eb.rating}</span>
              <span className={`text-xs font-bold ${eb.price === 'Free' ? 'text-emerald-600' : 'text-[var(--color-primary, #1E3A5F)]'}`}>
                {eb.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
