import React, { Component, Suspense} from 'react'
import { gltfResource, GroundPlane } from "../Model/Part3D"
import { onSnapshot, collection, setDoc, doc } from "firebase/firestore"
import firestore from "../API"

import { Part3D } from '../Model/Part3D'

export default class NetScene extends Component {

    constructor(props){
        super(props)
        this.state = {
            highlightedObject : undefined,
            scene : undefined,
            status : undefined
        }

        this.colorPalette = {"-1": "red", "0": "green", "1": "yellow"}
    }

    componentDidMount(){
       
        if(!this.state.scene){
            this.readPlant()
            this.loadScene("STRANDCASTER6")
        }
    }

    loadScene(sceneName){
        console.log("LOADING SCENE ( "+sceneName+" )...")
        gltfResource.loadModel(sceneName, (gltf) => {
            this.setState({scene : gltf})
            console.log("SCENE ( "+sceneName+" ) LOADED!")
        })
    }

    readPlant(){
        onSnapshot(
            collection(firestore,"Plant"), (snapShot)=>{
                var n_status = []
                var n_highlightedObject = []
                snapShot.docs.forEach((doc)=>{
                    var documentName = doc.id, documentData = doc.data()
                    n_status[documentName] = documentData["status"]
                    n_highlightedObject[documentName] = documentData["highlighted"]
                })
                this.setState({status: n_status, highlightedObject: n_highlightedObject})
            }
        );
    }

    updatePlant(model_ID,data){
        setDoc(doc(firestore,"Plant",model_ID),data,{merge: true})
    }

  render() {
    if(this.state.scene){
        var sceneModels = []

        this.state.scene.children.forEach(child => {
            var model = child.clone()
            if(child.name !== "Model"){
                sceneModels.push(
                    <Part3D 
                        model={model}
                        model_ID={child.name}
                        key={child.name}
                        visible={(this.state.highlightedObject[child.name])}
                        onClick={(model_ID) => {
                            this.state.highlightedObject[model_ID] = !this.state.highlightedObject[model_ID]
                            this.updatePlant(model_ID, {"highlighted": this.state.highlightedObject[model_ID]})
                            this.forceUpdate()
                        }}
                        materialColor={this.colorPalette[this.state.status[child.name]]}
                    />
                )
            }else{
                sceneModels.push(
                    <primitive 
                        object={model}
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

