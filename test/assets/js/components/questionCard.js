/* Purpose: Question card component for shared question layout in the static placement demo application. */

(function () {
  var demo = window.PlacementDemo = window.PlacementDemo || {};
  var helpers = demo.helpers;

  demo.components = demo.components || {};

  function renderQuestionCard(config) {
    var eyebrow = config && config.eyebrow ? config.eyebrow : "Real Flow Step";
    var title = config && config.title ? config.title : "Question";
    var progressHtml = demo.components.progressBar
      ? demo.components.progressBar.render(config ? config.progress : null)
      : "";
    var introHtml = config && config.introHtml ? "<div class=\"question-card__intro\">" + config.introHtml + "</div>" : "";
    var metaHtml = config && config.metaHtml ? "<div class=\"question-card__meta\">" + config.metaHtml + "</div>" : "";
    var answerHtml = config && config.answerHtml ? "<div class=\"question-card__answer\">" + config.answerHtml + "</div>" : "";
    var footerHtml = config && config.footerHtml ? "<div class=\"question-card__footer\">" + config.footerHtml + "</div>" : "";

    return [
      "<section class=\"demo-panel question-card\">",
      "  <div class=\"question-card__header\">",
      "    <p class=\"question-card__eyebrow\">" + helpers.escapeHtml(eyebrow) + "</p>",
      "    <h2 class=\"question-card__title\">" + helpers.escapeHtml(title) + "</h2>",
      progressHtml,
      "  </div>",
      "  <div class=\"question-card__body\">",
      introHtml,
      metaHtml,
      answerHtml,
      footerHtml,
      "  </div>",
      "</section>"
    ].join("");
  }

  function renderAssessmentQuestion(config) {
    var title = config && config.title ? config.title : "English Level Assessment";
    var subtitle = config && config.subtitle ? config.subtitle : "";
    var progressHtml = config && config.progressHtml ? config.progressHtml : "";
    var questionText = config && config.questionText ? config.questionText : "";
    var optionsHtml = config && config.optionsHtml ? config.optionsHtml : "";
    var footerHtml = config && config.footerHtml ? config.footerHtml : "";

    return [
      "<section class=\"vocab-question-screen\">",
      "  <div class=\"vocab-question-container\">",
      "    <div class=\"vocab-question-header\">",
      "      <div class=\"vocab-question-title\">" + helpers.escapeHtml(title) + "</div>",
      subtitle ? "      <div class=\"vocab-question-subtitle\">" + helpers.escapeHtml(subtitle) + "</div>" : "",
      "    </div>",
      progressHtml,
      "    <div class=\"vocab-question-prompt\">" + helpers.escapeHtml(questionText) + "</div>",
      optionsHtml,
      footerHtml,
      "  </div>",
      "</section>"
    ].join("");
  }

  demo.components.questionCard = {
    render: renderQuestionCard,
    renderAssessmentQuestion: renderAssessmentQuestion
  };
}());
