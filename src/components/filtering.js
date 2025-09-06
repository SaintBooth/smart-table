export function initFiltering(elements) {
  // заполняет селекты значениями из индексов
  const updateIndexes = (controls, indexes) => {
    Object.keys(indexes).forEach((name) => {
      const selectEl = controls[name];
      if (!selectEl) return;

      const keepFirstEmpty =
        selectEl.firstElementChild &&
        selectEl.firstElementChild.tagName === "OPTION" &&
        selectEl.firstElementChild.value === "";

      selectEl.replaceChildren(
        ...(keepFirstEmpty ? [selectEl.firstElementChild.cloneNode(true)] : [])
      );

      selectEl.append(
        ...Object.values(indexes[name]).map((text) => {
          const opt = document.createElement("option");
          opt.textContent = text;
          opt.value = text;
          return opt;
        })
      );
    });
  };

  const applyFiltering = (query, state, action) => {
    // сброс значения одного поля (кнопка с data-field)
    if (action && action.name === "clear") {
      const field = action.dataset.field;
      if (field) {
        const scope =
          action.closest?.("[data-filter]") ||
          elements[field]?.closest?.("[data-filter]") ||
          action.parentElement;

        const control =
          scope?.querySelector?.(`[name="${field}"]`) || elements[field];

        if (control) control.value = "";
        if (field in state) state[field] = "";
      }
    }

    const filter = {};
    Object.keys(elements).forEach((key) => {
      const control = elements[key];
      if (!control) return;
      if (["INPUT", "SELECT"].includes(control.tagName) && control.value) {
        filter[`filter[${control.name}]`] = control.value;
      }
    });

    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query;
  };

  return { updateIndexes, applyFiltering };
}
