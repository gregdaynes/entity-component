import { Component } from './lib/component.js'

export class CumulativeWear extends Component {
  constructor({ initial = 0, rate = 1 } = {}) {
    super()
    this.wear = initial
    this.rate = rate
  }

  toJSON() {
    return this.wear
  }
}
