export default `
varying vec3 vColor;
varying vec3 pos;
uniform float time;
void main() {
  vec3 col = vColor;
  float speed = 2.0;
  gl_FragColor = vec4(
    col[0] + (sin(time * speed + pos[0]) * 0.3 ),
    col[1] + (sin(time * speed + pos[1]) * 0.3),
    col[2] + (sin(time * speed + pos[2]) * 0.3),
    1.0);
}`