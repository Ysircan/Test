/* Purpose: Central renderer that maps real flow steps to screen renderers in the static placement demo application. */

(function () {
  var demo = window.PlacementDemo = window.PlacementDemo || {};

  function renderApp() {
    var root = document.getElementById("app");
    var state;
    var html = "";

    if (!root || !demo.state || !demo.screens) {
      return;
    }

    state = demo.state.getState();

    if (demo.helpers && typeof demo.helpers.setScaffoldPassthrough === "function") {
      demo.helpers.setScaffoldPassthrough(state.step === "result");
    }

    if (state.step === "start") {
      html = demo.screens.startScreen.render(state);
      root.innerHTML = html;
      demo.screens.startScreen.bind(root, state);
      return;
    }

    if (state.step === "preTestIntro") {
      html = demo.screens.preTestScreen.render(state);
      root.innerHTML = html;
      demo.screens.preTestScreen.bind(root, state);
      return;
    }

    if (
      state.step === "vocabIntro" ||
      state.step === "readingIntro" ||
      state.step === "listeningIntro" ||
      state.step === "listeningComplete"
    ) {
      html = demo.screens.sectionIntroScreen.render(state);
      root.innerHTML = html;
      demo.screens.sectionIntroScreen.bind(root, state);
      return;
    }

    if (state.step === "vocabQuestion") {
      html = demo.screens.vocabScreen.render(state);
      root.innerHTML = html;
      demo.screens.vocabScreen.bind(root, state);
      return;
    }

    if (
      state.step === "readingQuestion" ||
      state.step === "readingReorderQuestion" ||
      state.step === "readingSingleQuestion"
    ) {
      html = demo.screens.readingScreen.render(state);
      root.innerHTML = html;
      demo.screens.readingScreen.bind(root, state);
      return;
    }

    if (
      state.step === "listeningQuestion" ||
      state.step === "hiwQuestion" ||
      state.step === "wfdQuestion"
    ) {
      html = demo.screens.listeningScreen.render(state);
      root.innerHTML = html;
      demo.screens.listeningScreen.bind(root, state);
      return;
    }

    if (state.step === "result") {
      html = demo.screens.resultScreen.render(state);
      root.innerHTML = html;
      demo.screens.resultScreen.bind(root, state);
      return;
    }

    root.innerHTML = [
      "<section class=\"demo-panel\">",
      "  <h2>Unknown Step</h2>",
      "  <p>The current step could not be rendered.</p>",
      "</section>"
    ].join("");
  }

  demo.render = {
    renderApp: renderApp
  };
}());
