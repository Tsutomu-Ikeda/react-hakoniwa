import { Route } from "./route";
import { useState } from "react";

export class Train {
  route: Route;
  curveIndex: number;
  setCurveIndex: React.Dispatch<React.SetStateAction<number>>;
  curveOffset: number;
  setCurveOffset: React.Dispatch<React.SetStateAction<number>>;

  constructor(route: Route) {
    this.route = route;
    const [curveIndex, setCurveIndex] = useState(0);
    const [curveOffset, setCurveOffset] = useState(0);
    this.curveIndex = curveIndex;
    this.setCurveIndex = setCurveIndex;
    this.curveOffset = curveOffset;
    this.setCurveOffset = setCurveOffset;
  }

  calcTrans(count: number) {
    if (
      count >
      this.curveOffset + this.route.listCurveLength[this.curveIndex]
    ) {
      this.setCurveOffset(
        this.curveOffset + this.route.listCurveLength[this.curveIndex]
      );
      this.setCurveIndex((this.curveIndex + 1) % this.route.curves.length);
    }
    const { point, t } = this.route.curves[this.curveIndex].getPointAtDistance(
      count - this.curveOffset
    );

    const rotation = () => {
      const point = this.route.curves[this.curveIndex].normal(t);

      if (Math.abs(point.x) < 0.000001) {
        if (point.y > 0) return Math.PI / 2;
        else return (Math.PI * 3) / 2;
      }
      return Math.atan(point.y / point.x);
    };

    return {
      point,
      rotation: rotation(),
    };
  }
}
