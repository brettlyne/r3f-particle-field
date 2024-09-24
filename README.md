# Particle Field for React-Three-Fiber

<a href="https://www.npmjs.com/package/r3f-particle-field"><img src="https://img.shields.io/npm/v/r3f-particle-field"></a>
<a href="https://www.npmjs.com/package/r3f-particle-field"><img src="https://img.shields.io/npm/dm/r3f-particle-field"></a>

## [👉 try out the configurator](https://brettlyne.github.io/r3f-particle-field/)
Presets under the Scene tab are a good place to start

![preview of r3f-particle-field](https://github.com/brettlyne/r3f-particle-field/blob/main/preview.gif?raw=true "Preview of r3f-particle-field")

## installation

**Optional:** Follow the instructions here to set up a new react-three-fiber app:
https://r3f.docs.pmnd.rs/getting-started/installation

**Install packages**

```sh
npm install @react-three/fiber three
npm install @react-three/drei # for interactive controls, stats
npm install r3f-particle-field
```

**Use the configuration tool**

Use the [interactive configurator](https://brettlyne.github.io/r3f-particle-field/) to try out presets and build your particle field.
There is a **code export** in the Share tab.

## usage

The particles are rendered from (-4,-4,0) to (4,4,0) x,y,z by default.

The [configurator](https://brettlyne.github.io/r3f-particle-field/) will generate something like this:

```tsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { ParticleField } from "r3f-particle-field";

import myImage from "./my-image.png";

const particleConfig = {
  density: 5.1,
  arrangement: "spiral",
  zAxisArrangement: "dome",
  imagePath: myImage,
  animationMode: "ripples",
  particleSize: 30,
  center: [0, 0, 0],
  rippleCenter: [0, 0, 0],
  animationMagnitude: 0.9,
  rotationMode: "constant",
  rotationRange: [0, 1.5708],
  colorMode: "fieldRadial",
  color1: "#ff1cc0",
  color2: "#ca7dff",
  animationSpeed: 0.6,
  xMagnitude: 1,
  yMagnitude: 1,
  orbitInnerRadius: 0,
  orbitScale: 1,
  innerRadius: 0,
  innerScaling: 0.9,
  outerRadius: 6.1,
  outerScaling: 1.8,
  depthTestOn: true,
};

const cameraConfig = {
  fov: 84,
  matrix: [
    0.9699, -0.1188, 0.2124, 0, -0.1207, 0.5232, 0.8436, 0, -0.2113, -0.8439,
    0.4931, 0, -3.0534, -11.9827, 7.0948, 1,
  ],
  near: 0.1,
  far: 1000,
};

const MyParticleCanvas: React.FC = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={cameraConfig}>
        <ParticleField {...particleConfig} />
      </Canvas>
    </div>
  );
};

export default MyParticleCanvas;
```

### compatability

This package is compatible with React 16.8+, @react-three/fiber 8.0+, and Three.js 0.126+.
It has been tested with:

- React 18.0.0
- @react-three/fiber 8.0.0
- Three.js 0.150.0
