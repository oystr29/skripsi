import { writable } from 'svelte/store';

const video_width = 1280;
const video_height = 720;
const video_width_crop = Math.round(video_width / 1.6);

const has_allowed_webcam = writable(false);

const is_mobile = writable(false);

export { video_width, is_mobile };
