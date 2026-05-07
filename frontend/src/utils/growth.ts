type Stage = 'baby' | 'child' | 'teen' | 'adult'

export function getStageFromLevel(level: number): Stage {
  if (level >= 4) return 'adult'
  if (level === 3) return 'teen'
  if (level === 2) return 'child'
  return 'baby'
}

export function getXpProgress(xp: number) {
  return (xp % 100) / 100
}

export function getGrowthScale(level: number, xp: number) {
  const stage = getStageFromLevel(level)
  const baseByStage: Record<Stage, number> = {
    baby: 0.82,
    child: 0.94,
    teen: 1.05,
    adult: 1.14,
  }

  return Number((baseByStage[stage] + getXpProgress(xp) * 0.08).toFixed(3))
}
