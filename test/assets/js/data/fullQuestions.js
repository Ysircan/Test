/* Purpose: Full question bank data migrated from the real placement source. */

(function () {
  var demo = window.PlacementDemo = window.PlacementDemo || {};
  demo.data = demo.data || {};
  demo.data.fullQuestions = {
  vocabulary: [
    {
      id: "vocab-a-1",
      type: "mcq",
      difficulty: "A",
      prompt: "Choose the closest meaning of 'provide'.",
      options: [
        { id: "a", text: "stop" },
        { id: "b", text: "hide" },
        { id: "c", text: "give" },
        { id: "d", text: "break" }
      ],
      correctOptionId: "c"
    },
    {
      id: "vocab-a-2",
      type: "mcq",
      difficulty: "A",
      prompt: "Choose the closest meaning of 'require'.",
      options: [
        { id: "a", text: "choose" },
        { id: "b", text: "need" },
        { id: "c", text: "carry" },
        { id: "d", text: "forget" }
      ],
      correctOptionId: "b"
    },
    {
      id: "vocab-a-3",
      type: "mcq",
      difficulty: "A",
      prompt: "Good teachers should ___ students when they face difficulties.",
      options: [
        { id: "a", text: "divide" },
        { id: "b", text: "remove" },
        { id: "c", text: "cancel" },
        { id: "d", text: "support" }
      ],
      correctOptionId: "d"
    },
    {
      id: "vocab-b-1",
      type: "mcq",
      difficulty: "B",
      prompt: "Choose the closest meaning of 'impact'.",
      options: [
        { id: "a", text: "effect" },
        { id: "b", text: "paper" },
        { id: "c", text: "journey" },
        { id: "d", text: "sound" }
      ],
      correctOptionId: "a"
    },
    {
      id: "vocab-b-2",
      type: "mcq",
      difficulty: "B",
      prompt: "A clear essay ___ helps readers understand the main ideas.",
      options: [
        { id: "a", text: "holiday" },
        { id: "b", text: "structure" },
        { id: "c", text: "engine" },
        { id: "d", text: "window" }
      ],
      correctOptionId: "b"
    },
    {
      id: "vocab-b-3",
      type: "mcq",
      difficulty: "B",
      prompt: "Please ___ your assignment before Friday evening.",
      options: [
        { id: "a", text: "escape" },
        { id: "b", text: "damage" },
        { id: "c", text: "submit" },
        { id: "d", text: "borrow" }
      ],
      correctOptionId: "c"
    },
    {
      id: "vocab-c-1",
      type: "mcq",
      difficulty: "C",
      prompt: "The results may ___ that more practice is needed.",
      options: [
        { id: "a", text: "indicate" },
        { id: "b", text: "celebrate" },
        { id: "c", text: "protect" },
        { id: "d", text: "compare" }
      ],
      correctOptionId: "a"
    },
    {
      id: "vocab-c-2",
      type: "mcq",
      difficulty: "C",
      prompt: "His second statement seemed to ___ what he said earlier.",
      options: [
        { id: "a", text: "repeat" },
        { id: "b", text: "improve" },
        { id: "c", text: "collect" },
        { id: "d", text: "contradict" }
      ],
      correctOptionId: "d"
    }
  ],

    readingPassages: [
    {
      id: "reading-a-1",
      difficulty: "A",
      title: "Trigger Points",
      body: `
All approaches aim to increase blood flow to areas of tension and to release painful knots (1) ___ muscle known as "trigger points". "Trigger points are tense areas of muscle that are almost constantly contracting," says Kippen. "The contraction causes pain, which in turn causes contraction, so you have a vicious circle. This is what deep tissue massage aims to break."

The way to do this, as I found out under Ogedengbe's elbow, is to apply pressure (2) ___ the point, stopping the blood flow, and then to release, which causes the brain to flood the affected area (3) ___ blood, encouraging the muscle to relax.

At the same time, says Kippen, you can fool the tensed muscle into relaxing (4) ___ applying pressure to a complementary one nearby. "If you cause any muscle to contract, its opposite will expand. So you try to trick the body (5) ___ relaxing the muscle that is in spasm."
`,
      blanks: [
        {
          id: "read-a-1-blank-1",
          type: "reading-blank",
          difficulty: "A",
          prompt: "",
          passageId: "reading-a-1",
          blankNumber: 1,
          options: ["of", "in", "with", "at"],
          correctOption: "of",
        },
        {
          id: "read-a-1-blank-2",
          type: "reading-blank",
          difficulty: "A",
          prompt: "",
          passageId: "reading-a-1",
          blankNumber: 2,
          options: ["in", "with", "to", "for"],
          correctOption: "to",
        },
        {
          id: "read-a-1-blank-3",
          type: "reading-blank",
          difficulty: "A",
          prompt: "",
          passageId: "reading-a-1",
          blankNumber: 3,
          options: ["with", "by", "to", "on"],
          correctOption: "with",
        },
        {
          id: "read-a-1-blank-4",
          type: "reading-blank",
          difficulty: "A",
          prompt: "",
          passageId: "reading-a-1",
          blankNumber: 4,
          options: ["by", "with", "in", "at"],
          correctOption: "by",
        },
        {
          id: "read-a-1-blank-5",
          type: "reading-blank",
          difficulty: "A",
          prompt: "",
          passageId: "reading-a-1",
          blankNumber: 5,
          options: ["into", "with", "on", "at"],
          correctOption: "into",
        },
      ],
    },
    {
      id: "reading-a-2",
      difficulty: "B",
      title: "The Speech of Alchemy",
      body: `
To learn the speech of alchemy, an early form of (1) ___ in which people attempted to turn metals into gold, it helps to think back to a time when there was no science: no atomic number or weight, no periodic chart, no list of elements.

To the alchemists the (2) ___ was not made of leptons, bosons, gluons, and quarks. Instead it was made of substances, and one substance — say, walnut oil — could be just as (3) ___ as another — say, silver — even though modern (4) ___ would say one is heterogeneous and the other homogeneous.

Without knowledge of atomic structures, how would it be (5) ___ to tell elements from compounds?
`,
      blanks: [
        {
          id: "read-a-2-blank-1",
          type: "reading-blank",
          difficulty: "B",
          prompt: "",
          passageId: "reading-a-2",
          blankNumber: 1,
          options: ["biology", "science", "technology", "history"],
          correctOption: "science",
        },
        {
          id: "read-a-2-blank-2",
          type: "reading-blank",
          difficulty: "B",
          prompt: "",
          passageId: "reading-a-2",
          blankNumber: 2,
          options: ["universe", "Earth", "worldwide", "world"],
          correctOption: "universe",
        },
        {
          id: "read-a-2-blank-3",
          type: "reading-blank",
          difficulty: "B",
          prompt: "",
          passageId: "reading-a-2",
          blankNumber: 3,
          options: ["same", "complete", "pure", "wholesome"],
          correctOption: "pure",
        },
        {
          id: "read-a-2-blank-4",
          type: "reading-blank",
          difficulty: "B",
          prompt: "",
          passageId: "reading-a-2",
          blankNumber: 4,
          options: ["affidavit", "law", "scientists", "researchers"],
          correctOption: "scientists",
        },
        {
          id: "read-a-2-blank-5",
          type: "reading-blank",
          difficulty: "B",
          prompt: "",
          passageId: "reading-a-2",
          blankNumber: 5,
          options: ["difficult", "necessary", "available", "possible"],
          correctOption: "possible",
        },
      ],
    },
    {
  id: "reading-c-1",
  difficulty: "C",
  title: "Academic Writing",
  body: `
Academic writing addresses complex issues that require high-order thinking skills to comprehend (e.g., critical reflective logical and creative thinking). Think of your writing (1) ___ way: one of the most important attributes of a good teacher is the ability to explain complex ideas in a way that is understandable and relatable to the topic being (2) ___. This is also one of the main functions of academic writing - describing and explaining the significance of complex ideas as clearly as possible. Often (3) ___ to as higher-order thinking skills, these include cognitive processes that are used to comprehend solve problems and express concepts or that describe abstract ideas that cannot be easily acted out pointed to or shown with images. As a writer you must take (4) ___ the role of a good teacher by summarizing a lot of complex information into a well-organized synthesis of ideas concepts and recommendations that (5) ___ to a better understanding of the research problem.
`,
  blanks: [
    {
      id: "read-c-1-blank-1",
      type: "reading-blank",
      difficulty: "C",
      prompt: "",
      passageId: "reading-c-1",
      blankNumber: 1,
      options: ["your", "its", "this", "that"],
      correctOption: "this",
    },
    {
      id: "read-c-1-blank-2",
      type: "reading-blank",
      difficulty: "C",
      prompt: "",
      passageId: "reading-c-1",
      blankNumber: 2,
      options: ["discussed", "discussing", "presented", "presenting"],
      correctOption: "presented",
    },
    {
      id: "read-c-1-blank-3",
      type: "reading-blank",
      difficulty: "C",
      prompt: "",
      passageId: "reading-c-1",
      blankNumber: 3,
      options: ["referring", "referred", "relating", "related"],
      correctOption: "referred",
    },
    {
      id: "read-c-1-blank-4",
      type: "reading-blank",
      difficulty: "C",
      prompt: "",
      passageId: "reading-c-1",
      blankNumber: 4,
      options: ["on", "up", "off", "with"],
      correctOption: "on",
    },
    {
      id: "read-c-1-blank-5",
      type: "reading-blank",
      difficulty: "C",
      prompt: "",
      passageId: "reading-c-1",
      blankNumber: 5,
      options: ["lead", "add", "contributed", "contribute"],
      correctOption: "contribute",
    },
  ],
},
  ],

  readingSingleChoice: [
    {
      id: "reading-single-a-1",
      type: "reading-single",
      difficulty: "A",
      passage: `
Governments, business and many types of institutions collect, organise and record statistics. Statistics capture vital information about such things as the economy, population and the environment and therefore allow meaningful comparisons to be made. This can then inform decisions and plans made about such issues which in turn become public policies. While it may be the issues behind the statistics, rather than the statistics as such that command the public's attention, it must be recognised that it is the figures that inform these issues.
`,
      prompt: "The author considers statistics to be important because",
      options: [
        { id: "a", text: "they are recorded by official organisations." },
        { id: "b", text: "the general public have an interest in them." },
        { id: "c", text: "they are affected by plans and policies." },
        { id: "d", text: "they assist in driving public issues." }
      ],
      correctOptionId: "d"
    }
  ],

  readingMultipleChoice: [],
readingReorder: [
  {
    id: "reading-reorder-b-1",
    type: "reading-reorder",
    difficulty: "B",
    prompt: "请将句子按正确顺序排列。",
    items: [
      "Scrutiny by the news media shamed many developed countries into curbing their bad practices.",
       "Today, the projects of organizations like the World Bank are meticulously inspected by watchdog groups.",
      "Although the system is far from perfect, it is certainly more transparent than it was when foreign aid routinely helped ruthless dictators stay in power.",
       "But beginning in the 1990s, foreign aid had begun to slowly improve.",
    ],
    correctOrder: [
     "But beginning in the 1990s, foreign aid had begun to slowly improve.",
     "Scrutiny by the news media shamed many developed countries into curbing their bad practices.",
     "Today, the projects of organizations like the World Bank are meticulously inspected by watchdog groups.",
       "Although the system is far from perfect, it is certainly more transparent than it was when foreign aid routinely helped ruthless dictators stay in power.",
    ],
  },
  {
    id: "reading-reorder-b-2",
    type: "reading-reorder",
    difficulty: "B",
    prompt: "请将句子按正确顺序排列。",
    items: [
      "Because you might be living off campus in the second year.",
      "This is important that you see the facilities and accommodations around the school.",
      "Never, if you can avoid it, accept the offer before going to the place and having a look. You should go and see once you have a chance.",
      "There are more than 100 schools in the country.",
    ],
    correctOrder: [
     "There are more than 100 schools in the country.",
     "Never, if you can avoid it, accept the offer before going to the place and having a look. You should go and see once you have a chance.",
     "This is important that you see the facilities and accommodations around the school.",
      "Because you might be living off campus in the second year.",
    ],
  },
  {
  id: "reading-reorder-c-1",
  type: "reading-reorder",
  difficulty: "C",
  prompt: "请将句子按正确顺序排列。",
  items: [
    "As a result, Senegal's marine ecosystem has started to go the same way as ours.",
    "The European Union has two big fish problems.",
    "One is that, partly as a result of its failure to manage them properly, its own fisheries can no longer meet European demand.",
    "The EU has tried to solve both problems by sending its fishermen to West Africa. Since 1979 it has struck agreements with the government of Senegal, granting our fleets access to its waters.",
    "The other is that its governments won't confront their fishing lobbies and decommission all the surplus boats.",
  ],
  correctOrder: [
    "The European Union has two big fish problems.",
    "One is that, partly as a result of its failure to manage them properly, its own fisheries can no longer meet European demand.",
    "The other is that its governments won't confront their fishing lobbies and decommission all the surplus boats.",
    "The EU has tried to solve both problems by sending its fishermen to West Africa. Since 1979 it has struck agreements with the government of Senegal, granting our fleets access to its waters.",
    "As a result, Senegal's marine ecosystem has started to go the same way as ours.",
  ],
},
],
listening: {
  listeningFillBlanks: [
    {
      id: "lfib-a-1",
      type: "listening-fill-in-the-blanks",
      difficulty: "C",
      prompt: "请听录音，并在每个空格中填写缺失的单词。",
      audioUrl: "assets/audio/FIB1.mp3",
      transcript: `
It isn't necessary to have a [blank-1] knowledge of, say, the intricacies of counterpoint, or even to be able to read music to understand it. Usually, getting the point of a piece of music, its emotional and dramatic [blank-2], is immediate or simply requires you to become more [blank-3] with it. Of course, prolonged study of music and its [blank-4], as in any other field, will increase your understanding, but not necessarily your enjoyment.

Now, I realize that it can require a good deal of willingness on our part to risk new sensations, and there is a lot of music that will seem unfamiliar and alien to you on a first [blank-5].
`,
      blanks: [
        { id: "lfib-a-1-blank-1", answer: "specialized" },
        { id: "lfib-a-1-blank-2", answer: "impact" },
        { id: "lfib-a-1-blank-3", answer: "familiar" },
        { id: "lfib-a-1-blank-4", answer: "composition" },
        { id: "lfib-a-1-blank-5", answer: "hearing" },
      ],
    },
    {
  id: "lfib-a-2",
  type: "listening-fill-in-the-blanks",
  difficulty: "A",
  prompt: "请听录音，并在每个空格中填写缺失的单词。",
  audioUrl: "assets/audio/FIB2.mp3",
  transcript: `
Financial markets swung wildly yesterday in the frenzied trading market by further selling of [blank-1] and fears about an unraveling of the global carry trade. At the same time, trading in the US and European credit markets were exceptionally [blank-2] for a third consecutive day. London trading was marked by particularly wild [blank-3] in the prices of credit derivatives, used to ensure investors against [blank-4] defaults.
`,
  blanks: [
    { id: "lfib-a-2-blank-1", answer: "equities" },
    { id: "lfib-a-2-blank-2", answer: "heavy" },
    { id: "lfib-a-2-blank-3", answer: "swings" },
    { id: "lfib-a-2-blank-4", answer: "corporate" },
  ],
},
{
  id: "lfib-a-3",
  type: "listening-fill-in-the-blanks",
  difficulty: "A",
  prompt: "请听录音，并在每个空格中填写缺失的单词。",
  audioUrl: "assets/audio/FIB3.mp3",
  transcript: `
To be honest, the biggest problem for most undergraduate students, in terms of academic writing, is not only adapting to a far more [blank-1] and formal style, but also learning how to ascertain the difference between important, [blank-2] information and unnecessary, or even irrelevant [blank-3]. In my experience, I would say it takes students their first year, if not longer, to [blank-4] what is required and to start to implement those requirements in their writing. What they really should be doing, if they are struggling with written [blank-5], is to seek help from the [blank-6] support services which are available at the University.
`,
  blanks: [
    { id: "lfib-a-3-blank-1", answer: "structured" },
    { id: "lfib-a-3-blank-2", answer: "valid" },
    { id: "lfib-a-3-blank-3", answer: "material" },
    { id: "lfib-a-3-blank-4", answer: "appreciate" },
    { id: "lfib-a-3-blank-5", answer: "assignments" },
    { id: "lfib-a-3-blank-6", answer: "excellent" },
  ],
}
  ],
  hiwItems: [
  {
    id: "hiw-a-1",
    type: "hiw",
    difficulty: "B",
    prompt:
      "请听录音，并点击与录音内容不一致的单词。",
    audioUrl: "assets/audio/HIW1.mp3",
    transcript: `
For some people, this presentation may seem far-fetched, but ending poverty is both ethically necessary and actually feasible. All of us must play a role in making it happen. All human beings want, and have a way to live in dignity, to determine our own destinies, and to be respected by other, by other people. Despite the universality of three rights, our capacities to fulfill them vary enormously, and no divining line is more profound in influencing the quality of our lives than the gulf between poverty and prosperity.
`,
    wrongWords: [
      "presentation",
      "ethically",
      "way",
      "three",
      "divining",
    ],
  },
  {
  id: "hiw-a-2",
  type: "hiw",
  difficulty: "C",
  prompt:
    "请听录音，并点击与录音内容不一致的单词。",
  audioUrl: "assets/audio/HIW2.mp3",
  transcript: `
The idea is that we divide the ward – the patients if you like – and the nurses into three different teams, which we call lively nursing teams. And in those teams we then have the primary nurse which is myself, associate nurses which might tend to be D grade nurses, and health care officials, and you're all in one team together. The idea is that you would hopefully work as a team in co-ordinating the care for the patients who come in under your care as in the red team. In our teams we have eight patients each. The idea would be that I would always prescribe the care or plan the care, for those patients. In reality, it doesn't always work like that and besides which the associate nurses that are in the teams have those skills anyway from their upgrading.
`,
  wrongWords: [
    "lively",
    "might",
    "officials",
    "always",
    "upgrading",
  ],
},
{
  id: "hiw-a-3",
  type: "hiw",
  difficulty: "A",
  prompt:
    "请听录音，并点击与录音内容不一致的单词。",
  audioUrl: "assets/audio/HIW3.mp3",
  transcript: `
French, on the other hand, is a highly gentrified language, with the Parisian accent setting the standard for the world. If other French-speaking political abilities had risen to rival France, the situation might be dissident. If for instance, Quebec had remained a separate entity, or if Haiti had been a larger country, then perhaps other French dialects might have become more accepted.
`,
  wrongWords: [
    "gentrified",
    "abilities",
    "dissident",
    "entity",
  ],
},
],
  wfdItems: [{
  id: "wfdA1",
  type: "wfd",
  difficulty: "A",
  prompt: "请准确输入你所听到的句子。",
  transcript: "A group meeting will be held by tomorrow in the library conference room",
  expectedText: "A group meeting will be held by tomorrow in the library conference room",
  audioUrl: "assets/audio/001.mp3",
},
{
  id: "wfdA2",
  type: "wfd",
  difficulty: "A",
  prompt: "请准确输入你所听到的句子。",
  transcript: "You can make an appointment to meet the librarian",
  expectedText: "You can make an appointment to meet the librarian",
  audioUrl: "assets/audio/005.mp3",
},
{
  id: "wfdB1",
  type: "wfd",
  difficulty: "B",
  prompt: "请准确输入你所听到的句子。",
  transcript: "We encourage students to complete their applications before the deadline",
  expectedText: "We encourage students to complete their applications before the deadline",
  audioUrl: "assets/audio/174.mp3",
},
{
  id: "wfdC1",
  type: "wfd",
  difficulty: "C",
  prompt: "请准确输入你所听到的句子。",
  transcript: "While some people regard it as reforming zeal, others regard it as recklessness",
  expectedText: "While some people regard it as reforming zeal, others regard it as recklessness",
  audioUrl: "assets/audio/171.mp3",
}
],
}
};
}());
