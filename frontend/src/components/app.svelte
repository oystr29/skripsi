<div id="App">
  <div id="ViewContainer">
    <div data-view="AboutView" data-path="about" class="view AboutView"></div>
  </div>
</div>

<style>
  #ViewContainer {
    display: none;
    top: 0;
    left: 0;
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .view {
    width: 100%;
  }

  .AboutView {
    position: absolute;
    height: 100%;
    color: #fff6df;
  }
</style>
