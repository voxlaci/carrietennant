const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-menu-toggle]");
const aiToggle = document.querySelector("[data-ai-toggle]");
const aiClose = document.querySelector("[data-ai-close]");
const aiPanel = document.querySelector("[data-ai-panel]");
const aiAnswer = document.querySelector("[data-ai-answer]");
const shareButton = document.querySelector("[data-share]");
const shareStatus = document.querySelector("[data-share-status]");

const aiResponses = {
  "What makes Carrie Tennant’s work distinctive?":
    "Carrie’s work combines rigorous choral artistry with a deep commitment to belonging, youth leadership, mentorship, and community transformation.",
  "Which engagements can I book Carrie Tennant for?":
    "Carrie can be positioned for guest conducting, festivals, masterclasses, speaking, workshops, media enquiries, and educational leadership engagements.",
  "How does Carrie approach youth choir development?":
    "Her youth choir approach emphasizes singer confidence, healthy ensemble culture, curiosity, excellence, and the belief that every voice has agency."
};

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

  aiAnswer.textContent = aiResponses[prompt.dataset.aiPrompt];
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
