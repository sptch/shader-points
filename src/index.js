import React, { useEffect, useMemo, useRef, useState } from "react"
import ReactDOM from "react-dom"
import { Canvas, extend, useFrame, useThree } from "react-three-fiber"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import "./styles.css"
import frag from './assets/frag'
import vert from './assets/vert'
import model from './assets/32FFF.xyz'

extend({ OrbitControls })

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
      console.log(window.location.hostname)
      const entries = await (
        await fetch( 
          window.location.hostname!=='sptch.github.io'?
          model:
          "https://github.com/sptch/shader-points/raw/main/src/assets/32FFF.xyz"
        )
      ).text()
      const lines = entries.split("\n")
      console.log(lines[0])
      setPoints(lines.map(v=>v.split(' ')))
    }
    ParseModel()
  },[ setPoints ])

  return <Canvas camera={{ position: [0, 0, 20] }}>
    {points && <Particles points={points} />}
    <Controls />
  </Canvas>
}


ReactDOM.render(<App/>, document.getElementById("root"))
