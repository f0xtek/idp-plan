// Feature: learning-plan-checkboxes, Property 3: Progress bar shows correct count

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import fc from "fast-check";
import { WeekProgressBar } from "../App.jsx";

// Helper: convert hex color to rgb() string as jsdom serializes it
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

// Arbitrary: phase colors used in the app
const phaseColorArb = fc.constantFrom(
  "#60a5fa",
  "#818cf8",
  "#a78bfa",
  "#34d399",
  "#f472b6"
);

// Arbitrary: total tasks in a week (1–10, realistic range)
const totalArb = fc.integer({ min: 1, max: 10 });

describe("Property 3: Progress bar shows correct count", () => {
  it('displays label "C/N" matching the completed and total counts', () => {
    fc.assert(
      fc.property(
        totalArb,
        phaseColorArb,
        (total, phaseColor) => {
          // Generate a random completed count in [0, total]
          const completed = fc.sample(
            fc.integer({ min: 0, max: total }),
            1
          )[0];

          const { unmount, container } = render(
            <WeekProgressBar
              completed={completed}
              total={total}
              phaseColor={phaseColor}
            />
          );

          // Find the numeric label — the leaf span with "N/M" text
          const spans = container.querySelectorAll("span");
          const labelSpan = Array.from(spans).find(
            (s) =>
              s.children.length === 0 &&
              /^\d+\/\d+$/.test(s.textContent.trim())
          );

          expect(labelSpan).not.toBeUndefined();
          expect(labelSpan.textContent.trim()).toBe(`${completed}/${total}`);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("bar fill width is proportional to completed/total", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 10 }),
        totalArb,
        phaseColorArb,
        (completed, total, phaseColor) => {
          // Clamp completed to [0, total]
          const clamped = Math.min(completed, total);
          const expectedRatio = clamped / total;

          const { unmount, container } = render(
            <WeekProgressBar
              completed={clamped}
              total={total}
              phaseColor={phaseColor}
            />
          );

          // The fill bar is the inner absolute-positioned span
          // It's inside the 60px-wide container span
          const outerBar = container.querySelector(
            'span[style*="position: relative"]'
          );
          expect(outerBar).not.toBeNull();

          const fillBar = outerBar.querySelector(
            'span[style*="position: absolute"]'
          );
          expect(fillBar).not.toBeNull();

          const expectedWidth = `${expectedRatio * 100}%`;
          expect(fillBar.style.width).toBe(expectedWidth);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("shows full opacity and glow when all tasks are completed", () => {
    fc.assert(
      fc.property(totalArb, phaseColorArb, (total, phaseColor) => {
        const { unmount, container } = render(
          <WeekProgressBar
            completed={total}
            total={total}
            phaseColor={phaseColor}
          />
        );

        const fillBar = container.querySelector(
          'span[style*="position: absolute"]'
        );
        expect(fillBar).not.toBeNull();

        // Full completion: opacity 1, glow box-shadow, width 100%
        expect(fillBar.style.opacity).toBe("1");
        expect(fillBar.style.boxShadow).toContain(phaseColor);
        expect(fillBar.style.width).toBe("100%");

        // Label should use the phase color when complete.
        // The label span is the deepest span whose only text content is "N/M".
        const allSpans = container.querySelectorAll("span");
        const labelSpan = Array.from(allSpans).find(
          (s) =>
            s.children.length === 0 &&
            /^\d+\/\d+$/.test(s.textContent.trim())
        );
        expect(labelSpan).not.toBeUndefined();
        // jsdom serializes hex colors as rgb() in the style attribute
        expect(labelSpan.getAttribute("style")).toContain(
          `color: ${hexToRgb(phaseColor)}`
        );

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it("shows reduced opacity and no glow when tasks are incomplete", () => {
    fc.assert(
      fc.property(
        totalArb.filter((t) => t >= 2),
        phaseColorArb,
        (total, phaseColor) => {
          // Pick a completed count strictly less than total
          const completed = fc.sample(
            fc.integer({ min: 0, max: total - 1 }),
            1
          )[0];

          const { unmount, container } = render(
            <WeekProgressBar
              completed={completed}
              total={total}
              phaseColor={phaseColor}
            />
          );

          const fillBar = container.querySelector(
            'span[style*="position: absolute"]'
          );
          expect(fillBar).not.toBeNull();

          // Incomplete: opacity 0.7, no glow
          expect(fillBar.style.opacity).toBe("0.7");
          expect(fillBar.style.boxShadow).toBe("none");

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
