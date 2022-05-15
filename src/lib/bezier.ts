import { Bezier, Point } from "bezier-js";

export class BezierExtended extends Bezier {
  getPointAtDistance(offset: number, epsilon: number = 0.5) {
    let l = this.length();
    if (offset < 0) return { point: this.get(0), t: 0 };
    if (offset > l) return { point: this.get(1), t: 1 };
    let i = 0,
      maxIterations = 10;
    let error = l;
    let guess = offset / l;
    while (error > epsilon && i < maxIterations) {
      let segmentLength = this.split(guess).left.length();
      error = segmentLength - offset;
      guess = guess - error / l;
      i += 1;
    }
    return { point: this.get(guess), t: guess };
  }
}
