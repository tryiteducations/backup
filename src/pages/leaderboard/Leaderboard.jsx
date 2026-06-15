import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';

const STATES = ['All States', 'Tamil Nadu', 'Maharashtra', 'Kerala', 'Karnataka', 'Delhi', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal'];

const SAMPLE_RANKINGS = [
  { rank: 1, name: 'Aarav Sharma', initials: 'AS', state: 'Maharashtra', exam: 'SSC CGL', score: 12840, levelEmoji: '🏆', levelTitle: 'The Gold King' },
  { rank: 2, name: 'Priya Nair', initials: 'PN', state: 'Kerala', exam: 'IBPS PO', score: 11920, levelEmoji: '👑', levelTitle: 'Thalavan' },
  { rank: 3, name: 'Rohan Mehta', initials: 'RM', state: 'Gujarat', exam: 'UPSC CSE', score: 11430, levelEmoji: '👑', levelTitle: 'Thalavan' },
  { rank: 4, name: 'Sneha Iyer', initials: 'SI', state: 'Tamil Nadu', exam: 'NEET UG', score: 9870, levelEmoji: '🦁', levelTitle: 'Baahuveer' },
  { rank: 5, name: 'Karthik Raj', initials: 'KR', state: 'Tamil Nadu', exam: 'SSC CGL', score: 9210, levelEmoji: '🦁', levelTitle: 'Baahuveer' },
  { rank: 6, name: 'Divya Pillai', initials: 'DP', state: 'Karnataka', exam: 'GATE', score: 8430, levelEmoji: '💪', levelTitle: 'The Grinder' },
  { rank: 7, name: 'Arjun Verma', initials: 'AV', state: 'Delhi', exam: 'IELTS', score: 7650, levelEmoji: '💪', levelTitle: 'The Grinder' },
  { rank: 8, name: 'Meera Joshi', initials: 'MJ', state: 'Rajasthan', exam: 'IBPS PO', score: 6980, levelEmoji: '⛏️', levelTitle: 'The Gold Miner' },
  { rank: 9, name: 'Vikram Singh', initials: 'VS', state: 'Uttar Pradesh', exam: 'SSC CGL', score: 6210, levelEmoji: '⛏️', levelTitle: 'The Gold Miner' },
  { rank: 10, name: 'Ananya Roy', initials: 'AR', state: 'West Bengal', exam: 'NEET UG', score: 5430, levelEmoji: '📈', levelTitle: 'The Riser' },
];

export default function Leaderboard() {
  const { user } = useAuth();
  const [examFilter, setExamFilter] = useState('All Exams');
  const [stateFilter, setStateFilter] = useState('All States');
  const [examOptions, setExamOptions] = useState(['All Exams']);

  useEffect(() => {
    if (user?.exams?.length) {
      setExamOptions(['All Exams', ...user.exams.map((e) => e.name)]);
    } else {
      fetch('/data/exams.json')
        .then((res) => res.json())
        .then((data) => {
          const names = (data.exams || []).slice(0, 12).map((e) => e.name);
          setExamOptions(['All Exams', ...names]);
        })
        .catch(() => setExamOptions(['All Exams', 'SSC CGL', 'IBPS PO', 'UPSC CSE', 'NEET UG', 'GATE', 'IELTS']));
    }
  }, [user]);

  if (!user) return null;

  const filtered = SAMPLE_RANKINGS.filter((row) => {
    const examMatch = examFilter === 'All Exams' || row.exam === examFilter;
    const stateMatch = stateFilter === 'All States' || row.state === stateFilter;
    return examMatch && stateMatch;
  });

  const isUserRanked = user.rank !== null && user.rank !== undefined;

  return (
    <AppLayout title="Leaderboard">
      <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-[var(--color-primary, #1E3A5F)] mb-1">🇮🇳 All-India Ranking</h2>
            <p className="text-slate-500">See how you stack up nationwide.</p>
          </div>
          <div className="flex gap-3">
            <select
              value={examFilter}
              onChange={(e) => setExamFilter(e.target.value)}
              className="px-3 py-2 rounded-2xl border border-slate-200 text-sm bg-white focus:border-[var(--color-accent, #D4AF37)] outline-none"
            >
              {examOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="px-3 py-2 rounded-2xl border border-slate-200 text-sm bg-white focus:border-[var(--color-accent, #D4AF37)] outline-none"
            >
              {STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-5xl mb-3">🔍</div>
            <p className="text-slate-500">No rankings found for this filter yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-100">
                  <th className="py-2 pr-4">Rank</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">State</th>
                  <th className="py-2 pr-4">Exam</th>
                  <th className="py-2 pr-4">Level</th>
                  <th className="py-2 pr-4 text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.rank} className="border-b border-slate-50">
                    <td className="py-3 pr-4 font-extrabold text-[var(--color-primary, #1E3A5F)]">#{row.rank}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary, #1E3A5F)] text-white flex items-center justify-center text-xs font-bold">
                          {row.initials}
                        </div>
                        <span className="font-bold text-slate-700">{row.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-500">{row.state}</td>
                    <td className="py-3 pr-4 text-slate-500">{row.exam}</td>
                    <td className="py-3 pr-4">
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-[var(--color-primary, #1E3A5F)]/5 text-[var(--color-primary, #1E3A5F)]">
                        {row.levelEmoji} {row.levelTitle}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right font-extrabold text-[var(--color-accent, #D4AF37)]">{row.score.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Your rank */}
        <div className="mt-6 sticky bottom-0">
          {isUserRanked ? (
            <div className="bg-[var(--color-primary, #1E3A5F)] rounded-2xl p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--color-accent, #D4AF37)] text-[var(--color-primary, #1E3A5F)] flex items-center justify-center text-xs font-extrabold">
                  {user.initials}
                </div>
                <div>
                  <p className="font-bold">{user.name} (You)</p>
                  <p className="text-xs text-[var(--color-accent-light, #E8C84A)]">{user.levelEmoji} {user.levelTitle}</p>
                </div>
              </div>
              <p className="font-extrabold text-[var(--color-accent, #D4AF37)]">Rank #{user.rank}</p>
            </div>
          ) : (
            <div className="bg-[#FDF6E3] rounded-2xl p-4 text-center">
              <p className="text-slate-600">Complete a test to get ranked! 📝</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
