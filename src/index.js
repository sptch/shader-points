import React, { useMemo, useRef } from "react"
import ReactDOM from "react-dom"
import { Canvas, extend, useFrame, useThree } from "react-three-fiber"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import vert from "./vert.glsl"
import frag from "./frag.glsl"
import "./styles.css"

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
      <shaderMaterial attach="material" uniforms={uniforms} vertexShader={vert} fragmentShader={frag} vertexColors />
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
