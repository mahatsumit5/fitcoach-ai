export const darkTheme = {
  // Backgrounds
  bgPrimary:   "#0a0a0a",
  bgSecondary: "#141414",
  bgTertiary:  "#1f1f1f",
  bgCard:      "#1a1a1a",

  // Borders
  border: "#2a2a2a",

  // Text
  textPrimary:   "#ffffff",
  textSecondary: "#d1d5db",
  textMuted:     "#6b7280",
  textDisabled:  "#374151",

  // Brand
  brand:        "#22c55e",
  brandLight:   "#4ade80",
  brandDark:    "#15803d",
  brandBg:      "#052e16",

  // Status
  error:        "#ef4444",
  errorBg:      "#450a0a",
  warning:      "#f59e0b",
  warningBg:    "#451a03",
  success:      "#22c55e",
  successBg:    "#052e16",
  info:         "#3b82f6",
  infoBg:       "#0c1a4a",

  // Tab bar
  tabBar:       "#141414",
  tabBorder:    "#2a2a2a",
  tabActive:    "#22c55e",
  tabInactive:  "#6b7280",

  // Input
  inputBg:      "#141414",
  inputBorder:  "#2a2a2a",
  inputFocused: "#22c55e",

  // Status bar
  statusBar: "light" as const,
};

export const lightTheme = {
  // Backgrounds
  bgPrimary:   "#f9fafb",
  bgSecondary: "#ffffff",
  bgTertiary:  "#f3f4f6",
  bgCard:      "#ffffff",

  // Borders
  border: "#e5e7eb",

  // Text
  textPrimary:   "#111827",
  textSecondary: "#374151",
  textMuted:     "#6b7280",
  textDisabled:  "#d1d5db",

  // Brand
  brand:        "#16a34a",
  brandLight:   "#22c55e",
  brandDark:    "#15803d",
  brandBg:      "#f0fdf4",

  // Status
  error:        "#dc2626",
  errorBg:      "#fef2f2",
  warning:      "#d97706",
  warningBg:    "#fffbeb",
  success:      "#16a34a",
  successBg:    "#f0fdf4",
  info:         "#2563eb",
  infoBg:       "#eff6ff",

  // Tab bar
  tabBar:       "#ffffff",
  tabBorder:    "#e5e7eb",
  tabActive:    "#16a34a",
  tabInactive:  "#9ca3af",

  // Input
  inputBg:      "#ffffff",
  inputBorder:  "#e5e7eb",
  inputFocused: "#16a34a",

  // Status bar
  statusBar: "dark" as const,
};

export type AppTheme = typeof darkTheme;
