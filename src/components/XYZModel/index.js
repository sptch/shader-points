import React, { useEffect, useMemo, useRef, useState } from "react"
import ReactDOM from "react-dom"
import { Canvas, useFrame } from "react-three-fiber"
import { OrbitControls } from 'drei'
import fetchProgress from 'fetch-progress'
import frag from 'assets/frag'
import vert from 'assets/vert'

function Particles({points}) {

  const initialPositions = points.map(v=>v.slice(0,3).map(w=>Number(w))).filter(g=>g.find(v=>!isNaN(v))).map(v=>[v[0],v[2],v[1]]).flat()
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

export default ({url})=>{

  const [points, setPoints] = useState()
  const [progress, setProgress] = useState()
  const controls = useRef()
  
  useEffect(()=>{
      console.log(window.location.hostname)
      const response = fetch(url).then(
        fetchProgress({
          onProgress(progress) {
            if(progress.percentage===100){
              setProgress('Loading...');
            }else{
              setProgress(progress.percentage+'%');
            }
          },
        })
      ).then(r=>{ setProgress('Loading'); return r.text();}
      ).then(data=>{
        const lines = data.split("\n")
        setPoints(lines.map(v=>v.split(' '))) 
        setProgress('Loaded') 
      })
  },[ setPoints ])

  return <>
    <div style={{
      backgroundColor:'black', 
      width:'100vw', 
      height: '100vh', 
      position:'absolute', 
      visibility: progress==='Loaded'?'hidden':'visible',
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