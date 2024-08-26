import * as THREE from 'three';
import global from './global';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';

let is_mobile = false;
global.IS_MOBILE.subscribe((v) => {
  is_mobile = v;
});

let in_game = false;
global.IN_GAME.subscribe((v) => {
  in_game = v;
});

let left_hand_selected = false;
global.LEFT_HAND_SELECTED.subscribe((v) => {
  left_hand_selected = v;
});

/** @type {THREE.PerspectiveCamera}*/
let camera;
/** @type {THREE.Scene}*/
let scene;
/** @type {THREE.WebGLRenderer}*/
let renderer;
/** @type {THREE.Clock}*/
let clock;
/** @type {THREE.AnimationMixer}*/
let mixer;

let animateResize = { width: 0, height: 0 };

/** @type {Array<THREE.AnimationAction>}*/
let animationMixes = [];
/** @type {THREE.AnimationAction | null}*/
let currentAnimation;

/** @type {Function}*/
let handLoadedCallback;

let currentWordInSentenceCount = 0;
/**@type {Array<number>}*/
let sentenceArray = [];

/** @type {THREE.Object3D<THREE.Object3DEventMap>}*/
let hand;

// let DEBUG = false;

let halfSize = false;

let movedToLeft = false;

/** @type {THREE.MeshStandardMaterial} */
let handMaterial;
/** @type {number} */
let previousLetter;

let isRightHand = true;

/** @type {HTMLDivElement}*/
let container;

let currentBGColor = { color: 0xff3a3a };

// let isSpelling = false;

/**
 * @param {HTMLDivElement} container
 * @description ini kayak contructor
 * */
function handScene(container) {
  clock = new THREE.Clock();
  init(container);
  animate();
}

/**
 * @param {HTMLDivElement} container
 * */
function init(container) {
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
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize);

  onWindowResize();
}

/**
 * @param {THREE.ColorRepresentation} newColor
 * */
function animateBackgroundColor(newColor) {
  const setColor = new THREE.Color(newColor);
  gsap.to(scene.background, {
    duration: 0.4,
    r: setColor.r,
    g: setColor.g,
    b: setColor.b,
    ease: 'power1.out'
  });
}

/**@function
 * @param {import('three/examples/jsm/Addons.js').GLTF} gltf */
function onLoadHand(gltf) {
  const child = gltf.scene.children[0];

  const dirLight3 = new THREE.SpotLight(0xffffff);
  dirLight3.position.set(-100, -100, 100);
  // @ts-ignore
  dirLight3.lookAt(child);
  scene.add(dirLight3);

  child.scale.set(6, 6, 6);
  // console.log(child);
  // console.log(child.children[1]);

  // @ts-ignore
  handMaterial = child.children[1].children[0].material;
  // console.log(handMaterial);
  handMaterial.color.setHex(0xff3a3a);
  handMaterial.roughness = 0.45;
  handMaterial.metalness = 0.0;

  // console.log(child);
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
    // console.log(currentAnimation);

    animationMixes.push(getAnim);
  }

  handLoadedCallback();

  gsap.to(hand.position, { delay: 1, duration: 1, z: 50, ease: 'power3.out' });

  spellSentence('sowon');
}

/**
 * @param {Function} loadHandCallback
 * @param {Function} onProgressCallback
 */
function loadHand(loadHandCallback, onProgressCallback) {
  handLoadedCallback = loadHandCallback;

  // model
  const loader = new GLTFLoader();

  // Load a gLTF resource
  loader.load(
    '/rigget_V16.glb',
    onLoadHand,
    (xhr) => {
      const percentLoaded = (xhr.loaded / xhr.total) * 100;
      console.log(`${percentLoaded}% loaded`);
      onProgressCallback(percentLoaded);
    },
    (err) => console.log(err)
  );

  /* loader.load('/test.glb', (gltf) => {
    scene.add(gltf.scene);
  }); */
}

function onWindowResize() {
  let width = window.innerWidth;
  let height = window.innerHeight;

  if (halfSize) {
    if (is_mobile) {
      height = window.innerHeight / 2;
    } else {
      width = window.innerWidth / 2;
    }
    if (left_hand_selected && !is_mobile) {
      gsap.set(container, { duration: 0.4, x: window.innerWidth / 2 });
    }
  }

  renderer.setSize(width, height);
  renderer.setViewport(0, 0, width, height);
  camera.fov = height / 1600;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function animate_resize() {
  let width = animateResize.width;
  let height = animateResize.height;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}

function animate() {
  renderer.setAnimationLoop(animate);

  const delta = clock.getDelta();

  if (mixer) mixer.update(delta);

  renderer.render(scene, camera);
}

/**
 * @function
 * @param {THREE.ColorRepresentation} newColor
 * */
const changeHandColor = (newColor) => {
  const setColor = new THREE.Color(newColor);
  gsap.to(handMaterial.color, {
    duration: 0.5,
    r: setColor.r,
    g: setColor.g,
    b: setColor.b,
    ease: 'power1.out'
  });
};

const makeLeftHand = () => {
  if (isRightHand) {
    hand.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));
    isRightHand = false;
  }
};

const makeRightHand = () => {
  if (!isRightHand) {
    hand.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));
    isRightHand = true;
  }
};

/**
 * @function
 * @param {string} letter
 * */
const convertLetterToNumber = (letter) => {
  return letter.toLowerCase().charCodeAt(0) - 97 + 1;
};

/**
 * @public
 * @function
 * @param {number} count
 * @param {((...args: any[]) => void )| undefined} onCompleteCallback
 * */
const setNewHand = (count, onCompleteCallback) => {
  if (count === 0) {
    stopSpelling();
    return;
  }

  if (count > animationMixes.length) {
    count = 0;
    console.log(`Letter not yet created, count: ${count}`);
  }

  let getHandAnimation = animationMixes[count];

  if (count === 26) {
    // use the other Z
    getHandAnimation = animationMixes[27];
    console.log('--- setting new hand 27');
  }

  // console.log(getHandAnimation);

  let animTime = 0.4 * global.GAME_SETTINGS.handSpellSlowdown * 1;
  let delay = 0.3 * global.GAME_SETTINGS.handSpellSlowdown * 1;

  if (!onCompleteCallback) {
    delay = 0;
  }

  if (count === 7) {
    // G -- Hand needs to twist more - so we are making this one slower
    animTime = 1 * global.GAME_SETTINGS.handSpellSlowdown * 1;
  }

  if (getHandAnimation !== currentAnimation) {
    if (previousLetter === 9 && count === 14) {
      // I to N (fingers collide - trying to fix that)

      gsap.to(currentAnimation, {
        delay: delay,
        duration: animTime,
        weight: 0,
        ease: 'power1.easeIn'
      });
      gsap.to(animationMixes[0], {
        delay: delay,
        duration: animTime,
        weight: 0.3,
        ease: 'linear.easeNone'
      });
    }

    if (count === 10 || count === 26) {
      // I to N (fingers collide - trying to fix that)
      //console.log('I to N');
      gsap.to(currentAnimation, {
        delay: delay,
        duration: animTime,
        weight: 1,
        ease: 'power1.easeIn'
      });
      gsap.to(animationMixes[0], {
        delay: delay,
        duration: animTime,
        weight: 0,
        ease: 'linear.easeNone'
      });
      if (count === 26) {
        playHandAnimation(count + 1);
      } else {
        playHandAnimation(count);
      }
    } else if (previousLetter === 7 && count === 5) {
      console.log('previousletter === 7 && count === 5');
      console.log(currentAnimation);
      animTime = 1 * global.GAME_SETTINGS.handSpellSlowdown * 1;
      // From G to E
      gsap.to(currentAnimation, {
        delay: delay,
        duration: animTime * 1,
        time: 0.3,
        ease: 'linear.easeNone'
      });

      gsap.to(currentAnimation, {
        delay: delay * 1.3,
        duration: 1,
        weight: 0,
        ease: 'linear.easeNone'
      });
      gsap.to(currentAnimation, {
        delay: delay * 1.3 + 1,
        duration: 1,
        time: 3,
        ease: 'linear.easeNone'
      });
      gsap.to(getHandAnimation, {
        delay: delay * 1.3 + 0.2,
        duration: animTime * 1,
        weight: 1,
        ease: 'linear.easeNone',
        onComplete: onCompleteCallback
      });
    } else if (previousLetter === 8 && count === 20) {
      animTime = 1 * global.GAME_SETTINGS.handSpellSlowdown * 1;

      gsap.to(currentAnimation, {
        delay: delay,
        duration: animTime * 1,
        time: 0.3,
        ease: 'linear.easeNone'
      });

      gsap.to(currentAnimation, {
        delay: delay * 1.3 + 0.5,
        duration: 1,
        weight: 0,
        ease: 'linear.easeNone'
      });
      gsap.to(currentAnimation, {
        delay: delay * 1.3 + 0.5 + 1,
        duration: 1,
        time: 3,
        ease: 'linear.easeNone'
      });
      gsap.to(getHandAnimation, {
        delay: delay * 1.3 + 1,
        duration: animTime * 1,
        weight: 1,
        ease: 'linear.easeNone',
        onComplete: onCompleteCallback
      });
    } else {
      gsap.to(animationMixes[0], {
        delay: delay,
        duration: animTime,
        weight: 1,
        ease: 'linear.easeNone'
      });
      // console.log(currentAnimation);
      gsap.to(currentAnimation, {
        delay: delay,
        duration: animTime,
        weight: 0,
        ease: 'linear.easeNone'
      });
      gsap.to(getHandAnimation, {
        delay: delay,
        duration: animTime,
        weight: 1,
        ease: 'linear.easeNone',
        onComplete: onCompleteCallback
      });
    }
  } else {
    gsap.to(animationMixes[0], {
      delay: 0.3,
      duration: animTime,
      weight: 1,
      ease: 'linear.easeNone'
    });

    // Its the same letter - so we move the hand slightly on the X axis
    if (!in_game) {
      if (movedToLeft) {
        gsap.to(hand.position, {
          delay: 0.3,
          duration: animTime,
          x: 0,
          onComplete: onCompleteCallback
        });
        movedToLeft = false;
      } else {
        gsap.to(hand.position, {
          delay: 0.3,
          duration: animTime,
          x: -0.1,
          onComplete: onCompleteCallback
        });
        movedToLeft = true;
      }
    } else {
      // @ts-ignore
      gsap.delayedCall(0.3 + animTime, onCompleteCallback);
    }
  }

  previousLetter = count;
  currentAnimation = getHandAnimation;
};

/**@public
 * @param {number} number*/
const playHandAnimation = (number) => {
  stopSpelling();
  gsap.delayedCall(0.3, starAnim, [number]);
};

/**@private
 * @param {number} number */
function starAnim(number) {
  const getAnim = animationMixes[number];
  getAnim.time = 0;
  getAnim.paused = false;
  getAnim.play();
  getAnim.weight = 1;
}

/**
 * @public
 * @param {string} letter */
const spellLetter = (letter) => {
  console.log(`*** spellLetter: ${letter}`);
  stopSpelling();

  sentenceArray = [0];
  currentWordInSentenceCount = 0;
  nextLetter();
};

/** @public
 * @param {string} sentence*/
const spellSentence = (sentence) => {
  stopSpelling();

  const words = sentence.split('');

  sentenceArray = [];

  for (let i = 0; i < words.length; i++) {
    const currentLetter = words[i];
    const letterToNumber = convertLetterToNumber(currentLetter);
    sentenceArray.push(letterToNumber);
  }

  currentWordInSentenceCount = 0;
  nextLetter();
};

/**@public*/
const spellPreloaderAnim = () => {
  sentenceArray = [27, 28, 29, 30];
  currentWordInSentenceCount = 0;

  nextLetter();
};

function nextLetter() {
  const len = sentenceArray.length;

  if (len === 1) {
    setNewHand(sentenceArray[currentWordInSentenceCount], undefined);
  } else {
    setNewHand(sentenceArray[currentWordInSentenceCount], nextLetter);
  }
  currentWordInSentenceCount++;
  if (currentWordInSentenceCount >= sentenceArray.length) {
    currentWordInSentenceCount = 0;
  }
}

/** @public*/
const stopSpelling = () => {
  currentWordInSentenceCount = 0;
  sentenceArray = [];

  gsap.killTweensOf(currentAnimation);
  gsap.killTweensOf(animationMixes[0]);
  gsap.killTweensOf(animationMixes);

  if (!in_game) {
    // @ts-ignore
    gsap.to(hand.position, { delay: 0.0, duration: 0.3, x: 0, onComplete: null });
  }

  gsap.to(animationMixes, { duration: 0.3, weight: 0 });
  currentAnimation = null;
  movedToLeft = false;
};

/**
 * @function
 * @public
 * @param {number} posX
 * @param {number} posY*/
const getPositionIn3D = (posX, posY) => {
  const vec = new THREE.Vector3();
  const pos = new THREE.Vector3();

  vec.set((posX / window.innerWidth) * 2 - 1, -(posY / window.innerHeight) * 2 + 1, 0.5);

  vec.unproject(camera);

  vec.sub(camera.position).normalize();

  const distance = camera.position.z / vec.z;

  pos.copy(camera.position).add(vec.multiplyScalar(distance));

  return pos;
};

/**
 * @function
 * @public
 * */
const getHand = () => {
  return hand;
};

/**
 * @function
 * @public
 * */
const animateToHalfSize = () => {
  halfSize = true;
  animateResize.height = window.innerHeight;
  animateResize.width = window.innerWidth;

  if (is_mobile) {
    gsap.to(animateResize, {
      duration: 0.4,
      height: window.innerHeight / 2,
      ease: 'power1.inOut',
      onUpdate: animate_resize
    });
  } else {
    if (left_hand_selected && !is_mobile) {
      gsap.to(container, { duration: 0.4, x: window.innerWidth / 2, ease: 'power1.inOut' });
    }
    gsap.to(animateResize, {
      duration: 0.4,
      width: window.innerWidth / 2,
      ease: 'power1.inOut',
      onUpdate: animate_resize
    });
  }
};

const animateToNormalSize = () => {
  halfSize = false;
  animateResize.width = window.innerWidth / 2;
  gsap.to(animateResize, {
    duration: 0.4,
    width: window.innerWidth,
    height: window.innerHeight,
    ease: 'power1.inOut',
    onUpdate: animate_resize
  });
  if (left_hand_selected && !is_mobile) {
    gsap.to(container, { duration: 0.4, x: 0, ease: 'power1.inOut' });
  }
};

export {
  handScene,
  animateBackgroundColor,
  loadHand,
  changeHandColor,
  makeLeftHand,
  makeRightHand,
  convertLetterToNumber,
  setNewHand,
  playHandAnimation,
  spellLetter,
  spellSentence,
  spellPreloaderAnim,
  stopSpelling,
  getPositionIn3D,
  getHand,
  animateToHalfSize,
  animateToNormalSize
};
