import { System } from './lib/system.js'
import { default as logger } from './lib/logger.js'

export class Debug extends System {
  processTick({ delta, entityManager, componentManager }) {
    logger.info({ delta, entityManager, componentManager })
  }
}
