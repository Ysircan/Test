/* Purpose: Text normalization helper for scoring answers in the static placement demo application. */

(function () {
  var demo = window.PlacementDemo = window.PlacementDemo || {};

  demo.scoring = demo.scoring || {};

  function normalizeText(text) {
    return String(text == null ? "" : text)
      .toLowerCase()
      .replace(/[â€™']/g, "")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  demo.scoring.normalizeText = normalizeText;
}());
