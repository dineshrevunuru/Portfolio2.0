// Brand tokens for the widget — mirrors the HSS app (plans-hair-systems/constants/theme.ts)
// refined with minimalist discipline: warm neutrals, hairline borders, one accent.
export const T = {
  // Brand
  teal: '#002526', // single accent — used sparingly (selection, primary action, header)
  tealHover: '#0A3D3E',
  gold: '#E7BF6D', // tiny spot accent only (header eyebrow)

  // Surfaces — warm, near-white
  white: '#FFFFFF',
  surface: '#FBFAF8', // warm bone for highlighted cards (confirm/done)
  bone: '#F7F6F3', // bot bubble / quiet fills

  // Text — never pure black
  ink: '#1F2024', // primary text
  muted: '#787774', // secondary / meta
  faint: '#A8A6A1', // disabled / tertiary

  // Lines
  line: '#ECEAE6', // 1px hairline borders/dividers

  success: '#346538',
  error: '#9F2F2D',
} as const;
