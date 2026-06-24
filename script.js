const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-menu-toggle]");
const aiToggle = document.querySelector("[data-ai-toggle]");
const aiClose = document.querySelector("[data-ai-close]");
const aiPanel = document.querySelector("[data-ai-panel]");
const aiAnswer = document.querySelector("[data-ai-answer]");
const aiForm = document.querySelector("[data-ai-form]");
const aiInput = document.querySelector("[data-ai-input]");
const aiVoice = document.querySelector("[data-ai-voice]");
const shareButton = document.querySelector("[data-share]");
const shareStatus = document.querySelector("[data-share-status]");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

const aiKnowledge = [
  {
    keywords: ["distinctive", "unique", "special", "different", "identity", "approach"],
    answer:
      "Carrie’s work combines rigorous choral artistry with a deep commitment to belonging, youth leadership, mentorship, and community transformation."
  },
  {
    keywords: ["book", "booking", "hire", "engagement", "guest", "festival", "invite"],
    answer:
      "Carrie can be positioned for guest conducting, festivals, masterclasses, speaking, workshops, media enquiries, and educational leadership engagements."
  },
  {
    keywords: ["youth", "young", "singer", "choir", "development", "vancouver youth"],
    answer:
      "Her youth choir approach emphasizes singer confidence, healthy ensemble culture, curiosity, excellence, and the belief that every voice has agency."
  },
  {
    keywords: ["speaking", "speaker", "conference", "leadership", "talk"],
    answer:
      "Strong speaking topics include arts leadership, youth development, community impact, creative learning, choir culture, and the future of choral music."
  },
  {
    keywords: ["contact", "email", "media", "press"],
    answer:
      "For guest conducting, speaking, festivals, masterclasses, media, and professional enquiries, use the contact section near the bottom of the site."
  }
];

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

toggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  header.classList.toggle("is-open", isOpen);
  toggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    nav.classList.remove("is-open");
    header.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }
});

function setAiOpen(isOpen) {
  aiPanel.hidden = !isOpen;
  aiToggle.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    window.setTimeout(() => aiInput.focus(), 80);
  }
}

aiToggle.addEventListener("click", () => {
  setAiOpen(aiPanel.hidden);
});

aiClose.addEventListener("click", () => {
  setAiOpen(false);
});

aiPanel.addEventListener("click", (event) => {
  const prompt = event.target.closest("[data-ai-prompt]");

  if (!prompt) {
    return;
  }

  aiInput.value = prompt.dataset.aiPrompt;
  answerQuestion(prompt.dataset.aiPrompt);
});

function externalSearchUrl(question) {
  const query = encodeURIComponent(`Carrie Tennant ${question}`);
  return `https://www.google.com/search?q=${query}`;
}

function answerQuestion(question) {
  const normalizedQuestion = question.trim();
  const lowerQuestion = normalizedQuestion.toLowerCase();
  const match = aiKnowledge.find((item) =>
    item.keywords.some((keyword) => lowerQuestion.includes(keyword))
  );

  if (match) {
    aiAnswer.textContent = match.answer;
    return;
  }

  const url = externalSearchUrl(normalizedQuestion);
  aiAnswer.innerHTML = `I do not have that detail in this site yet. <a href="${url}" target="_blank" rel="noopener">Open an external search for more information</a>.`;
  window.open(url, "_blank", "noopener");
}

aiForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const question = aiInput.value.trim();

  if (!question) {
    aiAnswer.textContent = "Type a question about Carrie’s work, bookings, youth choirs, speaking, or masterclasses.";
    aiInput.focus();
    return;
  }

  answerQuestion(question);
});

if (recognition) {
  recognition.lang = "en-CA";
  recognition.interimResults = false;

  recognition.addEventListener("result", (event) => {
    const transcript = event.results[0][0].transcript;
    aiInput.value = transcript;
    answerQuestion(transcript);
  });

  recognition.addEventListener("end", () => {
    aiVoice.classList.remove("is-listening");
  });

  recognition.addEventListener("error", () => {
    aiVoice.classList.remove("is-listening");
    aiAnswer.textContent = "I could not hear that clearly. Type the question or try the microphone again.";
  });
}

aiVoice.addEventListener("click", () => {
  if (!recognition) {
    aiAnswer.textContent = "Voice input is not supported in this browser. Type your question instead.";
    aiInput.focus();
    return;
  }

  setAiOpen(true);
  aiAnswer.textContent = "Listening...";
  aiVoice.classList.add("is-listening");
  recognition.start();
});

shareButton.addEventListener("click", async () => {
  const shareData = {
    title: document.title,
    text: "Carrie Tennant | Canadian conductor, educator, and artistic leader",
    url: window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      shareStatus.textContent = "Shared";
    } else {
      await navigator.clipboard.writeText(shareData.url);
      shareStatus.textContent = "Link copied";
    }
  } catch (error) {
    shareStatus.textContent = "Share cancelled";
  }

  window.setTimeout(() => {
    shareStatus.textContent = "";
  }, 2200);
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
