'use client';

import React from 'react';
import { Composition } from 'remotion';
import { NebulaComposition } from './NebulaComposition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="nebula-animation"
        component={NebulaComposition}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
