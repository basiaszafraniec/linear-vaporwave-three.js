import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function createHeadScene(sceneHead) {
  const ambientLight = new THREE.AmbientLight("#ffffff", 5);
  sceneHead.add(ambientLight);
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      '/head-dummy2.glb',  // Path to your model file
      function (gltf) {
        const model = gltf.scene;
        model.position.set(0, 0.4, 0);
        sceneHead.add(model);  // Add model to its own scene
        resolve(model);  // Resolve with the loaded model
      },
      function (xhr) {
        // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      function (error) {
        console.error('An error occurred while loading the model', error);
        reject(error);  // Reject if there was an error
      }
    );
  });
}