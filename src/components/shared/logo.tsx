import React, { useId } from "react";

// Hoisted so the string isn't re-created on every render.
const LOGO_PATH =
  "M 126 86.5 C 126 71.5 132 62.5 144 44.5 S 153 23.5 144 14.5 S 120 8.5 84 38.5 S 42 83.5 45 89.5 S 51 98.5 66 101.5 S 87 101.5 105 110.5 S 123 140.5 90 158.5 S 36 164.5 36 152.5 S 48 134.5 57 131.5 S 60 128.5 54 119.5 S 42 116.5 33 128.5 S 21 149.5 27 158.5 S 48 179.5 75 176.5 S 123 158.5 129 140.5 S 120 107.5 96 101.5 S 63 98.5 60 95.5 S 57 89.5 60 83.5 S 72 65.5 102 41.5 S 147 17.5 129 38.5 S 105 68.5 105 74.5 S 114 83.5 126 86.5 Z M 180 65.5 C 159 86.5 147 113.5 138 137.5 S 132 161.5 141 167.5 S 144 161.5 162 137.5 S 186 98.5 177 128.5 S 180 149.5 186 152.5 S 198 134.5 204 125.5 S 213 107.5 225 95.5 S 225 104.5 213 125.5 S 207 155.5 213 161.5 S 225 170.5 237 161.5 S 249 146.5 255 140.5 C 255 155.5 258 155.5 264 158.5 S 285 152.5 309 116.5 C 306 149.5 309 155.5 318 164.5 S 351 161.5 354 146.5 C 354 158.5 357 164.5 366 164.5 C 378 143.5 384 122.5 411 95.5 S 426 86.5 411 107.5 S 411 131.5 417 134.5 S 414 122.5 438 89.5 C 444 80.5 450 77.5 441 68.5 S 414 80.5 402 95.5 S 384 119.5 375 131.5 C 381 110.5 387 92.5 396 80.5 S 390 65.5 387 62.5 S 381 65.5 372 83.5 S 372 89.5 369 98.5 S 366 104.5 360 122.5 S 348 146.5 333 155.5 S 321 152.5 324 122.5 S 324 95.5 321 95.5 S 297 116.5 279 137.5 S 270 134.5 285 116.5 S 312 86.5 318 83.5 S 324 86.5 324 89.5 S 327 98.5 330 98.5 S 339 83.5 324 68.5 S 282 86.5 270 107.5 S 246 140.5 228 152.5 S 228 122.5 243 104.5 S 252 83.5 246 77.5 S 234 77.5 225 86.5 S 204.9999 110.5 195 122.5 S 195 113.5 204 98.5 S 213 86.5 207 80.5 S 201 77.5 189 89.5 S 177 104.5 165 119.5 S 156 122.5 171 101.5 S 185.0001 83.5 192 74.5 S 189 68.5 186 65.5 S 186 59.5 180 65.5 M 501 119.5 C 489 134.5 477 149.5 462 161.5 S 441 164.5 435 158.5 S 441 122.5 447 107.5 S 461.0001 81.4999 468 68.5 C 459.9999 67.5001 447 71.5 444 65.5 S 441 56.5 444 59.5 S 462 59.5 471 62.5 Q 477 53.5 477 50.5 T 474 47.5 T 480 35.5 T 492 17.5 T 507 23.5 C 513 29.5 492 50.5 489 56.5 S 503 58.5 507 59.5 S 513 65.5 510 68.5 S 510 62.5 483 68.5 C 468 92.5 459 110.5 450 137.5 S 459 155.5 471 143.5 S 489 122.5 498 116.5 Z";

// Fraction of the timeline spent fading the fill in at the end.
const FILL_FRACTION = 0.2;

type LogoProps = Omit<React.SVGProps<SVGSVGElement>, "children"> & {
  durationMs?: number;
  animate?: boolean;
  label?: string;
};

export function Logo({
  durationMs = 8000,
  animate = true,
  label,
  ...props
}: LogoProps) {
  // useId() contains ":" in React 18, which isn't valid in a CSS selector.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `logo-draw-${uid}`;
  const titleId = `${cls}-title`;

  const fillMs = Math.round(durationMs * FILL_FRACTION);
  const strokeMs = durationMs - fillMs;

  return (
    <svg
      viewBox="0 0 650 220"
      xmlns="http://www.w3.org/2000/svg"
      role={label ? "img" : undefined}
      aria-hidden={label ? undefined : true}
      aria-labelledby={label ? titleId : undefined}
      {...props}
    >
      {label ? <title id={titleId}>{label}</title> : null}

      <style>{`
        .${cls} {
          fill: var(--logo-color, var(--color-primary));
          stroke: var(--logo-color, var(--color-primary));
          fill-opacity: 0;
          stroke-width: 0.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
        }
        .${cls}[data-animate="true"] {
          animation:
            ${cls}-stroke ${strokeMs}ms cubic-bezier(0.65, 0, 0.35, 1) forwards,
            ${cls}-fill ${fillMs}ms ease-out ${strokeMs}ms forwards;
        }
        @keyframes ${cls}-stroke { to { stroke-dashoffset: 0; } }
        @keyframes ${cls}-fill   { to { fill-opacity: 1; } }

        .${cls}[data-animate="false"],
        @media (prefers-reduced-motion: reduce) {
          .${cls} {
            animation: none;
            stroke-dashoffset: 0;
            fill-opacity: 1;
          }
        }
      `}</style>

      <path
        className={cls}
        data-animate={animate}
        pathLength="1"
        vectorEffect="non-scaling-stroke"
        d={LOGO_PATH}
      />
    </svg>
  );
}