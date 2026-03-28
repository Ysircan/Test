/* Purpose: Shared mutable state store for the static placement demo application. */

(function () {
  var demo = window.PlacementDemo = window.PlacementDemo || {};
  var listeners = [];

  function createEmptyStats() {
    return {
      A: { correct: 0, total: 0 },
      B: { correct: 0, total: 0 },
      C: { correct: 0, total: 0 }
    };
  }

  function createEmptyResponses() {
    return {
      vocabulary: {},
      readingBlank: {},
      readingSingle: {},
      readingReorder: {},
      listeningFillBlank: {},
      hiw: {},
      wfd: {}
    };
  }

  function cloneStats(stats) {
    return {
      A: {
        correct: Number(stats && stats.A ? stats.A.correct : 0) || 0,
        total: Number(stats && stats.A ? stats.A.total : 0) || 0
      },
      B: {
        correct: Number(stats && stats.B ? stats.B.correct : 0) || 0,
        total: Number(stats && stats.B ? stats.B.total : 0) || 0
      },
      C: {
        correct: Number(stats && stats.C ? stats.C.correct : 0) || 0,
        total: Number(stats && stats.C ? stats.C.total : 0) || 0
      }
    };
  }

  function cloneResponses(responses) {
    try {
      return JSON.parse(JSON.stringify(responses || createEmptyResponses()));
    } catch (error) {
      return createEmptyResponses();
    }
  }

  function createInitialState() {
    return {
      step: "start",
      selectedExam: "",
      studentName: "",
      contactValue: "",
      targetScore: "",
      vocabIndex: 0,
      readingPassageIndex: 0,
      readingSingleIndex: 0,
      readingReorderIndex: 0,
      listeningFillBlankIndex: 0,
      hiwIndex: 0,
      wfdIndex: 0,
      score: 0,
      difficultyStats: createEmptyStats(),
      readingStats: createEmptyStats(),
      listeningStats: createEmptyStats(),
      responses: createEmptyResponses()
    };
  }

  var currentState = createInitialState();

  function cloneState(state) {
    return {
      step: state.step,
      selectedExam: state.selectedExam,
      studentName: state.studentName,
      contactValue: state.contactValue,
      targetScore: state.targetScore,
      vocabIndex: state.vocabIndex,
      readingPassageIndex: state.readingPassageIndex,
      readingSingleIndex: state.readingSingleIndex,
      readingReorderIndex: state.readingReorderIndex,
      listeningFillBlankIndex: state.listeningFillBlankIndex,
      hiwIndex: state.hiwIndex,
      wfdIndex: state.wfdIndex,
      score: state.score,
      difficultyStats: cloneStats(state.difficultyStats),
      readingStats: cloneStats(state.readingStats),
      listeningStats: cloneStats(state.listeningStats),
      responses: cloneResponses(state.responses)
    };
  }

  function notify() {
    var snapshot = cloneState(currentState);
    var index;

    for (index = 0; index < listeners.length; index += 1) {
      listeners[index](snapshot);
    }
  }

  function getState() {
    return cloneState(currentState);
  }

  function replaceState(nextState) {
    currentState = cloneState(nextState || createInitialState());
    notify();
  }

  function setState(patch) {
    var nextState = cloneState(currentState);
    var key;

    for (key in patch) {
      if (Object.prototype.hasOwnProperty.call(patch, key)) {
        nextState[key] = patch[key];
      }
    }

    currentState = cloneState(nextState);
    notify();
  }

  function subscribe(listener) {
    listeners.push(listener);

    return function unsubscribe() {
      listeners = listeners.filter(function (item) {
        return item !== listener;
      });
    };
  }

  demo.state = {
    createEmptyStats: createEmptyStats,
    createEmptyResponses: createEmptyResponses,
    createInitialState: createInitialState,
    cloneStats: cloneStats,
    cloneResponses: cloneResponses,
    getState: getState,
    replaceState: replaceState,
    setState: setState,
    subscribe: subscribe
  };
}());
