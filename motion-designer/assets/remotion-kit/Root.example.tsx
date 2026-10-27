/**
 * Exemplo de Root.tsx registrando o mesmo vídeo em 16:9 e 9:16.
 * Copie para src/Root.tsx (ou mescle com o existente).
 */
import React from "react";
import { Composition, Folder } from "remotion";
import { DemoVideo, demoDuration } from "./kit/example/DemoVideo";

const FPS = 30;

export const RemotionRoot: React.FC = () => (
  <Folder name="Demo">
    <Composition id="Demo-16x9" component={DemoVideo} durationInFrames={demoDuration(FPS)} fps={FPS} width={1920} height={1080} defaultProps={{ showGuides: false }} />
    <Composition id="Demo-9x16" component={DemoVideo} durationInFrames={demoDuration(FPS)} fps={FPS} width={1080} height={1920} defaultProps={{ showGuides: false }} />
  </Folder>
);
