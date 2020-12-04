import React, { useEffect, useMemo, useRef, useState } from "react"
import ReactDOM from "react-dom"
// import * as THREE from 'three'
import { Canvas, useFrame } from "react-three-fiber"
import { OrbitControls } from 'drei'
import fetchProgress from 'fetch-progress'
import frag from 'assets/frag'
import vert from 'assets/vert'
import { Route, useHistory } from 'react-router-dom'
const THREE = require('three');
const PLYLoader = require('three-ply-loader');

function Particles({points}) {

  const uniforms = useMemo(() => ({ time: { value: 1.0 } }), [])
  const positions = useMemo(() =>points.attributes.position.array, [points.attributes.position])
  const colors = useMemo(() => points.attributes.color.array, [points.attributes.color])
  // console.log(colors, positions)
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

export default ({url})=>{
  const [points, setPoints] = useState()
  const [progress, setProgress] = useState()
  const camera = useRef()
  const controls = useRef()

  useEffect(()=>{
    PLYLoader(THREE);

    console.log(url)
    const loader = new THREE.PLYLoader();
    const group = new THREE.Object3D();
    loader.load(url, function (geometry) {
      if(!points) {
        setPoints(geometry)
        console.log(points)
      }
    });
    
  })
  useEffect(()=>{console.log(points)},[points])


  return  <>
    <div style={{
      backgroundColor:'black', 
      width:'100vw', 
      height: '100vh', 
      position:'absolute', 
      visibility: 'hidden',
      textAlign:'center',
      display: 'flex',
      alignItems: 'center', /* Vertical center alignment */
      justifyContent: 'center',
      top:0,
      bottom:0, 
      right:0, 
      left:0,
      backgroundBlendMode: 'normal',
      fontFamily: 'Helvetica, Sans-Serif',
      fontSize: '32px',
      fontWeight:'lighter'
    }} >
      <span style={{color:'white'}}>
        {progress}
      </span>
    </div>

    <Canvas 
      onClick={()=>console.log(controls.current, controls.current.object)} 
      camera={{ position: [10, 5, -5] }}
    >
      {points && <Particles points={points} />}
      <OrbitControls 
        ref={controls} 
        target={[0, 3.3, 1.5]} 
      />
    </Canvas>
  </>
}