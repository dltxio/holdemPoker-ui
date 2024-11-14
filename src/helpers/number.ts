export function fixedDecimal(number: any, precisionValue: number) {
  let precision = precisionValue ? precisionValue : 2;
  return Number(Number(number).toFixed(precision));
}

export function formatNumber(value: any) {
  const val = Number(value);
  if (val === 0) return 0;
  return val?.toFixed(2).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("") || 0;
}

export function formatNumberFields(obj: any) {
  return Object.keys(obj).reduce((prev, key) => {
    const num = Number(obj[key]);
    if (!isNaN(num)) {
      prev[key] = formatNumber(num);
    }
    return prev;
  }, obj);
}