<script>
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { is_mobile } from '$lib/global';
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  import gsap from 'gsap';

  /**@type {HTMLDivElement}*/
  let threeScene;

  /** @type {THREE.PerspectiveCamera}*/
  let camera;
  /** @type {THREE.Scene}*/
  let scene;
  /** @type {THREE.WebGLRenderer}*/
  let renderer;
  /** @type {THREE.Clock}*/
  let clock;
  /** @type {THREE.AnimationMixer}*/
  // @ts-ignore
  let mixer;
  /** @type {THREE.MeshStandardMaterial}*/
  let handMaterial;
  /** @type {THREE.Object3D<THREE.Object3DEventMap>}*/
  let hand;
  /** @type {THREE.AnimationAction}*/
  let currentAnimation;
  /** @type {Array<THREE.AnimationAction>}*/
  let animationMixes = [];

  let halfSize = false;

  // @ts-ignore
  // const animationResize = { width: 0, height: 0 };
  const currentBGColor = { color: 0x413aff };

  function onWindowResize() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    if (halfSize) {
      if ($is_mobile) {
        height = window.innerHeight / 2;
      } else {
        width = window.innerWidth / 2;
      }

      if (!$is_mobile) {
        gsap.set(threeScene, { duration: 0.4, x: window.innerWidth / 2 });
      }
    }

    renderer.setSize(width, height);
    renderer.setViewport(0, 0, width, height);
    camera.fov = height / 1600;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  onMount(() => {
    clock = new THREE.Clock();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 200000);
    camera.position.set(0, 0, 250);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(currentBGColor.color);

    scene.fog = new THREE.Fog(currentBGColor.color, 200, 1000);
    const hemilight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemilight.position.set(0, 200, 0);
    scene.add(hemilight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(0, 150, 200);
    scene.add(dirLight);

    const dirLight2 = new THREE.SpotLight(0xffffff);
    dirLight2.position.set(100, -100, 100);
    scene.add(dirLight2);

    // @ts-ignore
    const spotLightHelper = new THREE.SpotLightHelper(dirLight2);

    // ground
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth / 2, window.innerHeight);
    renderer.shadowMap.enabled = true;
    threeScene.appendChild(renderer.domElement);

    /*     const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube); */

    onWindowResize();

    renderer.setAnimationLoop(() => {
      const delta = clock?.getDelta();

      if (mixer) mixer.update(delta);

      renderer.render(scene, camera);
    });

    // Load Hand
    const loader = new GLTFLoader();

    loader.load(
      '/rigget_V16.glb',
      (gltf) => {
        console.log(gltf);
        const child = gltf.scene.children[0];

        const dirLight3 = new THREE.SpotLight(0xffffff);
        dirLight3.position.set(-100, -100, 100);
        // @ts-ignore
        dirLight3.lookAt(child);
        scene.add(dirLight3);

        child.scale.set(6, 6, 6);
        console.log(child);
        console.log(child.children[1]);

        // @ts-ignore
        handMaterial = child.children[1].children[0].material;
        console.log(handMaterial);
        handMaterial.color.setHex(0x3109cd);
        handMaterial.roughness = 0.45;
        handMaterial.metalness = 0.0;

        console.log(child);
        hand = child;

        hand.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));
        child.position.z = -700;

        scene.add(gltf.scene);

        mixer = new THREE.AnimationMixer(gltf.scene);

        const animations = gltf.animations;

        for (let i = 0; i < animations.length; i++) {
          const getAnim = mixer.clipAction(animations[i]);

          if (i > 0) {
            getAnim.time = animations[i].duration / 2;

            if (i === 10) {
              getAnim.time = 0;
            } else if (i === 26 || i === 27) {
              getAnim.time = 0;
            }

            getAnim.paused = true;
            getAnim.play();
            getAnim.weight = 0;
          } else {
            currentAnimation = getAnim;
          }

          animationMixes.push(getAnim);
        }

        gsap.to(hand.position, { delay: 1, duration: 1, z: 50, ease: 'power3.out' });
      },
      (xhr) => {
        const percentLoaded = (xhr.loaded / xhr.total) * 100;
        console.log(`${percentLoaded}% loaded`);
      },
      (error) => {
        console.log(error);
      }
    );
  });
</script>

<svelte:window on:resize={onWindowResize} />

<div class="ThreeScene" bind:this={threeScene}></div>

<style>
  .ThreeScene {
    position: absolute;
  }
</style>
