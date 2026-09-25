export function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const next = index + direction;
  if (next < 0 || next >= items.length) return items;
  const copy = items.slice();
  const current = copy[index];
  const swap = copy[next];
  if (current === undefined || swap === undefined) return items;
  copy[index] = swap;
  copy[next] = current;
  return copy;
}

export function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return items.slice().sort((a, b) => a.order - b.order);
}

export function withSequentialOrder<T extends { order: number }>(items: T[]): T[] {
  return items.map((item, index) => ({ ...item, order: index }));
}
