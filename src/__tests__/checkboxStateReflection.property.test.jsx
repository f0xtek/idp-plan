// Feature: learning-plan-checkboxes, Property 1: Checkbox state reflects completion state

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import fc from "fast-check";
import { TaskCheckbox } from "../App.jsx";

// Arbitrary: task IDs matching the project's p{phase}-w{week}-t{task} format
const taskIdArb = fc.stringMatching(/^p[0-2]-w([1-9]|1[0-9]|2[0-4])-t[0-5]$/);

// Arbitrary: phase colors used in the app
const phaseColorArb = fc.constantFrom("#60a5fa", "#818cf8", "#a78bfa", "#34d399", "#f472b6");

describe("Property 1: Checkbox state reflects completion state", () => {
  it("renders aria-checked=true when completion state is true", () => {
    fc.assert(
      fc.property(taskIdArb, phaseColorArb, (taskId, phaseColor) => {
        const { unmount } = render(
          <TaskCheckbox
            checked={true}
            onChange={() => {}}
            phaseColor={phaseColor}
            taskLabel={taskId}
          />
        );

        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toHaveAttribute("aria-checked", "true");

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it("renders aria-checked=false when completion state is false", () => {
    fc.assert(
      fc.property(taskIdArb, phaseColorArb, (taskId, phaseColor) => {
        const { unmount } = render(
          <TaskCheckbox
            checked={false}
            onChange={() => {}}
            phaseColor={phaseColor}
            taskLabel={taskId}
          />
        );

        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toHaveAttribute("aria-checked", "false");

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it("aria-checked matches the boolean completion state for any random value", () => {
    fc.assert(
      fc.property(
        taskIdArb,
        phaseColorArb,
        fc.boolean(),
        (taskId, phaseColor, completed) => {
          const { unmount } = render(
            <TaskCheckbox
              checked={completed}
              onChange={() => {}}
              phaseColor={phaseColor}
              taskLabel={taskId}
            />
          );

          const checkbox = screen.getByRole("checkbox");
          expect(checkbox).toHaveAttribute("aria-checked", String(completed));

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("renders checkmark SVG only when checked is true", () => {
    fc.assert(
      fc.property(
        taskIdArb,
        phaseColorArb,
        fc.boolean(),
        (taskId, phaseColor, completed) => {
          const { unmount, container } = render(
            <TaskCheckbox
              checked={completed}
              onChange={() => {}}
              phaseColor={phaseColor}
              taskLabel={taskId}
            />
          );

          const svg = container.querySelector("svg");
          if (completed) {
            expect(svg).not.toBeNull();
          } else {
            expect(svg).toBeNull();
          }

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
