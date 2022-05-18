import { Dispatch, SetStateAction, useState } from "react";

import { Route } from "./route";
import { RouteDecider } from "./route-decider";

export class Train {
  route: Route;
  routeDecider: RouteDecider;
  setRoute: Dispatch<SetStateAction<Route>>;
  curveIndex: number;
  setCurveIndex: Dispatch<SetStateAction<number>>;
  curveOffset: number;
  setCurveOffset: Dispatch<SetStateAction<number>>;

  constructor(route: Route, routeDecider: RouteDecider) {
    const [routeState, setRoute] = useState(route);
    this.route = routeState;
    this.setRoute = setRoute;
    this.routeDecider = routeDecider;
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

      if (this.curveIndex + 1 < this.route.listCurveLength.length) {
        this.setCurveIndex(this.curveIndex + 1);
      } else {
        this.setRoute(this.routeDecider.next(this.route));
        this.setCurveIndex(0);
      }
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
