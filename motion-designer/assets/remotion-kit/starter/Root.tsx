import React from "react";
import { Composition } from "remotion";
import { Main, mainDuration } from "./Main";

const FPS = {{FPS}};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Main"
      component={Main}
      durationInFrames={mainDuration(FPS)}
      fps={FPS}
      width={{{W}}}
      height={{{H}}}
      defaultProps={{ showGuides: false }}
    />
  </>
);
