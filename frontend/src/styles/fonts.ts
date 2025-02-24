export const FONT_WEIGHTS = {
  REGULAR: "400",
  MEDIUM: "500",
  SEMI_BOLD: "600",
  BOLD: "700",
} as const;

export const fonts = {
  heading1SemiBold: {
    "font-size": "24px",
    "line-height": "30px",
    "font-weight": FONT_WEIGHTS.SEMI_BOLD,
  },
  heading1Bold: {
    "font-size": "24px",
    "line-height": "30px",
    "font-weight": FONT_WEIGHTS.BOLD,
  },
  heading2Medium: {
    "font-size": "20px",
    "line-height": "26px",
    "font-weight": FONT_WEIGHTS.MEDIUM,
  },
  heading2SemiBold: {
    "font-size": "20px",
    "line-height": "26px",
    "font-weight": FONT_WEIGHTS.SEMI_BOLD,
  },
  heading2Bold: {
    "font-size": "20px",
    "line-height": "26px",
    "font-weight": FONT_WEIGHTS.BOLD,
  },
  body1Medium: {
    "font-size": "16px",
    "line-height": "24px",
    "font-weight": FONT_WEIGHTS.MEDIUM,
  },
  body1SemiBold: {
    "font-size": "16px",
    "line-height": "24px",
    "font-weight": FONT_WEIGHTS.SEMI_BOLD,
  },
  body1Bold: {
    "font-size": "16px",
    "line-height": "24px",
    "font-weight": FONT_WEIGHTS.BOLD,
  },
  body1Regular: {
    "font-size": "16px",
    "line-height": "22px",
    "font-weight": FONT_WEIGHTS.REGULAR,
  },
  body2Medium: {
    "font-size": "14px",
    "line-height": "20px",
    "font-weight": FONT_WEIGHTS.MEDIUM,
  },
  body2SemiBold: {
    "font-size": "14px",
    "line-height": "20px",
    "font-weight": FONT_WEIGHTS.SEMI_BOLD,
  },
  body2Regular: {
    "font-size": "14px",
    "line-height": "20px",
    "font-weight": FONT_WEIGHTS.REGULAR,
  },
  detail1Medium: {
    "font-size": "12px",
    "line-height": "16px",
    "font-weight": FONT_WEIGHTS.MEDIUM,
  },
  detail1SemiBold: {
    "font-size": "12px",
    "line-height": "16px",
    "font-weight": FONT_WEIGHTS.SEMI_BOLD,
  },
  detail1Regular: {
    "font-size": "12px",
    "line-height": "16px",
    "font-weight": FONT_WEIGHTS.REGULAR,
  },
  detail2Medium: {
    "font-size": "10px",
    "line-height": "14px",
    "font-weight": FONT_WEIGHTS.MEDIUM,
  },
} as const;
