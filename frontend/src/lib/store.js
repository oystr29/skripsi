import { writable } from 'svelte/store';

/** @type {import('svelte/store').Writable<import('@mediapipe/tasks-vision').HandLandmarker| undefined> }*/
export const handlandmarkerStore = writable(undefined);