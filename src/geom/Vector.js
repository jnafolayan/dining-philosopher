export default class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  add(x, y) {
    this.x += x
    this.y += y
  }
}