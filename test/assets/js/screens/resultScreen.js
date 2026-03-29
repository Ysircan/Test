/* Purpose: Source-composed result dashboard renderer for the static placement demo application. */

(function () {
  var demo = window.PlacementDemo = window.PlacementDemo || {};
  var helpers = demo.helpers || {};

  demo.screens = demo.screens || {};

  var RESULT_BODY_CLASSES = [
    "is-start-screen",
    "is-pretest-screen",
    "is-vocab-intro-screen",
    "is-vocab-question-screen",
    "is-reading-intro-screen",
    "is-reading-screen",
    "is-reading-blank-screen",
    "is-reading-choice-screen",
    "is-reading-reorder-screen",
    "is-listening-intro-screen",
    "is-listening-complete-screen",
    "is-listening-screen",
    "is-listening-fill-screen",
    "is-hiw-screen",
    "is-wfd-screen",
    "is-result-screen"
  ];

  function syncResultBodyClass() {
    if (!document.body) {
      return;
    }

    RESULT_BODY_CLASSES.forEach(function (className) {
      document.body.classList.remove(className);
    });

    document.body.classList.remove("drag-lock");
    document.body.classList.add("is-result-screen");

    if (helpers && typeof helpers.setScaffoldPassthrough === "function") {
      helpers.setScaffoldPassthrough(true);
    }
  }

  function clearResultBodyClass() {
    if (!document.body) {
      return;
    }

    document.body.classList.remove("is-result-screen", "drag-lock");

    if (helpers && typeof helpers.setScaffoldPassthrough === "function") {
      helpers.setScaffoldPassthrough(false);
    }
  }

  function sumDistribution(distribution) {
    var scoring = demo.scoring && demo.scoring.calculateDifficultyStats;

    if (scoring && typeof scoring.sumDistribution === "function") {
      return scoring.sumDistribution(distribution);
    }

    return { correct: 0, total: 0 };
  }

  function getCourseRecommendation(scoreBand) {
    switch (scoreBand) {
      case "Below 15":
        return {
          theme: "D",
          className: "诊断班",
          duration: "1-2 周入门诊断",
          subLabel: "先诊断 · 再分班",
          intro: "适合当前答题结果低、存在猜题成分。该成绩暂时不适合直接进入常规提分班，更需要先做基础诊断与学习衔接。",
          feature1: "先排查词汇、基础语法、阅读理解和听辨能力，快速判断学生当前最核心的短板在哪里。",
          feature2: "建议先进行短期诊断与入门训练，再根据实际表现决定进入基础班或专项辅导。"
        };
      case "15 - 30":
        return {
          theme: "D",
          className: "入门班",
          duration: "8-10 周入门课",
          subLabel: "先建立最基础能力",
          intro: "适合有少量基础、但整体能力非常薄弱的学生。这个阶段重点不是冲分，而是先把最基础的做题能力和理解能力建立起来。",
          feature1: "课程会从高频基础词汇、核心语法、句子理解和基础听力识别开始，帮助学生先听懂、读懂、做对基础题。",
          feature2: "配套更细的练习节奏和阶段跟进，帮助学生先脱离乱做、乱猜状态，再逐步进入标准提分路径。"
        };
      case "30 - 42":
        return {
          theme: "A",
          className: "基础班",
          duration: "8 周体系课",
          subLabel: "基础重建 · 稳步补强",
          intro: "适合基础薄弱、三科整体不稳的学生，先把底层能力补起来，再进入更高档位训练。",
          feature1: "从高频词汇、基础语法、听力识别入手，优先修正最容易拖分的核心问题。",
          feature2: "课程节奏更稳，配套阶段练习与老师跟进，帮助学生建立持续做题能力与正确习惯。"
        };
      case "42 - 50":
        return {
          theme: "B",
          className: "提升班",
          duration: "6-8 周强化课",
          subLabel: "稳基础 · 过线提升",
          intro: "适合已有一定基础、接近 50 但表现还不稳定的学生，重点是把分数先稳住。",
          feature1: "围绕高频题型、做题结构和输出稳定性展开训练，减少忽高忽低的情况。",
          feature2: "课程会同时补基础与控节奏，帮助学生把已有能力真正转化为更稳定的分数表现。"
        };
      case "50 - 58":
        return {
          theme: "B",
          className: "桥梁班",
          duration: "6 周进阶课",
          subLabel: "补短板 · 冲主流分",
          intro: "适合已经具备一定过线潜力、但还需要继续补短板和提升稳定性的学生。",
          feature1: "重点处理拉分板块，强化题型策略、时间控制与中高分段作答稳定度。",
          feature2: "通过专项训练与阶段模考，把原本接近目标的学生往更高区间继续推进。"
        };
      default:
        return {
          theme: "C",
          className: "冲刺班",
          duration: "4-6 周冲刺课",
          subLabel: "冲高分 · 提速提稳",
          intro: "适合基础已成型的学生，主要目标不是重补基础，而是进一步提速、提稳、冲高分。",
          feature1: "课程聚焦高频失分点、答题效率与临场稳定性，帮助学生把能力发挥得更完整。",
          feature2: "更强调模考节奏、错题精修与冲刺策略，适合已经进入高分段的学生继续突破。"
        };
    }
  }

  function getScoreBandLabel(scoreBand) {
    switch (scoreBand) {
      case "Below 15":
        return "15分以下";
      case "15 - 30":
        return "15-30分";
      case "30 - 42":
        return "30-42分";
      case "42 - 50":
        return "42-50分";
      case "50 - 58":
        return "50-58分";
      default:
        return "58分以上";
    }
  }

  function getGapDisplay(targetScore, score) {
    var bandRange = helpers && typeof helpers.getBandRangeFromScore === "function"
      ? helpers.getBandRangeFromScore(score)
      : { min: 58, max: null };

    if (!targetScore) {
      return "\u672a\u8ba1\u7b97";
    }

    if (bandRange.max === null) {
      return targetScore <= bandRange.min
        ? "0\u5206"
        : "\u5dee" + (targetScore - bandRange.min) + "\u5206\u4ee5\u4e0a";
    }

    if (targetScore <= bandRange.min) {
      return "0\u5206";
    }

    if (targetScore <= bandRange.max) {
      return "\u5dee0-" + (targetScore - bandRange.min) + "\u5206";
    }

    return "\u5dee" + (targetScore - bandRange.max) + "-" + (targetScore - bandRange.min) + "\u5206";
  }

  function getShortTermSuggestion(targetScore, score) {
    var rawGap;

    if (!targetScore) {
      return "\u5f85\u786e\u8ba4\u76ee\u6807";
    }

    rawGap = targetScore - score;

    if (rawGap <= 10) {
      return "\u53ef\u51b2\u76ee\u6807";
    }

    if (rawGap <= 15) {
      return "\u6709\u673a\u4f1a\u63a5\u8fd1";
    }

    if (rawGap <= 20) {
      return "\u5148\u63d0\u4e00\u6863";
    }

    return "\u5206\u9636\u6bb5\u63d0\u5347";
  }

  function getStatusClassName(status) {
    if (status === "success") {
      return "submitStatusSuccess";
    }

    if (status === "error") {
      return "submitStatusError";
    }

    if (status === "submitting") {
      return "submitStatusLoading";
    }

    return "";
  }

  function getNumberToneClassName(numberTone) {
    return numberTone === "orange" ? "orangeText" : "redText";
  }

  function getFillToneClassName(tone) {
    if (tone === "green") {
      return "fillGreen";
    }

    if (tone === "orange") {
      return "fillOrange";
    }

    return "fillRed";
  }

  function renderTopbar(data) {
    return [
      "<header class=\"topbar\">",
      "  <div class=\"topLeft\">",
      "    <div class=\"brand\">\u6d4b\u8bc4\u7ed3\u679c\u603b\u89c8</div>",
      "  </div>",
      "  <div class=\"topRight\">",
      "    <div class=\"pill\">\u5b66\u751f\uff1a",
      helpers.escapeHtml(data.studentName),
      "</div>",
      "    <div class=\"pill\">\u65e5\u671f\uff1a",
      helpers.escapeHtml(data.testDate),
      "</div>",
      "  </div>",
      "</header>"
    ].join("");
  }

  function renderHero(data) {
    return [
      "<div class=\"hero\">",
      "  <div class=\"heroMain\">",
      "    <div class=\"heroText\">",
      "      <h1>\u80fd\u529b\u5206\u6790\u4e0e\u77ed\u671f\u63d0\u5347\u8bc4\u4f30</h1>",
      "    </div>",
      "    <div class=\"heroHighlight\">",
      "      <div class=\"heroHighlightText\">",
      "        <div class=\"heroHighlightKicker\">\u77ed\u671f\u51b2\u5206\u5efa\u8bae</div>",
      "        <div class=\"heroHighlightSub\">\u7ed3\u5408\u5f53\u524d\u8868\u73b0\u4e0e\u76ee\u6807\u5dee\u8ddd\uff0c\u77ed\u671f\u5185\u66f4\u73b0\u5b9e\u7684\u63d0\u5347\u65b9\u5411</div>",
      "      </div>",
      "      <div class=\"heroHighlightValue\">",
      helpers.escapeHtml(data.shortTermSuggestion),
      "</div>",
      "    </div>",
      "  </div>",
      "</div>"
    ].join("");
  }

  function renderProjectionCard(data) {
    return [
      "<div class=\"panelCard\">",
      "  <div class=\"sectionKicker\">\u6d4b\u8bc4\u7ed3\u679c\u6295\u5c04</div>",
      "  <div class=\"scoreGrid\">",
      "    <div class=\"scoreRow\">",
      "      <div class=\"scoreBox\">",
      helpers.escapeHtml(data.scoreBandLabel),
      "</div>",
      "      <div class=\"scoreMeta\">",
      "        <h4>\u5f53\u524d\u9884\u4f30\u8868\u73b0</h4>",
      "        <p>\u57fa\u4e8e\u672c\u6b21\u6d4b\u8bc4\u7b54\u9898\u8868\u73b0\u6620\u5c04\u5f97\u5230\u7684\u5f53\u524d\u5206\u6570\u533a\u95f4\u53c2\u8003\u3002</p>",
      "      </div>",
      "    </div>",
      "    <div class=\"scoreRow\">",
      "      <div class=\"scoreBox\">",
      helpers.escapeHtml(data.targetScoreDisplay),
      "</div>",
      "      <div class=\"scoreMeta\">",
      "        <h4>\u76ee\u6807\u5206\u6570</h4>",
      "        <p>\u5b66\u751f\u5f53\u524d\u5e0c\u671b\u8fbe\u5230\u7684\u76ee\u6807\u5206\uff0c\u7528\u4e8e\u5224\u65ad\u63d0\u5347\u7a7a\u95f4\u3002</p>",
      "      </div>",
      "    </div>",
      "    <div class=\"scoreRow scoreRowTight\">",
      "      <div class=\"scoreBox scoreBoxGap redText\">",
      helpers.escapeHtml(data.gapDisplay),
      "</div>",
      "      <div class=\"scoreMeta\">",
      "        <h4>\u76ee\u6807\u5dee\u8ddd</h4>",
      "        <p>\u76ee\u6807\u5206\u6570\u4e0e\u5f53\u524d\u9884\u4f30\u533a\u95f4\u4e4b\u95f4\u7684\u53c2\u8003\u5dee\u8ddd\u3002</p>",
      "      </div>",
      "    </div>",
      "  </div>",
      "</div>"
    ].join("");
  }

  function renderCourseRecommendationCard(data) {
    var theme = String((data && data.theme) || "A").toUpperCase();
    var themeClass = "course" + theme;

    return [
      "<div class=\"panelCard\">",
      "  <div class=\"sectionKicker\">\u63a8\u8350\u73ed\u7ea7\u65b9\u6848</div>",
      "  <div class=\"courseCard ",
      helpers.escapeAttribute(themeClass),
      "\">",
      "    <div class=\"courseHeader\">",
      "      <div class=\"courseHeaderMain\">",
      "        <h3 class=\"courseName\">",
      helpers.escapeHtml(data.className),
      "</h3>",
      "        <p class=\"courseSubtitle\">",
      helpers.escapeHtml(data.subLabel),
      "</p>",
      "      </div>",
      "      <div class=\"courseMeta\">",
      helpers.escapeHtml(data.duration),
      "</div>",
      "    </div>",
      "    <div class=\"courseDivider\"></div>",
      "    <div class=\"courseSection\">",
      "      <div class=\"courseSectionLabel\">\u73ed\u7ea7\u5b9a\u4f4d</div>",
      "      <p class=\"courseText\">",
      helpers.escapeHtml(data.intro),
      "</p>",
      "    </div>",
      "    <div class=\"courseSection\">",
      "      <div class=\"courseSectionLabel\">\u8bfe\u7a0b\u7279\u70b9</div>",
      "      <div class=\"courseFeatures\">",
      "        <div class=\"courseFeature\">",
      helpers.escapeHtml(data.feature1),
      "</div>",
      "        <div class=\"courseFeature\">",
      helpers.escapeHtml(data.feature2),
      "</div>",
      "      </div>",
      "    </div>",
      "  </div>",
      "</div>"
    ].join("");
  }

  function renderActionCard(data) {
    var statusClassName = getStatusClassName(data.submissionStatus);
    var statusHtml = "";
    var retryHtml = "";

    if (data.submissionMessage && data.submissionStatus !== "idle") {
      statusHtml = [
        "<div class=\"submitStatus",
        statusClassName ? " " + statusClassName : "",
        "\">",
        helpers.escapeHtml(data.submissionMessage),
        "</div>"
      ].join("");
    }

    if (data.canRetry) {
      retryHtml = "<button class=\"ctaSecondary\" type=\"button\" data-action=\"retry-result-submit\">\u91cd\u65b0\u63d0\u4ea4\u7ed3\u679c</button>";
    }

    return [
      "<div class=\"ctaWrap\">",
      "  <div class=\"ctaNote\">\u63a8\u8350\u4e0b\u4e00\u6b65</div>",
      statusHtml,
      retryHtml,
      "  <button class=\"cta\" type=\"button\" data-action=\"restart-flow\"",
      data.submissionStatus === "submitting" ? " disabled" : "",
      ">\u91cd\u65b0\u6d4b\u8bc4</button>",
      "</div>"
    ].join("");
  }

  function renderBarRow(label, percent, tone) {
    return [
      "<div class=\"barRow\">",
      "  <div class=\"grade\">",
      helpers.escapeHtml(label),
      "</div>",
      "  <div class=\"track\">",
      "    <div class=\"fill ",
      getFillToneClassName(tone),
      "\" style=\"width:",
      helpers.escapeAttribute(percent),
      "%;\"></div>",
      "  </div>",
      "  <div class=\"pct\">",
      helpers.escapeHtml(String(percent)),
      "%</div>",
      "</div>"
    ].join("");
  }

  function renderMetricCard(config) {
    var diagnosis = config && config.diagnosis ? config.diagnosis : {
      overallPercent: 0,
      title: "No diagnosis available",
      description: "No diagnosis available",
      aPercent: 0,
      bPercent: 0,
      cPercent: 0
    };

    return [
      "<div class=\"metricCard\">",
      "  <div class=\"metricTop\">",
      "    <div class=\"metricTitle\">",
      helpers.escapeHtml(config && config.title ? config.title : "Metric"),
      "</div>",
      "    <div class=\"miniTag\">\u8bc4\u5206\u6307\u6570</div>",
      "  </div>",
      "  <div class=\"metricNumber ",
      getNumberToneClassName(config && config.numberTone ? config.numberTone : "red"),
      "\">",
      helpers.escapeHtml(String(diagnosis.overallPercent)),
      "</div>",
      "  <div class=\"metricStatus\">",
      helpers.escapeHtml(diagnosis.title),
      "</div>",
      "  <div class=\"metricDesc\">",
      helpers.escapeHtml(diagnosis.description),
      "</div>",
      "  <div class=\"divider\"></div>",
      "  <div class=\"barStack\">",
      renderBarRow("A", diagnosis.aPercent || 0, config && config.aTone ? config.aTone : "green"),
      renderBarRow("B", diagnosis.bPercent || 0, config && config.bTone ? config.bTone : "orange"),
      renderBarRow("C", diagnosis.cPercent || 0, config && config.cTone ? config.cTone : "red"),
      "  </div>",
      "</div>"
    ].join("");
  }

  function buildResultData(state) {
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
          }
        };
    var projection = demo.resultBand && typeof demo.resultBand.getScoreProjection === "function"
      ? demo.resultBand.getScoreProjection(rawScoreResult.rawScore)
      : null;
    var scoreBand = projection && projection.scoreBand
      ? projection.scoreBand
      : demo.resultBand && typeof demo.resultBand.getScoreBand === "function"
        ? demo.resultBand.getScoreBand(rawScoreResult.rawScore)
        : "Below 15";
    var scoreBandLabel = getScoreBandLabel(scoreBand);
    var courseRecommendation = projection && projection.courseRecommendation
      ? projection.courseRecommendation
      : getCourseRecommendation(scoreBand);
    var getDiagnosis = demo.resultDiagnosis && demo.resultDiagnosis.getSectionDiagnosis;
    var foundationDiagnosis = getDiagnosis
      ? getDiagnosis("foundation", state.difficultyStats)
      : null;
    var readingDiagnosis = getDiagnosis
      ? getDiagnosis("reading", state.readingStats)
      : null;
    var listeningDiagnosis = getDiagnosis
      ? getDiagnosis("listening", state.listeningStats)
      : null;
    var numericTarget = Number(state.targetScore);
    var hasTarget = isFinite(numericTarget) && numericTarget > 0;
    var targetScoreValue = hasTarget ? numericTarget : null;
    var testDate = helpers && typeof helpers.formatCalendarDate === "function"
      ? helpers.formatCalendarDate(new Date())
      : "";

    return {
      studentName: state.studentName || "\u672a\u586b\u5199",
      testDate: testDate || "\u672a\u586b\u5199",
      targetScoreDisplay: hasTarget ? String(numericTarget) : "\u672a\u586b\u5199",
      scoreBandLabel: scoreBandLabel || "-",
      gapDisplay: getGapDisplay(targetScoreValue, rawScoreResult.rawScore),
      shortTermSuggestion: getShortTermSuggestion(targetScoreValue, rawScoreResult.rawScore),
      courseRecommendation: courseRecommendation,
      foundationDiagnosis: foundationDiagnosis,
      readingDiagnosis: readingDiagnosis,
      listeningDiagnosis: listeningDiagnosis,
      submissionStatus: state.resultSubmissionStatus || "idle",
      submissionMessage: state.resultSubmissionMessage || "",
      canRetry: state.resultSubmissionStatus === "error" && typeof demo.flow.retryResultSubmission === "function"
    };
  }

  function renderResultScreen(state) {
    var data = buildResultData(state);

    syncResultBodyClass();

    return [
      "<div class=\"shell result-screen\">",
      renderTopbar(data),
      "  <div class=\"main\">",
      "    <aside class=\"sidebar\">",
      "      <div class=\"stack\">",
      renderProjectionCard(data),
      renderCourseRecommendationCard(data.courseRecommendation),
      renderActionCard(data),
      "      </div>",
      "    </aside>",
      "    <section class=\"content\">",
      renderHero(data),
      "      <div class=\"metricGrid\">",
      renderMetricCard({
        title: "\u57fa\u7840\u7a33\u5b9a\u5ea6",
        diagnosis: data.foundationDiagnosis,
        numberTone: "orange",
        aTone: "green",
        bTone: "orange",
        cTone: "orange"
      }),
      renderMetricCard({
        title: "\u9605\u8bfb\u5904\u7406",
        diagnosis: data.readingDiagnosis,
        numberTone: "red",
        aTone: "green",
        bTone: "red",
        cTone: "orange"
      }),
      renderMetricCard({
        title: "\u542c\u529b\u8bc6\u522b",
        diagnosis: data.listeningDiagnosis,
        numberTone: "red",
        aTone: "red",
        bTone: "red",
        cTone: "orange"
      }),
      "      </div>",
      "      <div class=\"bottomGrid\" aria-hidden=\"true\"></div>",
      "    </section>",
      "  </div>",
      "</div>"
    ].join("");
  }

  function bindResultScreen(root) {
    var restartButton = root.querySelector("[data-action='restart-flow']");
    var retryButton = root.querySelector("[data-action='retry-result-submit']");

    if (restartButton) {
      restartButton.addEventListener("click", function () {
        clearResultBodyClass();
        demo.flow.restartAssessment();
      });
    }

    if (retryButton) {
      retryButton.addEventListener("click", function () {
        if (demo.flow && typeof demo.flow.retryResultSubmission === "function") {
          demo.flow.retryResultSubmission();
        }
      });
    }
  }

  demo.screens.resultScreen = {
    render: renderResultScreen,
    bind: bindResultScreen
  };
}());
