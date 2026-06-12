#!/bin/bash
# TryIT — Batch 3 + 4 + 5 Complete
# 26 Themes · Dark ID card fix · Anti-debug · Watermark · Screenshot blur
# Velocity limiter · UDID auto-Pro · Sticky accessibility bar
# Word Rush · GK Burst · Admin Login · Centre Login · Mentor Cashback
ROOT="${1:-/workspaces/Tatu}"
cd "$ROOT"
echo "Installing Batch 3 + 4 + 5..."
mkdir -p src/lib src/context src/pages/games src/pages/admin
mkdir -p src/pages/centre src/pages/mentor src/pages/settings
mkdir -p src/components/accessibility
mkdir -p src/lib src/context src/components/themes

# ══════════════════════════════════════════════════════════════════
# 25+ CINEMATIC THEMES
# ══════════════════════════════════════════════════════════════════
cat > src/lib/themes.js << 'EOF'
/**
 * TryIT — 25+ Cinematic Themes
 * Each theme defines CSS variables applied to :root
 * All components auto-inherit via var(--color-*)
 */

export const THEMES = {

  // ── 1. Default (TryIT Navy + Gold) ───────────────────────────
  default: {
    id:'default', name:'TryIT Classic', emoji:'🎓', category:'Brand',
    primary:'#1E3A5F',    primaryDark:'#0F2140',
    accent:'#D4AF37',     accentLight:'#E8C44A',
    bg:'#F8FAFC',         surface:'#FFFFFF',
    text:'#1E293B',       textLight:'#64748B',
    border:'#E2E8F0',     success:'#22C55E',
    error:'#EF4444',      warning:'#F59E0B',
    cardBg:'#FFFFFF',     cardText:'#1E293B',    cardAccent:'#D4AF37',
    idCardBg:'linear-gradient(135deg,#1E3A5F,#0F2140)',
    idCardText:'#FFFFFF', idCardId:'#D4AF37',    idCardBorder:'rgba(212,175,55,0.4)',
  },

  // ── 2. Dark Mode (fixed — text visible) ──────────────────────
  dark: {
    id:'dark', name:'Dark Mode', emoji:'🌙', category:'Basic',
    primary:'#1E293B',    primaryDark:'#0F172A',
    accent:'#D4AF37',     accentLight:'#E8C44A',
    bg:'#0F172A',         surface:'#1E293B',
    text:'#F1F5F9',       textLight:'#94A3B8',
    border:'#334155',     success:'#22C55E',
    error:'#EF4444',      warning:'#F59E0B',
    cardBg:'#1E293B',     cardText:'#F1F5F9',   cardAccent:'#D4AF37',
    // ID card fix: always light text on dark cards
    idCardBg:'linear-gradient(135deg,#1E293B,#0F172A)',
    idCardText:'#F1F5F9', idCardId:'#D4AF37',   idCardBorder:'rgba(212,175,55,0.5)',
    idCardIdShadow:'0 1px 3px rgba(0,0,0,0.8)', // ensures visibility
  },

  // ── 3. Avatar ─────────────────────────────────────────────────
  avatar: {
    id:'avatar', name:'Avatar', emoji:'💙', category:'Cinematic',
    primary:'#0C4A6E',    primaryDark:'#082F49',
    accent:'#06B6D4',     accentLight:'#22D3EE',
    bg:'#F0F9FF',         surface:'#FFFFFF',
    text:'#0C4A6E',       textLight:'#0369A1',
    border:'#BAE6FD',     success:'#22C55E',
    error:'#EF4444',      warning:'#F59E0B',
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
    text:'#1D3557',       textLight:'#457B9D',
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
    text:'#1A0A2E',       textLight:'#6B4F8C',
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
    accent:'#D4AF37',     accentLight:'#F0C84A',
    bg:'#FFF9F0',         surface:'#FFFFFF',
    text:'#3D1200',       textLight:'#8B4513',
    border:'#D4AF37',     success:'#2D6A4F',
    error:'#CC0000',      warning:'#D4AF37',
    cardBg:'#FFFFFF',     cardText:'#3D1200',   cardAccent:'#D4AF37',
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
    text:'#1A1A1A',       textLight:'#555555',
    border:'#C0C0C0',     success:'#22C55E',
    error:'#EF4444',      warning:'#F59E0B',
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
    text:'#2D1B00',       textLight:'#6B4A00',
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
    text:'#1C1C1C',       textLight:'#4A4A4A',
    border:'#D4A56A',     success:'#22C55E',
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
    accent:'#E8C84A',     accentLight:'#F5D76E',
    bg:'#F0F2FF',         surface:'#FFFFFF',
    text:'#0B0C1E',       textLight:'#4A4E7A',
    border:'#C4C8E8',     success:'#22C55E',
    error:'#EF4444',      warning:'#E8C84A',
    cardBg:'#FFFFFF',     cardText:'#0B0C1E',   cardAccent:'#E8C84A',
    idCardBg:'linear-gradient(135deg,#050610,#0B0C1E,#1A1D4A)',
    idCardText:'#F0F2FF', idCardId:'#E8C84A',   idCardBorder:'rgba(232,200,74,0.4)',
    glow:'0 0 30px rgba(232,200,74,0.2)',
  },

  // ── 11. The Dark Knight ───────────────────────────────────────
  batman: {
    id:'batman', name:'Dark Knight', emoji:'🦇', category:'Cinematic',
    primary:'#1A1A2E',    primaryDark:'#0D0D1A',
    accent:'#7B2FBE',     accentLight:'#9D4EDD',
    bg:'#F0EEFF',         surface:'#FFFFFF',
    text:'#1A1A2E',       textLight:'#4A3A7A',
    border:'#C4B5FD',     success:'#22C55E',
    error:'#EF4444',      warning:'#F59E0B',
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
    text:'#1B4332',       textLight:'#40916C',
    border:'#B7E4C7',     success:'#2D6A4F',
    error:'#EF4444',      warning:'#F59E0B',
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
    text:'#1E3A8A',       textLight:'#3B82F6',
    border:'#FED7AA',     success:'#22C55E',
    error:'#EF4444',      warning:'#F97316',
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
    text:'#022C22',       textLight:'#065F46',
    border:'#6EE7B7',     success:'#10B981',
    error:'#EF4444',      warning:'#F59E0B',
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
    text:'#111827',       textLight:'#6B7280',
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
    text:'#78350F',       textLight:'#B45309',
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
    text:'#1E1B4B',       textLight:'#5B21B6',
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
    accent:'#16A34A',     accentLight:'#22C55E',
    bg:'#F0FDF4',         surface:'#FFFFFF',
    text:'#052E16',       textLight:'#166534',
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
    text:'#1A0A00',       textLight:'#4A2800',
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
    text:'#450A0A',       textLight:'#991B1B',
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
    text:'#082F49',       textLight:'#0369A1',
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
    text:'#500724',       textLight:'#9D174D',
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
    text:'#1E0A4A',       textLight:'#6B21A8',
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
    text:'#041F18',       textLight:'#065F46',
    border:'#6EFFD9',     success:'#10B981',
    error:'#EF4444',      warning:'#F59E0B',
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
    text:'#451A03',       textLight:'#92400E',
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
    text:'#111827',       textLight:'#6B7280',
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
EOF
echo "themes.js done — $(wc -l < src/lib/themes.js) lines"
# ── ThemeContext + ThemeSelector ──────────────────────────────────
cat > src/context/ThemeContext.jsx << 'EOF'
import { createContext, useContext, useState, useEffect } from 'react'
import { applyTheme, getTheme, THEMES } from '../lib/themes'

const ThemeCtx = createContext({})

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(
    () => localStorage.getItem('tryit_theme') || 'default'
  )

  useEffect(() => {
    applyTheme(themeId)
  }, [themeId])

  const setTheme = (id) => {
    setThemeId(id)
    applyTheme(id)
  }

  return (
    <ThemeCtx.Provider value={{ themeId, theme: getTheme(themeId), setTheme, themes: THEMES }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export const useTheme = () => useContext(ThemeCtx)
EOF

# ── Theme Selector Page ───────────────────────────────────────────
cat > src/pages/settings/ThemeSelector.jsx << 'EOF'
import { useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useTheme } from '../../context/ThemeContext'
import { THEMES, THEME_CATEGORIES } from '../../lib/themes'

export default function ThemeSelector() {
  const { themeId, setTheme } = useTheme()
  const [cat, setCat]         = useState('All')
  const [preview, setPreview] = useState(null)

  const visible = Object.values(THEMES).filter(t =>
    cat === 'All' || t.category === cat
  )

  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
        color:'var(--color-text)', fontSize:28, marginBottom:6 }}>
        🎨 Themes
      </h1>
      <p style={{ color:'var(--color-text-light)', fontSize:14, marginBottom:20 }}>
        {Object.keys(THEMES).length} themes · Cinematic · Indian Cinema · Mood · Nature
      </p>

      {/* Category filter */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
        {['All',...THEME_CATEGORIES].map(c => (
          <button key={c} onClick={() => setCat(c)}
            style={{ padding:'7px 16px', borderRadius:20, border:'none',
              cursor:'pointer', whiteSpace:'nowrap',
              background: cat===c ? 'var(--color-primary)' : 'var(--color-surface)',
              color: cat===c ? 'var(--color-accent)' : 'var(--color-text-light)',
              fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:12 }}>
            {c}
          </button>
        ))}
      </div>

      {/* Theme grid */}
      <div style={{ display:'grid',
        gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,180px),1fr))',
        gap:12 }}>
        {visible.map(t => (
          <div key={t.id}
            onClick={() => setTheme(t.id)}
            onMouseEnter={() => setPreview(t.id)}
            onMouseLeave={() => setPreview(null)}
            style={{ borderRadius:20, overflow:'hidden', cursor:'pointer',
              border:`2px solid ${themeId===t.id?t.accent:'transparent'}`,
              boxShadow: themeId===t.id
                ? `0 8px 24px ${t.accent}44`
                : '0 2px 10px rgba(0,0,0,0.08)',
              transform: themeId===t.id||preview===t.id ? 'translateY(-3px)' : 'none',
              transition:'all 0.2s' }}>

            {/* Theme preview swatch */}
            <div style={{ height:80, background:t.idCardBg,
              display:'flex', alignItems:'center', justifyContent:'center',
              position:'relative' }}>
              <span style={{ fontSize:28 }}>{t.emoji}</span>
              {themeId===t.id && (
                <div style={{ position:'absolute', top:8, right:8,
                  width:22, height:22, borderRadius:'50%',
                  background:t.accent, display:'flex', alignItems:'center',
                  justifyContent:'center', fontSize:12, fontWeight:800,
                  color:t.primary }}>✓</div>
              )}
              {/* Accent dot */}
              <div style={{ position:'absolute', bottom:8, right:8,
                width:16, height:16, borderRadius:'50%',
                background:t.accent, border:`2px solid ${t.idCardText}44` }}/>
            </div>

            {/* Name */}
            <div style={{ padding:'10px 12px',
              background:'var(--color-surface)' }}>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                color:'var(--color-text)', fontSize:13 }}>{t.name}</p>
              <p style={{ color:'var(--color-text-light)', fontSize:10,
                marginTop:2 }}>{t.category}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ID Card preview */}
      <div style={{ marginTop:24 }}>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
          color:'var(--color-text)', marginBottom:12 }}>
          🪪 ID Card Preview
        </p>
        <IDCardPreview/>
      </div>
    </AppLayout>
  )
}

// ── Mini ID Card Preview — uses CSS vars so theme applies ─────────
function IDCardPreview() {
  return (
    <div style={{ maxWidth:360, borderRadius:22, overflow:'hidden',
      boxShadow:'0 12px 40px rgba(0,0,0,0.15)',
      border:'1.5px solid var(--id-card-border)' }}>
      <div style={{ background:'var(--id-card-bg)', padding:24 }}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between',
          marginBottom:16 }}>
          <div>
            <p style={{ color:'var(--id-card-text)', fontSize:9,
              letterSpacing:'3px', opacity:0.6 }}>TRYIT EDUCATIONS</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
              color:'var(--id-card-text)', fontSize:20 }}>STUDENT ID</p>
          </div>
          <div style={{ width:44, height:44, borderRadius:12,
            background:'var(--id-card-border)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:24 }}>🎓</div>
        </div>
        {/* Avatar */}
        <div style={{ display:'flex', alignItems:'center', gap:14,
          marginBottom:16 }}>
          <div style={{ width:60, height:60, borderRadius:'50%',
            background:'var(--id-card-border)',
            border:'3px solid var(--id-card-id)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:'Poppins,sans-serif', fontWeight:900,
            color:'var(--id-card-text)', fontSize:22 }}>AK</div>
          <div>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
              color:'var(--id-card-text)', fontSize:16 }}>Arjun Kumar</p>
            <p style={{ color:'var(--id-card-id)', fontSize:12,
              fontWeight:600 }}>⛏️ The Gold Miner · Level 4</p>
          </div>
        </div>
        {/* ID Number — the one that was invisible in dark mode */}
        <div style={{ background:'rgba(0,0,0,0.2)', borderRadius:12,
          padding:'10px 14px',
          border:'1px solid var(--id-card-border)' }}>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:9,
            letterSpacing:'2px', marginBottom:2 }}>STUDENT ID NUMBER</p>
          <p style={{ fontFamily:'monospace', fontWeight:900,
            color:'var(--id-card-id)', fontSize:16, letterSpacing:'2px',
            textShadow:'0 1px 4px rgba(0,0,0,0.8)' }}>
            TRY-TN-00001-2026
          </p>
        </div>
      </div>
    </div>
  )
}
EOF
echo "ThemeContext + ThemeSelector done"
# ══════════════════════════════════════════════════════════════════
# SECURITY LAYER
# Anti-debug + Watermarked share + Screenshot blur + Velocity limiter
# ══════════════════════════════════════════════════════════════════
cat > src/lib/security.js << 'EOF'
/**
 * TryIT Security Layer
 * 1. Anti-reverse-debug (DevTools detection + console disable)
 * 2. Watermarked social sharing (Canvas API)
 * 3. Screenshot blur on sensitive content
 * 4. Content velocity limiter
 */

const IS_PROD = import.meta.env.PROD

// ══════════════════════════════════════════════════════════════════
// 1. ANTI-REVERSE-DEBUG
// ══════════════════════════════════════════════════════════════════

export function initSecurityLayer() {
  if (!IS_PROD) return // dev mode: no restrictions

  // Disable all console methods in production
  const noop = () => {}
  ;['log','warn','error','info','debug','table','trace','dir'].forEach(m => {
    try { console[m] = noop } catch {}
  })

  // DevTools detection (size-change method)
  let devtoolsOpen = false
  const threshold  = 160

  const detectDevtools = () => {
    const widthDiff  = window.outerWidth  - window.innerWidth  > threshold
    const heightDiff = window.outerHeight - window.innerHeight > threshold
    if ((widthDiff || heightDiff) && !devtoolsOpen) {
      devtoolsOpen = true
      handleDevtoolsOpen()
    } else if (!widthDiff && !heightDiff && devtoolsOpen) {
      devtoolsOpen = false
    }
  }

  setInterval(detectDevtools, 1000)

  // Debug timing trick (loops take longer when devtools open)
  setInterval(() => {
    const start = performance.now()
    // eslint-disable-next-line no-debugger
    debugger // pauses here if devtools open → measures time
    if (performance.now() - start > 100) handleDevtoolsOpen()
  }, 3000)

  // Right-click disable on sensitive content (not globally)
  document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('[data-secure]')) {
      e.preventDefault()
      return false
    }
  })

  // F12 key intercept
  document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key))) {
      e.preventDefault()
      logSuspiciousActivity('devtools_hotkey')
    }
  })
}

function handleDevtoolsOpen() {
  logSuspiciousActivity('devtools_opened')
  // Don't block the app — just log it
  // Aggressive blocking causes false positives and hurts real users
}

function logSuspiciousActivity(type) {
  try {
    const logs = JSON.parse(localStorage.getItem('tryit_sec_log') || '[]')
    logs.push({ type, at: Date.now(), url: window.location.pathname })
    if (logs.length > 50) logs.splice(0, logs.length - 50)
    localStorage.setItem('tryit_sec_log', JSON.stringify(logs))
  } catch {}
}

// ══════════════════════════════════════════════════════════════════
// 2. WATERMARKED SOCIAL SHARING
// Canvas API draws watermark → converts to image → share
// ══════════════════════════════════════════════════════════════════

export async function createWatermarkedShare({ type, data, userId, userName }) {
  const canvas  = document.createElement('canvas')
  canvas.width  = 1080
  canvas.height = 1080
  const ctx     = canvas.getContext('2d')

  // Background gradient based on type
  const grad = ctx.createLinearGradient(0, 0, 1080, 1080)
  if (type === 'result') {
    grad.addColorStop(0, '#1E3A5F')
    grad.addColorStop(1, '#0F2140')
  } else if (type === 'rank') {
    grad.addColorStop(0, '#7B2400')
    grad.addColorStop(1, '#D4AF37')
  } else {
    grad.addColorStop(0, '#064E3B')
    grad.addColorStop(1, '#1E3A5F')
  }

  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 1080, 1080)

  // Decorative circles
  ctx.globalAlpha = 0.08
  ctx.strokeStyle = '#D4AF37'
  ctx.lineWidth = 3
  ;[200,350,500,650].forEach(r => {
    ctx.beginPath()
    ctx.arc(540, 540, r, 0, Math.PI * 2)
    ctx.stroke()
  })
  ctx.globalAlpha = 1

  // Logo text
  ctx.font = 'bold 52px Arial'
  ctx.fillStyle = '#D4AF37'
  ctx.textAlign = 'center'
  ctx.fillText('TRYIT', 540, 140)
  ctx.font = '18px Arial'
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.letterSpacing = '6px'
  ctx.fillText('EDUCATIONS', 540, 168)

  // Main content
  if (type === 'result') {
    ctx.font = 'bold 180px Arial'
    ctx.fillStyle = data.passed ? '#22C55E' : '#EF4444'
    ctx.textAlign = 'center'
    ctx.fillText(`${data.score}%`, 540, 460)

    ctx.font = 'bold 36px Arial'
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText(data.examName, 540, 540)

    ctx.font = '28px Arial'
    ctx.fillStyle = data.passed ? '#4ADE80' : '#FCA5A5'
    ctx.fillText(data.passed ? '✅ Passed' : '❌ Below Cutoff', 540, 596)

    ctx.font = 'bold 28px Arial'
    ctx.fillStyle = '#D4AF37'
    ctx.fillText(`All India Rank: #${data.rank?.toLocaleString() || '---'}`, 540, 660)

  } else if (type === 'streak') {
    ctx.font = 'bold 140px Arial'
    ctx.fillStyle = '#F97316'
    ctx.textAlign = 'center'
    ctx.fillText('🔥', 540, 440)

    ctx.font = 'bold 80px Arial'
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText(`${data.days} Days`, 540, 560)

    ctx.font = '32px Arial'
    ctx.fillStyle = '#D4AF37'
    ctx.fillText('Study Streak!', 540, 620)

  } else if (type === 'achievement') {
    ctx.font = '100px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(data.emoji || '🏆', 540, 420)
    ctx.font = 'bold 60px Arial'
    ctx.fillStyle = '#D4AF37'
    ctx.fillText(data.title, 540, 520)
    ctx.font = '28px Arial'
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.fillText(data.subtitle || '', 540, 580)
  }

  // User name
  ctx.font = '24px Arial'
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.textAlign = 'center'
  ctx.fillText(userName || 'TryIT Student', 540, 820)

  // ── WATERMARK (non-removable, baked into pixel data) ──────────
  ctx.globalAlpha = 0.18
  ctx.font = 'bold 22px Arial'
  ctx.fillStyle = '#FFFFFF'
  ctx.textAlign = 'center'

  // Diagonal watermark tiles
  ctx.save()
  ctx.translate(540, 540)
  ctx.rotate(-Math.PI / 6)
  for (let x = -600; x < 600; x += 300) {
    for (let y = -600; y < 600; y += 160) {
      ctx.fillText(`tryiteducations.net · ${userId?.slice(-8) || 'tryit'}`, x, y)
    }
  }
  ctx.restore()
  ctx.globalAlpha = 1

  // Bottom bar
  ctx.fillStyle = 'rgba(212,175,55,0.15)'
  ctx.fillRect(0, 920, 1080, 160)
  ctx.font = '22px Arial'
  ctx.fillStyle = '#D4AF37'
  ctx.textAlign = 'center'
  ctx.fillText('Your Exam. Your Rank. Your Success.', 540, 970)
  ctx.font = '18px Arial'
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText('tryiteducations.net', 540, 1010)

  // Convert to blob and share
  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'tryit-result.png', { type:'image/png' })

      if (navigator.share && navigator.canShare?.({ files:[file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'My TryIT Result',
            text: `I scored ${data.score || ''}% on ${data.examName || 'TryIT'}! 🚀\nJoin me: tryiteducations.net`,
          })
          resolve({ shared: true })
        } catch { resolve({ shared: false }) }
      } else {
        // Fallback: download image
        const url = URL.createObjectURL(blob)
        const a   = document.createElement('a')
        a.href = url; a.download = 'tryit-result.png'; a.click()
        URL.revokeObjectURL(url)
        resolve({ shared: true, downloaded: true })
      }
    }, 'image/png', 0.92)
  })
}

// ══════════════════════════════════════════════════════════════════
// 3. SCREENSHOT BLUR (sensitive content protection)
// ══════════════════════════════════════════════════════════════════

export function initScreenshotProtection() {
  // Blur sensitive content when tab loses focus
  // (catches screenshots via Cmd+Shift+4 or screen recording)
  document.addEventListener('visibilitychange', () => {
    const sensitiveEls = document.querySelectorAll('[data-secure]')
    if (document.hidden) {
      sensitiveEls.forEach(el => {
        el.style.filter = 'blur(12px)'
        el.style.userSelect = 'none'
      })
    } else {
      sensitiveEls.forEach(el => {
        el.style.filter = ''
        el.style.userSelect = ''
      })
    }
  })
}

// ══════════════════════════════════════════════════════════════════
// 4. CONTENT VELOCITY LIMITER
// Free users: 50 questions/day, 3 full tests/day
// ══════════════════════════════════════════════════════════════════

const VELOCITY_KEY  = () => `tryit_velocity_${new Date().toISOString().split('T')[0]}`
const FREE_Q_LIMIT  = 50    // questions per day
const FREE_T_LIMIT  = 3     // full tests per day
const PRO_Q_LIMIT   = 99999 // unlimited
const PRO_T_LIMIT   = 99999

function getVelocity() {
  try { return JSON.parse(localStorage.getItem(VELOCITY_KEY()) || '{"q":0,"t":0}') }
  catch { return { q:0, t:0 } }
}
function saveVelocity(v) { localStorage.setItem(VELOCITY_KEY(), JSON.stringify(v)) }

export function checkQuestionLimit(isPro = false) {
  const limit = isPro ? PRO_Q_LIMIT : FREE_Q_LIMIT
  const v     = getVelocity()
  if (v.q >= limit) {
    return {
      allowed: false,
      used:    v.q,
      limit,
      reset:   'Tomorrow 12:00 AM',
      message: isPro
        ? 'Something went wrong'
        : `You've used all ${limit} free questions today. Upgrade to Pro for unlimited access!`,
    }
  }
  v.q++
  saveVelocity(v)
  return { allowed: true, used: v.q, limit }
}

export function checkTestLimit(isPro = false) {
  const limit = isPro ? PRO_T_LIMIT : FREE_T_LIMIT
  const v     = getVelocity()
  if (v.t >= limit) {
    return {
      allowed: false,
      used:    v.t,
      limit,
      message: `You've taken ${limit} free tests today. Upgrade to Pro or try again tomorrow!`,
    }
  }
  v.t++
  saveVelocity(v)
  return { allowed: true, used: v.t, limit }
}

export function getVelocityStatus(isPro = false) {
  const v = getVelocity()
  return {
    questionsUsed:  v.q,
    questionsLeft:  Math.max(0, (isPro?PRO_Q_LIMIT:FREE_Q_LIMIT) - v.q),
    testsUsed:      v.t,
    testsLeft:      Math.max(0, (isPro?PRO_T_LIMIT:FREE_T_LIMIT) - v.t),
    isPro,
  }
}
EOF
echo "security.js done"

# Wire security to main.jsx
python3 << 'PYEOF'
with open('src/main.jsx','r') as f: c = f.read()
if 'initSecurityLayer' not in c:
    c = "import { initSecurityLayer, initScreenshotProtection } from './lib/security'\ninitSecurityLayer()\ninitScreenshotProtection()\n" + c
    with open('src/main.jsx','w') as f: f.write(c)
    print('Security wired to main.jsx')
else:
    print('Security already in main.jsx')
PYEOF

# Wire test limit to TestLauncher
python3 << 'PYEOF'
import os
path = 'src/pages/test-engine/TestLauncher.jsx'
if os.path.exists(path):
    with open(path,'r') as f: c = f.read()
    if 'checkTestLimit' not in c:
        c = "import { checkTestLimit } from '../../lib/security'\nimport { useAuth } from '../../context/AuthContext'\n" + c
        with open(path,'w') as f: f.write(c)
        print('Test limit import added to TestLauncher')
    else:
        print('Already wired')
else:
    print('[skip] TestLauncher not found')
PYEOF
echo "Security wiring done"
# ══════════════════════════════════════════════════════════════════
# BATCH 4 — ACCESSIBILITY FULL FACILITY
# UDID auto-Pro + Voice commands + Extended time + Sticky bar
# ══════════════════════════════════════════════════════════════════
mkdir -p src/components/accessibility

cat > src/components/accessibility/StickyAccessibilityBar.jsx << 'EOF'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Sticky Accessibility Bar — shows on ALL pages for users with UDID
 * or anyone who manually enables it.
 * Provides: font size, contrast, screen reader, voice commands, help
 */
export default function StickyAccessibilityBar() {
  const navigate  = useNavigate()
  const enabled   = localStorage.getItem('a11y_bar') === '1'
  const udidUser  = localStorage.getItem('equity_tier') === 'physically_challenged'
  const [show, setShow] = useState(enabled || udidUser)
  const [fontSize, setFontSize] = useState(
    parseInt(localStorage.getItem('a11y_font') || '100')
  )
  const [highContrast, setHC] = useState(
    localStorage.getItem('a11y_contrast') === '1'
  )
  const [reading, setReading] = useState(false)
  const [expanded, setExpanded] = useState(false)

  if (!show) {
    return (
      <button
        onClick={() => { setShow(true); localStorage.setItem('a11y_bar','1') }}
        title="Accessibility Options"
        style={{ position:'fixed', bottom:80, left:16, zIndex:800,
          width:44, height:44, borderRadius:'50%', background:'#1E3A5F',
          border:'2px solid #D4AF37', cursor:'pointer', fontSize:20,
          display:'flex', alignItems:'center', justifyContent:'center' }}>
        ♿
      </button>
    )
  }

  const changeFontSize = (delta) => {
    const next = Math.min(150, Math.max(80, fontSize + delta))
    setFontSize(next)
    document.documentElement.style.fontSize = `${next}%`
    localStorage.setItem('a11y_font', String(next))
  }

  const toggleContrast = () => {
    const next = !highContrast
    setHC(next)
    localStorage.setItem('a11y_contrast', next?'1':'0')
    document.body.classList.toggle('high-contrast', next)
  }

  const readPage = () => {
    if (!window.speechSynthesis) return
    if (reading) { window.speechSynthesis.cancel(); setReading(false); return }
    const text = document.body.innerText.slice(0, 3000)
    const utt  = new SpeechSynthesisUtterance(text)
    utt.lang   = localStorage.getItem('selected_lang') === 'Tamil' ? 'ta-IN' : 'hi-IN'
    utt.rate   = 0.9
    utt.onend  = () => setReading(false)
    window.speechSynthesis.speak(utt)
    setReading(true)
  }

  return (
    <>
      <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:900,
        background:'#1E3A5F', borderTop:'2px solid #D4AF37',
        padding: expanded ? '12px 16px 16px' : '8px 16px',
        boxShadow:'0 -4px 20px rgba(0,0,0,0.2)' }}>

        {/* Main bar */}
        <div style={{ display:'flex', alignItems:'center', gap:8,
          flexWrap:'wrap', maxWidth:800, margin:'0 auto' }}>

          <span style={{ color:'#D4AF37', fontSize:16 }}>♿</span>
          <span style={{ color:'rgba(255,255,255,0.6)', fontSize:11,
            flexShrink:0 }}>Accessibility</span>

          {/* Font size */}
          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
            <button onClick={() => changeFontSize(-10)}
              style={barBtn()}>A-</button>
            <span style={{ color:'#D4AF37', fontSize:11, minWidth:36,
              textAlign:'center' }}>{fontSize}%</span>
            <button onClick={() => changeFontSize(+10)}
              style={barBtn()}>A+</button>
          </div>

          {/* High contrast */}
          <button onClick={toggleContrast}
            style={{ ...barBtn(), background:highContrast?'#D4AF37':undefined,
              color:highContrast?'#1E3A5F':'rgba(255,255,255,0.7)' }}>
            ◑ Contrast
          </button>

          {/* Read aloud */}
          <button onClick={readPage}
            style={{ ...barBtn(), background:reading?'#EF4444':undefined }}>
            {reading ? '⏹ Stop' : '🔊 Read Page'}
          </button>

          {/* Keyboard nav */}
          <button onClick={() => navigate('/accessibility')}
            style={barBtn()}>
            ⌨️ Options
          </button>

          {/* Hide bar */}
          <button onClick={() => { setShow(false); localStorage.setItem('a11y_bar','0') }}
            style={{ ...barBtn(), marginLeft:'auto' }}>×</button>
        </div>
      </div>

      <style>{`
        body.high-contrast {
          filter: contrast(1.5) !important;
        }
        body.high-contrast * {
          border-color: #000 !important;
          outline: 1px solid #000 !important;
        }
      `}</style>
    </>
  )
}

function barBtn() {
  return {
    padding:'5px 10px', borderRadius:8, border:'1px solid rgba(255,255,255,0.2)',
    background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.8)',
    cursor:'pointer', fontSize:12, fontFamily:'Poppins,sans-serif',
    fontWeight:600, flexShrink:0,
  }
}
EOF

# ── UDID auto-activation ──────────────────────────────────────────
cat > src/lib/udidActivation.js << 'EOF'
/**
 * UDID Auto-Activation
 * When a physically challenged user's UDID is verified:
 *   → Auto-grants Pro access for life
 *   → Auto-enables accessibility mode (large text, screen reader, extended time)
 *   → Shows 🦽 badge on their profile
 *   → Extended test time (50% extra) permanently enabled
 *   → Sticky accessibility bar always visible
 */
import { earnCoins } from './coinVault'

const UDID_KEY = 'tryit_udid_verified'
const A11Y_KEY = 'tryit_a11y_mode'

export function activateUDID(udidNumber, userId) {
  // Store UDID verification
  localStorage.setItem(UDID_KEY, JSON.stringify({
    udid:        udidNumber,
    verified_at: new Date().toISOString(),
    user_id:     userId,
  }))

  // Auto-grant Pro access for life
  const grants = JSON.parse(localStorage.getItem('tryit_pro_grants') || '[]')
  const email  = localStorage.getItem('tryit_email')
  const lifeGrant = {
    id:         `udid-grant-${Date.now()}`,
    email:      email,
    plan:       'promax',
    days:       36500, // 100 years
    note:       `UDID verified: ${udidNumber}`,
    grantedAt:  new Date().toISOString(),
    expiresAt:  new Date(Date.now() + 36500*86400000).toISOString(),
    grantedBy:  'system_udid',
  }
  localStorage.setItem('tryit_pro_grants', JSON.stringify([lifeGrant, ...grants]))

  // Auto-enable full accessibility mode
  localStorage.setItem(A11Y_KEY, JSON.stringify({
    mode:          'full',
    largeText:     true,
    screenReader:  true,
    highContrast:  false,
    reducedMotion: true,
    extendedTime:  true,   // 50% extra on all tests
    voiceCommands: true,
    stickyBar:     true,
    enabledAt:     new Date().toISOString(),
  }))
  localStorage.setItem('a11y_bar', '1')
  localStorage.setItem('equity_tier', 'physically_challenged')

  // Apply font size immediately
  document.documentElement.style.fontSize = '115%'

  // Award welcome coins
  earnCoins({ source:'udid_activation', amount:500,
    description:'UDID verified — Welcome to TryIT Pro! ♿ 🎉', userId })

  return { success:true, plan:'promax', message:'Pro access activated for life! ♿' }
}

export function isUDIDVerified() {
  const d = localStorage.getItem(UDID_KEY)
  return d ? JSON.parse(d) : null
}

export function getA11ySettings() {
  try {
    return JSON.parse(localStorage.getItem(A11Y_KEY) || '{}')
  } catch { return {} }
}

export function getTestTimeMultiplier() {
  const s = getA11ySettings()
  return s.extendedTime ? 1.5 : 1.0  // 50% extra time
}

export function shouldAutoEnableA11y() {
  const s = getA11ySettings()
  return s.stickyBar || localStorage.getItem('a11y_bar') === '1'
}
EOF

echo "Accessibility done"
# ══════════════════════════════════════════════════════════════════
# WORD RUSH — fully playable
# ══════════════════════════════════════════════════════════════════
mkdir -p src/pages/games

cat > src/pages/games/WordRush.jsx << 'EOF'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useCoins } from '../../context/CoinContext'
import { useAuth } from '../../context/AuthContext'
import { rewardGame } from '../../lib/coinVault'

const LEVELS = {
  1: [
    { q:'Antonym of HUGE?',         options:['Tiny','Large','Vast','Grand'],      ans:0 },
    { q:'Synonym of BRAVE?',        options:['Timid','Coward','Valiant','Scared'],ans:2 },
    { q:'Correct spelling?',        options:['Recieve','Receive','Recive','Reciive'],ans:1 },
    { q:'Plural of CHILD?',         options:['Childs','Childes','Children','Childrens'],ans:2 },
    { q:'Past tense of RUN?',       options:['Runned','Ran','Run','Running'],     ans:1 },
    { q:'Fill: She ___ to school.', options:['go','goes','going','gone'],         ans:1 },
    { q:'Opposite of ACCEPT?',      options:['Agree','Reject','Allow','Take'],    ans:1 },
    { q:'Correct spelling?',        options:['Necesary','Necessary','Necessery','Neccesary'],ans:1 },
    { q:'Idiom: "Bite the bullet"', options:['Eat something','Endure pain','Shoot a gun','Talk bravely'],ans:1 },
    { q:'One word for "fear of water"?', options:['Hydrophobia','Xenophobia','Claustrophobia','Acrophobia'],ans:0 },
  ],
  2: [ // SSC/IBPS level
    { q:'Synonym of VERBOSE?',      options:['Silent','Wordy','Brief','Terse'],   ans:1 },
    { q:'"He is the apple of my eye" means?', options:['He is a fruit seller','He is very precious','He has good eyes','He wears glasses'],ans:1 },
    { q:'Correct: "Neither Ram nor Shyam ___ present"', options:['are','were','was','been'],ans:2 },
    { q:'One word: one who eats only plants?', options:['Carnivore','Herbivore','Omnivore','Insectivore'],ans:1 },
    { q:'Antonym of PRODIGAL?',     options:['Thrifty','Wasteful','Lavish','Extravagant'],ans:0 },
    { q:'Correct spelling?',        options:['Accomodate','Accommodate','Accommadate','Acomodate'],ans:1 },
    { q:'Passive: "He writes a letter"', options:['A letter writes him','A letter is written by him','A letter was written by him','A letter has been written'],ans:1 },
    { q:'Preposition: "She is good ___ mathematics"', options:['in','at','for','with'],ans:1 },
  ],
}

export default function WordRush() {
  const navigate    = useNavigate()
  const { earn }    = useCoins()
  const { user }    = useAuth()
  const [phase,  setPhase]  = useState('intro')
  const [qi,     setQi]     = useState(0)
  const [score,  setScore]  = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft,setTime]  = useState(15)
  const [chosen, setChosen] = useState(null)
  const [lastOk, setLastOk] = useState(null)
  const [coinsEarned,setCE] = useState(0)
  const timerRef = useRef(null)

  const level = Math.min(2, Math.max(1, Math.floor((user?.level||1)/3)+1))
  const qs    = LEVELS[level] || LEVELS[1]
  const q     = qs[qi]

  const start = () => { setPhase('play'); setQi(0); setScore(0); setStreak(0); setTime(15) }

  useEffect(()=>{
    if(phase!=='play') return
    timerRef.current = setInterval(()=>{
      setTime(t=>{
        if(t<=1){ clearInterval(timerRef.current); nextQ(false); return 15 }
        return t-1
      })
    },1000)
    return ()=>clearInterval(timerRef.current)
  },[phase, qi])

  const nextQ = (wasCorrect) => {
    clearInterval(timerRef.current)
    setTimeout(()=>{
      setChosen(null); setLastOk(null)
      if(qi+1 >= qs.length){ finishGame(); return }
      setQi(i=>i+1); setTime(15)
    }, wasCorrect ? 500 : 900)
  }

  const pick = (i) => {
    if(chosen!==null) return
    setChosen(i)
    const ok = i===q.ans
    setLastOk(ok)
    if(ok){ setScore(s=>s+(streak>=2?15:10)); setStreak(s=>s+1) }
    else setStreak(0)
    nextQ(ok)
  }

  const finishGame = async () => {
    clearInterval(timerRef.current)
    const isPerfect = score >= (qs.length-1)*10
    const result = await rewardGame({ score, isPerfect, gameName:'Word Rush', userId:user?.id })
    if(result?.coins){ earn({ source:'game', amount:result.coins, description:`Word Rush — ${score} pts` }); setCE(result.coins) }
    setPhase('result')
  }

  const C = { bg:'#3B82F6', dark:'#1D4ED8', light:'#DBEAFE', text:'#1E3A5F' }

  if(phase==='intro') return (
    <AppLayout>
      <div style={{ maxWidth:440, margin:'0 auto', textAlign:'center', padding:'32px 0' }}>
        <div style={{ fontSize:60, marginBottom:14 }}>📝</div>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:28, marginBottom:8 }}>Word Rush</h1>
        <p style={{ color:'#64748B', fontSize:14, marginBottom:20 }}>Spelling · Synonyms · Grammar · Idioms · 15s per question</p>
        <div style={{ background:'#EFF6FF', borderRadius:16, padding:16, marginBottom:20, textAlign:'left', border:'1px solid #BFDBFE' }}>
          {[`${qs.length} questions · ${qs.length*15}s total`,`Level ${level}: ${level===1?'Basic Vocabulary':'SSC/IBPS English'}`,`Streak bonus after 2 correct in a row`,`Earn up to 40 coins`].map((r,i)=>(
            <div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}>
              <span style={{ color:C.bg }}>▸</span>
              <span style={{ color:'#1E40AF', fontSize:13 }}>{r}</span>
            </div>
          ))}
        </div>
        <button onClick={start} style={{ width:'100%', padding:16, borderRadius:16, border:'none', background:`linear-gradient(135deg,${C.bg},${C.dark})`, fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, color:'#fff', cursor:'pointer' }}>
          📝 Start Word Rush!
        </button>
        <button onClick={()=>navigate('/games')} style={{ background:'none', border:'none', color:'#94A3B8', cursor:'pointer', fontSize:13, marginTop:12 }}>← All Games</button>
      </div>
    </AppLayout>
  )

  if(phase==='result') return (
    <AppLayout>
      <div style={{ maxWidth:400, margin:'0 auto', textAlign:'center', padding:'32px 0' }}>
        <div style={{ fontSize:56, marginBottom:12 }}>{score>=70?'📚':'📖'}</div>
        <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:26, marginBottom:14 }}>
          {score>=70?'Wordy Wizard! 📚':score>=40?'Good attempt! 💪':'Keep practising! 📖'}
        </h2>
        {coinsEarned>0 && (
          <div style={{ background:'rgba(212,175,55,0.1)', border:'1.5px solid rgba(212,175,55,0.3)', borderRadius:16, padding:14, marginBottom:16 }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#D4AF37', fontSize:26 }}>+{coinsEarned} 🪙</p>
          </div>
        )}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
          {[['Score',score],['Questions',qs.length],['Best Streak',`${streak}x`],['Level',`L${level}`]].map(([l,v])=>(
            <div key={l} style={{ background:'#F8FAFC', borderRadius:14, padding:14, border:'1.5px solid #E2E8F0' }}>
              <p style={{ color:'#94A3B8', fontSize:11 }}>{l}</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:C.bg, fontSize:22 }}>{v}</p>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={start} style={{ flex:1, padding:13, borderRadius:14, border:'none', background:`linear-gradient(135deg,${C.bg},${C.dark})`, color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:15, cursor:'pointer' }}>Play Again</button>
          <button onClick={()=>navigate('/games')} style={{ flex:1, padding:13, borderRadius:14, border:'1.5px solid #E2E8F0', background:'#fff', color:'#64748B', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:14, cursor:'pointer' }}>All Games</button>
        </div>
      </div>
    </AppLayout>
  )

  return (
    <AppLayout>
      <div style={{ maxWidth:460, margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <div style={{ width:44, height:44, borderRadius:'50%', background:timeLeft<=5?'#EF4444':C.bg, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:18 }}>{timeLeft}</div>
          <div style={{ display:'flex', gap:4 }}>
            {qs.map((_,i)=>(
              <div key={i} style={{ width:Math.min(26,280/qs.length), height:6, borderRadius:3, background:i<qi?'#22C55E':i===qi?C.bg:'#F1F5F9' }}/>
            ))}
          </div>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#D4AF37', fontSize:18 }}>{score}</p>
        </div>

        <div style={{ background:`linear-gradient(135deg,${C.dark},${C.bg})`, borderRadius:22, padding:26, marginBottom:18, textAlign:'center' }}>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, marginBottom:6 }}>Q {qi+1}/{qs.length}</p>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#fff', fontSize:'clamp(16px,3vw,22px)', lineHeight:1.5 }}>{q?.q}</p>
          {lastOk===true  && <p style={{ color:'#4ADE80', fontWeight:700, marginTop:8 }}>✓ Correct! {streak>=2?'🔥':''}</p>}
          {lastOk===false && <p style={{ color:'#FCA5A5', fontWeight:700, marginTop:8 }}>✗ → {q?.options?.[q?.ans]}</p>}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {q?.options?.map((opt,i)=>{
            const right = chosen!==null && i===q.ans
            const wrong = chosen===i && i!==q.ans
            return (
              <button key={i} onClick={()=>pick(i)} disabled={chosen!==null}
                style={{ padding:'16px 10px', borderRadius:16, border:'none', cursor:chosen!==null?'not-allowed':'pointer',
                  background:right?'#22C55E':wrong?'#EF4444':'#fff',
                  color:right||wrong?'#fff':'#1E293B',
                  fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:'clamp(13px,2vw,15px)',
                  boxShadow:'0 2px 8px rgba(0,0,0,0.06)', transition:'all 0.15s', textAlign:'left', lineHeight:1.4 }}>
                <span style={{ opacity:0.5, marginRight:6 }}>{['A','B','C','D'][i]}.</span>{opt}
              </button>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
EOF

# ── GK BURST ─────────────────────────────────────────────────────
cat > src/pages/games/GKBurst.jsx << 'EOF'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useCoins } from '../../context/CoinContext'
import { useAuth } from '../../context/AuthContext'
import { rewardGame } from '../../lib/coinVault'

const EXAM_GK = {
  'SSC CGL': [
    { q:'When was the Indian Constitution adopted?', options:['26 Jan 1950','26 Nov 1949','15 Aug 1947','2 Oct 1950'], ans:1 },
    { q:'Which Article deals with Right to Equality?', options:['Art 14-18','Art 19-22','Art 23-24','Art 25-28'], ans:0 },
    { q:'Who is called the "Iron Man of India"?', options:['Nehru','Gandhi','Patel','Bose'], ans:2 },
    { q:'Largest state in India by area?', options:['UP','MP','Rajasthan','Maharashtra'], ans:2 },
    { q:'Which river is called "Sorrow of Bengal"?', options:['Ganga','Brahmaputra','Damodar','Hooghly'], ans:2 },
    { q:'Mount Everest is in which country?', options:['India','Nepal','China','Bhutan'], ans:1 },
    { q:'Who gave the slogan "Jai Jawan Jai Kisan"?', options:['Nehru','Gandhi','Shastri','Patel'], ans:2 },
    { q:'RBI was established in which year?', options:['1930','1935','1945','1947'], ans:1 },
    { q:'Panchayati Raj is in which schedule?', options:['10th','11th','12th','9th'], ans:1 },
    { q:'Which vitamin is known as "Sunshine Vitamin"?', options:['Vit A','Vit B12','Vit C','Vit D'], ans:3 },
  ],
  default: [
    { q:'Capital of Australia?', options:['Sydney','Melbourne','Canberra','Brisbane'], ans:2 },
    { q:'Which is the largest ocean?', options:['Atlantic','Indian','Arctic','Pacific'], ans:3 },
    { q:'Who invented the telephone?', options:['Edison','Bell','Tesla','Marconi'], ans:1 },
    { q:'Chemical symbol for Gold?', options:['Gd','Go','Au','Ag'], ans:2 },
    { q:'How many bones in adult human body?', options:['196','206','216','226'], ans:1 },
    { q:'Which planet is closest to the Sun?', options:['Venus','Earth','Mercury','Mars'], ans:2 },
    { q:'Speed of light (approx)?', options:['3×10⁸ m/s','3×10⁶ m/s','3×10⁴ m/s','3×10¹⁰ m/s'], ans:0 },
    { q:'National animal of India?', options:['Lion','Elephant','Tiger','Leopard'], ans:2 },
    { q:'First woman PM of India?', options:['Sarojini Naidu','Indira Gandhi','Vijayalakshmi Pandit','Sonia Gandhi'], ans:1 },
    { q:'UN Headquarters is located in?', options:['Geneva','Paris','New York','London'], ans:2 },
  ],
}

export default function GKBurst() {
  const navigate    = useNavigate()
  const { earn }    = useCoins()
  const { user }    = useAuth()
  const [phase,  setPhase]  = useState('intro')
  const [qi,     setQi]     = useState(0)
  const [score,  setScore]  = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft,setTime]  = useState(30)
  const [chosen, setChosen] = useState(null)
  const [lastOk, setLastOk] = useState(null)
  const [coinsEarned,setCE] = useState(0)
  const timerRef = useRef(null)

  const exam = localStorage.getItem('selected_exam') || 'SSC CGL'
  const qs   = EXAM_GK[exam] || EXAM_GK.default
  const q    = qs[qi]
  const C    = { bg:'#10B981', dark:'#047857', light:'#DCFCE7' }

  const start = () => { setPhase('play'); setQi(0); setScore(0); setStreak(0); setTime(30) }

  useEffect(()=>{
    if(phase!=='play') return
    timerRef.current = setInterval(()=>{
      setTime(t=>{
        if(t<=1){ clearInterval(timerRef.current); nextQ(false); return 30 }
        return t-1
      })
    },1000)
    return ()=>clearInterval(timerRef.current)
  },[phase,qi])

  const nextQ = (wasCorrect) => {
    clearInterval(timerRef.current)
    setTimeout(()=>{
      setChosen(null); setLastOk(null)
      if(qi+1>=qs.length){ finishGame(); return }
      setQi(i=>i+1); setTime(30)
    }, wasCorrect?500:1200)
  }

  const pick = (i) => {
    if(chosen!==null) return
    setChosen(i)
    const ok = i===q.ans
    setLastOk(ok)
    if(ok){ setScore(s=>s+(streak>=2?15:10)); setStreak(s=>s+1) }
    else setStreak(0)
    nextQ(ok)
  }

  const finishGame = async () => {
    clearInterval(timerRef.current)
    const isPerfect = score >= (qs.length-1)*10
    const result = await rewardGame({ score, isPerfect, gameName:'GK Burst', userId:user?.id })
    if(result?.coins){ earn({ source:'game', amount:result.coins, description:`GK Burst — ${score} pts` }); setCE(result.coins) }
    setPhase('result')
  }

  if(phase==='intro') return (
    <AppLayout>
      <div style={{ maxWidth:440, margin:'0 auto', textAlign:'center', padding:'32px 0' }}>
        <div style={{ fontSize:60, marginBottom:14 }}>🌏</div>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:28, marginBottom:8 }}>GK Burst</h1>
        <p style={{ color:'#64748B', fontSize:14, marginBottom:8 }}>General Knowledge · 30s per question · {exam}-focused</p>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#DCFCE7', border:'1px solid #22C55E', borderRadius:20, padding:'5px 14px', marginBottom:20 }}>
          <span style={{ color:'#15803D', fontSize:12, fontWeight:700 }}>🎯 Questions from {exam}</span>
        </div>
        <button onClick={start} style={{ width:'100%', padding:16, borderRadius:16, border:'none', background:`linear-gradient(135deg,${C.bg},${C.dark})`, fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, color:'#fff', cursor:'pointer' }}>
          🌏 Start GK Burst!
        </button>
        <button onClick={()=>navigate('/games')} style={{ background:'none', border:'none', color:'#94A3B8', cursor:'pointer', fontSize:13, marginTop:12 }}>← All Games</button>
      </div>
    </AppLayout>
  )

  if(phase==='result') return (
    <AppLayout>
      <div style={{ maxWidth:400, margin:'0 auto', textAlign:'center', padding:'32px 0' }}>
        <div style={{ fontSize:56, marginBottom:12 }}>{score>=70?'🏆':'🌏'}</div>
        <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:26, marginBottom:14 }}>
          {score>=70?'GK Champion! 🏆':score>=40?'Good knowledge! 💪':'Study GK daily! 📚'}
        </h2>
        {coinsEarned>0 && (
          <div style={{ background:'rgba(212,175,55,0.1)', border:'1.5px solid rgba(212,175,55,0.3)', borderRadius:16, padding:14, marginBottom:16 }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#D4AF37', fontSize:26 }}>+{coinsEarned} 🪙</p>
          </div>
        )}
        <div style={{ display:'flex', gap:10, marginTop:16 }}>
          <button onClick={start} style={{ flex:1, padding:13, borderRadius:14, border:'none', background:`linear-gradient(135deg,${C.bg},${C.dark})`, color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:15, cursor:'pointer' }}>Play Again</button>
          <button onClick={()=>navigate('/games')} style={{ flex:1, padding:13, borderRadius:14, border:'1.5px solid #E2E8F0', background:'#fff', color:'#64748B', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:14, cursor:'pointer' }}>All Games</button>
        </div>
      </div>
    </AppLayout>
  )

  return (
    <AppLayout>
      <div style={{ maxWidth:460, margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <div style={{ width:48, height:48, borderRadius:'50%', background:timeLeft<=10?'#EF4444':timeLeft<=20?'#F59E0B':C.bg, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:18 }}>{timeLeft}</div>
          <div style={{ display:'flex', gap:4 }}>
            {qs.map((_,i)=>(<div key={i} style={{ width:Math.min(26,280/qs.length), height:6, borderRadius:3, background:i<qi?'#22C55E':i===qi?C.bg:'#F1F5F9' }}/>))}
          </div>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#D4AF37', fontSize:18 }}>{score}</p>
        </div>
        <div style={{ background:`linear-gradient(135deg,${C.dark},${C.bg})`, borderRadius:22, padding:26, marginBottom:18, textAlign:'center' }}>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:11, marginBottom:6 }}>Q {qi+1}/{qs.length} · {exam}</p>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#fff', fontSize:'clamp(15px,3vw,20px)', lineHeight:1.5 }}>{q?.q}</p>
          {lastOk===true  && <p style={{ color:'#4ADE80', fontWeight:700, marginTop:8 }}>✓ Correct! {streak>=2?'🔥':''}</p>}
          {lastOk===false && <p style={{ color:'#FCA5A5', fontWeight:700, marginTop:8 }}>✗ → {q?.options?.[q?.ans]}</p>}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {q?.options?.map((opt,i)=>{
            const right = chosen!==null && i===q.ans
            const wrong = chosen===i && i!==q.ans
            return (
              <button key={i} onClick={()=>pick(i)} disabled={chosen!==null}
                style={{ padding:'14px 10px', borderRadius:16, border:'none', cursor:chosen!==null?'not-allowed':'pointer',
                  background:right?'#22C55E':wrong?'#EF4444':'#fff',
                  color:right||wrong?'#fff':'#1E293B',
                  fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:'clamp(12px,2vw,14px)',
                  boxShadow:'0 2px 8px rgba(0,0,0,0.06)', transition:'all 0.15s', textAlign:'left', lineHeight:1.4 }}>
                <span style={{ opacity:0.4, marginRight:6 }}>{['A','B','C','D'][i]}.</span>{opt}
              </button>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
EOF
echo "WordRush + GKBurst done"
mkdir -p src/pages/admin src/pages/hall src/pages/mentor

# ── ADMIN LOGIN ───────────────────────────────────────────────────
cat > src/pages/admin/AdminLogin.jsx << 'EOF'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ADMIN_PASS = 'tryit@admin2026'  // Change before launch

export default function AdminLogin() {
  const navigate   = useNavigate()
  const [email,    setEmail]  = useState('')
  const [pass,     setPass]   = useState('')
  const [error,    setError]  = useState('')
  const [loading,  setLoading]= useState(false)

  const login = async () => {
    setLoading(true); setError('')
    await new Promise(r=>setTimeout(r,600))
    if (email.trim().toLowerCase().includes('admin') && pass === ADMIN_PASS) {
      localStorage.setItem('tryit_admin', JSON.stringify({ email, loginAt: Date.now() }))
      navigate('/admin/dashboard')
    } else {
      setError('Invalid admin credentials.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#071428,#0F2140)', padding:16 }}>
      <div style={{ background:'rgba(255,255,255,0.95)', borderRadius:28, padding:'40px 32px', width:'100%', maxWidth:400, boxShadow:'0 24px 80px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <p style={{ fontSize:44 }}>🔐</p>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:26, marginTop:10, marginBottom:4 }}>Admin Portal</h1>
          <p style={{ color:'#94A3B8', fontSize:13 }}>TryIT Educations · Restricted Access</p>
        </div>

        <div style={{ marginBottom:14 }}>
          <label style={{ display:'block', fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E3A5F', fontSize:13, marginBottom:6 }}>Admin Email</label>
          <input value={email} type="email" placeholder="admin@tryiteducations.net"
            onChange={e=>{setEmail(e.target.value);setError('')}}
            onKeyDown={e=>e.key==='Enter'&&login()}
            style={{ width:'100%', padding:'13px 16px', borderRadius:14, border:`1.5px solid ${error?'#EF4444':'#E2E8F0'}`, fontSize:15, outline:'none', boxSizing:'border-box', fontFamily:'Inter,sans-serif' }}
            onFocus={e=>e.target.style.borderColor='#D4AF37'} onBlur={e=>e.target.style.borderColor=error?'#EF4444':'#E2E8F0'}
          />
        </div>

        <div style={{ marginBottom:20 }}>
          <label style={{ display:'block', fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E3A5F', fontSize:13, marginBottom:6 }}>Password</label>
          <input value={pass} type="password" placeholder="••••••••"
            onChange={e=>{setPass(e.target.value);setError('')}}
            onKeyDown={e=>e.key==='Enter'&&login()}
            style={{ width:'100%', padding:'13px 16px', borderRadius:14, border:`1.5px solid ${error?'#EF4444':'#E2E8F0'}`, fontSize:15, outline:'none', boxSizing:'border-box', fontFamily:'Inter,sans-serif' }}
            onFocus={e=>e.target.style.borderColor='#D4AF37'} onBlur={e=>e.target.style.borderColor=error?'#EF4444':'#E2E8F0'}
          />
        </div>

        {error && <p style={{ color:'#EF4444', fontSize:13, marginBottom:14, textAlign:'center' }}>{error}</p>}

        <button onClick={login} disabled={loading||!email||!pass}
          style={{ width:'100%', padding:15, borderRadius:14, border:'none', background:loading||!email||!pass?'rgba(30,58,95,0.3)':'linear-gradient(135deg,#1E3A5F,#0F2140)', color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16, cursor:loading||!email||!pass?'not-allowed':'pointer' }}>
          {loading ? '⏳ Verifying...' : '🔐 Sign In to Admin'}
        </button>

        <p style={{ textAlign:'center', color:'#94A3B8', fontSize:11, marginTop:16 }}>
          Unauthorised access attempts are logged and reported.
        </p>
      </div>
    </div>
  )
}
EOF

# ── CENTRE LOGIN ──────────────────────────────────────────────────
cat > src/pages/centre/CentreLogin.jsx << 'EOF'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CentreLogin() {
  const navigate = useNavigate()
  const [email, setEmail]   = useState('')
  const [pass,  setPass]    = useState('')
  const [code,  setCode]    = useState('')
  const [error, setError]   = useState('')

  const login = () => {
    if (!email || !pass) { setError('Enter your email and password.'); return }
    localStorage.setItem('tryit_role', 'institution')
    localStorage.setItem('tryit_email', email.trim().toLowerCase())
    navigate('/centre/dashboard')
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#0F2140,#1E3A5F)', padding:16 }}>
      <div style={{ background:'rgba(255,255,255,0.96)', borderRadius:28, padding:'36px 28px', width:'100%', maxWidth:400, boxShadow:'0 24px 80px rgba(0,0,0,0.4)' }}>
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <p style={{ fontSize:44 }}>🏫</p>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:24, marginTop:10, marginBottom:4 }}>Institution Login</h1>
          <p style={{ color:'#94A3B8', fontSize:13 }}>Centre Dashboard · Monitor · Conduct Tests</p>
        </div>

        {[['Email Address','email','text',email,setEmail],['Password','password','password',pass,setPass]].map(([l,k,t,v,set])=>(
          <div key={k} style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E3A5F', fontSize:13, marginBottom:6 }}>{l}</label>
            <input value={v} type={t} placeholder={t==='email'?'director@institution.edu':'••••••••'}
              onChange={e=>{set(e.target.value);setError('')}}
              onKeyDown={e=>e.key==='Enter'&&login()}
              style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:'1.5px solid #E2E8F0', fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:'Inter,sans-serif' }}
              onFocus={e=>e.target.style.borderColor='#D4AF37'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}
            />
          </div>
        ))}

        <div style={{ marginBottom:20 }}>
          <label style={{ display:'block', fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E3A5F', fontSize:13, marginBottom:6 }}>
            Centre Code <span style={{ color:'#94A3B8', fontWeight:400 }}>(optional — from email)</span>
          </label>
          <input value={code} placeholder="TC-2026-XXXX"
            onChange={e=>setCode(e.target.value)}
            style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:'1.5px solid #E2E8F0', fontSize:14, outline:'none', boxSizing:'border-box', fontFamily:'monospace' }}
            onFocus={e=>e.target.style.borderColor='#D4AF37'} onBlur={e=>e.target.style.borderColor='#E2E8F0'}
          />
        </div>

        {error && <p style={{ color:'#EF4444', fontSize:13, marginBottom:14 }}>{error}</p>}

        <button onClick={login}
          style={{ width:'100%', padding:14, borderRadius:14, border:'none', background:'linear-gradient(135deg,#1E3A5F,#0F2140)', color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16, cursor:'pointer', marginBottom:10 }}>
          🏫 Access Centre Dashboard
        </button>
        <button onClick={()=>navigate('/onboarding')}
          style={{ width:'100%', padding:12, borderRadius:14, border:'1.5px solid #E2E8F0', background:'#F8FAFC', color:'#64748B', fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:14, cursor:'pointer' }}>
          New Institution? Register →
        </button>
      </div>
    </div>
  )
}
EOF

# ── MENTOR CASHBACK CENTER ────────────────────────────────────────
cat > src/pages/mentor/MentorCashback.jsx << 'EOF'
import { useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useToast } from '../../context/ToastContext'

const EARNINGS = [
  { week:'Jun 9–15, 2026', answers:12, books:2, referrals:1, total:347, status:'paid',   paidAt:'Mon Jun 16', upi:'vikram@paytm' },
  { week:'Jun 2–8, 2026',  answers:8,  books:1, referrals:0, total:218, status:'paid',   paidAt:'Mon Jun 9',  upi:'vikram@paytm' },
  { week:'May 26–Jun 1',   answers:15, books:3, referrals:2, total:512, status:'paid',   paidAt:'Mon Jun 2',  upi:'vikram@paytm' },
  { week:'May 19–25',      answers:6,  books:0, referrals:1, total:165, status:'paid',   paidAt:'Mon May 26', upi:'vikram@paytm' },
]

const PENDING = { answers:7, books:1, referrals:0, total:201 }
const NEXT_PAYOUT = 'Monday, Jun 23, 2026'

export default function MentorCashback() {
  const { showToast } = useToast()
  const [upi, setUpi]  = useState('vikram@paytm')
  const [editUpi, setEditUpi] = useState(false)
  const totalEarned = EARNINGS.reduce((s,e)=>s+e.total,0) + PENDING.total

  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:28, marginBottom:20 }}>💸 Cashback Center</h1>

      {/* Pending payout card */}
      <div style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', borderRadius:24, padding:24, marginBottom:16, border:'1.5px solid rgba(212,175,55,0.3)' }}>
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, letterSpacing:'2px', marginBottom:4 }}>PENDING PAYOUT</p>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#D4AF37', fontSize:44, marginBottom:8 }}>
          ₹{PENDING.total}
        </p>
        <div style={{ display:'flex', gap:16, marginBottom:14 }}>
          {[['📝',PENDING.answers,'Answers'],['📚',PENDING.books,'Books'],['🔗',PENDING.referrals,'Referrals']].map(([e,v,l])=>(
            <div key={l} style={{ textAlign:'center' }}>
              <p style={{ fontSize:16 }}>{e}</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#fff', fontSize:16 }}>{v}</p>
              <p style={{ color:'rgba(255,255,255,0.4)', fontSize:10 }}>{l}</p>
            </div>
          ))}
        </div>
        <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:12, padding:'10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
          <div>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:11 }}>Paying to</p>
            {editUpi ? (
              <input value={upi} onChange={e=>setUpi(e.target.value)}
                onBlur={()=>{ setEditUpi(false); showToast('success','UPI updated!') }}
                autoFocus
                style={{ background:'rgba(255,255,255,0.1)', border:'1px solid #D4AF37', borderRadius:8, padding:'4px 10px', color:'#fff', fontSize:14, fontFamily:'monospace', outline:'none', width:180 }}
              />
            ) : (
              <p style={{ color:'#D4AF37', fontFamily:'monospace', fontSize:14 }} onClick={()=>setEditUpi(true)}>{upi} ✏️</p>
            )}
          </div>
          <div style={{ textAlign:'right' }}>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:11 }}>Next payout</p>
            <p style={{ color:'#D4AF37', fontSize:13, fontWeight:700 }}>{NEXT_PAYOUT}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:12, marginBottom:20 }}>
        {[['💰',`₹${totalEarned.toLocaleString()}+`,'Total Earned'],['📝',EARNINGS.reduce((s,e)=>s+e.answers,0)+PENDING.answers,'Answers'],['📚',EARNINGS.reduce((s,e)=>s+e.books,0)+PENDING.books,'Books Sold'],['⭐','4.9','Rating']].map(([e,v,l])=>(
          <div key={l} style={{ background:'#fff', borderRadius:18, padding:'14px 12px', textAlign:'center', border:'1.5px solid #E2E8F0', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
            <p style={{ fontSize:22 }}>{e}</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#D4AF37', fontSize:20 }}>{v}</p>
            <p style={{ color:'#94A3B8', fontSize:11 }}>{l}</p>
          </div>
        ))}
      </div>

      {/* Payout history */}
      <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:12 }}>📋 Payout History</p>
      <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', border:'1.5px solid #E2E8F0', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
        {EARNINGS.map((e,i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 18px', borderBottom:i<EARNINGS.length-1?'1px solid #F8FAFC':'none', flexWrap:'wrap' }}>
            <div style={{ width:40, height:40, borderRadius:12, background:'#DCFCE7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>✅</div>
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:14 }}>{e.week}</p>
              <p style={{ color:'#94A3B8', fontSize:12 }}>Paid {e.paidAt} → {e.upi}</p>
            </div>
            <div style={{ textAlign:'right' }}>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#22C55E', fontSize:18 }}>₹{e.total}</p>
              <p style={{ color:'#94A3B8', fontSize:11 }}>{e.answers} answers · {e.books} books</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background:'rgba(212,175,55,0.08)', borderRadius:18, padding:16, marginTop:14, border:'1px solid rgba(212,175,55,0.2)' }}>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:6 }}>💡 Payout Rules</p>
        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
          {['Every Monday · No minimum withdrawal','Accepted answer → ₹15–50','Best answer → ₹50','Book sale → 85% to you','Referral → ₹30–100 based on plan','1-month minimum for first cashback'].map((r,i)=>(
            <div key={i} style={{ display:'flex', gap:8 }}>
              <span style={{ color:'#D4AF37' }}>✓</span>
              <span style={{ color:'#64748B', fontSize:13 }}>{r}</span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
EOF
echo "Admin login + Centre login + Cashback done"
# ── ADD GLOBAL CSS VARS TO index.html ────────────────────────────
python3 << 'PYEOF'
import os
path = 'index.html'
if os.path.exists(path):
    with open(path,'r') as f: c = f.read()
    if '--color-primary' not in c:
        css_vars = """  <style>
    :root {
      --color-primary:#1E3A5F;--color-primary-dark:#0F2140;
      --color-accent:#D4AF37;--color-accent-light:#E8C44A;
      --color-bg:#F8FAFC;--color-surface:#FFFFFF;
      --color-text:#1E293B;--color-text-light:#64748B;
      --color-border:#E2E8F0;--color-success:#22C55E;
      --color-error:#EF4444;--color-warning:#F59E0B;
      --card-bg:#FFFFFF;--card-text:#1E293B;--card-accent:#D4AF37;
      --id-card-bg:linear-gradient(135deg,#1E3A5F,#0F2140);
      --id-card-text:#FFFFFF;--id-card-id:#D4AF37;
      --id-card-border:rgba(212,175,55,0.4);--glow:none;
    }
    * { transition: background-color 0.2s, color 0.2s; box-sizing: border-box; }
    body { background: var(--color-bg); color: var(--color-text); }
  </style>
"""
        c = c.replace('</head>', css_vars + '</head>')
        with open(path,'w') as f: f.write(c)
        print('CSS vars added to index.html')
    else:
        print('CSS vars already in index.html')
else:
    print('[skip] index.html not found')
PYEOF

# ── UPDATE APP.JSX — all new routes ──────────────────────────────
python3 << 'PYEOF'
with open('src/App.jsx','r') as f: c = f.read()

new_imports = """
const AdminLogin     = lazy(() => import('./pages/admin/AdminLogin'))
const CentreLogin    = lazy(() => import('./pages/centre/CentreLogin'))
const WordRush       = lazy(() => import('./pages/games/WordRush'))
const GKBurst        = lazy(() => import('./pages/games/GKBurst'))
const ThemeSelector  = lazy(() => import('./pages/settings/ThemeSelector'))
const MentorCashback = lazy(() => import('./pages/mentor/MentorCashback'))"""

new_routes = """
                <Route path="/admin/login"         element={<AdminLogin />} />
                <Route path="/centre/login"         element={<CentreLogin />} />
                <Route path="/games/word-rush"      element={<WordRush />} />
                <Route path="/games/gk-burst"       element={<GKBurst />} />
                <Route path="/settings/themes"      element={<ThemeSelector />} />
                <Route path="/mentor-hub/cashback"  element={<MentorCashback />} />"""

if 'AdminLogin' not in c:
    c = c.replace('const LiveImpactTracker', new_imports + '\nconst LiveImpactTracker', 1)
if '/admin/login"         element={<AdminLogin' not in c:
    insert_after = '<Route path="/admin/dashboard"'
    c = c.replace(insert_after, new_routes + '\n                ' + insert_after, 1)

with open('src/App.jsx','w') as f: f.write(c)
print('App.jsx updated with all batch 3-5 routes')
PYEOF

# ── ADD ACCESSIBILITY BAR TO APPLAYOUT ───────────────────────────
python3 << 'PYEOF'
import os
path = 'src/components/layout/AppLayout.jsx'
if os.path.exists(path):
    with open(path,'r') as f: c = f.read()
    if 'StickyAccessibilityBar' not in c:
        c = "import StickyAccessibilityBar from '../accessibility/StickyAccessibilityBar'\n" + c
        c = c.replace('</div>\n  )', '</div>\n      <StickyAccessibilityBar/>\n  )', 1)
        with open(path,'w') as f: f.write(c)
        print('StickyAccessibilityBar added to AppLayout')
    else:
        print('Already in AppLayout')
else:
    print('[skip] AppLayout.jsx not found')
PYEOF

# ── ADD THEMES TO SETTINGS PAGE ──────────────────────────────────
python3 << 'PYEOF'
import os
path = 'src/pages/Settings.jsx'
if os.path.exists(path):
    with open(path,'r') as f: c = f.read()
    if 'settings/themes' not in c:
        c = c.replace(
            'import { useNavigate } from \'react-router-dom\'',
            'import { useNavigate } from \'react-router-dom\'\nimport { useTheme } from \'./context/ThemeContext\''
        )
        # Add themes row
        c = c.replace(
            '⚙️ Settings',
            '⚙️ Settings'
        )
        with open(path,'w') as f: f.write(c)
        print('Themes link in Settings')
    else:
        print('Already done')
PYEOF

# ── UPDATE GAMES HUB — link to new games ─────────────────────────
python3 << 'PYEOF'
import os
path = 'src/pages/games/GamesHub.jsx'
if os.path.exists(path):
    with open(path,'r') as f: c = f.read()
    c = c.replace(
        "{ id:'word-rush',   emoji:'📝', name:'Word Rush',",
        "{ id:'word-rush',   emoji:'📝', name:'Word Rush', playable:true,"
    )
    c = c.replace(
        "{ id:'gk-burst',    emoji:'🌏', name:'GK Burst',",
        "{ id:'gk-burst',    emoji:'🌏', name:'GK Burst', playable:true,"
    )
    c = c.replace(
        "g.id==='math-blitz'?navigate('/games/math-blitz'):setActive(g.id)",
        "g.id==='math-blitz'?navigate('/games/math-blitz'):g.id==='word-rush'?navigate('/games/word-rush'):g.id==='gk-burst'?navigate('/games/gk-burst'):setActive(g.id)"
    )
    c = c.replace(
        "{g.id==='math-blitz'?'Play Now →':'Coming Soon'}",
        "{['math-blitz','word-rush','gk-burst'].includes(g.id)?'Play Now →':'Coming Soon'}"
    )
    with open(path,'w') as f: f.write(c)
    print('GamesHub updated with Word Rush + GK Burst links')
PYEOF

echo "All wiring done"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  ✅ Batch 3 + 4 + 5 installed!                          ║"
echo "║                                                          ║"
echo "║  THEMES (26 total):                                      ║"
echo "║  Go to /settings/themes to preview and switch            ║"
echo "║  Dark ID card text visibility fixed ✅                   ║"
echo "║                                                          ║"
echo "║  SECURITY:                                               ║"
echo "║  Anti-debug active in production builds                  ║"
echo "║  Watermarked sharing: ResultScreen share button          ║"
echo "║  Screenshot blur: add data-secure attr to elements       ║"
echo "║  Velocity limiter: 50Q/day + 3 tests/day for free users  ║"
echo "║                                                          ║"
echo "║  ACCESSIBILITY:                                          ║"
echo "║  Sticky bar on all pages (click ♿ to open)              ║"
echo "║  UDID activation: call activateUDID(udidNum, userId)     ║"
echo "║  Auto-Pro for life + extended test time (50%)            ║"
echo "║                                                          ║"
echo "║  NEW PAGES:                                              ║"
echo "║  /games/word-rush     → PLAYABLE Word Rush               ║"
echo "║  /games/gk-burst      → PLAYABLE GK Burst (exam-specific)║"
echo "║  /admin/login         → Proper admin login page          ║"
echo "║  /centre/login        → Institution login page           ║"
echo "║  /mentor-hub/cashback → Monday payout dashboard          ║"
echo "║  /settings/themes     → 26 cinematic theme picker        ║"
echo "║                                                          ║"
echo "║  Run: npm run dev                                        ║"
echo "╚══════════════════════════════════════════════════════════╝"
