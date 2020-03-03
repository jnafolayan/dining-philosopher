import Entity from "./Entity"

export default class Table extends Entity {
  constructor({ x, y, radius, thickness = 2, fill = "#000", stroke = "#000" }) {
    super(x, y)

    this.radius = radius
    this.thickness = thickness
    this.fill = fill
    this.stroke = stroke
  }

  render(context) {
    const { radius, fill, stroke, thickness } = this
    const { x, y } = this.position

    context.fillStyle = fill
    context.strokeStyle = stroke
    context.lineWidth = thickness
    context.beginPath()
    context.arc(x, y, radius, 0, 2 * Math.PI, false)
    context.fill()
    context.stroke()

    context.beginPath()
    context.arc(x, y, 10, 0, 2 * Math.PI, false)
    context.strokeStyle = "#555"
    context.stroke()
  }
}