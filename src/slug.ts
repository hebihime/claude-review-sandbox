export const slug = (input: string): string => input.toLowerCase().replace(/[^a-z0-9]+/g, '-')
