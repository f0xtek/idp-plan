// Feature: learning-plan-checkboxes, Property 6: Token derivation is deterministic and well-formed

import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { deriveToken } from "../App.jsx";

// Arbitrary: passphrase strings of at least 8 characters
const passphraseArb = fc.string({ minLength: 8, maxLength: 200 });

describe("Property 6: Token derivation is deterministic and well-formed", () => {
  it("deriveToken always returns a 64-char lowercase hex string", async () => {
    await fc.assert(
      fc.asyncProperty(passphraseArb, async (passphrase) => {
        const token = await deriveToken(passphrase);
        expect(token).toMatch(/^[0-9a-f]{64}$/);
      }),
      { numRuns: 100 }
    );
  });

  it("deriveToken is deterministic — same passphrase produces same token", async () => {
    await fc.assert(
      fc.asyncProperty(passphraseArb, async (passphrase) => {
        const token1 = await deriveToken(passphrase);
        const token2 = await deriveToken(passphrase);
        expect(token1).toBe(token2);
      }),
      { numRuns: 100 }
    );
  });

  it("different passphrases produce different tokens", async () => {
    await fc.assert(
      fc.asyncProperty(
        passphraseArb,
        passphraseArb,
        async (passphrase1, passphrase2) => {
          fc.pre(passphrase1 !== passphrase2);
          const token1 = await deriveToken(passphrase1);
          const token2 = await deriveToken(passphrase2);
          expect(token1).not.toBe(token2);
        }
      ),
      { numRuns: 100 }
    );
  });
});
