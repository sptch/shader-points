import React, { useMemo, useRef } from "react"
import ReactDOM from "react-dom"
import { Canvas, extend, useFrame, useThree } from "react-three-fiber"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import "./styles.css"

const frag = `
uniform float time;
void main() {
   float z = 1.0 - (gl_FragCoord.z / gl_FragCoord.w) / 20.0;
   gl_FragColor = vec4(sin(time * 2.0) * z, cos(time) * z, atan(time) * z, 1.0);
}`

const vert = `
uniform float time;
attribute vec3 velocity;
attribute vec3 acceleration;
void main() {
    vec3 pos = position;
    gl_Position = projectionMatrix 
        * modelViewMatrix
        * vec4(
            vec3(
                sin(time * 4.0) + pos[0] + cos(time / velocity[0]) * 1.0 * velocity[0],
                cos(time + time * 4.0) + pos[1] * 2.0 * sin(time / velocity[1]) * velocity[1],
                sin(time + time + time * 4.0) + pos[2] * 2.0 * cos(time / velocity[2]) * 1.0 * velocity[2]), 1.0);
    gl_PointSize = 5.0;
}`

extend({ OrbitControls })

function Particles({ pointCount }) {
  const initialPositions = []
  const initialVelocities = []
  const initialAccelerations = []
  for (let i = 0; i < pointCount; i++) {
    initialPositions.push(-5 + Math.random() * 10)
    initialPositions.push(-5 + Math.random() * 10)
    initialPositions.push(-5 + Math.random() * 10)
    initialVelocities.push(-10 + Math.random() * 20)
    initialVelocities.push(-10 + Math.random() * 20)
    initialVelocities.push(-10 + Math.random() * 20)
    initialAccelerations.push(0)
    initialAccelerations.push(-10.8)
    initialAccelerations.push(0)
  }

  const positions = useMemo(() => new Float32Array(initialPositions), [initialPositions])
  const velocities = useMemo(() => new Float32Array(initialVelocities), [initialVelocities])
  const accelerations = useMemo(() => new Float32Array(initialAccelerations), [initialAccelerations])
  const uniforms = useMemo(() => ({ time: { value: 1.0 } }), [])

  const geom = useRef()
  useFrame(({ clock }) => {
    if (geom.current) {
      geom.current.material.uniforms.time.value = clock.getElapsedTime()
      geom.current.geometry.verticesNeedUpdate = true
    }
  })

  return (
    <points ref={geom}>
      <bufferGeometry attach="geometry">
        <bufferAttribute attachObject={["attributes", "position"]} count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attachObject={["attributes", "velocity"]} count={velocities.length / 3} array={velocities} itemSize={3} />
        <bufferAttribute attachObject={["attributes", "acceleration"]} count={accelerations.length / 3} array={accelerations} itemSize={3} />
      </bufferGeometry>
      <shaderMaterial attach="material"   
        args={[{
          uniforms: uniforms,
          vertexShader: vert,
          fragmentShader: frag,
        }]}
      />
    </points>
  )
}

function Controls() {
  const controls = useRef()
  const { camera, gl } = useThree()
  useFrame(() => controls.current.update())
  return <orbitControls ref={controls} args={[camera, gl.domElement]} enableDamping dampingFactor={0.05} rotateSpeed={0.6} />
}

ReactDOM.render(
  <Canvas camera={{ position: [0, 0, 20] }}>
    <Particles pointCount={100000} />
    <Controls />
  </Canvas>,
  document.getElementById("root")
)
