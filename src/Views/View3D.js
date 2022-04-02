import React, { useEffect, useState, Suspense } from 'react'
import Box from "../Box"
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { gltfResource, GroundPlane } from "../Model/Part3D"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; 

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

    const [segmentModel, setSegmentModel] = useState()
    if(!segmentModel){
        gltfResource.loadModel("STRANDCASTER6", (scene)=>{
            setSegmentModel(scene)
            console.log(scene)
        })
    }

  return (
    <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <CameraController/>
        <Suspense fallback={<></>}>
            <GroundPlane/>
        </Suspense>
        
        { segmentModel ?
            <primitive
                object={segmentModel}
                position={[0, 0, 0]}
                scale={1}
                rotation={[0,0,0]}
            /> : <></>
        }
    </Canvas>
  )
}
