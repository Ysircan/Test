/* Purpose: Progress bar component for question progress in the static placement demo application. */

(function () {
  var demo = window.PlacementDemo = window.PlacementDemo || {};
  demo.components = demo.components || {};

  function renderProgressBar(progress) {
    var current;
    var total;
    var percent;

    if (!progress || !progress.total) {
      return "";
    }

    current = Math.max(0, Math.min(progress.current || 0, progress.total));
    total = Math.max(1, progress.total);
    percent = Math.round((current / total) * 100);

    return [
      "<div class=\"progress-bar\">",
      "  <div class=\"progress-bar__label\">",
      "    <span>Progress</span>",
      "    <strong>" + current + " / " + total + "</strong>",
      "  </div>",
      "  <div class=\"progress-bar__track\" aria-hidden=\"true\">",
      "    <div class=\"progress-bar__fill\" style=\"width:" + percent + "%;\"></div>",
      "  </div>",
      "</div>"
    ].join("");
  }

  function renderAssessmentProgress(progress) {
    var current;
    var total;
    var percent;

    if (!progress || !progress.total) {
      return "";
    }

    current = Math.max(0, Math.min(progress.current || 0, progress.total));
    total = Math.max(1, progress.total);
    percent = Math.max(0, Math.min(Math.round((current / total) * 100), 100));

    return [
      "<div class=\"assessment-progress\" aria-hidden=\"true\">",
      "  <div class=\"assessment-progress__track\">",
      "    <div class=\"assessment-progress__fill\" style=\"width:" + percent + "%;\"></div>",
      "  </div>",
      "</div>"
    ].join("");
  }

  demo.components.progressBar = {
    render: renderProgressBar,
    renderAssessmentProgress: renderAssessmentProgress
  };
}());
