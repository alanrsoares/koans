// A single tapered sumi brush stroke, drawn under the lesson title.
export function BrushUnderline() {
  return (
    <svg
      width="200"
      height="16"
      viewBox="0 0 200 16"
      fill="none"
      aria-hidden="true"
      className="mx-auto mt-2 text-[var(--ink)]"
    >
      <path
        d="M5 9 C 40 4, 75 6, 105 6 C 135 6, 165 4, 195 8 C 165 11, 135 13, 103 10 C 70 8, 40 12, 5 9 Z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}
