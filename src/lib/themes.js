/**
 * TryIT — 25+ Cinematic Themes
 * Each theme defines CSS variables applied to :root
 * All components auto-inherit via var(--color-*)
 */

export const THEMES = {

  // ── 1. Default (TryIT Navy + Gold) ───────────────────────────
  default: {
    id:'default', name:'TryIT Classic', emoji:'🎓', category:'Brand',
    primary:'var(--color-primary, #1E3A5F)',    primaryDark:'var(--color-primary-dark, #0F2140)',
    accent:'var(--color-accent, #D4AF37)',     accentLight:'#E8C44A',
    bg:'#F8FAFC',         surface:'#FFFFFF',
    text:'#1E293B',       textLight:'var(--color-muted, #64748B)',
    border:'var(--color-border, #E2E8F0)',     success:'var(--color-success, #22C55E)',
    error:'var(--color-error, #EF4444)',      warning:'#F59E0B',
    cardBg:'#FFFFFF',     cardText:'#1E293B',    cardAccent:'var(--color-accent, #D4AF37)',
    idCardBg:'linear-gradient(135deg,var(--color-primary, #1E3A5F),var(--color-primary-dark, #0F2140))',
    idCardText:'#FFFFFF', idCardId:'var(--color-accent, #D4AF37)',    idCardBorder:'rgba(212,175,55,0.4)',
  },

  // ── 2. Dark Mode (fixed — text visible) ──────────────────────
  dark: {
    id:'dark', name:'Dark Mode', emoji:'🌙', category:'Basic',
    primary:'#1E293B',    primaryDark:'#0F172A',
    accent:'var(--color-accent, #D4AF37)',     accentLight:'#E8C44A',
    bg:'#0F172A',         surface:'#1E293B',
    text:'#F1F5F9',       textLight:'#CBD5E1',
    border:'#334155',     success:'var(--color-success, #22C55E)',
    error:'var(--color-error, #EF4444)',      warning:'#F59E0B',
    cardBg:'#1E293B',     cardText:'#F1F5F9',   cardAccent:'var(--color-accent, #D4AF37)',
    // ID card fix: always light text on dark cards
    idCardBg:'linear-gradient(135deg,#1E293B,#0F172A)',
    idCardText:'#F1F5F9', idCardId:'var(--color-accent, #D4AF37)',   idCardBorder:'rgba(212,175,55,0.5)',
    idCardIdShadow:'0 1px 3px rgba(0,0,0,0.8)', // ensures visibility
  },

  'high-contrast': {
    id:'high-contrast', name:'High Contrast', emoji:'🔳', category:'Accessibility',
    primary:'#000000',    primaryDark:'#000000',
    accent:'#FFFFFF',     accentLight:'#F8FAFC',
    bg:'#000000',         surface:'#000000',
    text:'#FFFFFF',       textLight:'#E5E7EB',
    border:'#FFFFFF',     success:'var(--color-success, #22C55E)',
    error:'#F87171',      warning:'#FBBF24',
    cardBg:'#111111',     cardText:'#FFFFFF',   cardAccent:'#FFFFFF',
    idCardBg:'linear-gradient(135deg,#000000,#111111)',
    idCardText:'#FFFFFF', idCardId:'#FFFFFF',   idCardBorder:'rgba(255,255,255,0.4)',
    glow:'0 0 25px rgba(255,255,255,0.18)',
  },

  // ── 3. Avatar ─────────────────────────────────────────────────
  avatar: {
    id:'avatar', name:'Avatar', emoji:'💙', category:'Cinematic',
    primary:'#0C4A6E',    primaryDark:'#082F49',
    accent:'#06B6D4',     accentLight:'#22D3EE',
    bg:'#F0F9FF',         surface:'#FFFFFF',
    text:'#0C4A6E',       textLight:'#0C4A6E',
    border:'#BAE6FD',     success:'var(--color-success, #22C55E)',
    error:'var(--color-error, #EF4444)',      warning:'#F59E0B',
    cardBg:'#FFFFFF',     cardText:'#0C4A6E',   cardAccent:'#06B6D4',
    idCardBg:'linear-gradient(135deg,#0C4A6E,#0369A1,#06B6D4)',
    idCardText:'#FFFFFF', idCardId:'#67E8F9',   idCardBorder:'rgba(6,182,212,0.5)',
    glow:'0 0 20px rgba(6,182,212,0.4)',
  },

  // ── 4. Captain America ────────────────────────────────────────
  captain: {
    id:'captain', name:'Captain America', emoji:'🛡️', category:'Cinematic',
    primary:'#1D3557',    primaryDark:'#0D1B2A',
    accent:'#E63946',     accentLight:'#FF6B6B',
    bg:'#F0F4FF',         surface:'#FFFFFF',
    text:'#1D3557',       textLight:'#1D3557',
    border:'#A8DADC',     success:'#2D6A4F',
    error:'#E63946',      warning:'#F59E0B',
    cardBg:'#FFFFFF',     cardText:'#1D3557',   cardAccent:'#E63946',
    idCardBg:'linear-gradient(135deg,#1D3557,#457B9D)',
    idCardText:'#FFFFFF', idCardId:'#A8DADC',   idCardBorder:'rgba(168,218,220,0.5)',
    stripes:'repeating-linear-gradient(90deg,rgba(230,57,70,0.08) 0px,rgba(230,57,70,0.08) 20px,transparent 20px,transparent 40px)',
  },

  // ── 5. Harry Potter ───────────────────────────────────────────
  harry: {
    id:'harry', name:'Harry Potter', emoji:'⚡', category:'Cinematic',
    primary:'#3D1A78',    primaryDark:'#1E0A40',
    accent:'#C9A84C',     accentLight:'#DFC06A',
    bg:'#FFF8F0',         surface:'#FFFFFF',
    text:'#1A0A2E',       textLight:'#1A0A2E',
    border:'#DFC06A',     success:'#2D6A4F',
    error:'#8B0000',      warning:'#C9A84C',
    cardBg:'#FFFFFF',     cardText:'#1A0A2E',   cardAccent:'#C9A84C',
    idCardBg:'linear-gradient(135deg,#1A0A2E,#3D1A78)',
    idCardText:'#FFF8F0', idCardId:'#DFC06A',   idCardBorder:'rgba(201,168,76,0.5)',
    glow:'0 0 15px rgba(201,168,76,0.3)',
  },

  // ── 6. Baahubali ──────────────────────────────────────────────
  baahubali: {
    id:'baahubali', name:'Baahubali', emoji:'👑', category:'Indian Cinema',
    primary:'#7B2400',    primaryDark:'#4A1500',
    accent:'var(--color-accent, #D4AF37)',     accentLight:'#F0C84A',
    bg:'#FFF9F0',         surface:'#FFFFFF',
    text:'#3D1200',       textLight:'#3D1200',
    border:'var(--color-accent, #D4AF37)',     success:'#2D6A4F',
    error:'#CC0000',      warning:'var(--color-accent, #D4AF37)',
    cardBg:'#FFFFFF',     cardText:'#3D1200',   cardAccent:'var(--color-accent, #D4AF37)',
    idCardBg:'linear-gradient(135deg,#4A1500,#7B2400,#B8860B)',
    idCardText:'#FFF9F0', idCardId:'#FFD700',   idCardBorder:'rgba(212,175,55,0.6)',
    glow:'0 0 25px rgba(212,175,55,0.5)',
  },

  // ── 7. Thalaivar (Rajinikanth) ────────────────────────────────
  thalaivar: {
    id:'thalaivar', name:'Thalaivar', emoji:'🕶️', category:'Indian Cinema',
    primary:'#1A1A1A',    primaryDark:'#000000',
    accent:'#C0C0C0',     accentLight:'#E8E8E8',
    bg:'#F5F5F5',         surface:'#FFFFFF',
    text:'#1A1A1A',       textLight:'#1A1A1A',
    border:'#C0C0C0',     success:'var(--color-success, #22C55E)',
    error:'var(--color-error, #EF4444)',      warning:'#F59E0B',
    cardBg:'#1A1A1A',     cardText:'#FFFFFF',   cardAccent:'#C0C0C0',
    idCardBg:'linear-gradient(135deg,#000000,#1A1A1A,#2D2D2D)',
    idCardText:'#FFFFFF', idCardId:'#C0C0C0',   idCardBorder:'rgba(192,192,192,0.5)',
    glow:'0 0 20px rgba(192,192,192,0.3)',
  },

  // ── 8. KGF (Rocky) ────────────────────────────────────────────
  kgf: {
    id:'kgf', name:'KGF Rocky', emoji:'⚙️', category:'Indian Cinema',
    primary:'#2D1B00',    primaryDark:'#1A0F00',
    accent:'#B8860B',     accentLight:'#DAA520',
    bg:'#FAF5E4',         surface:'#FFFFFF',
    text:'#2D1B00',       textLight:'#2D1B00',
    border:'#B8860B',     success:'#2D6A4F',
    error:'#8B0000',      warning:'#B8860B',
    cardBg:'#FAF5E4',     cardText:'#2D1B00',   cardAccent:'#B8860B',
    idCardBg:'linear-gradient(135deg,#1A0F00,#2D1B00,#4A2C00)',
    idCardText:'#FAF5E4', idCardId:'#DAA520',   idCardBorder:'rgba(184,134,11,0.6)',
  },

  // ── 9. Oppenheimer ────────────────────────────────────────────
  oppenheimer: {
    id:'oppenheimer', name:'Oppenheimer', emoji:'⚛️', category:'Cinematic',
    primary:'#1C1C1C',    primaryDark:'#0A0A0A',
    accent:'#FF6B00',     accentLight:'#FF8C00',
    bg:'#F5F0E8',         surface:'#FFFFFF',
    text:'#1C1C1C',       textLight:'#1C1C1C',
    border:'#D4A56A',     success:'var(--color-success, #22C55E)',
    error:'#CC0000',      warning:'#FF6B00',
    cardBg:'#FFFFFF',     cardText:'#1C1C1C',   cardAccent:'#FF6B00',
    idCardBg:'linear-gradient(135deg,#0A0A0A,#1C1C1C,#2E1A00)',
    idCardText:'#F5F0E8', idCardId:'#FF8C00',   idCardBorder:'rgba(255,107,0,0.5)',
    glow:'0 0 20px rgba(255,107,0,0.3)',
  },

  // ── 10. Interstellar ──────────────────────────────────────────
  interstellar: {
    id:'interstellar', name:'Interstellar', emoji:'🌌', category:'Cinematic',
    primary:'#0B0C1E',    primaryDark:'#050610',
    accent:'var(--color-accent-light, #E8C84A)',     accentLight:'#F5D76E',
    bg:'#F0F2FF',         surface:'#FFFFFF',
    text:'#0B0C1E',       textLight:'#0B0C1E',
    border:'#C4C8E8',     success:'var(--color-success, #22C55E)',
    error:'var(--color-error, #EF4444)',      warning:'var(--color-accent-light, #E8C84A)',
    cardBg:'#FFFFFF',     cardText:'#0B0C1E',   cardAccent:'var(--color-accent-light, #E8C84A)',
    idCardBg:'linear-gradient(135deg,#050610,#0B0C1E,#1A1D4A)',
    idCardText:'#F0F2FF', idCardId:'var(--color-accent-light, #E8C84A)',   idCardBorder:'rgba(232,200,74,0.4)',
    glow:'0 0 30px rgba(232,200,74,0.2)',
  },

  // ── 11. The Dark Knight ───────────────────────────────────────
  batman: {
    id:'batman', name:'Dark Knight', emoji:'🦇', category:'Cinematic',
    primary:'#1A1A2E',    primaryDark:'#0D0D1A',
    accent:'#7B2FBE',     accentLight:'#9D4EDD',
    bg:'#F0EEFF',         surface:'#FFFFFF',
    text:'#1A1A2E',       textLight:'#1A1A2E',
    border:'#C4B5FD',     success:'var(--color-success, #22C55E)',
    error:'var(--color-error, #EF4444)',      warning:'#F59E0B',
    cardBg:'#FFFFFF',     cardText:'#1A1A2E',   cardAccent:'#7B2FBE',
    idCardBg:'linear-gradient(135deg,#0D0D1A,#1A1A2E,#2D1B4A)',
    idCardText:'#F0EEFF', idCardId:'#C084FC',   idCardBorder:'rgba(123,47,190,0.5)',
  },

  // ── 12. Calmness ──────────────────────────────────────────────
  calm: {
    id:'calm', name:'Calmness', emoji:'🍃', category:'Mood',
    primary:'#2D6A4F',    primaryDark:'#1B4332',
    accent:'#74C69D',     accentLight:'#95D5B2',
    bg:'#F0FFF4',         surface:'#FFFFFF',
    text:'#1B4332',       textLight:'#1B4332',
    border:'#B7E4C7',     success:'#2D6A4F',
    error:'var(--color-error, #EF4444)',      warning:'#F59E0B',
    cardBg:'#FFFFFF',     cardText:'#1B4332',   cardAccent:'#2D6A4F',
    idCardBg:'linear-gradient(135deg,#1B4332,#2D6A4F)',
    idCardText:'#F0FFF4', idCardId:'#95D5B2',   idCardBorder:'rgba(116,198,157,0.5)',
  },

  // ── 13. Energetic ─────────────────────────────────────────────
  energy: {
    id:'energy', name:'Energetic', emoji:'⚡', category:'Mood',
    primary:'#1E40AF',    primaryDark:'#1E3A8A',
    accent:'#F97316',     accentLight:'#FB923C',
    bg:'#FFF7ED',         surface:'#FFFFFF',
    text:'#1E3A8A',       textLight:'#1E3A8A',
    border:'#FED7AA',     success:'var(--color-success, #22C55E)',
    error:'var(--color-error, #EF4444)',      warning:'#F97316',
    cardBg:'#FFFFFF',     cardText:'#1E3A8A',   cardAccent:'#F97316',
    idCardBg:'linear-gradient(135deg,#1E3A8A,#1E40AF,#1D4ED8)',
    idCardText:'#FFFFFF', idCardId:'#FB923C',   idCardBorder:'rgba(249,115,22,0.5)',
  },

  // ── 14. Hyper Focus ───────────────────────────────────────────
  hyperfocus: {
    id:'hyperfocus', name:'Hyper Focus', emoji:'🔮', category:'Mood',
    primary:'#064E3B',    primaryDark:'#022C22',
    accent:'#10B981',     accentLight:'#34D399',
    bg:'#F0FDF9',         surface:'#FFFFFF',
    text:'#022C22',       textLight:'#022C22',
    border:'#6EE7B7',     success:'#10B981',
    error:'var(--color-error, #EF4444)',      warning:'#F59E0B',
    cardBg:'#022C22',     cardText:'#34D399',   cardAccent:'#10B981',
    idCardBg:'linear-gradient(135deg,#022C22,#064E3B)',
    idCardText:'#ECFDF5', idCardId:'#34D399',   idCardBorder:'rgba(16,185,129,0.5)',
    glow:'0 0 20px rgba(16,185,129,0.4)',
  },

  // ── 15. Professional ──────────────────────────────────────────
  professional: {
    id:'professional', name:'Professional', emoji:'💼', category:'Mood',
    primary:'#374151',    primaryDark:'#1F2937',
    accent:'#6B7280',     accentLight:'#9CA3AF',
    bg:'#F9FAFB',         surface:'#FFFFFF',
    text:'#111827',       textLight:'#111827',
    border:'#E5E7EB',     success:'#059669',
    error:'#DC2626',      warning:'#D97706',
    cardBg:'#FFFFFF',     cardText:'#111827',   cardAccent:'#374151',
    idCardBg:'linear-gradient(135deg,#1F2937,#374151)',
    idCardText:'#F9FAFB', idCardId:'#D1D5DB',   idCardBorder:'rgba(107,114,128,0.4)',
  },

  // ── 16. Sunrise ───────────────────────────────────────────────
  sunrise: {
    id:'sunrise', name:'Sunrise', emoji:'🌅', category:'Nature',
    primary:'#92400E',    primaryDark:'#78350F',
    accent:'#F59E0B',     accentLight:'#FCD34D',
    bg:'#FFFBEB',         surface:'#FFFFFF',
    text:'#78350F',       textLight:'#78350F',
    border:'#FDE68A',     success:'#059669',
    error:'#DC2626',      warning:'#D97706',
    cardBg:'#FFFFFF',     cardText:'#78350F',   cardAccent:'#F59E0B',
    idCardBg:'linear-gradient(135deg,#78350F,#92400E,#B45309)',
    idCardText:'#FFFBEB', idCardId:'#FCD34D',   idCardBorder:'rgba(245,158,11,0.5)',
  },

  // ── 17. Night Owl ─────────────────────────────────────────────
  nightowl: {
    id:'nightowl', name:'Night Owl', emoji:'🦉', category:'Nature',
    primary:'#1E1B4B',    primaryDark:'#13103B',
    accent:'#A78BFA',     accentLight:'#C4B5FD',
    bg:'#F5F3FF',         surface:'#FFFFFF',
    text:'#1E1B4B',       textLight:'#1E1B4B',
    border:'#DDD6FE',     success:'#059669',
    error:'#DC2626',      warning:'#D97706',
    cardBg:'#FFFFFF',     cardText:'#1E1B4B',   cardAccent:'#7C3AED',
    idCardBg:'linear-gradient(135deg,#13103B,#1E1B4B,#2D1F7A)',
    idCardText:'#F5F3FF', idCardId:'#C4B5FD',   idCardBorder:'rgba(167,139,250,0.5)',
  },

  // ── 18. Nature Forest ─────────────────────────────────────────
  forest: {
    id:'forest', name:'Forest', emoji:'🌲', category:'Nature',
    primary:'#14532D',    primaryDark:'#052E16',
    accent:'#16A34A',     accentLight:'var(--color-success, #22C55E)',
    bg:'#F0FDF4',         surface:'#FFFFFF',
    text:'#052E16',       textLight:'#052E16',
    border:'#86EFAC',     success:'#16A34A',
    error:'#DC2626',      warning:'#CA8A04',
    cardBg:'#FFFFFF',     cardText:'#052E16',   cardAccent:'#14532D',
    idCardBg:'linear-gradient(135deg,#052E16,#14532D)',
    idCardText:'#F0FDF4', idCardId:'#86EFAC',   idCardBorder:'rgba(22,163,74,0.5)',
  },

  // ── 19. Saffron (Indian Pride) ────────────────────────────────
  saffron: {
    id:'saffron', name:'Bharat', emoji:'🇮🇳', category:'Indian',
    primary:'#FF6200',    primaryDark:'#CC4E00',
    accent:'#FFFFFF',     accentLight:'#F5F5F5',
    bg:'#FFF9F0',         surface:'#FFFFFF',
    text:'#1A0A00',       textLight:'#1A0A00',
    border:'#FF9933',     success:'#138808',
    error:'#CC0000',      warning:'#FF6200',
    cardBg:'#FFFFFF',     cardText:'#1A0A00',   cardAccent:'#FF6200',
    idCardBg:'linear-gradient(135deg,#FF6200,#FF9933)',
    idCardText:'#FFFFFF', idCardId:'#FFF9F0',   idCardBorder:'rgba(255,153,51,0.5)',
  },

  // ── 20. RRR (Fire) ────────────────────────────────────────────
  rrr: {
    id:'rrr', name:'RRR', emoji:'🔥', category:'Indian Cinema',
    primary:'#7F1D1D',    primaryDark:'#450A0A',
    accent:'#FCA5A5',     accentLight:'#FECACA',
    bg:'#FFF5F5',         surface:'#FFFFFF',
    text:'#450A0A',       textLight:'#450A0A',
    border:'#FCA5A5',     success:'#059669',
    error:'#DC2626',      warning:'#D97706',
    cardBg:'#FFFFFF',     cardText:'#450A0A',   cardAccent:'#DC2626',
    idCardBg:'linear-gradient(135deg,#450A0A,#7F1D1D,#991B1B)',
    idCardText:'#FFF5F5', idCardId:'#FECACA',   idCardBorder:'rgba(220,38,38,0.5)',
    glow:'0 0 25px rgba(220,38,38,0.4)',
  },

  // ── 21. Ocean ─────────────────────────────────────────────────
  ocean: {
    id:'ocean', name:'Ocean Deep', emoji:'🌊', category:'Nature',
    primary:'#0C4A6E',    primaryDark:'#082F49',
    accent:'#0EA5E9',     accentLight:'#38BDF8',
    bg:'#F0F9FF',         surface:'#FFFFFF',
    text:'#082F49',       textLight:'#082F49',
    border:'#BAE6FD',     success:'#059669',
    error:'#DC2626',      warning:'#D97706',
    cardBg:'#FFFFFF',     cardText:'#082F49',   cardAccent:'#0C4A6E',
    idCardBg:'linear-gradient(135deg,#082F49,#0C4A6E,#075985)',
    idCardText:'#F0F9FF', idCardId:'#7DD3FC',   idCardBorder:'rgba(14,165,233,0.5)',
  },

  // ── 22. Cherry Blossom ────────────────────────────────────────
  cherry: {
    id:'cherry', name:'Cherry Blossom', emoji:'🌸', category:'Nature',
    primary:'#9D174D',    primaryDark:'#831843',
    accent:'#EC4899',     accentLight:'#F472B6',
    bg:'#FFF0F6',         surface:'#FFFFFF',
    text:'#500724',       textLight:'#500724',
    border:'#FBCFE8',     success:'#059669',
    error:'#DC2626',      warning:'#D97706',
    cardBg:'#FFFFFF',     cardText:'#500724',   cardAccent:'#9D174D',
    idCardBg:'linear-gradient(135deg,#500724,#9D174D,#BE185D)',
    idCardText:'#FFF0F6', idCardId:'#F9A8D4',   idCardBorder:'rgba(236,72,153,0.5)',
  },

  // ── 23. Galaxy ────────────────────────────────────────────────
  galaxy: {
    id:'galaxy', name:'Galaxy', emoji:'🌠', category:'Space',
    primary:'#2E1065',    primaryDark:'#1E0A4A',
    accent:'#A855F7',     accentLight:'#C084FC',
    bg:'#FAF5FF',         surface:'#FFFFFF',
    text:'#1E0A4A',       textLight:'#1E0A4A',
    border:'#E9D5FF',     success:'#059669',
    error:'#DC2626',      warning:'#D97706',
    cardBg:'#FFFFFF',     cardText:'#1E0A4A',   cardAccent:'#7C3AED',
    idCardBg:'linear-gradient(135deg,#1E0A4A,#2E1065,#4C1D95)',
    idCardText:'#FAF5FF', idCardId:'#E879F9',   idCardBorder:'rgba(168,85,247,0.5)',
    glow:'0 0 30px rgba(168,85,247,0.3)',
  },

  // ── 24. Vikram ────────────────────────────────────────────────
  vikram: {
    id:'vikram', name:'Vikram', emoji:'🗡️', category:'Indian Cinema',
    primary:'#0D3B2E',    primaryDark:'#041F18',
    accent:'#00FFB3',     accentLight:'#6EFFD9',
    bg:'#F0FFF8',         surface:'#FFFFFF',
    text:'#041F18',       textLight:'#041F18',
    border:'#6EFFD9',     success:'#10B981',
    error:'var(--color-error, #EF4444)',      warning:'#F59E0B',
    cardBg:'#0D3B2E',     cardText:'#00FFB3',   cardAccent:'#00FFB3',
    idCardBg:'linear-gradient(135deg,#041F18,#0D3B2E)',
    idCardText:'#F0FFF8', idCardId:'#00FFB3',   idCardBorder:'rgba(0,255,179,0.5)',
    glow:'0 0 20px rgba(0,255,179,0.4)',
  },

  // ── 25. Desert Storm ──────────────────────────────────────────
  desert: {
    id:'desert', name:'Desert Storm', emoji:'🏜️', category:'Nature',
    primary:'#78350F',    primaryDark:'#451A03',
    accent:'#D97706',     accentLight:'#F59E0B',
    bg:'#FFFBEB',         surface:'#FFFFFF',
    text:'#451A03',       textLight:'#451A03',
    border:'#FDE68A',     success:'#059669',
    error:'#DC2626',      warning:'#D97706',
    cardBg:'#FFFFFF',     cardText:'#451A03',   cardAccent:'#78350F',
    idCardBg:'linear-gradient(135deg,#451A03,#78350F,#92400E)',
    idCardText:'#FFFBEB', idCardId:'#FCD34D',   idCardBorder:'rgba(217,119,6,0.5)',
  },

  // ── 26. Minimal White ─────────────────────────────────────────
  minimal: {
    id:'minimal', name:'Minimal White', emoji:'⬜', category:'Basic',
    primary:'#1F2937',    primaryDark:'#111827',
    accent:'#111827',     accentLight:'#374151',
    bg:'#FFFFFF',         surface:'#F9FAFB',
    text:'#111827',       textLight:'#111827',
    border:'#E5E7EB',     success:'#059669',
    error:'#DC2626',      warning:'#D97706',
    cardBg:'#F9FAFB',     cardText:'#111827',   cardAccent:'#111827',
    idCardBg:'linear-gradient(135deg,#111827,#1F2937)',
    idCardText:'#FFFFFF', idCardId:'#D1D5DB',   idCardBorder:'rgba(31,41,55,0.3)',
  },
}

export const THEME_CATEGORIES = ['Brand','Basic','Cinematic','Indian Cinema','Indian','Mood','Nature','Space']

export function getTheme(id) {
  return THEMES[id] || THEMES.default
}

export function applyTheme(themeId) {
  const t = getTheme(themeId)
  const root = document.documentElement
  Object.entries({
    '--color-primary':       t.primary,
    '--color-primary-dark':  t.primaryDark,
    '--color-accent':        t.accent,
    '--color-accent-light':  t.accentLight,
    '--color-bg':            t.bg,
    '--color-surface':       t.surface,
    '--color-text':          t.text,
    '--color-text-light':    t.textLight,
    '--color-border':        t.border,
    '--color-success':       t.success,
    '--color-error':         t.error,
    '--color-warning':       t.warning,
    '--card-bg':             t.cardBg,
    '--card-text':           t.cardText,
    '--card-accent':         t.cardAccent,
    '--id-card-bg':          t.idCardBg,
    '--id-card-text':        t.idCardText,
    '--id-card-id':          t.idCardId,
    '--id-card-border':      t.idCardBorder,
    '--glow':                t.glow || 'none',
  }).forEach(([k,v]) => root.style.setProperty(k, v))
  localStorage.setItem('tryit_theme', themeId)
}
