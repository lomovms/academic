document.addEventListener("DOMContentLoaded", () => {
  Fancybox.bind("[data-fancybox]", {});

  const menuButton = document.querySelector(".menu-button");
  const footerContacts = document.querySelector(".footer__contacts");
  if (menuButton && footerContacts) {
    const siteMenu = document.createElement("div");
    siteMenu.className = "site-menu";
    siteMenu.id = "site-menu";
    siteMenu.hidden = true;
    siteMenu.innerHTML = `<div class="site-menu__visual" aria-hidden="true"><div class="site-menu__drawing"></div><img class="site-menu__building" src="assets/images/hero-building.png" alt=""></div><div class="site-menu__panel" role="dialog" aria-modal="true" aria-label="Меню сайта"><nav class="site-menu__nav"><a class="site-menu__link" href="index.html#top">Главная</a><a class="site-menu__link" href="apartments.html">Квартиры в продаже</a><a class="site-menu__link" href="index.html#parking">Парковка</a><a class="site-menu__link" href="index.html#storage">Кладовки</a><a class="site-menu__link" href="index.html#about">О застройщике</a><a class="site-menu__link" href="index.html#mortgage">Ипотека</a><a class="site-menu__link" href="index.html#gallery">Галерея</a><a class="site-menu__link" href="index.html#construction">Ход строительства</a><a class="site-menu__link" href="index.html#contacts">Контакты</a></nav></div>`;
    const menuPanel = siteMenu.querySelector(".site-menu__panel");
    const menuContacts = footerContacts.cloneNode(true);
    menuContacts.className = "site-menu__contacts";
    menuContacts.querySelector(".footer__developer")?.remove();
    menuPanel.append(menuContacts);
    document.body.append(siteMenu);

    const menuLinks = [...siteMenu.querySelectorAll(".site-menu__link")];
    const setActiveMenuLink = () => {
      const page = location.pathname.split("/").pop() || "index.html";
      const activeHref = page === "apartments.html" || page === "apartment.html" ? "apartments.html" : `index.html${location.hash || "#top"}`;
      menuLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === activeHref;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    };
    const closeMenu = (returnFocus = false) => {
      siteMenu.hidden = true;
      menuButton.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Открыть меню");
      document.body.classList.remove("menu-open");
      if (returnFocus) menuButton.focus();
    };
    menuButton.setAttribute("aria-controls", "site-menu");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.addEventListener("click", () => {
      if (!siteMenu.hidden) {
        closeMenu();
        return;
      }
      setActiveMenuLink();
      siteMenu.hidden = false;
      menuButton.classList.add("is-open");
      menuButton.setAttribute("aria-expanded", "true");
      menuButton.setAttribute("aria-label", "Закрыть меню");
      document.body.classList.add("menu-open");
      (siteMenu.querySelector(".is-active") || menuLinks[0]).focus();
    });
    siteMenu.addEventListener("click", (event) => {
      if (event.target === siteMenu) closeMenu(true);
    });
    menuLinks.forEach((link) => link.addEventListener("click", () => closeMenu()));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !siteMenu.hidden) closeMenu(true);
    });
  }

  const featuresElement = document.querySelector(".features");
  if (featuresElement) {
    new Swiper(featuresElement, {
      slidesPerView: "auto",
      spaceBetween: 16,
      navigation: { prevEl: "[data-features-prev]", nextEl: "[data-features-next]" },
      breakpoints: { 768: { slidesPerView: 3, spaceBetween: 24 }, 992: { slidesPerView: 4 } },
    });
  }

  const constructionSliderElement = document.querySelector(".construction__slider");
  if (constructionSliderElement) {
    const constructionIntroColumn = document.querySelector(".construction__intro-column");
    const constructionWrapper = constructionSliderElement.querySelector(".swiper-wrapper");
    const constructionIntroAnchor = document.createComment("construction intro");
    const constructionMedia = window.matchMedia("(max-width: 767px)");
    constructionIntroColumn.before(constructionIntroAnchor);

    const syncConstructionIntro = () => {
      if (constructionMedia.matches) {
        constructionIntroColumn.classList.add("construction__slide", "swiper-slide");
        constructionWrapper.append(constructionIntroColumn);
        return;
      }
      constructionIntroColumn.classList.remove("construction__slide", "swiper-slide");
      constructionIntroAnchor.after(constructionIntroColumn);
    };

    syncConstructionIntro();
    const constructionSwiper = new Swiper(constructionSliderElement, {
      slidesPerView: "auto",
      spaceBetween: 16,
      navigation: { prevEl: "[data-construction-prev]", nextEl: "[data-construction-next]" },
      breakpoints: { 768: { slidesPerView: 2.2, spaceBetween: 16 }, 992: { slidesPerView: 3, spaceBetween: 24 } },
    });
    constructionMedia.addEventListener("change", () => {
      syncConstructionIntro();
      constructionSwiper.update();
    });
  }

  const floorsContainer = document.querySelector(".apartments__floors");
  if (floorsContainer) {
  const createFloor = (floor) => {
    const button = document.createElement("button");
    button.className = "apartments__floor";
    button.type = "button";
    button.dataset.floor = floor;
    button.setAttribute("aria-pressed", "false");
    button.textContent = `Этаж: ${floor}`;
    return button;
  };
  floorsContainer.prepend(createFloor(14), createFloor(13));
  floorsContainer.append(createFloor(1));

  const floors = document.querySelectorAll(".apartments__floor");
  const apartmentData = { 1: [0, 0, 0], 2: [8, 9, 4], 3: [10, 11, 6], 4: [11, 9, 7], 5: [9, 12, 8], 6: [13, 10, 9], 7: [12, 12, 12], 8: [10, 11, 8], 9: [9, 8, 7], 10: [7, 9, 5], 11: [6, 7, 5], 12: [4, 6, 3], 13: [0, 0, 0], 14: [0, 0, 0] };
  const mobileFloorTop = { 1: "87.9%", 2: "80.8%", 3: "76.8%", 4: "69.8%", 5: "65.8%", 6: "58.8%", 7: "53.8%", 8: "47.8%", 9: "42.8%", 10: "37.8%", 11: "31.8%", 12: "26.8%", 13: "21.8%", 14: "15.8%" };
  const mobileFloorUp = document.querySelector("[data-floor-next]");
  const mobileFloorDown = document.querySelector("[data-floor-prev]");
  const setFloor = (button) => {
    const [one, two, three] = apartmentData[button.dataset.floor];
    document.querySelector(".apartments__mobile-controls").style.setProperty("--mobile-floor-top", mobileFloorTop[button.dataset.floor]);
    document.querySelector("[data-apartments-floor]").textContent = button.dataset.floor;
    document.querySelector("[data-apartments-floor-mobile]").textContent = button.dataset.floor;
    document.querySelector("[data-apartments-one]").textContent = one;
    document.querySelector("[data-apartments-two]").textContent = two;
    document.querySelector("[data-apartments-three]").textContent = three;
    floors.forEach((floor) => { floor.classList.toggle("is-active", floor === button); floor.setAttribute("aria-pressed", floor === button); });
    mobileFloorUp.hidden = button === floors[0];
    mobileFloorDown.hidden = button === floors[floors.length - 1];
  };
  floors.forEach((floor) => ["mouseenter", "focus", "click"].forEach((event) => floor.addEventListener(event, () => setFloor(floor))));
  setFloor(document.querySelector(".apartments__floor.is-active"));
  document.querySelector("[data-floor-next]").addEventListener("click", () => {
    const current = document.querySelector(".apartments__floor.is-active");
    setFloor(current.previousElementSibling || current);
  });
  document.querySelector("[data-floor-prev]").addEventListener("click", () => {
    const current = document.querySelector(".apartments__floor.is-active");
    setFloor(current.nextElementSibling || current);
  });

  const apartmentPanel = document.querySelector(".apartments__panel");
  const apartmentOpen = document.querySelector("[data-apartments-open]");
  const closeApartmentPanel = () => {
    apartmentPanel.classList.remove("is-open");
    apartmentOpen.setAttribute("aria-expanded", "false");
  };
  apartmentOpen.addEventListener("click", () => {
    apartmentPanel.classList.add("is-open");
    apartmentOpen.setAttribute("aria-expanded", "true");
    apartmentPanel.querySelector(".apartments__panel-close").focus();
  });
  document.querySelector("[data-apartments-close]").addEventListener("click", closeApartmentPanel);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeApartmentPanel();
  });
  }

  const markers = document.querySelectorAll(".location__marker");
  markers.forEach((marker) => marker.addEventListener("click", () => {
    const isActive = marker.classList.contains("is-active");
    markers.forEach((item) => { item.classList.remove("is-active"); item.setAttribute("aria-expanded", "false"); });
    if (!isActive) { marker.classList.add("is-active"); marker.setAttribute("aria-expanded", "true"); }
  }));

  const cookieBanner = document.querySelector(".cookie-banner");
  if (cookieBanner) {
    const cookieToggle = cookieBanner.querySelector(".cookie-banner__toggle");
    cookieToggle.addEventListener("click", () => {
      const isOpen = cookieBanner.classList.toggle("cookie-banner--open");
      cookieToggle.setAttribute("aria-expanded", isOpen);
    });
    cookieBanner.querySelector(".cookie-banner__accept").addEventListener("click", () => { cookieBanner.hidden = true; });
  }

  const contactForm = document.querySelector(".contacts__form");
  if (contactForm) {
    const fields = [...contactForm.querySelectorAll(".contacts__input")];
    const consent = contactForm.querySelector(".contacts__consent");
    const checkbox = consent.querySelector(".contacts__checkbox");
    const consentError = document.createElement("p");
    consentError.className = "contacts__consent-error";
    consentError.textContent = "Необходимо согласие на обработку данных";
    consent.append(consentError);

    const validateField = (input) => {
      const isName = input.name === "name";
      const value = input.value.trim();
      const valid = isName ? /^[А-Яа-яЁёA-Za-z -]{2,}$/.test(value) : input.value.replace(/\D/g, "").length >= 11;
      const field = input.parentElement;
      field.classList.toggle("is-error", !valid);
      field.querySelector(".contacts__error").textContent = isName ? (value ? "Не подходящее имя" : "Введите имя") : "Введите корректный телефон";
      input.setAttribute("aria-invalid", String(!valid));
      return valid;
    };

    fields.forEach((input) => {
      const field = document.createElement("div");
      field.className = "contacts__field";
      const error = document.createElement("p");
      error.className = "contacts__error";
      input.before(field);
      field.append(input, error);
      input.addEventListener("input", () => validateField(input));
    });

    contactForm.addEventListener("submit", (event) => {
      const valid = fields.every(validateField);
      consent.classList.toggle("is-error", !checkbox.checked);
      if (!valid || !checkbox.checked) event.preventDefault();
    });
  }

  const showcase = document.querySelector(".home-showcase");
  if (!showcase || !window.matchMedia("(min-width: 768px)").matches) return;

  const runShowcase = () => {
    if (showcase.classList.contains("home-showcase--running")) return;
    showcase.classList.add("home-showcase--running");
    removeEventListener("scroll", checkShowcase);
  };
  const checkShowcase = () => {
    if (showcase.getBoundingClientRect().bottom <= innerHeight * .82) runShowcase();
  };
  addEventListener("scroll", checkShowcase, { passive: true });
  checkShowcase();
});
