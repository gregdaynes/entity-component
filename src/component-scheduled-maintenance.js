import { Component } from './lib/component.js'

export class ScheduledMaintenance extends Component {
  constructor({
    dateUTC,
    facility,
    rateMultiplier = 1,
    rateMultiplierFacility = 1,
    rateMultiplierFlat = 1,
  } = {}) {
    super()
    this.dateUTC = dateUTC
    this.facility = facility
    this.rateMultiplier = rateMultiplier
    this.rateMultiplierFacility = rateMultiplierFacility
    this.rateMultiplierFlat = rateMultiplierFlat
  }

  toJSON() {
    return {
      dateUTC: this.dateUTC,
      facility: this.facility,
    }
  }
}
