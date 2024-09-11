import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Modify to create a separate scene for the head model
export function createHeadScene(sceneHead, camera, renderer) {
  // Load the head model in its own scene
  const ambientLight = new THREE.AmbientLight("#ffffff", 5);
  sceneHead.add(ambientLight);

  const loader = new GLTFLoader();

  loader.load(
    '/head5.glb',  // Path to your model file
    function (gltf) {
      const model = gltf.scene;
      model.position.set(0, 0.5, 0);
      model.rotateY(3);
      sceneHead.add(model);  // Add model to its own scene
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.error('An error occurred while loading the model', error);
    }
  );
}
