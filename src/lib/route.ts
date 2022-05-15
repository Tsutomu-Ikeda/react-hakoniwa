import { BezierExtended } from "./bezier";

export class Route {
  curves: BezierExtended[];
  listCurveLength: number[];

  constructor(curves: BezierExtended[]) {
    this.curves = curves;
    this.listCurveLength = curves.map((curve) => curve.length());
  }

  append(left: Route) {
    return new Route([...this.curves, ...left.curves]);
  }
}
