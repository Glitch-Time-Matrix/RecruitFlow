/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CENTRAL BRAND CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────────
 * This is the single source of truth for the agency's brand IDENTITY —
 * name, logo, tagline, and contact details. To rebrand the site for a client,
 * edit THIS file (and the 3 color tokens in `app/globals.css`). No other file
 * needs to change for the header, footer, navigation, and contact info to update.
 *
 * Current values are placeholders ("RecruitFlow"). Swap them for the client's
 * real brand when finalized.
 *
 * Notes:
 * - `logo.glyph` is a temporary text mark ("Ω"). When the client's real logo
 *   image is available, set `logo.src` to its path (e.g. "/logo.svg") and the
 *   Header/Footer will render the image instead of the glyph.
 * - Colours live in `app/globals.css` under `@theme` (--color-primary /
 *   --color-secondary / --color-accent). Rebrand = swap those three values.
 * - Marketing body copy on the pages still contains the literal word
 *   "RecruitFlow"; those prose mentions are updated at rebrand time. The brand
 *   IDENTITY (logo/name/tagline/contact) is fully centralized here.
 */

export const BRAND = {
  /** Short brand name used in copy and titles. */
  name: "RecruitFlow",
  /** Uppercase wordmark shown in the header/footer lockup. */
  wordmark: "RECRUITFLOW",
  /** Small tagline under the wordmark. */
  tagline: "STAFFING AGENCY",
  /** Legal entity name for the footer / legal text. */
  legalName: "RecruitFlow",

  logo: {
    /** Temporary text glyph used until a real logo image is provided. */
    glyph: "Ω",
    /** Set to a public asset path (e.g. "/logo.svg") to use a real logo image. */
    src: "" as string,
    /** Alt text when a logo image is used. */
    alt: "RecruitFlow logo",
  },

  /** One-line agency description (footer). */
  description:
    "Premier executive recruitment and corporate staffing agency. Connecting high-caliber talent with industry-leading enterprises across Healthcare, Technology, Manufacturing, and Finance.",

  contact: {
    email: "info@recruitflowstaffing.com",
    phone: "+1 (212) 555-0192",
    /** Used for the tel: link (digits only). */
    phoneHref: "+12125550192",
  },

  /** Short promises shown in the footer bottom bar. */
  assurances: [
    "Confidentiality Assured",
    "90-Day Placement Guarantee",
    "Equal Opportunity Employer",
  ],
} as const;

export type Brand = typeof BRAND;
