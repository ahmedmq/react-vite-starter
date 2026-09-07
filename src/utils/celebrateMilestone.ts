import confetti, { type Options } from 'canvas-confetti'

const PALETTE = [
  '#646cff',
  '#61dafb',
  '#ff6b6b',
  '#ffd93d',
  '#6bcb77',
  '#c77dff',
  '#ff85a1',
  '#f9c74f',
]

function fire(options: Options) {
  void confetti({
    colors: PALETTE,
    disableForReducedMotion: true,
    ...options,
  })
}

function sideCannon(originX: number, angle: number, particleCount: number) {
  fire({
    particleCount,
    angle,
    spread: 65,
    startVelocity: 58,
    origin: { x: originX, y: 0.72 },
    ticks: 220,
    scalar: 1.05,
  })
}

function intensityFor(milestone: number): number {
  if (milestone >= 100) return 2.2
  if (milestone >= 50) return 1.7
  if (milestone >= 25) return 1.35
  return 1
}

export function celebrateMilestone(milestone: number) {
  const scale = intensityFor(milestone)

  sideCannon(0.08, 62, Math.round(90 * scale))
  sideCannon(0.92, 118, Math.round(90 * scale))

  fire({
    particleCount: Math.round(70 * scale),
    spread: 100,
    origin: { y: 0.5 },
    startVelocity: 48,
    scalar: 1.15,
    ticks: 200,
  })

  if (milestone >= 25) {
    window.setTimeout(() => {
      fire({
        particleCount: Math.round(45 * scale),
        spread: 360,
        ticks: 110,
        origin: { y: 0.35 },
        gravity: 0.55,
        decay: 0.91,
        startVelocity: 32,
        shapes: ['star'],
        scalar: 1.5,
      })
    }, 180)
  }

  if (milestone >= 50) {
    window.setTimeout(() => {
      sideCannon(0.2, 72, Math.round(55 * scale))
      sideCannon(0.8, 108, Math.round(55 * scale))
      fire({
        particleCount: Math.round(50 * scale),
        spread: 120,
        origin: { y: 0.45 },
        startVelocity: 38,
        scalar: 0.9,
        ticks: 160,
      })
    }, 380)
  }

  if (milestone >= 100) {
    const duration = 2200
    const end = Date.now() + duration

    const shower = () => {
      fire({
        particleCount: 4,
        angle: 90,
        spread: 360,
        origin: { x: Math.random(), y: Math.random() * 0.45 },
        startVelocity: 38,
        ticks: 140,
        scalar: Math.random() * 0.6 + 0.8,
      })

      if (Date.now() < end) {
        requestAnimationFrame(shower)
      }
    }

    window.setTimeout(() => requestAnimationFrame(shower), 550)
  }
}
