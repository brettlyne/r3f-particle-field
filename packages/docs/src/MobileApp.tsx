import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ArcballControls, Stats } from "@react-three/drei";
import * as THREE from "three";
import queryString from "query-string";

import { getCssFromBgState } from "./utils/backgroundHelper";
import { ParticleField } from "r3f-particle-field";
import MobileControls from "./MobileControls";
import "./mobile.css";
import {
  VisualizationState,
  updateVisualizationState,
  unflattenState,
  preset1,
} from "./utils/visualizationState";

const CameraController = ({
  fov,
  cameraMatrix,
}: {
  fov: number;
  cameraMatrix: number[];
}) => {
  const { camera } = useThree();

  useFrame(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov;
      camera.matrix.fromArray(cameraMatrix);
      camera.matrix.decompose(camera.position, camera.quaternion, camera.scale);
      camera.updateProjectionMatrix();
    }
  });

  return null;
};

const App: React.FC = () => {
  const [vState, setVState] = useState<VisualizationState>(preset1);
  const controlsRef = useRef<ArcballControls>(null);
  const [bgCSS, setBgCSS] = useState("#f0f0f0");
  const { particleConfig, editorConfig } = vState;

  const updateVState = (key: string, value) => {
    setVState(updateVisualizationState(vState, key, value));
  };

  // load state from url on load
  useEffect(() => {
    const parsed = queryString.parse(location.search, { parseBooleans: true });
    if (Object.keys(parsed).length > 0) {
      const newState = unflattenState(parsed);
      setVState(newState);
    }
  }, []);

  // if i press the p key, log vState to console
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "p") {
        console.log(vState);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [vState]);

  const handleControlsChange = () => {
    if (controlsRef.current && controlsRef.current.camera) {
      const newMatrix = controlsRef.current.camera.matrix.toArray();
      updateVState("cameraMatrix", newMatrix);
    }
  };

  // update background on state change
  useEffect(() => {
    setBgCSS(getCssFromBgState(editorConfig));
  }, [
    editorConfig,
    editorConfig.bgType,
    editorConfig.bgColors,
    editorConfig.bgColor,
    editorConfig.bgValue,
  ]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        minHeight: "90vh",
      }}
    >
      <div
        className="container"
        style={{
          background: bgCSS,
          overflow: "hidden",
          position: "relative",
          width: editorConfig.dimensions[0],
          height: editorConfig.dimensions[1],
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "140%",
            height: "140%",
            left: "-20%",
            top: "-20%",
            transformOrigin: "center center",
          }}
        >
          <Canvas
            camera={{
              fov: editorConfig.fov,
              near: 0.1,
              far: 1000,
            }}
          >
            <CameraController
              fov={editorConfig.fov}
              cameraMatrix={editorConfig.cameraMatrix}
            />
            <ParticleField {...particleConfig} />
            {editorConfig.interactiveCamera && (
              <ArcballControls
                ref={controlsRef}
                onChange={handleControlsChange}
              />
            )}
            {editorConfig.statsOn && <Stats />}
          </Canvas>
        </div>
      </div>
      <MobileControls
        state={vState}
        updateState={updateVState}
        setVState={setVState}
      />
    </div>
  );
};

export default App;
