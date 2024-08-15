import { writable } from 'svelte/store';
import * as THREE from 'three';

export const IS_MOBILE = writable(false);

/** @type {import('svelte/store').Writable<import('$lib/handscene')>} */
export const HAND_SCENE = writable();
export const IN_GAME = writable(false);
export const LEFT_HAND_SELECTED = writable(false);
export const GAME_SETTINGS = {
  timeToAcceptHandPose: 0.5,
  handSpellSlowdown: 1,
  letters: null,
  words: null
};

const global = { HAND_SCENE, IN_GAME, IS_MOBILE, LEFT_HAND_SELECTED, GAME_SETTINGS };
export default global;
