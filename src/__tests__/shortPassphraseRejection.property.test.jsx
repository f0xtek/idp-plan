// Feature: learning-plan-checkboxes, Property 8: Short passphrases are rejected

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import fc from "fast-check";
import { PassphraseModal } from "../App.jsx";

// Arbitrary: strings with length 0–7 (below the 8-character minimum)
const shortPassphraseArb = fc.string({ minLength: 0, maxLength: 7 });

describe("Property 8: Short passphrases are rejected", () => {
  it("submitting a passphrase shorter than 8 characters shows a validation error and does not call onSubmit", () => {
    fc.assert(
      fc.property(shortPassphraseArb, (shortPassphrase) => {
        const onSubmit = vi.fn();
        const { unmount } = render(
          <PassphraseModal onSubmit={onSubmit} userToken={null} />
        );

        const input = screen.getByPlaceholderText("At least 8 characters");
        const submitButton = screen.getByRole("button", { name: "Start tracking" });

        // Type the short passphrase and submit
        fireEvent.change(input, { target: { value: shortPassphrase } });
        fireEvent.click(submitButton);

        // Validation error should be visible
        expect(
          screen.getByText("Passphrase must be at least 8 characters")
        ).toBeInTheDocument();

        // onSubmit should never be called — no token derived or stored
        expect(onSubmit).not.toHaveBeenCalled();

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it("submitting a passphrase of exactly 8 characters does NOT show a validation error and calls onSubmit", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 8, maxLength: 8 }),
        (validPassphrase) => {
          const onSubmit = vi.fn();
          const { unmount } = render(
            <PassphraseModal onSubmit={onSubmit} userToken={null} />
          );

          const input = screen.getByPlaceholderText("At least 8 characters");
          const submitButton = screen.getByRole("button", { name: "Start tracking" });

          fireEvent.change(input, { target: { value: validPassphrase } });
          fireEvent.click(submitButton);

          // No validation error should appear
          expect(
            screen.queryByText("Passphrase must be at least 8 characters")
          ).not.toBeInTheDocument();

          // onSubmit should be called with the passphrase
          expect(onSubmit).toHaveBeenCalledWith(validPassphrase);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
