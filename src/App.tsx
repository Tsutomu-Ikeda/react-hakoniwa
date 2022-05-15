import { Fragment, Dispatch, SetStateAction, useEffect } from "react";
import { BezierExtended, Route, Train } from "./lib";

import { Stage } from "@inlet/react-pixi";

import { useFrameCount } from "./hooks";
import { DrawLine, DrawTrain } from "./components";

const config = {
  size: { width: 1200, height: 1000 },
  spring: { mass: 10, tension: 1000, friction: 100 },
  stage: { antialias: true, backgroundColor: 0x333333 },
};

const Application = ({
  setFrameCountExternal,
}: {
  setFrameCountExternal?: Dispatch<SetStateAction<number>>;
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
          <Fragment key={index}>
            {offsets.map((offset) => (
              <Fragment key={offset}>
                <DrawTrain
                  frameCount={frameCount + offset}
                  train={train()}
                  springConfig={config.spring}
                />
              </Fragment>
            ))}
          </Fragment>
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
