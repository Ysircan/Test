/* Purpose: Real step-based flow transitions driven by migrated question-bank arrays for the static placement demo application. */

(function () {
  var demo = window.PlacementDemo = window.PlacementDemo || {};

  function getSections(examType) {
    return demo.constants.getQuestionSections(examType);
  }

  function cloneStats(stats) {
    return demo.state.cloneStats(stats);
  }

  function updateStatsBucket(stats, difficulty, correctIncrement, totalIncrement) {
    var nextStats = cloneStats(stats);
    var resolvedDifficulty = nextStats[difficulty] ? difficulty : "A";

    nextStats[resolvedDifficulty].correct += correctIncrement;
    nextStats[resolvedDifficulty].total += totalIncrement;

    return nextStats;
  }

  function updateScore(currentScore, scoreIncrement) {
    return Number(currentScore) + Number(scoreIncrement || 0);
  }

  function mergeStats(currentStats, delta) {
    var scoring = demo.scoring && demo.scoring.calculateDifficultyStats;

    if (scoring && typeof scoring.mergeDistribution === "function") {
      return scoring.mergeDistribution(currentStats, delta);
    }

    return currentStats;
  }

  function calculateHiwScore(item, payload) {
    var scoring = demo.scoring && demo.scoring.calculateDifficultyStats;
    var answer = payload && typeof payload === "object" ? payload.answer : null;

    if (scoring && typeof scoring.calculateHiwStats === "function") {
      return scoring.calculateHiwStats(item, answer);
    }

    return {
      delta: demo.state.createEmptyStats(),
      correctHits: 0,
      totalWords: Array.isArray(item && item.wrongWords) ? item.wrongWords.length : 0
    };
  }

  function storeResponse(responses, bucketName, itemId, answer) {
    var nextResponses = demo.state.cloneResponses(responses);

    if (!bucketName || !itemId || !Object.prototype.hasOwnProperty.call(nextResponses, bucketName)) {
      return nextResponses;
    }

    nextResponses[bucketName][itemId] = demo.helpers.clonePlainData(answer, {});

    return nextResponses;
  }

  function getCurrentItem(state) {
    var sections = getSections(state.selectedExam);

    if (state.step === "vocabQuestion") {
      return sections.vocabulary[state.vocabIndex] || null;
    }

    if (state.step === "readingQuestion") {
      return sections.readingPassages[state.readingPassageIndex] || null;
    }

    if (state.step === "readingReorderQuestion") {
      return sections.readingReorders[state.readingReorderIndex] || null;
    }

    if (state.step === "readingSingleQuestion") {
      return sections.readingSingleChoices[state.readingSingleIndex] || null;
    }

    if (state.step === "listeningQuestion") {
      return sections.listeningFillBlankItems[state.listeningFillBlankIndex] || null;
    }

    if (state.step === "hiwQuestion") {
      return sections.hiwItems[state.hiwIndex] || null;
    }

    if (state.step === "wfdQuestion") {
      return sections.wfdItems[state.wfdIndex] || null;
    }

    return null;
  }

  function getStepProgress(state) {
    var sections = getSections(state.selectedExam);

    switch (state.step) {
      case "vocabQuestion":
        return {
          current: state.vocabIndex + 1,
          total: sections.vocabulary.length
        };
      case "readingQuestion":
        return {
          current: state.readingPassageIndex + 1,
          total: sections.readingPassages.length
        };
      case "readingReorderQuestion":
        return {
          current: state.readingReorderIndex + 1,
          total: sections.readingReorders.length
        };
      case "readingSingleQuestion":
        return {
          current: state.readingSingleIndex + 1,
          total: sections.readingSingleChoices.length
        };
      case "listeningQuestion":
        return {
          current: state.listeningFillBlankIndex + 1,
          total: sections.listeningFillBlankItems.length
        };
      case "hiwQuestion":
        return {
          current: state.hiwIndex + 1,
          total: sections.hiwItems.length
        };
      case "wfdQuestion":
        return {
          current: state.wfdIndex + 1,
          total: sections.wfdItems.length
        };
      default:
        return null;
    }
  }

  function getListeningStartStep(sections) {
    if (sections.listeningFillBlankItems.length > 0) {
      return "listeningQuestion";
    }

    if (sections.hiwItems.length > 0) {
      return "hiwQuestion";
    }

    if (sections.wfdItems.length > 0) {
      return "wfdQuestion";
    }

    return "listeningComplete";
  }

  function startAssessment() {
    demo.state.setState({
      step: "preTestIntro"
    });
  }

  function completePreTest(payload) {
    var stateApi = demo.state;
    var normalizedExam = payload.selectedExam === "full" || payload.selectedExam === "quick"
      ? payload.selectedExam
      : "";

    stateApi.setState({
      step: "vocabIntro",
      selectedExam: normalizedExam,
      studentName: payload.studentName || "",
      contactValue: payload.contactValue || "",
      targetScore: payload.targetScore || "",
      vocabIndex: 0,
      readingPassageIndex: 0,
      readingSingleIndex: 0,
      readingReorderIndex: 0,
      listeningFillBlankIndex: 0,
      hiwIndex: 0,
      wfdIndex: 0,
      score: 0,
      difficultyStats: stateApi.createEmptyStats(),
      readingStats: stateApi.createEmptyStats(),
      listeningStats: stateApi.createEmptyStats(),
      responses: stateApi.createEmptyResponses()
    });
  }

  function advanceSectionIntro() {
    var state = demo.state.getState();
    var sections = getSections(state.selectedExam);

    if (state.step === "vocabIntro") {
      demo.state.setState({
        step: sections.vocabulary.length > 0 ? "vocabQuestion" : "readingIntro"
      });
      return;
    }

    if (state.step === "readingIntro") {
      demo.state.setState({
        step: sections.readingPassages.length > 0
          ? "readingQuestion"
          : sections.readingReorders.length > 0
            ? "readingReorderQuestion"
            : sections.readingSingleChoices.length > 0
              ? "readingSingleQuestion"
              : "listeningIntro"
      });
      return;
    }

    if (state.step === "listeningIntro") {
      demo.state.setState({
        step: getListeningStartStep(sections)
      });
      return;
    }

    if (state.step === "listeningComplete") {
      demo.state.setState({
        step: "result"
      });
    }
  }

  function completeVocabularyQuestion(payload) {
    var state = demo.state.getState();
    var sections = getSections(state.selectedExam);
    var item = sections.vocabulary[state.vocabIndex];
    var scoring = demo.scoring && demo.scoring.calculateDifficultyStats;
    var result;
    var nextIndex;

    if (!item) {
      demo.state.setState({
        step: "readingIntro"
      });
      return;
    }

    nextIndex = state.vocabIndex + 1;
    result = scoring && typeof scoring.scoreVocabularyQuestion === "function"
      ? scoring.scoreVocabularyQuestion(item, payload ? payload.answer : null)
      : {
          delta: demo.state.createEmptyStats(),
          correct: 0
        };

    demo.state.setState({
      difficultyStats: mergeStats(state.difficultyStats, result.delta),
      score: updateScore(state.score, result.correct),
      responses: storeResponse(state.responses, "vocabulary", item.id, payload ? payload.answer : null),
      vocabIndex: nextIndex < sections.vocabulary.length ? nextIndex : state.vocabIndex,
      step: nextIndex < sections.vocabulary.length ? "vocabQuestion" : "readingIntro"
    });
  }

  function completeReadingPassage(payload) {
    var state = demo.state.getState();
    var sections = getSections(state.selectedExam);
    var item = sections.readingPassages[state.readingPassageIndex];
    var scoring = demo.scoring && demo.scoring.calculateDifficultyStats;
    var result;
    var nextIndex;
    var nextStep;

    if (!item) {
      demo.state.setState({
        step: sections.readingReorders.length > 0
          ? "readingReorderQuestion"
          : sections.readingSingleChoices.length > 0
            ? "readingSingleQuestion"
            : "listeningIntro"
      });
      return;
    }

    nextIndex = state.readingPassageIndex + 1;
    result = scoring && typeof scoring.scoreReadingBlankQuestion === "function"
      ? scoring.scoreReadingBlankQuestion(item, payload ? payload.answer : null)
      : {
          delta: demo.state.createEmptyStats(),
          correct: 0
        };
    nextStep = nextIndex < sections.readingPassages.length
      ? "readingQuestion"
      : sections.readingReorders.length > 0
        ? "readingReorderQuestion"
        : sections.readingSingleChoices.length > 0
          ? "readingSingleQuestion"
          : "listeningIntro";

    demo.state.setState({
      readingStats: mergeStats(state.readingStats, result.delta),
      score: updateScore(state.score, result.correct),
      responses: storeResponse(state.responses, "readingBlank", item.id, payload ? payload.answer : null),
      readingPassageIndex: nextIndex < sections.readingPassages.length ? nextIndex : state.readingPassageIndex,
      step: nextStep
    });
  }

  function completeReadingReorder(payload) {
    var state = demo.state.getState();
    var sections = getSections(state.selectedExam);
    var item = sections.readingReorders[state.readingReorderIndex];
    var scoring = demo.scoring && demo.scoring.calculateDifficultyStats;
    var result;
    var nextIndex;
    var nextStep;

    if (!item) {
      demo.state.setState({
        step: sections.readingSingleChoices.length > 0 ? "readingSingleQuestion" : "listeningIntro"
      });
      return;
    }

    nextIndex = state.readingReorderIndex + 1;
    result = scoring && typeof scoring.scoreReadingReorderQuestion === "function"
      ? scoring.scoreReadingReorderQuestion(item, payload ? payload.answer : null)
      : {
          delta: demo.state.createEmptyStats(),
          correct: 0
        };
    nextStep = nextIndex < sections.readingReorders.length
      ? "readingReorderQuestion"
      : sections.readingSingleChoices.length > 0
        ? "readingSingleQuestion"
        : "listeningIntro";

    demo.state.setState({
      readingStats: mergeStats(state.readingStats, result.delta),
      score: updateScore(state.score, result.correct),
      responses: storeResponse(state.responses, "readingReorder", item.id, payload ? payload.answer : null),
      readingReorderIndex: nextIndex < sections.readingReorders.length ? nextIndex : state.readingReorderIndex,
      step: nextStep
    });
  }

  function completeReadingSingle(payload) {
    var state = demo.state.getState();
    var sections = getSections(state.selectedExam);
    var item = sections.readingSingleChoices[state.readingSingleIndex];
    var scoring = demo.scoring && demo.scoring.calculateDifficultyStats;
    var result;
    var nextIndex;

    if (!item) {
      demo.state.setState({
        step: "listeningIntro"
      });
      return;
    }

    nextIndex = state.readingSingleIndex + 1;
    result = scoring && typeof scoring.scoreReadingSingleQuestion === "function"
      ? scoring.scoreReadingSingleQuestion(item, payload ? payload.answer : null)
      : {
          delta: demo.state.createEmptyStats(),
          correct: 0
        };

    demo.state.setState({
      readingStats: mergeStats(state.readingStats, result.delta),
      score: updateScore(state.score, result.correct),
      responses: storeResponse(state.responses, "readingSingle", item.id, payload ? payload.answer : null),
      readingSingleIndex: nextIndex < sections.readingSingleChoices.length ? nextIndex : state.readingSingleIndex,
      step: nextIndex < sections.readingSingleChoices.length ? "readingSingleQuestion" : "listeningIntro"
    });
  }

  function completeListeningFillBlank(payload) {
    var state = demo.state.getState();
    var sections = getSections(state.selectedExam);
    var item = sections.listeningFillBlankItems[state.listeningFillBlankIndex];
    var scoring = demo.scoring && demo.scoring.calculateDifficultyStats;
    var result;
    var nextIndex;
    var nextStep;

    if (!item) {
      demo.state.setState({
        step: sections.hiwItems.length > 0
          ? "hiwQuestion"
          : sections.wfdItems.length > 0
            ? "wfdQuestion"
            : "listeningComplete"
      });
      return;
    }

    nextIndex = state.listeningFillBlankIndex + 1;
    result = scoring && typeof scoring.scoreListeningFillBlankQuestion === "function"
      ? scoring.scoreListeningFillBlankQuestion(item, payload ? payload.answer : null)
      : {
          delta: demo.state.createEmptyStats(),
          correct: 0
        };
    nextStep = nextIndex < sections.listeningFillBlankItems.length
      ? "listeningQuestion"
      : sections.hiwItems.length > 0
        ? "hiwQuestion"
        : sections.wfdItems.length > 0
          ? "wfdQuestion"
          : "listeningComplete";

    demo.state.setState({
      listeningStats: mergeStats(state.listeningStats, result.delta),
      score: updateScore(state.score, result.correct),
      responses: storeResponse(state.responses, "listeningFillBlank", item.id, payload ? payload.answer : null),
      listeningFillBlankIndex: nextIndex < sections.listeningFillBlankItems.length ? nextIndex : state.listeningFillBlankIndex,
      step: nextStep
    });
  }

  function completeHiw(payload) {
    var state = demo.state.getState();
    var sections = getSections(state.selectedExam);
    var item = sections.hiwItems[state.hiwIndex];
    var hiwScore;
    var nextIndex;

    if (!item) {
      demo.state.setState({
        step: sections.wfdItems.length > 0 ? "wfdQuestion" : "listeningComplete"
      });
      return;
    }

    nextIndex = state.hiwIndex + 1;
    hiwScore = calculateHiwScore(item, payload);

    demo.state.setState({
      listeningStats: mergeStats(state.listeningStats, hiwScore.delta),
      score: updateScore(state.score, hiwScore.correctHits),
      responses: storeResponse(state.responses, "hiw", item.id, payload ? payload.answer : null),
      hiwIndex: nextIndex < sections.hiwItems.length ? nextIndex : state.hiwIndex,
      step: nextIndex < sections.hiwItems.length ? "hiwQuestion" : sections.wfdItems.length > 0 ? "wfdQuestion" : "listeningComplete"
    });
  }

  function completeWfd(payload) {
    var state = demo.state.getState();
    var sections = getSections(state.selectedExam);
    var item = sections.wfdItems[state.wfdIndex];
    var scoring = demo.scoring && demo.scoring.calculateDifficultyStats;
    var result;
    var nextIndex;

    if (!item) {
      demo.state.setState({
        step: "listeningComplete"
      });
      return;
    }

    nextIndex = state.wfdIndex + 1;
    result = scoring && typeof scoring.scoreWfdQuestion === "function"
      ? scoring.scoreWfdQuestion(item, payload ? payload.answer : null)
      : {
          delta: demo.state.createEmptyStats(),
          correct: 0
        };

    demo.state.setState({
      listeningStats: mergeStats(state.listeningStats, result.delta),
      score: updateScore(state.score, result.correct),
      responses: storeResponse(state.responses, "wfd", item.id, payload ? payload.answer : null),
      wfdIndex: nextIndex < sections.wfdItems.length ? nextIndex : state.wfdIndex,
      step: nextIndex < sections.wfdItems.length ? "wfdQuestion" : "listeningComplete"
    });
  }

  function restartAssessment() {
    demo.storage.clearProgress();
    demo.state.replaceState(demo.state.createInitialState());
  }

  demo.flow = {
    getCurrentItem: getCurrentItem,
    getStepProgress: getStepProgress,
    getSections: getSections,
    startAssessment: startAssessment,
    completePreTest: completePreTest,
    advanceSectionIntro: advanceSectionIntro,
    completeVocabularyQuestion: completeVocabularyQuestion,
    completeReadingPassage: completeReadingPassage,
    completeReadingReorder: completeReadingReorder,
    completeReadingSingle: completeReadingSingle,
    completeListeningFillBlank: completeListeningFillBlank,
    completeHiw: completeHiw,
    completeWfd: completeWfd,
    restartAssessment: restartAssessment
  };
}());
