import React, { useEffect, useMemo, useRef, useState } from "react"
import ReactDOM from "react-dom"
import { Canvas, extend, useFrame, useThree } from "react-three-fiber"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import "./styles.css"
import frag from './assets/frag'
import vert from './assets/vert'
import model from './assets/32FFF.xyz'

extend({ OrbitControls })

function toHex(n) {
  var hex = n.toString(16);
  while (hex.length < 2) {hex = "0" + hex; }
  return hex;
}

function Particles({points}) {

  const initialPositions = points.map(v=>v.slice(0,3).map(w=>Number(w))).flat()
  const initialColors = points.map(v=>v.slice(3).map(w=>Number(w)/255)).flat()
  const uniforms = useMemo(() => ({ time: { value: 1.0 } }), [])
  const positions = useMemo(() => new Float32Array(initialPositions), [initialPositions])
  const colors = useMemo(() => new Float32Array(initialColors),[initialColors])

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
        {/* <bufferAttribute attachObject={["attributes", "velocity"]} count={velocities.length / 3} array={velocities} itemSize={3} />
        <bufferAttribute attachObject={["attributes", "acceleration"]} count={accelerations.length / 3} array={accelerations} itemSize={3} /> */}
        <bufferAttribute attachObject={["attributes", "color"]} count={colors.length / 3} array={colors} itemSize={3} />

      </bufferGeometry>
      <shaderMaterial 
        attach="material" 
        uniforms={uniforms}
        vertexShader={vert}
        fragmentShader={frag}
        vertexColors
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

const App = ()=>{

  const [points, setPoints] = useState()
  useEffect(()=>{
    const ParseModel = async ()=>{
      const entries = await (await fetch(model)).text()
      const lines = entries.split("\n")
      console.log(lines[0])
      setPoints(lines.map(v=>v.split(' ')))
    }
    ParseModel()
  },[ model, setPoints ])

  return <Canvas camera={{ position: [0, 0, 20] }}>
    {points && <Particles points={points} />}
    <Controls />
  </Canvas>
}


ReactDOM.render(<App/>, document.getElementById("root"))
