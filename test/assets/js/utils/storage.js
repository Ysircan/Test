/* Purpose: Local storage save, restore, and reset helpers driven by real migrated question-bank arrays for the static placement demo application. */

(function () {
  var demo = window.PlacementDemo = window.PlacementDemo || {};

  function getLocalStorage() {
    try {
      return window.localStorage;
    } catch (error) {
      return null;
    }
  }

  function normalizeExam(value) {
    return value === "quick" || value === "full" ? value : "";
  }

  function clampIndex(value, length) {
    var parsed = Number(value);

    if (!Number.isFinite(parsed) || parsed < 0) {
      return 0;
    }

    if (length <= 0) {
      return 0;
    }

    if (parsed >= length) {
      return length - 1;
    }

    return Math.floor(parsed);
  }

  function normalizeStep(step, sections) {
    var constants = demo.constants;
    var resolvedStep = step;

    if (Object.prototype.hasOwnProperty.call(constants.LEGACY_STEP_MAP, step)) {
      resolvedStep = constants.LEGACY_STEP_MAP[step];
    }

    if (constants.STEP_NAMES.indexOf(resolvedStep) === -1) {
      return "start";
    }

    if (resolvedStep === "vocabQuestion" && sections.vocabulary.length === 0) {
      return "readingIntro";
    }

    if (resolvedStep === "readingQuestion" && sections.readingPassages.length === 0) {
      return sections.readingReorders.length > 0
        ? "readingReorderQuestion"
        : sections.readingSingleChoices.length > 0
          ? "readingSingleQuestion"
          : "listeningIntro";
    }

    if (resolvedStep === "readingReorderQuestion" && sections.readingReorders.length === 0) {
      return sections.readingSingleChoices.length > 0 ? "readingSingleQuestion" : "listeningIntro";
    }

    if (resolvedStep === "readingSingleQuestion" && sections.readingSingleChoices.length === 0) {
      return "listeningIntro";
    }

    if (resolvedStep === "listeningQuestion" && sections.listeningFillBlankItems.length === 0) {
      return sections.hiwItems.length > 0
        ? "hiwQuestion"
        : sections.wfdItems.length > 0
          ? "wfdQuestion"
          : "listeningComplete";
    }

    if (resolvedStep === "hiwQuestion" && sections.hiwItems.length === 0) {
      return sections.wfdItems.length > 0 ? "wfdQuestion" : "listeningComplete";
    }

    if (resolvedStep === "wfdQuestion" && sections.wfdItems.length === 0) {
      return "listeningComplete";
    }

    return resolvedStep;
  }

  function loadProgress() {
    var storage = getLocalStorage();
    var stateApi = demo.state;
    var constants = demo.constants;
    var raw;
    var parsed;
    var selectedExam;
    var sections;
    var restoredState;
    var normalizedStep;

    if (!storage || !stateApi || !constants) {
      return null;
    }

    raw = storage.getItem(constants.STORAGE_KEY);

    if (!raw) {
      return null;
    }

    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      storage.removeItem(constants.STORAGE_KEY);
      return null;
    }

    if (!parsed || typeof parsed !== "object") {
      storage.removeItem(constants.STORAGE_KEY);
      return null;
    }

    selectedExam = normalizeExam(parsed.selectedExam);
    sections = constants.getQuestionSections(selectedExam);
    normalizedStep = normalizeStep(parsed.step, sections);

    restoredState = stateApi.createInitialState();
    restoredState.step = normalizedStep;
    restoredState.selectedExam = selectedExam;
    restoredState.studentName = typeof parsed.studentName === "string" ? parsed.studentName : "";
    restoredState.contactValue = typeof parsed.contactValue === "string" ? parsed.contactValue : "";
    restoredState.targetScore = typeof parsed.targetScore === "string" ? parsed.targetScore : "";
    restoredState.vocabIndex = clampIndex(parsed.vocabIndex, sections.vocabulary.length);
    restoredState.readingPassageIndex =
      parsed.step === "readingFinalQuestion"
        ? Math.max(0, sections.readingPassages.length - 1)
        : clampIndex(parsed.readingPassageIndex, sections.readingPassages.length);
    restoredState.readingSingleIndex = clampIndex(parsed.readingSingleIndex, sections.readingSingleChoices.length);
    restoredState.readingReorderIndex =
      parsed.step === "readingFinalReorderQuestion"
        ? Math.max(0, sections.readingReorders.length - 1)
        : clampIndex(parsed.readingReorderIndex, sections.readingReorders.length);
    restoredState.listeningFillBlankIndex = clampIndex(parsed.listeningFillBlankIndex, sections.listeningFillBlankItems.length);
    restoredState.hiwIndex = clampIndex(parsed.hiwIndex, sections.hiwItems.length);
    restoredState.wfdIndex = clampIndex(parsed.wfdIndex, sections.wfdItems.length);
    restoredState.score = Number(parsed.score) || 0;
    restoredState.difficultyStats = stateApi.cloneStats(parsed.difficultyStats);
    restoredState.readingStats = stateApi.cloneStats(parsed.readingStats);
    restoredState.listeningStats = stateApi.cloneStats(parsed.listeningStats);

    return restoredState;
  }

  function saveProgress(state) {
    var storage = getLocalStorage();
    var constants = demo.constants;

    if (!storage || !constants) {
      return;
    }

    try {
      storage.setItem(constants.STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      // Ignore storage write errors in the static demo.
    }
  }

  function clearProgress() {
    var storage = getLocalStorage();
    var constants = demo.constants;

    if (!storage || !constants) {
      return;
    }

    storage.removeItem(constants.STORAGE_KEY);
  }

  demo.storage = {
    loadProgress: loadProgress,
    saveProgress: saveProgress,
    clearProgress: clearProgress
  };
}());
