// Feature: learning-plan-checkboxes, Property 11: Debounced batching coalesces rapid changes

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import fc from "fast-check";
import { useCompletionState } from "../App.jsx";

// Arbitrary: task IDs matching the project's p{phase}-w{week}-t{task} format
const taskIdArb = fc.stringMatching(/^p[0-2]-w([1-9]|1[0-9]|2[0-4])-t[0-5]$/);

// Arbitrary: a sequence of 2+ task IDs to toggle rapidly
const toggleSequenceArb = fc.array(taskIdArb, { minLength: 2, maxLength: 10 });

// A minimal phases array — the hook needs it but the debounce logic doesn't depend on its contents
const minimalPhases = [
  { id: 1, weeks_data: [{ week: 1, tasks: [{ type: "read", label: "task" }] }] },
];

// A valid 64-char hex token for pre-seeding localStorage
const FAKE_TOKEN = "a".repeat(64);

describe("Property 11: Debounced batching coalesces rapid changes", () => {
  let fetchCalls;
  let mockFetch;

  beforeEach(() => {
    vi.useFakeTimers();
    fetchCalls = [];

    // Mock fetch: track PUT calls, return success for everything
    mockFetch = vi.fn(async (url, options = {}) => {
      const method = (options.method || "GET").toUpperCase();
      if (method === "PUT") {
        fetchCalls.push({
          url,
          body: JSON.parse(options.body),
        });
        return { ok: true, status: 204 };
      }
      // GET /api/progress — return empty state
      return {
        ok: true,
        status: 200,
        json: async () => ({}),
      };
    });
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  /**
   * Helper: sets up a fresh hook instance with clean localStorage and fetch tracking.
   * Must be called inside each property iteration to avoid cross-iteration state leakage.
   */
  function setupHook() {
    // Clear any leftover state from previous iteration
    localStorage.clear();
    fetchCalls.length = 0;

    // Pre-seed localStorage with a valid token so the hook starts in Ready state
    localStorage.setItem("lp-user-token", FAKE_TOKEN);
    localStorage.setItem("lp-completion-state", JSON.stringify({}));

    const hookResult = renderHook(() => useCompletionState(minimalPhases));

    // Flush the initial GET /api/progress fetch triggered by the token useEffect
    act(() => {
      vi.runAllTicks();
    });

    // Clear fetch tracking so we only count PUT calls from toggles
    fetchCalls.length = 0;

    return hookResult;
  }

  it("multiple rapid toggles produce exactly 1 PUT request", () => {
    fc.assert(
      fc.property(toggleSequenceArb, (taskIds) => {
        const { result, unmount } = setupHook();

        // Rapidly toggle all tasks in the sequence (within the same 2s window)
        for (const taskId of taskIds) {
          act(() => {
            result.current.toggleTask(taskId);
          });
        }

        // No PUT should have fired yet (still within debounce window)
        const putsBefore = fetchCalls.filter((c) => c.url === "/api/progress");
        expect(putsBefore).toHaveLength(0);

        // Advance past the 2-second debounce window
        act(() => {
          vi.advanceTimersByTime(2100);
        });

        // Exactly 1 PUT request should have been sent
        const putsAfter = fetchCalls.filter((c) => c.url === "/api/progress");
        expect(putsAfter).toHaveLength(1);

        // The PUT body should reflect the final accumulated state
        // Compute expected state by replaying toggles on an empty object
        const expectedState = {};
        for (const taskId of taskIds) {
          if (expectedState[taskId]) {
            delete expectedState[taskId];
          } else {
            expectedState[taskId] = true;
          }
        }

        expect(putsAfter[0].body).toEqual(expectedState);

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it("a single toggle also produces exactly 1 PUT after debounce", () => {
    fc.assert(
      fc.property(taskIdArb, (taskId) => {
        const { result, unmount } = setupHook();

        act(() => {
          result.current.toggleTask(taskId);
        });

        // No PUT yet
        expect(fetchCalls.filter((c) => c.url === "/api/progress")).toHaveLength(0);

        act(() => {
          vi.advanceTimersByTime(2100);
        });

        const puts = fetchCalls.filter((c) => c.url === "/api/progress");
        expect(puts).toHaveLength(1);
        expect(puts[0].body).toEqual({ [taskId]: true });

        unmount();
      }),
      { numRuns: 100 }
    );
  });
});
