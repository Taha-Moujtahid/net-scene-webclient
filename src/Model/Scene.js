import React, {useEffect, useState, Suspense} from 'react'
import { gltfResource, GroundPlane } from "../Model/Part3D"
import { onSnapshot, collection } from "firebase/firestore"
import firestore from "../API"

export default function NetScene() {

    const [scene, setScene] = useState()
    const [highlightedObject, setHighlightedObject] = useState([])

    
    useEffect(() =>  onSnapshot(collection(firestore,"Plant"),
        (snapShot)=>{
            console.log(snapShot.docs.map((doc)=>doc.data()))
        }
    ),[]);
    
    useEffect(() => {
        if(!scene){
        gltfResource.loadModel("STRANDCASTER6", (scene)=>{
            setScene(scene)
        }, setHighlightedObject)
    }},[])

    if (scene){
        console.log(highlightedObject)
        console.log(scene)
        for(var child of scene){
            if(highlightedObject == child.key ){
                child.props.visible = true
            }
        }
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
