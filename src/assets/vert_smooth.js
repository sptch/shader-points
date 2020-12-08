export default `
uniform float time;
varying vec3 vColor;
varying vec3 pos;
void main() {
    pos = position;
    vColor = color;
    float speed = 2.0;
    gl_Position = projectionMatrix 
        * modelViewMatrix
        * vec4(
            vec3(
              sin(time * speed + pos[0]) * 0.15 + pos[0],
              cos(time * speed + pos[1]) * 0.15 + pos[1],
              sin(time * speed + pos[2]) * 0.15 + pos[2]
            ), 1.0);
    gl_PointSize = 3.0;
}`
