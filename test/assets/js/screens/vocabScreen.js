/* Purpose: Vocabulary question renderer and event binding for the static placement demo application. */

(function () {
  var demo = window.PlacementDemo = window.PlacementDemo || {};
  var helpers = demo.helpers;
  demo.screens = demo.screens || {};

  function ensureBodyClass() {
    if (!document.body) {
      return;
    }

    document.body.classList.remove("is-vocab-intro-screen");
    document.body.classList.add("is-vocab-question-screen");
  }

  function renderOption(option) {
    return [
      "<button type=\"button\" class=\"vocab-option\" data-option-id=\"" + helpers.escapeAttribute(option.id) + "\">",
      helpers.escapeHtml(helpers.getOptionText(option)),
      "</button>"
    ].join("");
  }

  function renderVocabScreen(state) {
    var item = demo.flow.getCurrentItem(state);
    var progress = demo.flow.getStepProgress(state);
    var optionsHtml;

    if (!item || !progress) {
      return demo.components.questionCard.render({
        title: "Vocabulary Question",
        introHtml: "<p>No vocabulary item is available. Continue the real flow order.</p>",
        footerHtml: demo.components.actionBar.render({
          primaryAction: "vocab-next",
          primaryLabel: "Continue"
        })
      });
    }

    optionsHtml = Array.isArray(item.options)
      ? item.options.map(renderOption).join("")
      : "";

    ensureBodyClass();

    return demo.components.questionCard.renderAssessmentQuestion({
      title: "English Level Assessment",
      subtitle: "第 " + progress.current + " 题，共 " + progress.total + " 题",
      progressHtml: demo.components.progressBar.renderAssessmentProgress(progress),
      questionText: item.prompt,
      optionsHtml: [
        "<div class=\"vocab-question-options\" role=\"listbox\" aria-label=\"Vocabulary options\">",
        optionsHtml,
        "</div>"
      ].join(""),
      footerHtml: [
        "<div class=\"vocab-question-cta\">",
        "  <button class=\"vocab-nextBtn\" type=\"button\" data-action=\"vocab-next\">Next</button>",
        "</div>"
      ].join("")
    });
  }

  function bindVocabScreen(root, state) {
    var item = demo.flow.getCurrentItem(state);
    var button = root.querySelector("[data-action='vocab-next']");
    var optionButtons = root.querySelectorAll("[data-option-id]");
    var selectedOptionId = "";

    function syncSelection() {
      var index;
      var optionId;

      for (index = 0; index < optionButtons.length; index += 1) {
        optionId = optionButtons[index].getAttribute("data-option-id") || "";
        optionButtons[index].classList.toggle("is-selected", optionId === selectedOptionId);
      }

    }

    if (!button) {
      return;
    }

    optionButtons.forEach(function (optionButton) {
      optionButton.addEventListener("click", function () {
        selectedOptionId = optionButton.getAttribute("data-option-id") || "";
        syncSelection();
      });
    });

    button.addEventListener("click", function () {
      if (document.body) {
        document.body.classList.remove("is-vocab-question-screen");
      }

      demo.flow.completeVocabularyQuestion({
        answer: {
          questionId: item ? item.id : "",
          selectedOptionId: selectedOptionId || null
        }
      });
    });

    syncSelection();
  }

  demo.screens.vocabScreen = {
    render: renderVocabScreen,
    bind: bindVocabScreen
  };
}());
