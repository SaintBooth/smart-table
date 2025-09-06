import { cloneTemplate } from "../lib/utils.js";

export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  // вставляем дополнительные шаблоны до/после таблицы
  before
    .slice()
    .reverse()
    .forEach((subName) => {
      root[subName] = cloneTemplate(subName);
      root.container.prepend(root[subName].container);
    });

  after.forEach((subName) => {
    root[subName] = cloneTemplate(subName);
    root.container.append(root[subName].container);
  });

  // обработчики формы и действий
  root.container.addEventListener("change", () => {
    onAction();
  });
  root.container.addEventListener("reset", () => {
    setTimeout(onAction);
  });
  root.container.addEventListener("submit", (e) => {
    e.preventDefault();
    onAction(e.submitter);
  });

  // рендерим строки на основе шаблона rowTemplate
  const render = (data) => {
    const nextRows = (data ?? []).map((item) => {
      const row = cloneTemplate(rowTemplate);

      Object.keys(item).forEach((key) => {
        const el = row.elements?.[key];
        if (!el) return;

        if (
          el instanceof HTMLInputElement ||
          el instanceof HTMLSelectElement ||
          el instanceof HTMLTextAreaElement
        ) {
          el.value = item[key];
        } else {
          el.textContent = String(item[key]);
        }
      });

      return row.container;
    });

    root.elements.rows.replaceChildren(...nextRows);
  };

  return { ...root, render };
}
