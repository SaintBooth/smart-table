const BASE_URL = "https://webinars.webdev.education-services.ru/sp7-api";

export function initData() {
  // кеш индексов и последнего результата
  let sellers;
  let customers;
  let lastResult;
  let lastQuery;

  // приведение записи с сервера к формату таблицы
  const mapRecords = (list) =>
    list.map((item) => ({
      id: item.receipt_id,
      date: item.date,
      seller: sellers[item.seller_id],
      customer: customers[item.customer_id],
      total: item.total_amount,
    }));

  // один раз тянем индексы (продавцы, покупатели)
  const getIndexes = async () => {
    if (!sellers || !customers) {
      [sellers, customers] = await Promise.all([
        fetch(`${BASE_URL}/sellers`).then((r) => r.json()),
        fetch(`${BASE_URL}/customers`).then((r) => r.json()),
      ]);
    }
    return { sellers, customers };
  };

  // получаем записи с сервера по query, кешируем последний запрос
  const getRecords = async (query = {}, isUpdated = false) => {
    const qs = new URLSearchParams(query).toString();

    if (lastQuery === qs && !isUpdated && lastResult) {
      return lastResult;
    }

    // индексы нужны для mapRecords
    await getIndexes();

    const response = await fetch(`${BASE_URL}/records?${qs}`);
    const json = await response.json();
    const items = Array.isArray(json.items) ? json.items : [];

    lastQuery = qs;
    lastResult = {
      total: Number.isFinite(json.total) ? json.total : items.length,
      items: mapRecords(items),
    };

    return lastResult;
  };

  return { getIndexes, getRecords };
}
