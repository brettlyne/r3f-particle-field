export type AnimationMode =
  | "ripples"
  | "waves"
  | "jello"
  | "banner"
  | "orbits"
  | "snake";

export interface ParticleConfig {
  density: number;
  arrangement:
    | "grid"
    | "staggeredGrid"
    | "circular"
    | "spiral"
    | "random"
    | "hexagon";
  zAxisArrangement: "flat" | "dome" | "wavy" | "valley" | "cone" | "random";
  imagePath: string;
  animationMode: AnimationMode;
  particleSize: number;
  center: [number, number, number];
  rippleCenter: [number, number, number];
  animationMagnitude: number;
  rotationMode: "constant" | "fieldLinear" | "fieldRadial" | "zPosition";
  rotationRange: [number, number];
  colorMode: "solid" | "gradient" | "fieldLinear" | "fieldRadial" | "zPosition";
  color1: string;
  color2: string;
  animationSpeed: number;
  xMagnitude: number;
  yMagnitude: number;
  orbitInnerRadius: number;
  orbitScale: number;
  innerRadius: number;
  innerScaling: number;
  outerRadius: number;
  outerScaling: number;
  depthTestOn: boolean;
}

export interface EditorConfig {
  dimensions: [string, string];
  bgType: "solid" | "gradient" | "preset" | "custom";
  bgValue?: string;
  bgColors?: [string, string];
  bgColor?: string;
  statsOn: boolean;
  interactiveCamera: boolean;
  fov: number;
  cameraMatrix: number[];
}

export interface VisualizationState {
  particleConfig: ParticleConfig;
  editorConfig: EditorConfig;
}

export type VisualizationStateUpdater = <
  K extends keyof ParticleConfig | keyof EditorConfig
>(
  key: K,
  value: K extends keyof ParticleConfig
    ? ParticleConfig[K]
    : K extends keyof EditorConfig
    ? EditorConfig[K]
    : never
) => void;
