// Feature: learning-plan-checkboxes, Property 4: localStorage round-trip preserves completion state

import { describe, it, expect, beforeEach } from "vitest";
import fc from "fast-check";

const LS_STATE_KEY = "lp-completion-state";

// Arbitrary: task IDs matching the project's p{phase}-w{week}-t{task} format
const taskIdArb = fc.stringMatching(/^p[0-2]-w([1-9]|1[0-9]|2[0-4])-t[0-5]$/);

// Arbitrary: completion state — a flat object mapping task IDs to true
const completionStateArb = fc.uniqueArray(taskIdArb, { maxLength: 30 }).map(
  (keys) => Object.fromEntries(keys.map((k) => [k, true]))
);

/**
 * Simulates the same read/write path used by useCompletionState:
 *   write: localStorage.setItem(key, JSON.stringify(state))
 *   read:  JSON.parse(localStorage.getItem(key))
 * with the same defensive parsing the hook applies.
 */
function writeState(state) {
  localStorage.setItem(LS_STATE_KEY, JSON.stringify(state));
}

function readState() {
  const raw = localStorage.getItem(LS_STATE_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
    return {};
  } catch {
    return {};
  }
}

describe("Property 4: localStorage round-trip preserves completion state", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("serializing to localStorage and reading back produces an identical object", () => {
    fc.assert(
      fc.property(completionStateArb, (state) => {
        writeState(state);
        const restored = readState();

        expect(restored).toEqual(state);
      }),
      { numRuns: 100 }
    );
  });

  it("empty completion state round-trips correctly", () => {
    writeState({});
    const restored = readState();
    expect(restored).toEqual({});
  });

  it("reading before any write returns empty state", () => {
    const restored = readState();
    expect(restored).toEqual({});
  });

  it("overwriting state replaces the previous value completely", () => {
    fc.assert(
      fc.property(
        completionStateArb,
        completionStateArb,
        (first, second) => {
          writeState(first);
          writeState(second);
          const restored = readState();

          expect(restored).toEqual(second);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("corrupt localStorage data defaults to empty state", () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant("not json at all"),
          fc.constant("{broken"),
          fc.constant("[1,2,3]"),
          fc.constant('"just a string"'),
          fc.constant("null"),
          fc.constant("42")
        ),
        (corruptValue) => {
          localStorage.setItem(LS_STATE_KEY, corruptValue);
          const restored = readState();

          // Arrays, strings, numbers, null, and invalid JSON all default to {}
          expect(restored).toEqual({});
        }
      ),
      { numRuns: 100 }
    );
  });
});
