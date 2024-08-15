<script>
  import { onMount } from 'svelte';
  import { HAND_SCENE } from '$lib/global';
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
