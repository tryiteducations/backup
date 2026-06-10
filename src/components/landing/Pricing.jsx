import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TABS = ['Try First', 'Monthly', 'Family']

const PLANS = {
  'Try First': [
    { name:'Free',       price:0,    period:'forever',  pop:false, features:['10 tests/month','Basic leaderboard','3 free games'] },
    { name:'Trial Pass', price:19,   period:'24 hours', pop:true,  features:['Unlimited tests','All exams','All India rank','40+ languages'] },
    { name:'Exam Eve',   price:29,   period:'12 hours', pop:false, features:['Full access','Priority answers'] },
    { name:'Weekend',    price:39,   period:'2 days',   pop:false, features:['Full access','All features'] },
  ],
  'Monthly': [
    { name:'TryIT Plus', price:99,   period:'month',    pop:false, features:['Unlimited tests','5 exams','Basic analytics'] },
    { name:'TryIT Pro',  price:199,  period:'month',    pop:true,  features:['Everything in Plus','All games','Offline mode','40 languages','3× coins'] },
    { name:'Pro Max',    price:349,  period:'month',    pop:false, features:['Everything in Pro','Priority doubts','Advanced analytics'] },
    { name:'Annual',     price:1499, period:'year',     pop:false, features:['Full Pro for 1 year','Save ₹889 vs monthly'] },
  ],
  'Family': [
    { name:'Family Hub', price:349,  period:'month',    pop:true,  features:['5 member slots','Individual dashboards','Family leaderboard'] },
    { name:'Family Annual',price:2799,period:'year',    pop:false, features:['Family Hub for full year','Best value'] },
    { name:'Batch',      price:299,  period:'30 days',  pop:false, features:['5 friends','Shared exam access'] },
  ],
}

export default function Pricing() {
  const [tab, setTab] = useState('Monthly')
  const navigate = useNavigate()
  const plans = PLANS[tab] || []

  return (
    <section className="py-16 bg-slate-50 reveal">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-10">
          <h2 className="font-poppins font-bold text-[#1E3A5F]" style={{ fontSize:'clamp(26px,4vw,40px)' }}>
            💳 Start Free. Upgrade When Ready.
          </h2>
          <p className="text-slate-500 mt-2">From ₹19 for 24 hours to ₹1,499 for a full year.</p>
        </div>
        <div className="flex justify-center gap-2 mb-8">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all
                ${tab === t ? 'bg-[#1E3A5F] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-[#D4AF37]'}`}>
              {t}
            </button>
          ))}
        </div>
        {/* BUG FIX: explicit ternary, not plans.length && */}
        {plans.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map(plan => (
              <div key={plan.name} className={`rounded-2xl p-5 flex flex-col relative ${plan.pop ? 'clay-gold' : 'clay'}`}>
                {plan.pop && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1E3A5F] text-[#D4AF37] text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    MOST POPULAR
                  </span>
                )}
                <p className="font-bold text-lg text-[#1E3A5F] font-poppins">{plan.name}</p>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-4xl font-extrabold font-poppins text-[#D4AF37]">
                    {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-sm text-[#1E3A5F]/70">/{plan.period}</span>
                  )}
                </div>
                <ul className="flex-1 space-y-2 mb-4">
                  {plan.features.map(f => (
                    <li key={f} className="text-sm text-[#1E3A5F] flex items-start gap-2">
                      <span className="text-green-600 flex-shrink-0 mt-0.5">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate('/login')}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${plan.pop ? 'btn-navy' : 'btn-gold'}`}>
                  {plan.price === 0 ? 'Start Free' : 'Get Started →'}
                </button>
              </div>
            ))}
          </div>
        ) : null}
        <p className="text-center text-slate-400 text-sm mt-6">All prices include GST · Cancel anytime</p>
      </div>
    </section>
  )
}
