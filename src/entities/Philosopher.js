import Entity from "./Entity"

export default class Philosopher extends Entity {
  constructor({ x, y, plateRadius, plateThickness, plateFill, plateStroke, foodColor }) {
    super(x, y)

    this.plateRadius = plateRadius
    this.plateThickness = plateThickness
    this.plateFill = plateFill
    this.plateStroke = plateStroke
    this.foodRadius = plateRadius * 0.85
    this.foodColor = foodColor
    this.eating = 0
    this.chops = []
    this.tick = 0

    this.foodCanvas
    this.foodContext

    this.generateFoodCanvas()
  }

  generateFoodCanvas() {
    const { foodRadius, foodColor } = this
    this.foodCanvas = document.createElement("canvas")
    this.foodContext = this.foodCanvas.getContext("2d")
    this.foodCanvas.width = foodRadius * 2
    this.foodCanvas.height = foodRadius * 2

    const ctx = this.foodContext
    ctx.beginPath()
    ctx.arc(foodRadius, foodRadius, foodRadius, 0, 2 * Math.PI, false)
    ctx.fillStyle = foodColor
    ctx.fill()
  }

  update(dt) {
    const { plateFill, foodRadius, foodContext: ctx } = this
    this.tick++

    this.eating = Math.max(0, this.eating - dt)

    if (this.eating > 0 && this.tick % 60 == 0) {
      ctx.fillStyle = plateFill
      ctx.beginPath()
      const r = 5 + Math.random() * foodRadius * 0.3 | 0
      const l = (foodRadius - r) * Math.random() | 0
      const phi = Math.random() * 2 * Math.PI
      ctx.arc( 
        foodRadius + l * Math.cos(phi),
        foodRadius + l * Math.sin(phi),
        r,
        0,
        2 * Math.PI,
        false
      );
      ctx.fill()
    }
  }

  render(context) {
    const { 
      plateRadius, 
      plateThickness, 
      plateFill, 
      plateStroke,
      foodRadius, 
      foodCanvas 
    } = this
    const { x, y } = this.position

    context.save()
    context.shadowColor = plateFill
    context.shadowBlur = 3
    context.fillStyle = plateFill
    context.strokeStyle = plateStroke
    context.lineWidth = plateThickness
    context.beginPath()
    context.arc(x, y, plateRadius, 0, 2 * Math.PI, false)
    context.fill()
    context.stroke()
    context.restore()

    // food
    const offset = plateRadius - foodRadius - plateRadius
    context.drawImage(foodCanvas, x + offset, y + offset)

    context.globalAlpha = 1

    if (this.eating == 0) {
      context.beginPath()
      context.arc(x, y, plateRadius, 0, 2 * Math.PI, false)
      context.fillStyle = "rgba(50,50,50,0.85)"
      context.fill()
    }
  }
}