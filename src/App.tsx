import { useState, Fragment, Dispatch, SetStateAction, useEffect } from "react";
import {
  BezierExtended,
  roundedRectangleRoute,
  Route,
  RouteDecider,
  Train,
} from "./lib";

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

  const [routes, _setRoutes] = useState({
    "0": new Route([
      new BezierExtended(310, 725, 310, 875, 410, 875),
      new BezierExtended(410, 875, 510, 875, 610, 875),
      new BezierExtended(610, 875, 910, 875, 910, 575),
    ]),
    "1": roundedRectangleRoute(250, 50, 380, 1000, 100),
    "2": new Route([new BezierExtended(250, -500, 260, -200, 280, 225)]),
    "3": roundedRectangleRoute(600, 25, 550, 800, 150),
    "4": new Route([new BezierExtended(310, 325, 310, 575, 310, 725)]),
    "5": new Route([
      new BezierExtended(310, 725, 310, 760, 280, 790, 280, 825),
    ]),
    "6": new Route([
      new BezierExtended(280, 225, 280, 260, 310, 290, 310, 325),
    ]),
    "7": new Route([new BezierExtended(280, 825, 280, 2025, 280, 3225)]),
    "8": new Route([new BezierExtended(280, 225, 280, 525, 280, 825)]),
    "9": new Route([
      new BezierExtended(910, 575, 910, 450, 910, 325),
      new BezierExtended(910, 325, 910, 25, 610, 25),
      new BezierExtended(610, 25, 310, 25, 310, 325),
    ]),
  });

  const offsets = [0, 250, 500, 750, 1000, 1250, 1500, 1750];

  const routeDecider = new RouteDecider({
    [routes["4"].id]: [routes["0"], routes["5"]],
    [routes["0"].id]: [routes["9"]],
    [routes["9"].id]: [routes["4"]],
    [routes["2"].id]: [routes["8"], routes["6"]],
    [routes["6"].id]: [routes["4"]],
    [routes["8"].id]: [routes["7"]],
    [routes["5"].id]: [routes["7"]],
    [routes["7"].id]: [routes["2"]],
    [routes["1"].id]: [routes["1"]],
    [routes["3"].id]: [routes["3"]],
  });

  const trains = [
    () => new Train(routes["1"], routeDecider),
    () => new Train(routes["3"], routeDecider),
    () => new Train(routes["2"], routeDecider),
    () => new Train(routes["9"], routeDecider),
  ];

  return (
    <>
      {Object.values(routes).map((route, index) => (
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
