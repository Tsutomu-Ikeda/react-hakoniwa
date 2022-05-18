import { BezierExtended } from "./bezier";
import { v4 as uuidv4 } from "uuid";

export class Route {
  id: string;
  curves: BezierExtended[];
  listCurveLength: number[];

  constructor(curves: BezierExtended[]) {
    this.id = uuidv4();
    this.curves = curves;
    this.listCurveLength = curves.map((curve) => curve.length());
  }

  append(left: Route) {
    return new Route([...this.curves, ...left.curves]);
  }
}

export const roundedRectangleRoute = (
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) =>
  new Route([
    new BezierExtended(x + radius, y, x + width / 2, y, x + width - radius, y),
    new BezierExtended(
      x + width - radius,
      y,
      x + width,
      y,
      x + width,
      y + radius
    ),
    new BezierExtended(
      x + width,
      y + radius,
      x + width,
      y + height / 2,
      x + width,
      y + height - radius
    ),
    new BezierExtended(
      x + width,
      y + height - radius,
      x + width,
      y + height,
      x + width - radius,
      y + height
    ),
    new BezierExtended(
      x + width - radius,
      y + height,
      x + width / 2,
      y + height,
      x + radius,
      y + height
    ),
    new BezierExtended(
      x + radius,
      y + height,
      x,
      y + height,
      x,
      y + height - radius
    ),
    new BezierExtended(
      x,
      y + height - radius,
      x,
      y + height / 2,
      x,
      y + radius
    ),
    new BezierExtended(x, y + radius, x, y, x + radius, y),
  ]);
