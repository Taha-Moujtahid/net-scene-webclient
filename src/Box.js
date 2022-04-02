import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

var time = 0

export default function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  
  var amp = 2
  useFrame((state, delta) => {
    time += delta
    ref.current.position.x = Math.sin(time/2 + props.offset) * amp
    ref.current.position.y = Math.cos(time/2 + props.offset) * amp
  })
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
   
        <mesh
        {...props}
        ref={ref}
        //scale={clicked ? 1.5 : 1}
        onClick={(event) => click(!clicked)}
        onPointerOver={(event) => hover(true)}
        onPointerOut={(event) => hover(false)}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color={hovered ? 'red' : 'blue'} />
        </mesh>
  )
}
