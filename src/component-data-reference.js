import { Component } from './lib/component.js'

export class DataRef extends Component {
  constructor({ dataRef, data = null } = {}) {
    super()
    this.dataRef = dataRef
    this.data = data
  }

  toJSON() {
    return {
      dataRef: this.dataRef,
      data: this.data,
    }
  }
}
