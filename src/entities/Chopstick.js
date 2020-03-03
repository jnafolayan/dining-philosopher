import Entity from "./Entity"

export default class Chopstick extends Entity {
  constructor({ x, y, angle, length, thickness, color }) {
    super(x, y)

    this.angle = angle
    this.length = length
    this.thickness = thickness
    this.color = color
  }

  update(dt) {

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
    context.beginPath()
    context.moveTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
    context.lineTo(x - Math.cos(angle) * length, y - Math.sin(angle) * length)
    context.stroke()
  }
}