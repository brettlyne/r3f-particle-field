import { VisualizationState } from "./visualizationState";
import chroma from "chroma-js";

export const bgPresets = [
  "radial-gradient(circle at 50% 110%, #f7ff0a, #ff9132, #e32968, #77107b)",
  "linear-gradient(75deg, #ffe799, #ffa172, #ff61b5)",
  "linear-gradient(225deg, #ffe5ce, #ffb4b1, #e589ca, #9c71f2)",
  "radial-gradient(120% 150% at 100% 0%, #FFEDED 0%, #FFF1E4 25%, #E1F1E4 50%, #EADEF7 75%, #EFDBF2 100%)",
  "linear-gradient(225deg, #f1ff56, #66d788, #009e96, #0a607b)",
  "linear-gradient(195deg, #8b2482, #55246d, #271c4e, #050b2b)",
  "linear-gradient(150deg, #9da6be, #707a94, #44516e, #142b4e)",
  "radial-gradient(90% 100% at 50% 100%, #737373 0%, #A8ACBC 100%)",
  "conic-gradient(from 180deg at 50% 120%, #e85907, #ec553f, #fd41ba, #65a6ff, #00dda7, #5cde53, #6ede42)",
  "conic-gradient(from 45deg at 70% -10%, #fff700, #c4f74d, #158be2, #670825, #590000)",
];

export const getCssFromBgState = (
  editorConfig: VisualizationState["editorConfig"]
) => {
  const { bgType, bgColors, bgColor, bgValue } = editorConfig;
  let steps;
  switch (bgType) {
    case "solid":
      return bgColor || "#f0f0f0";
    case "gradient":
      if (!bgColors) throw new Error("bgColors is undefined for gradient");
      steps = chroma.scale([bgColors[0], bgColors[1]]).mode("hsl").colors(4);
      return `linear-gradient(0deg, ${steps.join(", ")})`;
    case "preset":
    case "custom":
      return bgValue || "#f0f0f0";
    default:
      return "#f0f0f0";
  }
};
