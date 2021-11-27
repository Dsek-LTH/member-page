function groupBy<K, V, U>(dict: U[],
                          keyGetter: (U) => K,
                          valueGetter: (U) => V) {
  const map = new Map();
  dict.forEach((item) => {
        const key = keyGetter(item);
        const x = valueGetter(item);
        if (!map.has(key)) {
          map.set(key, [x]);
        } else {
          map.get(key).push(x);
        }
  });
  return map;
}

export default groupBy;