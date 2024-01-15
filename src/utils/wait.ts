/**
 * @param {number} ms - explicit time for wait
 */
export const waitFor = (ms: number) => new Promise(r => setTimeout(r, ms));