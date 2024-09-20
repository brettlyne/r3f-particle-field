export type ColorMode =
  | "solid"
  | "gradient"
  | "fieldLinear"
  | "fieldRadial"
  | "zPosition";

export const getColorShaderChunk = (colorMode: ColorMode): string => {
  switch (colorMode) {
    case "solid":
      return `
        vec3 getColor(vec3 position, vec2 uv) {
          return uColor1;
        }
      `;
    case "gradient":
      return `
        vec3 getColor(vec3 position, vec2 uv) {
          float gradientAngle = 3.14159 / 4.0;
          float gradientPos = uv.x * cos(gradientAngle) - uv.y * sin(gradientAngle);
          gradientPos = gradientPos * 0.5 + 0.5;
          return mix(uColor1, uColor2, gradientPos);
        }
      `;
    case "fieldLinear":
      return `
        vec3 getColor(vec3 position, vec2 uv) {
          vec2 normalizedPos = position.xy / 8. + .5;
          float diagonalGradient = (1.-normalizedPos.x + normalizedPos.y) * 0.5;
          return mix(uColor2, uColor1, diagonalGradient);
        }
      `;
    case "fieldRadial":
      return `
        vec3 getColor(vec3 position, vec2 uv) {
          float t = smoothstep(uInnerRadius, uOuterRadius, dist);
          return mix(uColor1, uColor2, t);
        }
      `;
    case "zPosition":
      return `
        vec3 getColor(vec3 position, vec2 uv) {
          float t = (position.z + 2.0) / 4.0; // Map -2 to 2 to 0 to 1
          return mix(uColor2, uColor1, t);
        }
      `;
    default:
      return `
        vec3 getColor(vec3 position, vec2 uv) {
          return uColor1;
        }
      `;
  }
};
