import { writable } from 'svelte/store';

/** @type {import('svelte/store').Writable<import('@mediapipe/tasks-vision').HandLandmarker| undefined> }*/
export const handlandmarkerStore = writable(undefined);

/** @type {import('svelte/store').Writable<string | undefined>} */
export const deviceIdStore = writable(undefined);

/** @type {import('svelte/store').Writable<string>} */
export const theme = writable('light');
