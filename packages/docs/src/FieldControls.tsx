import React from "react";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Slider from "@mui/material/Slider";

import { VisualizationState, VisualizationStateUpdater } from "shared-types";

interface ControlsProps {
  state: VisualizationState;
  updateState: VisualizationStateUpdater;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}

const FieldControls: React.FC<ControlsProps> = ({
  state,
  updateState,
  setActiveTab,
}) => {
  const [fieldTab, setFieldTab] = React.useState("arrangement");
  const [scalingTab, setScalingTab] = React.useState("innerScaling");

  const { particleConfig } = state;

  const arrangements = [
    "grid",
    "staggeredGrid",
    "circular",
    "spiral",
    "hexagon",
    "random",
  ];

  const zAxisArrangements = [
    "flat",
    "dome",
    "wavy",
    "valley",
    "cone",
    "random",
  ];

  const scalingInputs = {
    innerScaling: {
      label: "Inner Scaling",
      min: 0,
      max: 10,
      step: 0.1,
      getState: () => particleConfig.innerScaling,
      updateState: (newValue: number) => {
        updateState("innerScaling", newValue);
      },
    },
    outerScaling: {
      label: "Outer Scaling",
      min: 0,
      max: 10,
      step: 0.1,
      getState: () => particleConfig.outerScaling,
      updateState: (newValue: number) => {
        updateState("outerScaling", newValue);
      },
    },
    innerRadius: {
      label: "Inner Radius",
      min: 0,
      max: 10,
      step: 0.1,
      getState: () => particleConfig.innerRadius,
      updateState: (newValue: number) => {
        updateState("innerRadius", newValue);
      },
    },
    outerRadius: {
      label: "Outer Radius",
      min: 0,
      max: 10,
      step: 0.1,
      getState: () => particleConfig.outerRadius,
      updateState: (newValue: number) => {
        updateState("outerRadius", newValue);
      },
    },
    centerX: {
      label: "Center X",
      min: -20,
      max: 20,
      step: 0.1,
      getState: () => particleConfig.center[0],
      updateState: (newValue: number) => {
        updateState("center", [
          newValue,
          particleConfig.center[1],
          particleConfig.center[2],
        ]);
      },
    },
    centerY: {
      label: "Center Y",
      min: -20,
      max: 20,
      step: 0.1,
      getState: () => particleConfig.center[1],
      updateState: (newValue: number) => {
        updateState("center", [
          particleConfig.center[0],
          newValue,
          particleConfig.center[2],
        ]);
      },
    },
  };

  return (
    <>
      {fieldTab === "arrangement" && (
        <div className="tile-control">
          {arrangements.map((arrangement) => (
            <IconButton
              className={`text-tile ${
                particleConfig.arrangement === arrangement ? "active" : ""
              }`}
              sx={{ padding: 0 }}
              key={arrangement}
              onClick={() => {
                updateState(
                  "arrangement",
                  arrangement as VisualizationState["particleConfig"]["arrangement"]
                );
              }}
            >
              {arrangement}
            </IconButton>
          ))}
        </div>
      )}

      {fieldTab === "zAxisArrangement" && (
        <div className="tile-control">
          {zAxisArrangements.map((zAxisArrangement) => (
            <IconButton
              className={`text-tile ${
                particleConfig.zAxisArrangement === zAxisArrangement
                  ? "active"
                  : ""
              }`}
              sx={{ padding: 0 }}
              key={zAxisArrangement}
              onClick={() => {
                updateState(
                  "zAxisArrangement",
                  zAxisArrangement as VisualizationState["particleConfig"]["zAxisArrangement"]
                );
              }}
            >
              {zAxisArrangement}
            </IconButton>
          ))}
        </div>
      )}

      {fieldTab === "density" && (
        <div className="slider-control">
          <Slider
            value={particleConfig.density}
            valueLabelDisplay="auto"
            min={1}
            max={10}
            step={0.1}
            onChange={(_event, newValue) => {
              updateState("density", newValue as number);
            }}
          />
        </div>
      )}

      {fieldTab === "radialScaling" && (
        <>
          <div className="slider-control" style={{ background: "#363636" }}>
            <Slider
              key={scalingTab}
              value={scalingInputs[scalingTab].getState()}
              valueLabelDisplay="auto"
              min={scalingInputs[scalingTab].min}
              max={scalingInputs[scalingTab].max}
              step={scalingInputs[scalingTab].step}
              onChange={(_event, newValue) => {
                scalingInputs[scalingTab].updateState(newValue as number);
              }}
            />
          </div>

          <div className="tabs">
            <Tabs
              value={scalingTab}
              onChange={(_event, newValue) => {
                setScalingTab(newValue);
              }}
              variant="scrollable"
              sx={{ bgcolor: "#363636" }}
            >
              <Tab label="Inner" value="innerScaling" />
              <Tab label="Outer" value="outerScaling" />
              <Tab label="Inner Radius" value="innerRadius" />
              <Tab label="Outer Radius" value="outerRadius" />
              <Tab label="Center X" value="centerX" />
              <Tab label="Center Y" value="centerY" />
            </Tabs>
          </div>
        </>
      )}

      <div className="tabs">
        <Tabs
          value={fieldTab}
          onChange={(_event, newValue) => {
            setFieldTab(newValue);
          }}
          variant="scrollable"
        >
          <Tab label="Arrangement" value="arrangement" />
          <Tab label="Z-Axis Arrangement" value="zAxisArrangement" />
          <Tab label="Density" value="density" />
          <Tab label="Radial Scaling" value="radialScaling" />
        </Tabs>
      </div>
      <div className="solo-button">
        <Button
          variant="outlined"
          onClick={() => {
            setActiveTab(-1);
          }}
        >
          Done
        </Button>
      </div>
    </>
  );
};

export default FieldControls;
