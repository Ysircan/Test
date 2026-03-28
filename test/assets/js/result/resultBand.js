/* Purpose: Score-band projection helpers for the static placement demo application. */

(function () {
  var demo = window.PlacementDemo = window.PlacementDemo || {};

  function getScoreBand(score) {
    if (score < 15) return "Below 15";
    if (score < 30) return "15 - 30";
    if (score < 42) return "30 - 42";
    if (score < 50) return "42 - 50";
    if (score < 58) return "50 - 58";
    return "58+";
  }

  function getScoreBandLabel(scoreBand) {
    return scoreBand;
  }

  function getBandSummary(scoreBand) {
    switch (scoreBand) {
      case "Below 15":
        return "Diagnostic-entry level. Focus on core foundation before standard score-raising work.";
      case "15 - 30":
        return "Starter level. Build basic vocabulary, grammar, and simple comprehension stability.";
      case "30 - 42":
        return "Foundation-rebuild level. Strengthen core skills before heavier exam tactics.";
      case "42 - 50":
        return "Improvement level. Stabilize common question types and reduce avoidable mistakes.";
      case "50 - 58":
        return "Bridge level. Fix short boards and push into the mainstream target range.";
      default:
        return "Sprint level. Maintain stability and push for higher performance.";
    }
  }

  function getScoreProjection(score) {
    var scoreBand = getScoreBand(score);

    return {
      scoreBand: scoreBand,
      scoreBandLabel: getScoreBandLabel(scoreBand),
      summary: getBandSummary(scoreBand)
    };
  }

  demo.resultBand = {
    getScoreBand: getScoreBand,
    getScoreBandLabel: getScoreBandLabel,
    getScoreProjection: getScoreProjection
  };
}());
