import type { InstitutionalFlowSnapshot } from "./types";

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export function calculateInstitutionalFlow(
  input: InstitutionalFlowSnapshot,
): number | null {
  const values: number[] = [];

  if (input.fiiNet !== null) values.push(clamp(50 + input.fiiNet / 20));
  if (input.diiNet !== null) values.push(clamp(50 + input.diiNet / 20));
  if (input.deliveryRatio !== null) {
    values.push(clamp((input.deliveryRatio / 100) * 100));
  }
  if (input.institutionalOwnershipChange !== null) {
    values.push(clamp(50 + input.institutionalOwnershipChange * 5));
  }

  if (!values.length) return null;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}
