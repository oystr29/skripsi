import global from './global';

/** @type {boolean}*/
let video_setup;

/** @type {HTMLDivElement | null}*/
let user_video_containter;

let has_allowed_webcam = false;

let is_mobile = false;

let video_width = 0;
let video_height = 0;

global.VIDEO_SETUP.subscribe((v) => {
  video_setup = v;
});

global.USER_VIDEO_CONTAINER.subscribe((v) => {
  user_video_containter = v;
});

global.HAS_ALLOWED_WEBCAM.subscribe((v) => {
  has_allowed_webcam = v;
});

global.IS_MOBILE.subscribe((v) => {
  is_mobile = v;
});

global.VIDEO_WIDTH.subscribe((v) => {
  video_width = v;
});

global.VIDEO_HEIGHT.subscribe((v) => {
  video_height = v;
});

export class SetupVideo {
  /** @private
   * @type {HTMLVideoElement | null}*/
  _userFeedVideo;

  /** @private
   * @type {HTMLDivElement | null}*/
  _videoContainer;

  /** @private
   * @type {Function | undefined}*/
  _successCallback;

  constructor() {
    video_setup = true;
    this._userFeedVideo = document.querySelector('#userFeedVideo');
    this._videoContainer = document.querySelector('#videoContainer');
    user_video_containter = this._videoContainer;
  }

  /** @public
   * @param {Function} successCallback */
  requestCameraAccess(successCallback) {
    this._successCallback = successCallback;

    const video = this._userFeedVideo;
    this._userFeedVideo?.addEventListener('loadeddata', () => {
      has_allowed_webcam = true;
      if (this._videoContainer) this._videoContainer.style.display = 'none';

      this._successCallback?.();
    });

    /** @type {MediaTrackConstraints} */
    let options = {
      facingMode: 'user',
      width: { ideal: 1280 },
      height: { ideal: 720 }
    };

    if (is_mobile) {
      options = {
        facingMode: 'user',
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      };
    }

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: options
        })
        .then((stream) => {
          if (video) {
            video.srcObject = stream;
            video.onloadedmetadata = function () {
              // @ts-ignore
              video.width = this.videoWidth;
              // @ts-ignore
              video.height = this.videoHeight;
              video_width = video.width;
              video_height = video.height;
            };

            let promise = video.play();

            if (promise) {
              promise.then(() => {}).catch((e) => console.log(e));
            }
          }
        })
        .catch((e) => console.log(e));
    }
  }

  /** @public*/
  getVideoFeed() {
    return this._userFeedVideo;
  }
}
