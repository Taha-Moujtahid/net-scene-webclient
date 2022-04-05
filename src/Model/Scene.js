import React, {useEffect, useState, Suspense} from 'react'
import { gltfResource, GroundPlane } from "../Model/Part3D"


export default function NetScene() {

    const [scene, setScene] = useState()
    
    if(!scene){
        gltfResource.loadModel("STRANDCASTER6", (scene)=>{
            setScene(scene)
            console.log(scene)
        })
    }else{
        console.log(scene)
    }
    

  return (
    <>
        <Suspense fallback={<></>}>
            <GroundPlane/>
        </Suspense>
        {scene}
    </>
  )
}
