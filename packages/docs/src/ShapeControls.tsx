import React, { useState } from "react";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Slider from "@mui/material/Slider";

import { HexColorPicker } from "react-colorful";

import { VisualizationState, VisualizationStateUpdater } from "shared-types";

interface ControlsProps {
  state: VisualizationState;
  updateState: VisualizationStateUpdater;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}

const ShapeControls: React.FC<ControlsProps> = ({
  state,
  updateState,
  setActiveTab,
}) => {
  const { particleConfig } = state;

  const [shapeTab, setShapeTab] = React.useState("shape");
  const [colorTab, setColorTab] = React.useState(particleConfig.colorMode);
  const [rotationTab, setRotationTab] = React.useState(
    particleConfig.rotationMode
  );
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);

  const imagePresets = [
    "drop.png",
    "feather.png",
    "mushroom.png",
    "cloud.png",
    "glow.png",
    "moon.png",
    "coin.png",
    "bobtail-squid.png",
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setCustomImageUrl(result);
          updateState("imagePath", result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {shapeTab === "shape" && (
        <>
          {!imagePresets.includes(particleConfig.imagePath) && (
            <div style={{ padding: "12px 16px 8px 16px" }}>
              <input type="file" accept="image/*" onChange={handleFileUpload} />
            </div>
          )}
          <div className="tile-control">
            {imagePresets.map((image) => (
              <IconButton
                sx={{ padding: 0 }}
                key={image}
                onClick={() => {
                  updateState("imagePath", image);
                }}
              >
                <img
                  src={image}
                  className={`tile ${
                    image === particleConfig.imagePath ? "active" : ""
                  }`}
                />
              </IconButton>
            ))}
            <IconButton
              sx={{ padding: 0, fontSize: "1.2rem", lineHeight: "1.6rem" }}
              onClick={() => {
                updateState("imagePath", customImageUrl || "");
              }}
              className={`tile ${
                !imagePresets.includes(particleConfig.imagePath) ? "active" : ""
              }`}
            >
              {customImageUrl ? (
                <img
                  src={customImageUrl}
                  alt="Custom"
                  className="preview-image"
                />
              ) : (
                <>
                  upload
                  <br />
                  image
                </>
              )}
            </IconButton>
          </div>
        </>
      )}

      {shapeTab === "rotation" && (
        <>
          <div className="slider-control" style={{ background: "#363636" }}>
            <Slider
              value={
                rotationTab === "constant"
                  ? particleConfig.rotationRange[0]
                  : particleConfig.rotationRange
              }
              valueLabelDisplay="auto"
              min={0}
              step={0.01}
              max={4 * Math.PI}
              valueLabelFormat={(value) =>
                `${((value * 180) / Math.PI).toFixed(0)}°`
              }
              onChange={(_event, newValue) => {
                if (rotationTab === "constant")
                  updateState("rotationRange", [
                    newValue as number,
                    particleConfig.rotationRange[1],
                  ]);
                else updateState("rotationRange", newValue as [number, number]);
              }}
            />
          </div>
          <div className="tabs">
            <Tabs
              value={rotationTab}
              onChange={(_event, newValue) => {
                updateState(
                  "rotationMode",
                  newValue as VisualizationState["particleConfig"]["rotationMode"]
                );
                setRotationTab(newValue);
              }}
              variant="scrollable"
              sx={{ bgcolor: "#363636" }}
            >
              <Tab label="Constant" value="constant" />
              <Tab label="Field Linear" value="fieldLinear" />
              <Tab label="Field Radial" value="fieldRadial" />
              <Tab label="Z Position" value="zPosition" />
            </Tabs>
          </div>
        </>
      )}

      {shapeTab === "colors" && (
        <>
          {colorTab === "solid" && (
            <div
              className="double-color-control"
              style={{ background: "#363636" }}
            >
              <HexColorPicker
                color={particleConfig.color1}
                onChange={(newColor) => {
                  updateState("color1", newColor);
                }}
              />
            </div>
          )}

          {colorTab !== "solid" && (
            <div
              className="double-color-control"
              style={{ background: "#363636" }}
            >
              <HexColorPicker
                color={particleConfig.color1}
                onChange={(newColor) => {
                  updateState("color1", newColor);
                }}
              />
              <HexColorPicker
                color={particleConfig.color2}
                onChange={(newColor) => {
                  updateState("color2", newColor);
                }}
              />
            </div>
          )}

          <div className="tabs">
            <Tabs
              value={colorTab}
              onChange={(_event, newValue) => {
                setColorTab(newValue);
                updateState("colorMode", newValue);
              }}
              variant="scrollable"
              sx={{ bgcolor: "#363636" }}
            >
              <Tab label="Solid" value="solid" />
              <Tab label="Two-color" value="gradient" />
              <Tab label="Gradient" value="fieldLinear" />
              <Tab label="Radial Gradient" value="fieldRadial" />
              <Tab label="Z Position" value="zPosition" />
            </Tabs>
          </div>
        </>
      )}

      {shapeTab === "size" && (
        <div className="slider-control">
          <Slider
            value={particleConfig.particleSize}
            valueLabelDisplay="auto"
            min={0}
            max={60}
            onChange={(_event, newValue) => {
              updateState("particleSize", newValue as number);
            }}
          />
        </div>
      )}

      <div className="tabs">
        <Tabs
          value={shapeTab}
          onChange={(_event, newValue) => {
            setShapeTab(newValue);
          }}
          variant="scrollable"
        >
          <Tab label="Shape" value="shape" />
          <Tab label="Colors" value="colors" />
          <Tab label="Rotation" value="rotation" />
          <Tab label="Size" value="size" />
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

export default ShapeControls;
