/**
 * APAAR — Academic Bank of Credits (ABC)
 * "One Nation, One Student ID" — 12-digit unique student ID
 * Issued by Ministry of Education under National Education Policy 2020
 */

export function isValidAPAAR(id) {
  const clean = String(id).replace(/[\s-]/g, '')
  return /^\d{12}$/.test(clean)
}

export function formatAPAAR(id) {
  const clean = String(id).replace(/\D/g, '').slice(0, 12)
  // Format: XXXX-XXXX-XXXX
  return clean.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3')
}

/**
 * In production: call DigiLocker API to verify APAAR against institution
 * GET https://digilocker.meripehchaan.gov.in/public/oauth2/1/token
 * For now: validate format only (mock verification)
 */
export async function verifyAPAAR(apaarId, institutionCode = '') {
  if (!isValidAPAAR(apaarId)) {
    return { valid: false, error: 'Invalid APAAR ID format. Must be 12 digits.' }
  }
  // TODO: replace with real DigiLocker / ABC API call
  await new Promise(r => setTimeout(r, 1200))  // simulate API call
  return {
    valid: true,
    studentName: 'Verified Student',
    institution: institutionCode || 'Government Institution',
    apaarId: apaarId.replace(/\D/g, ''),
    verifiedAt: new Date().toISOString(),
  }
}
