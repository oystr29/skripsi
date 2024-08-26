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
export const VIDEO_SETUP = writable(false);
/** @type {import('svelte/store').Writable<HTMLDivElement | null>} */
export const USER_VIDEO_CONTAINER = writable(null);
export const HAS_ALLOWED_WEBCAM = writable(false);
export const VIDEO_WIDTH = writable(0);
export const VIDEO_HEIGHT = writable(0);

const global = {
  HAND_SCENE,
  IN_GAME,
  IS_MOBILE,
  LEFT_HAND_SELECTED,
  GAME_SETTINGS,
  VIDEO_SETUP,
  USER_VIDEO_CONTAINER,
  HAS_ALLOWED_WEBCAM,
  VIDEO_WIDTH,
  VIDEO_HEIGHT
};
export default global;
