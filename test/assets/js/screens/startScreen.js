/* Purpose: Static restoration of the real StartScreen layout and copy for the static placement demo application. */

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
    }
  };

  demo.screens = demo.screens || {};

  function getStatusMessage(validationState, validationMessage) {
    if (validationMessage) {
      return validationMessage;
    }

    if (validationState === "error") {
      return "当前链接无法使用，请联系顾问重新获取测评入口。";
    }

    if (validationState === "loading") {
      return "正在验证机构与顾问信息，请稍候。";
    }

    return null;
  }

  function getMetaText(state) {
    var agencyName = String(state && state.agencyName ? state.agencyName : "").trim();
    var agencyCode = String(state && state.agencyCode ? state.agencyCode : "").trim();
    var agentName = String(state && state.agentName ? state.agentName : "").trim();
    var safeAgencyName = agencyName || agencyCode || "";

    if (safeAgencyName && agentName) {
      return safeAgencyName + " · " + agentName;
    }

    return safeAgencyName || agentName || "";
  }

  function renderStartScreen(state) {
    var validationState = state && typeof state.validationState === "string" ? state.validationState : "success";
    var validationMessage = state && state.validationMessage ? state.validationMessage : null;
    var statusMessage = getStatusMessage(validationState, validationMessage);
    var metaText = getMetaText(state);
    var canStart = !(state && state.canStart === false);

    if (document.body) {
      document.body.classList.add("is-start-screen");
    }

    return [
      "<div class=\"start-page\">",
      "  <div class=\"start-wrapper\">",
      "    <h1 class=\"start-title\">英语水平测评</h1>",
      "    <div class=\"start-subtitle\">了解你当前的英语基础，并找到接下来最需要提升的方向。</div>",
      "    <div class=\"start-meta\">",
      "      <div class=\"start-metaItem\">词汇能力测评</div>",
      "      <div class=\"start-metaItem\">阅读理解测评</div>",
      "      <div class=\"start-metaItem\">听力识别测评</div>",
      "    </div>",
      "    <div class=\"start-startSection\">",
      "      <div class=\"start-startInfo\">",
      validationState !== "success" && statusMessage
        ? "        <div class=\"start-subText\">" + helpers.escapeHtml(statusMessage) + "</div>"
        : "",
      "      </div>",
      "      <div class=\"start-startWrap\">",
      "        <button class=\"start-ctaBtn\" type=\"button\" data-action=\"start-flow\"" + (canStart ? "" : " disabled") + ">",
      "          <span class=\"start-ctaMain\">开始测评</span>",
      "          <span class=\"start-ctaArrow\" aria-hidden=\"true\">→</span>",
      "        </button>",
      metaText
        ? "        <div class=\"start-metaText\">" + helpers.escapeHtml(metaText) + "</div>"
        : "",
      "      </div>",
      "    </div>",
      "  </div>",
      "</div>"
    ].join("");
  }

  function bindStartScreen(root) {
    var button = root.querySelector("[data-action='start-flow']");

    if (!button) {
      return;
    }

    button.addEventListener("click", function () {
      if (document.body) {
        document.body.classList.remove("is-start-screen");
      }

      demo.flow.startAssessment();
    });
  }

  demo.screens.startScreen = {
    render: renderStartScreen,
    bind: bindStartScreen
  };
}());
