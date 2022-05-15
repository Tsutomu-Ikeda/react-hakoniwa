import { Route } from "../lib";
import { Graphics } from "@inlet/react-pixi";
import { Graphics as PixiGraphics } from "pixi.js";
import { useCallback } from "react";

export const DrawLine = ({ route }: { route: Route }) => {
  const draw = useCallback((g: PixiGraphics) => {
    g.clear();
    route.curves.forEach((curve) => {
      g.lineStyle(5, 0xadadad, 1);
      g.moveTo(curve.points[0].x, curve.points[0].y);

      if (curve.points.length == 3) {
        g.quadraticCurveTo(
          curve.points[1].x,
          curve.points[1].y,
          curve.points[2].x,
          curve.points[2].y
        );
      } else if (curve.points.length == 4) {
        g.bezierCurveTo(
          curve.points[1].x,
          curve.points[1].y,
          curve.points[2].x,
          curve.points[2].y,
          curve.points[3].x,
          curve.points[3].y
        );
      }
    });
  }, []);

  return (
    <>
      <Graphics draw={draw} />
    </>
  );
};
