import { writable } from 'svelte/store';
import * as THREE from 'three';

export const is_mobile = writable(false);
export const left_hand_selected = false;

/** @type {import('svelte/store').Writable<import('$lib/handscene')>} */
export const HAND_SCENE = writable();

const global = { HAND_SCENE, is_mobile, left_hand_selected };
export default global;
