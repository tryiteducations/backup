import React from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';

const SAMPLE_LEADERBOARD = [
  { rank: 1, name: 'Aarav Sharma', state: 'Maharashtra', hall: 'SSC Warriors', score: 12840, levelEmoji: '🏆', levelTitle: 'The Gold King' },
  { rank: 2, name: 'Priya Nair', state: 'Kerala', hall: 'Bank Aspirants Hub', score: 11920, levelEmoji: '👑', levelTitle: 'Thalavan' },
  { rank: 3, name: 'Rohan Mehta', state: 'Gujarat', hall: 'UPSC Inner Circle', score: 11430, levelEmoji: '👑', levelTitle: 'Thalavan' },
  { rank: 4, name: 'Sneha Iyer', state: 'Tamil Nadu', hall: 'NEET Ninjas', score: 9870, levelEmoji: '🦁', levelTitle: 'Baahuveer' },
  { rank: 5, name: 'Karthik Raj', state: 'Tamil Nadu', hall: 'SSC Warriors', score: 9210, levelEmoji: '🦁', levelTitle: 'Baahuveer' },
  { rank: 6, name: 'Divya Pillai', state: 'Karnataka', hall: 'GATE Gurus', score: 8430, levelEmoji: '💪', levelTitle: 'The Grinder' },
  { rank: 7, name: 'Arjun Verma', state: 'Delhi', hall: 'IELTS Explorers', score: 7650, levelEmoji: '💪', levelTitle: 'The Grinder' },
  { rank: 8, name: 'Meera Joshi', state: 'Rajasthan', hall: 'Bank Aspirants Hub', score: 6980, levelEmoji: '⛏️', levelTitle: 'The Gold Miner' },
];

const RANK_STYLES = {
  1: 'bg-gradient-to-r from-[var(--color-accent, #D4AF37)] to-[var(--color-accent-light, #E8C84A)] text-[var(--color-primary, #1E3A5F)]',
  2: 'bg-gradient-to-r from-slate-300 to-slate-200 text-slate-700',
  3: 'bg-gradient-to-r from-[#CD7F32]/40 to-[var(--color-accent-light, #E8C84A)]/40 text-[#7C2D12]',
};

export default function HallLeaderboard() {
  const { user } = useAuth();
  if (!user) return null;

  const isUserRanked = SAMPLE_LEADERBOARD.some((r) => r.name === user.name);

  return (
    <AppLayout title="Global Hall Leaderboard">
      <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6">
        <h2 className="font-display text-2xl font-extrabold text-[var(--color-primary, #1E3A5F)] mb-1">🏆 Global Leaderboard</h2>
        <p className="text-slate-500 mb-6">Top performers across all Halls — updated weekly.</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="py-2 pr-4">Rank</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">State</th>
                <th className="py-2 pr-4">Hall</th>
                <th className="py-2 pr-4">Level</th>
                <th className="py-2 pr-4 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_LEADERBOARD.map((row) => {
                const isMe = row.name === user.name;
                return (
                  <tr key={row.rank} className={`border-b border-slate-50 ${isMe ? 'bg-[#FDF6E3]' : ''}`}>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-extrabold text-xs ${RANK_STYLES[row.rank] || 'bg-slate-100 text-slate-500'}`}>
                        {row.rank}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-bold text-slate-700">
                      {row.name} {isMe && <span className="text-[var(--color-accent, #D4AF37)]">(You)</span>}
                    </td>
                    <td className="py-3 pr-4 text-slate-500">{row.state}</td>
                    <td className="py-3 pr-4 text-slate-500">{row.hall}</td>
                    <td className="py-3 pr-4">
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-[var(--color-primary, #1E3A5F)]/5 text-[var(--color-primary, #1E3A5F)]">
                        {row.levelEmoji} {row.levelTitle}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right font-extrabold text-[var(--color-accent, #D4AF37)]">{row.score.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!isUserRanked && (
          <div className="mt-6 bg-[#FDF6E3] rounded-2xl p-4 text-center">
            <p className="text-slate-600">You're not ranked yet — join a Hall and start earning! 🏛️</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
