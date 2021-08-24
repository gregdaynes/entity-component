import { mark, register } from './perf.js'

export class System {
  constructor(engine) {
    this.engine = engine
    this.coldStart = true
  }

  _perfRegister() {
    if (this.coldStart) register('System', this.constructor.name)
    this.coldStart = false
  }

  _perfBegin() {
    mark(this.constructor.name + '_BEGIN')
  }

  _perfEnd() {
    mark(this.constructor.name + '_END')
  }

  run(args) {
    this._perfRegister()

    this._perfBegin()
    this.processTick.bind(null, this.engine)(args)
    this._perfEnd()
  }

  processTick() {
    throw new Error('Systems must override processTick()')
  }
}
