import { VisualizationState } from "./visualizationState";

const FIELD_SIZE = 8; // centered on the origin

const getLogScaledCount = (density: number) => {
  // apply density input (1-10) on log scale to range 9-10000
  const minCount = Math.log(9);
  const maxCount = Math.log(10000);
  const normalizedDensity = (density - 1) / 9;
  return Math.floor(
    Math.exp(minCount + (maxCount - minCount) * normalizedDensity)
  );
};

const getGrid = (density: number, staggered: boolean) => {
  const rawCount = getLogScaledCount(density);
  const cols = Math.ceil(Math.sqrt(rawCount));
  const count = cols * cols;
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const colWidth = FIELD_SIZE / (cols - 1);
  const start = -FIELD_SIZE / 2;

  for (let i = 0; i < count; i++) {
    let x = start + (i % cols) * colWidth;
    const y = start + Math.floor(i / cols) * colWidth;
    if (staggered) {
      const evenRow = Math.floor(i / cols) % 2 === 0;
      x += ((evenRow ? 1 : -1) * colWidth) / 4;
    }
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = 0; // z
    scales[i] = 1;
  }

  return { positions, scales, count };
};

const applyZAxisArrangement = (
  positions: Float32Array,
  zAxisArrangement: VisualizationState["particleConfig"]["zAxisArrangement"],
  maxHeight: number = 2
) => {
  const count = positions.length / 3;
  for (let i = 0; i < count; i++) {
    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    let z = 0;
    let distFromCenter;

    switch (zAxisArrangement) {
      case "dome":
        distFromCenter = Math.sqrt(x * x + y * y);
        z =
          Math.sqrt(
            Math.max(0, 1 - (distFromCenter / (FIELD_SIZE / 1.3)) ** 2)
          ) *
            maxHeight -
          maxHeight / 2;
        break;
      case "wavy":
        z =
          (Math.sin((0.6 * x * Math.PI) / 2) *
            -Math.cos((0.2 * y * Math.PI) / 2) *
            maxHeight) /
          2;
        break;
      case "valley":
        z = ((Math.abs(x) + 0.75 * Math.abs(y)) * maxHeight) / FIELD_SIZE - 1;
        break;
      case "cone":
        distFromCenter = Math.sqrt(x * x + y * y);
        z = (1 - distFromCenter / (FIELD_SIZE / 2)) * maxHeight - maxHeight / 2;
        break;
      case "random":
        z = Math.random() * maxHeight - maxHeight / 2;
        break;
      // 'flat' is default, z remains 0
    }

    positions[i * 3 + 2] = z;
  }
};

// Sort particles by Y, then X
const sortParticles = (positions: Float32Array) => {
  const count = positions.length / 3;
  const indices = new Array(count).fill(0).map((_, i) => i);

  indices.sort((a, b) => {
    const yA = positions[a * 3 + 1];
    const yB = positions[b * 3 + 1];
    if (yA !== yB) {
      return yA - yB; // Sort by Y first
    }
    const xA = positions[a * 3];
    const xB = positions[b * 3];
    return xA - xB; // If Y is the same, sort by X
  });

  const sortedPositions = new Float32Array(positions.length);
  for (let i = 0; i < count; i++) {
    const oldIndex = indices[i];
    sortedPositions[i * 3] = positions[oldIndex * 3];
    sortedPositions[i * 3 + 1] = positions[oldIndex * 3 + 1];
    sortedPositions[i * 3 + 2] = positions[oldIndex * 3 + 2];
  }

  return sortedPositions;
};

export const getGridParticleData = (
  density: number,
  zAxisArrangement: VisualizationState["particleConfig"]["zAxisArrangement"]
) => {
  const { positions, scales, count } = getGrid(density, false);
  applyZAxisArrangement(positions, zAxisArrangement);
  positions.set(sortParticles(positions));
  return { positions, scales, count };
};

export const getStaggeredGridParticleData = (
  density: number,
  zAxisArrangement: VisualizationState["particleConfig"]["zAxisArrangement"]
) => {
  const { positions, scales, count } = getGrid(density, true);
  applyZAxisArrangement(positions, zAxisArrangement);
  positions.set(sortParticles(positions));
  return { positions, scales, count };
};

export const getHexParticleData = (
  density: number,
  zAxisArrangement: VisualizationState["particleConfig"]["zAxisArrangement"]
) => {
  const rawCount = getLogScaledCount(density);
  const pointsPerSide = Math.ceil(Math.sqrt(rawCount / 3));
  const hexRadius = FIELD_SIZE / (pointsPerSide * Math.sqrt(2));

  const directions = [
    [1, 0],
    [0.5, Math.sqrt(3) / 2],
    [-0.5, Math.sqrt(3) / 2],
    [-1, 0],
    [-0.5, -Math.sqrt(3) / 2],
    [0.5, -Math.sqrt(3) / 2],
  ];

  let ring = 0;
  let count = 0;
  const positionsArr: [number, number][] = [];

  while (count < rawCount) {
    if (ring === 0) {
      positionsArr.push([0, 0]);
      count++;
    } else {
      const ringCount = ring * 6;
      for (let side = 0; side < 6; side++) {
        for (let i = 0; i < ring; i++) {
          const x =
            (directions[side][0] * ring + directions[(side + 2) % 6][0] * i) *
            hexRadius;
          const y =
            (directions[side][1] * ring + directions[(side + 2) % 6][1] * i) *
            hexRadius;
          positionsArr.push([x, y]);
        }
      }
      count += ringCount;
    }
    ring++;
  }

  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = positionsArr[i][0]; // x
    positions[i * 3 + 1] = positionsArr[i][1]; // y
    positions[i * 3 + 2] = 0; // z
    scales[i] = 1;
  }

  applyZAxisArrangement(positions, zAxisArrangement);
  positions.set(sortParticles(positions));
  return { positions, scales, count };
};

export const getCircularParticleData = (
  density: number,
  zAxisArrangement: VisualizationState["particleConfig"]["zAxisArrangement"]
) => {
  const count = getLogScaledCount(density);
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const radius = FIELD_SIZE / 1.6;

  const rings = Math.ceil(Math.sqrt(count / Math.PI));
  const totalArea = Math.PI * radius * radius;

  const positionsArr: [number, number][] = [];

  let remainingPoints = count;
  for (let r = 0; r < rings && remainingPoints > 0; r++) {
    const outerRadiusRing = (radius * (r + 1)) / rings;
    const innerRadiusRing = (radius * r) / rings;
    const ringArea =
      Math.PI *
      (outerRadiusRing * outerRadiusRing - innerRadiusRing * innerRadiusRing);

    let pointsInRing = Math.round((ringArea / totalArea) * count);
    pointsInRing = Math.min(pointsInRing, remainingPoints);

    const ringRadius = (outerRadiusRing + innerRadiusRing) / 2;

    for (let i = 0; i < pointsInRing; i++) {
      const angle = (i / pointsInRing) * Math.PI * 2;
      const x = ringRadius * Math.cos(angle);
      const y = ringRadius * Math.sin(angle);
      positionsArr.push([x, y]);
    }

    remainingPoints -= pointsInRing;
  }

  if (remainingPoints > 0) {
    const angle = (2 * Math.PI) / remainingPoints;
    for (let i = 0; i < remainingPoints; i++) {
      const x = radius * Math.cos(i * angle);
      const y = radius * Math.sin(i * angle);
      positionsArr.push([x, y]);
    }
  }

  for (let i = 0; i < count; i++) {
    positions[i * 3] = positionsArr[i][0]; // x
    positions[i * 3 + 1] = positionsArr[i][1]; // y
    positions[i * 3 + 2] = 0; // z
    scales[i] = 1;
  }

  applyZAxisArrangement(positions, zAxisArrangement);
  positions.set(sortParticles(positions));
  return { positions, scales, count };
};

export const getSpiralParticleData = (
  density: number,
  zAxisArrangement: VisualizationState["particleConfig"]["zAxisArrangement"]
) => {
  const count = getLogScaledCount(density);
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const radius = FIELD_SIZE / 1.6;
  const turns = Math.ceil(Math.sqrt(count) / 2);

  for (let i = 0; i < count; i++) {
    const t = Math.sqrt(i / count) * turns * 2 * Math.PI;
    const r = radius * Math.sqrt(i / count);

    positions[i * 3] = r * Math.cos(t); // x
    positions[i * 3 + 1] = r * Math.sin(t); // y
    positions[i * 3 + 2] = 0; // z
    scales[i] = 1;
  }

  applyZAxisArrangement(positions, zAxisArrangement);
  positions.set(sortParticles(positions));
  return { positions, scales, count };
};

export const getRandomParticleData = (
  density: number,
  zAxisArrangement: VisualizationState["particleConfig"]["zAxisArrangement"]
) => {
  const count = getLogScaledCount(density);
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * FIELD_SIZE;
    positions[i * 3 + 1] = (Math.random() - 0.5) * FIELD_SIZE;
    positions[i * 3 + 2] = ((Math.random() - 0.5) * FIELD_SIZE) / 4;
    scales[i] = 1;
  }

  applyZAxisArrangement(positions, zAxisArrangement);
  positions.set(sortParticles(positions));
  return { positions, scales, count };
};
