// import world object
import Table from "./entities/Table"
import Philosopher from "./entities/Philosopher"
import Chopstick from "./entities/Chopstick"

const view = { width: 0, height: 0 }
let canvas, context
let _lt, now, dt

let table, philosophers, chopsticks, entities

// config
const settings = {
  plateRadius: 50,
  plateThickness: 2,
  plateFill: "#444",
  plateStroke: "#555",
  philosophersCount: 5,
  foodSlices: 10,
  foodColor: "#fff",
  chopstickLength: 20,
  chopstickColor: "#fff",
  chopstickThickness: 3
}

window.onload = setup
window.onresize = resizeView

function setup() {
  // display
  createCanvas()
  resizeView()

  // create entities
  entities = []
  createTable()
  createChopsticks()
  createPhilosophers()

  kickoff()
}

function resizeView() {
  view.width = window.innerWidth
  view.height = window.innerHeight
  canvas.width = view.width
  canvas.height = view.height
}

function createCanvas() {
  canvas = document.createElement("canvas")
  context = canvas.getContext("2d")
  document.body.appendChild(canvas)
}

function createTable() {
  table = new Table({
    x: view.width / 2,
    y: view.height / 2,
    radius: Math.min(view.width, view.height) * 0.3,
    thickness: 4,
    stroke: "rgba(255,255,255,0.95)",
    fill: "rgba(255,255,255,0.1)"
  })
  entities.push(table)
}

function createPhilosophers() {
  const { position: { x, y }, radius } = table
  const { 
    plateFill, 
    plateRadius, 
    plateStroke, 
    plateThickness, 
    foodSlices, 
    foodColor, 
    philosophersCount 
  } = settings

  philosophers = []
  for (let i = 0; i < philosophersCount; i++) {
    philosophers.push(new Philosopher({
      x: x + radius * Math.cos( i * Math.PI * 2 / philosophersCount ),
      y: y + radius * Math.sin( i * Math.PI * 2 / philosophersCount ),
      plateFill,
      plateRadius,
      plateStroke,
      plateThickness,
      foodSlices,
      foodColor
    }))
  }

  philosophers[0].eating = true

  entities.push(...philosophers)
}

function createChopsticks() {
  const { position: { x, y }, radius } = table
  const { 
    chopstickLength: length,
    chopstickColor: color,
    chopstickThickness: thickness,
    philosophersCount
  } = settings

  chopsticks = []

  for (let i = 0; i < philosophersCount; i++) {
    const angle = (i + 0.5) * Math.PI * 2 / philosophersCount
    chopsticks.push(new Chopstick({
      x: x + radius * Math.cos( angle ),
      y: y + radius * Math.sin( angle ),
      angle,
      length,
      thickness,
      color
    }))
  }

  entities.push(...chopsticks)
}

function update() {
  now = Date.now()
  dt = (now - (_lt || 0)) / 1000
  _lt = now

  entities.forEach(e => e.update(dt))
}

function render() {
  context.clearRect(0, 0, view.width, view.height)
  entities.forEach(e => e.render(context))
}


function kickoff() {
  const loop = () => {
    update()
    render()
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
}
