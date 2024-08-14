<div id="videoContainer">
  <div id="userFeedContainer">
    <video id="userFeedVideo">
      <track kind="captions" />
    </video>
  </div>
</div>

<style>
  #videoContainer {
    pointer-events: none;
    position: absolute;
    width: 100%;
    height: 100%;
  }
  #videoContainer #userFeedContainer {
    top: 0px;
    position: absolute;
    visibility: hidden;
  }

  #videoContainer video {
    width: 100vw;
    height: 100vh;
  }
</style>
