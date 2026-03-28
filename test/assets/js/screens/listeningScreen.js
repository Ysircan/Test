/* Purpose: Listening step renderer and event binding for restored fill blank, HIW, and WFD listening screens in the static placement demo application. */

(function () {
  var demo = window.PlacementDemo = window.PlacementDemo || {};
  var helpers = demo.helpers;
  demo.screens = demo.screens || {};

  var LISTENING_BODY_CLASSES = [
    "is-listening-intro-screen",
    "is-listening-complete-screen",
    "is-listening-screen",
    "is-listening-fill-screen",
    "is-hiw-screen",
    "is-wfd-screen"
  ];

  function clearListeningBodyClasses() {
    if (!document.body) {
      return;
    }

    LISTENING_BODY_CLASSES.forEach(function (className) {
      document.body.classList.remove(className);
    });

    document.body.classList.remove("drag-lock");
  }

  function syncListeningBodyClass(step) {
    if (!document.body) {
      return;
    }

    clearListeningBodyClasses();
    document.body.classList.remove(
      "is-start-screen",
      "is-pretest-screen",
      "is-vocab-intro-screen",
      "is-vocab-question-screen",
      "is-reading-intro-screen",
      "is-reading-screen",
      "is-reading-blank-screen",
      "is-reading-choice-screen",
      "is-reading-reorder-screen"
    );
    document.body.classList.add("is-listening-screen");

    if (step === "listeningQuestion") {
      document.body.classList.add("is-listening-fill-screen");
      return;
    }

    if (step === "hiwQuestion") {
      document.body.classList.add("is-hiw-screen");
      return;
    }

    document.body.classList.add("is-wfd-screen");
  }

  function normalizeAudioUrl(audioUrl) {
    var value = String(audioUrl == null ? "" : audioUrl).trim();

    if (!value) {
      return "";
    }

    if (/^(https?:)?\/\//i.test(value)) {
      return value;
    }

    if (value.indexOf("/audio/") === 0) {
      return "../public" + value;
    }

    if (value.indexOf("audio/") === 0) {
      return "../public/" + value;
    }

    return value;
  }

  function formatTime(totalSeconds) {
    if (!isFinite(totalSeconds) || totalSeconds < 0) {
      return "0:00";
    }

    var minutes = Math.floor(totalSeconds / 60);
    var seconds = Math.floor(totalSeconds % 60);

    return minutes + ":" + String(seconds).padStart(2, "0");
  }

  function getListeningHeading(step) {
    if (step === "listeningQuestion") {
      return "Listening Fill in the Blanks";
    }

    if (step === "hiwQuestion") {
      return "Highlight Incorrect Words";
    }

    return "Write From Dictation";
  }

  function renderAudioMarkup(audioUrl, includeHint) {
    var normalizedUrl = normalizeAudioUrl(audioUrl);

    if (!normalizedUrl) {
      return "<div class=\"listening-audio-placeholder\">Audio unavailable.</div>";
    }

    return [
      "<audio class=\"listening-audio-element\" data-role=\"audio\" preload=\"metadata\" src=\"",
      helpers.escapeAttribute(normalizedUrl),
      "\"></audio>",
      "<div class=\"listening-audio-controls\">",
      "  <button type=\"button\" class=\"listening-audio-play\" data-action=\"toggle-audio\">Play Audio</button>",
      "  <div class=\"listening-audio-time\" data-role=\"audio-time\">0:00 / 0:00</div>",
      "</div>",
      "<div class=\"listening-audio-progress\" data-role=\"audio-progress\" aria-hidden=\"true\">",
      "  <div class=\"listening-audio-progress-fill\" data-role=\"audio-progress-fill\" style=\"width:0%;\"></div>",
      "</div>",
      includeHint
        ? "<div class=\"listening-audio-hint\" data-role=\"audio-hint\"></div>"
        : ""
    ].join("");
  }

  function buildListeningFillTranscriptParts(item) {
    var text = helpers.trimMultilineText(item && item.transcript ? item.transcript : "");
    var blankRegex = /\[blank-(\d+)\]/g;
    var parts = [];
    var lastIndex = 0;
    var match;

    while ((match = blankRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          value: text.slice(lastIndex, match.index)
        });
      }

      parts.push({
        type: "blank",
        blankNumber: Number(match[1])
      });
      lastIndex = blankRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push({
        type: "text",
        value: text.slice(lastIndex)
      });
    }

    return parts;
  }

  function renderListeningFillPassage(item) {
    return buildListeningFillTranscriptParts(item).map(function (part, index) {
      if (part.type === "text") {
        return [
          "<span class=\"listening-fill-text\" data-fragment-index=\"",
          index,
          "\">",
          helpers.escapeHtml(part.value).replace(/\n/g, "<br />"),
          "</span>"
        ].join("");
      }

      return [
        "<span class=\"listening-fill-blank\">",
        "  <input",
        " type=\"text\"",
        " class=\"listening-fill-blankInput\"",
        " data-blank-number=\"",
        helpers.escapeAttribute(part.blankNumber),
        "\"",
        " aria-label=\"Blank ",
        helpers.escapeAttribute(part.blankNumber),
        "\"",
        " autocomplete=\"off\"",
        " spellcheck=\"false\"",
        " />",
        "</span>"
      ].join("");
    }).join("");
  }

  function renderHiwWords(item) {
    var words = helpers.trimMultilineText(item && item.transcript ? item.transcript : "").split(/\s+/).filter(Boolean);

    return words.map(function (word, index) {
      return [
        "<span>",
        "  <span",
        " class=\"listening-hiw-word\"",
        " data-word-index=\"",
        helpers.escapeAttribute(index),
        "\"",
        " data-word-text=\"",
        helpers.escapeAttribute(word),
        "\"",
        " role=\"button\"",
        " tabindex=\"0\"",
        " aria-pressed=\"false\">",
        helpers.escapeHtml(word),
        "</span>",
        index !== words.length - 1 ? " " : "",
        "</span>"
      ].join("");
    }).join("");
  }

  function renderListeningFillScreen(item) {
    return [
      "<main class=\"listening-fill-page\">",
      "  <div class=\"listening-fill-shell\">",
      "    <section class=\"listening-fill-card\">",
      "      <h1 class=\"listening-fill-title\">Listening Fill in the Blanks</h1>",
      "      <p class=\"listening-fill-intro\">",
      helpers.escapeHtml(item.prompt || ""),
      "      </p>",
      "      <div class=\"listening-fill-audioBox\">",
      "        <div class=\"listening-fill-audioArea\">",
      "          <p class=\"listening-audio-note\" data-role=\"audio-note\">This audio can be played up to 2 times. Remaining: 2</p>",
      renderAudioMarkup(item.audioUrl, false),
      "        </div>",
      "      </div>",
      "      <div class=\"listening-fill-passage\">",
      renderListeningFillPassage(item),
      "      </div>",
      "      <div class=\"listening-fill-actions\">",
      "        <button type=\"button\" class=\"listening-next-button\" data-action=\"listening-next\">Next</button>",
      "      </div>",
      "    </section>",
      "  </div>",
      "</main>"
    ].join("");
  }

  function renderHiwScreen(item) {
    return [
      "<main class=\"listening-hiw-screen\">",
      "  <section class=\"listening-hiw-shell\">",
      "    <header class=\"listening-hiw-header\">",
      "      <h1 class=\"listening-hiw-title\">Highlight Incorrect Words</h1>",
      "      <p class=\"listening-hiw-subtitle\">",
      helpers.escapeHtml(item.instruction || item.prompt || "Please listen to the recording and click the words that do not match the audio."),
      "      </p>",
      "    </header>",
      "    <div class=\"listening-hiw-audioCard\">",
      "      <div class=\"listening-audio-note listening-audio-note--center\" data-role=\"audio-note\">This audio can be played up to 2 times. Remaining: 2</div>",
      renderAudioMarkup(item.audioUrl, true),
      "    </div>",
      "    <div class=\"listening-hiw-textCard\">",
      "      <div class=\"listening-hiw-passage\">",
      renderHiwWords(item),
      "      </div>",
      "    </div>",
      "    <div class=\"listening-hiw-bottomBar\">",
      "      <button type=\"button\" class=\"listening-hiw-nextButton\" data-action=\"hiw-next\">Next</button>",
      "    </div>",
      "  </section>",
      "</main>"
    ].join("");
  }

  function renderWfdScreen(item) {
    return [
      "<main class=\"listening-wfd-wrapper\">",
      "  <div class=\"listening-wfd-container\">",
      "    <header class=\"listening-wfd-header\">",
      "      <div class=\"listening-wfd-title\">Write From Dictation</div>",
      "      <div class=\"listening-wfd-subtitle\">",
      helpers.escapeHtml(item.prompt || "Please type exactly what you hear."),
      "      </div>",
      "    </header>",
      "    <div class=\"listening-wfd-block\">",
      "      <div class=\"listening-wfd-blockTitle\">Please type exactly what you hear.</div>",
      "      <div class=\"listening-wfd-audioArea\">",
      "        <div class=\"listening-audio-note\" data-role=\"audio-note\">This audio can be played 2 more times.</div>",
      renderAudioMarkup(item.audioUrl, true),
      "      </div>",
      "      <textarea class=\"listening-wfd-textarea\" data-field=\"wfd-answer\" placeholder=\"Type what you hear\"></textarea>",
      "    </div>",
      "    <div class=\"listening-wfd-cta\">",
      "      <button type=\"button\" class=\"listening-next-button\" data-action=\"wfd-next\">Next</button>",
      "    </div>",
      "  </div>",
      "</main>"
    ].join("");
  }

  function renderListeningEmptyScreen(step) {
    return [
      "<main class=\"listening-empty-page\">",
      "  <div class=\"listening-empty-card\">",
      "    <h1 class=\"listening-fill-title\">",
      helpers.escapeHtml(getListeningHeading(step)),
      "</h1>",
      "    <p class=\"listening-fill-intro\">Listening item is not available.</p>",
      "  </div>",
      "</main>"
    ].join("");
  }

  function renderListeningScreen(state) {
    var item = demo.flow.getCurrentItem(state);

    syncListeningBodyClass(state.step);

    if (!item) {
      return renderListeningEmptyScreen(state.step);
    }

    if (state.step === "listeningQuestion") {
      return renderListeningFillScreen(item);
    }

    if (state.step === "hiwQuestion") {
      return renderHiwScreen(item);
    }

    return renderWfdScreen(item);
  }

  function bindAudioController(root, options) {
    var config = options || {};
    var audio = root.querySelector("[data-role='audio']");
    var button = root.querySelector("[data-action='toggle-audio']");
    var timeNode = root.querySelector("[data-role='audio-time']");
    var track = root.querySelector("[data-role='audio-progress']");
    var fill = root.querySelector("[data-role='audio-progress-fill']");
    var noteNode = root.querySelector("[data-role='audio-note']");
    var hintNode = root.querySelector("[data-role='audio-hint']");
    var state = {
      maxPlays: Number(config.maxPlays || 2),
      playCount: 0,
      countedCurrentPlay: false,
      isPlaying: false,
      currentTime: 0,
      duration: 0
    };

    function updateUi() {
      var remainingPlays = Math.max(0, state.maxPlays - state.playCount);
      var progressPercent = state.duration > 0
        ? Math.min((state.currentTime / state.duration) * 100, 100)
        : 0;
      var noteText = typeof config.getNoteText === "function"
        ? config.getNoteText({
            maxPlays: state.maxPlays,
            remainingPlays: remainingPlays,
            playCount: state.playCount,
            isPlaying: state.isPlaying
          })
        : "";
      var hintText = typeof config.getHintText === "function"
        ? config.getHintText({
            maxPlays: state.maxPlays,
            remainingPlays: remainingPlays,
            playCount: state.playCount,
            isPlaying: state.isPlaying
          })
        : "";
      var exhausted = !state.isPlaying && state.playCount >= state.maxPlays;
      var buttonLabel = state.isPlaying
        ? (config.pauseLabel || "Pause")
        : exhausted
          ? (config.exhaustedLabel || "No Plays Left")
          : (config.playLabel || "Play Audio");

      if (button) {
        button.textContent = buttonLabel;
        button.disabled = exhausted;
      }

      if (timeNode) {
        timeNode.textContent = formatTime(state.currentTime) + " / " + formatTime(state.duration);
      }

      if (fill) {
        fill.style.width = progressPercent + "%";
        fill.style.background = state.isPlaying ? "#8d95a1" : "#111111";
      }

      if (track) {
        track.style.background = state.isPlaying ? "#cfd3da" : "#eceff3";
      }

      if (noteNode && noteText) {
        noteNode.textContent = noteText;
      }

      if (hintNode) {
        hintNode.textContent = hintText;
      }
    }

    function stopAudio(clearSource) {
      if (!audio) {
        return;
      }

      audio.pause();
      audio.currentTime = 0;
      state.isPlaying = false;
      state.currentTime = 0;
      state.countedCurrentPlay = false;

      if (clearSource) {
        audio.removeAttribute("src");
        audio.load();
      }

      updateUi();
    }

    if (!audio || !button) {
      return {
        stop: function () {}
      };
    }

    audio.addEventListener("loadedmetadata", function () {
      state.duration = isFinite(audio.duration) ? audio.duration : 0;
      state.currentTime = audio.currentTime || 0;
      state.isPlaying = false;
      state.countedCurrentPlay = false;
      updateUi();
    });

    audio.addEventListener("timeupdate", function () {
      state.currentTime = audio.currentTime || 0;
      updateUi();
    });

    audio.addEventListener("pause", function () {
      if (!audio.ended) {
        state.isPlaying = false;
        updateUi();
      }
    });

    audio.addEventListener("ended", function () {
      audio.currentTime = 0;
      state.isPlaying = false;
      state.currentTime = 0;
      state.countedCurrentPlay = false;
      updateUi();
    });

    button.addEventListener("click", function () {
      var endedLike;
      var freshStart;

      if (!audio.getAttribute("src")) {
        return;
      }

      if (state.isPlaying) {
        audio.pause();
        state.isPlaying = false;
        updateUi();
        return;
      }

      endedLike = audio.duration > 0 && audio.currentTime >= audio.duration - 0.15;
      freshStart = audio.currentTime <= 0.15 || audio.ended || endedLike;

      if (freshStart && !state.countedCurrentPlay) {
        if (state.playCount >= state.maxPlays) {
          audio.pause();
          audio.currentTime = 0;
          state.currentTime = 0;
          state.isPlaying = false;
          updateUi();
          return;
        }

        if (endedLike || audio.ended) {
          audio.currentTime = 0;
          state.currentTime = 0;
        }

        state.playCount += 1;
        state.countedCurrentPlay = true;
      }

      audio.play().then(function () {
        state.isPlaying = true;
        updateUi();
      }).catch(function () {
        state.isPlaying = false;
        updateUi();
      });

      updateUi();
    });

    updateUi();

    return {
      stop: stopAudio
    };
  }

  function bindListeningFill(root, item) {
    var button = root.querySelector("[data-action='listening-next']");
    var inputs = root.querySelectorAll("[data-blank-number]");
    var answersByBlank = {};
    var audioController = bindAudioController(root, {
      maxPlays: 2,
      getNoteText: function (info) {
        return "This audio can be played up to " + info.maxPlays + " times. Remaining: " + info.remainingPlays;
      }
    });

    function syncAnswers() {
      inputs.forEach(function (input) {
        var blankNumber = input.getAttribute("data-blank-number") || "";
        var value = input.value.trim();

        if (value) {
          answersByBlank[blankNumber] = value;
        } else {
          delete answersByBlank[blankNumber];
        }
      });
    }

    inputs.forEach(function (input) {
      input.addEventListener("input", syncAnswers);
    });

    if (!button) {
      return;
    }

    button.addEventListener("click", function () {
      syncAnswers();
      audioController.stop(false);
      demo.flow.completeListeningFillBlank({
        answer: {
          questionId: item ? item.id : "",
          answersByBlank: helpers.clonePlainData(answersByBlank, {})
        }
      });
    });
  }

  function bindHiw(root, item) {
    var button = root.querySelector("[data-action='hiw-next']");
    var wordButtons = root.querySelectorAll("[data-word-index]");
    var selectedWordsByIndex = {};
    var ignoreNextClick = false;
    var maxPlays = Number(item && item.maxPlays ? item.maxPlays : 2);
    var audioController = bindAudioController(root, {
      maxPlays: maxPlays,
      getNoteText: function (info) {
        return "This audio can be played up to " + info.maxPlays + " times. Remaining: " + info.remainingPlays;
      },
      getHintText: function (info) {
        if (info.isPlaying) {
          return "Progress is locked during playback.";
        }

        if (info.remainingPlays === 0) {
          return "You have reached the play limit.";
        }

        return "Play the audio to start answering. The progress bar turns gray during playback.";
      }
    });

    function syncSelection() {
      wordButtons.forEach(function (wordButton) {
        var wordIndex = wordButton.getAttribute("data-word-index") || "";
        var isSelected = Boolean(selectedWordsByIndex[wordIndex]);

        wordButton.classList.toggle("is-selected", isSelected);
        wordButton.setAttribute("aria-pressed", isSelected ? "true" : "false");
      });
    }

    function toggleWord(wordButton) {
      var wordIndex = wordButton.getAttribute("data-word-index") || "";
      var rawText = wordButton.getAttribute("data-word-text") || "";

      if (selectedWordsByIndex[wordIndex]) {
        delete selectedWordsByIndex[wordIndex];
      } else {
        selectedWordsByIndex[wordIndex] = {
          index: Number(wordIndex),
          text: rawText,
          normalizedWord: helpers.normalizeWordToken(rawText)
        };
      }

      syncSelection();
    }

    wordButtons.forEach(function (wordButton) {
      wordButton.addEventListener("click", function () {
        if (ignoreNextClick) {
          ignoreNextClick = false;
          return;
        }

        toggleWord(wordButton);
      });

      wordButton.addEventListener("touchstart", function (event) {
        event.preventDefault();
        ignoreNextClick = true;
        toggleWord(wordButton);
      }, { passive: false });

      wordButton.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleWord(wordButton);
        }
      });
    });

    syncSelection();

    if (!button) {
      return;
    }

    button.addEventListener("click", function () {
      var selectedWords = Object.keys(selectedWordsByIndex).sort(function (left, right) {
        return Number(left) - Number(right);
      }).map(function (key) {
        return selectedWordsByIndex[key];
      });

      audioController.stop(true);
      demo.flow.completeHiw({
        answer: {
          questionId: item ? item.id : "",
          selectedWords: helpers.clonePlainData(selectedWords, [])
        }
      });
    });
  }

  function bindWfd(root, item) {
    var button = root.querySelector("[data-action='wfd-next']");
    var textarea = root.querySelector("[data-field='wfd-answer']");
    var audioController = bindAudioController(root, {
      maxPlays: 2,
      getNoteText: function (info) {
        return "This audio can be played " + info.remainingPlays + " more times.";
      },
      getHintText: function (info) {
        if (info.isPlaying) {
          return "Progress is locked during playback.";
        }

        if (info.remainingPlays === 0) {
          return "You have reached the play limit.";
        }

        return "Play the audio to start answering.";
      }
    });

    if (!button) {
      return;
    }

    button.addEventListener("click", function () {
      audioController.stop(true);
      demo.flow.completeWfd({
        answer: {
          questionId: item ? item.id : "",
          text: textarea ? textarea.value.trim() : ""
        }
      });
    });
  }

  function bindListeningScreen(root, state) {
    var item = demo.flow.getCurrentItem(state);

    if (!item) {
      return;
    }

    if (state.step === "listeningQuestion") {
      bindListeningFill(root, item);
      return;
    }

    if (state.step === "hiwQuestion") {
      bindHiw(root, item);
      return;
    }

    bindWfd(root, item);
  }

  demo.screens.listeningScreen = {
    render: renderListeningScreen,
    bind: bindListeningScreen
  };
}());
