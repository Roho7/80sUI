export const FULLSCREEN_VERTEX_SHADER = `#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

const BAYER_GLSL = `
float readBayer2(vec2 a) {
  a = floor(a);
  return fract(a.x * 0.5 + a.y * a.y * 0.75);
}
float readBayer4(vec2 a) {
  return readBayer2(0.5 * a) * 0.25 + readBayer2(a);
}
float readBayer8(vec2 a) {
  return readBayer4(0.5 * a) * 0.25 + readBayer2(a);
}
`

export const OVERLAY_FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform vec3 uInks[4];
uniform int uMode;
uniform float uCoverage;
uniform float uSeed;
out vec4 outColor;
${BAYER_GLSL}
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21) + uSeed);
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
void main() {
  vec2 cell = floor(gl_FragCoord.xy);
  if (readBayer4(cell) >= uCoverage) {
    discard;
  }
  vec3 color = uInks[0];
  if (uMode == 1) {
    color = uInks[3];
  } else if (uMode == 2) {
    float level = hash(floor(cell / 2.0)) * 3.0 + readBayer4(cell);
    color = uInks[int(clamp(floor(level), 0.0, 3.0))];
  }
  outColor = vec4(color, 1.0);
}
`

export const DITHER_FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform sampler2D uImage;
uniform vec3 uInks[4];
uniform int uMatrixSize;
uniform vec2 uSeedOffset;
uniform float uContrast;
in vec2 vUv;
out vec4 outColor;
${BAYER_GLSL}
void main() {
  vec3 source = texture(uImage, vUv).rgb;
  float luminance = dot(source, vec3(0.2126, 0.7152, 0.0722));
  luminance = clamp((luminance - 0.5) * uContrast + 0.5, 0.0, 1.0);
  vec2 cell = floor(gl_FragCoord.xy) + uSeedOffset;
  float threshold = uMatrixSize == 8 ? readBayer8(cell) : readBayer4(cell);
  int index = int(clamp(floor(luminance * 3.0 + threshold), 0.0, 3.0));
  outColor = vec4(uInks[index], 1.0);
}
`
