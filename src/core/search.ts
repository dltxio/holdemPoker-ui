export function fuzzySearch(pattern: string, source: string) {
  const hlen = source.length;
  const nlen = pattern.length;
  if (nlen > hlen) {
    return false;
  }
  if (nlen === hlen) {
    return pattern === source;
  }
  outer: for (let i = 0, j = 0; i < nlen; i++) {
    const nch = pattern.charCodeAt(i);
    while (j < hlen) {
      if (source.charCodeAt(j++) === nch) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}
