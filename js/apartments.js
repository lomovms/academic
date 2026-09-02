document.addEventListener("DOMContentLoaded", () => {
  const floors = [2, 4, 6, 10, 3, 7, 11, 14, 5, 9, 13, 15];
  const apartments = [
    [1, ["29,8", "31,2", "34,6", "38,1"], 7100000],
    [2, ["52,4", "56,8", "61,1", "64,7"], 8500000],
    [3, ["65,0", "66,2", "67,0", "69,4"], 10391350],
  ].flatMap(([rooms, areas, basePrice]) => Array.from({ length: 12 }, (_, index) => {
    const priceValue = basePrice + index * 350000;
    const area = areas[index % areas.length];
    return {
      rooms,
      area,
      areaValue: Number(area.replace(",", ".")),
      price: new Intl.NumberFormat("ru-RU").format(priceValue),
      priceValue,
      floor: floors[index],
      number: 140 + (rooms - 1) * 12 + index,
    };
  }));

  const card = (apartment, index) => `<a class="apartment-card" href="apartment.html" data-card-index="${index}" data-room-card="${apartment.rooms}" data-area-card="${apartment.areaValue}" data-floor-card="${apartment.floor}" data-price-card="${apartment.priceValue}"><h3 class="apartment-card__title">${apartment.rooms}-комнатная, ${apartment.area} м²</h3><p class="apartment-card__price">${apartment.price} ₽<small>260 000 ₽ за м²</small></p><div class="plan-placeholder" role="img" aria-label="Планировка квартиры №${apartment.number}"></div><div class="apartment-card__meta"><span class="apartment-card__finish">⚑ Предчистовая отделка</span><br>Дом №3 · Этаж ${apartment.floor} / 15 · Кв. №${apartment.number}</div></a>`;

  const grid = document.querySelector("[data-apartment-grid]");
  const similar = document.querySelector("[data-similar-grid]");
  if (grid) grid.innerHTML = apartments.map(card).join("");
  if (similar) similar.innerHTML = apartments.slice(0, 4).map(card).join("");

  const viewButtons = document.querySelectorAll("[data-selection-view]");
  const panels = document.querySelectorAll("[data-selection-panel]");
  viewButtons.forEach((button) => button.addEventListener("click", () => {
    viewButtons.forEach((item) => item.classList.toggle("tabs__button--active", item === button));
    panels.forEach((panel) => { panel.hidden = panel.dataset.selectionPanel !== button.dataset.selectionView; });
  }));

  let room = 1;
  let sortMode = "default";
  const rangeValues = { area: [28, 70], floor: [1, 15], price: [7100000, 14241350] };
  const updateFilter = () => {
    if (!grid) return;
    const cards = [...grid.querySelectorAll("[data-room-card]")];
    const visible = cards.filter((item) => Number(item.dataset.roomCard) === room
      && Number(item.dataset.areaCard) >= rangeValues.area[0] && Number(item.dataset.areaCard) <= rangeValues.area[1]
      && Number(item.dataset.floorCard) >= rangeValues.floor[0] && Number(item.dataset.floorCard) <= rangeValues.floor[1]
      && Number(item.dataset.priceCard) >= rangeValues.price[0] && Number(item.dataset.priceCard) <= rangeValues.price[1]);
    const [sortKey, direction] = sortMode.split("-");
    cards.sort((a, b) => sortMode === "default"
      ? Number(a.dataset.cardIndex) - Number(b.dataset.cardIndex)
      : (Number(a.dataset[`${sortKey}Card`]) - Number(b.dataset[`${sortKey}Card`])) * (direction === "asc" ? 1 : -1));
    cards.forEach((item) => grid.append(item));
    cards.forEach((item) => { item.hidden = !visible.includes(item); });
    const empty = document.querySelector("[data-selection-empty]");
    if (empty) empty.hidden = visible.length > 0;
  };
  document.querySelectorAll("[data-room]").forEach((button) => button.addEventListener("click", () => {
    room = Number(button.dataset.room);
    document.querySelectorAll("[data-room]").forEach((item) => item.classList.toggle("is-active", item === button));
    updateFilter();
  }));

  const numberFormat = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });
  document.querySelectorAll("[data-range]").forEach((range) => {
    const minInput = range.querySelector("[data-range-min]");
    const maxInput = range.querySelector("[data-range-max]");
    const minOutput = range.querySelector("[data-range-min-output]");
    const maxOutput = range.querySelector("[data-range-max-output]");
    const updateRange = (changedInput) => {
      if (Number(minInput.value) > Number(maxInput.value)) {
        if (changedInput === minInput) maxInput.value = minInput.value;
        else minInput.value = maxInput.value;
      }
      const min = Number(minInput.value);
      const max = Number(maxInput.value);
      const total = Number(minInput.max) - Number(minInput.min);
      rangeValues[range.dataset.range] = [min, max];
      minOutput.value = numberFormat.format(min);
      maxOutput.value = numberFormat.format(max);
      range.style.setProperty("--range-start", `${((min - Number(minInput.min)) / total) * 100}%`);
      range.style.setProperty("--range-end", `${((max - Number(minInput.min)) / total) * 100}%`);
      updateFilter();
    };
    minInput.addEventListener("input", () => updateRange(minInput));
    maxInput.addEventListener("input", () => updateRange(maxInput));
    updateRange();
  });

  const sort = document.querySelector("[data-sort]");
  if (sort) {
    const toggle = sort.querySelector(".sort__toggle");
    const options = sort.querySelector(".sort__options");
    const closeSort = () => { options.hidden = true; toggle.setAttribute("aria-expanded", "false"); };
    toggle.addEventListener("click", () => {
      options.hidden = !options.hidden;
      toggle.setAttribute("aria-expanded", String(!options.hidden));
    });
    options.addEventListener("click", (event) => {
      const option = event.target.closest("[data-sort-value]");
      if (!option) return;
      sortMode = option.dataset.sortValue;
      options.querySelectorAll("[data-sort-value]").forEach((item) => {
        item.classList.toggle("is-active", item === option);
        item.setAttribute("aria-selected", String(item === option));
      });
      closeSort();
      updateFilter();
    });
    document.addEventListener("click", (event) => { if (!sort.contains(event.target)) closeSort(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeSort(); });
  }
  updateFilter();

  const schemeHotspots = document.querySelector("[data-scheme-hotspots]");
  const schemeTip = document.querySelector("[data-scheme-tip]");
  if (schemeHotspots && schemeTip) {
    const schemeColumns = [[36, 1], [72, 2], [108, 2], [144, 3], [288, 1], [324, 1]];
    const schemeFloors = Array.from({ length: 12 }, (_, index) => 13 - index);
    schemeHotspots.innerHTML = schemeFloors.flatMap((floor) => schemeColumns.map(([x, rooms]) => {
      const y = floor === 13 ? 0 : 64 + (12 - floor) * 36;
      const height = floor === 13 ? 56 : 28;
      const penthouse = floor === 13;
      const apartment = apartments.filter((item) => item.rooms === rooms)[(13 - floor) % 12];
      return `<button class="scheme-hotspot" type="button" style="left:${x / 388 * 100}%;top:${y / 452 * 100}%;width:${28 / 388 * 100}%;height:${height / 452 * 100}%" data-scheme-floor="${floor}" data-scheme-rooms="${rooms}" data-scheme-area="${apartment.areaValue}" data-scheme-side="${x < 200 ? "left" : "right"}" aria-label="${penthouse ? "Пентхаус, " : ""}${rooms}-комнатная квартира, ${floor} этаж"></button>`;
    })).join("");

    const schemeFilter = document.querySelector(".scheme-filter");
    let schemeRoom = 1;
    const schemeRanges = { area: [28, 70], floor: [2, 13] };
    const hideSchemeTip = () => {
      schemeTip.hidden = true;
      schemeHotspots.querySelectorAll(".is-active").forEach((item) => item.classList.remove("is-active"));
    };
    const updateSchemeFilter = () => {
      schemeHotspots.querySelectorAll(".scheme-hotspot").forEach((hotspot) => {
        const matches = Number(hotspot.dataset.schemeRooms) === schemeRoom
          && Number(hotspot.dataset.schemeArea) >= schemeRanges.area[0] && Number(hotspot.dataset.schemeArea) <= schemeRanges.area[1]
          && Number(hotspot.dataset.schemeFloor) >= schemeRanges.floor[0] && Number(hotspot.dataset.schemeFloor) <= schemeRanges.floor[1];
        hotspot.classList.toggle("is-filtered", !matches);
        hotspot.tabIndex = matches ? 0 : -1;
        hotspot.setAttribute("aria-hidden", String(!matches));
        if (!matches && hotspot.classList.contains("is-active")) hideSchemeTip();
      });
    };
    if (schemeFilter) {
      schemeFilter.querySelectorAll(".filter__rooms button").forEach((button, index) => {
        button.dataset.schemeRoom = index + 1;
        button.addEventListener("click", () => {
          schemeRoom = Number(button.dataset.schemeRoom);
          schemeFilter.querySelectorAll("[data-scheme-room]").forEach((item) => item.classList.toggle("is-active", item === button));
          updateSchemeFilter();
        });
      });
      const initialiseSchemeRange = (range, name, min, max, unit) => {
        range.dataset.schemeRange = name;
        range.innerHTML = `<span>от <output data-scheme-range-min-output>${min}</output></span><span>до <output data-scheme-range-max-output>${max}</output></span><em>${unit}</em><input type="range" min="${min}" max="${max}" value="${min}" step="${name === "area" ? ".1" : "1"}" aria-label="Минимум: ${name}" data-scheme-range-min><input type="range" min="${min}" max="${max}" value="${max}" step="${name === "area" ? ".1" : "1"}" aria-label="Максимум: ${name}" data-scheme-range-max>`;
        const minInput = range.querySelector("[data-scheme-range-min]");
        const maxInput = range.querySelector("[data-scheme-range-max]");
        const minOutput = range.querySelector("[data-scheme-range-min-output]");
        const maxOutput = range.querySelector("[data-scheme-range-max-output]");
        const updateRange = (changedInput) => {
          if (Number(minInput.value) > Number(maxInput.value)) {
            if (changedInput === minInput) maxInput.value = minInput.value;
            else minInput.value = maxInput.value;
          }
          const rangeMin = Number(minInput.value);
          const rangeMax = Number(maxInput.value);
          schemeRanges[name] = [rangeMin, rangeMax];
          minOutput.value = numberFormat.format(rangeMin);
          maxOutput.value = numberFormat.format(rangeMax);
          range.style.setProperty("--range-start", `${((rangeMin - min) / (max - min)) * 100}%`);
          range.style.setProperty("--range-end", `${((rangeMax - min) / (max - min)) * 100}%`);
          updateSchemeFilter();
        };
        minInput.addEventListener("input", () => updateRange(minInput));
        maxInput.addEventListener("input", () => updateRange(maxInput));
        updateRange();
      };
      const schemeRangeElements = schemeFilter.querySelectorAll(".filter__range");
      initialiseSchemeRange(schemeRangeElements[0], "area", 28, 70, "м²");
      initialiseSchemeRange(schemeRangeElements[1], "floor", 2, 13, "эт.");
    }

    const showSchemeTip = (hotspot) => {
      const floor = Number(hotspot.dataset.schemeFloor);
      const rooms = Number(hotspot.dataset.schemeRooms);
      const roomApartments = apartments.filter((apartment) => apartment.rooms === rooms);
      const apartment = roomApartments[(13 - floor) % roomApartments.length];
      const tipHeight = floor === 13 ? 198 : 157;
      const building = schemeTip.closest(".scheme-building");
      const buildingRect = building.getBoundingClientRect();
      const hotspotRect = hotspot.getBoundingClientRect();
      const mapRect = building.querySelector(".scheme-map").getBoundingClientRect();
      const gap = 8;
      const cardWidth = 315;
      const overflowAllowance = 16;
      const canOpenLeft = hotspotRect.left - buildingRect.left - gap - cardWidth >= -overflowAllowance;
      const canOpenRight = buildingRect.right - hotspotRect.right - gap - cardWidth >= -overflowAllowance;
      let openLeft = hotspot.dataset.schemeSide === "left";
      if (openLeft && !canOpenLeft) openLeft = false;
      if (!openLeft && !canOpenRight && canOpenLeft) openLeft = true;
      schemeHotspots.querySelectorAll(".scheme-hotspot").forEach((item) => item.classList.toggle("is-active", item === hotspot));
      schemeTip.classList.toggle("is-penthouse", floor === 13);
      schemeTip.style.setProperty("--scheme-tip-left", `${openLeft ? hotspotRect.left - buildingRect.left - gap - cardWidth : hotspotRect.right - buildingRect.left + gap}px`);
      schemeTip.style.setProperty("--scheme-tip-top", `${Math.min(hotspotRect.top - buildingRect.top, mapRect.bottom - buildingRect.top - tipHeight)}px`);
      schemeTip.querySelector("[data-scheme-penthouse]").hidden = floor !== 13;
      schemeTip.querySelector("[data-scheme-title]").textContent = `${rooms}-комнатная, ${apartment.area} м²`;
      schemeTip.querySelector("[data-scheme-price]").textContent = `${apartment.price} ₽`;
      schemeTip.querySelector("[data-scheme-old-price]").textContent = `${new Intl.NumberFormat("ru-RU").format(apartment.priceValue + 300000)} ₽`;
      schemeTip.querySelector("[data-scheme-address]").textContent = `Дом №3 · Этаж ${floor} / 15 · Кв. №${apartment.number}`;
      schemeTip.hidden = false;
    };
    schemeHotspots.addEventListener("focusin", (event) => {
      const hotspot = event.target.closest(".scheme-hotspot");
      if (hotspot) showSchemeTip(hotspot);
    });
    schemeHotspots.addEventListener("click", (event) => {
      const hotspot = event.target.closest(".scheme-hotspot");
      if (hotspot) showSchemeTip(hotspot);
    });
    schemeTip.closest(".scheme-building").addEventListener("click", (event) => {
      if (event.target.closest(".scheme-hotspot, .scheme-tip")) return;
      hideSchemeTip();
    });
  }

  const floorPicker = document.querySelector("[data-floor-picker]");
  const floorShape = document.querySelector("[data-floor-shape]");
  const floorLabel = document.querySelector("[data-floor-label]");
  const setFloor = (floor) => {
    if (floorLabel) floorLabel.textContent = floor;
    if (floorPicker) floorPicker.querySelectorAll("button").forEach((button) => button.classList.toggle("is-active", Number(button.textContent) === floor));
    if (floorShape) floorShape.innerHTML = Array.from({ length: 9 }, (_, index) => `<button type="button" data-open-apartment>${index % 4 === 0 ? "Забронирована" : `${(index % 3) + 1}-комнатная`}</button>`).join("");
  };
  if (floorPicker) {
    floorPicker.innerHTML = Array.from({ length: 13 }, (_, index) => 13 - index).map((floor) => `<button type="button">${floor}</button>`).join("");
    floorPicker.addEventListener("click", (event) => { if (event.target.matches("button")) setFloor(Number(event.target.textContent)); });
    setFloor(10);
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-open-apartment]")) window.location.href = "apartment.html";
  });

  const detailTabs = document.querySelectorAll("[data-detail-tab]");
  const detailPanels = document.querySelectorAll("[data-detail-panel]");
  detailTabs.forEach((button) => button.addEventListener("click", () => {
    detailTabs.forEach((item) => item.classList.toggle("is-active", item === button));
    detailPanels.forEach((panel) => { panel.hidden = panel.dataset.detailPanel !== button.dataset.detailTab; });
  }));

  const dialog = document.querySelector("[data-reservation-dialog]");
  document.querySelectorAll("[data-reserve]").forEach((button) => button.addEventListener("click", () => dialog?.showModal()));
  document.querySelectorAll("[data-dialog-close]").forEach((button) => button.addEventListener("click", () => dialog?.close()));
  document.querySelectorAll("[data-reservation-form]").forEach((form) => form.addEventListener("submit", () => {
    form.innerHTML = "<p>Заявка принята. Менеджер свяжется с вами в ближайшее время.</p>";
  }));

  document.querySelectorAll("[data-consultation-form]").forEach((form) => form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = form.querySelector("[data-form-message]");
    if (message) message.textContent = "Спасибо! Мы свяжемся с вами в ближайшее время.";
    form.reset();
  }));
  document.querySelectorAll("[data-toast]").forEach((button) => button.addEventListener("click", () => alert(button.dataset.toast)));
});
