/* Purpose: Section intro renderer and event binding for intro and completion steps in the static placement demo application. */

(function () {
  var demo = window.PlacementDemo = window.PlacementDemo || {};
  var helpers = demo.helpers || {
    escapeHtml: function (value) {
      return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }
  };
  demo.screens = demo.screens || {};
  var INTRO_BODY_CLASSES = [
    "is-vocab-intro-screen",
    "is-reading-intro-screen",
    "is-listening-intro-screen",
    "is-listening-complete-screen",
    "is-listening-screen",
    "is-listening-fill-screen",
    "is-hiw-screen",
    "is-wfd-screen",
    "is-reading-screen",
    "is-reading-blank-screen",
    "is-reading-choice-screen",
    "is-reading-reorder-screen"
  ];

  function getButtonLabel(step) {
    if (step === "vocabIntro") {
      return "Start Vocabulary";
    }

    if (step === "readingIntro") {
      return "Start Reading";
    }

    if (step === "listeningIntro") {
      return "Start Listening";
    }

    if (step === "listeningComplete") {
      return "View Result";
    }

    return "Continue";
  }

  function syncBodyClass(step) {
    if (!document.body) {
      return;
    }

    document.body.classList.remove(
      "is-start-screen",
      "is-pretest-screen",
      "is-vocab-question-screen",
      "drag-lock"
    );
    INTRO_BODY_CLASSES.forEach(function (className) {
      document.body.classList.remove(className);
    });

    if (step === "vocabIntro") {
      document.body.classList.add("is-vocab-intro-screen");
      return;
    }

    if (step === "readingIntro") {
      document.body.classList.add("is-reading-intro-screen");
      return;
    }

    if (step === "listeningIntro") {
      document.body.classList.add("is-listening-intro-screen");
      return;
    }

    if (step === "listeningComplete") {
      document.body.classList.add("is-listening-complete-screen");
    }
  }

  function renderRestoredSectionIntro(meta, step) {
    return [
      "<div class=\"reading-intro-screen\">",
      "  <div class=\"reading-intro-container\">",
      "    <div class=\"reading-intro-card\">",
      "      <div class=\"reading-intro-title\">",
      helpers.escapeHtml(meta.title),
      "</div>",
      "      <div class=\"reading-intro-desc\">",
      helpers.escapeHtml(meta.description),
      "</div>",
      "      <button class=\"reading-intro-btn\" type=\"button\" data-action=\"continue-section\">",
      helpers.escapeHtml(getButtonLabel(step)),
      "</button>",
      "    </div>",
      "  </div>",
      "</div>"
    ].join("");
  }

  function renderSectionIntroScreen(state) {
    var meta = demo.constants.STEP_META[state.step] || {
      title: state.step,
      description: "Continue the placement flow."
    };

    syncBodyClass(state.step);

    if (state.step === "readingIntro") {
      return renderRestoredSectionIntro(meta, state.step);
    }

    if (state.step === "vocabIntro" || state.step === "listeningIntro" || state.step === "listeningComplete") {
      return [
        "<div class=\"section-intro-screen\">",
        "  <div class=\"section-intro-container\">",
        "    <div class=\"section-intro-card\">",
        "      <div class=\"section-intro-title\">" + helpers.escapeHtml(meta.title) + "</div>",
        "      <div class=\"section-intro-desc\">" + helpers.escapeHtml(meta.description) + "</div>",
        "      <button class=\"section-intro-btn\" type=\"button\" data-action=\"continue-section\">" + helpers.escapeHtml(getButtonLabel(state.step)) + "</button>",
        "    </div>",
        "  </div>",
        "</div>"
      ].join("");
    }

    return [
      "<section class=\"demo-panel\" style=\"display:grid;gap:16px;\">",
      "  <div>",
      "    <p style=\"margin:0 0 8px;color:#2563eb;font-weight:700;\">Real Flow Step</p>",
      "    <h2 style=\"margin:0 0 8px;\">" + helpers.escapeHtml(meta.title) + "</h2>",
      "    <p style=\"margin:0;line-height:1.6;\">" + helpers.escapeHtml(meta.description) + "</p>",
      "  </div>",
      "  <div style=\"display:grid;gap:8px;\">",
      "    <p><strong>Selected exam:</strong> " + helpers.escapeHtml(state.selectedExam || "-") + "</p>",
      "    <p><strong>Current score:</strong> " + state.score + "</p>",
      "  </div>",
      "  <div style=\"display:flex;gap:12px;flex-wrap:wrap;\">",
      "    <button type=\"button\" data-action=\"continue-section\">" + getButtonLabel(state.step) + "</button>",
      "  </div>",
      "</section>"
    ].join("");
  }

  function bindSectionIntroScreen(root, state) {
    var button = root.querySelector("[data-action='continue-section']");

    if (!button) {
      return;
    }

    button.addEventListener("click", function () {
      if (document.body && state) {
        if (state.step === "vocabIntro") {
          document.body.classList.remove("is-vocab-intro-screen");
        }

        if (state.step === "readingIntro") {
          document.body.classList.remove("is-reading-intro-screen");
        }

        if (state.step === "listeningIntro") {
          document.body.classList.remove("is-listening-intro-screen");
        }

        if (state.step === "listeningComplete") {
          document.body.classList.remove("is-listening-complete-screen");
        }
      }

      demo.flow.advanceSectionIntro();
    });
  }

  demo.screens.sectionIntroScreen = {
    render: renderSectionIntroScreen,
    bind: bindSectionIntroScreen
  };
}());
