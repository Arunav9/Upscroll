/**
 * Shared brand tokens. Topic-specific colors live in src/content/topics.ts —
 * these are the app-wide gradients and backgrounds reused across screens.
 */

export const colors = {
  backgroundGradient: ['#020617', '#0b1748', '#1d3fa8'] as const,
  ctaGradient: ['#38bdf8', '#3b82f6', '#6366f1'] as const,
  ctaShadow: '#3b82f6',
  auroraGradient: ['#22d3ee', '#3b82f6', '#d946ef', '#f472b6'] as const,
  screenBackground: '#000',
  endScreenBackground: '#0f172a',
  white: '#fff',
} as const;
