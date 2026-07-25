export interface RetryOptions {
  attempts: number
  baseDelayMs: number
  maxDelayMs: number
  jitter: boolean
}

export const DEFAULT_RETRY: RetryOptions = {
  attempts: 3,
  baseDelayMs: 200,
  maxDelayMs: 5_000,
  jitter: true
}

function delayFor(attempt: number, options: RetryOptions): number {
  const exponential = options.baseDelayMs * 2 ** attempt
  const capped = Math.min(exponential, options.maxDelayMs)
  return options.jitter ? capped * (0.5 + Math.random() / 2) : capped
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = DEFAULT_RETRY
): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt < options.attempts; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      await new Promise(resolve => setTimeout(resolve, delayFor(attempt, options)))
    }
  }
  throw lastError
}
