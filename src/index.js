import dat from "dat.gui";
// import world object
import Table from "./entities/Table";
import Philosopher from "./entities/Philosopher";
import Chopstick from "./entities/Chopstick";

const view = { width: 0, height: 0 };
let canvas, context;
let _lt, now, dt;

let table, philosophers, chopsticks, entities, eatingQueue;
let gui;

// config
const settings = {
  plateRadius: 35,
  plateThickness: 2,
  plateFill: "#444",
  plateStroke: "#555",
  philosophersCount: 6,
  foodSlices: 10,
  foodColor: "#fff",
  chopstickLength: 25,
  chopstickColor: "#fff",
  chopstickThickness: 2,
  allowDeadlock: false,

  restart() {
    createEntities();
  },
};
window.onload = setup;
window.onresize = resizeView;

function setupGUI() {
  gui = new dat.GUI();

  const plate = gui.addFolder("Plate (requires restart)");
  plate.add(settings, "plateRadius").name("radius");
  plate
    .add(settings, "plateThickness")
    .name("thickness")
    .min(1)
    .max(10)
    .step(1);
  plate.addColor(settings, "plateStroke").name("stroke");
  plate.addColor(settings, "foodColor").name("color");

  const chops = gui.addFolder("Chopsticks");

  chops.add(settings, "philosophersCount").name("count");
  chops
    .add(settings, "chopstickLength")
    .name("length")
    .min(1)
    .max(30)
    .step(1)
    .onChange(changeProp(chopsticks, "length"));
  chops
    .addColor(settings, "chopstickColor")
    .name("color")
    .onChange(changeProp(chopsticks, "color"));
  chops
    .add(settings, "chopstickThickness")
    .name("thickness")
    .min(1)
    .max(10)
    .step(1)
    .onChange(changeProp(chopsticks, "thickness"));

  const config = gui.addFolder("Config");
  config.add(settings, "allowDeadlock");

  gui.add(settings, "restart");

  function changeProp(lst, prop) {
    return (value) => lst.forEach((item) => (item[prop] = value));
  }
}

function setup() {
  // display
  createCanvas();
  resizeView();

  // create entities
  createEntities();

  setupGUI();
  kickoff();
}

function createEntities() {
  entities = [];
  eatingQueue = [];
  createTable();
  createPhilosophers();
  createChopsticks();
}

function resizeView() {
  view.width = window.innerWidth;
  view.height = window.innerHeight;
  canvas.width = view.width;
  canvas.height = view.height;
}

function createCanvas() {
  canvas = document.createElement("canvas");
  context = canvas.getContext("2d");
  document.body.appendChild(canvas);
}

function createTable() {
  table = new Table({
    x: view.width / 2,
    y: view.height / 2,
    radius: Math.min(view.width, view.height) * 0.3,
    thickness: 4,
    stroke: "rgba(230,230,230,0.8)",
    fill: "rgba(230,230,230,0.1)",
  });
  entities.push(table);
}

function createPhilosophers() {
  const {
    position: { x, y },
    radius,
  } = table;
  let {
    plateFill,
    plateRadius,
    plateStroke,
    plateThickness,
    foodSlices,
    foodColor,
    philosophersCount,
  } = settings;

  philosophers = [];
  for (let i = 0; i < philosophersCount; i++) {
    plateFill = `hsl(${((i / philosophersCount) * 360) | 0}, 100%, 40%)`;
    philosophers.push(
      new Philosopher({
        x: x + radius * Math.cos((i * Math.PI * 2) / philosophersCount),
        y: y + radius * Math.sin((i * Math.PI * 2) / philosophersCount),
        plateFill,
        plateRadius,
        plateStroke,
        plateThickness,
        foodSlices,
        foodColor,
      })
    );
  }

  entities.push(...philosophers);
}

function createChopsticks() {
  const {
    position: { x, y },
    radius,
  } = table;
  const {
    chopstickLength: length,
    chopstickColor: color,
    chopstickThickness: thickness,
    philosophersCount,
  } = settings;

  chopsticks = [];

  for (let i = 0; i < philosophersCount; i++) {
    const angle = ((i + 0.5) * Math.PI * 2) / philosophersCount;
    chopsticks.push(
      new Chopstick({
        x: x + radius * Math.cos(angle),
        y: y + radius * Math.sin(angle),
        angle,
        length,
        thickness,
        color,
      })
    );
  }

  // do this to correct order
  chopsticks.unshift(chopsticks.pop());

  entities.push(...chopsticks);
}

function update() {
  now = Date.now();
  dt = Math.min(2000, now - (_lt || 0)) / 1000;
  _lt = now;

  const i = eatingQueue.length
    ? eatingQueue.shift()
    : (Math.random() * philosophers.length) | 0;
  // const i = 0
  const p = philosophers[i];
  const c1 = chopsticks[i];
  const c2 = chopsticks[(i + 1) % philosophers.length];
  const pivot = p.position;
  const target = p.position
    .clone()
    .circum(pivot, p.plateRadius * 1.2, c1.angle);

  if (settings.allowDeadlock) {
    if (p.eating == 0) {
      if (!c1.picked && !c1.target && !p.chops[0]) {
        const target = p.position
          .clone()
          .circum(pivot, p.plateRadius * 1.2, c1.angle);
        c1.pickup(target);
        p.chops[0] = c1;
      } else if (!c2.picked && !c2.target && !p.chops[1]) {
        const target = p.position
          .clone()
          .circum(pivot, p.plateRadius * 1.2, c2.angle);
        c2.pickup(target);
        p.chops[1] = c2;
      }
      if (p.chops[0] && p.chops[1]) {
        p.eating = 10;
      }
    }
  } else if (p.eating == 0 && !c1.picked && !c2.picked) {
    // ensure they are at base first
    if (!c1.target && !c2.target) {
      const t1 = p.position
        .clone()
        .circum(pivot, p.plateRadius * 1.2, c1.angle);
      const t2 = p.position
        .clone()
        .circum(pivot, p.plateRadius * 1.2, c2.angle);
      c1.pickup(t1);
      c2.pickup(t2);
      p.eating = 10;
      p.chops = [c1, c2];
    } else {
      if (!eatingQueue.includes(i)) eatingQueue.push(i);
    }
  }

  entities.forEach((e) => e.update(dt));

  philosophers.forEach((p, i) => {
    if (p.eating <= 0 && p.chops[0] && p.chops[1]) {
      const [c1, c2] = p.chops;
      c1.drop();
      c2.drop();
      p.chops = [];
      p.eating = 0;
    }
  });
}

function render() {
  context.fillStyle = "rgba(0,0,0,0.7)";
  context.fillRect(0, 0, view.width, view.height);

  context.font = "24px Ubuntu Mono";
  context.textBaseline = "top";
  context.textAlign = "center";
  context.fillStyle = "#fff";
  context.fillText("Dining Philosophers", view.width / 2, 40);

  entities.forEach((e) => e.render(context));
}

function kickoff() {
  const loop = () => {
    update();
    render();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
