export interface Rect {
  width: number
  height: number
}

export function area(rect: Rect): number {
  return rect.width * rect.height
}

export function perimeter(rect: Rect): number {
  return 2 * (rect.width + rect.height)
}

export function scaleRect(rect: Rect, factor: number): Rect {
  return { width: rect.width * factor, height: rect.height * factor }
}

export function fits(inner: Rect, outer: Rect): boolean {
  return inner.width <= outer.width && inner.height <= outer.height
}
