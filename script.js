const WHATSAPP_NUMBER = "5491123616456";
const DEFAULT_WHATSAPP_MESSAGE = "¡Hola! Quiero que me contacten por los lotes/cabaña que vi anunciados en nuevodelta.com.ar.";

const WHATSAPP_MESSAGES = {
  general: DEFAULT_WHATSAPP_MESSAGE,
  availability: DEFAULT_WHATSAPP_MESSAGE,
  cabin: DEFAULT_WHATSAPP_MESSAGE,
  visit: DEFAULT_WHATSAPP_MESSAGE,
  directions: DEFAULT_WHATSAPP_MESSAGE
};

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const whatsappLinks = document.querySelectorAll("[data-whatsapp]");
const revealItems = document.querySelectorAll(".reveal");
const lightboxTriggers = document.querySelectorAll("[data-lightbox]");
const lightbox = document.querySelector("[data-lightbox-modal]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxClose = document.querySelector("[data-lightbox-close]");

function buildWhatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function setHeaderState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 16);
}

function closeMenu() {
  if (!menuToggle || !siteNav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
  header?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

function openLightbox(src, caption) {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;
  lightboxImage.src = src;
  lightboxImage.alt = caption;
  lightboxCaption.textContent = caption;
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.classList.remove("lightbox-open");
}

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("is-open", !isOpen);
    header?.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

whatsappLinks.forEach((link) => {
  const messageKey = link.dataset.whatsapp || "general";
  const message = WHATSAPP_MESSAGES[messageKey] || WHATSAPP_MESSAGES.general;
  link.href = buildWhatsappUrl(message);
  link.target = "_blank";
  link.rel = "noopener";
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

lightboxTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openLightbox(trigger.dataset.lightbox, trigger.dataset.caption || "");
  });
});

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    closeLightbox();
  }
});
