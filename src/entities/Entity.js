import Vector from "../geom/Vector"

/**
 * The base class for all world object. They essentially are renderable
 * objects
 *
 * @class
 */
export default class Entity {
  constructor(x, y) {
    this.position = new Vector(x, y)
  }

  update(dt) {
    
  }

  render(context) {

  }
}