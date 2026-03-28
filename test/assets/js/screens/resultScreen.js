/* Purpose: Result screen renderer and event binding for the static placement demo application. */

(function () {
  var demo = window.PlacementDemo = window.PlacementDemo || {};
  var helpers = demo.helpers;
  demo.screens = demo.screens || {};

  function sumDistribution(distribution) {
    var scoring = demo.scoring && demo.scoring.calculateDifficultyStats;

    if (scoring && typeof scoring.sumDistribution === "function") {
      return scoring.sumDistribution(distribution);
    }

    return { correct: 0, total: 0 };
  }

  function getResultData(state) {
    var vocabulary = sumDistribution(state.difficultyStats);
    var reading = sumDistribution(state.readingStats);
    var listening = sumDistribution(state.listeningStats);
    var calculateRawScore = demo.scoring && demo.scoring.calculateRawScore;
    var rawScoreResult = calculateRawScore
      ? calculateRawScore(
          vocabulary.correct,
          vocabulary.total,
          reading.correct,
          reading.total,
          listening.correct,
          listening.total
        )
      : {
          rawScore: 0,
          sectionScores: {
            vocabulary: 0,
            reading: 0,
            listening: 0
          },
          sectionStats: {
            vocabulary: vocabulary,
            reading: reading,
            listening: listening
          }
        };
    var projection = demo.resultBand && demo.resultBand.getScoreProjection
      ? demo.resultBand.getScoreProjection(rawScoreResult.rawScore)
      : {
          scoreBandLabel: "-",
          summary: "Projection is unavailable."
        };
    var foundationDiagnosis = demo.resultDiagnosis && demo.resultDiagnosis.getSectionDiagnosis
      ? demo.resultDiagnosis.getSectionDiagnosis("foundation", state.difficultyStats)
      : null;
    var readingDiagnosis = demo.resultDiagnosis && demo.resultDiagnosis.getSectionDiagnosis
      ? demo.resultDiagnosis.getSectionDiagnosis("reading", state.readingStats)
      : null;
    var listeningDiagnosis = demo.resultDiagnosis && demo.resultDiagnosis.getSectionDiagnosis
      ? demo.resultDiagnosis.getSectionDiagnosis("listening", state.listeningStats)
      : null;

    return {
      rawScoreResult: rawScoreResult,
      projection: projection,
      diagnoses: [foundationDiagnosis, readingDiagnosis, listeningDiagnosis]
    };
  }

  function renderSectionSummary(label, stats, percent) {
    return [
      "<div style=\"padding:16px;border:1px solid #e5e7eb;border-radius:14px;display:grid;gap:6px;background:#f8fafc;\">",
      "  <strong>" + helpers.escapeHtml(label) + "</strong>",
      "  <span>Correct: " + helpers.escapeHtml(String(stats.correct)) + " / " + helpers.escapeHtml(String(stats.total)) + "</span>",
      "  <span>Section Score: " + helpers.escapeHtml(String(percent)) + "%</span>",
      "</div>"
    ].join("");
  }

  function renderDifficultyBlock(label, stats) {
    return [
      "<div style=\"padding:12px;border:1px solid #e5e7eb;border-radius:12px;display:grid;gap:6px;\">",
      "  <strong>" + helpers.escapeHtml(label) + "</strong>",
      "  <span>A: " + stats.A.correct + " / " + stats.A.total + "</span>",
      "  <span>B: " + stats.B.correct + " / " + stats.B.total + "</span>",
      "  <span>C: " + stats.C.correct + " / " + stats.C.total + "</span>",
      "</div>"
    ].join("");
  }

  function renderDiagnosisCard(diagnosis) {
    if (!diagnosis) {
      return "";
    }

    return [
      "<div style=\"padding:16px;border:1px solid #e5e7eb;border-radius:14px;display:grid;gap:8px;background:#ffffff;\">",
      "  <strong>" + helpers.escapeHtml(diagnosis.title) + "</strong>",
      "  <span>Overall: " + helpers.escapeHtml(String(diagnosis.overallPercent)) + "%</span>",
      "  <span>A/B/C: " +
        helpers.escapeHtml(String(diagnosis.aPercent)) + "% / " +
        helpers.escapeHtml(String(diagnosis.bPercent)) + "% / " +
        helpers.escapeHtml(String(diagnosis.cPercent)) + "%</span>",
      "  <p style=\"margin:0;line-height:1.6;\">" + helpers.escapeHtml(diagnosis.description) + "</p>",
      "  <p style=\"margin:0;line-height:1.6;color:#475569;\"><strong>Suggestion:</strong> " + helpers.escapeHtml(diagnosis.suggestion) + "</p>",
      "</div>"
    ].join("");
  }

  function renderResultScreen(state) {
    var resultData = getResultData(state);
    var rawScoreResult = resultData.rawScoreResult;
    var projection = resultData.projection;

    return [
      "<section class=\"demo-panel\" style=\"display:grid;gap:20px;\">",
      "  <div>",
      "    <p style=\"margin:0 0 8px;color:#2563eb;font-weight:700;\">Real Flow Step</p>",
      "    <h2 style=\"margin:0 0 8px;\">Result</h2>",
      "    <p style=\"margin:0;line-height:1.6;\">This result now uses real section totals and the shared raw-score calculation.</p>",
      "  </div>",
      "  <div style=\"display:grid;gap:8px;\">",
      "    <p><strong>Student:</strong> " + helpers.escapeHtml(state.studentName || "-") + "</p>",
      "    <p><strong>Exam:</strong> " + helpers.escapeHtml(state.selectedExam || "-") + "</p>",
      "    <p><strong>Target score:</strong> " + helpers.escapeHtml(state.targetScore || "-") + "</p>",
      "    <p><strong>Projected score:</strong> " + helpers.escapeHtml(String(rawScoreResult.rawScore)) + "</p>",
      "    <p><strong>Score band:</strong> " + helpers.escapeHtml(projection.scoreBandLabel || "-") + "</p>",
      "    <p><strong>Band summary:</strong> " + helpers.escapeHtml(projection.summary || "-") + "</p>",
      "  </div>",
      "  <div style=\"display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;\">",
      renderSectionSummary("Vocabulary", rawScoreResult.sectionStats.vocabulary, rawScoreResult.sectionScores.vocabulary),
      renderSectionSummary("Reading", rawScoreResult.sectionStats.reading, rawScoreResult.sectionScores.reading),
      renderSectionSummary("Listening", rawScoreResult.sectionStats.listening, rawScoreResult.sectionScores.listening),
      "  </div>",
      "  <div style=\"display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;\">",
      renderDifficultyBlock("Vocabulary Difficulty", state.difficultyStats),
      renderDifficultyBlock("Reading Difficulty", state.readingStats),
      renderDifficultyBlock("Listening Difficulty", state.listeningStats),
      "  </div>",
      "  <div style=\"display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;\">",
      resultData.diagnoses.map(renderDiagnosisCard).join(""),
      "  </div>",
      "  <div style=\"display:flex;gap:12px;flex-wrap:wrap;\">",
      "    <button type=\"button\" data-action=\"restart-flow\">Restart</button>",
      "  </div>",
      "</section>"
    ].join("");
  }

  function bindResultScreen(root) {
    var button = root.querySelector("[data-action='restart-flow']");

    if (!button) {
      return;
    }

    button.addEventListener("click", function () {
      demo.flow.restartAssessment();
    });
  }

  demo.screens.resultScreen = {
    render: renderResultScreen,
    bind: bindResultScreen
  };
}());
