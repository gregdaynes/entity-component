export class System {
  processTick() {
    throw new Error('Systems must override processTick()')
  }
}
