// Feature: learning-plan-checkboxes, Property 5: Union merge correctness

import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { mergeState } from "../App.jsx";

// Arbitrary: a completion state object mapping task-ID-like keys to boolean true
const taskIdArb = fc.stringMatching(/^p[0-2]-w([1-9]|1[0-9]|2[0-4])-t[0-5]$/);

const completionStateArb = fc.uniqueArray(taskIdArb, { maxLength: 30 }).map(
  (keys) => Object.fromEntries(keys.map((k) => [k, true]))
);

describe("Property 5: Union merge correctness", () => {
  it("merged result marks a task completed iff completed in at least one source", () => {
    fc.assert(
      fc.property(completionStateArb, completionStateArb, (local, remote) => {
        // Ensure local is non-empty so we exercise the union merge path
        fc.pre(Object.keys(local).length > 0);

        const merged = mergeState(local, remote);

        // Collect all task IDs from both sources
        const allKeys = new Set([
          ...Object.keys(local),
          ...Object.keys(remote),
        ]);

        for (const key of allKeys) {
          const expected = !!(local[key] || remote[key]);
          expect(merged[key]).toBe(expected);
        }

        // Merged should not contain any keys absent from both sources
        for (const key of Object.keys(merged)) {
          expect(allKeys.has(key)).toBe(true);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("when local is empty, merged result equals remote exactly", () => {
    fc.assert(
      fc.property(completionStateArb, (remote) => {
        const local = {};
        const merged = mergeState(local, remote);

        // Merged should have the same keys and values as remote
        expect(Object.keys(merged).sort()).toEqual(Object.keys(remote).sort());
        for (const key of Object.keys(remote)) {
          expect(merged[key]).toBe(remote[key]);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("merged result is a new object (no mutation of inputs)", () => {
    fc.assert(
      fc.property(completionStateArb, completionStateArb, (local, remote) => {
        const localCopy = { ...local };
        const remoteCopy = { ...remote };

        const merged = mergeState(local, remote);

        // Inputs should not be mutated
        expect(local).toEqual(localCopy);
        expect(remote).toEqual(remoteCopy);

        // Merged should be a distinct object reference from both inputs
        expect(merged).not.toBe(local);
        expect(merged).not.toBe(remote);
      }),
      { numRuns: 100 }
    );
  });

  it("merge is idempotent — merging the result with either source yields the same result", () => {
    fc.assert(
      fc.property(completionStateArb, completionStateArb, (local, remote) => {
        fc.pre(Object.keys(local).length > 0);

        const merged = mergeState(local, remote);
        const mergedAgainWithLocal = mergeState(merged, local);
        const mergedAgainWithRemote = mergeState(merged, remote);

        expect(mergedAgainWithLocal).toEqual(merged);
        expect(mergedAgainWithRemote).toEqual(merged);
      }),
      { numRuns: 100 }
    );
  });
});
