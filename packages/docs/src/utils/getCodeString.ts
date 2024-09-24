import { VisualizationState } from "r3f-particle-field/src/types";
import { getCssFromBgState } from "./backgroundHelper";
import stringify from "json-stringify-pretty-compact";

const to4Decimals = (n: number) => Math.round(n * 10000) / 10000;

const getCodeString = (state: VisualizationState) => {
  const { particleConfig, editorConfig } = state;
  const css = getCssFromBgState(editorConfig);

  particleConfig.rotationRange = particleConfig.rotationRange.map(
    to4Decimals
  ) as [number, number];

  let codeString = `// 🟢 installation guide at https://github.com/brettlyne/r3f-particle-field
import React from "react";
import { Canvas } from "@react-three/fiber";
`;

  if (editorConfig.statsOn && editorConfig.interactiveCamera)
    codeString += `import { Stats, ArcballControls } from '@react-three/drei';\n`;
  else if (editorConfig.statsOn)
    codeString += `import { Stats } from '@react-three/drei';\n`;
  else if (editorConfig.interactiveCamera)
    codeString += `import { ArcballControls } from '@react-three/drei';\n`;

  codeString += `import { ParticleField } from "r3f-particle-field";

const particleConfig = `;
  codeString += stringify(particleConfig);

  codeString += `\n
const cameraConfig = {
  fov: ${editorConfig.fov},
  matrix: ${JSON.stringify(editorConfig.cameraMatrix.map(to4Decimals))},
  near: 0.1,
  far: 1000,
}

const MyParticleCanvas: React.FC = () => {
  return (
    <div
      style={{
        width: "${editorConfig.dimensions[0]}",
        height: "${editorConfig.dimensions[1]}",
        background: "${css}",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          // 20% buffer on each side so particles don't blink out at edges
          width: "140%",
          height: "140%",
          left: "-20%",
          top: "-20%",
        }}
      >
        <Canvas camera={cameraConfig}>
          <ParticleField {...particleConfig} />\n`;

  if (editorConfig.interactiveCamera)
    codeString += `          <ArcballControls />\n`;
  if (editorConfig.statsOn) codeString += `          <Stats />\n`;

  codeString += `        </Canvas>
      </div>
    </div>
  );
};

export default MyParticleCanvas;

`;

  return codeString;
};

export default getCodeString;
