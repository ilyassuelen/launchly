export function scaleFont(
  base: number,
  typography: {
    fontSize: number;
  },
) {
  return `${(base / 13) * typography.fontSize}px`;
}