// All 9 Social Equity Tiers — complete definitions
export const EQUITY_TIERS = {
  HOPE_SCHOLAR: {
    id: 'hope_scholar',
    name: 'TryIT Hope Scholar',
    emoji: '🌱',
    tagline: 'For those who have lost family support',
    discount: 100,
    isFree: true,
    color: '#D97706',
    lightColor: '#FEF3C7',
    description: 'For orphans, children in welfare homes, or those who have lost their family support systems.',
    beneficiaries: 'Orphans · Children in CCIs · Those without family support',
    verification: {
      type: 'document_upload',
      options: [
        { label: 'B2B Institutional Code from registered CCI/NGO', field: 'institution_code', type: 'text' },
        { label: 'Death Certificate + Legal Heir Certificate', field: 'documents', type: 'file_upload' },
      ],
      instructions: 'Upload documents or enter your CCI institutional code. Verified within 24 hours.',
    },
  },
  PHYSICALLY_CHALLENGED: {
    id: 'physically_challenged',
    name: 'Physically Challenged',
    emoji: '♿',
    tagline: 'Ability is not a prerequisite for brilliance',
    discount: 100,
    isFree: true,
    color: '#7C3AED',
    lightColor: '#EDE9FE',
    description: 'For users who are Deaf, Hard of Hearing, Visually Impaired, Blind, or Motor-Challenged.',
    beneficiaries: 'Deaf · Hard of Hearing · Visually Impaired · Blind · Motor-Challenged',
    verification: {
      type: 'udid_upload',
      options: [
        { label: 'Government UDID Card (Unique Disability ID)', field: 'udid_card', type: 'file_upload' },
        { label: 'UDID Number', field: 'udid_number', type: 'text' },
      ],
      instructions: 'Upload your official UDID card issued by the Government of India. Verified within 24 hours.',
    },
    accessibilityModeUnlocked: true,
  },
  SWACHHTA_WARRIOR: {
    id: 'swachhta_warrior',
    name: 'Swachhta Warriors Scholar',
    emoji: '🧹',
    tagline: 'Honouring the families who keep India clean',
    discount: 100,
    isFree: true,
    color: '#059669',
    lightColor: '#D1FAE5',
    description: 'For children of sanitation workers, street sweepers, drainage cleaners, and waste pickers.',
    beneficiaries: 'Children of sanitation workers · Street sweepers · Drainage workers · Waste pickers',
    verification: {
      type: 'document_upload',
      options: [
        { label: 'Municipal Corporation ID/Employment Slip', field: 'municipal_id', type: 'file_upload' },
        { label: 'Panchayat Occupational Certificate', field: 'panchayat_cert', type: 'file_upload' },
      ],
      instructions: "Upload your parent's/guardian's employment document from the Municipal Corporation or Panchayat.",
    },
  },
  MARTYRS_FAMILY: {
    id: 'martyrs_family',
    name: "Martyr's Families Tier",
    emoji: '🎖️',
    tagline: 'Their sacrifice lives on in your success',
    discount: 100,
    isFree: true,
    color: '#B45309',
    lightColor: '#FEF3C7',
    description: 'For children or spouses of fallen Indian military personnel (Veer Naris).',
    beneficiaries: 'Children of martyrs · Veer Naris (Widows of fallen soldiers)',
    verification: {
      type: 'document_upload',
      options: [
        { label: 'Zila Sainik Board Certificate', field: 'sainik_board_cert', type: 'file_upload' },
        { label: 'Sainik Welfare Department Certificate', field: 'welfare_cert', type: 'file_upload' },
      ],
      instructions: 'Upload the official certificate from your Zila Sainik Board or Sainik Welfare Department.',
    },
  },
  TRANSGENDER_YOUTH: {
    id: 'transgender_youth',
    name: 'Transgender Youth Initiative',
    emoji: '🏳️‍⚧️',
    tagline: 'Every identity deserves every opportunity',
    discount: 100,
    isFree: true,
    color: '#0369A1',
    lightColor: '#E0F2FE',
    description: 'To provide direct career upskilling to an economically marginalised community.',
    beneficiaries: 'Transgender individuals seeking career education',
    verification: {
      type: 'document_upload',
      options: [
        { label: 'Transgender Identity Card (National SMILE Portal)', field: 'smile_card', type: 'file_upload' },
        { label: 'SMILE Portal Registration ID', field: 'smile_id', type: 'text' },
      ],
      instructions: 'Upload your Transgender Identity Card issued via the National SMILE Portal.',
    },
  }, // <-- Fixed here
  ACTIVE_MILITARY: {
    id: 'active_military',
    name: 'Active Military Families',
    emoji: '🪖',
    tagline: 'Defending the nation. Advancing your future.',
    discount: 30,
    isFree: false,
    color: 'var(--color-primary, #1E3A5F)',
    lightColor: 'var(--color-bg-muted, #EFF6FF)',
    description: 'For active-duty defense forces and their immediate families.',
    beneficiaries: 'Active duty military · Immediate family members',
    verification: {
      type: 'document_upload',
      options: [
        { label: 'Defense Dependent Card', field: 'def_dependent_card', type: 'file_upload' },
        { label: 'CSD Smart Card', field: 'csd_card', type: 'file_upload' },
      ],
      instructions: 'Upload your Defense Dependent Card or CSD Smart Card.',
    },
  },
  HEALTH_WORKER_FAMILY: {
    id: 'health_worker_family',
    name: 'Grassroots Health Workers',
    emoji: '🏥',
    tagline: 'For the families of India\'s healthcare frontline',
    discount: 30,
    isFree: false,
    color: '#DC2626',
    lightColor: '#FEF2F2',
    description: 'For children of ASHA workers and Anganwadi workers.',
    beneficiaries: 'Children of ASHA workers · Children of Anganwadi workers',
    verification: {
      type: 'document_upload',
      options: [
        { label: "Mother's official ASHA/Anganwadi ID Card", field: 'asha_id', type: 'file_upload' },
        { label: 'Honorarium Payment Slip', field: 'honorarium_slip', type: 'file_upload' },
      ],
      instructions: "Upload your mother's official ASHA or Anganwadi ID card or her honorarium payment slip.",
    },
  },
  FIRST_GENERATION: {
    id: 'first_generation',
    name: 'First-Generation Learners',
    emoji: '🌟',
    tagline: 'The first in your family. Not the last in your achievements.',
    discount: 15,   // 15% individual, 25% group
    discountGroup: 25,
    isFree: false,
    color: '#6D28D9',
    lightColor: '#F5F3FF',
    description: 'For students who are the first in their family lineage to pursue higher education.',
    beneficiaries: 'First-generation college students',
    verification: {
      type: 'document_upload',
      options: [
        { label: 'Declaration by Government Institution Head', field: 'institution_declaration', type: 'file_upload' },
        { label: 'Declaration by Gazetted Officer', field: 'gazetted_declaration', type: 'file_upload' },
      ],
      instructions: 'Upload a certified declaration signed by your Government Institution Head or a Gazetted Officer.',
    },
  },
}; // <-- Properly closes the main object

export const FREE_TIERS = Object.values(EQUITY_TIERS).filter(t => t.isFree).map(t => t.id)
export const DISCOUNTED_TIERS = Object.values(EQUITY_TIERS).filter(t => !t.isFree).map(t => t.id)

export function getTierDiscount(tierId) {
  const tier = Object.values(EQUITY_TIERS).find(t => t.id === tierId)
  return tier ? tier.discount : 0
}