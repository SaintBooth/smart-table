// поиск через сервер; игнорирует пустые строки
export function initSearching(searchField) {
  return (query, state) => {
    const value = (state?.[searchField] ?? "").trim();
    return value ? Object.assign({}, query, { search: value }) : query;
  };
}
