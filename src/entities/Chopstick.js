import Entity from "./Entity"

export default class Chopstick extends Entity {
  constructor({ x, y, angle, length, thickness, color }) {
    super(x, y)

    this.base = this.position.clone()
    this.angle = angle
    this.length = length
    this.thickness = thickness
    this.color = color

    this.picked = false
    this.k = 0
    this.target = null
  }

  pickup(target) {
    this.k = 0
    this.picked = true
    this.target = target
  }

  drop() {
    this.k = 0
    this.picked = false
    this.target = this.base
  }

  update(dt) {
    if (!this.target) return

    const { x: tx, y: ty } = this.target
    const { x, y } = this.position

    if ((tx - x) ** 2 + (ty - y) ** 2 < 5 ** 2)
      this.k = 1

    this.position.x = x + this.k * (tx - x)
    this.position.y = y + this.k * (ty - y)
    this.k += dt / 20

    if (this.k > 1) {
      this.k = 1
      this.target = null
    }
  }

  render(context) {
    const { 
      angle,
      length,
      thickness,
      color
    } = this
    const { x, y } = this.position

    context.strokeStyle = color
    context.lineWidth = thickness
    context.save()
    context.beginPath()
    context.moveTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
    context.lineTo(x - Math.cos(angle) * length, y - Math.sin(angle) * length)
    context.stroke()
  }
}