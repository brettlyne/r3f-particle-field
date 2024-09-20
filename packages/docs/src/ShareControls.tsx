import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import queryString from "query-string";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import Button from "@mui/material/Button";
import LinkIcon from "@mui/icons-material/Link";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import getCodeString from "./utils/getCodeString";
import { VisualizationState, VisualizationStateUpdater } from "shared-types";

interface ControlsProps {
  state: VisualizationState;
  updateState: VisualizationStateUpdater;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}

oneDark.comment.color = "hsl(220, 10%, 60%)"; // improve contrast for comments

const AnimationControls: React.FC<ControlsProps> = ({
  state,
  // updateState,
  setActiveTab,
}) => {
  const [tab, setTab] = useState("share");
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(
    "Link copied to clipboard."
  );
  const [showImagePathMessage, setShowImagePathMessage] = useState(false);
  const { particleConfig, editorConfig } = state;
  const timeoutRef = useRef<typeof globalThis.Timeout | null>(null);

  const handleShare = async () => {
    const qString = queryString.stringify({
      ...particleConfig,
      ...editorConfig,
      imagePath:
        particleConfig.imagePath.length > 14000
          ? "drop.png"
          : particleConfig.imagePath,
    });
    if (particleConfig.imagePath.length > 14000) {
      setShowImagePathMessage(true);
      setCopiedMessage(
        "⚠️ Copied with default image. Image too large to embed in URL. Limit is ~10kb."
      );
    }
    const url = new URL(window.location.href);
    url.search = qString;

    try {
      await navigator.clipboard.writeText(url.href);
      window.history.replaceState(null, "", url.href);
      setShowCopiedMessage(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setShowCopiedMessage(false);
        setCopiedMessage("Link copied to clipboard.");
        timeoutRef.current = null;
      }, 3000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <>
      {tab === "share" && (
        <>
          <AnimatePresence>
            {showImagePathMessage && (
              <motion.div
                className="info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p style={{ maxWidth: "42em" }}>
                  You can replace the imagePath in the share URL with your own
                  image URL.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className="tile-control"
            style={{ alignItems: "center", minHeight: "4em" }}
          >
            <Button
              variant="outlined"
              onClick={handleShare}
              startIcon={<LinkIcon />}
            >
              Share
            </Button>
            <AnimatePresence>
              {showCopiedMessage && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  style={{ lineHeight: "1.4em" }}
                >
                  {copiedMessage}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      {tab === "export" && (
        <SyntaxHighlighter
          language="tsx"
          style={oneDark}
          customStyle={{
            fontWeight: "500",
            overflow: "scroll",
            maxHeight: "80vh",
          }}
          className="info"
        >
          {getCodeString(state)}
        </SyntaxHighlighter>
      )}

      <div className="tabs">
        <Tabs
          value={tab}
          onChange={(_event, newValue) => {
            setTab(newValue);
          }}
          variant="scrollable"
        >
          <Tab label="Share" value="share" />
          <Tab label="Code Export" value="export" />
          <Tab label="About" value="about" />
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

export default AnimationControls;
