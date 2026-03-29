/* Purpose: Source-like result metric card component for the restored static placement demo result screen. */

(function () {
  var demo = window.PlacementDemo = window.PlacementDemo || {};
  var helpers = demo.helpers || {};

  demo.components = demo.components || {};

  function getNumberToneClasses(numberTone) {
    if (numberTone === "orange") {
      return " orangeText result-metricNumber--orange result-orangeText";
    }

    return " redText result-metricNumber--red result-redText";
  }

  function getFillToneClasses(tone) {
    if (tone === "green") {
      return " fillGreen result-fill--green";
    }

    if (tone === "orange") {
      return " fillOrange result-fill--orange";
    }

    return " fillRed result-fill--red";
  }

  function renderBarRow(label, percent, tone) {
    return [
      "<div class=\"barRow result-barRow\">",
      "  <div class=\"grade result-grade\">",
      helpers.escapeHtml(label),
      "</div>",
      "  <div class=\"track result-track\">",
      "    <div class=\"fill result-fill",
      getFillToneClasses(tone),
      "\" style=\"width:",
      helpers.escapeAttribute(percent),
      "%;\"></div>",
      "  </div>",
      "  <div class=\"pct result-pct\">",
      helpers.escapeHtml(String(percent)),
      "%</div>",
      "</div>"
    ].join("");
  }

  function renderResultMetricCard(config) {
    var diagnosis = config && config.diagnosis ? config.diagnosis : {
      overallPercent: 0,
      title: "No diagnosis available",
      description: "No diagnosis available",
      aPercent: 0,
      bPercent: 0,
      cPercent: 0
    };

    return [
      "<div class=\"metricCard result-metricCard\">",
      "  <div class=\"metricTop result-metricTop\">",
      "    <div class=\"metricTitle result-metricTitle\">",
      helpers.escapeHtml(config && config.title ? config.title : "Metric"),
      "</div>",
      "    <div class=\"miniTag result-miniTag\">Scoring Index</div>",
      "  </div>",
      "  <div class=\"metricNumber result-metricNumber",
      getNumberToneClasses(config && config.numberTone ? config.numberTone : "red"),
      "\">",
      helpers.escapeHtml(String(diagnosis.overallPercent)),
      "</div>",
      "  <div class=\"metricStatus result-metricStatus\">",
      helpers.escapeHtml(diagnosis.title),
      "</div>",
      "  <div class=\"metricDesc result-metricDesc\">",
      helpers.escapeHtml(diagnosis.description),
      "</div>",
      "  <div class=\"divider result-divider\"></div>",
      "  <div class=\"barStack result-barStack\">",
      renderBarRow("A", diagnosis.aPercent || 0, config && config.aTone ? config.aTone : "green"),
      renderBarRow("B", diagnosis.bPercent || 0, config && config.bTone ? config.bTone : "orange"),
      renderBarRow("C", diagnosis.cPercent || 0, config && config.cTone ? config.cTone : "red"),
      "  </div>",
      "</div>"
    ].join("");
  }

  demo.components.statCard = {
    renderResultMetricCard: renderResultMetricCard
  };
}());
