export type AnimationMode =
  | "ripples"
  | "waves"
  | "jello"
  | "banner"
  | "orbits"
  | "snake";

export const getAnimationShaderChunk = (
  animationMode: AnimationMode,
  particleCount: number = 100
): string => {
  switch (animationMode) {
    case "ripples":
      return `
        float animateRipples(vec3 position, float time, vec3 rippleCenter, float magnitude) {
          float dist = distance(position.xy, rippleCenter.xy);
          return sin(dist * 0.5 - time * 2.0) * magnitude;
        }
      `;
    case "waves":
      return `
        vec3 animateWaves(vec3 position, float time, float xMagnitude, float yMagnitude) {
          vec3 newPos = position;
          newPos.x += 0.5 * sin(2.0 * time) * xMagnitude;
          newPos.y += yMagnitude * cos(0.5 * position.x + time);
          newPos.z += cos(1.0 * position.x + time) * xMagnitude;
          return newPos;
        }
      `;
    case "jello":
      return `
        vec3 animateJello(vec3 position, float time, float xMagnitude, float yMagnitude) {
          vec3 newPos = position;
          newPos.x *= (1.0 + 0.5 * sin(2.0 * time) * xMagnitude);
          newPos.y *= (1.0 + 0.5 * cos(2.0 * time) * yMagnitude);
          return newPos;
        }
      `;
    case "banner":
      return `
        vec3 animateBanner(vec3 position, float time, float xMagnitude, float yMagnitude) {
          vec3 newPos = position;
          newPos.x += sin(0.5 * time + 0.5 * position.x) * xMagnitude;
          newPos.y += sin(1.0 * time + 0.5 * position.x) * yMagnitude;
          return newPos;
        }
      `;
    case "orbits":
      return `
        vec3 animateOrbits(vec3 position, float time, float innerRadius, float scale, float xMagnitude, float yMagnitude) {
          float dist = length(position.xy) * scale + innerRadius;
          float angle = atan(position.y, position.x) + time * dist * 0.05;
          vec3 newPos = position;
          newPos.x = cos(angle) * dist * xMagnitude;
          newPos.y = sin(angle) * dist * yMagnitude;
          return newPos;
        }
      `;
    case "snake":
      return `
        vec3 animateSnake(vec3 position, float time, float xMagnitude, float yMagnitude) {
          vec3 newPos = position;
          float roughColWidth = ${(8.0 / Math.sqrt(particleCount)).toFixed(5)};
          newPos.x = mod(position.x - time / 4.0, 8.0 + roughColWidth) * xMagnitude - 4.0 * xMagnitude;
          newPos.y += (sin(time / 1.5 + position.x * 0.75 + (position.y * position.y) / 4.0) * yMagnitude) / 2.0;
          return newPos;
        }
      `;
    default:
      return "";
  }
};

export const getAnimationMainCode = (animationMode: AnimationMode): string => {
  switch (animationMode) {
    case "ripples":
      return `pos.z += animateRipples(position, uTime, uRippleCenter, uAnimationMagnitude);`;
    case "waves":
      return `pos = animateWaves(position, uTime, uXMagnitude, uYMagnitude);`;
    case "jello":
      return `pos = animateJello(position, uTime, uXMagnitude, uYMagnitude);`;
    case "banner":
      return `pos = animateBanner(position, uTime, uXMagnitude, uYMagnitude);`;
    case "orbits":
      return `pos = animateOrbits(position, uTime, uOrbitInnerRadius, uOrbitScale, uXMagnitude, uYMagnitude);`;
    case "snake":
      return `pos = animateSnake(position, uTime, uXMagnitude, uYMagnitude);`;
    default:
      return "";
  }
};
