export default `
uniform float time;
varying vec3 vColor;
void main() {
    vColor = color;
    gl_Position = projectionMatrix 
        * modelViewMatrix
        * vec4(position, 1.0);
    gl_PointSize = 3.0;
}`