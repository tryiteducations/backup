/**
 * TryIT — Avatar Moderation Gate
 * ─────────────────────────────────────────────────────────────────
 * Every profile photo MUST pass through checkImageSafety() before it
 * is stored or shown to any other user. This is a hard requirement,
 * not a nice-to-have — TryIT's user base includes minors, and an
 * unmoderated public photo surface (leaderboard, mentor hub, Hall)
 * is not acceptable.
 *
 * IMPLEMENTATION NOTE — READ BEFORE WIRING:
 * The actual moderation call below is a clearly-marked stub. I don't
 * have your API credentials or Edge Function setup, so I cannot wire
 * a live call from here. What IS real and complete: the gate logic,
 * the rejection flow, and the integration point in AvatarUpload.jsx —
 * none of that changes regardless of which provider you plug in.
 *
 * RECOMMENDED PROVIDER: Google Cloud Vision SafeSearch, called from a
 * Supabase Edge Function (so your API key never reaches the client).
 * Steps to make this live:
 *   1. Create a Supabase Edge Function, e.g. `moderate-avatar`.
 *   2. Inside it, call Vision API's SafeSearch annotate on the image,
 *      which returns likelihood scores for adult/violence/racy content.
 *   3. Reject if adult or racy likelihood is VERY_LIKELY or LIKELY.
 *   4. Replace the fetch URL below with your deployed Edge Function URL.
 *
 * Alternative providers that work the same way: AWS Rekognition
 * DetectModerationLabels, or Azure Content Moderator.
 */

const MODERATION_ENDPOINT = '/api/moderate-avatar' // ← point this at your Supabase Edge Function

/**
 * Returns { safe: boolean, reason: string|null }.
 * Call this BEFORE uploading to storage and BEFORE showing the image
 * to anyone else. If safe is false, reject the upload entirely — do
 * not store it "just in case," do not show it to the uploader's own
 * profile pending review. Reject and ask for a different photo.
 */
export async function checkImageSafety(file) {
  try {
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch(MODERATION_ENDPOINT, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      // Moderation service unreachable — fail CLOSED, not open. An
      // unmoderated photo must never slip through because a network
      // call failed. Ask the user to retry rather than risk it.
      return { safe: false, reason: 'moderation_unavailable' }
    }

    const result = await response.json()
    // Expected shape from your Edge Function:
    // { adultLikelihood: 'VERY_UNLIKELY'|'UNLIKELY'|'POSSIBLE'|'LIKELY'|'VERY_LIKELY',
    //   racyLikelihood:  same scale,
    //   violenceLikelihood: same scale }
    const REJECT_LEVELS = ['LIKELY', 'VERY_LIKELY']
    const isUnsafe =
      REJECT_LEVELS.includes(result.adultLikelihood) ||
      REJECT_LEVELS.includes(result.racyLikelihood) ||
      REJECT_LEVELS.includes(result.violenceLikelihood)

    if (isUnsafe) {
      return { safe: false, reason: 'inappropriate_content' }
    }
    return { safe: true, reason: null }
  } catch (err) {
    // Network/parsing failure — same fail-closed principle as above.
    return { safe: false, reason: 'moderation_unavailable' }
  }
}

export const MODERATION_MESSAGES = {
  inappropriate_content: "This photo couldn't be approved. Please choose a different photo that clearly shows your face.",
  moderation_unavailable: "We couldn't verify this photo right now. Please try again in a moment.",
  too_large: 'This photo is too large. Please choose a photo under 8MB.',
  invalid_type: 'Please upload a JPG, PNG, or WEBP image.',
}