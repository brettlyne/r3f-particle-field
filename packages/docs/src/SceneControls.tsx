import React from "react";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Slider from "@mui/material/Slider";
import { HexColorPicker } from "react-colorful";

import chroma from "chroma-js";

import OnOffToggle from "./components/OnOffToggle";

import { bgPresets, getCssFromBgState } from "./utils/backgroundHelper";

const presetImages = [
  "/presets/preset-1.png",
  "/presets/preset-2.png",
  "/presets/preset-3.png",
  "/presets/preset-4.png",
  "/presets/preset-5.png",
  "/presets/preset-6.png",
  "/presets/preset-7.png",
  "/presets/preset-8.png",
  "/presets/preset-9.png",
  "/presets/preset-10.png",
];

const dimensionPresets: { label: string; value: [string, string] }[] = [
  { label: "100vw × 100vh (fullscreen)", value: ["100vw", "100vh"] },
  { label: "800px × 450px", value: ["800px", "450px"] },
  { label: "600px × 600px", value: ["600px", "600px"] },
  { label: "100% × 20rem", value: ["100%", "20rem"] },
];

import { VisualizationState, VisualizationStateUpdater } from "shared-types";
import { presets } from "./utils/visualizationState";

interface ControlsProps {
  state: VisualizationState;
  updateState: VisualizationStateUpdater;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  setVState: React.Dispatch<React.SetStateAction<VisualizationState>>;
}

const SceneControls: React.FC<ControlsProps> = ({
  state,
  updateState,
  setActiveTab,
  setVState,
}) => {
  const { particleConfig, editorConfig } = state;
  const [sceneTab, setSceneTab] = React.useState("presets");
  const [backgroundTab, setBackgroundTab] = React.useState(editorConfig.bgType);

  const initialEditorState = React.useRef(editorConfig); // for reset

  const updateBgState = (
    type: "solid" | "gradient" | "preset" | "custom",
    key: string,
    value: string | string[]
  ) => {
    setVState((prev) => {
      return {
        ...prev,
        editorConfig: {
          ...prev.editorConfig,
          bgType: type,
          [key]: value,
        },
      };
    });
  };

  const changeBackgroundMode = (
    mode: "solid" | "gradient" | "preset" | "custom"
  ) => {
    if (mode === "custom") {
      const css = getCssFromBgState(editorConfig);
      updateBgState(mode, "bgValue", css);
      return;
    }

    if (mode === initialEditorState.current.bgType) {
      switch (mode) {
        case "solid":
          updateBgState(
            mode,
            "bgColor",
            initialEditorState.current.bgColor || "#333f69"
          );
          return;
        case "gradient":
          updateBgState(
            mode,
            "bgColors",
            initialEditorState.current.bgColors || ["#333f69", "#615438"]
          );
          return;
        default:
          updateBgState(
            mode,
            "bgValue",
            initialEditorState.current.bgValue || "#333f69"
          );
          return;
      }
    }

    if (mode === "solid") {
      updateBgState(
        mode,
        "bgColor",
        editorConfig.bgColor || initialEditorState.current.bgColor || "#333f69"
      );
    }

    if (mode === "preset") {
      updateBgState(mode, "bgValue", bgPresets[0]);
    }

    if (mode === "gradient") {
      let gradientStart, gradientEnd;
      if (Array.isArray(editorConfig.bgColors)) {
        gradientStart = editorConfig.bgColors[0];
        gradientEnd = editorConfig.bgColors[1];
      } else {
        gradientStart =
          editorConfig.bgColor ||
          initialEditorState.current.bgColor ||
          "#615438";
        gradientEnd =
          chroma(gradientStart).luminance() > 0.8
            ? chroma(gradientStart).darken(2).hex()
            : chroma(gradientStart).brighten(2).hex();
      }

      updateBgState(mode, "bgColors", [gradientStart, gradientEnd]);
    }
  };

  return (
    <>
      {sceneTab === "presets" && (
        <div className="tile-control">
          {presets.map((preset, i) => (
            <IconButton
              sx={{ padding: 0 }}
              onClick={() => {
                initialEditorState.current = preset.editorConfig;
                setVState({
                  ...preset,
                  editorConfig: {
                    ...preset.editorConfig,
                    statsOn: editorConfig.statsOn,
                  },
                });
                setBackgroundTab(preset.editorConfig.bgType);
              }}
              key={i}
            >
              <img src={presetImages[i]} className="tile" />
            </IconButton>
          ))}
        </div>
      )}

      {sceneTab === "dimensions" && (
        <>
          <div className="info">
            <p style={{ maxWidth: "42em" }}>
              Use CSS values for width and height. Here are a few presets:
            </p>
            <div style={{ display: "flex", gap: "10px", padding: "10px 0" }}>
              {dimensionPresets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outlined"
                  sx={{ textTransform: "none" }}
                  onClick={() => {
                    updateState("dimensions", preset.value);
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
          <div
            className="double-color-control"
            style={{
              justifyContent: "flex-start",
              gap: "16px",
            }}
          >
            <TextField
              fullWidth
              label="Width"
              value={editorConfig.dimensions[0]}
              onChange={(e) => {
                updateState("dimensions", [
                  e.target.value,
                  editorConfig.dimensions[1],
                ]);
              }}
              size="small"
            />
            <TextField
              fullWidth
              label="Height"
              value={editorConfig.dimensions[1]}
              onChange={(e) => {
                updateState("dimensions", [
                  editorConfig.dimensions[0],
                  e.target.value,
                ]);
              }}
              size="small"
            />
          </div>
        </>
      )}

      {sceneTab === "background" && (
        <>
          {backgroundTab === "solid" && (
            <div
              className="double-color-control"
              style={{ background: "#363636" }}
            >
              <HexColorPicker
                color={editorConfig.bgColor}
                onChange={(newColor) => {
                  updateState("bgColor", newColor);
                }}
              />
            </div>
          )}

          {backgroundTab === "gradient" && (
            <div
              className="double-color-control"
              style={{ background: "#363636" }}
            >
              <HexColorPicker
                color={editorConfig.bgColors?.[0] ?? ""}
                onChange={(newColor) => {
                  updateState("bgColors", [
                    newColor,
                    editorConfig.bgColors?.[1] ?? "",
                  ]);
                }}
              />
              <HexColorPicker
                color={editorConfig.bgColors?.[1] ?? ""}
                onChange={(newColor) => {
                  updateState("bgColors", [
                    editorConfig.bgColors?.[0] ?? "",
                    newColor,
                  ]);
                }}
              />
            </div>
          )}

          {backgroundTab === "preset" && (
            <div
              style={{
                background: "#363636",
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gridTemplateRows: "repeat(2, 1fr)",
                gridColumnGap: "12px",
                gridRowGap: "12px",
                padding: "12px",
              }}
            >
              {bgPresets.map((preset, i) => (
                <IconButton
                  sx={{
                    padding: 0,
                    background: preset,
                    height: 80,
                    borderRadius: 0.2,
                    outline:
                      editorConfig.bgValue === preset ? "2px solid white" : "",
                  }}
                  onClick={() => {
                    updateState("bgValue", preset);
                  }}
                  key={i}
                />
              ))}
            </div>
          )}

          {backgroundTab === "custom" && (
            <div
              className="double-color-control"
              style={{ background: "#363636" }}
            >
              <TextField
                multiline
                value={editorConfig.bgValue}
                onChange={(e) => {
                  updateState("bgValue", e.target.value);
                }}
                sx={{
                  width: "100%",
                }}
                size="small"
                inputProps={{
                  style: {
                    fontFamily: `'Roboto Mono', 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace`,
                    fontSize: ".8rem",
                    lineHeight: "1.2rem",
                  },
                }}
              />
            </div>
          )}

          <Tabs
            value={backgroundTab}
            onChange={(_event, newValue) => {
              changeBackgroundMode(newValue);
              setBackgroundTab(newValue);
            }}
            variant="scrollable"
            sx={{ bgcolor: "#363636" }}
          >
            <Tab label="Solid" value="solid" />
            <Tab label="Gradient" value="gradient" />
            <Tab label="Presets" value="preset" />
            <Tab label="Custom" value="custom" />
          </Tabs>
        </>
      )}

      {sceneTab === "fov" && (
        <div className="slider-control">
          <Slider
            value={editorConfig.fov}
            valueLabelDisplay="auto"
            min={20}
            max={160}
            onChange={(_event, newValue) => {
              updateState("fov", newValue as number);
            }}
          />
        </div>
      )}

      {sceneTab === "depthTest" && (
        <>
          <div className="info">
            <p style={{ maxWidth: "42em" }}>
              Disabling depth test can look nice with transparent shapes and
              prevents "popping" when ordering changes, but layering is
              predetermined and ignores the camera position.
            </p>
          </div>
          <div className="tile-control">
            <OnOffToggle
              value={particleConfig.depthTestOn}
              onChange={(newValue) => updateState("depthTestOn", newValue)}
            />
          </div>
        </>
      )}

      {sceneTab === "interactiveCamera" && (
        <>
          <div className="tile-control">
            <OnOffToggle
              value={editorConfig.interactiveCamera}
              onChange={(newValue) =>
                updateState("interactiveCamera", newValue)
              }
            />
          </div>
        </>
      )}

      {sceneTab === "stats" && (
        <>
          <div className="tile-control">
            <OnOffToggle
              value={editorConfig.statsOn}
              onChange={(newValue) => updateState("statsOn", newValue)}
            />
          </div>
        </>
      )}

      <div className="tabs">
        <Tabs
          value={sceneTab}
          onChange={(_event, newValue) => {
            setSceneTab(newValue);
          }}
          variant="scrollable"
        >
          <Tab label="Presets" value="presets" />
          <Tab label="Dimensions" value="dimensions" />
          <Tab label="Background" value="background" />
          <Tab label="Field of View" value="fov" />
          <Tab label="Depth Test" value="depthTest" />
          <Tab label="Interactive Camera" value="interactiveCamera" />
          <Tab label="Stats" value="stats" />
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

export default SceneControls;
