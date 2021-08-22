import { Component } from './lib/component.js'

export class Renderable extends Component {
  constructor() {
    super()
    this.renderable = true
  }

  toJSON() {
    return this.renderable
  }
}
