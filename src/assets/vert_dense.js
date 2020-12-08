export default `
uniform float time;
varying vec3 vColor;
varying vec3 pos;
void main() {
    pos = position;
    vColor = color;
    gl_Position = projectionMatrix 
        * modelViewMatrix
        * vec4(
            vec3(
              sin(time * 0.01 * sin(time * 0.01 * pos[0])) + pos[0],
              sin(time * 0.01 * cos(time * 0.02 * pos[1])) + pos[1],
              sin(time * 0.01 * sin(time * 0.05 * pos[2])) + pos[2]
            ), 1.0);
    gl_PointSize = 3.0;
}`