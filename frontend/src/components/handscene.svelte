<script>
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { HAND_SCENE, is_mobile } from '$lib/global';
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  import gsap from 'gsap';
  import * as handscene from '$lib/handscene';

  /**@type {HTMLDivElement}*/
  let threeScene;

  onMount(() => {
    $HAND_SCENE = handscene;
    $HAND_SCENE.handScene(threeScene);
    $HAND_SCENE.loadHand(
      () => {},
      () => {
        console.log('load');
      }
    );
  });
</script>

<div class="ThreeScene" bind:this={threeScene}></div>

<style>
  .ThreeScene {
    position: absolute;
  }
</style>
