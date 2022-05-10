import { Spring } from "react-spring";
import { Graphics as PixiGraphics, Texture } from "pixi.js";
import { Stage, Graphics, Sprite, useTick, Text } from "@inlet/react-pixi";
import React, { useCallback, useState, useEffect, useMemo } from "react";
import { Bezier, Point } from "bezier-js";

class BezierExtended extends Bezier {
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

class Route {
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

class Train {
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

const config = {
  size: { width: 1200, height: 1000 },
  spring: { mass: 10, tension: 1000, friction: 100 },
  stage: { antialias: true, backgroundColor: 0x333333 },
};

const useFrameCount = () => {
  const [frameCount, setFrameCount] = useState(0);

  useTick((delta) => {
    setFrameCount(frameCount + (16.666666666666 + delta));
  });

  return frameCount;
};

const DrawLine = ({ route }: { route: Route }) => {
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

const DrawTrain = ({
  frameCount,
  train,
}: {
  frameCount: number;
  train: Train;
}) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const { point, rotation: newRotation } = train.calcTrans(frameCount / 5);
    setX(point.x);
    setY(point.y);
    setRotation(newRotation);
  }, [frameCount]);

  return (
    <Spring native config={config.spring}>
      {() => (
        <Sprite
          texture={Texture.WHITE}
          tint={0xd1eaff}
          anchor={0.5}
          x={x}
          y={y}
          rotation={rotation}
          width={20}
          height={40}
        />
      )}
    </Spring>
  );
};

const Application = ({
  setFrameCountExternal,
}: {
  setFrameCountExternal?: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const frameCount = useFrameCount();

  useEffect(() => {
    setFrameCountExternal?.(frameCount);
  }, [frameCount]);

  const route0 = () =>
    new Route([new BezierExtended(280, 225, 280, 260, 310, 290, 310, 325)]);
  const route1 = () =>
    new Route([
      new BezierExtended(310, 325, 310, 575, 310, 725),
      new BezierExtended(310, 725, 310, 875, 410, 875),
      new BezierExtended(410, 875, 510, 875, 610, 875),
      new BezierExtended(610, 875, 910, 875, 910, 575),
      new BezierExtended(910, 575, 910, 450, 910, 325),
      new BezierExtended(910, 325, 910, 25, 610, 25),
      new BezierExtended(610, 25, 310, 25, 310, 325),
    ]);
  const route4 = () =>
    new Route([new BezierExtended(310, 675, 310, 710, 280, 740, 280, 775)]);
  const route2 = () =>
    new Route([
      new BezierExtended(250, -500, 260, -200, 280, 225),
      new BezierExtended(280, 225, 280, 675, 280, 1125),
    ]);
  const route3 = (
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) =>
    new Route([
      new BezierExtended(
        x + radius,
        y,
        x + width / 2,
        y,
        x + width - radius,
        y
      ),
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

  const routes = [
    route1(),
    route3(250, 50, 380, 1000, 100),
    route2(),
    route3(600, 25, 550, 800, 150),
    route4(),
    route0(),
  ];

  const offsets = [0, 250, 500, 750, 1000, 1250];

  const trains = [
    () => new Train(routes[0]),
    () => new Train(routes[1]),
    () => new Train(routes[3]),
    () => new Train(routes[2]),
  ];
  return (
    <>
      {routes.map((route, index) => (
        <DrawLine key={index} route={route} />
      ))}
      {trains.map((train, index) => {
        return (
          <React.Fragment key={index}>
            {offsets.map((offset) => (
              <React.Fragment key={offset}>
                <DrawTrain frameCount={frameCount + offset} train={train()} />
              </React.Fragment>
            ))}
          </React.Fragment>
        );
      })}
    </>
  );
};

const App = () => {
  return (
    <>
      <Stage {...config.size} options={config.stage}>
        <Application />
      </Stage>
    </>
  );
};

export default App;
