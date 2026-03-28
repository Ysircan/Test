/* Purpose: Action bar component for primary question actions in the static placement demo application. */

(function () {
  var demo = window.PlacementDemo = window.PlacementDemo || {};
  var helpers = demo.helpers;

  demo.components = demo.components || {};

  function renderActionBar(config) {
    var noteHtml = config && config.noteHtml ? "<div class=\"action-bar__note\">" + config.noteHtml + "</div>" : "";
    var buttonLabel = config && config.primaryLabel ? config.primaryLabel : "Next";
    var action = config && config.primaryAction ? config.primaryAction : "primary-action";
    var disabled = config && config.primaryDisabled ? " disabled" : "";

    return [
      "<div class=\"action-bar\">",
      noteHtml,
      "  <button type=\"button\" class=\"action-bar__button\" data-action=\"" + helpers.escapeAttribute(action) + "\"" + disabled + ">",
      "    " + helpers.escapeHtml(buttonLabel),
      "  </button>",
      "</div>"
    ].join("");
  }

  demo.components.actionBar = {
    render: renderActionBar
  };
}());
