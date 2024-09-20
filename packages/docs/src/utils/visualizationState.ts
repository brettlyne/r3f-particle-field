import { AnimationMode } from "./shaderAnimations";

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

const editorConfigKeys = [
  "dimensions",
  "bgType",
  "bgValue",
  "bgColors",
  "bgColor",
  "statsOn",
  "interactiveCamera",
  "fov",
  "cameraMatrix",
];

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

// used when we load from url
export const unflattenState = (obj): VisualizationState => {
  const state: VisualizationState = preset1;
  Object.keys(obj).forEach((key) => {
    if (key in state.editorConfig) {
      state.editorConfig[key] = obj[key];
    } else {
      state.particleConfig[key] = obj[key];
    }
  });
  return state;
};

export const updateVisualizationState = (
  state: VisualizationState,
  key: string,
  value: string | string[] | number | boolean | [number, number, number]
): VisualizationState => {
  if (key in state.particleConfig) {
    return {
      ...state,
      particleConfig: { ...state.particleConfig, [key]: value },
    };
  } else if (editorConfigKeys.includes(key)) {
    return { ...state, editorConfig: { ...state.editorConfig, [key]: value } };
  } else {
    throw new Error(`Invalid key: ${key}`);
  }
};

export const preset1: VisualizationState = {
  particleConfig: {
    density: 5.1,
    arrangement: "spiral",
    zAxisArrangement: "dome",
    imagePath: "drop.png",
    animationMode: "ripples",
    particleSize: 30,
    center: [0, 0, 0],
    rippleCenter: [0, 0, 0],
    animationMagnitude: 0.9,
    rotationMode: "constant",
    rotationRange: [0, Math.PI / 2],
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
  },
  editorConfig: {
    dimensions: ["100vw", "100vh"],
    bgType: "gradient",
    bgColors: ["#e5a4eb", "#e6dfee"],
    fov: 84,
    statsOn: false,
    interactiveCamera: true,
    cameraMatrix: [
      0.9699296371008498, -0.11878182646655928, 0.21243205213591745, 0,
      -0.12069903413308679, 0.5231822557192686, 0.8436302925214556, 0,
      -0.21134862723175887, -0.8439023669843343, 0.49311312370031674, 0,
      -3.0534246560189118, -11.982744001058986, 7.094776220115797, 1,
    ],
  },
};

export const preset2: VisualizationState = {
  particleConfig: {
    density: 3.8,
    arrangement: "spiral",
    zAxisArrangement: "dome",
    imagePath: "bobtail-squid.png",
    animationMode: "snake",
    particleSize: 30,
    center: [-6.7, -2.9, 0],
    rippleCenter: [0, 0, 0],
    animationMagnitude: 0.5,
    rotationMode: "fieldRadial",
    rotationRange: [6.13, 7.83],
    colorMode: "fieldRadial",
    color1: "#1ffffa",
    color2: "#fffb99",

    animationSpeed: -1.8,
    xMagnitude: 4.6,
    yMagnitude: 3.3,
    orbitInnerRadius: 0,
    orbitScale: 1,
    innerRadius: 0.3,
    innerScaling: 4.3,
    outerRadius: 10,
    outerScaling: 0.6,
    depthTestOn: false,
  },
  editorConfig: {
    dimensions: ["600px", "600px"],
    fov: 80,
    bgType: "preset",
    bgValue: "linear-gradient(225deg, #f1ff56, #66d788, #009e96, #0a607b)",
    cameraMatrix: [
      0.5839796484236555, 0.7053629555842138, -0.40178460786406917, 0,
      0.7807451040729632, -0.6235633281737308, 0.040073160881052984, 0,
      -0.22227202409003613, -0.3370932758842909, -0.9148569673235941, 0,
      -5.310581363038798, -3.491555531101742, -6.282225477414206, 1,
    ],

    statsOn: false,
    interactiveCamera: true,
  },
};

export const preset3: VisualizationState = {
  particleConfig: {
    density: 5.9,
    arrangement: "random",
    zAxisArrangement: "dome",
    imagePath: "mushroom.png",
    animationMode: "jello",
    particleSize: 31,
    center: [0, 0, 0],
    rippleCenter: [0, 0, 0],
    animationMagnitude: 0.5,
    rotationMode: "constant",
    rotationRange: [0, Math.PI / 2],
    colorMode: "gradient",
    color1: "#f3d3a2",
    color2: "#fff7a3",
    animationSpeed: 0.3,
    xMagnitude: 1.1,
    yMagnitude: 1,
    orbitInnerRadius: 0,
    orbitScale: 1,
    innerRadius: 0,
    innerScaling: 4.7,
    outerRadius: 3.3,
    outerScaling: 0,
    depthTestOn: false,
  },
  editorConfig: {
    dimensions: ["100vw", "100vh"],
    bgType: "solid",
    bgColor: "#f4e8c9",
    fov: 75,
    cameraMatrix: [
      1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -0.0751308981393026,
      -0.07395166079615599, 15.143740007205523, 1,
    ],
    statsOn: false,
    interactiveCamera: true,
  },
};

export const preset4: VisualizationState = {
  particleConfig: {
    density: 6.5,
    arrangement: "circular",
    zAxisArrangement: "flat",
    imagePath: "feather.png",
    animationMode: "waves",
    particleSize: 13,
    center: [0, 0, 0],
    rippleCenter: [0, 0, 0],
    animationMagnitude: 0.5,
    rotationMode: "constant",
    rotationRange: [5.55, 0],
    colorMode: "gradient",
    color1: "#aef7ff",
    color2: "#8cffc1",
    animationSpeed: 0.8,
    xMagnitude: 0.3,
    yMagnitude: 1,
    orbitInnerRadius: 0,
    orbitScale: 1,
    innerRadius: 0.5,
    innerScaling: 0,
    outerRadius: 5.9,
    outerScaling: 3.5,
    depthTestOn: false,
  },
  editorConfig: {
    dimensions: ["100vw", "100vh"],
    bgType: "solid",
    bgColor: "#240e34",
    fov: 117,
    cameraMatrix: [
      0.9969121740464922, 0.007568075754644811, 0.07815907795813744, 0,
      0.06671383086721562, -0.606615801723314, -0.7921909705813368, 0,
      0.04141717046002543, 0.794959114249879, -0.6052475730328313, 0,
      0.43920447807773527, 9.186013296316714, -5.033052190348866, 1,
    ],
    statsOn: false,
    interactiveCamera: true,
  },
};

export const preset5: VisualizationState = {
  particleConfig: {
    density: 6.1,
    arrangement: "circular",
    zAxisArrangement: "dome",
    imagePath: "mushroom.png",
    animationMode: "ripples",
    particleSize: 30,
    center: [0, 0, 0],
    rippleCenter: [0, 0, 0],
    animationMagnitude: 1.3,
    rotationMode: "constant",
    rotationRange: [2.8, 0],
    colorMode: "gradient",
    color1: "#fff900",
    color2: "#ff00ff",
    animationSpeed: 0.4,
    xMagnitude: 1,
    yMagnitude: 1,
    orbitInnerRadius: 0,
    orbitScale: 1,
    innerRadius: 0.7,
    innerScaling: 6.7,
    outerRadius: 4.9,
    outerScaling: 0,
    depthTestOn: true,
  },
  editorConfig: {
    dimensions: ["100vw", "100vh"],
    bgType: "solid",
    bgColor: "#f0f0f0",
    fov: 97,
    cameraMatrix: [
      0.969367321443659, 0.12274832772864377, -0.21274361131880146, 0,
      0.1991716904418025, 0.11401284138982906, 0.9733096679499145, 0,
      0.1437276377169637, -0.9858670904528866, 0.08607233073562108, 0,
      1.0613684416767624, -7.280215789498701, 0.6356081335188752, 1,
    ],
    statsOn: false,
    interactiveCamera: true,
  },
};

export const preset6: VisualizationState = {
  particleConfig: {
    density: 7.2,
    arrangement: "random",
    zAxisArrangement: "random",
    imagePath: "coin.png",
    animationMode: "waves",
    particleSize: 30,
    center: [0, 0, 0],
    rippleCenter: [0, 0, 0],
    animationMagnitude: 0.9,
    rotationMode: "fieldRadial",
    rotationRange: [0, 1.5707963267948966],
    colorMode: "fieldLinear",
    color1: "#ffffff",
    color2: "#ffe000",

    animationSpeed: 0.5,
    xMagnitude: 0,
    yMagnitude: 9.3,
    orbitInnerRadius: 0,
    orbitScale: 1,
    innerRadius: 0,
    innerScaling: 0,
    outerRadius: 6.1,
    outerScaling: 1.8,
    depthTestOn: false,
  },
  editorConfig: {
    dimensions: ["100vw", "100vh"],
    bgType: "custom",
    bgValue:
      "linear-gradient( 16deg, hsl(223deg 68% 6%) 0%, hsl(227deg 70% 10%) 23%, hsl(232deg 72% 15%) 28%, hsl(236deg 74% 19%) 31%, hsl(240deg 76% 23%) 32%, hsl(245deg 78% 26%) 33%, hsl(249deg 80% 30%) 34%, hsl(254deg 83% 34%) 36%, hsl(258deg 85% 37%) 37%, hsl(262deg 88% 41%) 39%, hsl(267deg 90% 44%) 42%, hsl(269deg 84% 48%) 44%, hsl(269deg 76% 52%) 48%, hsl(269deg 76% 57%) 52%, hsl(269deg 75% 61%) 56%, hsl(269deg 74% 66%) 61%, hsl(270deg 72% 70%) 66%, hsl(270deg 70% 75%) 72%, hsl(270deg 67% 80%) 78%, hsl(270deg 63% 84%) 85%, hsl(270deg 53% 89%) 92%, hsl(270deg 27% 94%) 100%)",
    fov: 160,
    cameraMatrix: [
      -0.4529880870488296, 0.856986260360773, 0.24571597942483767, 0,
      -0.8648688309878438, -0.35554453740334613, -0.3543867761477142, 0,
      -0.2163416237749235, -0.3730450796827431, 0.9022381450298583, 0,
      0.23273567839592912, -0.5146926844922997, 2.4582219753133114, 1,
    ],
    statsOn: false,
    interactiveCamera: true,
  },
};

export const preset7: VisualizationState = {
  particleConfig: {
    density: 5,
    arrangement: "hexagon",
    zAxisArrangement: "wavy",
    imagePath: "mushroom.png",
    animationMode: "ripples",
    particleSize: 30,
    center: [2.2, 3.4, 0],
    rippleCenter: [3.6, 5.2, 0],
    animationMagnitude: 1.5,
    rotationMode: "constant",
    rotationRange: [0, Math.PI / 2],
    colorMode: "fieldRadial",
    color1: "#ffff00",
    color2: "#ffc8ff",
    animationSpeed: 0.6,
    xMagnitude: 1,
    yMagnitude: 1,
    orbitInnerRadius: 0,
    orbitScale: 1,
    innerRadius: 0,
    innerScaling: 8.7,
    outerRadius: 8.4,
    outerScaling: 0.5,
    depthTestOn: false,
  },
  editorConfig: {
    dimensions: ["100vw", "100vh"],
    bgType: "solid",
    bgColor: "#cacee5",
    fov: 75,
    cameraMatrix: [
      0.5428570320276913, -0.8027876848935722, -0.24665395954921207, 0,
      -0.5733487511985205, -0.5688680926296896, 0.5896272574151877, 0,
      -0.6136590684388055, -0.17866456327732516, -0.7690913609914877, 0,
      -8.459757401024083, -2.6913328139768025, -10.74807756765347, 1,
    ],
    statsOn: false,
    interactiveCamera: true,
  },
};

const preset8: VisualizationState = {
  particleConfig: {
    density: 6,
    arrangement: "staggeredGrid",
    zAxisArrangement: "valley",
    imagePath: "drop.png",
    animationMode: "snake",
    particleSize: 51,
    center: [-2.7, 2.4, 0],
    rippleCenter: [0, 0, 0],
    animationMagnitude: 0.5,
    rotationMode: "fieldLinear",
    rotationRange: [4.27, 10.04],
    colorMode: "fieldLinear",
    color1: "#ff6666",
    color2: "#ff00ff",
    animationSpeed: -3.7,
    xMagnitude: 1.4,
    yMagnitude: 1.2,
    orbitInnerRadius: 0,
    orbitScale: 1,
    innerRadius: 0,
    innerScaling: 4.1,
    outerRadius: 5.8,
    outerScaling: 0.8,
    depthTestOn: false,
  },
  editorConfig: {
    dimensions: ["min(100vw, 100vh)", "100vh"],
    bgType: "solid",
    bgColor: "#f1ffe5",
    fov: 80,
    cameraMatrix: [
      0.9965214347044477, 0.07398162990109414, 0.03836337591714531, 0,
      0.04534133074310554, -0.8675600189821328, 0.49526132212213675, 0,
      0.06992277097646406, -0.49179907675889406, -0.8678965803585559, 0,
      1.646953837251463, -5.028587674049912, -6.128943141714856, 1,
    ],
    statsOn: false,
    interactiveCamera: true,
  },
};

const preset9: VisualizationState = {
  particleConfig: {
    density: 7.3,
    arrangement: "hexagon",
    zAxisArrangement: "random",
    imagePath: "feather.png",
    animationMode: "snake",
    particleSize: 30,
    center: [-7.7, 1.6, 0],
    rippleCenter: [0, 0, 0],
    animationMagnitude: 0.5,
    rotationMode: "zPosition",
    rotationRange: [0.23, 10.1],
    colorMode: "solid",
    color1: "#000000",
    color2: "#000000",

    animationSpeed: -3.6,
    xMagnitude: 4.6,
    yMagnitude: 3.3,
    orbitInnerRadius: 0,
    orbitScale: 1,
    innerRadius: 1.4,
    innerScaling: 2.8,
    outerRadius: 10,
    outerScaling: 1,
    depthTestOn: false,
  },
  editorConfig: {
    dimensions: ["100vw", "100vh"],
    bgType: "gradient",
    bgColors: ["#000000", "#4f6178"],
    fov: 122,
    cameraMatrix: [
      0.1100246386542695, 0.7608254084310463, -0.6395617849549217, 0,
      0.9915560727870716, -0.1284557622857387, 0.0177671510005506, 0,
      -0.0686376966985623, -0.6361161961633438, -0.768534352889056, 0,
      -1.1622267780155604, -4.79632048553994, -3.5616598616195048, 1,
    ],
    statsOn: false,
    interactiveCamera: true,
  },
};

const preset10: VisualizationState = {
  particleConfig: {
    density: 6.6,
    arrangement: "spiral",
    zAxisArrangement: "dome",
    imagePath: "glow.png",
    animationMode: "orbits",
    particleSize: 31,
    center: [0, 0, 0],
    rippleCenter: [0, 0, 0],
    animationMagnitude: 1.3,
    rotationMode: "fieldRadial",
    rotationRange: [0.7, 12.566370614359172],
    colorMode: "fieldRadial",
    color1: "#fffe84",
    color2: "#ffc92b",

    animationSpeed: 0.4,
    xMagnitude: 5,
    yMagnitude: 2.7,
    orbitInnerRadius: 0,
    orbitScale: -0.6,
    innerRadius: 0.8,
    innerScaling: 5.6,
    outerRadius: 10,
    outerScaling: 0.1,
    depthTestOn: false,
  },
  editorConfig: {
    dimensions: ["100vw", "100vh"],
    bgType: "gradient",
    bgColors: ["#060111", "#430874"],
    fov: 144,
    cameraMatrix: [
      -0.9944964596057377, -0.0947111714353202, -0.04479493092986833, 0,
      0.08282014411784326, -0.9725294526531179, 0.21754835657973284, 0,
      -0.06416864935435362, 0.2126411477762281, 0.9750210903936642, 0,
      -1.9037348775290177, 4.1844003340666065, 6.276215657127127, 1,
    ],
    statsOn: false,
    interactiveCamera: true,
  },
};

export const presets = [
  preset1,
  preset2,
  preset3,
  preset4,
  preset5,
  preset6,
  preset7,
  preset8,
  preset9,
  preset10,
];
