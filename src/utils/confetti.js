/**
 * Confetti animation utilities
 * Centralizes confetti celebration animations for correct answers
 */

import confetti from 'canvas-confetti'
import { CONFETTI_CONFIG } from './constants'

/**
 * Trigger a celebration confetti animation
 * Creates a main burst followed by two side bursts after a delay
 */
export function triggerConfetti() {
  // Main burst from center
  confetti(CONFETTI_CONFIG.MAIN_BURST)
  
  // Secondary bursts from sides after delay
  setTimeout(() => {
    confetti({
      ...CONFETTI_CONFIG.SECONDARY_BURST,
      ...CONFETTI_CONFIG.LEFT_BURST,
    })
    confetti({
      ...CONFETTI_CONFIG.SECONDARY_BURST,
      ...CONFETTI_CONFIG.RIGHT_BURST,
    })
  }, CONFETTI_CONFIG.DELAY_MS)
}

