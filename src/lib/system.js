import { mark, register } from './perf.js'

export class System {
  constructor() {
    register('System', this.constructor.name)
  }

  _perfBegin() {
    mark(this.constructor.name + '_BEGIN')
  }

  _perfEnd() {
    mark(this.constructor.name + '_END')
  }

  run(...args) {
    this._perfBegin()
    this.processTick(...args)
    this._perfEnd()
  }

  processTick() {
    throw new Error('Systems must override processTick()')
  }
}
