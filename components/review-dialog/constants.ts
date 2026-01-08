// ============================================
// Review Dialog Constants
// ============================================

/**
 * Theme color used throughout the review dialog
 */
export const THEME_COLOR = '#0E4268';

/**
 * Drag and drop item type identifier
 */
export const DRAG_ITEM_TYPE = 'REVIEW_PAGE';

/**
 * Color palette for page thumbnails
 */
export const PAGE_COLORS = [
  '#E8D5B7', '#D4C4A8', '#C9B99A', '#BEB08C', '#F0E6D3',
  '#E5DCC9', '#DAD1BE', '#CFC7B3', '#C4BDA8', '#B9B39D',
  '#AEA992', '#A39F87', '#98957C', '#8D8B71', '#828166',
] as const;

/**
 * Get page color by index (cycles through palette)
 */
export function getPageColor(index: number): string {
  return PAGE_COLORS[index % PAGE_COLORS.length];
}

// ============================================
// Animation Configurations
// ============================================

/**
 * Standard spring animation config
 */
export const SPRING_CONFIG = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 30,
};

/**
 * Fast spring animation config (for pickups, quick transitions)
 */
export const SPRING_FAST = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 25,
};

/**
 * Fade animation config
 */
export const FADE_CONFIG = {
  duration: 0.15,
};

// ============================================
// Theme-based Style Helpers
// ============================================

/**
 * Common theme-based Tailwind classes
 */
export const THEME_CLASSES = {
  // Backgrounds
  bgHover: 'hover:bg-[#0E4268]/5',
  bgActive: 'bg-[#0E4268]/10',
  bgLight: 'bg-[#0E4268]/20',

  // Borders
  borderHover: 'hover:border-[#0E4268]/30',
  borderActive: 'border-[#0E4268]',
  borderFocus: 'focus:border-[#0E4268]/50',

  // Text
  textHover: 'hover:text-[#0E4268]',
  textActive: 'text-[#0E4268]',

  // Rings
  ring: 'ring-[#0E4268]',
  ringFocus: 'focus:ring-[#0E4268]/30',
  ringOffset: 'ring-offset-2',

  // Button primary
  btnPrimary: 'bg-[#0E4268] border-[#0E4268] text-white hover:bg-[#0E4268]/90',
} as const;
