import { sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  // начальные значения индикаторов на колонках
  columns.forEach((c) => {
    if (!c.dataset.value) c.dataset.value = "none";
  });

  return (query, _state, action) => {
    let field = null;
    let order = "none";

    if (action && action.name === "sort" && columns.includes(action)) {
      // none -> asc -> desc -> none
      action.dataset.value = sortMap[action.dataset.value];
      field = action.dataset.field;
      order = action.dataset.value;

      // остальные сбрасываем
      columns.forEach((col) => {
        if (col !== action) col.dataset.value = "none";
      });
    } else {
      // восстанавливаем выбранный режим после перерисовок
      columns.forEach((col) => {
        if (col.dataset.value !== "none") {
          field = col.dataset.field;
          order = col.dataset.value;
        }
      });
    }

    const sort = field && order !== "none" ? `${field}:${order}` : null;
    return sort ? Object.assign({}, query, { sort }) : query;
  };
}
