/* Purpose: General helper utilities for safe HTML rendering and simple answer interactions in the static placement demo application. */

(function () {
  var demo = window.PlacementDemo = window.PlacementDemo || {};

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, "&#96;");
  }

  function trimMultilineText(value) {
    return String(value == null ? "" : value)
      .replace(/\r/g, "")
      .replace(/^\s*\n/, "")
      .replace(/\n\s*$/, "");
  }

  function formatMultilineText(value) {
    var text = trimMultilineText(value);

    if (!text) {
      return "";
    }

    return text.split(/\n\s*\n/).map(function (paragraph) {
      return "<p>" + escapeHtml(paragraph).replace(/\n/g, "<br />") + "</p>";
    }).join("");
  }

  function getOptionText(option) {
    if (option && typeof option === "object") {
      return option.text || option.label || option.id || "";
    }

    return String(option == null ? "" : option);
  }

  function arrayMove(list, fromIndex, toIndex) {
    var next = Array.isArray(list) ? list.slice() : [];
    var item;

    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= next.length ||
      toIndex >= next.length ||
      fromIndex === toIndex
    ) {
      return next;
    }

    item = next.splice(fromIndex, 1)[0];
    next.splice(toIndex, 0, item);

    return next;
  }

  function clonePlainData(value, fallback) {
    try {
      return JSON.parse(JSON.stringify(value == null ? fallback : value));
    } catch (error) {
      return fallback;
    }
  }

  function normalizeWordToken(token) {
    return String(token == null ? "" : token)
      .replace(/^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g, "")
      .toLowerCase();
  }

  function extractWordValue(value) {
    if (value && typeof value === "object") {
      if (typeof value.normalizedWord === "string" && value.normalizedWord) {
        return value.normalizedWord;
      }

      if (typeof value.text === "string" && value.text) {
        return value.text;
      }

      if (typeof value.word === "string" && value.word) {
        return value.word;
      }
    }

    return value;
  }

  function normalizeWordList(values) {
    if (!Array.isArray(values)) {
      return [];
    }

    return values.map(function (value) {
      return normalizeWordToken(extractWordValue(value));
    }).filter(Boolean);
  }

  function tokenizeTextWithWhitespace(text) {
    return trimMultilineText(text).match(/\S+|\s+/g) || [];
  }

  function whitespaceToHtml(text) {
    return escapeHtml(String(text == null ? "" : text))
      .replace(/ /g, "&nbsp;")
      .replace(/\n/g, "<br />");
  }

  function formatCalendarDate(value) {
    var date = value instanceof Date ? value : new Date(value);
    var months;

    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return "";
    }

    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
  }

  function formatExamLabel(examValue) {
    if (examValue === "quick") {
      return "Quick Exam";
    }

    if (examValue === "full") {
      return "Full Exam";
    }

    return "Not Selected";
  }

  function getBandRangeFromScore(score) {
    if (score < 15) return { min: 0, max: 15 };
    if (score < 30) return { min: 15, max: 30 };
    if (score < 42) return { min: 30, max: 42 };
    if (score < 50) return { min: 42, max: 50 };
    if (score < 58) return { min: 50, max: 58 };
    return { min: 58, max: null };
  }

  function setScaffoldPassthrough(active) {
    var passthrough = !!active;
    var demoShell = document.querySelector(".demo-shell");
    var demoHeader = document.querySelector(".demo-header");
    var demoApp = document.getElementById("app");

    if (demoShell) {
      demoShell.classList.toggle("is-passthrough", passthrough);
    }

    if (demoHeader) {
      demoHeader.classList.toggle("is-passthrough", passthrough);
    }

    if (demoApp) {
      demoApp.classList.toggle("is-passthrough", passthrough);
    }
  }

  demo.helpers = {
    escapeHtml: escapeHtml,
    escapeAttribute: escapeAttribute,
    trimMultilineText: trimMultilineText,
    formatMultilineText: formatMultilineText,
    getOptionText: getOptionText,
    arrayMove: arrayMove,
    clonePlainData: clonePlainData,
    normalizeWordToken: normalizeWordToken,
    normalizeWordList: normalizeWordList,
    tokenizeTextWithWhitespace: tokenizeTextWithWhitespace,
    whitespaceToHtml: whitespaceToHtml,
    formatCalendarDate: formatCalendarDate,
    formatExamLabel: formatExamLabel,
    getBandRangeFromScore: getBandRangeFromScore,
    setScaffoldPassthrough: setScaffoldPassthrough
  };
}());
