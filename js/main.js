(function () {
  "use strict";

  var WA_NUMBER = "558431902330";
  var CITY_KEY = "gigabom_city";
  var COOKIE_KEY = "gigabom_cookie_consent";

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  navToggle.addEventListener("click", function () {
    var open = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mainNav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      mainNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- WhatsApp link personalization ---------- */
  function waLink(extra) {
    var city = localStorage.getItem(CITY_KEY);
    var msg = "Olá! Vim pelo site da Gigabom";
    if (city) msg += " e moro/tenho casa em " + city;
    msg += (extra ? ". " + extra : ".");
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
  }
  function refreshWhatsappLinks() {
    var ids = {
      heroWhatsapp: "Quero saber mais sobre os planos de internet",
      coverageWhatsapp: "Quero confirmar se vocês atendem meu endereço",
      moradorWhatsapp: "Sou morador local e quero contratar a internet",
      veranistaWhatsapp: "Sou veranista e quero contratar a internet (pagamento de 6 meses adiantados no cartão)",
      planosWhatsapp: "Quero saber o valor do plano para o meu endereço",
      floatWhatsapp: "Quero saber mais sobre a internet Gigabom"
    };
    Object.keys(ids).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.href = waLink(ids[id]);
    });
  }
  refreshWhatsappLinks();

  /* ---------- City modal ---------- */
  var cityModal = document.getElementById("cityModal");
  var cityPillLabel = document.getElementById("cityPillLabel");

  function setCity(city) {
    localStorage.setItem(CITY_KEY, city);
    cityPillLabel.textContent = city;
    refreshWhatsappLinks();
    closeCityModal();
  }
  function openCityModal() { cityModal.classList.add("open"); }
  function closeCityModal() { cityModal.classList.remove("open"); }

  var savedCity = localStorage.getItem(CITY_KEY);
  if (savedCity) {
    cityPillLabel.textContent = savedCity;
  } else {
    window.setTimeout(openCityModal, 900);
  }

  document.getElementById("cityPillBtn").addEventListener("click", openCityModal);
  document.getElementById("cityModalClose").addEventListener("click", closeCityModal);
  document.getElementById("cityModalSkip").addEventListener("click", closeCityModal);
  cityModal.addEventListener("click", function (e) {
    if (e.target === cityModal) closeCityModal();
  });
  document.querySelectorAll(".city-option").forEach(function (btn) {
    btn.addEventListener("click", function () { setCity(btn.dataset.city); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeCityModal();
  });

  /* ---------- Tabs (signup + plan zones), scoped per tablist ---------- */
  document.querySelectorAll('[role="tablist"]').forEach(function (tablist) {
    var buttons = tablist.querySelectorAll(".tab-btn");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.setAttribute("aria-selected", "false");
          var panel = document.getElementById(b.dataset.target);
          if (panel) panel.classList.remove("active");
        });
        btn.setAttribute("aria-selected", "true");
        document.getElementById(btn.dataset.target).classList.add("active");
      });
    });
  });

  /* ---------- Cookie / LGPD banner ---------- */
  var cookieBanner = document.getElementById("cookieBanner");
  var consent = localStorage.getItem(COOKIE_KEY);
  if (!consent) {
    window.setTimeout(function () { cookieBanner.classList.add("open"); }, 400);
  }
  document.getElementById("cookieAccept").addEventListener("click", function () {
    localStorage.setItem(COOKIE_KEY, "accepted");
    cookieBanner.classList.remove("open");
  });
  document.getElementById("cookieReject").addEventListener("click", function () {
    localStorage.setItem(COOKIE_KEY, "rejected");
    cookieBanner.classList.remove("open");
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Back to top ---------- */
  var toTop = document.getElementById("toTop");
  window.addEventListener("scroll", function () {
    toTop.classList.toggle("show", window.scrollY > 600);
  }, { passive: true });
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
