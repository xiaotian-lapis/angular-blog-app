/**
 * Random util
 */

// generate random ID string
export function genRandomId(): string {
  return Math.random().toString(36).substring(2, 12);
}
