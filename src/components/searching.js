import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
  // было неверно: [rules.skipEmptyTargetValues]
  const compare = createComparison(
    ["skipEmptyTargetValues"], // <- имена правил
    rules.searchMultipleFields(
      searchField,
      ["date", "customer", "seller"],
      false
    ) // <- само правило
  );

  return (data, state /*, action */) => {
    const q = state?.[searchField];
    if (!q) return data; // пустой запрос — ничего не фильтруем
    return data.filter((row) => compare(row, state));
  };
}
