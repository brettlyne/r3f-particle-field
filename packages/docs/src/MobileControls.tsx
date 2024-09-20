import React from "react";

import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

import VideocamIcon from "@mui/icons-material/Videocam";
import AppsIcon from "@mui/icons-material/Apps";
import HexagonIcon from "@mui/icons-material/Hexagon";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import IosShareIcon from "@mui/icons-material/IosShare";

import { motion, AnimatePresence } from "framer-motion";

import SceneControls from "./SceneControls";
import FieldControls from "./FieldControls";
import ShapeControls from "./ShapeControls";
import AnimationControls from "./AnimationControls";
import ShareControls from "./ShareControls";
import { VisualizationState, VisualizationStateUpdater } from "shared-types";

interface ControlsProps {
  state: VisualizationState;
  updateState: VisualizationStateUpdater;
  setVState: React.Dispatch<React.SetStateAction<VisualizationState>>;
}

const Controls: React.FC<ControlsProps> = ({
  state,
  updateState,
  setVState,
}) => {
  const [activeTab, setActiveTab] = React.useState(-1);

  return (
    <div className="mobile-controls">
      <AnimatePresence>
        {activeTab === -1 && (
          <motion.div
            className="bottom-nav"
            key="bottom-nav"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <BottomNavigation
              showLabels
              value={activeTab}
              onChange={(_event, newValue) => {
                setActiveTab(newValue);
              }}
            >
              <BottomNavigationAction label="Scene" icon={<VideocamIcon />} />
              <BottomNavigationAction label="Field" icon={<AppsIcon />} />
              <BottomNavigationAction label="Shape" icon={<HexagonIcon />} />
              <BottomNavigationAction
                label="Animation"
                icon={<AutoAwesomeIcon />}
              />
              <BottomNavigationAction label="Share" icon={<IosShareIcon />} />
            </BottomNavigation>
          </motion.div>
        )}

        {activeTab === 0 && (
          <motion.div
            className="scene-controls"
            key="scene"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <SceneControls
              state={state}
              updateState={updateState}
              setActiveTab={setActiveTab}
              setVState={setVState}
            />
          </motion.div>
        )}

        {activeTab === 1 && (
          <div className="scene-controls">
            <motion.div
              className="scene-controls"
              key="field"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <FieldControls
                state={state}
                updateState={updateState}
                setActiveTab={setActiveTab}
              />
            </motion.div>
          </div>
        )}

        {activeTab === 2 && (
          <motion.div
            className="scene-controls"
            key="shape"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <ShapeControls
              state={state}
              updateState={updateState}
              setActiveTab={setActiveTab}
            />
          </motion.div>
        )}

        {activeTab === 3 && (
          <motion.div
            className="scene-controls"
            key="animation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <AnimationControls
              state={state}
              updateState={updateState}
              setActiveTab={setActiveTab}
            />
          </motion.div>
        )}

        {activeTab === 4 && (
          <motion.div
            className="scene-controls"
            key="share"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <ShareControls
              state={state}
              updateState={updateState}
              setActiveTab={setActiveTab}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Controls;
