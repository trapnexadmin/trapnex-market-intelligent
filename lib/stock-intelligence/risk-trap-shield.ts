export interface RiskShieldInputs {
  dangerScore: number | null;
  leverageRisk: number | null;
  governanceRisk: number | null;
  liquidityRisk: number | null;
  abnormalPriceVolume: number | null;
}

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export function calculateRiskTrapShield(input: RiskShieldInputs): number | null {
  const risks = [
    input.dangerScore,
    input.leverageRisk,
    input.governanceRisk,
    input.liquidityRisk,
    input.abnormalPriceVolume,
  ].filter((v): v is number => v !== null && Number.isFinite(v));

  if (!risks.length) return null;

  const avgRisk = risks.reduce((a, b) => a + b, 0) / risks.length;
  return Math.round(clamp(100 - avgRisk) * 10) / 10;
}
