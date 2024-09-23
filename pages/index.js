import * as dat from "lil-gui";
import Head from "next/head";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { createHeadScene } from "./head-from-model.js";
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
// import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import Header from "./header.js";

const Index = () => {
  const mountRef = useRef(null);
  const headModelRef = useRef(null);  // Store the head model reference


  useEffect(() => {


    const gui = new dat.GUI();

    gui.close();

    // Canvas
    const canvas = document.querySelector("canvas.webgl");

    // Scene
    const scene = new THREE.Scene();

    // Fog
    const fog = new THREE.Fog("#000000", 1, 2.5);

    scene.fog = fog;

    const sceneHead = new THREE.Scene();


    // Textures
    const textureLoader = new THREE.TextureLoader();
    const gridTexture = textureLoader.load("/grid-6.png");
    const heightTexture = textureLoader.load("/displacement-7.png");
    const metalnessTexture = textureLoader.load("/metalness-2.png");

    // Plane
    const parameters = {
      displacementScale: 0.4,
      metalness: 1,
      roughness: 0.5,
    };

    const geometry = new THREE.PlaneGeometry(1, 2, 24, 24);
    const material = new THREE.MeshStandardMaterial({
      map: gridTexture,
      displacementMap: heightTexture,
      displacementScale: parameters.displacementScale,
      metalness: parameters.metalness,
      metalnessMap: metalnessTexture,
      roughness: parameters.roughness,
    });
    const plane = new THREE.Mesh(geometry, material);
    const plane2 = new THREE.Mesh(geometry, material);

    plane.rotation.x = -Math.PI * 0.5;
    plane2.rotation.x = -Math.PI * 0.5;

    plane.position.y = 0.0;
    plane.position.z = 0.15;
    plane2.position.y = 0.0;
    plane2.position.z = -1.85;
    scene.add(plane);
    scene.add(plane2);

    gui
      .add(material, "displacementScale")
      .min(0)
      .max(5)
      .step(0.001)
      .name("Terrain intensity");
    gui.add(material, "metalness", 0, 1, 0.0001).name("Material metalness");
    gui.add(material, "roughness", 0, 1, 0.0001).name("Material roughness");

    // Lights
    const ambientLight = new THREE.AmbientLight("#ffffff", 10);
    scene.add(ambientLight);
    gui
      .add(ambientLight, "intensity")
      .min(0)
      .max(100)
      .step(0.001)
      .name("AmbientLight intensity");
    gui.addColor(ambientLight, "color").name("AmbientLight color");

    const spotlight = new THREE.SpotLight(
      "#551133",
      40,
      25,
      Math.PI * 0.1,
      0.25
    );
    spotlight.position.set(0.5, 8, 2.1);
    spotlight.target.position.x = -0.25;
    spotlight.target.position.y = 0.25;
    spotlight.target.position.z = 0.25;
    scene.add(spotlight);
    scene.add(spotlight.target);

    const spotlight2 = new THREE.SpotLight(
      "#330022",
      40,
      25,
      Math.PI * 0.1,
      0.25
    );
    spotlight2.position.set(-0.5, 0.75, 2.1);
    spotlight2.target.position.x = 0.25;
    spotlight2.target.position.y = 0.25;
    spotlight2.target.position.z = 0.25;
    scene.add(spotlight2);
    scene.add(spotlight2.target);

    gui
      .add(spotlight, "intensity")
      .min(0)
      .max(50)
      .step(0.001)
      .name("Spotlight 1 intensity");
    gui
      .add(spotlight2, "intensity")
      .min(0)
      .max(50)
      .step(0.001)
      .name("Spotlight 2 intensity");

    gui.addColor(spotlight, "color").name("Spotlight 1 color");
    gui.addColor(spotlight2, "color").name("Spotlight 2 color");

    gui
      .add(spotlight.position, "x")
      .min(-15)
      .max(15)
      .step(0.01)
      .name("Spotlight 1 X");
    gui
      .add(spotlight.position, "y")
      .min(-2)
      .max(15)
      .step(0.01)
      .name("Spotlight 1 Y");
    gui
      .add(spotlight.position, "z")
      .min(-15)
      .max(15)
      .step(0.01)
      .name("Spotlight 1 Z");

    gui
      .add(spotlight2.position, "x")
      .min(-15)
      .max(15)
      .step(0.01)
      .name("Spotlight 2 X");
    gui
      .add(spotlight2.position, "y")
      .min(-2)
      .max(15)
      .step(0.01)
      .name("Spotlight 2 Y");
    gui
      .add(spotlight2.position, "z")
      .min(-15)
      .max(15)
      .step(0.01)
      .name("Spotlight 2 Z");

    // Sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Base camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.01,
      20
    );
    camera.position.x = 0;
    camera.position.y = 0.06;
    camera.position.z = 1.1;

    gui
      .add(camera, "near")
      .min(0)
      .max(10)
      .step(0.1)
      .onChange(() => camera.updateProjectionMatrix())
      .name("Camera Near");
    gui
      .add(camera, "far")
      .min(0)
      .max(100)
      .step(0.1)
      .onChange(() => camera.updateProjectionMatrix())
      .name("Camera Far");
    gui
      .add(camera, "fov")
      .min(0)
      .max(180)
      .step(0.1)
      .onChange(() => camera.updateProjectionMatrix())
      .name("Camera FOV");
    scene.add(camera);

    // Controls
    // const controls = new OrbitControls(camera, canvas);
    // controls.enableDamping = true;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Post-processing
    const effectComposer = new EffectComposer(renderer);
    effectComposer.setSize(sizes.width, sizes.height);
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const renderPass = new RenderPass(scene, camera);
    effectComposer.addPass(renderPass);

    const rgbShiftPass = new ShaderPass(RGBShiftShader);
    rgbShiftPass.uniforms["amount"].value = 0.003;
    gui
      .add(rgbShiftPass.uniforms["amount"], "value")
      .min(0)
      .max(0.01)
      .step(0.00001)
      .name("RGBShift intensity");
    effectComposer.addPass(rgbShiftPass);
    const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
    effectComposer.addPass(gammaCorrectionPass);

    var bloomParams = {
      strength: 1.5,
    };

    const bloomPass = new UnrealBloomPass();
    bloomPass.strength = bloomParams.strength;

    gui
      .add(bloomParams, "strength", 0.0, 3.0)
      .onChange((value) => {
        bloomPass.strength = Number(value);
      })
      .name("Bloom Strength");

    effectComposer.addPass(bloomPass);

    // Resize handler
    window.addEventListener("resize", () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      // camera.fog;

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      effectComposer.setSize(sizes.width, sizes.height);
      effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    let easing = 0.05;
    function updateHeadRotation(mouse) {
      if (headModelRef.current) {
        const targetRotationX = mouse.y * -1 + 0.8;
        const targetRotationY = mouse.x;

        // Use lerp for smoother transitions
        headModelRef.current.rotation.x = THREE.MathUtils.lerp(
          headModelRef.current.rotation.x,
          targetRotationX,
          easing
        );
        headModelRef.current.rotation.y = THREE.MathUtils.lerp(
          headModelRef.current.rotation.y,
          targetRotationY,
          easing
        );
      }
    }
    createHeadScene(sceneHead).then((model) => {
      headModelRef.current = model;  // Save the loaded model
    });

    // const text_loader = new FontLoader();
    // text_loader.load('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&display=swap', function (font) {
    //   const TextGeometry = new TextGeometry('Hello, Three.js!', {
    //     font: font,
    //     size: 0.5,
    //     height: 0.1
    //   });
    //   const TextMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    //   const TextMesh = new THREE.Mesh(TextGeometry, TextMaterial);
    //   TextMesh.position.set(0, 10, -10); // Position the text
    //   scene.add(TextMesh);
    // });

    // Animation
    const clock = new THREE.Clock();

    let speed = 0.15;

    //MYSZ
    let mouse = { x: 0, y: 0 }; // Initialize mouse position

    // Update mouse position when the user moves the mouse
    window.addEventListener('mousemove', (event) => {
      // Normalize mouse coordinates (-1 to 1 for both x and y)
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();


      // Update plane position

      plane.position.z = (elapsedTime * speed) % 2;
      plane2.position.z = ((elapsedTime * speed) % 2) - 2;

      // Update controls
      // controls.update();

      updateHeadRotation(mouse);

      // Render
      effectComposer.render();

      // Render head scene (without background light interference)
      renderer.autoClear = false;  // Prevent clearing between the two renders
      renderer.clearDepth();  // Clear depth buffer to ensure proper layering
      renderer.render(sceneHead, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();
  }, []);

  return (
    <div>
      <Head>
        <title>3D Scene with Separate Head Model</title>
        <meta name="description" content="Three.js scene with separate head model and background." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <canvas ref={mountRef} className="webgl"></canvas>
        <Header />
      </main>
    </div>
  );
};

export default Index;
