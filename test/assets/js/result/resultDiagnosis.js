/* Purpose: Section diagnosis helpers for the static placement demo application. */

(function () {
  var demo = window.PlacementDemo = window.PlacementDemo || {};

  var LOW_THRESHOLD = 40;
  var HIGH_THRESHOLD = 70;

  function toPercent(correct, total) {
    if (!total) {
      return 0;
    }

    return Math.round((correct / total) * 100);
  }

  function toPercentOrNull(correct, total) {
    if (!total) {
      return null;
    }

    return Math.round((correct / total) * 100);
  }

  function getBand(percent) {
    if (percent < LOW_THRESHOLD) return "low";
    if (percent >= HIGH_THRESHOLD) return "high";
    return "mid";
  }

  function getBandFromNullable(percent) {
    if (percent === null) {
      return "mid";
    }

    return getBand(percent);
  }

  function getOverallPercent(distribution) {
    var correct = distribution.A.correct + distribution.B.correct + distribution.C.correct;
    var total = distribution.A.total + distribution.B.total + distribution.C.total;

    return toPercent(correct, total);
  }

  function detectPattern(aPercent, bPercent, cPercent) {
    var activePercents = [aPercent, bPercent, cPercent].filter(function (value) {
      return value !== null;
    });
    var allLow;
    var allMid;
    var allHigh;
    var hasA;
    var hasB;
    var hasC;
    var aLow;
    var bLow;
    var cLow;
    var aHigh;
    var bHigh;
    var cHigh;

    if (activePercents.length === 0) {
      return "developing";
    }

    allLow = activePercents.every(function (value) {
      return value < LOW_THRESHOLD;
    });
    allMid = activePercents.every(function (value) {
      return value >= LOW_THRESHOLD && value < HIGH_THRESHOLD;
    });
    allHigh = activePercents.every(function (value) {
      return value >= HIGH_THRESHOLD;
    });

    if (allLow) return "all-low";
    if (allMid) return "all-mid";
    if (allHigh) return "strong";

    hasA = aPercent !== null;
    hasB = bPercent !== null;
    hasC = cPercent !== null;

    aLow = hasA && aPercent < LOW_THRESHOLD;
    bLow = hasB && bPercent < LOW_THRESHOLD;
    cLow = hasC && cPercent < LOW_THRESHOLD;

    aHigh = hasA && aPercent >= HIGH_THRESHOLD;
    bHigh = hasB && bPercent >= HIGH_THRESHOLD;
    cHigh = hasC && cPercent >= HIGH_THRESHOLD;

    if (hasA && aLow && ((hasB && bHigh) || (hasC && cHigh))) {
      return "unstable";
    }

    if (hasA && aLow && !(hasB && bHigh) && !(hasC && cHigh)) {
      return "foundation-weak";
    }

    if (hasA && hasB && hasC && aHigh && bLow && cLow) {
      return "transition-block";
    }

    if (hasA && hasB && hasC && aHigh && bHigh && cLow) {
      return "advanced-weak";
    }

    return "developing";
  }

  function getSectionName(section) {
    if (section === "foundation") return "Vocabulary Foundation";
    if (section === "reading") return "Reading";
    return "Listening";
  }

  function getCopy(section, pattern) {
    var name = getSectionName(section);

    switch (pattern) {
      case "unstable":
        return {
          title: name + " is unstable",
          description: "Easy items are weak but there are scattered hits at higher levels, so performance is not stable yet.",
          suggestion: "Stabilize the easiest layer first before pushing harder tasks."
        };
      case "all-low":
        return {
          title: name + " is broadly weak",
          description: "Most difficulty layers are currently below the expected level, not just one isolated skill.",
          suggestion: "Rebuild the full section foundation step by step."
        };
      case "foundation-weak":
        return {
          title: name + " has a weak base",
          description: "The lowest layer is already struggling, which limits the rest of the section.",
          suggestion: "Prioritize the most basic question patterns first."
        };
      case "transition-block":
        return {
          title: name + " drops at mid and high levels",
          description: "Basic performance is present, but accuracy falls once difficulty increases.",
          suggestion: "Practice the transition from simple control to longer or more complex tasks."
        };
      case "advanced-weak":
        return {
          title: name + " needs advanced-layer work",
          description: "Lower and mid difficulty are steadier, but advanced items are still a short board.",
          suggestion: "Keep fundamentals stable and focus on harder material."
        };
      case "all-mid":
        return {
          title: name + " is developing",
          description: "There is usable ability across the section, but stability is still only moderate.",
          suggestion: "Turn partial ability into consistent accuracy with targeted repetition."
        };
      case "strong":
        return {
          title: name + " is strong",
          description: "Performance is stable across active difficulty layers.",
          suggestion: "Maintain consistency and keep pushing higher-level control."
        };
      default:
        return {
          title: name + " is still developing",
          description: "Some ability is visible, but the section has not fully stabilized yet.",
          suggestion: "Keep building layer by layer and check which difficulty level breaks first."
        };
    }
  }

  function getSectionDiagnosis(section, distribution) {
    var aPercentRaw = toPercentOrNull(distribution.A.correct, distribution.A.total);
    var bPercentRaw = toPercentOrNull(distribution.B.correct, distribution.B.total);
    var cPercentRaw = toPercentOrNull(distribution.C.correct, distribution.C.total);
    var pattern = detectPattern(aPercentRaw, bPercentRaw, cPercentRaw);
    var copy = getCopy(section, pattern);

    return {
      section: section,
      pattern: pattern,
      overallPercent: getOverallPercent(distribution),
      aPercent: aPercentRaw === null ? 0 : aPercentRaw,
      bPercent: bPercentRaw === null ? 0 : bPercentRaw,
      cPercent: cPercentRaw === null ? 0 : cPercentRaw,
      aBand: getBandFromNullable(aPercentRaw),
      bBand: getBandFromNullable(bPercentRaw),
      cBand: getBandFromNullable(cPercentRaw),
      title: copy.title,
      description: copy.description,
      suggestion: copy.suggestion
    };
  }

  demo.resultDiagnosis = {
    getSectionDiagnosis: getSectionDiagnosis
  };
}());
