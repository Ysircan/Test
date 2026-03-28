/* Purpose: Final weighted raw-score calculation for the static placement demo application. */

(function () {
  var demo = window.PlacementDemo = window.PlacementDemo || {};

  demo.scoring = demo.scoring || {};

  function safeRate(earned, total) {
    if (!total || total <= 0) {
      return 0;
    }

    return earned / total;
  }

  function calculateWfdItemScore(matchedWords, totalWords) {
    var rate;

    if (!totalWords || totalWords <= 0) {
      return 0;
    }

    rate = matchedWords / totalWords;
    return rate >= 0.7 ? 1 : rate;
  }

  function calculateRawScore(vocabCorrect, vocabTotal, readingCorrect, readingTotal, listeningCorrect, listeningTotal) {
    var vocabularyRate = safeRate(vocabCorrect, vocabTotal);
    var readingRate = safeRate(readingCorrect, readingTotal);
    var listeningRate = safeRate(listeningCorrect, listeningTotal);
    var overallRate =
      vocabularyRate * 0.3 +
      readingRate * 0.35 +
      listeningRate * 0.35;
    var adjustedRate = overallRate * 0.85;

    return {
      rawScore: Math.round(adjustedRate * 100),
      sectionScores: {
        vocabulary: Math.round(vocabularyRate * 100),
        reading: Math.round(readingRate * 100),
        listening: Math.round(listeningRate * 100)
      },
      sectionMax: {
        vocabulary: 100,
        reading: 100,
        listening: 100,
        total: 100
      },
      sectionStats: {
        vocabulary: {
          correct: vocabCorrect,
          total: vocabTotal,
          rate: vocabularyRate
        },
        reading: {
          correct: readingCorrect,
          total: readingTotal,
          rate: readingRate
        },
        listening: {
          correct: listeningCorrect,
          total: listeningTotal,
          rate: listeningRate
        }
      },
      overallRate: overallRate,
      adjustedRate: adjustedRate
    };
  }

  demo.scoring.calculateWfdItemScore = calculateWfdItemScore;
  demo.scoring.calculateRawScore = calculateRawScore;
}());
