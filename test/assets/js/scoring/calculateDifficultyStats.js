/* Purpose: Difficulty-stat scoring helpers for all question types in the static placement demo application. */

(function () {
  var demo = window.PlacementDemo = window.PlacementDemo || {};
  var helpers = demo.helpers;

  demo.scoring = demo.scoring || {};

  function createEmptyDistribution() {
    return {
      A: { correct: 0, total: 0 },
      B: { correct: 0, total: 0 },
      C: { correct: 0, total: 0 }
    };
  }

  function cloneDistribution(distribution) {
    return {
      A: {
        correct: Number(distribution && distribution.A ? distribution.A.correct : 0) || 0,
        total: Number(distribution && distribution.A ? distribution.A.total : 0) || 0
      },
      B: {
        correct: Number(distribution && distribution.B ? distribution.B.correct : 0) || 0,
        total: Number(distribution && distribution.B ? distribution.B.total : 0) || 0
      },
      C: {
        correct: Number(distribution && distribution.C ? distribution.C.correct : 0) || 0,
        total: Number(distribution && distribution.C ? distribution.C.total : 0) || 0
      }
    };
  }

  function resolveDifficulty(value) {
    return value === "A" || value === "B" || value === "C" ? value : "A";
  }

  function addToDistribution(distribution, difficulty, correctIncrement, totalIncrement) {
    var next = cloneDistribution(distribution);
    var bucket = resolveDifficulty(difficulty);

    next[bucket].correct += Number(correctIncrement || 0);
    next[bucket].total += Number(totalIncrement || 0);

    return next;
  }

  function mergeDistribution(current, delta) {
    return {
      A: {
        correct: (current && current.A ? current.A.correct : 0) + (delta && delta.A ? delta.A.correct : 0),
        total: (current && current.A ? current.A.total : 0) + (delta && delta.A ? delta.A.total : 0)
      },
      B: {
        correct: (current && current.B ? current.B.correct : 0) + (delta && delta.B ? delta.B.correct : 0),
        total: (current && current.B ? current.B.total : 0) + (delta && delta.B ? delta.B.total : 0)
      },
      C: {
        correct: (current && current.C ? current.C.correct : 0) + (delta && delta.C ? delta.C.correct : 0),
        total: (current && current.C ? current.C.total : 0) + (delta && delta.C ? delta.C.total : 0)
      }
    };
  }

  function sumDistribution(distribution) {
    var normalized = cloneDistribution(distribution);

    return {
      correct: normalized.A.correct + normalized.B.correct + normalized.C.correct,
      total: normalized.A.total + normalized.B.total + normalized.C.total
    };
  }

  function getBlankAnswer(answer, blankNumber, index) {
    if (
      answer &&
      answer.answersByBlank &&
      Object.prototype.hasOwnProperty.call(answer.answersByBlank, blankNumber)
    ) {
      return answer.answersByBlank[blankNumber];
    }

    if (answer && Array.isArray(answer.answers)) {
      return answer.answers[index];
    }

    return "";
  }

  function areStringArraysEqual(left, right) {
    var index;

    if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) {
      return false;
    }

    for (index = 0; index < left.length; index += 1) {
      if (String(left[index]) !== String(right[index])) {
        return false;
      }
    }

    return true;
  }

  function scoreVocabularyQuestion(item, answer) {
    var correct = Boolean(
      item &&
      answer &&
      answer.selectedOptionId &&
      answer.selectedOptionId === item.correctOptionId
    );
    var delta = addToDistribution(createEmptyDistribution(), item && item.difficulty, correct ? 1 : 0, 1);

    return {
      delta: delta,
      correct: correct ? 1 : 0,
      total: 1
    };
  }

  function scoreReadingBlankQuestion(item, answer) {
    var delta = createEmptyDistribution();
    var correctCount = 0;
    var totalCount = 0;

    (item && Array.isArray(item.blanks) ? item.blanks : []).forEach(function (blank, index) {
      var userAnswer = demo.scoring.normalizeText(getBlankAnswer(answer, blank.blankNumber, index));
      var expectedAnswer = demo.scoring.normalizeText(blank.correctOption);
      var isCorrect = Boolean(userAnswer) && userAnswer === expectedAnswer;

      delta = addToDistribution(delta, blank.difficulty || item.difficulty, isCorrect ? 1 : 0, 1);
      totalCount += 1;

      if (isCorrect) {
        correctCount += 1;
      }
    });

    return {
      delta: delta,
      correct: correctCount,
      total: totalCount
    };
  }

  function scoreReadingSingleQuestion(item, answer) {
    var correct = Boolean(
      item &&
      answer &&
      answer.selectedOptionId &&
      answer.selectedOptionId === item.correctOptionId
    );
    var delta = addToDistribution(createEmptyDistribution(), item && item.difficulty, correct ? 1 : 0, 1);

    return {
      delta: delta,
      correct: correct ? 1 : 0,
      total: 1
    };
  }

  function scoreReadingReorderQuestion(item, answer) {
    var studentOrder =
      answer && Array.isArray(answer.orderedItems)
        ? answer.orderedItems
        : answer && Array.isArray(answer.studentOrder)
          ? answer.studentOrder
          : item && Array.isArray(item.items)
            ? item.items
            : [];
    var isCorrect = areStringArraysEqual(studentOrder, item && item.correctOrder ? item.correctOrder : []);
    var delta = addToDistribution(createEmptyDistribution(), item && item.difficulty, isCorrect ? 1 : 0, 1);

    return {
      delta: delta,
      correct: isCorrect ? 1 : 0,
      total: 1
    };
  }

  function scoreListeningFillBlankQuestion(item, answer) {
    var correctCount = 0;
    var totalCount = 0;
    var delta = createEmptyDistribution();
    var difficulty = item && item.difficulty;

    (item && Array.isArray(item.blanks) ? item.blanks : []).forEach(function (blank, index) {
      var userAnswer = demo.scoring.normalizeText(getBlankAnswer(answer, index + 1, index));
      var expectedAnswer = demo.scoring.normalizeText(blank.answer);
      var isCorrect = Boolean(userAnswer) && userAnswer === expectedAnswer;

      totalCount += 1;

      if (isCorrect) {
        correctCount += 1;
      }
    });

    delta = addToDistribution(delta, difficulty, correctCount, totalCount);

    return {
      delta: delta,
      correct: correctCount,
      total: totalCount
    };
  }

  function calculateHiwStats(item, answer) {
    var expectedWords = helpers.normalizeWordList(item && item.wrongWords);
    var selectedWords = helpers.normalizeWordList(answer && answer.selectedWords);
    var remainingExpected = {};
    var totalWords = expectedWords.length;
    var correctHits = 0;
    var delta = createEmptyDistribution();

    expectedWords.forEach(function (word) {
      remainingExpected[word] = (remainingExpected[word] || 0) + 1;
    });

    selectedWords.forEach(function (word) {
      if (remainingExpected[word] > 0) {
        correctHits += 1;
        remainingExpected[word] -= 1;
      }
    });

    delta = addToDistribution(delta, item && item.difficulty, correctHits, totalWords);

    return {
      delta: delta,
      correctHits: correctHits,
      totalWords: totalWords
    };
  }

  function scoreWfdQuestion(item, answer) {
    var expectedText = String(item && (item.expectedText || item.transcript || "") || "");
    var userText = String(answer && answer.text ? answer.text : "");
    var grade = demo.scoring.gradeWFD
      ? demo.scoring.gradeWFD(expectedText, userText)
      : { correct: 0, total: 0 };
    var delta = addToDistribution(createEmptyDistribution(), item && item.difficulty, grade.correct, grade.total);

    return {
      delta: delta,
      correct: grade.correct,
      total: grade.total
    };
  }

  demo.scoring.calculateDifficultyStats = {
    createEmptyDistribution: createEmptyDistribution,
    cloneDistribution: cloneDistribution,
    addToDistribution: addToDistribution,
    mergeDistribution: mergeDistribution,
    sumDistribution: sumDistribution,
    scoreVocabularyQuestion: scoreVocabularyQuestion,
    scoreReadingBlankQuestion: scoreReadingBlankQuestion,
    scoreReadingSingleQuestion: scoreReadingSingleQuestion,
    scoreReadingReorderQuestion: scoreReadingReorderQuestion,
    scoreListeningFillBlankQuestion: scoreListeningFillBlankQuestion,
    calculateHiwStats: calculateHiwStats,
    scoreWfdQuestion: scoreWfdQuestion
  };
}());
