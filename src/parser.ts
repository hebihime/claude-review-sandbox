export function parseDuration(input: string): number {
  const match = /^(\d+)(ms|s|m|h)$/.exec(input.trim())
  if (!match) throw new Error(`unparseable duration: ${input}`)
  const value = Number(match[1])
  switch (match[2]) {
    case 'ms': return value
    case 's': return value * 1000
    case 'm': return value * 60_000
    case 'h': return value * 3_600_000
    default: throw new Error('unreachable')
  }
}
