/* Purpose: Browser bootstrap for the static placement demo application. */

(function () {
  var demo = window.PlacementDemo = window.PlacementDemo || {};
  var hasStarted = false;

  function init() {
    var restoredState;

    if (hasStarted || !demo.state || !demo.render || !demo.storage) {
      return;
    }

    hasStarted = true;

    demo.state.subscribe(function (nextState) {
      demo.storage.saveProgress(nextState);
      demo.render.renderApp();
    });

    restoredState = demo.storage.loadProgress();

    if (restoredState) {
      demo.state.replaceState(restoredState);
    } else {
      demo.state.replaceState(demo.state.createInitialState());
    }
  }

  demo.app = {
    init: init
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}());
