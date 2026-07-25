export type Matrix = readonly (readonly number[])[]

export class DimensionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DimensionError'
  }
}

export function rows(matrix: Matrix): number {
  return matrix.length
}

export function columns(matrix: Matrix): number {
  return matrix[0]?.length ?? 0
}

export function isRectangular(matrix: Matrix): boolean {
  const width = columns(matrix)
  return matrix.every(row => row.length === width)
}

function assertRectangular(matrix: Matrix, label: string): void {
  if (!isRectangular(matrix)) {
    throw new DimensionError(`${label} is ragged: every row must have the same length`)
  }
}

export function identity(size: number): number[][] {
  if (size < 0) throw new DimensionError(`identity size must not be negative, got ${size}`)
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, column) => (row === column ? 1 : 0))
  )
}

export function transpose(matrix: Matrix): number[][] {
  assertRectangular(matrix, 'matrix')
  return Array.from({ length: columns(matrix) }, (_, column) =>
    Array.from({ length: rows(matrix) }, (_, row) => matrix[row]![column]!)
  )
}

export function add(left: Matrix, right: Matrix): number[][] {
  assertRectangular(left, 'left')
  assertRectangular(right, 'right')
  if (rows(left) !== rows(right) || columns(left) !== columns(right)) {
    throw new DimensionError(
      `cannot add a ${rows(left)}x${columns(left)} matrix to a ${rows(right)}x${columns(right)} matrix`
    )
  }
  return left.map((row, rowIndex) => row.map((value, column) => value + right[rowIndex]![column]!))
}

export function scale(matrix: Matrix, factor: number): number[][] {
  return matrix.map(row => row.map(value => value * factor))
}

export function multiply(left: Matrix, right: Matrix): number[][] {
  assertRectangular(left, 'left')
  assertRectangular(right, 'right')
  if (columns(left) !== rows(right)) {
    throw new DimensionError(
      `cannot multiply a ${rows(left)}x${columns(left)} matrix by a ${rows(right)}x${columns(right)} matrix`
    )
  }
  const inner = columns(left)
  return Array.from({ length: rows(left) }, (_, row) =>
    Array.from({ length: columns(right) }, (_, column) => {
      let total = 0
      for (let index = 0; index < inner; index++) {
        total += left[row]![index]! * right[index]![column]!
      }
      return total
    })
  )
}

export function trace(matrix: Matrix): number {
  assertRectangular(matrix, 'matrix')
  if (rows(matrix) !== columns(matrix)) {
    throw new DimensionError(`trace requires a square matrix, got ${rows(matrix)}x${columns(matrix)}`)
  }
  return matrix.reduce((total, row, index) => total + row[index]!, 0)
}

export function format(matrix: Matrix): string {
  const cells = matrix.map(row => row.map(value => String(value)))
  const width = Math.max(0, ...cells.flat().map(cell => cell.length))
  return cells.map(row => row.map(cell => cell.padStart(width)).join(' ')).join('\n')
}
