export const COLORS = {
  primary:       '#4361EE',
  primaryLight:  'rgba(67,97,238,0.12)',
  secondary:     '#7209B7',
  success:       '#06D6A0',
  warning:       '#FFB703',
  danger:        '#EF233C',
  sidebarBg:     '#1E1E2E',
  sidebarHover:  'rgba(255,255,255,0.06)',
  bodyBg:        '#F8F9FA',
  cardBg:        '#FFFFFF',
  textPrimary:   '#1A1A2E',
  textSecondary: '#6B7280',
  textMuted:     '#94A3B8',
  border:        '#E5E7EB',
  borderDark:    '#2D2D3F',
} as const;

export const STREAK_INTENSITY = [
  '#2D2D3F', // 0 min
  '#C7D2FE', // 1-9 min
  '#818CF8', // 10-19 min
  '#4361EE', // 20-29 min
  '#3730A3', // 30-44 min
  '#1E1B4B', // 45+ min
] as const;

export const MODULE_COLORS: Record<string, string> = {
  exam_9to10:        '#4361EE',
  exam_university:   '#7209B7',
  communication:     '#06D6A0',
  toeic:             '#FFB703',
  grade6:            '#06B6D4',
  grade7:            '#06B6D4',
  grade8:            '#06B6D4',
  grade10:           '#EF233C',
  grade11:           '#EF233C',
};
