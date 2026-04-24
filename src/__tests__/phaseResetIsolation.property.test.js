// Feature: learning-plan-checkboxes, Property 12: Phase reset clears only the target phase

import { describe, it, expect } from "vitest";
import fc from "fast-check";

// Arbitrary: task IDs matching the project's p{phase}-w{week}-t{task} format
const taskIdArb = fc.stringMatching(/^p[0-2]-w([1-9]|1[0-9]|2[0-4])-t[0-5]$/);

// Arbitrary: completion state — a flat object mapping task IDs to true
const completionStateArb = fc.uniqueArray(taskIdArb, { maxLength: 30 }).map(
  (keys) => Object.fromEntries(keys.map((k) => [k, true]))
);

// Arbitrary: phase index (0, 1, or 2)
const phaseIndexArb = fc.integer({ min: 0, max: 2 });

/**
 * Pure reset logic extracted from useCompletionState's resetPhase callback.
 * This mirrors the exact behavior in src/App.jsx:
 *   - Remove all keys whose prefix matches `p{phaseIndex}-`
 *   - Keep all other keys unchanged
 */
function applyResetPhase(state, phaseIndex) {
  const prefix = `p${phaseIndex}-`;
  const next = {};
  for (const [key, value] of Object.entries(state)) {
    if (!key.startsWith(prefix)) {
      next[key] = value;
    }
  }
  return next;
}

describe("Property 12: Phase reset clears only the target phase", () => {
  it("all tasks belonging to the target phase are removed", () => {
    fc.assert(
      fc.property(completionStateArb, phaseIndexArb, (state, phaseIndex) => {
        const prefix = `p${phaseIndex}-`;
        const result = applyResetPhase(state, phaseIndex);

        // No key in the result should belong to the reset phase
        for (const key of Object.keys(result)) {
          expect(key.startsWith(prefix)).toBe(false);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("all tasks belonging to other phases are preserved unchanged", () => {
    fc.assert(
      fc.property(completionStateArb, phaseIndexArb, (state, phaseIndex) => {
        const prefix = `p${phaseIndex}-`;
        const result = applyResetPhase(state, phaseIndex);

        // Every non-target-phase key from the original state must still be present
        for (const [key, value] of Object.entries(state)) {
          if (!key.startsWith(prefix)) {
            expect(result[key]).toBe(value);
          }
        }

        // No new keys should appear in the result
        for (const key of Object.keys(result)) {
          expect(state[key]).toBeDefined();
        }
      }),
      { numRuns: 100 }
    );
  });

  it("resetting a phase with no matching tasks returns the state unchanged", () => {
    fc.assert(
      fc.property(completionStateArb, phaseIndexArb, (state, phaseIndex) => {
        const prefix = `p${phaseIndex}-`;
        const hasTargetTasks = Object.keys(state).some((k) =>
          k.startsWith(prefix)
        );
        fc.pre(!hasTargetTasks);

        const result = applyResetPhase(state, phaseIndex);
        expect(result).toEqual(state);
      }),
      { numRuns: 100 }
    );
  });

  it("resetting does not mutate the original state object", () => {
    fc.assert(
      fc.property(completionStateArb, phaseIndexArb, (state, phaseIndex) => {
        const copy = { ...state };
        const result = applyResetPhase(state, phaseIndex);

        // Original should be untouched
        expect(state).toEqual(copy);
        // Result should be a new object
        expect(result).not.toBe(state);
      }),
      { numRuns: 100 }
    );
  });

  it("resetting the same phase twice is idempotent", () => {
    fc.assert(
      fc.property(completionStateArb, phaseIndexArb, (state, phaseIndex) => {
        const once = applyResetPhase(state, phaseIndex);
        const twice = applyResetPhase(once, phaseIndex);

        expect(twice).toEqual(once);
      }),
      { numRuns: 100 }
    );
  });
});
