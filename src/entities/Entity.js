import Vector from "../geom/Vector";

/**
 * The base class for all world object. They essentially are renderable
 * objects
 *
 * @class
 */
export default class Entity {
  constructor(x, y) {
    this.position = new Vector(x, y);
  }

  /**
   * Updates an entity using its internal logic
   * @param {number} dt The elapsed time in seconds between previous and current frames
   */
  update(dt) {}

  /**
   * Draws an element to the screen
   * @param {CanvasRenderingContext2D} context
   */
  render(context) {}
}
