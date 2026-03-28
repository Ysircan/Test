/* Purpose: Reading step renderer and event binding for restored blank, single-choice, and reorder reading screens in the static placement demo application. */

(function () {
  var demo = window.PlacementDemo = window.PlacementDemo || {};
  var helpers = demo.helpers;
  demo.screens = demo.screens || {};

  var READING_BODY_CLASSES = [
    "is-reading-intro-screen",
    "is-reading-screen",
    "is-reading-blank-screen",
    "is-reading-choice-screen",
    "is-reading-reorder-screen"
  ];

  function getReadingTitle(step) {
    if (step === "readingQuestion") {
      return "Reading Blank";
    }

    if (step === "readingReorderQuestion") {
      return "Reading Reorder";
    }

    return "Reading Single Choice";
  }

  function clearReadingBodyClass() {
    if (!document.body) {
      return;
    }

    READING_BODY_CLASSES.forEach(function (className) {
      document.body.classList.remove(className);
    });

    document.body.classList.remove("drag-lock");
  }

  function syncReadingBodyClass(step) {
    if (!document.body) {
      return;
    }

    clearReadingBodyClass();
    document.body.classList.remove(
      "is-start-screen",
      "is-pretest-screen",
      "is-vocab-intro-screen",
      "is-vocab-question-screen"
    );
    document.body.classList.add("is-reading-screen");

    if (step === "readingQuestion") {
      document.body.classList.add("is-reading-blank-screen");
      return;
    }

    if (step === "readingReorderQuestion") {
      document.body.classList.add("is-reading-reorder-screen");
      return;
    }

    document.body.classList.add("is-reading-choice-screen");
  }

  function renderReadingBlankParagraph(paragraph) {
    return paragraph.split(/(\(\d+\))/g).map(function (part) {
      var match = part.match(/\((\d+)\)/);

      if (!match) {
        return helpers.escapeHtml(part);
      }

      return [
        "<span class=\"reading-blank-marker\" data-blank-marker=\"",
        helpers.escapeAttribute(match[1]),
        "\">",
        helpers.escapeHtml(part),
        "</span>"
      ].join("");
    }).join("");
  }

  function renderReadingBlankPassage(passage) {
    var text = helpers.trimMultilineText(passage);

    if (!text) {
      return "";
    }

    return renderReadingBlankParagraph(text);
  }

  function renderBlankBlock(blank) {
    var options = Array.isArray(blank && blank.options) ? blank.options : [];

    return [
      "<div class=\"reading-blank-block reading-blank-block--locked\" data-blank-block=\"",
      helpers.escapeAttribute(blank.blankNumber),
      "\">",
      "  <div class=\"reading-blank-block-title\">Blank ",
      helpers.escapeHtml(blank.blankNumber),
      "</div>",
      "  <div class=\"reading-blank-options\">",
      options.map(function (option) {
        return [
          "<button",
          " type=\"button\"",
          " class=\"reading-blank-option reading-blank-option--locked\"",
          " data-blank-number=\"",
          helpers.escapeAttribute(blank.blankNumber),
          "\"",
          " data-option-value=\"",
          helpers.escapeAttribute(option),
          "\"",
          " disabled>",
          helpers.escapeHtml(option),
          "</button>"
        ].join("");
      }).join(""),
      "  </div>",
      "</div>"
    ].join("");
  }

  function renderReadingBlankScreen(item, progress) {
    return [
      "<div class=\"reading-blank-screen\">",
      "  <div class=\"reading-blank-container\">",
      "    <div class=\"reading-blank-header\">",
      "      <div class=\"reading-blank-title\">Reading</div>",
      "      <div class=\"reading-blank-subtitle\">Passage ",
      helpers.escapeHtml(progress.current),
      " of ",
      helpers.escapeHtml(progress.total),
      "</div>",
      "    </div>",
      "    <div class=\"reading-blank-layout\">",
      "      <div class=\"reading-blank-passage\">",
      renderReadingBlankPassage(item && item.body ? item.body : ""),
      "      </div>",
      "      <div class=\"reading-blank-panel\">",
      (item && Array.isArray(item.blanks) ? item.blanks.map(renderBlankBlock).join("") : ""),
      "        <div class=\"reading-blank-cta\">",
      "          <button type=\"button\" class=\"reading-next-button\" data-action=\"reading-next\">Next</button>",
      "        </div>",
      "      </div>",
      "    </div>",
      "  </div>",
      "</div>"
    ].join("");
  }

  function renderReadingChoiceOptions(options) {
    return (options || []).map(function (option) {
      return [
        "<button",
        " type=\"button\"",
        " class=\"reading-choice-option\"",
        " data-option-id=\"",
        helpers.escapeAttribute(option.id),
        "\">",
        helpers.escapeHtml(helpers.getOptionText(option)),
        "</button>"
      ].join("");
    }).join("");
  }

  function renderReadingChoiceScreen(item, progress) {
    var passageText = helpers.trimMultilineText(item && item.passage ? item.passage : "");

    return [
      "<div class=\"reading-choice-screen\">",
      "  <div class=\"reading-choice-shell\">",
      "    <section class=\"reading-choice-passage-card\">",
      "      <div class=\"reading-choice-passage\">",
      helpers.escapeHtml(passageText).replace(/\n/g, "<br />"),
      "      </div>",
      "    </section>",
      "    <section class=\"reading-choice-question-wrap\">",
      "      <p class=\"reading-choice-counter\">Question ",
      helpers.escapeHtml(progress.current),
      " of ",
      helpers.escapeHtml(progress.total),
      "</p>",
      "      <h2 class=\"reading-choice-question\">",
      helpers.escapeHtml(item && item.prompt ? item.prompt : ""),
      "</h2>",
      "      <div class=\"reading-choice-options\" role=\"listbox\" aria-label=\"Reading single choice options\">",
      renderReadingChoiceOptions(Array.isArray(item && item.options) ? item.options : []),
      "      </div>",
      "      <button type=\"button\" class=\"reading-choice-next\" data-action=\"reading-single-next\" disabled>Next</button>",
      "    </section>",
      "  </div>",
      "</div>"
    ].join("");
  }

  function renderReadingReorderItems(items, draggedItem, dragOverItem) {
    return (items || []).map(function (sentence, index) {
      var classNames = ["reading-reorder-item"];

      if (draggedItem === sentence) {
        classNames.push("is-dragging");
      }

      if (dragOverItem === sentence) {
        classNames.push("is-over");
      }

      return [
        "<div class=\"",
        classNames.join(" "),
        "\" data-reorder-item=\"true\" data-item-value=\"",
        helpers.escapeAttribute(sentence),
        "\">",
        "  <div class=\"reading-reorder-order\">",
        index + 1,
        "</div>",
        "  <div class=\"reading-reorder-text\">",
        helpers.escapeHtml(sentence),
        "</div>",
        "  <div class=\"reading-reorder-handle\" aria-hidden=\"true\">&#8942;&#8942;</div>",
        "</div>"
      ].join("");
    }).join("");
  }

  function renderReadingReorderScreen(item, progress) {
    return [
      "<div class=\"reading-reorder-screen\">",
      "  <div class=\"reading-reorder-shell\">",
      "    <section class=\"reading-reorder-intro\">",
      "      <div class=\"reading-reorder-top-row\">",
      "        <div class=\"reading-reorder-eyebrow\">Reading &#8226; Reorder</div>",
      "        <div class=\"reading-reorder-counter\">",
      helpers.escapeHtml(progress.current),
      " / ",
      helpers.escapeHtml(progress.total),
      "</div>",
      "      </div>",
      "      <h1 class=\"reading-reorder-title\">Reorder the text</h1>",
      "      <p class=\"reading-reorder-desc\">",
      helpers.escapeHtml(item && item.prompt ? item.prompt : ""),
      "</p>",
      "    </section>",
      "    <div class=\"reading-reorder-list\" data-role=\"reorder-list\"></div>",
      "    <div class=\"reading-reorder-actions\">",
      "      <div class=\"reading-reorder-left-actions\">",
      "        <button type=\"button\" class=\"reading-reorder-action\" data-action=\"reading-reorder-reset\">Reset</button>",
      "      </div>",
      "      <div class=\"reading-reorder-right-actions\">",
      "        <button type=\"button\" class=\"reading-reorder-action reading-reorder-action--primary\" data-action=\"reading-reorder-next\">Next</button>",
      "      </div>",
      "    </div>",
      "  </div>",
      "</div>"
    ].join("");
  }

  function renderReadingScreen(state) {
    var item = demo.flow.getCurrentItem(state);
    var progress = demo.flow.getStepProgress(state);

    if (!item || !progress) {
      return demo.components.questionCard.render({
        title: getReadingTitle(state.step),
        introHtml: "<p>No reading item is available for this step.</p>",
        footerHtml: demo.components.actionBar.render({
          primaryAction: "reading-next",
          primaryLabel: "Continue"
        })
      });
    }

    syncReadingBodyClass(state.step);

    if (state.step === "readingQuestion") {
      return renderReadingBlankScreen(item, progress);
    }

    if (state.step === "readingReorderQuestion") {
      return renderReadingReorderScreen(item, progress);
    }

    return renderReadingChoiceScreen(item, progress);
  }

  function bindReadingBlank(root, item) {
    var button = root.querySelector("[data-action='reading-next']");
    var blankBlocks = root.querySelectorAll("[data-blank-block]");
    var optionButtons = root.querySelectorAll("[data-blank-number][data-option-value]");
    var markerNodes = root.querySelectorAll("[data-blank-marker]");
    var answerState = {};
    var activeBlank = null;
    var interactionReady = false;
    var unlockTimer;

    function syncState() {
      optionButtons.forEach(function (optionButton) {
        var blankNumber = optionButton.getAttribute("data-blank-number") || "";
        var optionValue = optionButton.getAttribute("data-option-value") || "";

        optionButton.classList.toggle("is-selected", answerState[blankNumber] === optionValue);
      });

      markerNodes.forEach(function (markerNode) {
        markerNode.classList.toggle(
          "is-active",
          (markerNode.getAttribute("data-blank-marker") || "") === activeBlank
        );
      });
    }

    function unlockInteractions() {
      interactionReady = true;

      blankBlocks.forEach(function (blankBlock) {
        blankBlock.classList.remove("reading-blank-block--locked");
      });

      optionButtons.forEach(function (optionButton) {
        optionButton.classList.remove("reading-blank-option--locked");
        optionButton.disabled = false;
      });
    }

    blankBlocks.forEach(function (blankBlock) {
      blankBlock.addEventListener("click", function () {
        if (!interactionReady) {
          return;
        }

        activeBlank = blankBlock.getAttribute("data-blank-block") || "";
        syncState();
      });
    });

    optionButtons.forEach(function (optionButton) {
      optionButton.addEventListener("click", function (event) {
        var blankNumber;
        var optionValue;

        if (!interactionReady) {
          return;
        }

        event.stopPropagation();
        blankNumber = optionButton.getAttribute("data-blank-number") || "";
        optionValue = optionButton.getAttribute("data-option-value") || "";

        activeBlank = blankNumber;
        answerState[blankNumber] = optionValue;
        syncState();
      });
    });

    if (button) {
      button.addEventListener("click", function () {
        if (unlockTimer) {
          window.clearTimeout(unlockTimer);
        }

        clearReadingBodyClass();
        demo.flow.completeReadingPassage({
          answer: {
            questionId: item ? item.id : "",
            answersByBlank: helpers.clonePlainData(answerState, {})
          }
        });
      });
    }

    unlockTimer = window.setTimeout(unlockInteractions, 180);
    syncState();
  }

  function bindReadingChoice(root, item) {
    var button = root.querySelector("[data-action='reading-single-next']");
    var optionButtons = root.querySelectorAll("[data-option-id]");
    var selectedOptionId = "";

    function syncSelection() {
      optionButtons.forEach(function (optionButton) {
        optionButton.classList.toggle(
          "is-selected",
          (optionButton.getAttribute("data-option-id") || "") === selectedOptionId
        );
      });

      if (button) {
        button.disabled = !selectedOptionId;
      }
    }

    optionButtons.forEach(function (optionButton) {
      optionButton.addEventListener("click", function () {
        selectedOptionId = optionButton.getAttribute("data-option-id") || "";
        syncSelection();
      });
    });

    if (button) {
      button.addEventListener("click", function () {
        if (!selectedOptionId) {
          return;
        }

        clearReadingBodyClass();
        demo.flow.completeReadingSingle({
          answer: {
            questionId: item ? item.id : "",
            selectedOptionId: selectedOptionId
          }
        });
      });
    }

    syncSelection();
  }

  function shuffleArray(items) {
    var copy = Array.isArray(items) ? items.slice() : [];
    var index;
    var swapIndex;
    var temp;

    for (index = copy.length - 1; index > 0; index -= 1) {
      swapIndex = Math.floor(Math.random() * (index + 1));
      temp = copy[index];
      copy[index] = copy[swapIndex];
      copy[swapIndex] = temp;
    }

    return copy;
  }

  function isSameOrder(left, right) {
    var index;

    if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) {
      return false;
    }

    for (index = 0; index < left.length; index += 1) {
      if (left[index] !== right[index]) {
        return false;
      }
    }

    return true;
  }

  function getShuffledItems(items, correctOrder) {
    var shuffled = shuffleArray(items);
    var tries = 0;

    if (!Array.isArray(items) || items.length <= 1) {
      return Array.isArray(items) ? items.slice() : [];
    }

    while (isSameOrder(shuffled, correctOrder) && tries < 20) {
      shuffled = shuffleArray(items);
      tries += 1;
    }

    return shuffled;
  }

  function bindReadingReorder(root, item) {
    var list = root.querySelector("[data-role='reorder-list']");
    var resetButton = root.querySelector("[data-action='reading-reorder-reset']");
    var nextButton = root.querySelector("[data-action='reading-reorder-next']");
    var currentOrder = getShuffledItems(
      item && Array.isArray(item.items) ? item.items : [],
      item && Array.isArray(item.correctOrder) ? item.correctOrder : []
    );
    var initialItems = currentOrder.slice();
    var draggedItem = null;
    var dragOverItem = null;
    var isDragging = false;
    var activePointerId = null;

    function moveItem(fromText, toText) {
      var fromIndex;
      var toIndex;
      var moved;

      if (fromText === toText) {
        return;
      }

      fromIndex = currentOrder.indexOf(fromText);
      toIndex = currentOrder.indexOf(toText);

      if (fromIndex === -1 || toIndex === -1) {
        return;
      }

      moved = currentOrder.splice(fromIndex, 1)[0];
      currentOrder.splice(toIndex, 0, moved);
    }

    function syncListState() {
      if (!list) {
        return;
      }

      list.querySelectorAll("[data-reorder-item='true']").forEach(function (itemNode) {
        var itemValue = itemNode.getAttribute("data-item-value") || "";

        itemNode.classList.toggle("is-dragging", itemValue === draggedItem);
        itemNode.classList.toggle("is-over", itemValue === dragOverItem);
      });
    }

    function clearDragState() {
      draggedItem = null;
      dragOverItem = null;
      isDragging = false;
      activePointerId = null;

      if (document.body) {
        document.body.classList.remove("drag-lock");
      }

      syncListState();
    }

    function getTargetItemFromPoint(clientX, clientY) {
      var element;
      var itemElement;

      element = document.elementFromPoint(clientX, clientY);

      if (!element) {
        return null;
      }

      itemElement = element.closest("[data-reorder-item='true']");

      if (!itemElement) {
        return null;
      }

      return itemElement.getAttribute("data-item-value");
    }

    function handlePointerDown(event) {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      isDragging = true;
      activePointerId = event.pointerId;
      draggedItem = event.currentTarget.getAttribute("data-item-value") || "";
      dragOverItem = null;

      if (document.body) {
        document.body.classList.add("drag-lock");
      }

      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch (error) {}

      syncListState();
      event.preventDefault();
    }

    function handlePointerMove(event) {
      var targetItem;

      if (!isDragging || !draggedItem || activePointerId !== event.pointerId) {
        return;
      }

      targetItem = getTargetItemFromPoint(event.clientX, event.clientY);
      dragOverItem = targetItem && targetItem !== draggedItem ? targetItem : null;
      syncListState();
      event.preventDefault();
    }

    function handlePointerUp(event) {
      var targetItem;
      var dropTarget;

      if (activePointerId !== null && activePointerId !== event.pointerId) {
        return;
      }

      if (!isDragging || !draggedItem) {
        clearDragState();
        return;
      }

      targetItem = getTargetItemFromPoint(event.clientX, event.clientY);
      dropTarget = targetItem && targetItem !== draggedItem ? targetItem : dragOverItem;

      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch (error) {}

      if (dropTarget && dropTarget !== draggedItem) {
        moveItem(draggedItem, dropTarget);
      }

      clearDragState();
      renderList();
    }

    function handlePointerCancel() {
      clearDragState();
    }

    function bindListEvents() {
      if (!list) {
        return;
      }

      list.querySelectorAll("[data-reorder-item='true']").forEach(function (itemNode) {
        itemNode.addEventListener("pointerdown", handlePointerDown);
        itemNode.addEventListener("pointermove", handlePointerMove);
        itemNode.addEventListener("pointerup", handlePointerUp);
        itemNode.addEventListener("pointercancel", handlePointerCancel);
      });
    }

    function renderList() {
      if (!list) {
        return;
      }

      list.innerHTML = renderReadingReorderItems(currentOrder, draggedItem, dragOverItem);
      bindListEvents();
      syncListState();
    }

    if (resetButton) {
      resetButton.addEventListener("click", function () {
        currentOrder = initialItems.slice();
        clearDragState();
        renderList();
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        var submittedOrder = helpers.clonePlainData(currentOrder, []);

        clearReadingBodyClass();
        demo.flow.completeReadingReorder({
          answer: {
            questionId: item ? item.id : "",
            orderedItems: submittedOrder,
            studentOrder: submittedOrder,
            isCorrect: isSameOrder(
              submittedOrder,
              item && Array.isArray(item.correctOrder) ? item.correctOrder : []
            )
          }
        });
      });
    }

    renderList();
  }

  function bindReadingScreen(root, state) {
    var item = demo.flow.getCurrentItem(state);

    if (!item) {
      return;
    }

    if (state.step === "readingQuestion") {
      bindReadingBlank(root, item);
      return;
    }

    if (state.step === "readingReorderQuestion") {
      bindReadingReorder(root, item);
      return;
    }

    bindReadingChoice(root, item);
  }

  demo.screens.readingScreen = {
    render: renderReadingScreen,
    bind: bindReadingScreen
  };
}());
