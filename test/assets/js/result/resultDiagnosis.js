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
    if (percent < LOW_THRESHOLD) {
      return "low";
    }

    if (percent >= HIGH_THRESHOLD) {
      return "high";
    }

    return "mid";
  }

  function getBandFromNullable(percent) {
    if (percent === null) {
      return "mid";
    }

    return getBand(percent);
  }

  function getOverallPercent(distribution) {
    var correct =
      distribution.A.correct + distribution.B.correct + distribution.C.correct;
    var total =
      distribution.A.total + distribution.B.total + distribution.C.total;

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

    if (allLow) {
      return "all-low";
    }

    if (allMid) {
      return "all-mid";
    }

    if (allHigh) {
      return "strong";
    }

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

  function getFoundationCopy(pattern) {
    switch (pattern) {
      case "unstable":
        return {
          title: "基础表现波动较大",
          description:
            "当前基础题正确率偏低，但更高层题目又出现局部得分，说明这部分结果存在一定波动。学生的基础词义、常见搭配和基础语法掌握还不够稳定，目前不建议只看局部得分判断能力。",
          suggestion:
            "建议先回到基础词汇、句子理解和基础语法训练，优先把最底层正确率做稳。"
        };

      case "all-low":
        return {
          title: "当前基础仍不稳定",
          description:
            "学生在基础词义、常见搭配和基础语法层面的表现整体偏弱，不是某一个单点问题，而是整个基础板块都还没有建立起稳定能力。",
          suggestion:
            "建议先系统补基础，从高频词汇、核心句型和基础理解入手，先把正确率拉起来。"
        };

      case "foundation-weak":
        return {
          title: "基础层是当前主要短板",
          description:
            "学生在最基础的题目上正确率就已经偏低，这会直接影响后续中高难度题型的发挥。当前问题首先出现在底层语言基础上，而不是单纯的技巧问题。",
          suggestion:
            "建议优先补基础词汇、基础语法和常见句子理解，不要急着直接追求高难题训练。"
        };

      case "transition-block":
        return {
          title: "基础有了，但还没稳定过渡",
          description:
            "学生对基础内容已经有一定识别能力，但进入中高难度之后正确率明显下降，说明基础尚未真正转化为更完整的作答能力。",
          suggestion:
            "建议在巩固基础的同时，增加中段难度的词义辨析、语境判断和综合应用训练。"
        };

      case "advanced-weak":
        return {
          title: "高阶基础应用仍偏弱",
          description:
            "学生的基础和中段表现已经较稳，但在更高阶的词义辨析、复杂语境判断和稳定输出上仍存在明显短板。",
          suggestion:
            "建议重点加强高阶词汇辨析、复杂语境训练和易错点精修。"
        };

      case "all-mid":
        return {
          title: "基础有一定能力，但不够稳",
          description:
            "学生并非完全缺乏基础，但整体正确率处于中间水平，说明知识点掌握还不够扎实，实际作答时容易出现波动。",
          suggestion:
            "建议通过系统复习和分层练习，把基础知识从“会一点”提升到“做得稳”。"
        };

      case "strong":
        return {
          title: "基础板块整体较稳",
          description:
            "学生在基础词义、句子理解和常见规则上的表现整体稳定，说明这一板块已经具备较好的支撑能力。",
          suggestion:
            "建议继续保持基础正确率，同时把训练重点逐步转向更高阶的应用和提速。"
        };

      default:
        return {
          title: "基础能力正在形成",
          description:
            "学生在基础板块已经具备一定能力，但不同层级之间仍有波动，说明当前处于从“会做”向“做稳”过渡的阶段。",
          suggestion:
            "建议继续分层训练，先稳住基础，再逐步提高中高难度正确率。"
        };
    }
  }

  function getReadingCopy(pattern) {
    switch (pattern) {
      case "unstable":
        return {
          title: "阅读结果波动较大",
          description:
            "当前基础阅读题正确率偏低，但更高层题型又出现局部得分，说明阅读结果存在一定波动。学生的阅读表现还不够稳定，暂时不适合只根据单一得分点判断水平。",
          suggestion:
            "建议先稳住基础阅读理解、信息定位和句意判断，再观察后续表现。"
        };

      case "all-low":
        return {
          title: "阅读整体处理偏弱",
          description:
            "学生在基础理解、信息定位、逻辑判断和排序处理上整体正确率都偏低，说明当前阅读板块的问题不是单点短板，而是整体处理能力都还没有建立起来。",
          suggestion:
            "建议先从基础阅读理解、定位能力和常规逻辑关系训练开始，逐步建立阅读稳定度。"
        };

      case "foundation-weak":
        return {
          title: "基础阅读理解仍有明显问题",
          description:
            "学生在基础句意理解、信息定位和简单逻辑判断上就已经出现困难，这会直接影响整套阅读表现。",
          suggestion:
            "建议优先补基础阅读能力，先解决读不懂、找不到、判断不准的问题。"
        };

      case "transition-block":
        return {
          title: "中段阅读处理受阻",
          description:
            "学生能够处理基础句意与简单信息定位，但一进入段落关系、信息整合和排序判断后，正确率明显下降，说明阅读能力还停留在较基础层面。",
          suggestion:
            "建议重点加强段落逻辑、信息整合、阅读排序和结构判断训练。"
        };

      case "advanced-weak":
        return {
          title: "高阶阅读仍是当前短板",
          description:
            "学生基础阅读和中段理解已经相对稳定，但在长句、复杂逻辑、结构判断和高阶信息整合方面仍存在明显短板。",
          suggestion:
            "建议重点提升复杂结构分析、长句拆解和高阶信息整合能力。"
        };

      case "all-mid":
        return {
          title: "阅读能力已有基础，但稳定性一般",
          description:
            "学生并不是完全读不懂，但整体正确率仍停留在中间区间，说明阅读能力有一定基础，不过在复杂结构或时间压力下容易波动。",
          suggestion:
            "建议通过系统训练把阅读节奏和定位准确率进一步做稳。"
        };

      case "strong":
        return {
          title: "阅读板块整体较稳",
          description:
            "学生在基础理解、信息定位和逻辑处理上的整体表现较稳定，说明阅读板块已经具备较好的能力基础。",
          suggestion:
            "建议继续保持稳定度，并把训练重心逐步放到高阶逻辑和速度提升上。"
        };

      default:
        return {
          title: "阅读能力正在提升中",
          description:
            "学生在阅读板块已经具备一定处理能力，但不同层级之间仍有差距，说明当前仍处于提升和稳定阶段。",
          suggestion:
            "建议继续进行分层阅读训练，把基础理解逐步过渡到更复杂的逻辑处理。"
        };
    }
  }

  function getListeningCopy(pattern) {
    switch (pattern) {
      case "unstable":
        return {
          title: "听力结果波动较明显",
          description:
            "当前基础听辨正确率偏低，但更高层题目又出现局部得分，说明这部分作答稳定性不足。结果中可能存在一定随机性，需要结合后续样本继续观察。",
          suggestion:
            "建议先回到基础听辨、关键词抓取和简单信息识别训练，把最底层听力能力先做稳。"
        };

      case "all-low":
        return {
          title: "听力整体识别偏弱",
          description:
            "学生在基础听辨、关键信息捕捉和更复杂信息处理上的整体表现都偏低，说明当前听力板块整体能力还没有建立起来。",
          suggestion:
            "建议先从基础听辨、关键词识别和简单句信息抓取开始，逐步建立听力稳定度。"
        };

      case "foundation-weak":
        return {
          title: "基础听辨能力仍偏弱",
          description:
            "学生在基础听辨、关键词捕捉和简单信息识别上就已经存在明显困难，说明听力底层识别能力较弱。",
          suggestion:
            "建议优先补基础听力能力，从音词识别、关键词抓取和短句理解开始训练。"
        };

      case "transition-block":
        return {
          title: "听力中段处理开始掉分",
          description:
            "学生基础信息可以听到，但一旦进入更长句、更快语速或需要连续处理的信息时，正确率明显下降，说明听力过渡层存在阻塞。",
          suggestion:
            "建议重点加强中段语流处理、连续信息跟踪和句子级听辨训练。"
        };

      case "advanced-weak":
        return {
          title: "高阶听辨仍是主要短板",
          description:
            "学生基础听辨和中段信息捕捉已经较稳，但在复杂信息、细节识别和高压条件下的实时处理能力仍不足。",
          suggestion:
            "建议重点加强复杂语流、细节抓取和高阶听力条件下的稳定输出训练。"
        };

      case "all-mid":
        return {
          title: "听力有一定基础，但不够稳",
          description:
            "学生已经具备一定听力基础，但整体正确率仍在中间水平，说明在信息密度上来之后，容易出现漏听、误判或反应变慢。",
          suggestion:
            "建议通过更多分层练习，把听力识别从“能听到一些”提升到“能稳定做对”。"
        };

      case "strong":
        return {
          title: "听力板块整体较稳",
          description:
            "学生在基础听辨、信息捕捉和中高层处理上的整体表现较稳定，说明听力板块已经具备较好的能力基础。",
          suggestion:
            "建议继续保持听力稳定度，并进一步强化高阶细节和速度适应能力。"
        };

      default:
        return {
          title: "听力能力正在建立中",
          description:
            "学生在听力板块已经具备一定能力，但不同层级之间仍有差距，说明当前还处于从“听得到”向“听得稳、做得对”过渡的阶段。",
          suggestion:
            "建议继续进行分层听力训练，先稳住基础识别，再逐步提升复杂信息处理能力。"
        };
    }
  }

  function getSectionDiagnosis(section, distribution) {
    var aPercentRaw = toPercentOrNull(
      distribution.A.correct,
      distribution.A.total
    );
    var bPercentRaw = toPercentOrNull(
      distribution.B.correct,
      distribution.B.total
    );
    var cPercentRaw = toPercentOrNull(
      distribution.C.correct,
      distribution.C.total
    );
    var aBand = getBandFromNullable(aPercentRaw);
    var bBand = getBandFromNullable(bPercentRaw);
    var cBand = getBandFromNullable(cPercentRaw);
    var overallPercent = getOverallPercent(distribution);
    var pattern = detectPattern(aPercentRaw, bPercentRaw, cPercentRaw);
    var copy;

    if (section === "foundation") {
      copy = getFoundationCopy(pattern);
    } else if (section === "reading") {
      copy = getReadingCopy(pattern);
    } else {
      copy = getListeningCopy(pattern);
    }

    return {
      section: section,
      pattern: pattern,
      overallPercent: overallPercent,
      aPercent: aPercentRaw === null ? 0 : aPercentRaw,
      bPercent: bPercentRaw === null ? 0 : bPercentRaw,
      cPercent: cPercentRaw === null ? 0 : cPercentRaw,
      aBand: aBand,
      bBand: bBand,
      cBand: cBand,
      title: copy.title,
      description: copy.description,
      suggestion: copy.suggestion
    };
  }

  demo.resultDiagnosis = {
    getSectionDiagnosis: getSectionDiagnosis
  };
}());
