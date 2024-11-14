export function cleanObject(obj: any) {
  return Object.keys(obj).reduce((prev, key) => {
    const val = obj[key];
    if (val === null || val === undefined || val === "") {
      delete prev[key];
    }
    return prev;
  }, obj)
}