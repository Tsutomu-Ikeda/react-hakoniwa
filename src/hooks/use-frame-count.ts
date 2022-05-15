import { useState } from "react";
import { useTick } from "@inlet/react-pixi";

export const useFrameCount = () => {
  const [frameCount, setFrameCount] = useState(0);

  useTick((delta) => {
    setFrameCount(frameCount + (16.666666666666 + delta));
  });

  return frameCount;
};
