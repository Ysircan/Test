/* Purpose: WFD grading helper for word-level dictation scoring in the static placement demo application. */

(function () {
  var demo = window.PlacementDemo = window.PlacementDemo || {};

  demo.scoring = demo.scoring || {};

  function gradeWFD(expectedText, userText) {
    var normalizeText = demo.scoring.normalizeText || function (value) {
      return String(value == null ? "" : value).trim().toLowerCase();
    };
    var expectedWords = normalizeText(expectedText).split(/\s+/).filter(Boolean);
    var userWords = normalizeText(userText).split(/\s+/).filter(Boolean);
    var remaining = {};
    var correct = 0;

    userWords.forEach(function (word) {
      remaining[word] = (remaining[word] || 0) + 1;
    });

    expectedWords.forEach(function (word) {
      if (remaining[word] > 0) {
        correct += 1;
        remaining[word] -= 1;
      }
    });

    return {
      correct: correct,
      total: expectedWords.length
    };
  }

  demo.scoring.gradeWFD = gradeWFD;
}());
