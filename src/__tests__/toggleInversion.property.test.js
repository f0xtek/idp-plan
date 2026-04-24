// Feature: learning-plan-checkboxes, Property 2: Toggle inverts completion state

import { describe, it, expect } from "vitest";
import fc from "fast-check";

// Arbitrary: task IDs matching the project's p{phase}-w{week}-t{task} format
const taskIdArb = fc.stringMatching(/^p[0-2]-w([1-9]|1[0-9]|2[0-4])-t[0-5]$/);

// Arbitrary: completion state — a flat object mapping task IDs to true
const completionStateArb = fc.uniqueArray(taskIdArb, { maxLength: 30 }).map(
  (keys) => Object.fromEntries(keys.map((k) => [k, true]))
);

/**
 * Pure toggle logic extracted from useCompletionState's toggleTask callback.
 * This mirrors the exact behavior in src/App.jsx:
 *   - If the task is completed (truthy), delete the key (→ unchecked)
 *   - If the task is absent/falsy, set it to true (→ checked)
 */
function applyToggle(state, taskId) {
  const next = { ...state };
  if (next[taskId]) {
    delete next[taskId];
  } else {
    next[taskId] = true;
  }
  return next;
}

describe("Property 2: Toggle inverts completion state", () => {
  it("toggling a completed task removes it from the state", () => {
    fc.assert(
      fc.property(completionStateArb, taskIdArb, (state, taskId) => {
        // Ensure the task is completed before toggling
        const stateWithTask = { ...state, [taskId]: true };
        const toggled = applyToggle(stateWithTask, taskId);

        // The task should no longer be present (i.e. unchecked)
        expect(toggled[taskId]).toBeUndefined();
      }),
      { numRuns: 100 }
    );
  });

  it("toggling an unchecked task sets it to true", () => {
    fc.assert(
      fc.property(completionStateArb, taskIdArb, (state, taskId) => {
        // Ensure the task is NOT in the state before toggling
        const stateWithout = { ...state };
        delete stateWithout[taskId];
        const toggled = applyToggle(stateWithout, taskId);

        // The task should now be completed
        expect(toggled[taskId]).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it("toggling a task does not change any other task", () => {
    fc.assert(
      fc.property(completionStateArb, taskIdArb, (state, taskId) => {
        const toggled = applyToggle(state, taskId);

        // Every other key should be unchanged
        for (const key of Object.keys(state)) {
          if (key !== taskId) {
            expect(toggled[key]).toBe(state[key]);
          }
        }

        // No new keys should appear except possibly the toggled task
        for (const key of Object.keys(toggled)) {
          if (key !== taskId) {
            expect(state[key]).toBe(toggled[key]);
          }
        }
      }),
      { numRuns: 100 }
    );
  });

  it("double toggle is an identity — toggling twice restores original state", () => {
    fc.assert(
      fc.property(completionStateArb, taskIdArb, (state, taskId) => {
        const once = applyToggle(state, taskId);
        const twice = applyToggle(once, taskId);

        expect(twice).toEqual(state);
      }),
      { numRuns: 100 }
    );
  });
});
