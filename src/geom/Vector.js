export default class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  clone() {
    return new Vector(this.x, this.y)
  }

  circum(pivot, radius, angle) {
    this.x = pivot.x + Math.cos(angle) * radius
    this.y = pivot.y + Math.sin(angle) * radius
    return this
  }
}