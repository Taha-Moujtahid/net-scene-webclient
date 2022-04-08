import React, {useEffect, Component, Suspense} from 'react'
import { gltfResource, GroundPlane } from "../Model/Part3D"
import { onSnapshot, collection } from "firebase/firestore"
import firestore from "../API"

import { Part3D } from '../Model/Part3D'

export default class NetScene extends Component {

    constructor(props){
        super(props)
        this.state = {
            highlightedObject : undefined,
            scene : undefined
        }
    }

    componentDidMount(){
       
        onSnapshot(
            collection(firestore,"Plant"), (snapShot)=>{
                console.log(snapShot.docs.map((doc)=>doc.data()))
            }
        );
        
        if(!this.state.scene){
            console.log("LOADING SCENE...")
            gltfResource.loadModel("STRANDCASTER6", (gltf) => {
                this.setState({scene : gltf})
                console.log("SCENE LOADED!")
            })
        }
        
    }

  render() {
    if(this.state.scene){
        var sceneModels = []
        

        this.state.scene.children.map(child => {

            if(child.name !== "Model"){
                sceneModels.push(
                    <Part3D 
                        model={child.clone()}
                        model_ID={child.name}
                        key={child.name}
                        visible={(child.name === this.state.highlightedObject)}
                        onClick={(model_ID) => this.setState({highlightedObject : model_ID})}
                    />
                )
            }else{
                sceneModels.push(
                    <primitive 
                        object={child.clone()}
                        position={child.position}
                        rotation={[ (Math.PI / 2),0,0]}
                        key={child.name}
                    />
                )  
            } 

        })

        
    }

    return (<>
       <Suspense fallback={<></>}>
            <GroundPlane/>
        </Suspense>
        { this.state.scene !== undefined ? sceneModels : <></>}
        
    </>)
  }
}

