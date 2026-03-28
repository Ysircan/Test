/* Purpose: Shared constants and real question-bank helpers for the static placement demo application. */

(function () {
  var demo = window.PlacementDemo = window.PlacementDemo || {};

  function ensureArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function createEmptyQuestionBank() {
    return {
      vocabulary: [],
      readingPassages: [],
      readingReorder: [],
      readingSingleChoice: [],
      listening: {
        listeningFillBlanks: [],
        hiwItems: [],
        wfdItems: []
      }
    };
  }

  function getQuestionBank(examType) {
    var data = demo.data || {};
    var bank;

    if (examType === "full") {
      bank = data.fullQuestions;
    } else if (examType === "quick") {
      bank = data.quickQuestions;
    } else {
      bank = data.questions || data.quickQuestions || data.fullQuestions;
    }

    return bank || createEmptyQuestionBank();
  }

  function getQuestionSections(examType) {
    var bank = getQuestionBank(examType);
    var listening = bank.listening || {};

    return {
      vocabulary: ensureArray(bank.vocabulary),
      readingPassages: ensureArray(bank.readingPassages),
      readingReorders: ensureArray(bank.readingReorder),
      readingSingleChoices: ensureArray(bank.readingSingleChoice),
      listeningFillBlankItems: ensureArray(listening.listeningFillBlanks),
      hiwItems: ensureArray(listening.hiwItems),
      wfdItems: ensureArray(listening.wfdItems)
    };
  }

  demo.constants = {
    STORAGE_KEY: "placement_static_progress",
    STEP_NAMES: [
      "start",
      "preTestIntro",
      "vocabIntro",
      "vocabQuestion",
      "readingIntro",
      "readingQuestion",
      "readingReorderQuestion",
      "readingSingleQuestion",
      "listeningIntro",
      "listeningQuestion",
      "hiwQuestion",
      "wfdQuestion",
      "listeningComplete",
      "result"
    ],
    LEGACY_STEP_MAP: {
      readingFinalQuestion: "readingQuestion",
      readingFinalReorderQuestion: "readingReorderQuestion"
    },
    EXAM_OPTIONS: [
      { value: "quick", label: "Quick" },
      { value: "full", label: "Full" }
    ],
    STEP_META: {
      start: {
        title: "Start",
        description: "Begin the placement flow from the same top-level entry as the real controller."
      },
      preTestIntro: {
        title: "Pre-test Intro",
        description: "Collect the same pre-test information before section flow begins."
      },
      vocabIntro: {
        title: "Vocabulary",
        description: "Choose the word that best completes the sentence."
      },
      readingIntro: {
        title: "Reading",
        description: "Read the passage flow before reorder and single-choice reading tasks."
      },
      listeningIntro: {
        title: "Listening",
        description: "Enter the listening section and branch through fill blanks, HIW, and WFD."
      },
      listeningComplete: {
        title: "Listening Complete",
        description: "Finish the listening section and continue to result."
      }
    },
    ensureArray: ensureArray,
    createEmptyQuestionBank: createEmptyQuestionBank,
    getQuestionBank: getQuestionBank,
    getQuestionSections: getQuestionSections
  };
}());
