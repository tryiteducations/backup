// src/pages/legal/PrivacyPage.jsx
import { useAuth } from '../../context/AuthContext'
import AppLayout from '../../components/layout/AppLayout'

const SECTIONS = [
  {
    title: '1. What Data We Collect',
    body: `We collect: (a) Account data — name, email, state, city, role, and exam preferences you provide at registration; (b) Usage data — test attempts, scores, streak counts, coins, XP, and study hours generated through platform activity; (c) Device data — browser type, OS, and IP address for security and analytics; (d) Payment data — processed entirely by Razorpay; TryIT does not store card or UPI details.`,
  },
  {
    title: '2. How We Use Your Data',
    body: `We use your data to: personalise your exam preparation experience; calculate leaderboard rankings and XP progression; send notifications about your exam schedule, streak milestones, and platform updates; detect and prevent fraud or abuse; and improve our AI-powered question recommendations.`,
  },
  {
    title: '3. Data Sharing',
    body: `We do not sell your personal data. We share data only with: (a) Cloudflare (infrastructure and CDN); (b) Razorpay (payment processing); (c) our internal analytics tools (anonymised/aggregated only); (d) legal authorities where required by Indian law. Mentors and institutions can view enrolled students' progress metrics — not personal contact details.`,
  },
  {
    title: "4. Children's Privacy",
    body: `TryIT serves students from LKG upward. For users under 13, we require parental/guardian consent at registration. We do not knowingly collect personal data from children under 13 without consent. Family account holders can request deletion of a minor's data at any time via privacy@tryiteducations.net.`,
  },
  {
    title: '5. Data Retention',
    body: `We retain your account data for as long as your account is active. If you delete your account, personal data is purged within 30 days. Aggregated/anonymised data (used for platform analytics) may be retained indefinitely as it cannot be linked to you.`,
  },
  {
    title: '6. Your Rights (DPDPA 2023)',
    body: `Under India's Digital Personal Data Protection Act, 2023, you have the right to: (a) access a summary of your personal data we hold; (b) correct inaccurate data; (c) erasure of your data (subject to legal retention obligations); (d) grievance redressal. To exercise these rights, email privacy@tryiteducations.net.`,
  },
  {
    title: '7. Cookies & Local Storage',
    body: `We use browser local storage to persist your login session, theme preference, and accessibility settings. We do not use third-party advertising cookies. You can clear local storage at any time via your browser settings — this will log you out of TryIT.`,
  },
  {
    title: '8. Security',
    body: `All data in transit is encrypted via TLS 1.3. Test question content is encrypted with AES-256 before transmission. We employ screenshot watermarking to deter question leakage. Our Cloudflare D1 and R2 storage is isolated per environment with role-based access controls.`,
  },
  {
    title: '9. Changes to This Policy',
    body: `We will notify you of material changes to this Privacy Policy via in-app notification and email at least 14 days before changes take effect.`,
  },
  {
    title: '10. Contact & Grievance Officer',
    body: `Data Protection / Privacy queries: privacy@tryiteducations.net\nGrievance Officer: TryIT Educations Pvt. Ltd., Bengaluru, Karnataka — 560001\nResponse time: within 72 hours.`,
  },
]

function Content() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 pb-10">
      <div className="bg-[#FDF6E3] rounded-2xl p-4 text-center">
        <p className="font-bold text-[#7C2D12] text-lg">Privacy Policy</p>
        <p className="text-xs text-gray-500 mt-1">Last updated: January 2025 · Compliant with DPDPA 2023</p>
      </div>

      <div className="space-y-5">
        {SECTIONS.map(s => (
          <div key={s.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-[var(--color-primary, #1E3A5F)] text-base mb-2">{s.title}</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PrivacyPage() {
  const { user } = useAuth()

  if (user) {
    return (
      <AppLayout title="Privacy Policy">
        <Content />
      </AppLayout>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-[var(--color-primary, #1E3A5F)] px-6 py-4 flex items-center justify-between">
        <span className="text-[var(--color-accent, #D4AF37)] font-black text-xl">TryIT</span>
        <a href="/landing" className="text-white text-sm opacity-70 hover:opacity-100">← Home</a>
      </div>
      <Content />
    </div>
  )
}
