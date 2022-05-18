import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Route } from "./route";

export class RouteDecider {
  routeMappings: { [key: string]: Route[] } = {};
  passed: { [key: string]: boolean } = {};
  setPassed: { [key: string]: Dispatch<SetStateAction<boolean>> } = {};
  lastPassedAt: { [key: string]: Date } = {};
  setLastPassedAt: { [key: string]: Dispatch<SetStateAction<Date>> } = {};
  routeSwitchIndex: { [key: string]: number } = {};
  setRouteSwitchIndex: { [key: string]: Dispatch<SetStateAction<number>> } = {};

  constructor(routeMappings: { [key: string]: Route[] }) {
    this.routeMappings = routeMappings;

    Object.keys(routeMappings).forEach((key) => {
      const [passed, setPassed] = useState(false);
      this.passed[key] = passed;
      this.setPassed[key] = setPassed;

      const [routeSwitchIndex, setRouteSwitchIndex] = useState(0);
      this.routeSwitchIndex[key] = routeSwitchIndex;
      this.setRouteSwitchIndex[key] = setRouteSwitchIndex;

      const [lastPassedAt, setLastPassedAt] = useState(new Date());
      this.lastPassedAt[key] = lastPassedAt;
      this.setLastPassedAt[key] = setLastPassedAt;

      useEffect(() => {
        if (passed) {
          const timeoutId = setTimeout(() => {
            function sample<T>(array: T[]) {
              return Math.floor(Math.random() * array.length);
            }
            const newRouteSwitchIndex = sample(
              this.routeMappings[key].map((route, index) => ({ route, index }))
            );
            if (newRouteSwitchIndex != routeSwitchIndex) {
              console.log(key, "point changed");
              setRouteSwitchIndex(newRouteSwitchIndex);
            }
            setPassed(false);
          }, 500);
          return () => {
            clearTimeout(timeoutId);
          };
        } else {
          return () => {};
        }
      }, [passed, lastPassedAt]);
    });
  }

  next(route: Route): Route {
    this.setPassed[route.id](true);
    this.setLastPassedAt[route.id](new Date());

    return this.routeMappings[route.id][this.routeSwitchIndex[route.id]];
  }
}
