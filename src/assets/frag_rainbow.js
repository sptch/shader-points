export default `
varying vec3 vColor;
uniform float time;
void main() {
  vec3 col = vColor;
  gl_FragColor = vec4(sin(time + col[0] + (time * col[0] * 0.3)), cos(time + col[1] + (time * col[1] * 0.3)), sin(time + col[2] + (time * col[2] * 0.3)), 1.0);
}`