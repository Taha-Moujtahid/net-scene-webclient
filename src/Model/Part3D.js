import {
    DRACOLoader,
    GLTFLoader,
    MeshoptDecoder,
    OrbitControls as ThreeOrbitControls,
  } from "three-stdlib";

import * as THREE from "three"
import React, { Component } from 'react'


import groundTexture from "../Textures/GridTexture.png"
import { useLoader } from "@react-three/fiber";

const MODEL_3D_ROOT = "models"

class GLTFResource {
  
    constructor(createManager = false) {
      this._cache = {};
      this.progress = 0;
  
      const manager = createManager
        ? new THREE.LoadingManager()
        : THREE.DefaultLoadingManager;
      this.loader = new GLTFLoader(manager);
  
      // setup compression support for DRACO and MeshOpt
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(
        "https://www.gstatic.com/draco/versioned/decoders/1.4.1/"
      ); // TODO: this pulls decoders from web, should be local
      dracoLoader.setDecoderConfig({ type: "js" });
      dracoLoader.preload();
      this.loader.setDRACOLoader(dracoLoader);
      this.loader.setMeshoptDecoder(MeshoptDecoder);
    }

    loadModel(modelName, onLoad) {
        this.loader.load(`${MODEL_3D_ROOT}/${modelName}.glb`,(gltf) => {
            const root = gltf.scene;
            if (root.name === "AuxScene" && root.children.length === 1){
              onLoad(root.children[0]);
            }else{
              onLoad(root);
            }
          },()=>{},(e) => {
            if (e instanceof SyntaxError) {
              // this seems to be the reaction for missing file
              console.log(`File ${MODEL_3D_ROOT}/${modelName}.glb\n seems unavailable.`);
            }
            throw e;
        });
    }

    
  }
 
 export  function Part3D(props) {
  const visible = props.visible === undefined ? true : props.visible
  const onClick = props.onClick
  
  return (
      <mesh 
          onClick={(e)=> {
              e.stopPropagation()
              onClick(props.model_ID)
          }}
          key={props.model_ID}
          visible={visible}
      >
      <primitive 
      object={props.model}
      position={props.model.position}
      rotation={props.model.rotation}
      />
  </mesh>
  )
 }
 


 

  export function GroundPlane() {
    const texture = useLoader(THREE.TextureLoader, groundTexture)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10,10)

        return (
            <mesh
                rotation={[- (Math.PI / 2),0,0]}
                scale={[100,100,1]}
                position={[0,-10,0]}
            >
                <planeBufferGeometry attach="geometry" args={[3, 3]} />
                <meshBasicMaterial attach="material" map={texture} />
            </mesh>
        )
    
  }
  
  export const gltfResource = new GLTFResource();