import {
    DRACOLoader,
    GLTFLoader,
    MeshoptDecoder,
    OrbitControls as ThreeOrbitControls,
  } from "three-stdlib";

import * as THREE from "three"


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

    loadModel(modelName, sceneCallback, onClickCallback) {
        this.loader.load(`${MODEL_3D_ROOT}/${modelName}.glb`,(gltf) => {
            const root = gltf.scene;
            if (root.name === "AuxScene" && root.children.length === 1){
              sceneCallback(this.hideBoundingBoxes(root.children[0]), onClickCallback);
            }else{
              var model = this.hideBoundingBoxes(root, onClickCallback)
              sceneCallback(model)
            }
          },()=>{},(e) => {
            if (e instanceof SyntaxError) {
              // this seems to be the reaction for missing file
              console.log(`File ${MODEL_3D_ROOT}/${modelName}.glb\n seems unavailable.`);
            }
            throw e;
        });
    }

    hideBoundingBoxes(_model, onClickCallback){
      var r_model = [];
      _model.children.forEach(child => {
        if( child.name != "Model"){
          r_model.push(
            <mesh 
              onClick={(e)=> {
                e.stopPropagation()
                onClickCallback(child.name)
              }}
              key={child.name}
              visible={false}
            >
              <primitive 
               object={child}
               position={child.position}
               rotation={[0,0,0]}
              />
            </mesh>
          )
          
        }
      })
      r_model.push(
        <primitive
          key={"Model"}
          object={_model}
          position={[0, 0, 0]}
          scale={1}
          rotation={[0,0,0]}
        />
      )
      return r_model
    }

  }

 

  export function GroundPlane() {
    const texture = useLoader(THREE.TextureLoader, groundTexture)
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10,10)

        return (
            <mesh
                rotation={[ - (Math.PI / 2),0,0]}
                scale={[100,100,1]}
                position={[0,-10,0]}
            >
                <planeBufferGeometry attach="geometry" args={[3, 3]} />
                <meshBasicMaterial attach="material" map={texture} />
            </mesh>
        )
    
  }
  
  export const gltfResource = new GLTFResource();