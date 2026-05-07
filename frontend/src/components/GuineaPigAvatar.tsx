import './GuineaPigAvatar.css'
import { getGrowthScale, getStageFromLevel, getXpProgress } from '../utils/growth'
import type { GuineaPig } from '../mockStudyPetApi'
import type { CSSProperties } from 'react'

type GuineaPigAvatarProps = {
  color?: GuineaPig['color']
  level: number
  mood: GuineaPig['mood']
  personality?: GuineaPig['personality']
  xp: number
  compact?: boolean
}

const colorClassByColor: Record<GuineaPig['color'], string> = {
  brown: 'gg-avatar--brown',
  white: 'gg-avatar--white',
  cream: 'gg-avatar--cream',
  mixed: 'gg-avatar--mixed',
}

export function GuineaPigAvatar({
  color = 'brown',
  level,
  mood,
  personality = 'hungry',
  xp,
  compact = false,
}: GuineaPigAvatarProps) {
  const stage = getStageFromLevel(level)
  const growthScale = getGrowthScale(level, xp)
  const xpProgress = Math.round(getXpProgress(xp) * 100)

  return (
    <div
      className={[
        'gg-avatar',
        colorClassByColor[color],
        `gg-avatar--stage-${stage}`,
        `gg-avatar--mood-${mood}`,
        `gg-avatar--personality-${personality}`,
        compact ? 'gg-avatar--compact' : '',
      ].join(' ')}
      aria-label={`기니피그 아바타, ${stage}, ${mood}, 성장 ${xpProgress}%`}
      style={{ '--growth-scale': growthScale } as CSSProperties}
    >
      <div className="gg-avatar__glow" />
      <div className="gg-avatar__sparkles" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="gg-avatar__shadow" />
      <div className="gg-avatar__character">
        <div className="gg-avatar__ear gg-avatar__ear--left" />
        <div className="gg-avatar__ear gg-avatar__ear--right" />
        <div className="gg-avatar__body">
          <div className="gg-avatar__patch" />
          <div className="gg-avatar__face">
            <span className="gg-avatar__eye gg-avatar__eye--left" />
            <span className="gg-avatar__eye gg-avatar__eye--right" />
            <span className="gg-avatar__nose" />
            <span className="gg-avatar__mouth" />
            <span className="gg-avatar__cheek gg-avatar__cheek--left" />
            <span className="gg-avatar__cheek gg-avatar__cheek--right" />
          </div>
          <div className="gg-avatar__belly" />
          <div className="gg-avatar__paw gg-avatar__paw--left" />
          <div className="gg-avatar__paw gg-avatar__paw--right" />
        </div>
        <div className="gg-avatar__stage-detail gg-avatar__stage-detail--teen" />
        <div className="gg-avatar__stage-detail gg-avatar__stage-detail--adult" />
        <div className="gg-avatar__personality-detail" />
        <div className="gg-avatar__hay" />
      </div>
    </div>
  )
}
