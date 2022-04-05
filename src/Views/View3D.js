import React, { useEffect} from 'react'
import Box from "../Box"
import { Canvas, useThree } from '@react-three/fiber'

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; 
import NetScene from '../Model/Scene';

const CameraController = () => { 
    const { camera, gl } = useThree(); 
    useEffect( () => { 
        const controls = new OrbitControls(camera, gl.domElement); 
        controls.minDistance = 3; 
        controls.maxDistance = 20; 
        return () => { controls.dispose(); 
        }; 
    }, [camera, gl] ); 
    return null; 
};

export default function View3D() {

    
    
  return (
    <Canvas>
        <ambientLight />
        <CameraController/>
        <NetScene/>
    </Canvas>
  )
}
