import { Sprite } from "@inlet/react-pixi";
import { Texture } from "pixi.js";

import { Train } from "../lib";

import { useState, useEffect } from "react";

export const DrawTrain = ({
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
  );
};
