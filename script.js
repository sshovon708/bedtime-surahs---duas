/**
 * ==========================================================================
 * Bedtime Surahs & Duas - Interactive Companion Script
 * Features:
 *  1. Collapsible / Expandable Cards System with localStorage persistence
 *  2. Reading Progress Bar & Back to Top Scroll Control
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  /* ------------------------------------------------------------------------
     1. Collapsible Cards System
     ------------------------------------------------------------------------ */
  const cards = document.querySelectorAll(".reading-card");
  const STORAGE_KEY_CARDS = "bedtime_card_states";

  // Load saved open/close card states
  let cardStates = {};
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CARDS);
    if (saved) {
      cardStates = JSON.parse(saved);
    }
  } catch (e) {
    console.warn("Could not read card states from localStorage:", e);
  }

  cards.forEach((card) => {
    const cardId = card.getAttribute("data-id");
    const header = card.querySelector(".card-header");

    // Apply saved state or default to collapsed
    const isExpanded = cardStates[cardId] === true;
    if (isExpanded) {
      card.classList.remove("collapsed");
      if (header) header.setAttribute("aria-expanded", "true");
    } else {
      card.classList.add("collapsed");
      if (header) header.setAttribute("aria-expanded", "false");
    }

    // Toggle card expansion on header click
    if (header) {
      header.addEventListener("click", () => {
        toggleCard(card, cardId);
      });

      // Keyboard accessibility (Enter / Space)
      header.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleCard(card, cardId);
        }
      });
    }
  });

  function toggleCard(card, cardId) {
    const isCurrentlyCollapsed = card.classList.contains("collapsed");
    const header = card.querySelector(".card-header");

    if (isCurrentlyCollapsed) {
      card.classList.remove("collapsed");
      if (header) header.setAttribute("aria-expanded", "true");
      cardStates[cardId] = true;
    } else {
      card.classList.add("collapsed");
      if (header) header.setAttribute("aria-expanded", "false");
      cardStates[cardId] = false;
    }

    // Save updated states to localStorage
    try {
      localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(cardStates));
    } catch (e) {
      console.warn("Could not save card states to localStorage:", e);
    }
  }

  /* ------------------------------------------------------------------------
     2. Scroll Reading Progress Bar & Back to Top Button
     ------------------------------------------------------------------------ */
  const progressBar = document.getElementById("progress-bar");
  const scrollTopBtn = document.getElementById("scroll-top-btn");

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    // Update Progress Bar
    if (scrollHeight > 0 && progressBar) {
      const progressPercent = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }

    // Toggle Back to Top Button
    if (scrollTopBtn) {
      if (scrollTop > 350) {
        scrollTopBtn.classList.remove("hidden");
      } else {
        scrollTopBtn.classList.add("hidden");
      }
    }
  });

  // Scroll to Top Smoothly
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
});
