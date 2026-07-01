// src/lib/payment.js
// Razorpay + UPI payment integration
// Loads Razorpay SDK dynamically - no build-time dependency

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder'

// Load Razorpay script dynamically
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload  = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

// Main payment function
// amount in paise (₹5 = 500 paise)
export async function openPayment({
  amount,        // in paise
  currency = 'INR',
  name = 'TryIT Educations',
  description,
  prefill = {},  // { name, contact, email }
  notes = {},
  onSuccess,
  onFailure,
  onDismiss,
}) {
  const loaded = await loadRazorpay()
  if (!loaded) {
    onFailure?.({ message: 'Payment gateway failed to load. Check your connection.' })
    return
  }

  const options = {
    key: RAZORPAY_KEY,
    amount,
    currency,
    name,
    description,
    image: '/tryit-logo.webp',
    prefill: {
      name:    prefill.name    || '',
      contact: prefill.contact || '',
      email:   prefill.email   || `${prefill.contact}@phone.tryiteducations.net`,
    },
    notes,
    theme: { color: 'var(--color-accent, #C9A84C)' },
    modal: {
      ondismiss: () => onDismiss?.(),
      animation: true,
    },
    handler: (response) => {
      // response.razorpay_payment_id
      // response.razorpay_order_id
      // response.razorpay_signature
      onSuccess?.(response)
    },
    // Enable all payment methods incl. UPI, GPay, PhonePe, Paytm
    method: {
      upi:        true,
      card:       true,
      netbanking: true,
      wallet:     true,
      emi:        false,
    },
  }

  const rzp = new window.Razorpay(options)
  rzp.on('payment.failed', (response) => {
    onFailure?.(response.error)
  })
  rzp.open()
}

// Convenience helpers
export const PAY_AMOUNTS = {
  day1:    500,   // ₹5
  day3:    1900,  // ₹19
  day7:    4900,  // ₹49
  monthly: 19900, // ₹199
  yearly:  99900, // ₹999
}

export async function payDayPass({ days, category, userId, profile, onSuccess, onFailure }) {
  const key = `day${days}`
  const amount = PAY_AMOUNTS[key] || 500

  await openPayment({
    amount,
    description: `TryIT ${days}-Day Pass - ${category}`,
    prefill: {
      name:    profile?.name    || '',
      contact: profile?.phone   || '',
    },
    notes: { userId, category, days, type: 'day_pass' },
    onSuccess: async (response) => {
      // Log to Supabase
      const { supabase } = await import('./supabase')
      await supabase.from('day_passes').insert({
        user_id:    userId,
        days:       parseInt(days),
        plan:       'pro',
        amount_paid: amount / 100,
        start_date: new Date().toISOString(),
        end_date:   new Date(Date.now() + days*24*60*60*1000).toISOString(),
      })
      // Update profile plan
      await supabase.from('profiles').update({
        plan: 'pro',
        plan_expires: new Date(Date.now() + days*24*60*60*1000).toISOString(),
      }).eq('id', userId)
      onSuccess?.(response)
    },
    onFailure,
  })
}

export async function paySubscription({ plan, category, years=1, userId, profile, onSuccess, onFailure }) {
  const amountMap = {
    'monthly': 19900,
    'yearly':  99900,
    '3year':   159900,
    '5year':   249900,
  }
  const amount = amountMap[plan] || 19900

  await openPayment({
    amount,
    description: `TryIT Pro - ${plan} subscription`,
    prefill: {
      name:    profile?.name  || '',
      contact: profile?.phone || '',
    },
    notes: { userId, category, plan, type: 'subscription' },
    onSuccess: async (response) => {
      const { supabase } = await import('./supabase')
      const days = plan==='monthly'?30:plan==='yearly'?365:plan==='3year'?1095:1825
      await supabase.from('subscriptions').insert({
        user_id:    userId,
        plan:       'pro',
        category,
        amount_paid: amount/100,
        commitment_years: years,
        end_date: new Date(Date.now()+days*24*60*60*1000).toISOString(),
      })
      await supabase.from('profiles').update({
        plan: 'pro',
        plan_expires: new Date(Date.now()+days*24*60*60*1000).toISOString(),
      }).eq('id', userId)
      onSuccess?.(response)
    },
    onFailure,
  })
}
