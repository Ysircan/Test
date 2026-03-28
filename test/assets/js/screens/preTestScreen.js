/* Purpose: Static restoration of the real PreTestIntro multi-step form for the static placement demo application. */

(function () {
  var demo = window.PlacementDemo = window.PlacementDemo || {};
  var helpers = demo.helpers || {
    escapeHtml: function (value) {
      return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    },
    escapeAttribute: function (value) {
      return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }
  };

  demo.screens = demo.screens || {};

  function createDraft(state) {
    return {
      step: 1,
      hasTriedContinue: false,
      studentName: String(state && state.studentName ? state.studentName : ""),
      contactValue: String(state && state.contactValue ? state.contactValue : ""),
      targetScore: String(state && state.targetScore ? state.targetScore : ""),
      selectedExam: state && (state.selectedExam === "quick" || state.selectedExam === "full")
        ? state.selectedExam
        : ""
    };
  }

  function ensureBodyClass() {
    if (!document.body) {
      return;
    }

    document.body.classList.add("is-pretest-screen");
    document.body.classList.remove("is-start-screen");
  }

  function clearBodyClass() {
    if (!document.body) {
      return;
    }

    document.body.classList.remove("is-pretest-screen");
  }

  function getParsedTargetScore(draft) {
    return Number(draft.targetScore);
  }

  function hasStudentName(draft) {
    return draft.studentName.trim() !== "";
  }

  function hasContactValue(draft) {
    return draft.contactValue.trim() !== "";
  }

  function isTargetScoreValid(draft) {
    var parsedTargetScore = getParsedTargetScore(draft);

    return draft.targetScore.trim() !== "" &&
      !Number.isNaN(parsedTargetScore) &&
      parsedTargetScore >= 30 &&
      parsedTargetScore <= 90;
  }

  function getStepTitle(step) {
    if (step === 1) {
      return "请填写你的基本信息";
    }

    if (step === 2) {
      return "请输入你的目标分数";
    }

    return "请选择测评类型";
  }

  function getStepDescription(step) {
    if (step === 1) {
      return "开始测评前，请先填写姓名与手机号或邮箱。";
    }

    if (step === 2) {
      return "请输入你的目标分数，分数范围为 30 到 90 分。";
    }

    return "请在同一个入口页内选择快速测评或完整测评，系统会根据你的选择进入对应流程。";
  }

  function getStepLabel(step) {
    return "第 " + step + " 步，共 3 步";
  }

  function renderStepOne(draft) {
    var showError = draft.hasTriedContinue && (!hasStudentName(draft) || !hasContactValue(draft));

    return [
      "<div class=\"pretest-inputWrap\">",
      "  <div class=\"pretest-fieldGroup\">",
      "    <span class=\"pretest-fieldLabel\">姓名</span>",
      "    <input class=\"pretest-input\" type=\"text\" data-field=\"studentName\" placeholder=\"请输入你的姓名\" value=\"" + helpers.escapeAttribute(draft.studentName) + "\" />",
      "  </div>",
      "  <div class=\"pretest-fieldGroup\">",
      "    <span class=\"pretest-fieldLabel\">手机号或邮箱</span>",
      "    <input class=\"pretest-input\" type=\"text\" data-field=\"contactValue\" placeholder=\"请输入手机号或邮箱\" value=\"" + helpers.escapeAttribute(draft.contactValue) + "\" />",
      "  </div>",
      showError
        ? "  <p class=\"pretest-errorText\">姓名和手机号或邮箱都需要填写</p>"
        : "",
      "</div>"
    ].join("");
  }

  function renderStepTwo(draft) {
    var showError = (draft.targetScore.trim() !== "" || draft.hasTriedContinue) && !isTargetScoreValid(draft);

    return [
      "<div class=\"pretest-inputWrap\">",
      "  <input class=\"pretest-input\" type=\"number\" min=\"30\" max=\"90\" inputmode=\"numeric\" data-field=\"targetScore\" placeholder=\"请输入 30 - 90 之间的分数\" value=\"" + helpers.escapeAttribute(draft.targetScore) + "\" />",
      showError
        ? "  <p class=\"pretest-errorText\">目标分数必须填写在 30 到 90 之间</p>"
        : "",
      "</div>"
    ].join("");
  }

  function renderExamOption(examValue, title, description, selectedExam) {
    var optionClassName = "pretest-optionCard";

    if (selectedExam === examValue) {
      optionClassName += " pretest-optionCardActive";
    }

    return [
      "<button",
      "  type=\"button\"",
      "  class=\"" + optionClassName + "\"",
      "  data-exam=\"" + helpers.escapeAttribute(examValue) + "\"",
      "  aria-pressed=\"" + (selectedExam === examValue ? "true" : "false") + "\"",
      ">",
      "  <div class=\"pretest-optionTitle\">" + helpers.escapeHtml(title) + "</div>",
      "  <div class=\"pretest-optionDesc\">" + helpers.escapeHtml(description) + "</div>",
      "</button>"
    ].join("");
  }

  function renderStepThree(draft) {
    return [
      "<div class=\"pretest-optionGrid\">",
      renderExamOption("quick", "快速测评", "用较短时间完成基础测评，适合快速初筛。", draft.selectedExam),
      renderExamOption("full", "完整测评", "进入完整测评流程，适合正式分班与能力判断。", draft.selectedExam),
      "</div>"
    ].join("");
  }

  function renderStepContent(draft) {
    if (draft.step === 1) {
      return renderStepOne(draft);
    }

    if (draft.step === 2) {
      return renderStepTwo(draft);
    }

    return renderStepThree(draft);
  }

  function renderScreenMarkup(draft) {
    ensureBodyClass();

    return [
      "<div class=\"pretest-shell\">",
      "  <div class=\"pretest-container\">",
      "    <div class=\"pretest-card\">",
      "      <div class=\"pretest-step\">" + helpers.escapeHtml(getStepLabel(draft.step)) + "</div>",
      "      <h1 class=\"pretest-title\">" + helpers.escapeHtml(getStepTitle(draft.step)) + "</h1>",
      "      <p class=\"pretest-desc\">" + helpers.escapeHtml(getStepDescription(draft.step)) + "</p>",
      renderStepContent(draft),
      "      <div class=\"pretest-footer\">",
      "        <button class=\"pretest-backBtn\" type=\"button\" data-action=\"back\"" + (draft.step === 1 ? " disabled" : "") + ">上一步</button>",
      draft.step < 3
        ? "        <button class=\"pretest-btn\" type=\"button\" data-action=\"next\">下一步</button>"
        : "        <button class=\"pretest-btn\" type=\"button\" data-action=\"start\"" + (draft.selectedExam ? "" : " disabled") + ">开始测评</button>",
      "      </div>",
      "    </div>",
      "  </div>",
      "</div>"
    ].join("");
  }

  function renderPreTestScreen(state) {
    return renderScreenMarkup(createDraft(state));
  }

  function bindPreTestScreen(root, state) {
    var draft = createDraft(state);

    function paint() {
      root.innerHTML = renderScreenMarkup(draft);
      bindCurrentView();
    }

    function bindInput(fieldName) {
      var field = root.querySelector("[data-field='" + fieldName + "']");

      if (!field) {
        return;
      }

      field.addEventListener("input", function (event) {
        draft[fieldName] = event.target.value;
      });
    }

    function handleNext() {
      if (draft.step === 1 && (!hasStudentName(draft) || !hasContactValue(draft))) {
        draft.hasTriedContinue = true;
        paint();
        return;
      }

      if (draft.step === 2 && !isTargetScoreValid(draft)) {
        draft.hasTriedContinue = true;
        paint();
        return;
      }

      if (draft.step < 3) {
        draft.hasTriedContinue = false;
        draft.step += 1;
        paint();
      }
    }

    function handleBack() {
      if (draft.step > 1) {
        draft.hasTriedContinue = false;
        draft.step -= 1;
        paint();
      }
    }

    function handleStart() {
      if (!hasStudentName(draft) || !hasContactValue(draft) || !isTargetScoreValid(draft) || !draft.selectedExam) {
        draft.hasTriedContinue = true;
        paint();
        return;
      }

      clearBodyClass();
      demo.flow.completePreTest({
        studentName: draft.studentName.trim(),
        contactValue: draft.contactValue.trim(),
        targetScore: String(getParsedTargetScore(draft)),
        selectedExam: draft.selectedExam
      });
    }

    function bindCurrentView() {
      var backButton = root.querySelector("[data-action='back']");
      var nextButton = root.querySelector("[data-action='next']");
      var startButton = root.querySelector("[data-action='start']");
      var examButtons;
      var index;

      bindInput("studentName");
      bindInput("contactValue");
      bindInput("targetScore");

      if (backButton) {
        backButton.addEventListener("click", handleBack);
      }

      if (nextButton) {
        nextButton.addEventListener("click", handleNext);
      }

      if (startButton) {
        startButton.addEventListener("click", handleStart);
      }

      examButtons = root.querySelectorAll("[data-exam]");

      for (index = 0; index < examButtons.length; index += 1) {
        examButtons[index].addEventListener("click", function () {
          draft.selectedExam = this.getAttribute("data-exam") || "";
          paint();
        });
      }
    }

    paint();
  }

  demo.screens.preTestScreen = {
    render: renderPreTestScreen,
    bind: bindPreTestScreen
  };
}());
