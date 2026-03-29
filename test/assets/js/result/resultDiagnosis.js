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
    if (section === "foundation") return "基础稳定度";
    if (section === "reading") return "阅读处理";
    return "听力识别";
  }

  function getCopy(section, pattern) {
    var name = getSectionName(section);

    switch (pattern) {
      case "unstable":
        return {
          title: name + "表现不稳定",
          description: "低难度题目表现偏弱，但在更高难度层又出现零散命中，整体稳定性还不足。",
          suggestion: "建议先把最基础的一层稳定下来，再逐步推进更高难度任务。"
        };
      case "all-low":
        return {
          title: name + "整体偏弱",
          description: "当前多个难度层级都低于预期，并非只是某一个单点能力不足。",
          suggestion: "建议：从基础开始，分阶段重建这一部分的能力。"
        };
      case "foundation-weak":
        return {
          title: name + "基础层偏弱",
          description: "最基础的能力层已经出现明显短板，这会限制后续更高层级的发挥。",
          suggestion: "建议优先补强最基础、最常见的题型与能力点。"
        };
      case "transition-block":
        return {
          title: name + "在中高难度出现断层",
          description: "基础表现已经具备，但一旦难度上升，正确率就明显下滑。",
          suggestion: "建议重点训练从基础控制到更长、更复杂任务之间的过渡能力。"
        };
      case "advanced-weak":
        return {
          title: name + "高难层仍需加强",
          description: "低难和中难层相对稳定，但高难度任务仍然是当前短板。",
          suggestion: "建议在保持基础稳定的同时，集中突破更高难度材料。"
        };
      case "all-mid":
        return {
          title: name + "正在形成稳定能力",
          description: "这一部分已经具备可用能力，但整体稳定度目前仍处于中等水平。",
          suggestion: "建议通过更有针对性的重复训练，把阶段性能力转化为稳定正确率。"
        };
      case "strong":
        return {
          title: name + "表现较强",
          description: "当前活跃难度层的表现较为稳定。",
          suggestion: "建议继续保持稳定性，并进一步提升更高层级的控制能力。"
        };
      default:
        return {
          title: name + "仍在发展中",
          description: "当前已经出现一定能力迹象，但这一部分的整体表现还没有完全稳定下来。",
          suggestion: "建议继续分层推进训练，优先找出最先出现断层的难度层。"
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