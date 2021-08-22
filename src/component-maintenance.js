import { Component } from './lib/component.js'

export class Maintenance extends Component {
  constructor({ rate = 2 } = {}) {
    super()
    this.rate = rate
    this.inMaintenance = false
    this.facility = undefined
  }
}
